import React, { useEffect, useState } from 'react'
import { ref } from '../App'
import { v4 as uuidv4 } from 'uuid'
import copy from '../assets/copy.svg'
import { Navbar } from '../components/Navbar'

const Referral = () => {
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState(null)
  const [metamaskInstall, setMetamaskInstall] = useState(false)
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [logged, setLogged] = useState(false)
  const [myReferralId, setMyReferralId] = useState(null)

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

  async function getAccounts() {
    if (typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(accounts)
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setMetamaskInstall(false)
    } else {
      setMetamaskInstall(true)
    }
  }, [])

  useEffect(() => {
    if (!metamaskInstall) {
      getAccounts()
    }
  }, [metamaskInstall])

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
      <div id="header" className='header-referral'>
        <Navbar />
        <div className="content">
          <h2>Referrals</h2>
        </div>
      </div>
      <section id="main">
        {
          metamaskInstall ? (
            <p className='install'>First of all, Please Install&nbsp;
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'rgb(226, 118, 37)' }}
              >
                Metamask
              </a>
            </p>
          ) : (
            <>
              {
                accounts.length <= 0 ? (
                  <button className='connect' onClick={() => getAccounts()}>CONNECT YOUR WALLET</button>
                ) : (
                  <>
                    {
                      loaded && logged ? (
                        <div id="referral">
                          <h3>Your Referral Link</h3>
                          <div className='wrapper'>
                            <input type="text" readOnly value={`${window.location.origin}/mint?ref=${myReferralId}`} />
                            <button onClick={() => {
                                navigator.clipboard.writeText(`${window.location.current}/mint?ref=${myReferralId}`);
                              }} 
                            >
                              <img src={copy} alt="copy" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className='get-link'
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
                        </button>
                      )}
                      {
                        loaded && logged && (
                          <div id="our-referrals">
                            <h3>Your Referrals</h3>
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
                                          {element.amountEarned} WARTOKEN
                                        </p>
                                      </li>
                                    })
                                  }
                                </ul>
                              ) : (
                                <p className='nothing'>You don't have any referrals yet</p>
                              )
                            }
                          </div>
                        )
                      }
                  </>
                )
              }
            </>
          )
        }
      </section>
    </>
  )
}

export default Referral
