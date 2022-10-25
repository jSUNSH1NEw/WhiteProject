const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.json')

const baseURI = 'ipfs://QmPDo2jamJWXBoCS4PK5gD9SfXqQ5JeH1PZLSgSrWzMoHx/'

async function main() {
  let tab = []
  whitelist.map((token) => {
    tab.push(token.address)
  })
  const leaves = tab.map((address) => keccak256(address))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()

  const WarenERC1155 = await hre.ethers.getContractFactory('Waren')
  const warenERC1155 = await WarenERC1155.deploy(root, baseURI)
  await warenERC1155.deployed()

  const VestingERC1155 = await hre.ethers.getContractFactory(
    'WarenVestingERC1155',
  )
  const warenVestingERC1155 = await VestingERC1155.deploy(warenERC1155.address)
  await warenVestingERC1155.deployed()

  const WarenERC20 = await hre.ethers.getContractFactory('WarenERC20')
  const warenERC20 = await WarenERC20.deploy(warenVestingERC1155.address)
  await warenERC20.deployed(warenVestingERC1155.address)

  // Les utilisateurs doivent donner leurs autorisation au Vesting de transferer leurs NFT !
  // ex: await warenERC1155.setApprovalForAll(warenVestingERC1155.address, true)

  await warenERC1155.setStep(3)
  await warenERC1155.setPaused()
  await warenVestingERC1155.setWarenERC20(warenERC20.address)
  await warenVestingERC1155.setPause()

  const StakingERC20 = await hre.ethers.getContractFactory('WarenStakingERC20')
  const warenStakingERC20 = await StakingERC20.deploy(warenERC20.address)
  await warenStakingERC20.deployed()

  // // Le Marketing doit transferer l'argent au contrat puis utiliser les fonctions setRewardsDuration, notifyRewardAmount et setPause
  // await warenERC20
  //   .connect(marketing)
  //   .transfer(
  //     warenStakingERC20.address,
  //     await warenERC20.balanceOf(marketing.address),
  //   )
  // await warenStakingERC20.setRewardsDuration(31536000) // 1 an
  // await warenStaking.notifyRewardAmount(
  //   await warenERC20.balanceOf(warenStaking.address),
  // )
  // await warenStaking.setPause()


  // Les utilisateurs doivent donner leurs autorisation au Staking de transferer leurs WRN !
  // ex: await warenERC20.approve(warenStaking.address, ethers.utils.parseEther('1000'))

  console.log('WarenERC1155 deployed to:', warenERC1155.address)
  console.log('WarenVestingERC1155 deployed to:', warenVestingERC1155.address)
  console.log('WarenERC20 deployed to:', warenERC20.address)
  console.log('WarenStakingERC20 deployed to:', warenStakingERC20.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })