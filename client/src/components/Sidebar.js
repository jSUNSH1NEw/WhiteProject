import React from "react";
import { Link as Links, useLocation, Routes, Route } from "react-router-dom";

import Logo from "../assets/logo.png";

import HomeIcon from "../assets/icons/home.svg"
import NFTChestIcon from "../assets/icons/nft-chest.svg"
import StakingIcon from "../assets/icons/staking.svg"
import MarketplaceIcon from "../assets/icons/marketplace.svg"
import WarenBlackLogo from "../assets/logoBlack.png";
// import StakingPoolIcon from "../assets/icons/staking-pool.svg"
import SwapIcon from "../assets/icons/swap.svg"
// import CloseMenuIcon from "../assets/closeMenu.svg"
import { Box, Card, Button, Typography, Drawer, ListItemButton } from "@mui/material";
import GradingIcon from '@mui/icons-material/Grading';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SavingsIcon from '@mui/icons-material/Savings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import SettingsAccessibilityOutlinedIcon from '@mui/icons-material/SettingsAccessibilityOutlined';

import Home from "../pages/appDashboard/components/Home/index.js"
import NFTChest from "../pages/appDashboard/components/Nftchest";
import Staking from "../pages/appDashboard/components/Staking";
import Mint from "../pages/appDashboard/components/Mint";
import Referal from "../pages/appDashboard/components/Referal";

export default function Navbar({
    display,
    close,
    goodNetwork,
    accounts,
    messages
}) {

    const path = useLocation().pathname;

    return(
        <>
            <Box 
                width="20%" 
                bgcolor={"white"}
                borderRight="2px solid #fff"
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    background: "rgb(18, 124, 255)"
                }}
                className="sidebar"
            >
                <img src={Logo} alt="logo"/>
                <ul>
                    <Links to="home">
                        <li className={path === "/dashboard/home" ? "active" : ""}>
                            <img src={HomeIcon} alt="Home Waren icon" />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Home</Typography>
                        </li>
                    </Links>
                    <Links to="mint">
                        <li className={path === "/dashboard/mint" ? "active" : ""}>
                            <img src={MarketplaceIcon} alt="Mint Waren nft icon" />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Mint</Typography>
                        </li>
                    </Links>
                    <Links to="nft-chest">
                        <li className={path === "/dashboard/nft-chest/*" ? "active" : ""}>
                            <img src={NFTChestIcon} alt="Nft-Vesting Waren Icon" />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Chest</Typography>
                        </li>
                    </Links>
                    <Links to="staking">
                        <li className={path === "/dashboard/staking" ? "active" : ""}>
                            <img src={StakingIcon} alt="Staking 1:1 Waren icon" />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Staking</Typography>
                        </li>
                    </Links>
                    <Links to="referal">
                        <li className={path === "/dashboard/referal" ? "active" : ""}>
                            <SettingsAccessibilityOutlinedIcon sx={{width:"25px",mr:"16px", ml:"-3px"}} />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Referral</Typography>
                        </li>
                    </Links>
                    <a href="https://waren-community.gitbook.io/waren-unofficial-docs/v/waren-fr/" target="blank">
                        <li>
                        <MenuBookIcon sx={{width:"23px",mr:"16px", ml:"-1px"}} />
                            <Typography variant="p" fontSize="1.2rem" mt="5px">Docs</Typography>
                        </li>
                    </a> 
                </ul>
            </Box>
            <Drawer
                anchor="left"
                open={display}
                onClose={close}
                PaperProps={{
                    sx: {
                        width: {xs: "60%", md:"22%", xl:"17%" },
                    }
                 
                }}
            >
                <Box m="0 20px" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="sidebar-responsive">
                    <ul style={{width: "100%"}}>
                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <CottageOutlinedIcon sx={{width:"23px",mr:"16px", ml:"-30px"}} />
                            <Links to="/dashboard/home" style={{ color: "rgb(18, 124, 255)",alignItems:"center" }}>Home</Links>
                        </ListItemButton>

                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <LocalMallIcon sx={{width:"23px",mr:"16px", ml:"-40px"}} />
                            <Links to="/dashboard/mint" style={{ color: "rgb(18, 124, 255)" }}>Mint</Links>
                        </ListItemButton>

                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <BusinessCenterIcon sx={{width:"23px",mr:"16px", ml:"-1px"}} />
                            <Links to="/dashboard/nft-chest" style={{ color: "rgb(18, 124, 255)" }}>Nft Chest</Links>
                        </ListItemButton>
                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <SavingsIcon sx={{width:"23px",mr:"16px", ml:"-15px"}} />
                            <Links to="/dashboard/staking" style={{ color: "rgb(18, 124, 255)" }}>Staking</Links>
                        </ListItemButton>
                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <SettingsAccessibilityOutlinedIcon sx={{width:"23px",mr:"16px", ml:"-15px"}} />
                            <Links to="/dashboard/referal" style={{ color: "rgb(18, 124, 255)" }}>Referal</Links>
                        </ListItemButton>
                        <ListItemButton sx={{
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "center"
                        }}>

                            <a href="https://waren-community.gitbook.io/waren-unofficial-docs/v/waren-fr/" target="blank">
                                <li>
                                    <MenuBookIcon sx={{width:"23px",mr:"16px", ml:"-31px", color:"black"}} />
                                    <Typography variant="p" fontSize="1.1rem" color="rgb(18, 124, 255)">Docs</Typography>
                                </li>
                            </a> 
                        </ListItemButton> 
                    </ul>
                </Box>
            </Drawer>

            <Box display="flex" flexDirection="column">
                {
                !goodNetwork || accounts.length <= 0 ? (
                    <Box
                    display="flex"
                    position="absolute"
                    textAlign="center"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                    className="goodNetwork"
                    >
                        <Card sx={{
                            maxWidth: "80%",
                            margin: "0 auto",
                            borderRadius: "20px",
                            background: "rgba( 255, 255, 255, 0.35 )",
                            boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
                            backdropFilter: "blur( 10px )",
                            border: "1px solid #fff",
                        }}>
                            <Box  sx={{m:"40px 70px 20px"}}>
                                <img src={WarenBlackLogo} alt="logo waren" width="auto" height="50px" />
                            </Box>
                            <Box textAlign="center" sx={{m:"0px 70px 0px"}}>
                                <Typography variant="h5">
                                Press connect and Switch to the BSC Network.
                                </Typography>
                                <Typography variant="h5">
                                Or install metamask. 
                                </Typography>
                            </Box>
                            <Box sx={{m:"70px 70px 40px"}}>
                                <Button sx={{
                                    background: "rgb(18, 124, 255)",
                                    borderRadius: "20px",
                                    color: "white",
                                    width:"250px",
                                    border:"2px solid rgb(15, 101, 206)",
                                    ":hover": {
                                    background: "rgb(15, 101, 206)",
                                    },
                                }} href="https://metamask.io/" target="_blank">
                                    Install MetaMask
                                </Button>
                            </Box>
                         </Card>
                    </Box>
                    ) : (
                        <Box className='routerDrawer'>
                            <Routes>
                                <Route path="Home" element={<Home accounts={accounts} messages={messages} />} />
                                <Route path="nft-chest/*" element={<NFTChest accounts={accounts}/>} />
                                <Route path="staking/*" element={<Staking  accounts={accounts}/>} />
                                <Route path="referal/*" element={<Referal accounts={accounts} />} /> 
                                <Route path="mint/*" element={<Mint accounts={accounts} />} />
                            </Routes>
                        </Box>

                    )
                }
            </Box>
        </>
    )
}