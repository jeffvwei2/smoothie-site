'use client'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import api from '../api';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function SmoothieCard({ smoothie, list }) {
  const {setSmoothies, smoothies} = useContext(AppContext)
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/edit/${smoothie.id}`)
  }

  const handleOpen = () => {
    router.push(`/${smoothie.id}`)
  }

  const handleDeleteSmoothie = async (id) => {
    const updatedSmoothies = smoothies.filter((smoothie) => smoothie.id !== id)
    setSmoothies(updatedSmoothies);
    if (!list){
      router.push('/')
    }
    try {
      await api.delete(`/${id}`)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div key={smoothie.id} className='m-3'>
      <Card>
        <Card.Title className='p-2'>{smoothie.name}</Card.Title>
        <ListGroup variant="flush">
          {smoothie.ingredients.map((ingredient, index) => (
            <ListGroup.Item key={index}>
              {ingredient.name} - {ingredient.quantity}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer >
          <ButtonGroup>
         {list && <Button variant='secondary' onClick={handleOpen}>Open</Button>}
          <Button variant="primary" onClick={handleEdit}>Edit</Button>
          <Button variant="danger" onClick={() => handleDeleteSmoothie(smoothie.id)}>Delete</Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </div>
  )
}