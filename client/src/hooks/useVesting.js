import { useEffect, useState, useRef, useCallback } from 'react';
import { ethers } from "ethers";
import { vestingAbi, vestingRecipient  } from "../utils/abi"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const vestingContract = new ethers.Contract(vestingRecipient, vestingAbi, provider)
// Signer represents ethereum wallet in ethers.js. You cannot just send
// transactions with only provider, you will need signer (wallet) for this.



export const useVestingListener = () => {
  const [singleItem, setSingleItem] = useState()
  const [multiItems, setMultiItems] = useState()
  // const [singleStaking, setSingleStaking] = useState()
  // const [multiStaking, setMultiStaking] = useState()
  const [claimable, setClaimable] = useState()
  const [totalVestedReward, setTotalVestedReward] = useState()
  const [unlockedPeriod, setUnlockedPeriod] = useState()
  const [multiClaims, setMultiClaims] = useState()
  const [pausable, setPausable] = useState(false)

    // setPause // onlyowner set pause if we pause the vesting of the nfts 
    // setUnlockPeriod // the locked period is set by  1 mont 5 month etc 
    // StakeErc1155 //stake one nfts 
    // batchStakeERC1155 // stake several nfts 
    // claimRewards  // used for claim the reward tx 
    // unstakeERC1155 // unstake one  nfts 
    // batchUnstakeERC1155 // unstake several nft 

    
// user Address of the user.
//      * @param tokenId Id of the token.
//      * @param tokenIndex Index of the token in the mapping.
//      * @return uint256 Amount of rewards.
//      */
}


export async function useCallItem(tokenId, tokenIds, tokenAmount, user) {
  const [chestItems, setChestItems] = useState(0);
  // Using React ref here to prevent component re-rendering when changing
  // previous balance value
  const prevBalanceRef = useRef(0);

  const fetchBalance = useCallback(async () => {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    try {
      // let overrides = {
      //   from: accounts[0],
      // }
      // const multiStake = await vestingContract.batchStakeERC1155(tokenIds, tokenAmount);

    } catch (error) {
      console.log('error', error.message)

    }
    // const stake = await vestingContract.stakeERC1155(tokenId, tokenAmount);
    // await stake.wait()
    // console.log('stake', stake.toString())
    const value = await vestingContract.getAllStakedERC1155(user); 
    await value.wait()
    console.log( value.toString())
    //stake a nft 
    vestingContract.on('getAllStakedERC1155',)
    // Format ETH balance and parse it to JS number

    // Optimization: check that user balance has actually changed before
    // updating state and triggering the consuming component re-render
    if (value !== prevBalanceRef.current) {
      prevBalanceRef.current = value;
      setChestItems(value);
    }

  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    // Fetch user balance on each block
    provider.on('block', fetchBalance);
    console.log(fetchBalance);

    // Cleanup function is used to unsubscribe from 'block' event and prevent
    // a possible memory leak in your application.
    return () => {
      provider.off('block', fetchBalance);
    };
    
  }, [fetchBalance]);

  return chestItems;
}


// export async function singleVesting() {
//   setSingleStaking(await vestingContract.getStakedERC1155());
// }

// export async function multiVesting() {
//   setMultiStaking(await vestingContract.batchStakeERC1155());

// }


// export async function totalVesting() {
//   setTotalVestedReward(await vestingContract.totalTimeStaked);
    // const claim = await vestingContract.claim()
    // const totalVested = await vestingContract.totalStaked()
    // const unlockPeriod = await vestingContract.setUnlockPeriod()
    // const claimUserReward = await vestingContract.claimRewards()
// }

// export async function UnlockedPeriods() {
//   setUnlockedPeriod(await vestingContract.setUnlockPeriod());


// }


// export async function MultiClaimCall() {
//   setMultiClaims(await vestingContract.claimUserReward());
// }

 export const  burnExcededSupplyERC20 = async() => {
  const burnExcedant = await vestingContract.burnExcededSupplyERC20()
  return burnExcedant
 } 

    //         //reading contract for public infos:
    // endVestingPreSalesWhitelist
    // endPublicSales1
    // endPublicSales2

    // maxRewardsPublicSale1
    // maxRewardsPublicSale2
    // maxRewardPreSales
    // maxRewardWhiteList

    // stakers
    // stakingPeriod
    // StakingMinimalUnlock