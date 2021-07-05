import React, { useEffect, useState } from 'react';
import './Borrow.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function Borrow(props) {
    const [assets, setAssets] = useState([]);
    const [lendingProviders, setLendingProviders] = useState([]);
    const [collateral, setCollateral] = useState(0);
    const [borrow, setBorrow] = useState(0);

    useEffect(() => {
        fetch('./data/assets.json')
            .then((res) => res.json())
            .then((data) => {
                setAssets(data);
                setCollateral(0);
                setBorrow(1);
            });
        fetch('./data/providers.json')
            .then((res) => res.json())
            .then((data) => {
                setLendingProviders(data.lending);
            });
    }, [])

    const collateralChanged = (index) => {
        if (index === borrow) {
            if (index === 0) {
                setBorrow(1);
            } else {
                setBorrow(index - 1);
            }
        }
        setCollateral(index);
    }

    const borrowChanged = (index) => {
        if (index === collateral) {
            if (index === 0) {
                setCollateral(1);
            } else {
                setCollateral(index - 1);
            }
        }
        setBorrow(index);
    }

    return (
        <>
            <Container className="container-borrow">
                <Row>
                    <Col>

                        {/* Collateral and Borrow */}
                        <div className="borrow-info-panel">
                            <span>Select collateral </span>
                            <Dropdown onSelect={collateralChanged}>
                                <Dropdown.Toggle id="dropdown-collaterals">
                                    {assets.length > 0 ?
                                        <><img src={'/images/' + assets[collateral].image} />{assets[collateral].symbol}</>
                                        : <><img src={'/images/eth.png'} />ETH</>
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {assets.map((asset, index) =>
                                        <Dropdown.Item key={asset.symbol} eventKey={index}><img src={'/images/' + asset.image} />{asset.symbol}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            <span> and borrow </span>
                            <Dropdown onSelect={borrowChanged}>
                                <Dropdown.Toggle id="dropdown-borrows">
                                    {assets.length > 0 ?
                                        <><img src={'/images/' + assets[borrow].image} />{assets[borrow].symbol}</>
                                        : <><img src={'/images/eth.png'} />ETH</>
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {assets.map((asset, index) =>
                                        <Dropdown.Item key={asset.symbol} eventKey={index}><img src={'/images/' + asset.image} />{asset.symbol}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        {/* Provider */}
                        <h3>Providers</h3>
                        <section id="section-providers">
                            <Row>
                                {lendingProviders.map((lender, index) =>
                                    <Col md={4}>
                                        <div className={`card card-lender`} id={lender.name}>
                                            <h3><img src={"/images/" + lender.icon} className="logo" />{lender.name}</h3>
                                            <p>{lender.tagline}</p>
                                            <h6>{lender.rate}%&nbsp;{lender.rate_type}</h6>
                                            <div className="summary">
                                                <div className="flex-between">
                                                    <h3>Min Collateral Ratio</h3>
                                                    <span>{lender.collateral_ratio}%</span>
                                                </div>
                                                <div className="flex-between">
                                                    <h3>Borrowing Fee</h3>
                                                    <span>{lender.borrow_fee}%</span>
                                                </div>
                                                <div className="flex-between">
                                                    <h3>Interest</h3>
                                                    <span>{lender.interest}%</span>
                                                </div>
                                                <div className="flex-between">
                                                    <h3>Assets</h3>
                                                    <div className="provider-assets">
                                                        {lender.deposit.map((asset) =>
                                                            <img src={"/images/" + asset + ".png"} />
                                                        )}
                                                        {lender.name === 'Liquity' ? lender.borrow.map((asset) =>
                                                            <img src={"/images/" + asset + ".png"} />
                                                        ) : <></>}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn-primary">Borrow</button>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </section>
                    </Col>
                </Row>
            </Container >
        </>
    )
}

export default Borrow;