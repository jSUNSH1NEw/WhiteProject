
import {  useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { ethers } from "ethers";
import {erc20Abi, erc20Recipient } from "../utils/abi"

const provider = new ethers.providers.Web3Provider(window.ethereum)

const tokenContract = new ethers.Contract(erc20Recipient, erc20Abi, provider)


// Signer represents ethereum wallet in ethers.js. You cannot just send
// transactions with only provider, you will need signer (wallet) for this.
const signer = provider.getSigner();

export const useGetBalance = () => {
  const [balance, setBalance] = useState(0);
  // Using React ref here to prevent component re-rendering when changing
  // previous balance value
  const prevBalanceRef = useRef(0);

  const fetchBalance = useCallback(async () => {
    const address = await signer.getAddress();
    console.log(address);

    const rawBalance = await provider.getBalance(address);
    // Format ETH balance and parse it to JS number
    const value = parseFloat(ethers.utils.formatEther(rawBalance));

    // Optimization: check that user balance has actually changed before
    // updating state and triggering the consuming component re-render
    if (value !== prevBalanceRef.current) {
      prevBalanceRef.current = value;
      setBalance(value);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    // Fetch user balance on each block
    provider.on('block', fetchBalance);

    // Cleanup function is used to unsubscribe from 'block' event and prevent
    // a possible memory leak in your application.
    return () => {
      provider.off('block', fetchBalance);
    };
  }, [fetchBalance]);

  return balance;
}

export const erc20BaseListener = async () => {
  const name = await tokenContract.name
  const symbol = await tokenContract.symbol
  const totalSupply = await tokenContract.totalSupply
  console.log(`\nReading from ${erc20Recipient}\n`)
  console.log(`Name: ${name}`)
  console.log(`Symbol: ${symbol}`)
  console.log(`Total Supply: ${totalSupply}\n`)

  //const balance = await tokenContract.balanceOf('erc20Recipient')
  const balance = await provider.getBalance(erc20Recipient) //adress of erc20
  console.log(`\nWRN Balance of ${erc20Recipient} --> ${ethers.utils.formatEther(balance)} ETH\n`)

  console.log(`Balance Returned: ${balance}`)
  console.log(`Balance Formatted: ${ethers.utils.formatEther(balance)}\n`)

}


export const erc20Books = async () => {
  const name = await erc20Recipient.name()
  const symbol = await erc20Recipient.symbol()
  const totalSupply = await erc20Recipient.totalSupply()
  const initTime = await erc20Recipient.initialTime()

  console.log(`\nReading from ${erc20Recipient}\n`)
  console.log(`Name: ${name}`)
  console.log(`Symbol: ${symbol}`)
  console.log(`Total Supply: ${totalSupply}\n`)

  const balance = await erc20Recipient.balanceOf('')

  console.log(`Balance Returned: ${balance}`)
  console.log(`Balance Formatted: ${ethers.utils.formatEther(balance)}\n`)
}



export const useErc20Contract = (erc20Recipient, TOKENABI, provider) => {
  return useMemo(() => {
    try {
      if(!erc20Recipient || !TOKENABI || !provider) return null;
      return new ethers.Contract(erc20Recipient, TOKENABI, provider);
    } catch (error) {
      console.log('Failed to get contract', error);
      return null;
    
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[])
}

export const burnSupply = async() => {
  const distributeToT = await tokenContract.distributedLockedSupplyTeams()
  const distributeToR = await tokenContract.distributedLockedSupplyReserve()

  console.log(`\nDistribute to ${distributeToT}\n`)
  console.log(`\nDistribute to ${distributeToR}\n`)
  
}