import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface CustomNavbarProps {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ isLoggedIn, handleLoginLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: '1rem 2rem' }}>
      <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Overpriced Products
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          {isLoggedIn ? (
            <Button variant="outline-light" onClick={handleLoginLogout}>
              Logout
            </Button>
          ) : (
            <Nav.Link as={Link} to="/signin" style={{ color: '#ffffff' }}>
              <Button variant="outline-light">
                Sign In
              </Button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
