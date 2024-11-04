'use client';
import { useState } from 'react';
import SmoothieForm from '@/components/SmoothieForm';

export default function CreateSmoothiePage() {
    const [smoothies, setSmoothies] = useState([]);
    console.log(smoothies)
    const addSmoothie = (smoothie) => {
        setSmoothies([...smoothies, smoothie]);
        console.log(smoothies)
    };

    return (
        <div>
            <h2>Create a New Smoothie</h2>
            <SmoothieForm onSubmit={addSmoothie} />
        </div>
    );
}
