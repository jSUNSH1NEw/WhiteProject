// const { expect } = require('chai')
// const { ethers } = require('hardhat')

// describe('Waren', function () {
//   const merkleRoot =
//     '0x83cf4855b2c3c8c4e206fcba016cc84f201cd5b8b480fb6878405db4065e94ea'
//   const proofOwner = [
//     '0x7096914064585e5ac032405d8543deec25485927a47d4ff0a781316cc1edbbf3',
//   ]
//   const baseURI = 'ipfs://QmYkpa28u51JFnCjrnoaMf1LfyNiB9n5oSp6ERRQCX5eKE/'
//   const limitNFT1 = 125
//   const limitNFT2 = 200
//   const limitNFT3 = 5250
//   const limitNFT4 = 86667
//   const preSalePrice = ethers.utils.parseEther('0.00025')
//   const whitelistSalePrice = ethers.utils.parseEther('0.0005')
//   const publicSalePrice1 = ethers.utils.parseEther('0.001')
//   const publicSalePrice2 = ethers.utils.parseEther('0.0015')

//   beforeEach(async function () {
//     [owner, investor] = await ethers.getSigners() // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 et 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
//     TestTether = await hre.ethers.getContractFactory('TestTether')
//     testTether = await TestTether.deploy()
//     await testTether.deployed()
    
//     Waren = await ethers.getContractFactory('Waren')
//     waren = await Waren.deploy(testTether.address, merkleRoot, baseURI)
//     await waren.deployed()
//   })

//   // it('Event transfer', async function () {
//   //   await waren.setStep(1)
//   //   tx1 = await waren.preMint(1, { value: preSalePrice })
//   //   data = await tx1.wait()
//   //   console.log(data.events[0].args.to)
//   // })

//   // it('Différences de prix entre prémint avec transfer et sans', async function () {
//   //   await waren.setStep(1)
//   //   tx1 = await waren.preMint(1, { value: preSalePrice })
//   //   tx2 = await waren.preMintWithoutTransfer(1, { value: preSalePrice })
//   //   calcul1 = tx1.gasPrice * tx1.gasLimit
//   //   console.log(ethers.utils.formatEther(calcul1.toString()))
//   //   calcul2 = parseInt(tx2.gasPrice) * parseInt(tx2.gasLimit)
//   //   console.log(ethers.utils.formatEther(calcul2.toString()))
//   // })

//   it('SetStep setStep() Changements de steps sellingStep()', async function () {
//     step = await waren.sellingStep()
//     expect(step).to.equal(0)
//     await waren.setStep(1)
//     step = await waren.sellingStep()
//     expect(step).to.equal(1)
//     await waren.setStep(2)
//     step = await waren.sellingStep()
//     expect(step).to.equal(2)
//     await waren.setStep(3)
//     step = await waren.sellingStep()
//     expect(step).to.equal(3)
//     await waren.setStep(4)
//     step = await waren.sellingStep()
//     expect(step).to.equal(4)
//     await waren.setStep(0)
//     step = await waren.sellingStep()
//     expect(step).to.equal(0)
//   })

//   it("REVERT: setStep() Not Owner", async function () {
//     await expect(
//       waren.connect(investor).setStep(1),
//     ).to.be.revertedWith("Ownable: caller is not the owner")
//   })

//   it("REVERT: setBaseUri() Not Owner", async function () {
//     await expect(
//       waren.connect(investor).setBaseUri("toto"),
//     ).to.be.revertedWith("Ownable: caller is not the owner")
//   })

//   it("REVERT: setMerkleRoot() Not Owner", async function () {
//     await expect(
//       waren.connect(investor).setMerkleRoot("0x83cf4855b2c3c8c4e206fcba016cc84f201cd5b8b480fb6878405db4065e94ea"),
//     ).to.be.revertedWith("Ownable: caller is not the owner")
//   })

//   it("REVERT: uri() NFT doesn't exist", async function () {
//     await expect(
//       waren.connect(investor).uri(0),
//     ).to.be.revertedWith("NFT doesn't exist")
//     await expect(
//       waren.connect(investor).uri(5),
//     ).to.be.revertedWith("NFT doesn't exist")
//   })

//   it('PreMint preMint() tests argents', async function () {
//     await waren.setStep(1)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 1)
//     expect(balanceOwnerNFT).to.equal(0)
//     balanceOwnerETHBefore = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHBefore = await ethers.provider.getBalance(
//       investor.address,
//     )

//     preMint = await waren.preMint(2, { value: 2 * preSalePrice })
//     await preMint.wait() // wait until the transaction is minted
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 1)
//     expect(balanceOwnerNFT).to.equal(2)

//     balanceOwnerETHAfter = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHAfter = await ethers.provider.getBalance(investor.address)

//     expect(balanceOwnerETHBefore).to.be.gt(balanceOwnerETHAfter)
//     expect(balanceInvestorETHBefore).to.be.lt(balanceInvestorETHAfter)
//   })

//   it('REVERT: preMint() Not active', async function () {
//     await expect(waren.preMint(1, { value: preSalePrice })).to.be.revertedWith(
//       'Pre sale not active',
//     )
//   })

//   it("REVERT: preMint() Quantity between 1 & 15", async function () {
//     await waren.setStep(1)
//     await expect(waren.preMint(0, { value: preSalePrice })).to.be.revertedWith("Quantity between 1 & 15")
//     await expect(waren.preMint(16, { value: preSalePrice })).to.be.revertedWith("Quantity between 1 & 15")
//   })

//   it('REVERT: preMint() Sold out et tests de balances', async function () {
//     // Commenter le require Quantity between 1 & 15
//     await waren.setStep(1)
//     currentIdNFT = await waren.nextNFT1()
//     expect(currentIdNFT).to.equal(0)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 1)
//     expect(balanceOwnerNFT).to.equal(0)

//     await waren.preMint(120, { value: (120 * preSalePrice).toString() })
//     currentIdNFT = await waren.nextNFT1()
//     expect(currentIdNFT).to.equal(30000)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 1)
//     expect(balanceOwnerNFT).to.equal(30000)

//     await waren
//       .connect(investor)
//       .preMint(5, { value: (5 * preSalePrice).toString() })
//     currentIdNFT = await waren.nextNFT1()
//     expect(currentIdNFT).to.equal(limitNFT1)
//     balanceInvestor = await waren.balanceOf(investor.address, 1)
//     expect(balanceInvestor).to.equal(10000)

//     await expect(waren.preMint(1, { value: preSalePrice })).to.be.revertedWith(
//       'Sold out',
//     )
//   })

//   it('REVERT: preMint() Not enough money', async function () {
//     await waren.setStep(1)
//     await expect(waren.preMint(10, { value: preSalePrice })).to.be.revertedWith(
//       'Not enough funds',
//     )
//   })

//   it('WhitelistMint whitelistSaleMint() tests argents', async function () {
//     await waren.setStep(2)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 2)
//     expect(balanceOwnerNFT).to.equal(0)
//     balanceOwnerETHBefore = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHBefore = await ethers.provider.getBalance(
//       investor.address,
//     )

//     whiteMint = await waren.whitelistSaleMint(proofOwner, 2, { value: 2 * whitelistSalePrice })
//     await whiteMint.wait() // wait until the transaction is mined

//     balanceOwnerNFT = await waren.balanceOf(owner.address, 2)
//     expect(balanceOwnerNFT).to.equal(2)
//     balanceOwnerETHAfter = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHAfter = await ethers.provider.getBalance(investor.address)
//     expect(balanceOwnerETHBefore).to.be.gt(balanceOwnerETHAfter)
//     expect(balanceInvestorETHBefore).to.be.lt(balanceInvestorETHAfter)
//   })
    
//   it('REVERT: whitelistSaleMint() Not active', async function () {
//     await expect(
//       waren.whitelistSaleMint(proofOwner, 1, { value: whitelistSalePrice }),
//     ).to.be.revertedWith('Whitelist sale not active')
//   })

//   it("REVERT: whitelistSaleMint() Quantity between 1 & 15", async function () {
//     await waren.setStep(2)
//     await expect(waren.whitelistSaleMint(proofOwner, 0, { value: whitelistSalePrice })).to.be.revertedWith("Quantity between 1 & 15")
//     await expect(waren.whitelistSaleMint(proofOwner, 16, { value: whitelistSalePrice })).to.be.revertedWith("Quantity between 1 & 15")
//   })

//   it('REVERT: whitelistSaleMint() merkle access Not whitelisted', async function () {
//     await waren.setStep(2)
//     await expect(
//       waren
//         .connect(investor)
//         .whitelistSaleMint(proofOwner, 10, { value: whitelistSalePrice }),
//     ).to.be.revertedWith('Not whitelisted')
//   })

//   it('REVERT: whitelistSaleMint() Sold out et tests de balances', async function () {
//     await waren.setStep(2)
//     currentIdNFT = await waren.nextNFT2()
//     expect(currentIdNFT).to.equal(0)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 2)
//     expect(balanceOwnerNFT).to.equal(0)

//     await waren.whitelistSaleMint(proofOwner, limitNFT2, {
//       value: (limitNFT2 * whitelistSalePrice).toString(),
//     })
//     currentIdNFT = await waren.nextNFT2()
//     expect(currentIdNFT).to.equal(limitNFT2)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 2)
//     expect(balanceOwnerNFT).to.equal(limitNFT2)

//     await expect(
//       waren.whitelistSaleMint(proofOwner, 1, { value: whitelistSalePrice }),
//     ).to.be.revertedWith('Sold out')
//   })

//   it('REVERT: whitelistSaleMint() Not enough money', async function () {
//     await waren.setStep(2)
//     await expect(
//       waren.whitelistSaleMint(proofOwner, 10, { value: whitelistSalePrice }),
//     ).to.be.revertedWith('Not enough funds')
//   })

//   it('PublicSaleMint1 publicSaleMint1() tests argents', async function () {
//     await waren.setStep(3)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 3)
//     expect(balanceOwnerNFT).to.equal(0)
//     balanceOwnerETHBefore = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHBefore = await ethers.provider.getBalance(
//       investor.address,
//     )

//     publicSaleMint1 = await waren.publicSaleMint1(2, { value: 2 * publicSalePrice1 })
//     await publicSaleMint1.wait() // wait until the transaction is mined
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 3)
//     expect(balanceOwnerNFT).to.equal(2)

//     balanceOwnerETHAfter = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHAfter = await ethers.provider.getBalance(investor.address)

//     expect(balanceOwnerETHBefore).to.be.gt(balanceOwnerETHAfter)
//     expect(balanceInvestorETHBefore).to.be.lt(balanceInvestorETHAfter)
//   })

//   it('REVERT: publicSaleMint1() Not active', async function () {
//     await expect(waren.publicSaleMint1(1, { value: publicSalePrice1 })).to.be.revertedWith(
//       'Public sale 1 not active',
//     )
//   })

//   it("REVERT: publicSaleMint1() Quantity between 1 & 15", async function () {
//     await waren.setStep(3)
//     await expect(waren.publicSaleMint1(0, { value: publicSalePrice1 })).to.be.revertedWith("Quantity between 1 & 15")
//     await expect(waren.publicSaleMint1(16, { value: publicSalePrice1 })).to.be.revertedWith("Quantity between 1 & 15")
//   })

//   it('REVERT: publicSaleMint1() Sold out et tests de balances', async function () {
//     await waren.setStep(3)
//     currentIdNFT = await waren.nextNFT3()
//     expect(currentIdNFT).to.equal(0)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 3)
//     expect(balanceOwnerNFT).to.equal(0)

//     await waren.publicSaleMint1(1500, { value: (1500 * publicSalePrice1).toString() })
//     currentIdNFT = await waren.nextNFT3()
//     expect(currentIdNFT).to.equal(1500)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 3)
//     expect(balanceOwnerNFT).to.equal(1500)

//     await waren
//       .connect(investor)
//       .publicSaleMint1(500, { value: (500 * publicSalePrice1).toString() })
//     currentIdNFT = await waren.nextNFT3()
//     expect(currentIdNFT).to.equal(limitNFT3)
//     balanceInvestor = await waren.balanceOf(investor.address, 3)
//     expect(balanceInvestor).to.equal(500)

//     await expect(waren.publicSaleMint1(1, { value: publicSalePrice1 })).to.be.revertedWith(
//       'Sold out',
//     )
//   })

//   it('REVERT: publicSaleMint1() Not enough money', async function () {
//     await waren.setStep(3)
//     await expect(waren.publicSaleMint1(10, { value: publicSalePrice1 })).to.be.revertedWith(
//       'Not enough funds',
//     )
//   })

//   it('PublicSaleMint2 publicSaleMint2() tests argents', async function () {
//     await waren.setStep(4)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 4)
//     expect(balanceOwnerNFT).to.equal(0)
//     balanceOwnerETHBefore = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHBefore = await ethers.provider.getBalance(
//       investor.address,
//     )

//     publicSaleMint2 = await waren.publicSaleMint2(2, { value: 2 * publicSalePrice2 })
//     await publicSaleMint2.wait() // wait until the transaction is mined
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 4)
//     expect(balanceOwnerNFT).to.equal(2)

//     balanceOwnerETHAfter = await ethers.provider.getBalance(owner.address)
//     balanceInvestorETHAfter = await ethers.provider.getBalance(investor.address)

//     expect(balanceOwnerETHBefore).to.be.gt(balanceOwnerETHAfter)
//     expect(balanceInvestorETHBefore).to.be.lt(balanceInvestorETHAfter)
//   })

//   it('REVERT: publicSaleMint2() Not active', async function () {
//     await expect(waren.publicSaleMint2(1, { value: publicSalePrice2 })).to.be.revertedWith(
//       'Public sale 2 not active',
//     )
//   })

//   it("REVERT: publicSaleMint2() Quantity between 1 & 15", async function () {
//     await waren.setStep(4)
//     await expect(waren.publicSaleMint2(0, { value: publicSalePrice2 })).to.be.revertedWith("Quantity between 1 & 15")
//     await expect(waren.publicSaleMint2(16, { value: publicSalePrice2 })).to.be.revertedWith("Quantity between 1 & 15")
//   })

//   it('REVERT: publicSaleMint2() Sold out et tests de balances', async function () {
//     await waren.setStep(4)
//     currentIdNFT = await waren.nextNFT4()
//     expect(currentIdNFT).to.equal(0)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 4)
//     expect(balanceOwnerNFT).to.equal(0)

//     await waren.publicSaleMint2(1500, { value: (1500 * publicSalePrice2).toString() })
//     currentIdNFT = await waren.nextNFT4()
//     expect(currentIdNFT).to.equal(1500)
//     balanceOwnerNFT = await waren.balanceOf(owner.address, 4)
//     expect(balanceOwnerNFT).to.equal(1500)

//     await waren
//       .connect(investor)
//       .publicSaleMint2(500, { value: (500 * publicSalePrice2).toString() })
//     currentIdNFT = await waren.nextNFT4()
//     expect(currentIdNFT).to.equal(limitNFT3)
//     balanceInvestor = await waren.balanceOf(investor.address, 4)
//     expect(balanceInvestor).to.equal(500)

//     await expect(waren.publicSaleMint2(1, { value: publicSalePrice2 })).to.be.revertedWith(
//       'Sold out',
//     )
//   })

//   it('REVERT: publicSaleMint2() Not enough money', async function () {
//     await waren.setStep(4)
//     await expect(waren.publicSaleMint2(10, { value: publicSalePrice2 })).to.be.revertedWith(
//       'Not enough funds',
//     )
//   })

//   it("Gift gift()", async function () {
//     balanceInvestorNFT = await waren.balanceOf(investor.address, 1)
//     expect(balanceInvestorNFT).to.equal(0)
//     await waren.gift(investor.address, 10, 1)
//     balanceInvestorNFT = await waren.balanceOf(investor.address, 1)
//     expect(balanceInvestorNFT).to.equal(10)
//     currentIdNFT = await waren.nextNFT1()
//     expect(currentIdNFT).to.equal(10)

//     balanceInvestorNFT = await waren.balanceOf(investor.address, 2)
//     expect(balanceInvestorNFT).to.equal(0)
//     await waren.gift(investor.address, 10, 2)
//     balanceInvestorNFT = await waren.balanceOf(investor.address, 2)
//     expect(balanceInvestorNFT).to.equal(10)
//     currentIdNFT = await waren.nextNFT2()
//     expect(currentIdNFT).to.equal(10)

//     balanceInvestorNFT = await waren.balanceOf(investor.address, 3)
//     expect(balanceInvestorNFT).to.equal(0)
//     await waren.gift(investor.address, 10, 3)
//     balanceInvestorNFT = await waren.balanceOf(investor.address, 3)
//     expect(balanceInvestorNFT).to.equal(10)
//     currentIdNFT = await waren.nextNFT3()
//     expect(currentIdNFT).to.equal(10)

//     balanceInvestorNFT = await waren.balanceOf(investor.address, 4)
//     expect(balanceInvestorNFT).to.equal(0)
//     await waren.gift(investor.address, 10, 4)
//     balanceInvestorNFT = await waren.balanceOf(investor.address, 4)
//     expect(balanceInvestorNFT).to.equal(10)
//     currentIdNFT = await waren.nextNFT4()
//     expect(currentIdNFT).to.equal(10)
//   })

//   it("REVERT: gift() Not Owner", async function () {
//     await expect(
//       waren.connect(investor).gift(investor.address, 10, 1),
//     ).to.be.revertedWith("Ownable: caller is not the owner")
//   })

//   it("REVERT: gift() NFT doesn't exist", async function () {
//     await expect(
//       waren.gift(investor.address, 10, 0),
//     ).to.be.revertedWith("NFT doesn't exist")
//     await expect(
//       waren.gift(investor.address, 10, 5),
//     ).to.be.revertedWith("NFT doesn't exist")
//   })

//   it("REVERT: gift() NFT Sold out", async function () {
//     await expect(
//       waren.gift(investor.address, 1+limitNFT1, 1),
//     ).to.be.revertedWith("Sold out")

//     await expect(
//       waren.gift(investor.address, 1+limitNFT2, 2),
//     ).to.be.revertedWith("Sold out")

//     await expect(
//       waren.gift(investor.address, 1+limitNFT3, 3),
//     ).to.be.revertedWith("Sold out")

//     await expect(
//       waren.gift(investor.address, 1+limitNFT4, 4),
//     ).to.be.revertedWith("Sold out")
//   })
// })
