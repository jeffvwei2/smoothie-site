'use client'
import { useEffect, useState } from 'react';
import SmoothieList from './components/SmoothieList';
// import { PlusIcon } from '../icons/PlusIcon'
import SmoothieForm from './components/SmoothieForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'

export default function Home() {
    const [smoothies, setSmoothies] = useState([]);
    useEffect(() => {
        if (!smoothies.length) {
            const storage = localStorage.getItem('smoothies')
            if(storage) {
                setSmoothies(JSON.parse(localStorage.getItem('smoothies')))
            } 
        } else {
            localStorage.setItem('smoothies',JSON.stringify(smoothies))
        }
    },[smoothies])

    const deleteSmoothie = (id) => {
        setSmoothies(smoothies.filter((smoothie) => smoothie.id !== id));
    };

    const updateSmoothieList = (smoothie) => {
        setSmoothies([...smoothies,smoothie])
    }

    return (
        <Container>
            <header>
                <nav>
                    <h1 >Smoothie Maker</h1>
                </nav>
            </header>
            <div>
                <main className='row'>
                    <div className="col-4">
                        <SmoothieList smoothies={smoothies} deleteSmoothie={deleteSmoothie}/>
                    </div>
                    <div className="col">
                        <SmoothieForm onSubmit={updateSmoothieList} />
                    </div>
                </main>
            </div>
        </Container>
    );
}