import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { stakingAbi, stakingRecipient  } from "../utils/abi"

const infuraId = process.env.INFURA 
const provider = new ethers.providers.Web3Provider(window.ethereum)

const stakingContract = new ethers.Contract(stakingRecipient, stakingAbi, provider) //todo merge clarlito staking contract 


export const stakingBooks = async () => {
    
    const block = await provider.getBlockNumber()
    const receipt = await provider.getTransactionReceipt(block)
}


// export const useStakingContract = (stakingRecipient, abi, provider) => {


    //  const block = await provider.getBlockNumber()
    //  console.log(`\nBlock Number: ${block}\n`)

    //  const blockInfo = await provider.getBlock(block)
    //  console.log(blockInfo)

    //  const { transactions } = await provider.getBlockWithTransactions(block)
    // console.log(`\nLogging first transaction in block:\n`)
    //  console.log(transactions[0])
    
//     const gasPrice = stakingContract.getGasPrice();
//     const wallet = ethers.Wallet.createRandom();
//     console.log({wallet});;
//     //const wallet = ethers.Wallet.fromMnemonic("Mnemonic from the wallet you created in the .createRandom() or from your own wallet");
//     const signer = wallet.connect(stakingContract);

//     const tx= {
//         from: wallet.address,
//         to: stakingRecipient,
//         value: ethers.utils.parseUnits("0.001","ether"),
//         gasPrice: gasPrice,
//         nonce: stakingContract.getTransactionCount(wallet.address,"latest"),
//         gasLimit: ethers.utils.hexlify(100_000)
//     }
//     console.log("tx",tx);


// }