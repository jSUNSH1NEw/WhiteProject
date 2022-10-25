// const { expect } = require('chai')
// const { ethers } = require('hardhat')

// balanceDeployVesting = ethers.utils.parseEther((1e8).toString())
// balanceDeployMarketing = ethers.utils.parseEther((3e7).toString())
// balanceDeployWarenERC20 = ethers.utils.parseEther((7e7).toString())
// balanceDeployTeams = ethers.utils.parseEther((3e7).toString())
// balanceDeployReserves = ethers.utils.parseEther((4e7).toString())
// maxTotalSupply = ethers.utils.parseEther((2e8).toString())

// function addDays(days) {
//   return days * 24 * 60 * 60
// }

// describe('ERC20 WAREN TESTS', function () {
//   beforeEach(async function () {
//     ;[
//       owner,
//       investor,
//       vesting,
//       marketing,
//       teams,
//       reserves,
//     ] = await ethers.getSigners()
//     // owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, investor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
//     // vesting = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, marketing = 0x90F79bf6EB2c4f870365E785982E1f101E93b906
//     // teams = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, reserves = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc

//     WarenERC20 = await hre.ethers.getContractFactory('WarenERC20')
//     warenERC20 = await WarenERC20.deploy(vesting.address)
//     await warenERC20.deployed()
//   })

//   it('a un nom', async function () {
//     expect(await warenERC20.name()).to.equal('WarenErc20')
//   })

//   it('a un symbole', async function () {
//     expect(await warenERC20.symbol()).to.equal('WRN')
//   })

//   it('a une valeur décimal', async function () {
//     expect(await warenERC20.decimals()).to.equal(18)
//   })

//   it('Balances after contract deploy and totalSupply', async function () {
//     balanceVesting = await warenERC20.balanceOf(vesting.address)
//     balanceMarketing = await warenERC20.balanceOf(marketing.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     totalSupply = await warenERC20.totalSupply()
//     expect(balanceVesting).to.equal(balanceDeployVesting)
//     expect(balanceMarketing).to.equal(balanceDeployMarketing)
//     expect(balanceWarenERC20).to.equal(balanceDeployWarenERC20)
//     expect(totalSupply).to.equal(maxTotalSupply)

//     // tests des variables internes
//     lockedSupplyTeam = await warenERC20.lockedSupplyTeam()
//     lockedSupplyReserves = await warenERC20.lockedSupplyReserves()
//     totalLockedSupply = lockedSupplyTeam.add(lockedSupplyReserves) // https://docs.ethers.io/v5/api/utils/bignumber/
//     expect(totalLockedSupply).to.equal(balanceDeployWarenERC20)

//     block = await warenERC20.initialTime()
//     latestBlock = await hre.ethers.provider.getBlock('latest')
//     expect(block).to.equal(latestBlock.timestamp)
//   })

//   it('distributeLockedSupplies, Gérer les deux distributions', async () => {
//     block = await warenERC20.initialTime()

//     await expect(
//       warenERC20.distributeLockedSupplyReserves(),
//     ).to.be.revertedWith('Distribution is not available')

//     // latestBlockBefore = await hre.ethers.provider.getBlock('latest')
//     // console.log('latestBlockBefore :>> ', latestBlockBefore.timestamp);
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(454)))]) // 274 + 6 mois
//     // latestBlockAfter = await hre.ethers.provider.getBlock('latest')
//     // console.log('latestBlockAfter :>> ', latestBlockAfter.timestamp);
//     // calcul = latestBlockAfter.timestamp-latestBlockBefore.timestamp
//     // console.log('calcul mois écoulés', calcul / (30*24*60*60))

//     balanceTeams = await warenERC20.balanceOf(teams.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     expect(balanceTeams).to.equal('0')
//     expect(balanceWarenERC20).to.equal(balanceDeployWarenERC20)

//     await warenERC20.distributeLockedSupplyTeams()

//     balanceTeams = await warenERC20.balanceOf(teams.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     expect(balanceTeams).to.equal(balanceDeployTeams)
//     expect(balanceWarenERC20).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams),
//     )

//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(457)))])

//     await warenERC20.distributeLockedSupplyReserves()

//     balanceReserves = await warenERC20.balanceOf(reserves.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     expect(balanceReserves).to.equal(balanceDeployReserves)
//     expect(balanceWarenERC20).to.equal('0')
//   })

//   it('REVERT: distributeLockedSupplyReserves() Not owner', async function () {
//     await expect(
//       warenERC20.connect(investor).distributeLockedSupplyReserves(),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   it('REVERT: distributeLockedSupplyReserves() Distribution is not available', async function () {
//     await expect(
//       warenERC20.distributeLockedSupplyReserves(),
//     ).to.be.revertedWith('Distribution is not available')
//   })

//   it('REVERT: distributeLockedSupplyReserves() Already distributed', async function () {
//     block = await warenERC20.initialTime()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(457)))])
//     await warenERC20.distributeLockedSupplyReserves()
//     await expect(
//       warenERC20.distributeLockedSupplyReserves(),
//     ).to.be.revertedWith('Already distributed')
//   })

//   it('distributeLockedSupplyTeams() tous les retraits possibles (chaque mois)', async function () {
//     // distributeLockedSupplyTeams après 9 mois écoulés
//     block = await warenERC20.initialTime()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(274)))])

//     balanceTeams = await warenERC20.balanceOf(teams.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     expect(balanceTeams).to.equal('0')
//     expect(balanceWarenERC20).to.equal(balanceDeployWarenERC20)

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     ) // 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(15)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(15).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 1 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(304)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(30),
//     ) // 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(30)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(30).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 2 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(334)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(45),
//     ) // 15% + 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(45)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(45).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 3 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(364)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(60),
//     ) // 15% + 15% + 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(60)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(60).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 4 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(394)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(75),
//     ) // 15% + 15% + 15% + 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(75)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(75).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 5 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(424)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(15),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(90),
//     ) // 15% + 15% + 15% + 15% + 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(90)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(90).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + 6 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(454)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(10),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(100),
//     ) // 100%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(100)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(100).toString(),
//     )

//     // tentative d'avoir plus que le maximum, distributeLockedSupplyTeams après 9 mois + 7 mois
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(484)))])

//     await expect(warenERC20.distributeLockedSupplyTeams()).to.be.revertedWith(
//       'Already distributed',
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(100),
//     ) // 100%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(100)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(100).toString(),
//     )
//   })

//   it('distributeLockedSupplyTeams() en 2 fois', async function () {
//     // distributeLockedSupplyTeams après 9 mois + 2 mois écoulés
//     block = await warenERC20.initialTime()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(334)))])

//     balanceTeams = await warenERC20.balanceOf(teams.address)
//     balanceWarenERC20 = await warenERC20.balanceOf(warenERC20.address)
//     expect(balanceTeams).to.equal('0')
//     expect(balanceWarenERC20).to.equal(balanceDeployWarenERC20)

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(45),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(45),
//     ) // 45%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(45)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(45).toString(),
//     )

//     // distributeLockedSupplyTeams après 9 mois + infini
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(600)))])

//     distribute = await warenERC20.distributeLockedSupplyTeams()
//     distribute = await distribute.wait()
//     expect(distribute.events[0].args.value).to.equal(
//       balanceDeployTeams.div(100).mul(55),
//     )

//     expect(await warenERC20.balanceOf(teams.address)).to.equal(
//       balanceDeployTeams.div(100).mul(100),
//     ) // 15% + 15%
//     expect(await warenERC20.balanceOf(warenERC20.address)).to.equal(
//       balanceDeployWarenERC20.sub(balanceDeployTeams.div(100).mul(100)),
//     )
//     alreadyDistributedTeams = await warenERC20.alreadyDistributedTeams()
//     expect(alreadyDistributedTeams).to.equal(
//       balanceDeployTeams.div(100).mul(100).toString(),
//     )
//   })

//   it('REVERT: distributeLockedSupplyTeams() Not owner', async function () {
//     await expect(
//       warenERC20.connect(investor).distributeLockedSupplyTeams(),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   it('REVERT: distributeLockedSupplyTeams() Distribution is not available', async function () {
//     await expect(
//       warenERC20.distributeLockedSupplyTeams(),
//     ).to.be.revertedWith('Distribution is not available')
//   })

//   it('REVERT: distributeLockedSupplyTeams() Already distributed', async function () {
//     block = await warenERC20.initialTime()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(457)))])
//     await warenERC20.distributeLockedSupplyTeams()
//     await expect(
//       warenERC20.distributeLockedSupplyTeams(),
//     ).to.be.revertedWith('Already distributed')
//   })

//   it('REVERT: distributeLockedSupplyTeams() Not enough time has passed for a new distribution', async function () {
//     block = await warenERC20.initialTime()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(274)))])
//     await warenERC20.distributeLockedSupplyTeams()
//     await ethers.provider.send('evm_mine', [parseInt(block.add(addDays(294)))])
//     await expect(
//       warenERC20.distributeLockedSupplyTeams(),
//     ).to.be.revertedWith('Not enough time has passed for a new distribution')
//   })

//   it('La fonction burn()', async () => {
//     balanceVesting = await warenERC20.balanceOf(vesting.address)
//     expect(balanceVesting).to.equal(balanceDeployVesting)
//     totalSupply = await warenERC20.totalSupply()
//     expect(totalSupply).to.equal(maxTotalSupply)

//     await warenERC20.connect(vesting).burn(1000)

//     balanceVesting = await warenERC20.balanceOf(vesting.address)
//     expect(balanceVesting).to.equal(balanceDeployVesting.sub(1000))
//     totalSupply = await warenERC20.totalSupply()
//     expect(totalSupply).to.equal(maxTotalSupply.sub(1000))
//   })

//   it('La fonction burnFrom()', async () => {
//     balanceVesting = await warenERC20.balanceOf(vesting.address)
//     expect(balanceVesting).to.equal(balanceDeployVesting)
//     balanceInvestor = await warenERC20.balanceOf(investor.address)
//     expect(balanceInvestor).to.equal('0')
//     totalSupply = await warenERC20.totalSupply()
//     expect(totalSupply).to.equal(maxTotalSupply)

//     await warenERC20.connect(vesting).approve(investor.address, 1000)

//     allowance = await warenERC20.allowance(vesting.address, investor.address)
//     expect(allowance).to.equal(1000)

//     await warenERC20.connect(investor).burnFrom(vesting.address, 1000)

//     allowance = await warenERC20.allowance(vesting.address, investor.address)
//     expect(allowance).to.equal('0')

//     balanceVesting = await warenERC20.balanceOf(vesting.address)
//     expect(balanceVesting).to.equal(balanceDeployVesting.sub(1000))
//     balanceInvestor = await warenERC20.balanceOf(investor.address)
//     expect(balanceInvestor).to.equal('0')
//     totalSupply = await warenERC20.totalSupply()
//     expect(totalSupply).to.equal(maxTotalSupply.sub(1000))
//   })

//   it('REVERT: burn() Le msg.sender ne possède aucun token à burn', async function () {
//     await expect(warenERC20.connect(investor).burn(1000)).to.be.revertedWith(
//       'ERC20: burn amount exceeds balance',
//     )
//   })

//   it('REVERT: burn() Le msg.sender souhaite burn des token qui ne sont pas les siens sans approve', async function () {
//     await expect(
//       warenERC20.connect(investor).burnFrom(warenERC20.address, 1000),
//     ).to.be.revertedWith('ERC20: insufficient allowance')
//   })
// })
