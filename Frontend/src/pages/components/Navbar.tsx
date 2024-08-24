// src/components/Navbar.tsx
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ isLoggedIn, handleLoginLogout }) => {
  return (
    <Navbar expand="lg" style={navbarStyle}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={brandStyle}>
          Overpriced.com
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" style={linkStyle}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" style={linkStyle}>
              Dashboard
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLoginLogout} style={buttonStyle}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const navbarStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #007bff 0%, #6610f2 100%)',
  padding: '0.75rem 1rem',
  fontFamily: 'Arial, sans-serif',
};

const brandStyle: React.CSSProperties = {
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.5rem',
  letterSpacing: '1px',
};

const linkStyle: React.CSSProperties = {
  color: '#fff',
  marginRight: '1rem',
  fontSize: '1.1rem',
  fontWeight: 500,
};

const buttonStyle: React.CSSProperties = {
  fontSize: '1rem',
  padding: '0.5rem 1rem',
  borderRadius: '30px',
  borderColor: '#fff',
};

export default CustomNavbar;
