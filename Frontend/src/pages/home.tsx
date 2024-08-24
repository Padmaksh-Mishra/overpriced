// src/Home.tsx
import React from 'react';
import { Container, Row, Col, Form, FormControl, Button, Card } from 'react-bootstrap';
import CustomNavbar from './components/Navbar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface HomeProps {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, handleLoginLogout }) => {
  const worthItItems = [
    { title: 'Product 1', description: 'Excellent quality at a great price.', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 2', description: 'Highly recommended by cust...', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 3', description: 'Great value for money.', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 4', description: 'Popular choice among buyers.', imageUrl: 'https://via.placeholder.com/150' },
  ];

  const mostOverpricedItems = [
    { title: 'Product 5', description: 'Not worth the high price.', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 6', description: 'Overpriced and underwhelming.', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 7', description: 'Better alternatives available.', imageUrl: 'https://via.placeholder.com/150' },
    { title: 'Product 8', description: 'Disappointing for the cost.', imageUrl: 'https://via.placeholder.com/150' },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1, // Number of slides to move on swipe
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const renderCarouselItems = (items: { title: string; description: string; imageUrl: string }[]) => {
    return items.map((item, index) => (
      <Card key={index} className="mx-2">
        <Card.Img variant="top" src={item.imageUrl} />
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      <CustomNavbar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
      <Container className="mt-5" style={{marginBottom:"7%"}}>
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Form>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-primary" style={{marginLeft:"45%"}}>Search</Button>
            </Form>
          </Col>
        </Row>
        <Row style={{marginBottom:"5%",marginLeft:"5%"}}>
          <Col md={11}>
            <h3>Worth it</h3>
            <Carousel responsive={responsive} infinite={true} arrows={true}>
              {renderCarouselItems(worthItItems)}
            </Carousel>
          </Col>
        </Row>
        <Row className="mt-4" style={{marginLeft:"5%"}}>
          <Col md={11}>
            <h3>Most Overpriced</h3>
            <Carousel responsive={responsive} infinite={true} arrows={true}>
              {renderCarouselItems(mostOverpricedItems)}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
