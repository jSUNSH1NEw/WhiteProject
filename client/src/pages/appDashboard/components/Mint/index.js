import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Routes, Route } from "react-router-dom";

import { ref } from "../../../../App";
import { v4 as uuidv4 } from "uuid";
import Contract from "../../../../artifacts/contracts/Waren.sol/Waren.json";
import TetherAbi from "../../../../components/TetherAbi.json";

import { Button, Card, Grid, Typography, Box } from "@mui/material";
import Counter from "../../../../components/Counter";
import ReactPlayer from "react-player";
import nft1 from "../../../../assets/NFT-Waren-gold-1x1.mp4";
import nft2 from "../../../../assets/NFT-Waren-black-1x1.mp4";
import nft3 from "../../../../assets/NFT-Waren-blanc-1x1.mp4";
import nft4 from "../../../../assets/NFT-Waren-bleu-1x1.mp4";
import WarenBlackLogo from "../../../../assets/logoBlack.png";

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const whitelist = require("../../../../components/whitelist.json");
const address = '0x25f7d45CAf57D1898C1dd5Ffb238196216700ADc'; // test :"0x02282fEDFc34571A3E6A6d3679E1c79451063847"; //'0x25f7d45CAf57D1898C1dd5Ffb238196216700ADc'
const addressTether = "0x55d398326f99059fF775485246999027B3197955";
const owner = '0xc48df0355e107fbe0aaa753510017ff63639cd1f' // test :"0x6390499Ef56F05A832e7f87c720ea633823d1783"; // '0xc48df0355e107fbe0aaa753510017ff63639cd1f' // LOWER CASE !

export default function DashMint({ accounts}) {
  const [goodNetwork, setGoodNetwork] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metamaskInstall, setMetamaskInstall] = useState(false);
  const [dbLinked, setDbLinked] = useState(false);
  const [waitingEvent, setWaitingEvent] = useState(false);
  const [addRewards, setAddRewards] = useState(false);
  const [quantityRewards, setQuantityRewards] = useState(0);
  const [typeRewards, setTypeRewards] = useState(0);
  const [sellingStep, setSellingStep] = useState(0);
  const [pausedBool, setPausedBool] = useState(null);
  const [allowanceUSDT, setAllowanceUSDT] = useState(0);
  const [lastPriceBNB, setLastPriceBNB] = useState(null);
  const [goldPassPrice, setGoldPassPrice] = useState(0);
  const [whitelistSalePrice, setWhitelistSalePrice] = useState(0);
  const [publicSalePrice1, setPublicSalePrice1] = useState(0);
  const [publicSalePrice2, setPublicSalePrice2] = useState(0);
  const [counterNFT, setCounterNFT] = useState(1);
  const [counterGoldPass, setCounterGoldPass] = useState(1);
  const [counterStep, setCounterStep] = useState(0);
  const [newBaseUri, setNewBaseUri] = useState(null);
  const [giftAddress, setGiftAddress] = useState(null);
  const [giftCounter, setGiftCounter] = useState(1);
  const [giftType, setGiftType] = useState(null);
  const [newMerkleRoot, setNewMerkleRoot] = useState(null);
  const [basketUSDT, setBasketUSDT] = useState(0);
  const [basketBNB, setBasketBNB] = useState(0);
  const [basketGoldPassBNB, setBasketGoldPassBNB] = useState(1);
  const [basketGoldPassUSDT, setBasketGoldPassUSDT] = useState(1);

  useEffect(() => {
    async function getInfos() {
      if (typeof window.ethereum !== "undefined") {
        setMetamaskInstall(false);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(address, Contract.abi, provider);
        try {
          const { chainId } = await provider.getNetwork();
          if (chainId !== 56) {
            //Chain 56 for mainet
            setGoodNetwork(false);
            return;
          } else {
            setGoodNetwork(true);
            const step = await contract.sellingStep();
            setSellingStep(step);
            const paused = await contract.paused();
            setPausedBool(paused);
            const priceBNB = await contract.getLatestPrice();
            setLastPriceBNB(priceBNB);
            const priceGoldPass = await contract.goldPassPrice();
            setGoldPassPrice(priceGoldPass);
            const priceWhitelistSale = await contract.whitelistSalePrice();
            setWhitelistSalePrice(priceWhitelistSale);
            const pricePublicSale1 = await contract.publicSalePrice1();
            setPublicSalePrice1(pricePublicSale1);
            const pricePublicSale2 = await contract.publicSalePrice2();
            setPublicSalePrice2(pricePublicSale2);
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




  // Events
  useEffect(() => {
    if (accounts[0] && goodNetwork) {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(address, Contract.abi, provider);
        contract.on("StepChanged", (_step) => {
          setSellingStep(_step);
          getAllowance();
        });
      }

      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          addressTether,
          TetherAbi,
          provider
        );
        contract.on("Transfer", (from, to, value) => {
          if (accounts[0] === String(to).toLowerCase()) {
            getAllowance();
          }
        });
      }

      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(address, Contract.abi, provider);
        contract.on("TransferSingle", (operator, from, to, id, value) => {
          if (waitingEvent && accounts[0] === String(to).toLowerCase()) {
            setWaitingEvent(false);
            setAddRewards(true);
            getAllowance();
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, waitingEvent, goodNetwork]);

  useEffect(() => {
    if (addRewards && accounts[0]) {
      setAddRewards(false);
      const type = typeRewards;
      const quantity = quantityRewards;
      setTypeRewards(0);
      setQuantityRewards(0);

      const amountToAddToDB = (_tokenId, _quantity) => {
        if (_tokenId === 1) {
          return 10000 * 0.05 * _quantity;
        } else if (_tokenId === 2) {
          return 300 * 0.01 * _quantity;
        } else if (_tokenId === 3) {
          return 2000 * 0.02 * _quantity;
        } else if (_tokenId === 4) {
          return 300 * 0.01 * _quantity;
        }
      };

      let myReferent = null;
      ref
        .where("address", "==", accounts[0])
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach((doc) => {
            myReferent = doc.data().referent;
          });
          if (myReferent !== null && myReferent !== undefined) {
            let amountToAdd = amountToAddToDB(
              parseInt(type),
              parseInt(quantity)
            );
            amountToAdd > 0 &&
              ref
                .doc(myReferent)
                .collection("referrals")
                .where("address", "==", accounts[0])
                .get()
                .then(function (querySnapshot) {
                  let docId;
                  let currentAmount = 0;
                  querySnapshot.forEach((doc) => {
                    docId = doc.data().id;
                    currentAmount = doc.data().amountEarned;
                  });
                  ref
                    .doc(myReferent)
                    .collection("referrals")
                    .doc(docId)
                    .update({ amountEarned: currentAmount + amountToAdd });
                });
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addRewards]);

  useEffect(() => {
    if (accounts[0] && goodNetwork && dbLinked === false) {
      const url = new URL(window.location);
      const urlId = url.searchParams.get("ref");
      createDoc({ address: accounts[0], id: uuidv4(), referent: urlId });
      setDbLinked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, dbLinked, goodNetwork]);

  // Database interactions
  const createDoc = (newDataObj) => {
    if (newDataObj.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      let i = 0;
      ref
        .where("address", "==", newDataObj.address)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            i++;
          });
          if (i < 1) {
            let j = 0;
            ref
              .where("id", "==", newDataObj.referent)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  j++;
                });
                if (j > 0) {
                  ref
                    .doc(newDataObj.id)
                    .set(newDataObj)
                    .then((result) => {
                      newDataObj.referent &&
                        addReferent({
                          referent: newDataObj.referent,
                          address: newDataObj.address,
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  ref.doc(newDataObj.id).set({
                    address: newDataObj.address,
                    id: newDataObj.id,
                    referent: null,
                  });
                }
              });
          }
        })
        .catch((err) => {
          console.log("Error with the database");
        });
    } else {
      console.log("Invalid address");
    }
  };

  const addReferent = (newDataObj) => {
    let i = 0;
    ref
      .where("id", "==", newDataObj.referent)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          i++;
        });
        if (i !== 0) {
          const promises = [];
          const newId = uuidv4();
          promises.push(
            ref
              .doc(newDataObj.referent)
              .collection("referrals")
              .doc(newId)
              .set({
                id: newId,
                address: newDataObj.address,
                amountEarned: 0,
              })
          );
          Promise.all(promises)
            .then(function () {
              console.log("Registered");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log("Error with the database");
      });
  };

  async function getAllowance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractUSDT = new ethers.Contract(
        addressTether,
        TetherAbi,
        signer
      );
      try {
        const allowance = await contractUSDT.allowance(
          accounts[0].toString(),
          address,
          {
            from: accounts[0],
          }
        );
        setAllowanceUSDT(allowance);
      } catch (error) {
        console.log("error", error.message);
      }
    }
  }

  useEffect(() => {
    if (sellingStep === 1 || sellingStep === 2 || sellingStep === 3) {
      setBasketGoldPassBNB(
        Math.round(
          ((counterGoldPass * goldPassPrice * 10 ** 8) / lastPriceBNB +
            1 / 100) *
            100
        ) / 100
      );
      setBasketGoldPassUSDT(counterGoldPass * goldPassPrice);
    }
    if (sellingStep === 1) {
      setBasketBNB(
        Math.round(
          ((counterNFT * whitelistSalePrice * 10 ** 8) / lastPriceBNB +
            1 / 100) *
            100
        ) / 100
      );
      setBasketUSDT(counterNFT * whitelistSalePrice);
    }
    if (sellingStep === 2) {
      setBasketBNB(
        Math.round(
          ((counterNFT * publicSalePrice1 * 10 ** 8) / lastPriceBNB + 1 / 100) *
            100
        ) / 100
      );
      setBasketUSDT(counterNFT * publicSalePrice1);
    }
    if (sellingStep === 3) {
      setBasketBNB(
        Math.round(
          ((counterNFT * publicSalePrice2 * 10 ** 8) / lastPriceBNB + 1 / 100) *
            100
        ) / 100
      );
      setBasketUSDT(counterNFT * publicSalePrice2);
    }
    if (sellingStep === 0) {
      setBasketBNB(0);
      setBasketUSDT(0);
    }
  }, [
    sellingStep,
    counterNFT,
    goldPassPrice,
    whitelistSalePrice,
    publicSalePrice1,
    publicSalePrice2,
    lastPriceBNB,
    counterGoldPass,
  ]);

  async function setStep(_step) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        const transaction = await contract.setStep(_step, {
          from: accounts[0],
        });
        await transaction.wait();
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  const ErrorBalance = () => {
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
                      <Typography variant="h5" sx={{marginBottom:"30px"}}>
                      Metamask error: check your wallet, balance...
                      </Typography>
                  </Box>
               </Card>
          </Box>
      </>
    )
  }

  const ErrorCorrectFunctionning = () => {
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
                      <Typography variant="h5" sx={{marginBottom:"30px"}}>
                      Error: check the correct functioning of your wallet, balance...
                      </Typography>
                  </Box>
               </Card>
          </Box>
      </>
    )
  }

  const MintNotStarted = () => {
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
                      <Typography variant="h5" sx={{marginBottom:"30px"}}>
                      The mint sale isnt started please wait...
                      </Typography>
                  </Box>
               </Card>
          </Box>
      </>
    )
  }

  async function approveUSDT(_amount) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(addressTether, TetherAbi, signer);

      try {
        const transaction = await contract.approve(
          address,
          ethers.utils.parseEther(_amount.toString()),
          {
            from: accounts[0],
          }
        );
        await transaction.wait();
        const allowance = await contract.allowance(accounts[0], address, {
          from: accounts[0],
        });
        setAllowanceUSDT(allowance);
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  async function goldPassMint(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);
      const calcul =
        Math.round(
          ((_quantity * goldPassPrice * 10 ** 8) / lastPriceBNB) * 100
        ) /
          100 +
        1 / 100;
      try {
        let overrides = {
          from: accounts[0],
          value: ethers.utils.parseEther(calcul.toFixed(2).toString()),
        };
        const transaction = await contract.goldPassMint(_quantity, overrides);
        await transaction.wait();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(1);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function goldPassMintUSDT(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.goldPassMintUSDT(
          _quantity,
          overrides
        );
        await transaction.wait();
        getAllowance();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(1);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function whitelistSaleMint(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      let tab = [];
      whitelist.map((token) => tab.push(token.address));
      const leaves = tab.map((address) => keccak256(address));
      const tree = new MerkleTree(leaves, keccak256, { sort: true });
      const leaf = keccak256(accounts[0]);
      const proof = tree.getHexProof(leaf);
      const calcul =
        Math.round(
          ((_quantity * whitelistSalePrice * 10 ** 8) / lastPriceBNB) * 100
        ) /
          100 +
        1 / 100;

      try {
        let overrides = {
          from: accounts[0],
          value: ethers.utils.parseEther(calcul.toFixed(2).toString()),
        };
        const transaction = await contract.whitelistSaleMint(
          proof,
          _quantity,
          overrides
        );
        await transaction.wait();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(2);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function whitelistSaleMintUSDT(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      let tab = [];
      whitelist.map((token) => tab.push(token.address));
      const leaves = tab.map((address) => keccak256(address));
      const tree = new MerkleTree(leaves, keccak256, { sort: true });
      const leaf = keccak256(accounts[0]);
      const proof = tree.getHexProof(leaf);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.whitelistSaleMintUSDT(
          proof,
          _quantity,
          overrides
        );
        await transaction.wait();
        getAllowance();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(2);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function publicSaleMint1(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);
      const calcul =
        Math.round(
          ((_quantity * publicSalePrice1 * 10 ** 8) / lastPriceBNB) * 100
        ) /
          100 +
        1 / 100;

      try {
        let overrides = {
          from: accounts[0],
          // value: _quantity * publicSalePrice1*10**26 / lastPriceBNB,
          value: ethers.utils.parseEther(calcul.toFixed(2).toString()),
        };
        const transaction = await contract.publicSaleMint1(
          _quantity,
          overrides
        );
        await transaction.wait();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(3);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function publicSaleMint1USDT(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.publicSaleMint1USDT(
          _quantity,
          overrides
        );
        await transaction.wait();
        getAllowance();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(3);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function publicSaleMint2(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);
      const calcul =
        Math.round(
          ((_quantity * publicSalePrice2 * 10 ** 8) / lastPriceBNB) * 100
        ) /
          100 +
        1 / 100;

      try {
        let overrides = {
          from: accounts[0],
          // value: _quantity * publicSalePrice2*10**26 / lastPriceBNB,
          value: ethers.utils.parseEther(calcul.toFixed(2).toString()),
        };
        const transaction = await contract.publicSaleMint2(
          _quantity,
          overrides
        );
        await transaction.wait();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(4);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function publicSaleMint2USDT(_quantity) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.publicSaleMint2USDT(
          _quantity,
          overrides
        );
        await transaction.wait();
        getAllowance();
        setLoading(false);
        setQuantityRewards(_quantity);
        setTypeRewards(4);
        setWaitingEvent(true);
      } catch (error) {
        if (error.data) {
          setError(<ErrorBalance/>);
          console.log(error.data.message);
        } else {
          setError(<ErrorCorrectFunctionning/>);
          console.log(error.message);
        }
        setLoading(false);
      }
    }
  }

  async function setBaseUri(_baseUri) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.setBaseUri(_baseUri, overrides);
        await transaction.wait();
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  async function gift(_to, _quantity, _type) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.gift(
          _to,
          _quantity,
          _type,
          overrides
        );
        await transaction.wait();
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  async function setMerkleRoot(_merkleRoot) {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.setMerkleRoot(
          _merkleRoot,
          overrides
        );
        await transaction.wait();
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  async function setPaused() {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
        };
        const transaction = await contract.setPaused(overrides);
        await transaction.wait();
        setLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setLoading(false);
      }
    }
  }

  

  const handleMint = (_quantity) => {
    if (accounts[0] && goodNetwork) {
      if (sellingStep === 1) {
        whitelistSaleMint(_quantity);
      } else if (sellingStep === 2) {
        publicSaleMint1(_quantity);
      } else if (sellingStep === 3) {
        publicSaleMint2(_quantity);
      } else {
        setError(<MintNotStarted/>);
        return;
      }
    } else {
      setError("Connect Your Wallet");
    }
  };

  const handleMintUSDT = (_quantity) => {
    if (accounts[0] && goodNetwork) {
      if (sellingStep === 1) {
        if (allowanceUSDT >= whitelistSalePrice * 10 ** 18 * _quantity) {
          whitelistSaleMintUSDT(_quantity);
        } else {
          approveUSDT(whitelistSalePrice * _quantity);
        }
      } else if (sellingStep === 2) {
        if (allowanceUSDT >= publicSalePrice1 * 10 ** 18 * _quantity) {
          publicSaleMint1USDT(_quantity);
        } else {
          approveUSDT(publicSalePrice1 * _quantity);
        }
      } else if (sellingStep === 3) {
        if (allowanceUSDT >= publicSalePrice2 * 10 ** 18 * _quantity) {
          publicSaleMint2USDT(_quantity);
        } else {
          approveUSDT(publicSalePrice2 * _quantity);
        }
      } else {
        setError(<MintNotStarted/>);
        return;
      }
    } else {
      setError("Connect Your Wallet");
    }
  };

  const displayImg = () => {
    if (sellingStep === 1) {
      return nft2;
    } else if (sellingStep === 2) {
      return nft3;
    } else if (sellingStep === 3) {
      return nft4;
    } else {
      return nft1;
    }
  };

  return (
    <>
      {sellingStep === 0 ? (
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
                     The selling step as not yet started
                     </Typography>
                     <Typography variant="h5" sx={{marginBottom:"30px"}}>
                     Please wait...
                     </Typography>
                 </Box>
              </Card>
         </Box>
      ) : (
        <>
          
          <Box
            position="absolute"
            top="75px"
            p="40px"
            className="nft-chest"
          >
            <Box maxWidth="80%" margin="0 auto">
              <Grid container spacing={10} sx={{justifyContent:"center"}}>
                <Grid item xs={12} xl={4} md={6}>
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                    }}
                  >
                    <ReactPlayer
                      url={displayImg()}
                      playing
                      muted
                      loop
                      className="react-player"
                    />
                    <Typography variant="h5" textAlign="center">
                      {sellingStep === 1
                        ? "Whitelist"
                        : sellingStep === 2
                        ? "Round 1"
                        : "Round 2"}
                      &nbsp;Pass
                    </Typography>
                    <Counter
                      counter={counterNFT}
                      setCounter={setCounterNFT}
                      limit={sellingStep === 1 ? 5 : 15}
                    />
                    <Typography variant="p" textAlign="center" marginBottom="20px">
                      Price : {basketBNB} BNB or {basketUSDT} USDT
                    </Typography>

                    <Button
                      onClick={() => handleMint(counterNFT)}
                      sx={{
                        background: "rgb(18, 124, 255)",
                        borderRadius: "20px",
                        color: "white",
                        ":hover": {
                          background: "rgb(15, 101, 206)",
                        },
                      }}
                    >
                      {loading ? "Loading..." : "INVEST IN BNB"}
                    </Button>
                    <Button
                      onClick={() => handleMintUSDT(counterNFT)}
                      sx={{
                        background: "white",
                        border: "1px solid rgb(18, 124, 255)",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                    >
                      {loading ? "Loading..." : "INVEST IN USDT"}
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} xl={4} md={6}>
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                    }}
                  >
                    <ReactPlayer
                      url={nft1}
                      playing
                      muted
                      loop
                      className="react-player"
                    />
                    <Typography variant="h5" textAlign="center">Gold Pass</Typography>
                    <Counter
                      counter={counterGoldPass}
                      setCounter={setCounterGoldPass}
                      limit={15}
                    />
                  <Typography variant="p" textAlign="center" marginBottom="20px">
                    Price : {basketGoldPassBNB} BNB or {basketGoldPassUSDT} USDT
                      
                    </Typography>
                    <Button
                      sx={{
                        background: "rgb(18, 124, 255)",
                        borderRadius: "20px",
                        color: "white",
                        ":hover": {
                          background: "rgb(15, 101, 206)",
                        },
                      }}
                      onClick={() => goldPassMint(counterGoldPass)}
                    >
                      {loading ? "Loading..." : "INVEST IN BNB"}
                    </Button>
                    <Button
                      sx={{
                        background: "white",
                        border: "1px solid rgb(18, 124, 255)",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                      onClick={
                        allowanceUSDT >=
                        goldPassPrice * 10 ** 18 * counterGoldPass
                          ? () => goldPassMintUSDT(counterGoldPass)
                          : () => approveUSDT(goldPassPrice * counterGoldPass)
                      }
                    >
                      {loading ? "Loading..." : "INVEST IN USDT"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
      
          {error ? <Typography>{error}</Typography> : ""}
        </>
      )}
      <>
      {accounts.length > 0 && ethers.utils.getAddress(accounts[0]) === owner ?  (
         <>
        <div id="admin">
          <h2>ADMIN</h2>
          <p className="current">Actuel : {sellingStep}</p>
          <Counter
            counter={counterStep}
            setCounter={setCounterStep}
            limit={3}
            start={0}
          />
          <button className="set" onClick={() => setStep(counterStep)}>
            {loading ? "Loading..." : "SET STEP"}
          </button>
          <div className="admin-fields">
            <div className="row">
              <input
                type="text"
                placeholder="Base URI"
                onChange={(e) => setNewBaseUri(e.target.value)}
              />
              <button className="btn" onClick={() => setBaseUri(newBaseUri)}>
                {loading ? "Loading..." : "Set Base URI"}
              </button>
            </div>
            <div className="row">
              <input
                type="text"
                placeholder="Address"
                onChange={(e) => setGiftAddress(e.target.value)}
              />
              <Counter
                counter={giftCounter}
                setCounter={setGiftCounter}
                limit={50}
              />
              <input
                type="text"
                placeholder="Type"
                onChange={(e) => setGiftType(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => gift(giftAddress, giftCounter, giftType)}
              >
                {loading ? "Loading..." : "GIFT"}
              </button>
            </div>
            <div className="row">
              <input
                type="text"
                placeholder="Merkle Root"
                onChange={(e) => setNewMerkleRoot(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => setMerkleRoot(newMerkleRoot)}
              >
                {loading ? "Loading..." : "SET MERKLE ROOT"}
              </button>
            </div>
            <div className="row">
              <p>Currently {pausedBool ? "Active" : "on Paused"}</p>
              <button className="btn" onClick={() => setPaused()}>
                {loading ? "Loading..." : "SET PAUSED"}
              </button>
            </div>
          </div>
        </div>
        </>
      ): (
        <> </>
      )} 
      </>
      <Routes>
        <Route path="/dashboard:id" element={<DashMint />} />
      </Routes>
    </>
  );
}
