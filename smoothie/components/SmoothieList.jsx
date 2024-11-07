'use client'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import SmoothieCard from './SmoothieCard'
import { useContext } from 'react';
import { AppContext } from './AppContext';

export default function SmoothieList() {
    const { smoothies } = useContext(AppContext);

    return (
        <Container fluid>
            <h2>Available Smoothies</h2>
            <div className="overflow-y-scroll h-100">
                {smoothies.length === 0 && <p>No smoothies yet!</p>}
                <Row >
                {smoothies.length && smoothies.map((smoothie) => (
                    <Col sm={4} key={`${smoothie.id}+col`}>
                        <div key={smoothie.id} className='m-2'>
                            <SmoothieCard smoothie={smoothie} list={true}/>
                        </div>
                    </Col>
                ))}
                </Row>
            </div>
        </Container>
    );
}
