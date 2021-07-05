import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import './FormPlaceBet.scss';
import CONSTANTS from '../../constants.json';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { ethers } from 'ethers';
import GameBet from '../../artifacts/contracts/GameBet.sol/GameBet.json';

const gamebetAddress = '0xe82974ECF8b909FEBEa02dA8aC40341D73928bD1';

function FormPlaceBet(props, { test }) {
    const [games, setGames] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(props.match)
    const [currentTeams, setCurrentTeams] = useState(props.match.opponents)
    const [selectedTeamId, setSelectedTeamId] = useState()
    const [selectedMatchId, setSelectedMatchId] = useState()

    const handleSelectedTeam = (matchID, selectedTeamID) => {
        setSelectedTeamId(selectedTeamID)
        setSelectedMatchId(matchID)
    };

    // request access to user's Metamask
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function betable(seriesId) {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(gamebetAddress, GameBet.abi, signer)
        const betable = await contract.bettable(seriesId).then((allow) => {
            return true;
        }).catch((err) => {
            alert('Match not bettable')
            return false;
            console.log(err);
        });
    }

    async function betTeam1(seriesId) {
        if (betable(seriesId) === true) {
            alert('asd')
            if (typeof window.ethereum !== 'underfined') {
                await requestAccount()
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner()
                const contract = new ethers.Contract(gamebetAddress, GameBet.abi, signer)

                let overrides = {
                    value: ethers.utils.parseEther("0.01")
                };
                const transaction = await contract.betTeam1(100, overrides);
                await transaction.wait()
                // if (betable(seriesId)) {
                //     let overrides = {
                //         value: ethers.utils.parseEther("0.01")
                //     };
                //     const transaction = await contract.betTeam1(100, overrides);
                //     await transaction.wait()
                // } else {
                //     alert('The match is not open')
                // }

            }
        }
    }

    useEffect(() => {
        // console.log(props?.match)
        setCurrentMatch(props?.match)
    }, [])


    return (
        <>
            <form id={`form-${currentMatch.id}`} className="form-place-bet" key={currentMatch.id}>
                <div className="title-panel">
                    {props.test}
                    <h3>Bet Details</h3>
                </div>
                {/* <h1 data-tip="hello world" data-for="foo" data-place='top'>aaa</h1> */}
                {props.isDetailsPage === true &&
                    <h4>1. Select Match / Map</h4>
                }
                <div className="scroll-horizontal-wrapper">
                    <div className="bet-tab">
                        <div className="active">Match</div>
                        {currentMatch.games.map((game) =>
                            <div className="disabled" data-tip="hello world" data-for="foo" data-place='top'><span>Map</span> <span className="map-number"> {game.position}</span></div>
                        )}
                    </div>
                </div>
                {props.isDetailsPage === true &&
                    <h4>2. Select Team</h4>
                }
                <div className="select-team-panel">
                    {/* <div id={opponent.opponent.id} className={`select-team team-${opponent.opponent.id}`} */}
                    <Row>
                        {currentMatch.opponents.map((opponent) =>
                            <Col md={6}>
                                <div className={`select-team ${currentMatch.id === selectedMatchId && opponent.opponent.id === selectedTeamId ? "active" : ""}`}
                                    onClick={() => {
                                        handleSelectedTeam(currentMatch.id, opponent.opponent.id)
                                    }}
                                >
                                    <img src={opponent.opponent.image_url} alt="" />
                                    <h3>{opponent.opponent.name}</h3>
                                </div>
                                {/* {selectedTeamId == opponent.opponent.id
                                    ? 
                                    : <div className="select-team">
                                        <img src={opponent.opponent.image_url} alt="" />
                                        <h3>{opponent.opponent.name}</h3>
                                        <p>{selectedTeamId}  {opponent.opponent.id}</p>
                                    </div>
                                } */}
                            </Col>
                        )}
                    </Row>
                </div>

                {props.isDetailsPage === true &&
                    <h4>3. Enter Amount</h4>
                }
                <div className="in-logo-box">
                    {/* <div className="dropdown-bet">
                        <img src={`/images/og.png`} alt="" />
                        <h3>InFamous</h3>
                    </div> */}
                    <div className="dropdown-coins">

                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-collaterals">
                                <img src={`/images/eth.png`} alt="" /> <h3>ETH</h3>
                                {/* <><img src={'/images/' + assets[collateral].image} />{assets[collateral].symbol}</>
                                                : <><img src={'/images/eth.png'} />ETH</> */}

                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item><img src={`/images/lusd.png`} alt="" /> <h3>LUSD</h3></Dropdown.Item>
                                <Dropdown.Item><img src={`/images/dai.png`} alt="" /> <h3>DAI</h3></Dropdown.Item>
                                <Dropdown.Item><img src={`/images/usdc.png`} alt="" /> <h3>USDC</h3></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <input
                        placeholder="0.00"
                    />
                </div>
                <p className="text-right">Wallet Balance: 367</p>
                <div className="percentage-panel">
                    <div><span className="percentage-box">25%</span></div>
                    <div><span className="percentage-box">50%</span></div>
                    <div><span className="percentage-box">75%</span></div>
                    <div><span className="percentage-box">All In</span></div>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        betTeam1(currentMatch.id)
                    }}
                    // onClick={betTeam1(currentMatch.id)}
                    // onClick={betTeam1({currentMatch.id})}
                    type="button"
                >Place Bet</button>
                {/* <p className="remarks">Once the bet is placed, it cannot be cancelled.</p> */}
            </form>
        </>
    )
}

export default FormPlaceBet;