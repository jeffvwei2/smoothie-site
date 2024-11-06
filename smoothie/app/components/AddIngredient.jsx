import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

export default function AddIngredient({ onSubmit, show, toggleShow }) {
  const [ingredient, setIngredient] = useState('')
  const [validated, setValidated] = useState(false);

  const handleChange = (value) => {
    setIngredient(value)
  }
  const handleSubmit = (e) => {
    if (ingredient.length < 1) {
      setValidated(true);
    } else {
      onSubmit(ingredient)
      handleClose()
    }
  }
  const handleClose = () => {
    setValidated(false)
    setIngredient('')
    toggleShow()
  }

  return (
    <Modal show={show} onHide={toggleShow}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated={validated}>
          <Form.Group key="ingredient">
            <Form.Label>Ingredient:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Something new"
              value={ingredient}
              onChange={(e) => handleChange(e.target.value)}
              required
            >
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide an ingredient
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={handleClose}>Close</Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>Add Ingredient</Button>
      </Modal.Footer>
    </Modal>
  )
} 