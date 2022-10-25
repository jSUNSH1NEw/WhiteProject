import tokenABI from "../artifacts/contracts/WarenERC20.sol/WarenERC20.json"
import nftABI from "../artifacts/contracts/Waren.sol/Waren.json"
import stakingABI from "../artifacts/contracts/WarenStakingERC20.sol/WarenStakingERC20.json"
import vestingABI from "../artifacts/contracts/WarenVestingERC1155.sol/WarenVestingERC1155.json"

export const erc20Abi = tokenABI.abi
export const nftAbi = nftABI.abi
export const vestingAbi = vestingABI.abi
export const stakingAbi = stakingABI.abi  
// export const swapRouter = ""

export const erc20Recipient = '0x7dB163A5446335B76Cd8921726Cc830036070244'
export const nftRecipient = '0x02282fEDFc34571A3E6A6d3679E1c79451063847'
export const vestingRecipient = '0x9443C0bFf83eB069edd63aD77F4fbc633c0fd578'
export const stakingRecipient = '0x9a41768E1C827BC26b878876e070F2e8D86ec491'
// export const swapRecipent = ""