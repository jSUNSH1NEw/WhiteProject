import React from "react";
import { Link, useLocation } from "react-router-dom"

import Logo from "../assets/logo.png";

export function Navbar() {

    const location = useLocation();

    return(
        <>
            <nav>
                <div className="brand">
                    <img src={Logo} alt="logo" />
                </div>
                <ul>
                    <li className={location.pathname === "/" ? "active" : ""}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={location.pathname === "/mint" ? "active" : ""}>
                        <Link to="/mint">Mint</Link>
                    </li>
                    <li className={location.pathname === "/referral" ? "active" : ""}>
                        <Link to="/referral">Referral</Link>
                    </li>
                    <li className={location.pathname === "/referral" ? "active" : ""}>
                        <Link to="/dashboard">App</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}