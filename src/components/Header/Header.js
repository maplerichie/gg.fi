import React, { useEffect, useState } from 'react';
import './Header.scss';
import CONSTANTS from '../../constants.json';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonConnectWallet from '../ButtonConnectWallet';

function Header(props) {
    const [error, setError] = useState(null)

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="header">
                <div className="container">
                    <div className="flex-between">
                        <div className="flex-box">
                            <a href="/"><img src={`/images/logo.png`} className="header-logo" alt="" /></a>
                            <ul>
                                <li>DOTA 2</li>
                                <li>CS GO</li>
                                <li>Fortnite</li>
                                <li>LOL</li>
                            </ul>
                        </div>
                        <div className="flex-box">
                            <button className={`btn-borrow`}><a href="/borrow">Borrow</a></button>
                            <ButtonConnectWallet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;