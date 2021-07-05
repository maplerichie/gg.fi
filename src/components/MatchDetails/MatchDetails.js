import React, { useEffect, useState } from 'react';
import './MatchDetails.scss';
import CONSTANTS from '../../constants.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Share2, Calendar, Clock, Pocket } from 'react-feather';
import Teams from '../Teams';
import FormPlaceBet from '../FormPlaceBet';

function MatchDetails(props) {
    const [error, setError] = useState(null)
    const [match, setMatch] = useState([])
    const [teams, setTeams] = useState([])
    const [games, setGames] = useState([])
    const [currentMatch, setCurrentMatch] = useState([])

    useEffect(() => {
        fetch(
            CONSTANTS.API_URL + `dota2/matches/upcoming?filter[id]=` + props.match.params.match,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'Ozo4Hxz_Mn6P3xVa01Pdqn4nYx7Ky41NS6e--_2cYpmlvHO8NPA',
                },
            }
        )
            .then(res => res.json())
            .then(
                (response) => {
                    setMatch(response[0])
                    setGames(response[0].games)
                    setTeams(response[0].opponents)
                    setCurrentMatch(response)
                    // console.log(response[0])
                    // console.log('Opponent 1 : ' + response[0].opponents[0].opponent.id + 'Opponent 2 : ' + response[0].opponents[1].opponent.id)
                },
                (error) => {
                    setError(error)
                }
            )
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col md={8}>

                        {/* VS Panel */}
                        <div className="vs-panel">
                            <div>
                                <label className="match-progress">Upcoming</label>
                            </div>
                            <Row>
                                {teams[0] &&
                                    teams[0].opponent &&
                                    <>
                                        <Col md={5}>
                                            <div className={`team-box left`}>
                                                <div className="name-box">
                                                    <h6>{teams[0].opponent.name}</h6>
                                                    <span>Portugal</span>
                                                </div>
                                                <div className="team-logo-box">
                                                    <img src={teams[0].opponent.image_url} className="team-logo" alt="" />
                                                </div>
                                            </div>
                                        </Col>
                                    </>
                                }
                                <Col md={2}>
                                    <h6 className="wording-vs">VS</h6>
                                </Col>
                                {teams[1] &&
                                    teams[1].opponent &&
                                    <>
                                        <Col md={5}>
                                            <div className={`team-box right`}>
                                                <div className="team-logo-box">
                                                    <img src={teams[1].opponent.image_url} className="team-logo" alt="" />
                                                </div>
                                                <div className="name-box">
                                                    <h6>{teams[1].opponent.name}</h6>
                                                    <span>Portugal</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </>
                                }
                            </Row>
                            <div className="match-details">
                                <div>
                                    <h3>
                                        <Calendar />
                                        {/* {match.begin_at} */}
                                        {/* {
                                            new Intl.DateTimeFormat('en-GB', {
                                                month: 'long',
                                                day: '2-digit',
                                                year: 'numeric',
                                            }).format(new Date(match.begin_at))
                                        } */}
                                    </h3>
                                </div>
                                <div>
                                    <h3><Clock />11.20 AM (UTC)</h3>
                                </div>
                                <div>
                                    <h3><Pocket />BO1</h3>
                                </div>
                            </div>
                        </div>
                        {/* End VS Panel */}
                        {/* Games */}
                        <section id="section-game-details">
                            <div className="card">
                                <div className={`title-panel flex-between`}>
                                    <h2>Games</h2>
                                    <div className="games-panel">
                                        {games.map(game => (
                                            <div key={game.id}>Map {game.position}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="twitch-frame">
                                    <iframe
                                        src={match.live_embed_url ? match.live_embed_url + "&parent=localhost" : "https://www.youtube.com/embed/7ggwLccuN5s" }
                                        parent="localhost"
                                        height="350px"
                                        width="100%"
                                        allowfullscreen="true"/>
                                </div>
                                <Row className="team-hero-stats-panel">
                                    <Col md={6}>
                                        <div className={`flex-between team-panel`}>
                                            <div className="flex-box">
                                                <h3>OG</h3>
                                                {/* <span className="winning-tag">Win</span> */}
                                            </div>
                                            <h6>36</h6>
                                        </div>
                                        <br />
                                        <div className={`flex-between`}>
                                            <h4>Picks</h4>
                                            <div className={`kill-stats-label-panel`}>
                                                <h4>K</h4>
                                                <h4>D</h4>
                                                <h4>A</h4>
                                            </div>
                                        </div>
                                        <div className="hero-pick-panel">
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero2.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero3.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero4.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero5.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero1.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h4>Bans</h4>
                                        <div className="hero-ban-panel">
                                            <div className="pick-box">
                                                <div className="hero-box">
                                                    <img src={`/images/hero/hero1.png`} alt="" />
                                                </div>
                                            </div>
                                            <div className="pick-box">
                                                <div className="hero-box">
                                                    <img src={`/images/hero/hero3.png`} alt="" />
                                                </div>
                                            </div>

                                            <div className="pick-box">
                                                <div className="hero-box">
                                                    <img src={`/images/hero/hero5.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className={`flex-between team-panel`}>
                                            <div className="flex-box">
                                                <h3>InFamous</h3>
                                            </div>
                                            <h6>28</h6>
                                        </div>
                                        <br />
                                        <div className={`flex-between`}>
                                            <h4>Picks</h4>
                                            <div className={`kill-stats-label-panel`}>
                                                <h4>K</h4>
                                                <h4>D</h4>
                                                <h4>A</h4>
                                            </div>
                                        </div>
                                        <div className="hero-pick-panel">
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero5.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero3.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero2.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero1.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                            <div className={`flex-between pick-box`}>
                                                <div className="flex-box">
                                                    <div className="hero-img-box">
                                                        <img src={`/images/hero/hero4.png`} className="img-fit" alt="" />
                                                    </div>
                                                    <label>Player 1</label>
                                                </div>
                                                <div className={`flex-box kill-stats`}>
                                                    <div>3</div>
                                                    <div>6</div>
                                                    <div>7</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h4>Bans</h4>
                                        <div className="hero-ban-panel">
                                            <div className="pick-box">
                                                <div className="hero-box">
                                                    <img src={`/images/hero/hero5.png`} alt="" />
                                                </div>
                                            </div>
                                            <div className="pick-box">
                                                <div className="hero-box">
                                                    <img src={`/images/hero/hero2.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </section>
                        {/* Games */}
                        <section className="team-profile-panel">
                            <div className="card">
                                <h2>Team Profile</h2>
                                <Row>
                                    {teams.map(team => (
                                        <Col md="6">
                                            <Teams team={team.opponent.id} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </section>
                    </Col>
                    <Col md={4}>
                        <div className="fixed-bet-panel">
                            {/* Close Bet */}
                            <div className={`card card-bet-details card-close-bet`} hidden>
                                <span>InFamous vs Infinity</span>
                                <h3 stylr="margin-bottom: 0 !important;">Bet on InFamous</h3>
                                <div className="flex-box">
                                    <h1>Infamous</h1>
                                    <img src={`/images/og.png`} alt="" />
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <span>Price Pool</span>
                                        <h6>36,705 ETH</h6>
                                    </Col>
                                    <Col md={6}>
                                        <span>Bet Amount</span>
                                        <h6>12.5 ETH</h6>
                                    </Col>
                                </Row>
                            </div>
                            {/* Close bet */}
                            {/* Place Bet Form */}
                            <div className="card">
                                {currentMatch.map((match) =>
                                // <h1>a</h1>
                                 <FormPlaceBet
                                        match={match}
                                        isDetailsPage={true}
                                        test={
                                            <div></div>
                                        }
                                    />
                                )}
                                {/* <FormPlaceBet
                                        match={currentMatch}
                                        isDetailsPage={true}
                                        test={
                                            <div></div>
                                        }
                                    /> */}
                            </div>
                            {/* End Place Bet form */}
                            {/* Bet Details */}
                            <div className={`card card-bet-details`}>
                                <h4 className="line-1">Pool's Stats</h4>
                                <div className="flex-between">
                                    <h3>Price Pool</h3>
                                    <h3>36,501 <span>LINK</span></h3>
                                </div>
                                <div className="flex-between">
                                    <h3>Yield Source</h3>
                                    <h3>AAVE <img src={`/images/aave-white.png`} className="aave-logo" alt="" /></h3>
                                </div>
                                <div className="flex-between">
                                    <h3>APY</h3>
                                    <span>~ 6.66%</span>
                                </div>
                                <div className="separator"></div>
                                <div className="flex-between">
                                    <h3>My Bet</h3>
                                    <div className="flex-box">
                                        <span className="bet-item">InFamous</span>
                                        <h3>13.5 ETH</h3>
                                    </div>
                                </div>
                                <div className="flex-between">
                                    <h3>Payout</h3>
                                    <span>~ 1.2x</span>
                                </div>
                                <div className="flex-between">
                                    <h3>Potential Reward</h3>
                                    <div className="flex-box">
                                        <span>~ 0.6 ETH</span>
                                    </div>
                                </div>
                                {/* <h4 className="line-1">Match Details</h4>
                                <div className="flex-between">
                                    <h3>Team</h3>
                                    <h3>InFamous VS OG</h3>
                                </div>
                                <div className="flex-between">
                                    <h3>Round</h3>
                                    <h3>BO1</h3>
                                </div>
                                <div>
                                    <div className="in-logo-box">
                                        <div className="dropdown-bet">
                                            <img src={`/images/og.png`} alt="" />
                                            <h3>InFamous</h3>
                                        </div>
                                        <input
                                            placeholder="0.00"
                                        />
                                        
                                    </div>
                                    <label className="text-right">Wallet Balance: 150</label>
                                    <div className="percentage-panel">
                                        <div><span className="percentage-box">25%</span></div>
                                        <div><span className="percentage-box">50%</span></div>
                                        <div><span className="percentage-box">75%</span></div>
                                        <div><span className="percentage-box">All In</span></div>
                                    </div>
                                    <button className="btn-primary">Place Bet</button>
                                    <p className="remarks">Once the bet is placed, it cannot be cancelled.</p>

                                </div> */}
                            </div>
                            {/* End Bet Details */}

                            {/* Share Bet */}
                            <div className={`card card-bet-details card-share-bet`}>

                                <h4 className="line-2">BO1</h4>
                                <span>InFamous VS Infinity</span>
                                <h3>Winner</h3>
                                <div className="flex-box">
                                    <h1>Infamous</h1>
                                    <img src={`/images/og.png`} alt="" />
                                    {/* <div className="share-effect"></div> */}
                                </div>
                                <span>You've won</span>
                                <h6>25.21 LINK</h6>
                                <Share2 />
                            </div>
                            {/* Share Bet */}
                        </div>
                    </Col>
                </Row>
            </Container >
        </>
    )
}

export default MatchDetails;