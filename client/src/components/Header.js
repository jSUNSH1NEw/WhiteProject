import React from "react";
import { Button, Box, Typography, Divider } from "@mui/material";
import MenuIcon from "../assets/menu.svg";

export default function Header({
  title,
  openSidebar,
  connect,
  isConnected,
  account,
}) {
  return (
    <>
      <Box
        width="100%"
        height="fit-content"
        display="flex"
        alignItems="center"
        position="absolute"
        top="0"
        left="0"
        sx={{
          padding: {
            md: "40px 60px",
            xs: "40px 15px",
          },
        }}
      >
        <Box className="responsive-button">
          <Button onClick={openSidebar}>
            <img src={MenuIcon} alt="icon" />
          </Button>
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h1" fontSize="2rem" sx={{
            color: "#111"
          }}>
            {title}
            <Divider variant="middle" role="presentation" sx={{height:"2px", color:"black"}} />
          </Typography>
        
          <Button
            sx={{
              background: "rgb(18, 124, 255)",
              width: {xs:"9em", md:"15em", xl:"15em"},
              padding: "10px 20px",
              marginLeft: "auto",
              color: "white",
              ":hover": {
                background: "rgb(15, 62, 180)",
              },
              borderRadius: "10px"
            }}
            onClick={connect}
          >
            <Typography width="fit-content" noWrap>{isConnected ? account : "Connect wallet"}</Typography>
          </Button>
        </Box>
      </Box>
    </>
  );
}
