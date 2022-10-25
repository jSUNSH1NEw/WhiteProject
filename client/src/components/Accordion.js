import React, { useState } from "react";

import Up from "../assets/chevron-up-solid.svg"
import Down from "../assets/chevron-down-solid.svg"

export function Accordion({
    title,
    children
}) {

    const [display, setDisplay] = useState(false)

    return(
        <div id="accordion" onClick={() => setDisplay(!display)}>
            <div className="header">
                <h5>{title}</h5>
                {
                    display ?
                    <img src={Up} alt="up" />
                    :
                    <img src={Down} alt="down" />
                }
            </div>
                {
                    display ?
                    <div className="content">{children}</div> 
                    : ""
                }
        </div>
    )
}