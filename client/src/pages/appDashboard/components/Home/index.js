import React, { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";

import { Routes, Route } from "react-router-dom";
import { Card, Grid, Typography, Button, Box, TextField } from "@mui/material";
// import VEsting camcuate the reward GetvestingReward
//import staking for calculate  the reward GetStakingReward
import {
  erc20Abi,
  erc20Recipient,
  vestingAbi,
  vestingRecipient,
  stakingRecipient,
  stakingAbi,
} from "../../../../utils/abi";
import closeIcon from "../../../../assets/close.svg";

const owner = "0x6390499Ef56F05A832e7f87c720ea633823d1783"; 

const trueOwner = '0xc48df0355e107fbe0aaa753510017ff63639cd1f';
const wrn3account = '0xfb55Ec7D49058d7ABb072A47340d78C2ac0e8D4c'; 
const wrn1account = '0x47F13C35171bfC9690d4823128CC86b60DCFe1b2';

//true array  ownerTableAccount = [0,0,0]

export default function Home({ accounts }) {

  //general state 
  const [erc20Contract, setErc20Contract] = useState();
  const [stakingContract, setStakingContract] = useState();
  const [vestingContract, setVestingContract] = useState();

  
  // owner state 
  const [changeOwner, setChangeOwner] = useState(undefined);
  const [pause, setPause] = useState();
  const [burnCallbackMessage, setBurnCallbackMessage] = useState();
  const [allowance, setAllowanceWRN] = useState(0)
  const [availableRewards, setAvailableRewards] = useState()
  
  // Vesting + staking state

  //Stake
  const [refreshStakingForAll, setIsRefreshStakingForAll] = useState()
  const [claimedAmount, setClaimedAmount] = useState()
  const [claimableAmount, setClaimableAmount] = useState()

  //Vesting
  const [refreshVestingForAll, setIsRefreshVestingForAll] = useState()
  const [claimedVestingAmount, setClaimedVestingAmount] = useState()
  const [claimableVestingAmount, setClaimableVestingAmount] = useState()
  const [unvestBalance, setUnvestBalance] = useState()


  // helpers
  const [provider, setProvider] = useState();
  const toWei = ether => ethers.utils.parseEther(ether)
  const toEther = wei => ethers.utils.formatEther(wei)
    
  // Ui state 
  const [isOwner, setIsOwner] = useState(false);
  const [stakingIsActive, setStakingIsActive]= useState()
  const [displayModal, setDisplayModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const signer = useMemo(() => {
    if (!provider) return;
    return provider.getSigner();
  }, [provider]);

  const refreshStakingSupply = async () => {
    const userBalance = await stakingContract.balanceOf(accounts[0])
    const tokenUnit = await erc20Contract.decimals()
    const hydrated = ethers.utils.formatUnits(userBalance,tokenUnit)
    console.log(hydrated)
    setIsRefreshStakingForAll(hydrated);
  };

  const refreshClaim = async () => {
    if (!stakingContract) return;
    const userEarn = await stakingContract.earned(accounts[0])
    const tokenUnit = await erc20Contract.decimals()
    const hydrated = ethers.utils.formatUnits(userEarn,tokenUnit)
    setClaimableAmount(hydrated)
      // setClaimedAmount(txClaimed)
    const userClaim = await stakingContract.userRewardPerTokenPaid(accounts[0])
    const hydratedClaim = ethers.utils.formatUnits(userClaim,tokenUnit)
    console.log(hydratedClaim)
    setClaimedAmount(hydratedClaim)
}

  const refreshVestingSupply = async () => {
    const refresh = await vestingContract.getAllStakedERC1155(accounts[0]);
    const refreshUnit = await vestingContract.getStakedERC1155(accounts[0],1);
  //   const claimed = await vestingContract?.stakers(accounts[0])
  //   const testClaimEventEmit = await vestingContract.on("RewardClaimed", ( owner, reward) => {
  //   console.log(reward);
  // });
    const availableRewardInDays = await vestingContract.stakingMinimalUnlock()

    const hydrate = refresh.find((id) => Number(id))
    const hydrated = ethers.utils.formatUnits(refresh)
    console.log(refresh)
    setIsRefreshVestingForAll(refresh);
    // setClaimedVestingAmount(testClaimEventEmit)
    // setClaimableVestingAmount()
    setAvailableRewards(availableRewardInDays)

  };

   const refreshPoolStatus = async () => {
     if (!stakingContract) return;
     //  fetching balance of wrn token and storing in state
     let tx = await stakingContract.notPaused()
   if (!tx) {
     setStakingIsActive(!tx)
    }
   }


  useEffect(() => {
    if (!erc20Contract) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, erc20Recipient, erc20Contract]);

  useEffect(() => {
    if (!stakingContract) return;
    refreshStakingSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, stakingRecipient, stakingContract]);

  useEffect(() => {
    if (!vestingContract) return;
    refreshVestingSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, vestingRecipient, vestingContract]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (accounts.length > 1) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  
  }, [accounts]);

  useEffect(() => {
    if (!signer) return;
    setErc20Contract(new ethers.Contract(erc20Recipient, erc20Abi, signer));
    setStakingContract(new ethers.Contract(stakingRecipient, stakingAbi, signer));
    setVestingContract(new ethers.Contract(vestingRecipient, vestingAbi, signer));
  }, [signer]);

  useEffect(() => {
    setLoading(true);
    fetchDataFromBlockchain()
    refreshPoolStatus()
    refreshClaim()
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20Contract,stakingContract,vestingContract]);



  const fetchDataFromBlockchain = async () => {
      if (!erc20Contract) return;
      const totalsupplytx = await erc20Contract.totalSupply()
      const userBalance = await signer.getBalance();
      const balanceInEther = ethers.utils.formatEther(userBalance);
      const tokenBalance = await erc20Contract.balanceOf(accounts[0])
      const tokenUnit = await erc20Contract.decimals()
      const balanceWrnInEther = ethers.utils.formatUnits(tokenBalance,tokenUnit)
      // handleOwner()
      handlePoolStatus()

    };

  const handleOwner = async () => {
    if (!erc20Contract || !stakingContract || !vestingContract) return;
    // call the owner function from the contract
    const owner = await erc20Contract.owner();
    if (accounts.toLowerCase() === owner.toLowerCase()) { 
     // nft owner function
     
     // erc20 owner function
     const distributeToT = await erc20Contract.distributedLockedSupplyTeams()
     const distributeToR = await erc20Contract.distributedLockedSupplyReserve()
     
     //vesting owner function
     const burnExcedent = await vestingContract.burnExcededSupplyERC20() // need alowance function 
     const PauseVesting = await vestingContract.setPause()
     const unlockPerdiodVesting = await vestingContract.unlockPerdiod()

     //staking owner function
     const setPauseStaking = await stakingContract.setPause()
     const rewardDuration = await vestingContract.setRewardDuration()
     setIsOwner(true);

   } else {
     console.log("Not owner");
     setIsOwner(false);
   }
};

  const getStakingInfos = async () => {
    if (!stakingContract) return;
      //  fetching balance of wrn token and storing in state
      let stakingBalance = await stakingContract.balanceOf(accounts[0])
      let convertedBalance = window.ethers.utils.formatEther(
        stakingBalance.toString(),
        "18"
      );
      setIsRefreshStakingForAll(convertedBalance);

      let parsedBalance = ethers.utils.parseUnits(
        stakingBalance.toString(),
        "ether"
      );
      //fetching first staking of user
      const userTemperature = await stakingContract.firstStakeOf(accounts[0]);

      //updating total staked balance
    if (userTemperature) {
      //  fetching total staked TokenStaking  and storing in state
      let userBalance = await stakingContract.earned(accounts[0])

      let convertedBalance = ethers.utils.formatEther(userBalance);

      //checking reward per token stored in staking
      let tempTotalStaked = await stakingContract.rewardPerTokenStored(accounts[0])
      convertedBalance = ethers.utils.formatEther(tempTotalStaked);
      setIsRefreshStakingForAll(convertedBalance);
    } else {
      window.alert(
        "Staking contract is not deployed on this network, please change to testnet"
      );
    }
  };

  async function getVestingRewards() {

  }


  const handlePoolStatus = async () => {
    try {
      const tx = await stakingContract.notPaused();
      await tx.wait();
      refreshPoolStatus()
    } catch (error) {
      
    }
  }

  const handleModal = () => {
    setDisplayModal(!displayModal);
  };



  //UI Fragment card for user statement 
  const StakingCardDetails = () => {
    return (
      <>
      <Card
          sx={{
            maxWidth: "80%",
            margin: "0 auto",
            borderRadius: "20px",
            background: "rgba( 255, 255, 255, 0.35 )",
            boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
            backdropFilter: "blur( 10px )",
            border: "1px solid #fff",
          }}
        >
          <Box m="20px" textAlign="center">
            <Typography variant="h5" sx={{
              color: "rgb(18, 124, 255)"
            }}>
              Staking details
            </Typography>
          </Box>
          <Box
            sx={{
              background: "white",
              borderRadius: "0 0 20px 20px",
              padding: "40px",
            }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Stake balance
                </Typography>
                <Typography
                  width="200px" 
                  noWrap
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                  }}
                >
                  {refreshStakingForAll ? refreshStakingForAll : 0} 
                </Typography>
                <Typography
                  variant="p"
                  color="black"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                    mb:{xs: "10px", mb:"15px"},
                  }}
                ></Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Already claimed
                </Typography>
                <Typography
                  width="200px" 
                  noWrap
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    mt:"5px",
                    mb:{xs: "10px", mb:"15px"},
                  }}
                >
                  {claimedAmount ? claimedAmount : 0} 
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Available reward
                </Typography>
                <Typography
                  width="200px" 
                  noWrap
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    mt:"5px",
                    mb:{xs: "10px", mb:"15px"},
                  }}
                >
                  {claimableAmount ? claimableAmount : 0}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Stake status
                </Typography>
                <Typography
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    mt:"5px",
                  }}
                >
                  {!stakingIsActive ? "Active" : "Not active"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </>
    )
  }


    //UI Fragment card for user statement 
  const VestingCardDetails = () => { 

    return (
    <>
     <Card
          sx={{
            maxWidth: "80%",
            margin: "100px auto 0 auto",
            borderRadius: "20px",
            background: "rgba( 255, 255, 255, 0.35 )",
            boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
            backdropFilter: "blur( 10px )",
            border: "1px solid #fff",
          }}
        >
          <Box m="20px" textAlign="center">
            <Typography variant="h5" sx={{
              color: "rgb(18, 124, 255)"
            }}>
              Vesting details
            </Typography>
          </Box>
          <Box
            sx={{
              background: "white",
              borderRadius: "0 0 20px 20px",
              padding: "40px",
            }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Nft types vested 
                </Typography>
                <Typography
                  variant="p"
                  color="black"
                  width="200px"
                  noWrap
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                  }}
                >
                  {refreshVestingForAll ? refreshVestingForAll : 0}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Already claimed
                </Typography>
                <Typography
                  variant="p"
                  color="black"
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                  }}
                >
                  {claimedVestingAmount ? claimedVestingAmount : 0}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Available Claim
                </Typography>
                <Typography
                  variant="p"
                  color="black"
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                  }}
                >
                  {claimableVestingAmount ? claimableVestingAmount : 0}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                xl={3}
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h6"
                  color="#AEAEAE"
                  fontWeight="light"
                  sx={{
                    fontSize: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  Unvest balance
                </Typography>
                <Typography
                  variant="p"
                  color="black"
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                  }}
                >
                  {unvestBalance ? unvestBalance : 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card> 
    </>
    )
  }


  //OWner ui panel Card 
  const OwnerPannel = () => {
    return (
    <>
       <Card
        sx={{
          maxWidth: "80%",
          margin: "100px auto 0 auto",
          borderRadius: "20px",
          background: "rgba( 255, 255, 255, 0.35 )",
          boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
          backdropFilter: "blur( 10px )",
          border: "1px solid #fff",
        }}
      >
        <Box m="20px" textAlign="center">
          <Typography variant="h5" sx={{
            color: "rgb(18, 124, 255)"
          }}>
            Admin command pannel
          </Typography>
        </Box>
        <Box
          sx={{
            background: "white",
            borderRadius: "0 0 20px 20px",
            padding: "40px",
          }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              xl={4}
              display="flex"
              flexDirection="column"
              alignItem="center"
              textAlign="center"
            >
              <Typography
                variant="h6"
                color="#AEAEAE"
                fontWeight="light"
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "1px",
                }}
              >
                Nft Function
              </Typography>
              <Button variant="contained" sx={{                
                background: "black",
                borderRadius: "12px",
                color: "white",
                height: "42px",
                width:"100%",
                marginTop: "20px",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}
                onClick={handleModal}>Set sales step</Button>
                
                <Button variant="contained" sx={{                
                background: "white",
                borderRadius: "12px",
                color: "black",
                height: "42px",
                width:"100%",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}
                onClick={handleModal}>Set base URI</Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              xl={4}
              display="flex"
              flexDirection="column"
              alignItem="center"
              textAlign="center"
            >
              <Typography
                variant="h6"
                color="#AEAEAE"
                fontWeight="light"
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "1px",
                }}
              >
                Erc20 Function
              </Typography>
              <Button variant="contained"
              onClick={handleModal} 
              sx={{                
                background: "black",
                borderRadius: "12px",
                color: "white",
                height: "42px",
                width:"100%",
                marginTop: "20px",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  Burn Team Supply
              </Button>
              <Button variant="contained"
                onClick={handleModal}
               sx={{                
                background: "white",
                borderRadius: "12px",
                color: "black",
                height: "42px",
                width:"100%",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  Burn Reserve Supply
                </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              xl={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography
                variant="h6"
                color="#AEAEAE"
                fontWeight="light"
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "1px",
                }}
              >
                Staking Function
              </Typography>
              <Button variant="contained" 
              onClick={handleModal}
              sx={{                
                background: "black",
                borderRadius: "12px",
                color: "white",
                height: "42px",
                width:"100%",
                marginTop: "20px",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  Set pause
                </Button>

                <Button variant="contained" 
                onClick={handleModal}
                sx={{                
                background: "white",
                borderRadius: "12px",
                color: "black",
                height: "42px",
                width:"100%",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  Set reward duration
                </Button>
            </Grid>
            
            <Grid
              item
              xs={12}
              md={6}
              xl={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography
                variant="h6"
                color="#AEAEAE"
                fontWeight="light"
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "1px",
                }}
              >
                Vesting Function
              </Typography>
              <Button variant="contained" sx={{                
                background: "black",
                borderRadius: "12px",
                color: "white",
                height: "42px",
                width:"100%",
                marginTop: "20px",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  Set pause
                </Button>
                <Button variant="contained" 
                onClick={handleModal}
                sx={{                
                background: "white",
                borderRadius: "12px",
                color: "black",
                height: "42px",
                width:"100%",
                marginBottom:"15px",
                border:"2px solid black",
                ":hover": {
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  border:"2px solid white",
                },
                }}>
                  set unlock period
                </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  )}
  const Modal = (id) => {
    return (
      <React.Fragment>
      <Box
      position="absolute"
      zIndex="99999999"
      display={displayModal ? "flex" : "none"}
      justifyContent="center"
      alignItems="center"
      className="modal"
      width="100%"
      marginLeft="-40px"
    >
      <Card
        sx={{
          padding: "40px",
          position: "relative",
          display: "flex",
          boxShadow:
            "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
        }}
        className="modal-content"
      >
            <Typography variant="h6">
               Tittle Arrays
            </Typography>
        <img onClick={handleModal} src={closeIcon} alt="icon" />
        <Box
          width="60%"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
            <Typography variant="p">
               Description array
            </Typography>
        </Box>
            <Box
                width="50%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
                marginTop="35px"
              >
                <TextField label="input" type="string" sx={{marginBottom:"20px"}}></TextField>
                <TextField label="input" type="string" sx={{marginBottom:"20px",borderRadius: "20px", height:"35px" }} ></TextField>
                <Button
                  // onClick={() => {handleOWner(BurnExedentVesting())}}
                  variant="contained"
                  sx={{
                    marginTop: "20px",
                    height: "35px",
                    marginLeft: "10px",
                    background: "rgb(18, 124, 255)",
                    borderRadius: "20px",
                  }}
                >
                  APPLY
                </Button>
              </Box>
      </Card>
    </Box>
    </React.Fragment>
    )
  }



  return (
    <>
      <Box
        height="calc(100vh-100px)"
        position="absolute"
        top="140px"
        p="40px"
        className="wrapper"
      >

        { accounts.length > 0 && ethers.utils.getAddress(accounts[0]) === owner ? (
       <>
          <StakingCardDetails/>
          <VestingCardDetails/>
          <OwnerPannel/>
          <Modal />
       </>
      ):( 
        <>
          <StakingCardDetails/>
          <VestingCardDetails/>
        </>
      )}
      </Box>

      <Routes>
        <Route path="/dashboard:id" element={<Home />} />
      </Routes>
    </>
  );
}
