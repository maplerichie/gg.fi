import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import './ManageSeries.scss';
import CONSTANTS from '../../../constants.json';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ethers } from 'ethers'
import GameBet from '../../../artifacts/contracts/GameBet.sol/GameBet.json'

const gamebetAddress = '0xe82974ECF8b909FEBEa02dA8aC40341D73928bD1';

function ManageSeries() {
    const [error, setError] = useState(null)
    const [matches, setMatches] = useState([])
    const [betCardId, setBetCardId] = useState();
    const [isBack, setIsBack] = useState(0);
    const [x, setX] = useState([]);

    // request access to user's Metamask
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function executeSeries(seriesId, totalMatch, team1Id, team2Id) {
        console.log(seriesId + ' | ' + totalMatch + ' | ' + team1Id + ' | ' + team2Id)
        if (typeof window.ethereum !== 'underfined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(gamebetAddress, GameBet.abi, signer)
            // let overrides = {
            //     value: ethers.utils.parseEther("0.01")
            // };
            // const transaction = await contract.executeSeriesBet(seriesId, overrides);
            const transaction = await contract.executeSeriesBet(seriesId, totalMatch, team1Id, team2Id);
            await transaction.wait()
            console.log(seriesId)
        }
    }

    async function test(seriesId) {
        console.log(seriesId)
        if (typeof window.ethereum !== 'underfined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(gamebetAddress, GameBet.abi, signer)
            // let overrides = {
            //     value: ethers.utils.parseEther("0.01")
            // };
            // const transaction = await contract.executeSeriesBet(seriesId, overrides);
            // const transaction = await contract.seriesBets;
            // await transaction.wait()
            let x = await contract.seriesBets(1)
            console.log(x)
        }
    }

    useEffect(() => {

        fetch(
            CONSTANTS.API_URL + `dota2/matches/upcoming?filter[opponents]!=null&per_page=13`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'Ozo4Hxz_Mn6P3xVa01Pdqn4nYx7Ky41NS6e--_2cYpmlvHO8NPA'
                },
            }
        )
            .then(res => res.json())
            .then(
                (response) => {
                    setMatches(response)
                },
                (error) => {
                    setError(error)
                }
            )
    }, [])


    return (
        <>
            <Container className="container-medium">
                {/* <button
                    onClick={() => {
                        test(599309)
                    }}>get Bet</button> */}
                <div className="card card-match-list">
                    {matches.map((match =>
                        <div key={match.id}>
                            <Row>
                                <Col md={2}>
                                    <h4>{match.id}</h4>
                                </Col>
                                <Col md={8}>
                                    <div className="teams">
                                        <Row>
                                            <Col md={5}>
                                                <div className={`flex-box start`}>
                                                    {match.opponents.length > 1
                                                        ? <><img src={match.opponents[0].opponent.image_url} className="team-logo" alt="" /><h3>{match.opponents[0].opponent.name}</h3></>
                                                        : <h4>TBD</h4>
                                                    }
                                                </div>

                                            </Col>
                                            <Col md={2}><h4>VS</h4></Col>
                                            <Col md={5}>
                                                <div className={`flex-box end`}>
                                                    {match.opponents.length > 1
                                                        ? <><h3>{match.opponents[1].opponent.name}</h3><img src={match.opponents[1].opponent.image_url} className="team-logo" alt="" /></>
                                                        : <h4>TBD</h4>
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    {/* {active} */}
                                    <button
                                        className={`btn-primary`}
                                        onClick={() => {
                                            executeSeries(match.id, match.games.length, match.opponents[0].opponent.id, match.opponents[1].opponent.id)
                                        }}
                                    >Open</button>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </div>
            </Container>

        </>
    )
}

export default ManageSeries;