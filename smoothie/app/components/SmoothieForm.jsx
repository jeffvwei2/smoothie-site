import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'

const initialList= ['Blueberries', 'Soy Milk', 'Strawberry', 'Ginger', 'Carrot','Nut Cheese']

export default function SmoothieForm({ smoothie, onSubmit }) {
    const [name, setName] = useState(smoothie ? smoothie.name : '');
    const [ingredients, setIngredients] = useState(
        smoothie ? smoothie.ingredients : [{ name: '', quantity: '' }]
    );
    const [available, setAvailable] = useState(initialList)

    // set to edit mode
    useEffect(() => {
        if (smoothie) {
            setName(smoothie.name);
            setIngredients(smoothie.ingredients);
        }
    }, [smoothie]);

    // check if there are additional ingredients
    // useEffect(() => {
        // if (!ingredients.length) {
        //     const storage = localStorage.getItem('ingredients')
        //     if(storage) {
        //         setIngredients(JSON.parse(localStorage.getItem('ingredients')))
        //     } 
        // } else {
        //     localStorage.setItem('ingredients',JSON.stringify(ingredients))
        // }
    // },[available])

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const smoothieData = {
            id: smoothie ? smoothie.id : Date.now(),
            name,
            ingredients,
        };
        onSubmit(smoothieData);
        setName('')
        setIngredients([{ name: '', quantity: '' }])
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>{smoothie ? 'Edit' : 'Create'} Smoothie</h3>
            <Form.Group controlId="name">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" placeholder="My Smoothie" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Label>Ingredients:</Form.Label>
            {ingredients.map((ingredient, index) => (
                <Form.Group  controlId="ingredient" key={index}>
                    <Row className='mb-2'>
                    <Col>
                    <Form.Select 
                        // type="select" 
                        // placeholder="Ingredient"
                        value={ingredient.name} 
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} 
                        required>
                            <option>Select an ingredient</option>
                    {available.map((a,index) => (
                        <option value={a}>{a}</option>
                    ))}
                    </Form.Select>
                    </Col>
                    <Col>
                    <Form.Control 
                        type="text" 
                        placeholder="Quantity"
                        value={ingredient.quantity} 
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} 
                        required>
                    </Form.Control>
                    </Col>
                    </Row>
                </Form.Group>
            ))}
            <Row className='mx-auto'>
                <Col>
                    <Button variant="primary" onClick={handleAddIngredient}>Add Ingredient</Button>{' '}
                    <Button variant="primary" type="submit">Save Smoothie</Button>
                </Col>
            </Row>
        </Form>
    );
}
