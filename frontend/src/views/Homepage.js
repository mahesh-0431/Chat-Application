import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Homepage() {
  const bgStyle = {
    backgroundImage:  `url('https://t4.ftcdn.net/jpg/04/61/47/03/360_F_461470323_6TMQSkCCs9XQoTtyer8VCsFypxwRiDGU.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className='text-white d-flex justify-content-center align-items-center vh-100 overflow-hidden' style={bgStyle}>
      <Container className="text-center">
        <Row className="mb-5">
          <Col>
            <h1>Chat Application</h1>
          </Col>
        </Row>

        <Row className="image-container mb-2">
          <Col>
            <img src="./images/vcube1.png" alt="Logo" height="300px" />
          </Col>
        </Row>

        <Row className="overlay-button">
          <Col>
            <Link to="/login">
              <Button variant="light">Chat with us</Button>
            </Link>
          </Col>
        </Row>
        
        <Row className="footer mt-4">
          <Col>
            <p>&copy; 2024 V Chat. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;