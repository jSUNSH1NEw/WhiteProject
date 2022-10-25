import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ethers } from "ethers";

import { Box } from "@mui/system";
import { Routes, Route } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  Typography,
  CircularProgress,
  Fade,
  TableContainer,
  TableCell,
  TableBody,
} from "@mui/material";
import WarenBlackLogo from "../../../../assets/logoBlack.png";
import ReactPlayer from "react-player";

//  Hook : import { useCallItem } from "../../../../hooks/useVesting";
import {
  nftRecipient,
  nftAbi,
  vestingAbi,
  vestingRecipient,
  erc20Recipient,
  erc20Abi,
} from "../../../../utils/abi";
import { Link as Links } from "react-router-dom";

import nft1 from "../../../../assets/NFT-Waren-gold-1x1.mp4";
import nft2 from "../../../../assets/NFT-Waren-black-1x1.mp4";
import nft3 from "../../../../assets/NFT-Waren-blanc-1x1.mp4";
import nft4 from "../../../../assets/NFT-Waren-bleu-1x1.mp4";
import closeIcon from "../../../../assets/close.svg";

const NFTs = [nft1, nft2, nft3, nft4];
const descNFTs = [
  "Description du Nft Gold",
  "Description du nft Noir",
  "Description du nft Blanc",
  "Description du Nft bleu",
];

export default function NFTChest({ accounts }) {
  //accounts props  is coming from the sidebar routing

  //general state
  const [contractAction, setContractAction] = useState();
  const [nftContractAction, setNftContractAction] = useState();
  const [tokenContractAction, setTokenContractAction] = useState();

  // Vesting state
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const [vestingBalance, setVestingBalance] = useState();

  const [allowance, setAllowanceWRN] = useState(false);
  const [isApprovedTokenForAll, setIsApprovedTokenForAll] = useState(false);

  // Nft State
  const [userBalance, setUserBalance] = useState();
  const [userBalanceDetails, setUserBalanceDetails] = useState();

  // Helpers
  const [provider, setProvider] = useState();
  const signer = useMemo(() => {
    if (!provider) return;
    return provider.getSigner();
  }, [provider]);

  // const isApproved = useMemo(() => Number(ethers.utils.formatEther(allowance)) >= Number(nftId), [inputValue, allowance])

  const toWei = (etherFormat) => ethers.utils.formatEther(etherFormat);

  // UI state
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [totalVested, setTotalVested] = useState();
  const [rewardsQuantity1, setRewardsQuantity1] = useState(0);
  const [rewardsQuantity2, setRewardsQuantity2] = useState(0);
  const [rewardsQuantity3, setRewardsQuantity3] = useState(0);
  const [rewardsQuantity4, setRewardsQuantity4] = useState(0);


  const [typesNumber, setTypesNumber] = useState([]);
  const [isAlreadyClaim, setisAlreadyClaim] = useState(false);
  const [isAlreadyVested, setisAlreadyVested] = useState(false);
  const [timeBeforeClaim, setTimeBeforeClaim] = useState()

  const refreshApproveNft = async () => {
    const isApproved = await nftContractAction.isApprovedForAll(
      accounts[0],
      vestingRecipient
    );
    setIsApprovedForAll(isApproved);
  };

  const refreshApproveToken = async () => {
    const isApproved = await tokenContractAction.approve(
      accounts[0],
      vestingRecipient
    );
    setIsApprovedTokenForAll(isApproved);
  };

  const refreshVestedBalance = async () => {
    const typeVested = await contractAction.getAllStakedERC1155(accounts[0]);
    setVestingBalance(typeVested);
    console.log(typeVested)
    // const numberOfType = await contractAction.getStakedERC1155(
    //   accounts[0],
    //   4
    // )
    // // console.log(numberOfType.tokenId)
    // await Promise.all(typeVested.map(async (type) => {
    //   const numberOfType = await contractAction.getStakedERC1155(
    //     accounts[0],
    //     4
    //   )
    //   // console.log(numberOfType)
    // }))
  }

  const refreshDataReward = async () => {
    const seconds = 340047;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds / 3600) - (days  * 24);
    console.log('Days:', days, 'Hours:', hours)
  }

  useEffect(() => {
    if (!nftContractAction) return;
    refreshApproveNft();
  }, [accounts, vestingRecipient, nftContractAction]);

  useEffect(() => {
    if (!contractAction) return;
    refreshVestedBalance();
  }, [accounts, vestingRecipient, contractAction]);

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
    setContractAction(
      new ethers.Contract(vestingRecipient, vestingAbi, signer)
    );
    setNftContractAction(new ethers.Contract(nftRecipient, nftAbi, signer));
    setTokenContractAction(
      new ethers.Contract(erc20Recipient, erc20Abi, signer)
    );
  }, [signer]);

  useEffect(() => {
    setLoading(true);
    fetchDataFromBlockchain();
    setLoading(false);
  }, [nftContractAction, contractAction, tokenContractAction]);

  async function fetchDataFromBlockchain() {
    if (!nftContractAction) return;
    try {
      const multipleBalance = await nftContractAction?.balanceOfBatch(
        [accounts[0], accounts[0], accounts[0], accounts[0]],
        [1, 2, 3, 4]
      );
      setUserBalance(multipleBalance);
      // setUserBalance([
      //   ethers.constants.Zero,
      //   ethers.BigNumber.from(42),
      //   ethers.BigNumber.from(42),
      //   ethers.constants.Zero,
      // ]);
    } catch (error) {
      console.log("error", error.message);
      console.log("Yeah");
      setIsError(true)
    }
  }

  async function showReward() {
    try {
      const rewardTypes3 = await contractAction.maxRewardsPublicSale2(
        accounts[0],
        vestingRecipient
      );
      setRewardsQuantity3(rewardTypes3);
    } catch (error) {
      console.log("error", error.message);
    }
  }

  const handleApproveNft = async () => {
    try {
      const tx = await nftContractAction.setApprovalForAll(
        vestingRecipient,
        true
      );
      await tx.wait();
      refreshApproveNft();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVesting = async (nftId) => {
    try {
      const tx = await contractAction.stakeERC1155(nftId, 1);
    } catch (error) {
      console.error(error);
    }
    refreshVestedBalance();
  };

  const handleAllowanceErc20 = async () => {
    try {
      const tx = await tokenContractAction.allowance(
        erc20Recipient,
        accounts[0]
      );
      await tx.wait();
      setAllowanceWRN(tx);
    } catch (error) {
      
      if (error.data) {
        // setError(<ErrorBalance/>);
        console.log(error.data.message);
      } else {
        // setError(<ErrorCorrectFunctionning/>);
        console.log(error.message);
      }
    }
  };

  const handleApproveErc20 = async (amount) => {
    handleAllowanceErc20();
    try {
      const approve = await tokenContractAction.approve(accounts[0], amount);
      await approve.wait()
      // setIsApprovedTokenForAll(tx);
      // refreshApproveToken();
    } catch (error) {
      console.log("error", error.message);
    }
    refreshApproveToken()
  };

  const claimReward = async (nftId) => {
    try {
      const tx = await contractAction.claimRewards(nftId, 1);
      await tx.wait();
    } catch (error) {
      console.log("error", error.message);
    }
    setisAlreadyClaim(!isAlreadyClaim);
  };

  const handleUnStake = async (nftId) => {
    //need to be call a the end of vesting contract period before burn
    try {
      const tx = await contractAction.batchUnstakeERC1155(
        [nftId],
        [1, 2, 3, 4]
      );
      await tx.wait();
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const handleVestingInfos = async() => {
    const availableRewardInDays = await contractAction.stakingMinimalUnlock()
    setTimeBeforeClaim(availableRewardInDays)
  }

  const handleModal = () => {
    setDisplayModal(!displayModal);
  };

  const DuplicateCard = (id) => {
    return (
      <React.Fragment>
        <Card
          sx={{
            padding: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            boxShadow:
              "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
          }}
        >
          <ReactPlayer
            url={NFTs[id]}
            playing
            muted
            loop
            className="react-player"
            onClick={handleModal}
          />
          {!isApprovedForAll && (
            <Button
              onClick={handleApproveNft}
              sx={{
                background: "rgb(15, 101, 206)",
                color: "white",
                border: "2px solid rgb(15, 101, 206)",
                borderRadius: "20px",
                mb: "10px",
                ":hover": {
                  background: "rgb(15, 62, 180)",
                },
              }}
            >
              Approve
            </Button>
          )}
          <Button
            onClick={() => handleVesting(id + 1)}
            disabled={!isApprovedForAll}
            sx={{
              background: "rgb(15, 101, 206)",
              color: "white",
              border: "2px solid rgb(15, 101, 206)",
              borderRadius: "20px",
              mb: "10px",
              justifyContent: "center",
              ":hover": {
                background: "rgb(15, 62, 180)",
              },
            }}
          >
            {isAlreadyVested ? "Already vested" : "Vest your nft"}
          </Button>

          {isAlreadyVested && !allowance && (
            <Button
              onClick={handleAllowanceErc20}
              sx={{
                background: "rgb(15, 101, 206)",
                color: "white",
                border: "2px solid rgb(15, 101, 206)",
                borderRadius: "20px",
                mb: "10px",
                ":hover": {
                  background: "rgb(15, 62, 180)",
                },
              }}
            >
              Allowance Erc20
            </Button>
          )}
        </Card>
      </React.Fragment>
    );
  };

  const DuplicateGrid = (id) => {

    return (
      <React.Fragment>
        <Card
          sx={{
            padding: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            flexDirection: "column",  
            justifyContent: "center",
            width: "100%",
            overflowY: "auto",
            borderRadius: "20px",
            marginBottom:"20px",
            boxShadow:
              "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
          }}        
        >
          <Grid
            container
            sx={{ alignItems: "center", justifyContent:"space-between", margin: "0"}}
          >
            <Grid item xs={2} sx={{
              padding: 0
            }}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                width="95px"
              >
                <ReactPlayer
                  url={NFTs[id]}
                  playing
                  muted
                  loop
                  className="react-player"
                  style={{
                    marginBottom: 0,
                    display: "flex",
                    alignItems: "center"
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={2} sx={{ p: "0 !important", flexDirection:"collumn"  }}>
              <Typography variant="p"> 1days </Typography>
            </Grid>
            <Grid item xs={2}>
              {!isApprovedTokenForAll && (
                <Button
                  onClick={handleApproveErc20}
                  sx={{
                    background: "rgb(15, 101, 206)",
                    color: "white",
                    width: "100%",
                    border: "2px solid rgb(15, 101, 206)",
                    borderRadius: "20px",
                    ":hover": {
                      background: "rgb(15, 62, 180)",
                    },
                  }}
                >
                  Approve
                </Button>
              )}
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={() => claimReward(id)}
                disabled={!isApprovedTokenForAll}
                sx={{
                  background: "rgb(15, 101, 206)",
                  color: "white",
                  width: "100%",
                  border: "2px solid rgb(15, 101, 206)",
                  borderRadius: "20px",
                  justifyContent: "center",
                  ":hover": {
                    background: "rgb(15, 62, 180)",
                  },
                }}
              >
                {isAlreadyClaim ? "Already claim" : "Claim"}
              </Button>
            </Grid>
          </Grid>
        </Card>
      </React.Fragment>
    );
  };

  const Main = ({ children }) => (
    <Box
      height="calc(100vh-100px)"
      position="absolute"
      top="160px"
      p="40px"
      className="nft-chest"
    >
      <Box maxWidth="80%" margin="0 auto">
        {children}
      </Box>
    </Box>
  );

  // if (loading | !userBalance | !vestingBalance)
  //   return (
  //     <>
  //       <Box
  //         display="flex"
  //         position="relative"
  //         textAlign="center"
  //         alignItems="center"
  //         justifyContent="center"
  //         marginLeft="250px"
  //         height="-100vh"
  //       >
  //         <CircularProgress
  //           variant="determinate"
  //           sx={{
  //             color: (theme) =>
  //               theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  //           }}
  //           size={40}
  //           thickness={7}
  //           value={10}
  //         />
  //       </Box>
  //       ;
  //     </>
  //   );

  const Modal = (id) => {
    return (
      <React.Fragment>
        <Fade in={displayModal}>
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
            display={displayModal ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            className="modal"
            width="100%"
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
              <img onClick={handleModal} src={closeIcon} alt="icon" />
              <Box
                width="40%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <ReactPlayer
                  url={NFTs[id]}
                  playing
                  muted
                  loop
                  className="react-player"
                />
              </Box>
              <Box
                width="60%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="p">
                  {/* {descNFTs.fill((_, index) => {
                if ([index]) {
                  return (
                    <>
                      {Typography(index)}
                    </>
                  );
                }
                return null;
              })} */}
                </Typography>
                <Typography>by types</Typography>
                <Typography>vesting time :</Typography>
              </Box>
            </Card>
          </Box>
        </Fade>
      </React.Fragment>
    );
  };

  const Error = () => {
    return (
      <>
        <Box
          display="flex"
          position="absolute"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          className="goodNetwork"
        >
          <Card
            sx={{
              margin: "0 auto",
              borderRadius: "20px",
              background: "rgba( 255, 255, 255, 0.35 )",
              boxShadow:
                "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
              backdropFilter: "blur( 10px )",
              border: "1px solid #fff",
            }}
          >
            <Box>
              <img
                src={WarenBlackLogo}
                alt="logo waren"
                width="auto"
                height="50px"
              />
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">
                No NFTs are listed in your account. Or, mint your first NFT!
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{
                  background: "rgb(18, 124, 255)",
                  borderRadius: "20px",
                  color: "white",
                  width: "250px",
                  border: "2px solid rgb(15, 101, 206)",
                  ":hover": {
                    background: "rgb(15, 101, 206)",
                  },
                }}
                href="/dashboard/mint"
              >
                Mint
              </Button>
            </Box>
          </Card>
        </Box>
      </>
    );
  };

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
      {/* <Main>
        {userBalance
        .reduce((p, c) => p.add(c), ethers.BigNumber.from("0"))
        .isZero() &&
        !vestingBalance
          .reduce((p, c) => p.add(c), ethers.BigNumber.from("0"))
          .isZero() && (
          <>
          <Box>
            <Box widht="100%">
              {NFTs.map((_, index) => {
                if (vestingBalance.find((id) => Number(id) === index + 1)) {
                  return (
                    <Box key={index}>
                      {DuplicateGrid(index)}
                    </Box>
                  );
                }
                return null;
              })}
              </Box>
            </Box>
          </>
        )}

        <Grid container spacing={10}>
          {NFTs.map((_, index) => {
            if (userBalance[index] > 0) {
              return (
                <Grid key={index} item xs={12} xl={4} md={6}>
                  {DuplicateCard(index)}
                </Grid>
              );
            }
            return null;
          })}
        </Grid>
      </Main> */}

      {/* Modal */}

      {/* <Box>
        {NFTs.map((_, index) => {
          if (userBalance[index] > 0) {
            return <Box key={index}>{Modal(index)}</Box>;
          }
          return null;
        })}
      </Box> */}


      {/* {isError &&(
        <>
        <Error/>
        </>
      )} */}

      <MessageBeforeLaunch />


      <Routes>
        <Route path="/dashboard:id" element={<NFTChest />} />
      </Routes>
    </>
  );
}
