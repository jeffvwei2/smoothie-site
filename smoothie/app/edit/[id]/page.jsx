'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SmoothieForm from '../../../components/SmoothieForm';

export default function EditSmoothiePage({ smoothies }) {
    const router = useRouter();
    const { id } = useParams();
    const [smoothie, setSmoothie] = useState(null);

    useEffect(() => {
        const smoothieToEdit = smoothies.find((s) => s.id === parseInt(id));
        setSmoothie(smoothieToEdit);
    }, [id, smoothies]);

    const updateSmoothie = (updatedSmoothie) => {
        const updatedSmoothies = smoothies.map((s) =>
            s.id === updatedSmoothie.id ? updatedSmoothie : s
        );
        setSmoothies(updatedSmoothies);
        router.push('/');
    };

    return (
        <div>
            <h2>Edit Smoothie</h2>
            {smoothie && <SmoothieForm smoothie={smoothie} onSubmit={updateSmoothie} />}
        </div>
    );
}
