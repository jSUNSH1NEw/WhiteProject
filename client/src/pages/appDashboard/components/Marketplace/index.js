import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import Mint from "../../../Mint";
// import the mint params of nft into the marketplace Routes juste dipslay the component with the params 
// buy the nft out USDT or BNB  
//Check if needed a crowndSales Contract or ICO was nfts ? 

import {
  styled,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";

import ReactPlayer from "react-player";
import nft1 from "../../../../assets/NFT-Waren-gold-1x1.mp4";

export default function Marketplace() {

  const [testTokenContract, setTestTokenContract] = useState('');
  const [tokenStakingContract, setTokenStakingContract] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [totalStaked, setTotalStaked] = useState([0, 0]);

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
                  Allocation amount
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
                  000.00 €
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
                  Claimed amount
                </Typography>
                <Typography
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    mt:"5px",
                    mb:{xs: "10px", mb:"15px"},
                  }}
                >
                  000.00 €
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
                  variant="p"
                  color="#127CFF"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    mt:"5px",
                    mb:{xs: "10px", mb:"15px"},
                  }}
                >
                  000.00 €
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
                  Super dupa 
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      

      <Routes>
        <Route path="/dashboard:id" element={<Marketplace />} />
      </Routes>
    </>
  );
}
