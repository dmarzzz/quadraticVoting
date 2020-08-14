import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import BallotArtifact from "./contracts/Ballot.json"
import contractAddress from "./contracts/contract-address.json"
import Button from '@material-ui/core/Button'

const BUIDLER_EVM_NETWORK_ID = '31337'
const ethereum = window.ethereum



function App() {

  const [Addr, setAddr] = useState()
  const [networkError, setNetworkError] = useState()
  const [provider, setProvider] = useState()
  const [ballot, setBallot] = useState()




  async function connectWallet() {
    try {
      const tempAddr = await window.ethereum.enable()
      setAddr(tempAddr)
      console.log("temp addr pre: ", tempAddr)
      if (!checkNetwork()) {
        return;
      }
      initializeEthers()
    } catch (error) {
      return <div><h1>123</h1></div>;
    }

  }

  async function checkNetwork() {
    if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
      return true;
    }
    setNetworkError('Please connect Metamask to Localhost:8545')
    return false;
  }


  async function initializeEthers() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const tempBallot = new ethers.Contract(
      contractAddress.ballot,
      BallotArtifact.abi,
      provider.getSigner(0)
    )
    setBallot(tempBallot)
  }

  //add features to interact with contract
  //voting + polling for balances and such

  if (!Addr) {
    return <div>
      <h1> Connect dat wallet</h1>
      <Button variant="contained" color="primary" onClick={() => connectWallet()} > Connect Wallet</Button>
    </div>
  }


  return (
    <div>
      <h1>te$t</h1>
      <h3> user address : {Addr} </h3>
    </div>
  );
}

export default App;
