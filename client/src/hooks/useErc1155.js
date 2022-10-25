import {  useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { ethers } from "ethers";
import {nftAbi, nftRecipient } from "../utils/abi"

const provider = new ethers.providers.Web3Provider(window.ethereum)

const NftConstract = new ethers.Contract(nftRecipient, nftAbi, provider) //TODO To refacto 




export const nftBooks = async () => {
    
}

export const useNftCallback = async () => {
    const callback = useRef()
    const [nftCollection, setNftCollection] = useState(null)
    const [nftCallback, setNftCallback] = useState(null)

    useEffect(() => {
        if ( callback) {
            callback.current = callback;
            
}