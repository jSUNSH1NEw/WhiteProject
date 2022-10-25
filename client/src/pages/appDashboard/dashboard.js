import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import {Box} from "@mui/material";
// COMPONENTS IMPORT
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function XDashboard() {
  const path = useLocation().pathname;

  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [goodNetwork, setGoodNetwork] = useState(false);
  const [metamaskInstall, setMetamaskInstall] = useState();
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState();


  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.addListener('connect', async (response) => {
      getAccounts()
    })

    window.ethereum.on('accountsChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('disconnect', () => {
      window.location.reload()
    })
  }

  useEffect(() => {
    async function getInfos() {
      if (typeof window.ethereum !== "undefined") {
        setMetamaskInstall(false);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const { chainId } = await provider.getNetwork();
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          console.log(address);
          if (chainId !== 56) { //TODO  need change to mainnet before prod
            setGoodNetwork(false);
            return;
          } 
          else {
            setGoodNetwork(true);
          }
        } catch (error) {
          console.log("error", error.message);
        }
      } else {
        setMetamaskInstall(true);
      }
    }

    getInfos();
  }, []);

  async function getAccounts() {
    if (typeof window.ethereum !== "undefined") {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccounts(accounts);
      setIsConnected(true);
    }
  }

  useEffect(() => {
    if (!metamaskInstall && goodNetwork) {
      getAccounts();
    }
 
  }, 
  [goodNetwork, metamaskInstall]);

  const handleConnect = () => {
    getAccounts();
  };

  const handleSidebar = () => {
    setDisplaySidebar(!displaySidebar);
  };


  return (
    <div id="dashboard">
      <Sidebar
        goodNetwork={goodNetwork}
        accounts={accounts}
        display={displaySidebar}
        close={() => setDisplaySidebar(false)}
      />
      <Box className="container" sx={{ height:"fit-content"}}>
        <Header
          account={accounts}
          isConnected={isConnected}
          connect={handleConnect}
          title={
            path === "/dashboard/home"
              ? "Home"
              : path === "/dashboard/nft-chest"
              ? "Chest"
              : path === "/dashboard/staking"
              ? "Staking"
              : path === "/dashboard/mint"
              ? "Mint"
              : path === "/dashboard/referal"
              ? "Referal"
              : ""
          }
          openSidebar={handleSidebar}
        />
        <Routes>
          <Route path="/dashboard/*" element={<XDashboard />} />
        </Routes>
      </Box>
    </div>
  );
}

