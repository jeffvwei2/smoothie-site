'use client'
import { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import AddIngredient from './AddIngredient'
import { useRouter } from 'next/navigation';
import { AppContext } from './AppContext'
import api from '../api';

export default function SmoothieForm({ smoothie, onSubmit }) {
    const router = useRouter()
    const [name, setName] = useState(smoothie ? smoothie.name : '');
    const [ingredients, setIngredients] = useState(
        smoothie ? smoothie.ingredients : [{ name: '', quantity: '' }]
    );
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false)
    const [names, setNames] = useState([])
    const { smoothies,available ,setAvailable} = useContext(AppContext)
    const [unique, setUnique] = useState(true)

    // set to edit mode
    useEffect(() => {
        if (smoothie) {
            setName(smoothie.name);
            setIngredients(smoothie.ingredients);
        }
    }, [smoothie]);

    useEffect(() => {
        setNames(smoothies.map((s) => s.name))
    }, [smoothies])

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

    const isNameTaken = (name) => {
        if (names.includes(name)) {
            const isUnique = smoothie && smoothie.name === name
            setUnique(isUnique)
            return isUnique
        }
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isNameTaken(name.trim()) || !e.target.checkValidity()) {
            setValidated(true)
        } else {
            const smoothieData = {
                id: smoothie ? smoothie.id : Date.now(),
                name: name.trim(),
                ingredients,
            };
            onSubmit(smoothieData);
            router.push('/')
        }
    };

    const handleDeleteIngredient = (index) => {
        if (ingredients.length > 1) {
            const updatedIngredients = ingredients.toSpliced(index, 1)
            setIngredients(updatedIngredients)
        }
    }

    const handleCreateIngredient = async (ingredient) => {
        setAvailable([...available, ingredient])
        try {
            await api.post('/ingredients', { ingredient })
        } catch (err) {
            console.log(err)
        }
    }

    const toggleShow = () => {
        setShow(!show)
    }

    const clearForm = () => {
        setName('')
        setIngredients([{ name: '', quantity: '' }])
        setValidated(false)
        setUnique(true)
    }

    const handleNavigate = () => {
        router.push('/')
    }

    return (
        <div>
            <Form onSubmit={handleSubmit} validated={validated} noValidate>
                <AddIngredient onSubmit={handleCreateIngredient} show={show} toggleShow={toggleShow}></AddIngredient>
                <h3>{smoothie ? 'Edit' : 'Create'} Smoothie</h3>
                <Row className='mx-auto'>
                    <Col>
                        <Button variant="secondary" onClick={handleNavigate} className='ms-4'>Back</Button>
                        <Button variant="primary" onClick={toggleShow} className='ms-4'>Create New Ingredient</Button>
                    </Col>
                </Row>
                <Form.Group controlId="name" key="name">
                    <Row >
                        <Col sm={8}>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="My Smoothie" value={name} onChange={(e) => setName(e.target.value)} required />
                            {!unique && <Form.Text className="text-danger">
                                Name is already taken
                            </Form.Text>}
                            <Form.Control.Feedback type="invalid">
                                Please provide a name
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Label className='mt-2'>
                    Ingredients:
                </Form.Label>
                {ingredients.length && ingredients.map((ingredient, index) => (
                    <Form.Group controlId="ingredient" key={index}>
                        <Row className='mb-2'>
                            <Col>
                                <Form.Select
                                    key={ingredient.name}
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    required>
                                    <option value=''>Select an ingredient</option>
                                    {available.length && available.map((a, i) => (
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
                                {!!index && <Button variant="danger" onClick={() => handleDeleteIngredient(index)}>
                                    X
                                </Button>}
                            </Col>
                        </Row>
                    </Form.Group>
                ))}
                <Row className='mx-auto'>
                    <Col>
                        <Button variant="primary" onClick={handleAddIngredient}>Add Ingredient</Button>{' '}
                        <Button variant="secondary" onClick={clearForm}>Clear Form</Button>{' '}
                        <Button variant="primary" type="submit">Save Smoothie</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
