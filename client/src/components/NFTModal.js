import React, { useState, useEffect } from "react"
import ReactPlayer from "react-player"

import nft1 from "../assets/NFT-Waren-gold-1x1.mp4";
import nft2 from "../assets/NFT-Waren-black-1x1.mp4";
import nft3 from "../assets/NFT-Waren-blanc-1x1.mp4";
import nft4 from "../assets/NFT-Waren-bleu-1x1.mp4";
import Close from "../assets/close.svg"

import 'animate.css'

export default function NFTModal({
    show,
    onClose,
    text,
    id
}) {
    return(
        <>
            <div id="modal" className={show ? "animate__animated animate__fadeIn animate__faster" : "d-none"}>
                <div className="modal">
                    <div id="close" onClick={onClose}>
                        <img src={Close} alt="close" />
                    </div>
                    <div className="left">
                        <ReactPlayer
                            url={
                                id === 1 ?
                                nft1 : 
                                id === 2 ?
                                nft2 :
                                id === 3 ?
                                nft3 :
                                id === 4 ?
                                nft4 : ""
                            }
                            playing
                            muted
                            loop
                            className="reactPlayer"
                        />
                        <button onClick={() => alert(id)}>Vesting</button>
                    </div>
                    <p>{text}</p>
                </div>
            </div>
        </>
    )
}