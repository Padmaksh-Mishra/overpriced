import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendBaseUrl = 'http://localhost:3000';

interface SignInProps {
  onLogin: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${backendBaseUrl}/api/v1/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Parse the response to get the error message
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }

      const data = await response.json();
      const { token } = data;

      // Store the token in local storage or a cookie
      localStorage.setItem('authToken', token);

      // Notify parent component of login
      onLogin();

      // Redirect to the HOME
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Sign In</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignIn}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Sign In
            </Button>
          </Form>

          <div className="mt-4">
            <p>
              Not registered? <a href="/signup">Sign up here</a>.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
