import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import BallotArtifact from "./contracts/quadraticBallot.json"
import contractAddress from "./contracts/contract-address.json"
import Button from '@material-ui/core/Button'

const BUIDLER_EVM_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001
const ethereum = window.ethereum
var pollDataInterval
const provider = new ethers.providers.Web3Provider(window.ethereum)

const Ballot = new ethers.Contract(
  contractAddress.ballot,
  BallotArtifact.abi,
  provider.getSigner(0)
)

function App() {

  const [Addr, setAddr] = useState()
  const [networkError, setNetworkError] = useState()
  const [provider, setProvider] = useState()
  const [Ballot1, setBallot] = useState()
  const [txError, setTxError] = useState()
  const [txBeingSent, setTxBeingSent] = useState()
  const [userBalance, setUserBalance] = useState()
  const [voteFor, setVoteFor] = useState()
  const [voteAgainst, setVoteAgainst] = useState()


  useEffect(() => {
    startPollingData()
  }, [])

  function startPollingData() {
    pollDataInterval = setInterval(() => updateBalance(), 6000)
    //Runs once so we don't have to wait 6 seconds when page first loads
    updateBalance();
  }


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
    setProvider(provider)
    setBallot(Ballot)
  }

  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      setAddr(accounts[0])
    })
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
      <h3> user balance : {userBalance} </h3>
      <Button variant="contained" color="primary" onClick={() => connectWallet()} > Connect Wallet</Button>
      <Button variant="contained" color="primary" onClick={() => registerVoter()} > Register Voter </Button>
      <Button variant="contained" color="primary" onClick={() => vote(1)} > Vote For </Button>
      <Button variant="contained" color="primary" onClick={() => vote(0)} > Vote Against </Button>
      <Button variant="contained" color="primary" onClick={() => getVoteFor()} > get Vote For </Button>
      <Button variant="contained" color="primary" onClick={() => getVoteAgainst()} > get Vote Against </Button>
      <Button variant="contained" color="primary" onClick={() => updateBalance()} > update balance </Button>
    </div>
  );


  async function registerVoter() {
    try {
      setTxError('undefined')
      console.log(Ballot)

      const tx = await Ballot.registerVoter()
      setTxBeingSent(tx.hash)
      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error("Tx failed")
      }
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      setTxError({ transactionError: error });
    } finally {
      setTxBeingSent({ txBeingSent: undefined });
    }
  }

  async function vote(direction) {
    try {
      setTxError('undefined')
      console.log(Ballot)

      const tx = await Ballot.vote(0, direction)
      setTxBeingSent(tx.hash)
      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error("Tx failed")
      }
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      setTxError({ transactionError: error });
    } finally {
      setTxBeingSent({ txBeingSent: undefined });
    }
  }

  async function getVoteFor() {
    let total
    try {
      total = await Ballot.getVoteCountFor(0)
      setVoteFor(total)
      console.log(total.toNumber())
    } catch (error) {
      console.log(error)
    }
  }

  async function getVoteAgainst() {
    let total
    try {
      total = await Ballot.getVoteCountAgainst(0)
      setVoteAgainst(total)
      console.log(total.toNumber())
    } catch (error) {
      console.log(error)
    }
  }

  async function updateBalance() {
    let total
    try {
      total = await Ballot.getBalance()
      setUserBalance(total.toNumber())
      console.log(total.toNumber())
    } catch (error) {
      console.log(error)
    }
}


}

export default App;
