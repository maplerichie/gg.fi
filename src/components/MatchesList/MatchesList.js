import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import './MatchesList.scss';
import CONSTANTS from '../../constants.json';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormPlaceBet from '../FormPlaceBet';
import { ArrowLeft } from 'react-feather';

function MatchesList() {
    const [error, setError] = useState(null)
    const [matches, setMatches] = useState([])
    const [betCardId, setBetCardId] = useState();
    const [isBack, setIsBack] = useState(0);

    const handleEnterBet = (lang) => {
        // event.stopPropagation();
        setIsBack(0)
        setBetCardId(lang)
    };

    const handleTest = (id) => {
        console.log('this is:', this);
    }
    // state = {
    //     matches: []
    // }

    // async componentDidMount() {

    //     const url = 'data/games.json';
    //     const response = await fetch(url, {
    //         headers: {
    //             'Accept-Language': 'en',
    //         }
    //     });
    //     const res = await response.json();
    //     console.log(res.data.matches)
    //     this.setState(
    //         {
    //             matches: res.data.matches
    //         }
    //     )
    // }


    useEffect(() => {
        
        ReactTooltip.rebuild();
        fetch(
            // CONSTANTS.API_URL + `dota2/series/running?filter[id]=3495`,
            // CONSTANTS.API_URL + `dota2/matches/upcoming?filter[opponents].length>1&per_page=15&range[begin_at]=2021-07-01T17:00:00Z,2021-07-05T22:00:00Z`,
            CONSTANTS.API_URL + `dota2/matches/upcoming?filter[opponents]!=null&per_page=13`,
            // 'data/games.json',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'Ozo4Hxz_Mn6P3xVa01Pdqn4nYx7Ky41NS6e--_2cYpmlvHO8NPA',
                    // 'X-Requested-With': 'XMLHttpRequest',
                    // 'Access-Control-Allow-Origin': 'http://localhost:3000',
                    // 'Access-Control-Allow-Credentials': true,
                    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    // 'Access-Control-Allow-Headers': 'Origin, Content- Type, Accept'
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
            {/* <h2>Matches List</h2> */}
            <ReactTooltip id="foo"/>
            <Container>
                <Row>
                    <Col md={1}><h3>Upcoming</h3></Col>
                    <Col md={11}>
                        <Row>
                            {
                                matches.map((match) =>
                                    <Col md={4} key={match.id}>

                                        <div className={`card card-match`}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    handleEnterBet(match.id)
                                                }}
                                            >Enter Bet</button>
                                            {/* Place Bet */}
                                            {(betCardId === match.id && isBack !== 1 &&
                                                <div className={`card bet-card`}>
                                                    <FormPlaceBet
                                                        match={match}
                                                        isDetailsPage={false}
                                                        test={
                                                            <ArrowLeft
                                                                className="back-arrow"
                                                                onClick={() => setIsBack(1)}
                                                            />}
                                                    />
                                                </div>
                                            )}
                                            {/* Place Bet */}
                                            <Link to={"/matches/" + match.id}>
                                                <span className="live-tag">Live</span>
                                                <div className="match-date">
                                                    <h4>{match.serie.name}</h4>
                                                    {
                                                        new Intl.DateTimeFormat('en-GB', {
                                                            month: 'long',
                                                            day: '2-digit',
                                                            year: 'numeric',
                                                        }).format(new Date(match.begin_at))
                                                    }
                                                    {/* <div>{match.tournament.name}</div> */}
                                                    {/* <span className="date">moment({match.begin_at}).format("YYYY-MM-DD")</span> */}
                                                </div>
                                                <div className="opponent-panel">
                                                    <Row>
                                                        <Col md={5}>
                                                            <div className="team-logo-box">
                                                                {match.opponents.length > 1
                                                                    ? <img src={match.opponents[0].opponent.image_url} className="team-logo" alt="" />
                                                                    : <h4>TBD</h4>
                                                                }
                                                                {/* {(match.opponents.length > 1 &&
                                                                
                                                                // : <p>a</p>
                                                            )} */}
                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <h6 className="wording-vs">VS</h6>
                                                        </Col>
                                                        <Col md={5}>
                                                            <div className="team-logo-box">
                                                                {match.opponents.length > 1
                                                                    ? <img src={match.opponents[1].opponent.image_url} className="team-logo" alt="" />
                                                                    : <h4>TBD</h4>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={5}>
                                                            {match.opponents.length > 1
                                                                ? <h6>{match.opponents[0].opponent.name}</h6>
                                                                : <h6>TBD</h6>
                                                            }
                                                        </Col>
                                                        <Col md={2}></Col>
                                                        <Col md={5}>
                                                            {match.opponents.length > 1
                                                                ? <h6>{match.opponents[1].opponent.name}</h6>
                                                                : <h6>TBD</h6>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="pool-summary-panel">
                                                    <div className="flex-between">
                                                        <h3>Prize Pool</h3>
                                                        <h3>35,020</h3>
                                                    </div>
                                                    <div className="flex-between">
                                                        <h3>My Bet</h3>
                                                        <h3>-</h3>
                                                    </div>
                                                    <div className="flex-between">
                                                        <h3>Match Type</h3>
                                                        <h3>BO{match.games.length}</h3>
                                                    </div>
                                                    <div className="separator"></div>
                                                </div>
                                                {/* <button
                                                    className="btn-primary"
                                                    onClick={() => {
                                                        handleEnterBet(match.id)
                                                    }}
                                                >Enter Bet</button> */}

                                            </Link>
                                        </div>
                                    </Col>
                                )
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default MatchesList;