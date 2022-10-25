// const { expect } = require('chai')
// const { ethers } = require('hardhat')

// function addDays(days) {
//   return days * 24 * 60 * 60
// }

// maxTotalSupply = ethers.utils.parseEther((2e8).toString())
// balanceDeployMarketing = ethers.utils.parseEther((3e7).toString())
// balanceStaking = ethers.utils.parseEther((1e7).toString())

// describe('STAKING WAREN TESTS', function () {
//   beforeEach(async function () {
//     ;[
//       owner,
//       investor,
//       vesting,
//       marketing,
//       toto,
//       tata,
//     ] = await ethers.getSigners()
//     // // owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, investor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
//     // // marketing = 0x90F79bf6EB2c4f870365E785982E1f101E93b906
//     // // toto = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, tata = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc

//     WarenERC20 = await hre.ethers.getContractFactory('WarenERC20')
//     warenERC20 = await WarenERC20.deploy(vesting.address)
//     await warenERC20.deployed()

//     WarenStakingERC20 = await hre.ethers.getContractFactory('WarenStakingERC20')
//     warenStaking = await WarenStakingERC20.deploy(warenERC20.address)
//     await warenStaking.deployed()

//     await warenStaking.setRewardsDuration(addDays(365)) // 1 an
//     await warenStaking.setPause()
//     // // await warenERC20
//     // //   .connect(marketing)
//     // //   .transfer(
//     // //     warenStaking.address,
//     // //     await warenERC20.balanceOf(marketing.address),
//     // //   )
//     await warenERC20
//       .connect(marketing)
//       .transfer(warenStaking.address, balanceStaking) // 10 millions

//     // // UNIQUEMENT POUR LES TESTS: Vesting transfere 1000 à investor, toto et tata
//     await warenERC20
//       .connect(vesting)
//       .transfer(investor.address, ethers.utils.parseEther('1000'))
//     await warenERC20
//       .connect(vesting)
//       .transfer(toto.address, ethers.utils.parseEther('1000'))
//     await warenERC20
//       .connect(vesting)
//       .transfer(tata.address, ethers.utils.parseEther('1000'))
//     await warenERC20
//       .connect(investor)
//       .approve(warenStaking.address, ethers.utils.parseEther('1000'))
//     await warenERC20
//       .connect(toto)
//       .approve(warenStaking.address, ethers.utils.parseEther('1000'))
//     await warenERC20
//       .connect(tata)
//       .approve(warenStaking.address, ethers.utils.parseEther('1000'))

//     await warenStaking.notifyRewardAmount(balanceStaking)
//   })

//   it('WarenStakingERC20 est bien initialisé, notifyRewardAmount()', async function () {
//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     expect(await warenERC20.balanceOf(marketing.address)).to.equal(
//       balanceDeployMarketing.sub(balanceStaking),
//     )
//     expect(await warenERC20.balanceOf(warenStaking.address)).to.equal(
//       balanceStaking,
//     )
//     expect(await warenERC20.balanceOf(investor.address)).to.equal(
//       ethers.utils.parseEther('1000'),
//     )
//     expect(await warenERC20.balanceOf(toto.address)).to.equal(
//       ethers.utils.parseEther('1000'),
//     )
//     expect(await warenERC20.balanceOf(tata.address)).to.equal(
//       ethers.utils.parseEther('1000'),
//     )

//     expect(await warenStaking.duration()).to.equal(addDays(365))
//     expect(await warenStaking.finishAt()).to.equal(timestamp + addDays(365))
//     expect(await warenStaking.updatedAt()).to.equal(timestamp)
//     expect(await warenStaking.rewardRate()).to.equal(
//       balanceStaking.div(addDays(365)),
//     )
//     expect(await warenStaking.rewardPerTokenStored()).to.equal(0)
//     expect(await warenStaking.totalSupply()).to.equal(0)
//   })

//   it('Tax = 0, console.log dans le contrat', async function () {
//     expect(await warenERC20.balanceOf(warenStaking.address)).to.equal(
//       balanceStaking,
//     )
//     expect(await warenStaking.balanceOf(investor.address)).to.equal(0)

//     await warenStaking.connect(investor).stake('1')

//     expect(await warenERC20.balanceOf(warenStaking.address)).to.equal(
//       balanceStaking.add('1'),
//     )
//     expect(await warenStaking.balanceOf(investor.address)).to.equal('1')

//     await warenStaking.connect(investor).unstake('1')
//   })

//   //   // ~~~~~~~~~~~~~~~~~~~~~~~~~~ CLASSIQUES ~~~~~~~~~~~~~~~~~~~~~~~~~~//

//   it('setPause() Activation et desactivation de la pause', async function () {
//     pause = await warenStaking.notPaused()
//     expect(pause).to.equal(true)
//     await warenStaking.setPause()
//     pause = await warenStaking.notPaused()
//     expect(pause).to.equal(false)
//   })

//   it('REVERT: setPause() Not Owner', async function () {
//     await expect(warenStaking.connect(investor).setPause()).to.be.revertedWith(
//       'Ownable: caller is not the owner',
//     )
//   })

//   it('setRewardsDuration() Changement de la durée du staking', async function () {
//     duration = await warenStaking.duration()
//     expect(duration).to.equal(addDays(365))

//     const { timestamp } = await hre.ethers.provider.getBlock('latest')
//     await ethers.provider.send('evm_mine', [
//       parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//     ])

//     await warenStaking.setRewardsDuration(3600)
//     duration = await warenStaking.duration()
//     expect(duration).to.equal(3600)
//   })

//   it('REVERT: setRewardsDuration() Not Owner', async function () {
//     await expect(
//       warenStaking.connect(investor).setRewardsDuration(60),
//     ).to.be.revertedWith('Ownable: caller is not the owner')
//   })

//   it('REVERT: setRewardsDuration() Reward duration not finished', async function () {
//     await expect(warenStaking.setRewardsDuration(60)).to.be.revertedWith(
//       'Reward duration not finished',
//     )
//   })

//   describe('Initialisation et update de la pool, notifyRewardAmount()', function () {
//     it('notifyRewardAmount() Ajout de liquidité dans la pool == Update', async function () {
//       timestampBefore = await hre.ethers.provider.getBlock('latest')

//       expect(await warenERC20.balanceOf(warenStaking.address)).to.equal(
//         balanceStaking,
//       )
//       expect(await warenStaking.finishAt()).to.equal(timestampBefore.timestamp + addDays(365))
//       expect(await warenStaking.updatedAt()).to.equal(timestampBefore.timestamp)
//       expect(await warenStaking.rewardRate()).to.equal(
//         balanceStaking.div(addDays(365)),
//       )

//       amountToAdd = ethers.utils.parseEther(1e6.toString())
//       await warenERC20
//         .connect(marketing)
//         .transfer(warenStaking.address, amountToAdd)

//       await warenStaking.notifyRewardAmount(amountToAdd)

//       timestampAfter = await hre.ethers.provider.getBlock('latest')

//       expect(await warenERC20.balanceOf(warenStaking.address)).to.equal(
//         balanceStaking.add(amountToAdd),
//       )
//       expect(await warenStaking.finishAt()).to.equal(timestampAfter.timestamp + addDays(365))
//       expect(await warenStaking.updatedAt()).to.equal(timestampAfter.timestamp)
//       calculArrondi1 = Math.round((await warenStaking.rewardRate()) / 1e11) * 1e11
//       calculArrondi2 = Math.round((balanceStaking.add(amountToAdd).div(31536000)) / 1e11) * 1e11

//       expect(calculArrondi1).to.equal(calculArrondi2)
//     })

//     it('REVERT: notifyRewardAmount() Not Owner', async function () {
//       await expect(
//         warenStaking.connect(investor).notifyRewardAmount(60),
//       ).to.be.revertedWith('Ownable: caller is not the owner')
//     })

//     it('REVERT: notifyRewardAmount() Reward rate must be greater than 0', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')

//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(addDays(365))),
//       ])
//       await expect(warenStaking.notifyRewardAmount(1)).to.be.revertedWith(
//         'Reward rate must be greater than 0',
//       )
//     })

//     it('REVERT: notifyRewardAmount() Balance of contract must be greater than reward amount', async function () {
//       await expect(
//         warenStaking.notifyRewardAmount(ethers.utils.parseEther('1')),
//       ).to.be.revertedWith(
//         'Balance of contract must be greater than reward amount',
//       )
//     })
//   })

//   describe('STAKE', function () {
//     it('Staking', async function () {
//       await warenStaking
//         .connect(investor)
//         .stake(ethers.utils.parseEther('1000'))

//       const { timestamp } = await hre.ethers.provider.getBlock('latest')

//       updatedAtBefore = await warenStaking.updatedAt()
//       balanceInvestorBefore = await warenERC20.balanceOf(investor.address)
//       balanceStakingBefore = await warenERC20.balanceOf(warenStaking.address)
//       expect(await warenStaking.rewardPerTokenStored()).to.equal(0)
//       expect(await warenStaking.rewardPerToken()).to.equal(0)

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       expect(await warenStaking.totalSupply()).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       expect(await warenStaking.firstStakeOf(investor.address)).to.equal(
//         timestamp,
//       )

//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(60)),
//       ])

//       await warenStaking.connect(investor).claimReward()

//       updatedAtAfter = await warenStaking.updatedAt()
//       balanceInvestorAfter = await warenERC20.balanceOf(investor.address)
//       balanceStakingAfter = await warenERC20.balanceOf(warenStaking.address)
//       expect(updatedAtBefore).to.be.lt(updatedAtAfter)
//       expect(balanceInvestorBefore).to.be.lt(balanceInvestorAfter)
//       expect(balanceStakingBefore).to.be.gt(balanceStakingAfter)

//       await warenERC20
//         .connect(investor)
//         .approve(warenStaking.address, ethers.utils.parseEther('1000'))
//       await warenERC20
//         .connect(vesting)
//         .transfer(investor.address, ethers.utils.parseEther('1000'))
//       await warenStaking
//         .connect(investor)
//         .stake(ethers.utils.parseEther('1000'))

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('2000'),
//       )
//       expect(await warenStaking.totalSupply()).to.equal(
//         ethers.utils.parseEther('2000'),
//       )
//       expect(await warenStaking.firstStakeOf(investor.address)).to.equal(
//         timestamp,
//       )
//     })

//     it('REVERT: stake(), Staking unavailable for the moment', async function () {
//       await warenStaking.setPause()
//       await expect(warenStaking.connect(investor).stake(1)).to.be.revertedWith(
//         'Staking unavailable for the moment',
//       )
//     })

//     it('REVERT: stake(), Amount must be greater than 0', async function () {
//       await expect(warenStaking.connect(investor).stake(0)).to.be.revertedWith(
//         'Amount must be greater than 0',
//       )
//     })

//     it('REVERT: stake() ERC20: insufficient allowance', async function () {
//       await expect(
//         warenStaking.connect(investor).stake(ethers.utils.parseEther('2000')),
//       ).to.be.revertedWith('ERC20: insufficient allowance')
//     })

//     it('REVERT: stake() ERC20: transfer amount exceeds balance', async function () {
//       await warenERC20
//         .connect(investor)
//         .approve(warenStaking.address, ethers.utils.parseEther('2000'))
//       await expect(
//         warenStaking.connect(investor).stake(ethers.utils.parseEther('2000')),
//       ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
//     })
//   })

//   describe('UNSTAKE', function () {
//     it('Unstaking', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')

//       // Stake 1000 WRN
//       await warenStaking
//         .connect(investor)
//         .stake(ethers.utils.parseEther('1000'))

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       expect(await warenStaking.totalSupply()).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       expect(await warenStaking.firstStakeOf(investor.address)).to.equal(
//         timestamp + 1,
//       )

//       // 1 minute plus tard
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(60)),
//       ])

//       // Unstake 500 WRN
//       unstake = await warenStaking
//         .connect(investor)
//         .unstake(ethers.utils.parseEther('500'))
//       unstake = await unstake.wait()
//       rewardPaid = unstake.events[2].args.reward

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('500'),
//       )
//       expect(await warenStaking.totalSupply()).to.equal(
//         ethers.utils.parseEther('500'),
//       )
//       expect(await warenStaking.firstStakeOf(investor.address)).to.equal(
//         timestamp + 1,
//       )

//       // 1 minute + 6 mois plus tard
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(15811260)),
//       ])

//       // Claim rewards, aifn de tester la tax avec le meme montant de rewards, 6 mois après'
//       await warenStaking.connect(investor).claimReward()

//       // 1 minute + 6 mois + 1 minute plus tard')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(15811320)),
//       ])

//       // Unstake 500 WRN
//       unstake = await warenStaking
//         .connect(investor)
//         .unstake(ethers.utils.parseEther('500'))
//       unstake = await unstake.wait()
//       rewardPaid2 = unstake.events[2].args.reward

//       // Différence dût à la tax de 2% de 1000 soit 20 WRN
//       expect(rewardPaid).to.equal(rewardPaid2.sub('20000000000000000500'))

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(0)
//       expect(await warenStaking.totalSupply()).to.equal(0)
//       expect(await warenStaking.firstStakeOf(investor.address)).to.equal(0)
//     })

//     it('REVERT: unstake(), Amount must be greater than 0', async function () {
//       await expect(
//         warenStaking.connect(investor).unstake(0),
//       ).to.be.revertedWith('Amount must be greater than 0')
//     })

//     it('REVERT: unstake() Not enough funds', async function () {
//       await expect(
//         warenStaking.connect(investor).unstake(ethers.utils.parseEther('2000')),
//       ).to.be.revertedWith('Not enough funds')
//     })
//   })

//   describe('CLAIM REWARD', function () {
//     it('claimReward', async function () {
//       const { timestamp } = await hre.ethers.provider.getBlock('latest')

//       // Stake 1000 WRN
//       await warenStaking
//         .connect(investor)
//         .stake(ethers.utils.parseEther('1000'))

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       balanceERC20InvestorBefore = await warenERC20.balanceOf(investor.address)
//       expect(balanceERC20InvestorBefore).to.equal(0)

//       // 1 minute plus tard
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(60)),
//       ])

//       await warenStaking.connect(investor).claimReward()

//       expect(await warenStaking.balanceOf(investor.address)).to.equal(
//         ethers.utils.parseEther('1000'),
//       )
//       balanceERC20InvestorAfter = await warenERC20.balanceOf(investor.address)
//       expect(balanceERC20InvestorAfter).to.be.gt(balanceERC20InvestorBefore)

//       // 1 minute + 1 minute plus tard')
//       await ethers.provider.send('evm_mine', [
//         parseInt(ethers.BigNumber.from(timestamp).add(120)),
//       ])

//       claimReward = await warenStaking.connect(investor).claimReward()
//       claimReward = await claimReward.wait()
//       rewardPaid = claimReward.events[1].args.reward

//       expect(await warenERC20.balanceOf(investor.address)).to.equal(
//         balanceERC20InvestorAfter.add(rewardPaid),
//       )
//     })

//     it('REVERT: claimReward() No reward to claim', async function () {
//       await expect(
//         warenStaking.connect(investor).claimReward(),
//       ).to.be.revertedWith('No reward to claim')
//     })
//   })

//   // it('Observations', async function () {
//   //   await warenStaking.connect(investor).stake(ethers.utils.parseEther('1000'))

//   //   const { timestamp } = await hre.ethers.provider.getBlock('latest')

//   //   console.log('**************************************')
//   //   await ethers.provider.send('evm_mine', [
//   //     parseInt(ethers.BigNumber.from(timestamp).add(60)),
//   //   ])
//   //   console.log('1 minute')

//   //   console.log(
//   //     'earnedInvestor :>> ',
//   //     await warenStaking.earned(investor.address),
//   //   )

//   //   await warenStaking.connect(toto).stake(ethers.utils.parseEther('1000'))

//   //   console.log('**************************************')
//   //   await ethers.provider.send('evm_mine', [
//   //     parseInt(ethers.BigNumber.from(timestamp).add(120)),
//   //   ])
//   //   console.log('2 minutes')

//   //   console.log(
//   //     'earnedInvestor :>> ',
//   //     await warenStaking.earned(investor.address),
//   //   )
//   //   console.log('earnedToto :>> ', await warenStaking.earned(toto.address))

//   //   await warenStaking.connect(tata).stake(ethers.utils.parseEther('1000'))

//   //   console.log('**************************************')
//   //   await ethers.provider.send('evm_mine', [
//   //     parseInt(ethers.BigNumber.from(timestamp).add(180)),
//   //   ])
//   //   console.log('3 minutes')

//   //   console.log(
//   //     'earnedInvestor :>> ',
//   //     await warenStaking.earned(investor.address),
//   //   )
//   //   console.log('earnedToto :>> ', await warenStaking.earned(toto.address))
//   //   console.log('earnedTata :>> ', await warenStaking.earned(tata.address))

//   //   console.log('RETRAIT INVESTOR')
//   //   await warenStaking
//   //     .connect(investor)
//   //     .unstake(ethers.utils.parseEther('1000'))

//   //   console.log('**************************************')
//   //   await ethers.provider.send('evm_mine', [
//   //     parseInt(ethers.BigNumber.from(timestamp).add(240)),
//   //   ])
//   //   console.log('4 minutes')

//   //   console.log(
//   //     'balanceInvestor :>> ',
//   //     await warenERC20.balanceOf(investor.address),
//   //   )
//   //   console.log(
//   //     'earnedInvestor :>> ',
//   //     await warenStaking.earned(investor.address),
//   //   )
//   //   console.log('earnedToto :>> ', await warenStaking.earned(toto.address))
//   //   console.log('earnedTata :>> ', await warenStaking.earned(tata.address))

//   //   console.log('duration', await warenStaking.duration())
//   //   console.log('finishAt', await warenStaking.finishAt())
//   //   console.log('updatedAt', await warenStaking.updatedAt())
//   //   console.log('rewardRate', await warenStaking.rewardRate())
//   //   console.log(
//   //     'rewardPerTokenStored',
//   //     await warenStaking.rewardPerTokenStored(),
//   //   )
//   //   console.log('rewardPerToken', await warenStaking.rewardPerToken())
//   //   console.log('totalSupply', await warenStaking.totalSupply())
//   // })
// })
