import React, { useEffect, useState } from 'react';
import './Teams.scss';
import CONSTANTS from '../../constants.json';
// import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Teams(props) {
    const [error, setError] = useState(null)
    const [team, setTeam] = useState([]);
    const [players, setPlayers] = useState([]);
    const [opponents, setOpponents] = useState([])

    useEffect(() => {
        let isMounted = true;

        fetch(
            CONSTANTS.API_URL + `dota2/teams?filter[id]=` + props?.team,
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
                    setTeam(response[0])
                    setPlayers(response[0].players)
                    // console.log(response[0])
                },
                (error) => {
                    setError(error)
                }
            )

        // }, [props?.opponent1, props?.opponent2])
    }, [])

    return (
        <>
            <h4>{team.name}</h4>
            <div className="team-panel">
                <Row>
                    {
                        players.map((player) =>
                            <Col md={4} key={player.id}>
                                <div className="player-box">
                                    <div className="player-img-box">
                                        {player.image_url
                                            ? <img src={player.image_url} className="img-fit" alt="" />
                                            : <img src={`/images/avatar.png`} className="img-fit" alt="" />
                                        }
                                    </div>
                                    <div>
                                        <label>{player.name}</label>
                                        <p>{player.nationality}</p>
                                    </div>
                                </div>
                            </Col>
                        )}
                </Row>
            </div>
        </>
    )
}

export default Teams;