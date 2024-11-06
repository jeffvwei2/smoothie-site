import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'

export default function SmoothieList({ smoothies, deleteSmoothie, editSmoothie }) {
    return (
        <div>
            <h2>Available Smoothies</h2>
            <div className="overflow-y-scroll h-100">
            {smoothies.length === 0 && <p>No smoothies yet!</p>}
            {smoothies.map((smoothie) => (
                <div key={smoothie.id} className='m-3'>
                    <Card >
                        <Card.Title className='p-2'>{smoothie.name}</Card.Title>
                        <ListGroup variant="flush">
                            {smoothie.ingredients.map((ingredient, index) => (
                                <ListGroup.Item key={index}>
                                    {ingredient.name} - {ingredient.quantity}
                                </ListGroup.Item>
                                ))}
                        </ListGroup>
                        <Card.Footer className='mx-auto'>
                            <Button variant="secondary" onClick={() => editSmoothie(smoothie)}>Edit</Button>{' '}
                            <Button variant="danger" onClick={() => deleteSmoothie(smoothie.id)}>Delete</Button>{' '}
                        </Card.Footer>
                    </Card>
                </div>
            ))}
            </div>
        </div>
    );
}
