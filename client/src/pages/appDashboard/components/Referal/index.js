import React, { useEffect, useState } from 'react'
import { ref } from '../../../../App'
import { Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import copy from '../../../../assets/copy.svg'

import {
  Typography,
  Button,
  Box,
  Card,
  TextField
} from "@mui/material";

import WarenBlackLogo from "../../../../assets/logoBlack.png";

import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';

export default function Referal({ accounts }) {
    
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [logged, setLogged] = useState(false)
  const [myReferralId, setMyReferralId] = useState(null)


  useEffect(() => {
    accounts[0] && checkDB()
    myReferralId && getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, myReferralId])

  useEffect(() => {
    setLoaded(true)
  }, [data])

  const getData = () => {
    ref
      .doc(myReferralId)
      .collection('referrals')
      .onSnapshot((querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push(doc.data())
        })
        setData(items)
      })
  }

  const checkDB = () => {
    ref
      .where('address', '==', accounts[0])
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          setLogged(true)
          setMyReferralId(doc.data().id)
        })
      })
  }

  const createDoc = (newDataObj) => {
    // check if address valid
    if (newDataObj.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      // Already exist ?
      let i = 0
      ref
        .where('address', '==', newDataObj.address)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            i++
          })
          // If address not alrealdy exist
          if (i < 1) {
            ref
              .doc(newDataObj.id)
              .set(newDataObj)
              .then((result) => {
                setTimeout(checkDB(), 1000)
              })
              .catch((err) => {
                setError('Unable to get a referral link')
                console.log(err)
              })
          } else {
            setError('You already have a referral link')
          }
        })
        .catch((err) => {
          setError('Error with the database')
          console.log(err)
        })
    } else {
      setError('Invalid address')
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="column" marginTop="45px" sx={{marginTop:{ sm:"40px", md:"30px", xl:"45px"}}}>
            <Box
            display="flex"
            position="absolute"
            textAlign="center"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            className="goodNetwork">
              <Box sx={{maxWidth: "80%",margin: "0 auto",}}>
        {
          (
            <>
              {(
                  <>
                    {
                      loaded && logged ? (
                        <Card sx={{
                          borderRadius: "20px",
                          background: "rgba( 255, 255, 255, 0.35 )",
                          boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
                          backdropFilter: "blur( 10px )",
                          border: "1px solid #fff",}}>
                          <Typography sx={{marginTop:"15px", fontSize:{sm:"1.2em", md:"1.5em",xl:"2.2em" }}}> 🦸 Get your referral link </Typography>
                          <Box  alignItems="center" justifyContent="center" sx={{m: {xs:"120px 50px 120px", sm:"120px 50px 120px", md:"120px 50px 120px", xl:"120px 275px 120px" }}}>
                          <TextField readOnly value={`${window.location.origin}/mint?ref=${myReferralId}`} label="My referral link"type="text" 
                          sx={{width:{sm:"290px", xs:"190px", md:"390px", xl:"430px"}}}
                          />
                            <Button onClick={() => {
                                navigator.clipboard.writeText(`${window.location.current}/mint?ref=${myReferralId}`);
                              }} 
                            >
                              <CopyAllOutlinedIcon alt="copy" />
                            </Button>
                          </Box>
                        </Card>
                      ) : (
                        <Button
                          sx={{                                    
                          background: "rgb(18, 124, 255)",
                          borderRadius: "20px",
                          color: "white",
                          width:"250px",
                          border:"2px solid rgb(15, 101, 206)",
                          ":hover": {
                          background: "rgb(15, 101, 206)",
                          },}}
                          onClick={() => {
                            const url = new URL(window.location)
                            const urlId = url.searchParams.get('ref')
                            accounts[0] &&
                              createDoc({
                                address: accounts[0],
                                id: uuidv4(),
                                referent: urlId
                              })
                          }}
                        >
                          Get a Referral Link
                        </Button>
                      )}
                      {
                        loaded && logged && (
                          <Card sx={{
                            p:"40px 40px 40px 40px",
                            marginTop:"20px",
                            borderRadius: "20px",
                            background: "rgba( 255, 255, 255, 0.35 )",
                            boxShadow: "0px 0px 1.5px rgba(0, 0, 0, 0.02), 0px 0px 3.7px rgba(0, 0, 0, 0.028), 0px 0px 6.9px rgba(0, 0, 0, 0.035), 0px 0px 12.3px rgba(0, 0, 0, 0.042), 0px 0px 23px rgba(0, 0, 0, 0.05), 0px 0px 55px rgba(0, 0, 0, 0.07)",
                            backdropFilter: "blur( 10px )",
                            border: "1px solid #fff",}}>
                          <Box  alignItems="center" justifyContent="center" sx={{marginBottom:"20px" }}>
                            <Typography variant='h6'>Your Referrals : </Typography>
                            {
                              data.length > 0 ? (
                                <ul>
                                  {
                                    data.map((element) => {
                                      <li key={element.id}>
                                        <p>
                                          <span>Address</span>
                                          &nbsp;{element.address}
                                        </p>
                                        <p>
                                          <span>Amount Earned :&nbsp;</span>
                                          {element.amountEarned} WRN TOKEN
                                        </p>
                                      </li>
                                    })
                                  }
                                </ul>
                              ) : (
                                <Typography variant='p'sx={{ marginBottom:"100px"}} >You don't have any referrals yet</Typography>
                              )
                            }
                          </Box>
                          </Card>
                        )
                      }
                  </>
                )
              }
            </>
          )
        }
        </Box>
        </Box>
      </Box>

      <Routes>
        <Route path="/dashboard:id" element={<Referal/>} />
      </Routes>

    </>
  )
}

