import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { ethers } from "ethers";


import { stakingAbi, stakingRecipient, erc20Recipient, erc20Abi } from "../../../../utils/abi";

import {
  Typography,
  Button,
  Box,
  Card,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import WarenBlackLogo from "../../../../assets/logoBlack.png";
import closeIcon from "../../../../assets/close.svg";



export default function Staking({ accounts }) {
  // general state 

  const [isStaked, setStaked] = useState(false);
  const [stakeBalance, setStakeBalance] = useState(0)
  const [firstStakeOf, setFirstStakeOf] = useState(0)

  // staking state
  
  const [allowance, setAllowanceWRN] = useState(0)
  const [userAmount, setUserAmount] = useState(0)
  
  //helper 
  const [stakingAction, setStakingAction] = useState()
  const [erc20Action, setErc20Action] = useState()
  const [provider, setProvider] = useState();

  const toWei = ether => ethers.utils.parseEther(ether)
  const toEther = wei => ethers.utils.formatEther(wei)

  const signer = useMemo(()=> {
    if (!provider) return
    return provider.getSigner()
  } 
  , [provider])

  // Ui state 
  const [loading, setLoading] = useState(false);
  const [poolStatus, setPoolStatus] = useState(false);
  const [apy, setApy] = useState("0");
  const [displayModal, setDisplayModal] = useState(false);
  const [inputValue, setInputValue] = useState("0");
  //Infinite approve
  const isApproved = useMemo(() => Number(ethers.utils.formatEther(allowance)) >= Number(inputValue), [inputValue, allowance])
  

  const refreshAllowance = async () => {
    console.log("refresh allowance")
    const allowance = await erc20Action.allowance(
      accounts[0],
      stakingRecipient
    );
    setAllowanceWRN(allowance);
  };

  const refreshStakeBalance = async () => {
    const userBalance = await stakingAction.balanceOf(accounts[0])
      const tokenUnit = await erc20Action.decimals()
      const blockState = await stakingAction.firstStakeOf(accounts[0])
      const hydrated = ethers.utils.formatUnits(userBalance,tokenUnit)
      setFirstStakeOf(blockState)
      setStakeBalance(hydrated)
  }


  const refreshApy = async () => {
    if (!stakingAction) return;
    const userApy = await stakingAction.rewardPerToken()
    const tokenUnit = await erc20Action.decimals()
    const hydrated = ethers.utils.formatUnits(userApy,tokenUnit)
    console.log(hydrated)
      setApy(hydrated)
}

  const refreshIsStake = async () => {
    if(!stakingAction) return;
    try {
      const earned = await stakingAction.firstStakeOf(accounts[0])
      const tx = await earned.wait()
      if (!tx) {
        setStaked(!true)
      } else {
        setStaked(!false)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (!erc20Action) return;
    refreshAllowance();
  }, [accounts, erc20Recipient, erc20Action, inputValue]);

  useEffect(() => {
    if (!stakingAction) return;
  }, [accounts, stakingRecipient, stakingAction]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (accounts.length > 1) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    
  }, [accounts]);

  useEffect(()=> {
    if (!signer) return;
    setStakingAction(new ethers.Contract(stakingRecipient, stakingAbi, signer));
    setErc20Action(new ethers.Contract(erc20Recipient, erc20Abi, signer));
   }, [signer])


   useEffect(() => {
    setLoading(true);
    readPoolStatus()
    stakedSupply()
    refreshApy()
    refreshIsStake()
    setLoading(false);
  }, [stakingAction,erc20Action]);


  const readPoolStatus = async () => {
    if (!stakingAction) return;
    //  fetching balance of wrn token and storing in state
    let tx = await stakingAction.notPaused()
    console.log(tx)
  if (!tx) {
    setPoolStatus(tx)
  }
  }


  const handleApproveErc20 = async () => {
    try {
      const tx = await erc20Action.approve(
        stakingRecipient,
        ethers.constants.MaxUint256
      );
      await tx.wait()
      refreshAllowance()
    } catch (error) {
      console.log("error", error.message);
    }
  }

  
  async function stakeHandler(_amount) {

     if (inputValue === "" || inputValue === undefined || inputValue === " ")
       return console.log("Not a valid amount");
      
    try {
      const tx = await stakingAction.stake(ethers.utils.parseEther(inputValue));
      await tx.wait()
      console.log(tx);
      refreshIsStake()
    } catch (error) {
      console.log("error", error.message);
    }
  }

  async function unstakeHandler() {
    
    if (inputValue === "" || inputValue === undefined || inputValue === " ")
    return console.log("Not a valid amount");
   
    try {
      const tx = await stakingAction.unstake(ethers.utils.parseEther(inputValue));
      await tx.wait()
      console.log(tx);

      } catch (error) {
      console.log("error", error.message);
      }

}

  async function claimHandler(_amount)  {
    const userBalance = await stakingAction.balanceOf(accounts[0])
    const hydrated = ethers.utils.formatUnits(userBalance)

      try {
        const unstake = await stakingAction.unstake(ethers.utils.parseEther(hydrated))
        await unstake.wait()
        const claim = await stakingAction.claimReward();
        await claim.wait()
  
        } catch (error) {
        console.log("error", error.message);
        }
      
  }

  async function claimHandlerByInput(_amount)  {
    if (inputValue === "" || inputValue === undefined || inputValue === " ")
    return console.log("Not a valid amount");

      try {
        const unstake = await stakingAction.unstake(ethers.utils.parseEther(inputValue))
        await unstake.wait()
        const claim = await stakingAction.claimReward();
        await claim.wait()
  
        } catch (error) {
        console.log("error", error.message);
        }
      
//  setUnstaked(true)
  }

  async function stakedSupply() {
    if (!stakingAction) return;
    refreshStakeBalance()
  }

  const handleModal = () => {
    setDisplayModal(!displayModal);
  };

  const inputChangeHandler = (event) => {
    event.preventDefault();
    if (
      parseInt(event.target.value) <= 0 ||
      parseInt(event.target.value) > 15000
    )
      return;
    setInputValue(event.target.value);
  };

  const goMax = () => {
    setInputValue(15000);
  };

  const uiDescArray = [{
    left:"Token",
    right:"WRN"
  },
{
  left:"Type",
  right:"1:1"
}, {
  left:"Status",
  right:!poolStatus ?  "Active" : "Inactive",
}, {
  left:"Balance",
  right: stakeBalance,
}, {
left:"Reward rate",
right: apy,
}
]

const MessageBeforeLaunch = () => {
  return (
    <>
                 <Box display="flex" flexDirection="column">
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
                                This system is ready.
                                </Typography>
                                <Typography variant="h5">
                                Waiting to be launched by the admin.
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
                                }} href="/dashboard/home">
                                    Return home
                                </Button>
                            </Box>
                         </Card>
                    </Box>
                  </Box>
    </>
  );
};

  return (
    <>
      {/* <Box
        height="calc(100vh-100px)"
        position="absolute"
        top="100px"
        p="40px"
        className="wrapper"
      >
        <Card
          sx={{
            maxWidth: "80%",
            margin: "0 auto",
            borderRadius: "20px",
            background: "rgba( 255, 255, 255, 0.35 )",
            boxShadow:
              "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
            backdropFilter: "blur( 10px )",
            border: "1px solid #fff",
          }}
        >
          <Box  sx={{m:"40px 70px 50px", display:"flex", justifyContent:"center"}}>
            <img src={WarenBlackLogo} alt="logo waren" width="auto" height="50px" />
            </Box>
            {uiDescArray.map((item,index) => {
              return (
              <Box key={index} textAlign="center" sx={{m:"20px 70px 20px", display:"flex", justifyContent:"space-between",}}>
                <Typography sx={{ color: "rgb(18, 124, 255)",fontSize: "1.2rem"}}>
                  {item.left}
                </Typography>
                <Typography sx={{fontSize: "1.2rem"}}>
                  {item.right}
                </Typography>
              </Box>
              )
            })}
            <Box sx={{m:"70px 70px 40px", display:"flex", justifyContent:"space-between"}}>

              <Button sx={{
                  background: "rgb(18, 124, 255)",
                  borderRadius: "20px",
                  color: "white",
                  width:"200px",
                  border:"2px solid rgb(15, 101, 206)",
                  ":hover": {
                    background: "rgb(15, 101, 206)",
                    },
                  }} onClick={handleModal}>
                    Deposit
                </Button>
              {!isStaked && (
                <>
                <Button
                onClick={() => claimHandler()}
                variant="contained"
                sx={{
                  background: "rgb(18, 124, 255)",
                  borderRadius: "20px",
                  color: "white",
                  width:"200px",
                  border:"2px solid rgb(15, 101, 206)",
                  ":hover": {
                    background: "rgb(15, 101, 206)",
                  },
                }}
              >
                Claim total
              </Button>
                </>
              )}
              </Box>
        </Card>
      </Box> */}

      {/* Modal */}

      {/* <Fade in={displayModal}>
        <Box
          position="absolute"
          left="0"
          top="0"
          bottom="0"
          right="0"
          zIndex="99999999"
          sx={{
            background: "rgba( 255, 255, 255, 0.35 )",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            backdropFilter: "blur( 10px )",
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="modal"
          width="100%"
          borderRadius="10px"
        >
          <Card
            sx={{
              padding: "40px 0px 40px 80px",
              position: "relative",
              display: "flex",
              textAlign: "center",
              borderRadius: "10px",
              alignItems:"center"
            }}
            className="modal-content"
          >
            <img onClick={handleModal} src={closeIcon} alt="icon" />
            <Box width="90%">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="2rem"
                sx={{}}
              >
                <Typography
                  variant="h2"
                  sx={{
                    textAlign: "left",
                    fontSize: {xs: "1.8rem", md:"1.8rem", xl:"2.4rem",},
                  }}
                >
                  Staking pool 
                </Typography>
                <Box
                  marginLeft="20px"
                  display="flex"
                  alignItems="center"
                  sx={{
                    background: !poolStatus ? "rgb(18, 124, 255)" : "#CC0000",
                    borderRadius: "50px",
                    padding: "10px 20px 5px 20px",
                    color: "white",
                  }}
                >

                  {!poolStatus ?  "Active" : "Inactive"}
                  
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ color: "#545454", fontWeight: "normal" }}
              >
                Waren let you the choice to make your token rewarded by the nft vesting 
              </Typography>
              <Typography
                variant="p"
                sx={{ color: "#545454", fontWeight: "normal" }}
              >
                 into 1:1 internal staking system 
              </Typography>
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginTop="20px"
              >
                <TextField
                  onChange={(e) => inputChangeHandler(e)}
                  value={inputValue}
                  label="Amount"
                  type="number"
                ></TextField>
                <Button
                  onClick={goMax}
                  variant="contained"
                  sx={{
                    height: "55px",
                    marginLeft: "10px",
                    background: "rgb(18, 124, 255)",
                    borderRadius: "20px",
                  }}
                >
                  MAX
                </Button>
              </Box>

              {!isApproved && (
                <Button
                  onClick={handleApproveErc20}
                  sx={{
                    background: "rgb(15, 101, 206)",
                    color:"white",
                    width:"100%",
                    border:"2px solid rgb(15, 101, 206)",
                    borderRadius: "20px",
                    mb:"10px",
                    ":hover": {
                      background: "rgb(15, 62, 180)",
                    },
                  }}
                >
                  Approve
                </Button>
              )}
              <Button
                onClick={stakeHandler}
                disabled={!isApproved}
                variant="contained"
                sx={{
                  width: "70%",
                  marginTop: "40px",
                  padding: "11px 0",
                  background: "rgb(18, 124, 255)",
                  borderRadius: "20px",
                  border:"2px solid rgb(15, 101, 206)",
                  ":hover": {
                    background: "rgb(15, 101, 206)",
                  },
                }}
              >
                Stake
              </Button>

               {!isStaked && (
                <>
                <Button
                onClick={() => claimHandlerByInput()}
                variant="contained"
                sx={{
                  width: "70%",
                  marginTop: "17px",
                  padding: "11px 0",
                  background: "rgb(18, 124, 255)",
                  borderRadius: "20px",
                  border:"2px solid rgb(15, 101, 206)",
                  ":hover": {
                    background: "rgb(15, 101, 206)",
                  },
                }}
              >
                Claim unit
              </Button>
                </>
              )}
            </Box>
          </Card>
        </Box>
      </Fade> */}

      <MessageBeforeLaunch />

      <Routes>
        <Route path="/dashboard:id" element={<Staking />} />
      </Routes>
    </>
  );
};

