import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import MatchesList from './components/MatchesList';
import MatchDetails from './components/MatchDetails';
import Borrow from './components/Borrow';
import ManageSeries from './components/admin/ManageSeries';
import { ethers } from 'ethers'
import GameBet from './artifacts/contracts/GameBet.sol/GameBet.json'

const gamebetAddress = '0x06b631BACBF83FD4e565D6a5601290abcc7eb7FF';

function App() {

  const [greeting, setGreetingValue] = useState()
  const [betAmount, setBetAmount] = useState()
  const [balance, setBalance] = useState()

  // request access to user's Metamask
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  // async function fetchGreeting() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
  //     try {
  //       const data = await contract.greet()
  //       console.log('data: ', data)
  //     } catch (err) {
  //       console.log("Error: ", err)
  //     }
  //   }
  // }

  // call the smart contract, send an update
  // async function setGreeting() {
  //   if (!greeting) return
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
  //     const transaction = await contract.setGreeting(greeting)
  //     await transaction.wait()
  //     // console.log('aaa')
  //     fetchGreeting()
  //   }
  // }

  // async function betTeam1() {


  //   if (typeof window.ethereum !== 'underfined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(gamebetAddress, GameBet.abi, signer)
  //     let overrides = {
  //       value: ethers.utils.parseEther("0.01")
  //     };
  //     const transaction = await contract.betTeam1(100, overrides);
  //     await transaction.wait()
  //   }
  // }

  useEffect(() => {

  }, [])

  return (
    <>
      <div className="bg-image-panel">
        <img src={`/images/w9.jpg`} className="bg-wallpaper" alt="" />
      </div>
      <Header />
      {/* <button onClick={betTeam1}>Bet Team 1</button>
      <input onChange={e => setBetAmount(e.target.value)} placeholder="Set Bet Amount" /> */}
      {/* <button onClick={setGreeting}>Set Greeting</button>
      <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />  */}
      {/* <button onClick={fetchGreeting}>Fetch Greeting</button>
      <button onClick={setGreeting}>Set Greeting</button>
      <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" /> */}
      <Router>
        <Switch>
          <Route path="/" component={MatchesList} exact></Route>
          <Route
            render={(props) => <MatchDetails {...props} />}
            path='/matches/:match'
            component={MatchDetails}
          />
          <Route path="/borrow" component={Borrow} exact></Route>
          <Route path="/admin/series" component={ManageSeries} exact></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
