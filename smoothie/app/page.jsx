'use client'
import { useEffect, useState } from 'react';
import SmoothieList from './components/SmoothieList';
// import { PlusIcon } from '../icons/PlusIcon'
import SmoothieForm from './components/SmoothieForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Home() {
    const [smoothies, setSmoothies] = useState([]);
    const [names, setNames] = useState([])
    const [editing, setEditing] = useState()
    
    useEffect(() => {
        if (!smoothies.length) {
            const storage = localStorage.getItem('smoothies')
            if(storage) {
                setSmoothies(JSON.parse(localStorage.getItem('smoothies')))
                setNames(smoothies.map((smoothie) => smoothie.name))
            } 
        } else {
            localStorage.setItem('smoothies',JSON.stringify(smoothies))
            setNames(smoothies.map((smoothie) => smoothie.name))
        }
    },[smoothies])

    const handleDeleteSmoothie = (id) => {
        setSmoothies(smoothies.filter((smoothie) => smoothie.id !== id));
    };

    const handleUpdateSmoothies = (smoothie) => {
        if (editing && smoothie.id === editing.id){
            const updatedSmoothies = smoothies.map((s) => {
                return smoothie.id == s.id ? smoothie : s
            })
            setSmoothies(updatedSmoothies)
        } else {
            setSmoothies([...smoothies,smoothie])
        }
        setEditing()
    }

    const handleEdit = (smoothie) => {
        setEditing(smoothie)
    }
    const clearCache = () => {
        localStorage.removeItem('smoothies')
        localStorage.removeItem('customIngredients')
        window.location.reload()
    }

    return (
        <Container>
            <header>
                <nav>
                    <h1>
                    <Row>
                    <Col>
                        Smoothie Maker
                    </Col>
                    <Col sm={1}>
                        <Button variant="light" onClick={() => clearCache()} className='text-white' size='sm'>Clear Cache</Button>
                    </Col>
                    </Row>
                    </h1>
                </nav>
            </header>
            <div>
                <main className='row'>
                    <div className="col-4">
                        <SmoothieList smoothies={smoothies} deleteSmoothie={handleDeleteSmoothie} editSmoothie={handleEdit}/>
                    </div>
                    <div className="col">
                        <SmoothieForm onSubmit={handleUpdateSmoothies} names={names} smoothie={editing}/>
                    </div>
                </main>
            </div>
        </Container>
    );
}