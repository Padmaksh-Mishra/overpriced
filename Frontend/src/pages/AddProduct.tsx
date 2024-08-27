import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendBaseUrl = 'http://localhost:3000';

const AddProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [launchPrice, setLaunchPrice] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${backendBaseUrl}/api/v1/product/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the Bearer token
        },
        body: JSON.stringify({ name, launchPrice }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Product created successfully');
        setTimeout(() => {
          navigate('/'); // Redirect to the homepage after success
        }, 2000); // Adjust the timeout as needed
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Internal Server Error. Please try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Add New Product</h2>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form.Group controlId="productName" className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="launchPrice" className="mb-3">
              <Form.Label>Launch Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter launch price"
                value={launchPrice}
                onChange={(e) => setLaunchPrice(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
