import React, { useEffect, useState } from 'react';
import './ButtonConnectWallet.scss';
import CONSTANTS from '../../constants.json';
// import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ethers } from 'ethers'

function ButtonConnectWallet(props) {
    const [account, setAccount] = useState()
    const [balance, setBalance] = useState()
    const [error, setError] = useState(null)

    async function loadAccount() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        setAccount(await signer.getAddress())

        // Other Method to get address
        // setAccount(await window.ethereum.request({ method: 'eth_requestAccounts' }))
    }

    async function requestBalance() {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const xx = await provider.getBalance(account)
        // setBalance(ethers.utils.formatEther(xx))

        let roundedBalance = ethers.utils.formatEther(xx)
        roundedBalance = (+roundedBalance).toFixed(4)
        setBalance(roundedBalance)
        // console.log("Balance: ", ethers.utils.formatEther(xx));
    }

    useEffect(() => {
        loadAccount()
        requestBalance()
    }, [])

    return (
        <>
            {account
                ? <div className="wallet-summary-panel"><h3>{balance} ETH</h3><span className="account-display">{account}</span></div>
                : <button className={`btn-connect-wallet`}>Connect Wallet</button>
            }
        </>
    )
}

export default ButtonConnectWallet;