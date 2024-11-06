import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import AddIngredient from './AddIngredient'

const initialList = ['Blueberries', 'Soy Milk', 'Strawberry', 'Ginger', 'Carrot', 'Nut Cheese']

export default function SmoothieForm({ smoothie, onSubmit, names }) {
    const [name, setName] = useState(smoothie ? smoothie.name : '');
    const [ingredients, setIngredients] = useState(
        smoothie ? smoothie.ingredients : [{ name: '', quantity: '' }]
    );
    const [custom, setCustom] = useState([])
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false)
    const [unique, setUnique] = useState(true)

    // set to edit mode
    useEffect(() => {
        if (smoothie) {
            setName(smoothie.name);
            setIngredients(smoothie.ingredients);
        }
    }, [smoothie]);

    // check if there are additional ingredients
    useEffect(() => {
        if (!custom.length) {
            const storage = localStorage.getItem('customIngredients')
            if (storage) {
                setCustom(JSON.parse(localStorage.getItem('customIngredients')))
            }
        } else {
            localStorage.setItem('customIngredients', JSON.stringify(custom))
        }
    }, [custom])

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) => {
            return i == index ? { ...ingredient, [field]: value } : ingredient
        })
        setIngredients(updatedIngredients);
    };

    const handleAddIngredient = () => {
        setValidated(false)
        setIngredients([...ingredients, { name: '', quantity: '' }]);
    };

    const isUniqueName = (name) => {
        // existing smoothie's own name
        if (smoothie) {
            return smoothie.name === name
        }
        //
        return names.includes(name)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isUniqueName(name.trim())) {
            setUnique(false)
        }
        if (!e.target.checkValidity()) {
            setValidated(true)
        } else {
            const smoothieData = {
                id: smoothie ? smoothie.id : Date.now(),
                name: name.trim(),
                ingredients,
            };
            onSubmit(smoothieData);
            setName('')
            setIngredients([{ name: '', quantity: '' }])
            setValidated(false)
            setUnique(true)
        }
    };

    const handleDeleteIngredient = (index) => {
        if (ingredients.length > 1) {
            const updatedIngredients = ingredients.toSpliced(index, 1)
            setIngredients(updatedIngredients)
        }
    }

    const handleCreateIngredient = (value) => {
        setCustom([...custom, value])
    }

    const toggleShow = () => {
        setShow(!show)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit} validated={validated} noValidate>
                <AddIngredient onSubmit={handleCreateIngredient} show={show} toggleShow={toggleShow}></AddIngredient>
                <h3>{smoothie ? 'Edit' : 'Create'} Smoothie</h3>
                <Form.Group controlId="name" key="name">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" placeholder="My Smoothie" value={name} onChange={(e) => setName(e.target.value)} required />
                    {!unique && <Form.Text className=" text-danger">
                        Name is already taken
                    </Form.Text>}
                    <Form.Control.Feedback type="invalid">
                        Please provide a name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Label className='mt-2'>
                    Ingredients:
                    <Button size="sm" variant="outline-primary" onClick={toggleShow} className='ms-4'>Create New Ingredient</Button>
                </Form.Label>
                {ingredients.map((ingredient, index) => (
                    <Form.Group controlId="ingredient" key={index}>
                        <Row className='mb-2'>
                            <Col>
                                <Form.Select
                                    key={ingredient.name}
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    required>
                                    <option value=''>Select an ingredient</option>
                                    {[...initialList, ...custom].map((a, i) => (
                                        <option key={i} value={a}>{a}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select an ingredient
                                </Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Control
                                    key={`${index}quantity`}
                                    type="text"
                                    placeholder="ex. 1 Cup"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                    required>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a quantity
                                </Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Button variant="danger" onClick={() => handleDeleteIngredient(index)}>
                                    X
                                </Button>
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
        </div>
    );
}
