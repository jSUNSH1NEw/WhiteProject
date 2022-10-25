// const { expect } = require('chai')
// const { ethers } = require('hardhat')

// function addDays(days) {
//   return days * 24 * 60 * 60
// }

// maxTotalSupply = ethers.utils.parseEther((2e8).toString())
// balanceDeployVesting = ethers.utils.parseEther((1e8).toString())
// maxRewardsPreSales = 40000
// maxRewardsWhitelist = 1200
// maxRewardsPublicSale1 = 5714
// maxRewardsPublicSale2 = 750

// const baseURI = 'ipfs://QmYkpa28u51JFnCjrnoaMf1LfyNiB9n5oSp6ERRQCX5eKE/'
// const root =
//   '0x64ff0ae99564eba0685d74c5c85f96c18ee076339fb6991668b30f44644cc7ae'

// const proofInvestor = [
//   '0x03d2685a1fe98e357ac5bce675e59ab5e14cbeb6f3f0b649bef2f315f6fa12f0',
//   '0x214a63b6d89a4a98d8d82d47e3c3559e33c13b386d6c23e612a58a342a3a53d2',
//   '0xfb0d8dcac1e39fd01f65c75a95a5d01f00a9f02fb18efec8b5aa4bbad330bc62',
//   '0x8483689ce3297e8572635d1af26b50b8689c45e98d8a929bacdf407d07b02ce0',
//   '0xa1009e2fbb8e4bf6577498a5c0c58d2bb45ecbd30237e90ff0101eb076fab0ac',
//   '0x11b29064ac8581c47e8b4b4eb8d2b83eba5033f6bb583a7e5faeaefaab5d7ecd',
// ]

// // // !!!!!!!! Desactiver les requires msg.value de waren1155 !!!!!!!!
// describe('VESTING WAREN TESTS', function () {
//   beforeEach(async function () {
//     ;[owner, investor] = await ethers.getSigners() // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 et 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
//     WarenERC1155 = await ethers.getContractFactory('TESTS_Waren')
//     warenERC1155 = await WarenERC1155.deploy(root, baseURI)
//     await warenERC1155.deployed()

//     Vesting = await ethers.getContractFactory('TESTS_WarenVestingERC1155')
//     warenVesting = await Vesting.deploy(warenERC1155.address)
//     await warenVesting.deployed()

//     WarenERC20 = await hre.ethers.getContractFactory('WarenERC20')
//     warenERC20 = await WarenERC20.deploy(warenVesting.address)
//     await warenERC20.deployed()

//     // // Owner et investor donnent l'autorisation au Vesting de transferer leurs NFT
//     await warenERC1155.setApprovalForAll(warenVesting.address, true)
//     await warenERC1155
//       .connect(investor)
//       .setApprovalForAll(warenVesting.address, true)

//     await warenERC1155.setStep(1)
//     await warenERC1155.setPaused()
//     await warenVesting.setWarenERC20(warenERC20.address)
//     await warenVesting.setPause()
//   })

//   it('Stake and Unstake Owned NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     balanceInvestorNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceInvestorNFT).to.equal(5)


//     await warenVesting.connect(investor).stakeERC1155(1, 2)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(3)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(2)
//     await warenVesting.connect(investor).stakeERC1155(1, 1)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(2)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(3)

//     getStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getAllStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getAllStakedERC1155(investor.address)

//     expect(getStakedERC1155Investor[0].amount).to.equal(2)
//     expect(getStakedERC1155Investor[1].amount).to.equal(1)
//     expect(getAllStakedERC1155Investor.length).to.equal(1)

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//     ])

//     await warenVesting.connect(investor).unstakeERC1155(1, 1)

//     expect(
//       await warenERC1155.connect(investor).balanceOf(investor.address, 1),
//     ).to.equal(3)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(2)

//     expect(await warenERC20.balanceOf(investor.address)).to.equal(
//       ethers.utils.parseEther(maxRewardsPreSales.toString()),
//     )
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal(
//       balanceDeployVesting.sub(
//         ethers.utils.parseEther(maxRewardsPreSales.toString()),
//       ),
//     )

//     getStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getAllStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getAllStakedERC1155(investor.address)

//     expect(getStakedERC1155Investor[0].amount).to.equal(2)
//     expect(getStakedERC1155Investor[1]).to.equal(undefined)
//     expect(getAllStakedERC1155Investor.length).to.equal(1)

//     await warenVesting.connect(investor).unstakeERC1155(1, 0)

//     expect(
//       await warenERC1155.connect(investor).balanceOf(investor.address, 1),
//     ).to.equal(5)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(0)

//     expect(await warenERC20.balanceOf(investor.address)).to.equal(
//       ethers.utils.parseEther((maxRewardsPreSales * 3).toString()),
//     )
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal(
//       balanceDeployVesting.sub(
//         ethers.utils.parseEther((maxRewardsPreSales * 3).toString()),
//       ),
//     )

//     getStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getAllStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getAllStakedERC1155(investor.address)

//     expect(getStakedERC1155Investor[0]).to.equal(undefined)
//     expect(getStakedERC1155Investor[1]).to.equal(undefined)
//     expect(getAllStakedERC1155Investor.length).to.equal(0)
//   })

//   it("Stake NonExistant ERC 1155, NFT doesn't exists", async function () {
//     await expect(
//       warenVesting.connect(investor).stakeERC1155(10, 5),
//     ).to.be.revertedWith("NFT doesn't exists")

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 10)

//     expect(getStakedErc1155.length).to.equal(0)
//   })

//   it('Stake Already Staked ERC 1155, Not owner', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenVesting.connect(investor).stakeERC1155(1, 5)

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155[0].amount).to.equal(5)

//     await expect(
//       warenVesting.connect(investor).stakeERC1155(1, 5),
//     ).to.be.revertedWith('Not owner')

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)

//     expect(getStakedErc1155[0].amount).to.equal(5)
//   })

//   it('Unstake Unowned ERC 1155, No NFT staked', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenVesting.connect(investor).stakeERC1155(1, 5)

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155[0].amount).to.equal(5)

//     await expect(warenVesting.unstakeERC1155(1, 5)).to.be.revertedWith(
//       'No NFT staked',
//     )

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155[0].amount).to.equal(5)
//   })

//   it('Unstake Nonexistant ERC 1155', async function () {
//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(getStakedErc1155.length).to.equal(0)

//     await expect(warenVesting.unstakeERC1155(4, 1)).to.be.revertedWith(
//       'No NFT staked',
//     )

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(getStakedErc1155.length).to.equal(0)
//   })

//   it('Unstake Unstaked ERC 1155', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenVesting.connect(investor).stakeERC1155(1, 5)
//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155[0].amount).to.equal(5)

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])
//     await warenVesting.connect(investor).unstakeERC1155(1, 0)

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155.length).to.equal(0)

//     await expect(
//       warenVesting.connect(investor).unstakeERC1155(1, 0),
//     ).to.be.revertedWith('No NFT staked')

//     getStakedErc1155 = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(getStakedErc1155.length).to.equal(0)
//   })

//   it('Batch Stake Owned ERC 1155', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(5)

//     await warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 5])

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(0)
//     expect(erc1155BBalance).to.equal(0)
//   })

//   it('Batch Stake Unowned ERC 1155, Not owner', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 2)
//     erc1155CBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)
//     expect(erc1155CBalance).to.equal(5)

//     await expect(
//       warenVesting.batchStakeERC1155([1, 2, 3], [5, 5, 5]),
//     ).to.be.revertedWith('Not owner')

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 2)
//     erc1155CBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)
//     expect(erc1155CBalance).to.equal(5)
//   })

//   it('Batch Stake Already Staked ERC 1155', async function () {
//     await warenERC1155.connect(investor).goldPassMint(10)
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(10)
//     expect(erc1155BBalance).to.equal(5)

//     await warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 5])

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)

//     await expect(
//       warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 2]),
//     ).to.be.revertedWith('Not owner')

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)
//   })

//   it('Batch Unstake Owned ERC 1155', async function () {
//     await warenERC1155.connect(investor).goldPassMint(10)
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)

//     await warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 5])

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)

//     getStakedErc1155A = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getStakedErc1155B = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(getStakedErc1155A[0].amount).to.equal(5)
//     expect(getStakedErc1155B[0].amount).to.equal(5)

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(68))),
//     ])
//     await warenVesting.connect(investor).batchUnstakeERC1155([1, 3], [0, 0])

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(10)
//     expect(erc1155BBalance).to.equal(5)

//     getStakedErc1155A = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getStakedErc1155B = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(getStakedErc1155A.length).to.equal(0)
//     expect(getStakedErc1155B.length).to.equal(0)
//   })

//   it('Batch Unstake Unowned ERC 1155', async function () {
//     await expect(
//       warenVesting.connect(investor).batchUnstakeERC1155([3, 1, 2], [0, 0, 0]),
//     ).to.be.revertedWith('No NFT staked')
//   })

//   it('Batch Unstake Already Staked ERC 1155', async function () {
//     await warenERC1155.connect(investor).goldPassMint(10)
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)

//     await warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 5])

//     erc1155ABalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     erc1155BBalance = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 3)
//     expect(erc1155ABalance).to.equal(5)
//     expect(erc1155BBalance).to.equal(0)

//     getStakedErc1155A = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getStakedErc1155B = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(getStakedErc1155A[0].amount).to.equal(5)
//     expect(getStakedErc1155B[0].amount).to.equal(5)

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(100))),
//     ])
//     await warenVesting.connect(investor).batchUnstakeERC1155([1, 3], [0, 0])

//     await expect(
//       warenVesting.connect(investor).batchUnstakeERC1155([1, 3], [0, 0]),
//     ).to.be.revertedWith('No NFT staked')
//   })

//   it('ClaimRewards Owned NFT#1 sur différentes périodes', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     balanceInvestorNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceInvestorNFT).to.equal(5)

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted

//     await warenVesting.connect(investor).stakeERC1155(1, 2)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(3)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(2)
//     await warenVesting.connect(investor).stakeERC1155(1, 1)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(2)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(3)

//     getStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getAllStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getAllStakedERC1155(investor.address)

//     expect(getStakedERC1155Investor[0].amount).to.equal(2)
//     expect(getStakedERC1155Investor[1].amount).to.equal(1)
//     expect(getAllStakedERC1155Investor.length).to.equal(1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // claimRewards après 1 mois écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(2*maxRewardsPreSales*10)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*10) // 10%

//     // claimRewards après 6 mois et demi écoulés
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(200)))
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(2*maxRewardsPreSales*15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(2*maxRewardsPreSales*15)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*25) // 10% + 15 %

//     // claimRewards après 9 mois et demi écoulés
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(295)))
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(2*maxRewardsPreSales*45)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(2*maxRewardsPreSales*45)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*70) // 10% + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 1 an écoulé
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(2*maxRewardsPreSales*30)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(2*maxRewardsPreSales*30)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*100)
//   })

//   it('ClaimRewards Unowned/Nonexistant', async function () {
//     await warenERC1155.goldPassMint(5)
//     await warenVesting.stakeERC1155(1, 5)

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(owner.address, 1, 0)
//     expect(getRewards).to.equal(5*maxRewardsPreSales*10)
//     await expect(
//       warenVesting.connect(investor).claimRewards(1, 0),
//     ).to.be.revertedWith('No NFT staked')
//   })

//   it('ClaimRewards already claimed NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenVesting.connect(investor).stakeERC1155(1, 2)

//     // claimRewards après 1 an écoulé
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(2*maxRewardsPreSales*100)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(2*maxRewardsPreSales*100)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*100)

//     // tentative de claimRewards de nouveau sans changer le temps
//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*100)

//     // tentative de retrait de nouveau dans le futur, 2 ans écoulés
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(730))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(2*maxRewardsPreSales*100)
//   })

//   it('Check rewards, unstake stake then claimRewards NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted

//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // unstake après 7 mois et demi écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(225))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*40)

//     unstakeERC1155 = await warenVesting.connect(investor).unstakeERC1155(1, 0)
//     unstakeERC1155 = await unstakeERC1155.wait()
//     expect(unstakeERC1155.events[1].args.rewards).to.equal(maxRewardsPreSales*40) // 10% + 15 % + 15 %

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0]).to.equal(undefined)

//     // On stake de nouveau
//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // claimRewards après 1 an écoulé
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))), // 365-225=140, 140/30=4.6 mois écoulé
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*10)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(maxRewardsPreSales*10) // 10% car moins de 6 mois écoulés

//     // claimRewards de nouveau
//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal('0')
//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)
//   })

//   it('Check rewards, claimRewards then unstake NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted

//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // claimRewards après 7 mois et demi écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(225))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*40)

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(maxRewardsPreSales*40) // 10% + 15 % + 15 %

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsPreSales*40)

//     // unstake après 1 an écoulé
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*60)

//     unstakeERC1155 = await warenVesting.connect(investor).unstakeERC1155(1, 0)
//     unstakeERC1155 = await unstakeERC1155.wait()
//     expect(unstakeERC1155.events[1].args.rewards).to.equal(maxRewardsPreSales*60)

//     // tentative de claimRewards après unstake
//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted
//     await expect(
//       warenVesting.connect(investor).claimRewards(1, 0),
//     ).to.be.revertedWith('No NFT staked')
//   })

//   it('Check rewards with unstake, Owned NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     balanceInvestorNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceInvestorNFT).to.equal(5)

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted

//     await warenVesting.connect(investor).stakeERC1155(1, 2)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(3)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(2)
//     await warenVesting.connect(investor).stakeERC1155(1, 1)
//     balanceNFT = await warenERC1155
//       .connect(investor)
//       .balanceOf(investor.address, 1)
//     expect(balanceNFT).to.equal(2)
//     expect(
//       await warenERC1155.connect(investor).balanceOf(warenVesting.address, 1),
//     ).to.equal(3)

//     getStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     getAllStakedERC1155Investor = await warenVesting
//       .connect(investor)
//       .getAllStakedERC1155(investor.address)

//     expect(getStakedERC1155Investor[0].amount).to.equal(2)
//     expect(getStakedERC1155Investor[1].amount).to.equal(1)
//     expect(getAllStakedERC1155Investor.length).to.equal(1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[1].alreadyClaimed).to.equal('0')

//     // unstake après 10 mois et demi écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(325)))
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 1)
//     expect(getRewards).to.equal(maxRewardsPreSales*85)

//     unstakeERC1155 = await warenVesting.connect(investor).unstakeERC1155(1, 1)
//     unstakeERC1155 = await unstakeERC1155.wait()
//     expect(unstakeERC1155.events[1].args.rewards).to.equal(maxRewardsPreSales*85) // 10% + 15 % + 15 % + 15 % + 15 % + 15 %

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[1]).to.equal(undefined)

//     // tentative de claimRewards après unstake
//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 1),
//     ).to.be.reverted
//     await expect(
//       warenVesting.connect(investor).claimRewards(1, 1),
//     ).to.be.revertedWith('Out of bounds token index')
//   })

//   it('Check rewards with unstake, stake then unstake NFT#1', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted

//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // unstake après 7 mois et demi écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(225))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*40)

//     unstakeERC1155 = await warenVesting.connect(investor).unstakeERC1155(1, 0)
//     unstakeERC1155 = await unstakeERC1155.wait()
//     expect(unstakeERC1155.events[1].args.rewards).to.equal(maxRewardsPreSales*40) // 10% + 15 % + 15 %

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0]).to.equal(undefined)

//     // On stake de nouveau
//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // unstake après 1 an écoulé
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))), // 365-225=140, 140/30=4.6 mois écoulé
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales*10)

//     unstakeERC1155 = await warenVesting.connect(investor).unstakeERC1155(1, 0)
//     unstakeERC1155 = await unstakeERC1155.wait()
//     expect(unstakeERC1155.events[1].args.rewards).to.equal(maxRewardsPreSales*10) // 10% car moins de 6 mois écoulés

//     await expect(
//       warenVesting.connect(investor).getRewards(investor.address, 1, 0),
//     ).to.be.reverted
//     await expect(
//       warenVesting.connect(investor).claimRewards(1, 0),
//     ).to.be.revertedWith('No NFT staked')
//   })

//   it('claimRewards, NFT#1 tous les retraits possibles (chaque mois)', async function () {
//     await warenERC1155.connect(investor).goldPassMint(5)
//     await warenVesting.connect(investor).stakeERC1155(1, 1)

//     // claimRewards après 1 mois écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (10))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (10),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (10),
//     ) // 10%

//     // claimRewards après 3 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(90))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0) // 0%

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (10),
//     )

//     // claimRewards après 6 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(180))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (25),
//     ) // 10% + 15 %

//     // claimRewards après 7 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(210))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (40),
//     ) // 10% + 15 % + 15 %

//     // claimRewards après 8 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(240))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (55),
//     ) // 10% + 15 % + 15 % + 15 %

//     // claimRewards après 9 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(270))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (70),
//     ) // 10% + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 10 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(300))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPreSales * (85),
//     ) // 10% + 15 % + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 11 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(330))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal(maxRewardsPreSales * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPreSales * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsPreSales * 100)

//     // claimRewards après 1 an
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(360))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 1, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(1, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 1)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsPreSales * 100)

//     // Test supplémentaire de burn, histoire de
//     expect(await warenERC20.totalSupply()).to.equal(maxTotalSupply)
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal(
//       balanceDeployVesting.sub(ethers.utils.parseEther(maxRewardsPreSales.toString())),
//     )
//     await warenVesting.burnExcededSupplyERC20()
//     expect(await warenERC20.totalSupply()).to.equal(maxTotalSupply.sub(balanceDeployVesting.sub(ethers.utils.parseEther(maxRewardsPreSales.toString()))))
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal("0")
//   })

//   it('claimRewards, NFT#2 tous les retraits possibles (chaque mois)', async function () {
//     await warenERC1155.connect(investor).whitelistSaleMint(proofInvestor, 5)
//     await warenVesting.connect(investor).stakeERC1155(2, 1)

//     // claimRewards après 1 mois écoulés
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (10))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (10),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (10),
//     ) // 10%

//     // claimRewards après 3 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(90))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0) // 0%

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (10),
//     )

//     // claimRewards après 6 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(180))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (25),
//     ) // 10% + 15 %

//     // claimRewards après 7 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(210))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (40),
//     ) // 10% + 15 % + 15 %

//     // claimRewards après 8 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(240))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (55),
//     ) // 10% + 15 % + 15 % + 15 %

//     // claimRewards après 9 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(270))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (70),
//     ) // 10% + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 10 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(300))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsWhitelist * (85),
//     ) // 10% + 15 % + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 11 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(330))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal(maxRewardsWhitelist * (15))

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsWhitelist * (15),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsWhitelist * 100)

//     // claimRewards après 1 an
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(360))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 2, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(2, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 2)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsWhitelist * 100)
//   })

//   it('claimRewards, NFT#3 tous les retraits possibles (chaque mois)', async function () {
//     await warenERC1155.setStep(2)
//     await warenERC1155.connect(investor).publicSaleMint1(5)
//     await warenVesting.connect(investor).stakeERC1155(3, 1)

//     // claimRewards après 1 mois écoulé
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0) // 0%

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // claimRewards après 3 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(90))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     ) // 15%

//     // claimRewards après 4 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(120))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (30)),
//     ) // 15% + 15 %

//     // claimRewards après 5 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(150))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (45)),
//     ) // 15% + 15 % + 15 %

//     // claimRewards après 6 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(180))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (60)),
//     ) // 15% + 15 % + 15 % + 15 %

//     // claimRewards après 7 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(210))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (75)),
//     ) // 15% + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 8 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(240))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(Math.floor(maxRewardsPublicSale1 * (15)))

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (15)),
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (90)),
//     ) // 15% + 15 % + 15 % + 15 % + 15 % + 15 %

//     // claimRewards après 9 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(270))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (10)),
//     ) // +1 nécessaire, dû aux arrondis de solidity

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       Math.floor(maxRewardsPublicSale1 * (10)),
//     ) // +1 nécessaire, dû aux arrondis de solidity

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsPublicSale1 * 100)

//     // claimRewards après 1 an
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(360))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 3, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(3, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 3)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(maxRewardsPublicSale1 * 100)
//   })

//   it('claimRewards, NFT#4 tous les retraits possibles (chaque mois)', async function () {
//     await warenERC1155.setStep(3)
//     await warenERC1155.connect(investor).publicSaleMint2(5)
//     await warenVesting.connect(investor).stakeERC1155(4, 1)

//     // claimRewards avant 1 mois écoulé
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(15))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0) // 0%

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal('0')

//     // claimRewards après 1 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(30))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 15,
//     ) // 15%

//     // claimRewards après 2 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(60))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 30,
//     ) // 15% + 15%

//     // claimRewards après 3 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(90))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 45,
//     ) // 15% + 15% + 15%

//     // claimRewards après 4 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(120))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 60,
//     ) // 15% + 15 % + 15% + 15%

//     // claimRewards après 5 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(150))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 75,
//     ) // 15% + 15 % + 15 % + 15% + 15%

//     // claimRewards après 6 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(180))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 15)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 15,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 90,
//     ) // 15% + 15 % + 15 % + 15 % + 15% + 15%

//     // claimRewards après 7 mois
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(210))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal(maxRewardsPublicSale2 * 10)

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events[1].args.rewards).to.equal(
//       maxRewardsPublicSale2 * 10,
//     )

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 100,
//     )

//     // claimRewards après 1 an
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(360))),
//     ])

//     getRewards = await warenVesting
//       .connect(investor)
//       .getRewards(investor.address, 4, 0)
//     expect(getRewards).to.equal('0')

//     claimRewards = await warenVesting.connect(investor).claimRewards(4, 0)
//     claimRewards = await claimRewards.wait()
//     expect(claimRewards.events.length).to.equal(0)

//     alreadyClaimed = await warenVesting
//       .connect(investor)
//       .getStakedERC1155(investor.address, 4)
//     expect(alreadyClaimed[0].alreadyClaimed).to.equal(
//       maxRewardsPublicSale2 * 100,
//     )
//   })

//   // ~~~~~~~~~~~~~~~~~~~~~~~~~~ CLASSIQUES ~~~~~~~~~~~~~~~~~~~~~~~~~~//

//   it('setWarenERC20() Activation et desactivation de la pause', async function () {
//     addressWarenERC20 = await warenVesting.warenERC20()
//     expect(addressWarenERC20).to.equal(warenERC20.address)
//     await warenVesting.setWarenERC20(
//       '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
//     )
//     addressWarenERC20 = await warenVesting.warenERC20()
//     expect(addressWarenERC20).to.equal(
//       '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
//     )
//   })

//   it('REVERT: setWarenERC20() Not Owner', async function () {
//     await expect(
//       warenVesting
//         .connect(investor)
//         .setWarenERC20('0x90F79bf6EB2c4f870365E785982E1f101E93b906'),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   it('setPause() Activation et desactivation de la pause', async function () {
//     pause = await warenVesting.notPaused()
//     expect(pause).to.equal(true)
//     await warenVesting.setPause()
//     pause = await warenVesting.notPaused()
//     expect(pause).to.equal(false)
//   })

//   it('REVERT: setPause() Not Owner', async function () {
//     await expect(warenVesting.connect(investor).setPause()).to.be.revertedWith(
//       'Ownable: caller is not the owner',
//     )
//   })

//   it('setUnlockPeriod() Modification de la durée minimale de staking', async function () {
//     stakingMinimalUnlock = await warenVesting.stakingMinimalUnlock()
//     expect(stakingMinimalUnlock).to.equal(86400)
//     await warenVesting.setUnlockPeriod(60)
//     stakingMinimalUnlock = await warenVesting.stakingMinimalUnlock()
//     expect(stakingMinimalUnlock).to.equal(60)
//     await warenVesting.setUnlockPeriod(3600)
//     stakingMinimalUnlock = await warenVesting.stakingMinimalUnlock()
//     expect(stakingMinimalUnlock).to.equal(3600)
//   })

//   it('REVERT: setUnlockPeriod() Not Owner', async function () {
//     await expect(
//       warenVesting.connect(investor).setUnlockPeriod(60),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   describe('stakeERC1155', function () {
//     it('REVERT: stakeERC1155(), Staking unavailable for the moment', async function () {
//       await warenVesting.setPause()
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(1, 0),
//       ).to.be.revertedWith('Staking unavailable for the moment')
//     })

//     it('REVERT: stakeERC1155(), Limit min 1', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(1, 0),
//       ).to.be.revertedWith('Limit min 1')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(0)
//     })

//     it("REVERT: stakeERC1155(), NFT doesn't exists", async function () {
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(10, 5),
//       ).to.be.revertedWith("NFT doesn't exists")
//     })

//     it('REVERT: stakeERC1155(), Vesting Gold and Whitelist is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//       ])
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(1, 5),
//       ).to.be.revertedWith('Vesting Gold and Whitelist is finished')
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(2, 5),
//       ).to.be.revertedWith('Vesting Gold and Whitelist is finished')
//     })

//     it('REVERT: stakeERC1155(), Vesting Public Sale 1 is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(305))),
//       ])
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(3, 5),
//       ).to.be.revertedWith('Vesting Public Sale 1 is finished')
//     })

//     it('REVERT: stakeERC1155(), Vesting Public Sale 2 is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(244))),
//       ])
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(4, 5),
//       ).to.be.revertedWith('Vesting Public Sale 2 is finished')
//     })

//     it('REVERT: stakeERC1155(), Not owner', async function () {
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(1, 5),
//       ).to.be.revertedWith('Not owner')
//     })

//     it('REVERT: stakeERC1155(), ERC1155: insufficient balance for transfer', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await expect(
//         warenVesting.connect(investor).stakeERC1155(1, 6),
//       ).to.be.revertedWith('ERC1155: insufficient balance for transfer')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(0)
//     })
//   })

//   describe('batchStakeERC1155', function () {
//     it('REVERT: batchStakeERC1155(), Ids and amounts length mismatch', async function () {
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 2, 2], [5, 1]),
//       ).to.be.revertedWith('Ids and amounts length mismatch')
//     })

//     it('REVERT: batchStakeERC1155(), Staking unavailable for the moment', async function () {
//       await warenVesting.setPause()
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 2], [5, 0]),
//       ).to.be.revertedWith('Staking unavailable for the moment')
//     })

//     it('REVERT: batchStakeERC1155(), Limit min 1', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenERC1155.setStep(2)
//       await warenERC1155.connect(investor).publicSaleMint1(5)

//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 0]),
//       ).to.be.revertedWith('Limit min 1')

//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 3], [0, 0]),
//       ).to.be.revertedWith('Limit min 1')

//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 3], [0, 5]),
//       ).to.be.revertedWith('Limit min 1')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       getStakedErc11552 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 2)
//       expect(getStakedErc1155.length).to.equal(0)
//       expect(getStakedErc11552.length).to.equal(0)
//     })

//     it("REVERT: batchStakeERC1155(), NFT doesn't exists", async function () {
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([10, 2], [5, 1]),
//       ).to.be.revertedWith("NFT doesn't exists")
//     })

//     it('REVERT: batchStakeERC1155(), Vesting Gold and Whitelist is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//       ])
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 2], [5, 1]),
//       ).to.be.revertedWith('Vesting Gold and Whitelist is finished')
//     })

//     it('REVERT: batchStakeERC1155(), Vesting Public Sale 1 is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(305))),
//       ])
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([3, 2], [5, 1]),
//       ).to.be.revertedWith('Vesting Public Sale 1 is finished')
//     })

//     it('REVERT: batchStakeERC1155(), Vesting Public Sale 2 is finished', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(244))),
//       ])
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([4, 1], [5, 1]),
//       ).to.be.revertedWith('Vesting Public Sale 2 is finished')
//     })

//     it('REVERT: batchStakeERC1155(), Not owner', async function () {
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 2], [5, 1]),
//       ).to.be.revertedWith('Not owner')
//     })

//     it('REVERT: batchStakeERC1155(), ERC1155: insufficient balance for transfer', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenERC1155.setStep(2)
//       await warenERC1155.connect(investor).publicSaleMint1(5)
//       await expect(
//         warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 10]),
//       ).to.be.revertedWith('ERC1155: insufficient balance for transfer')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(0)
//     })
//   })

//   describe('claimRewards', function () {
//     it('REVERT: claimRewards(), Unstaking and Rewards unavailable for the moment', async function () {
//       await warenVesting.setPause()
//       await expect(
//         warenVesting.connect(investor).claimRewards(1, 0),
//       ).to.be.revertedWith('Unstaking and Rewards unavailable for the moment')
//     })

//     it("REVERT: claimRewards(), NFT doesn't exists", async function () {
//       await expect(
//         warenVesting.connect(investor).claimRewards(14, 0),
//       ).to.be.revertedWith("NFT doesn't exists")
//     })

//     it('REVERT: claimRewards(), No NFT staked', async function () {
//       await expect(
//         warenVesting.connect(investor).claimRewards(1, 0),
//       ).to.be.revertedWith('No NFT staked')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(0)
//     })

//     it('REVERT: claimRewards(), Out of bounds token index', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenVesting.connect(investor).stakeERC1155(1, 5)
//       await expect(
//         warenVesting.connect(investor).claimRewards(1, 1),
//       ).to.be.revertedWith('Out of bounds token index')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(1)
//     })

//     it('REVERT: claimRewards(), Unable to unstake or get rewards before the minimum period', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenVesting.connect(investor).stakeERC1155(1, 5)

//       await expect(
//         warenVesting.connect(investor).claimRewards(1, 0),
//       ).to.be.revertedWith(
//         'Unable to unstake or get rewards before the minimum period',
//       )
//     })
//   })

//   describe('unstakeERC1155', function () {
//     it('REVERT: unstakeERC1155(), Unstaking and Rewards unavailable for the moment', async function () {
//       await warenVesting.setPause()
//       await expect(
//         warenVesting.connect(investor).unstakeERC1155(1, 0),
//       ).to.be.revertedWith('Unstaking and Rewards unavailable for the moment')
//     })

//     it("REVERT: unstakeERC1155(), NFT doesn't exists", async function () {
//       await expect(
//         warenVesting.connect(investor).unstakeERC1155(14, 0),
//       ).to.be.revertedWith("NFT doesn't exists")
//     })

//     it('REVERT: unstakeERC1155(), No NFT staked', async function () {
//       await expect(
//         warenVesting.connect(investor).unstakeERC1155(1, 0),
//       ).to.be.revertedWith('No NFT staked')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(0)
//     })

//     it('REVERT: unstakeERC1155(), Out of bounds token index', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenVesting.connect(investor).stakeERC1155(1, 5)
//       await expect(
//         warenVesting.connect(investor).unstakeERC1155(1, 1),
//       ).to.be.revertedWith('Out of bounds token index')

//       getStakedErc1155 = await warenVesting
//         .connect(investor)
//         .getStakedERC1155(investor.address, 1)
//       expect(getStakedErc1155.length).to.equal(1)
//     })

//     it('REVERT: unstakeERC1155(), Unable to unstake or get rewards before the minimum period', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenVesting.connect(investor).stakeERC1155(1, 5)

//       await expect(
//         warenVesting.connect(investor).unstakeERC1155(1, 0),
//       ).to.be.revertedWith(
//         'Unable to unstake or get rewards before the minimum period',
//       )
//     })
//   })

//   describe('batchUnstakeERC1155', function () {
//     it('REVERT: batchUnstakeERC1155(), Ids and indexes length mismatch', async function () {
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([1, 2, 2], [0, 0]),
//       ).to.be.revertedWith('Ids and indexes length mismatch')
//     })

//     it('REVERT: batchUnstakeERC1155(), Unstaking and Rewards unavailable for the moment', async function () {
//       await warenVesting.setPause()
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([1, 2], [0, 0]),
//       ).to.be.revertedWith('Unstaking and Rewards unavailable for the moment')
//     })

//     it("REVERT: batchUnstakeERC1155(), NFT doesn't exists", async function () {
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([10, 2], [5, 1]),
//       ).to.be.revertedWith("NFT doesn't exists")
//     })

//     it('REVERT: batchUnstakeERC1155(), No NFT staked', async function () {
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([1, 2], [0, 0]),
//       ).to.be.revertedWith('No NFT staked')
//     })

//     it('REVERT: batchUnstakeERC1155(), Out of bounds token index', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenERC1155.setStep(2)
//       await warenERC1155.connect(investor).publicSaleMint1(5)

//       await warenVesting.connect(investor).batchStakeERC1155([1, 3], [5, 5])
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(100))),
//       ])
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([1, 3], [0, 1]),
//       ).to.be.revertedWith('Out of bounds token index')
//     })

//     it('REVERT: batchUnstakeERC1155(), Unable to unstake or get rewards before the minimum period', async function () {
//       await warenERC1155.connect(investor).goldPassMint(5)
//       await warenVesting.connect(investor).stakeERC1155(1, 5)
//       await expect(
//         warenVesting.connect(investor).batchUnstakeERC1155([1, 3], [0, 0]),
//       ).to.be.revertedWith(
//         'Unable to unstake or get rewards before the minimum period',
//       )
//     })
//   })

//   it('burnExcededSupplyERC20(), at the beginning', async function () {
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(359))),
//     ])
//     expect(await warenERC20.totalSupply()).to.equal(maxTotalSupply)
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal(
//       balanceDeployVesting,
//     )
//     await warenVesting.burnExcededSupplyERC20()
//     expect(await warenERC20.totalSupply()).to.equal(maxTotalSupply.sub(balanceDeployVesting))
//     expect(await warenERC20.balanceOf(warenVesting.address)).to.equal("0")
//   })

//   it('REVERT: burnExcededSupplyERC20(), Not Owner', async function () {
//     await expect(
//       warenVesting.connect(investor).burnExcededSupplyERC20(),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   it('REVERT: burnExcededSupplyERC20(), Vesting is not yet finished', async function () {
//     await expect(warenVesting.burnExcededSupplyERC20()).to.be.revertedWith(
//       'Vesting is not yet finished',
//     )
//   })
// })
