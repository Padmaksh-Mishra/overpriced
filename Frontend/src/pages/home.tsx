import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';

function Home() {
  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Row className="justify-content-center align-items-center w-100">
        {/* Left Column */}
        <Col md={5}>
          <Card>
            <Card.Header>Featured</Card.Header>
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Center Column (Search Bar) */}
        <Col md={2} className="d-flex justify-content-center align-items-center">
          <Form.Control type="text" placeholder="Search..." className="mb-3" />
        </Col>

        {/* Right Column */}
        <Col md={5}>
          <Card>
            <Card.Header>Featured</Card.Header>
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
