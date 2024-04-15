import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password-reset/', { email });
      setMessage(response.data.detail);
      swal.fire({
        title: "Password Reset OTP Sent",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      history('/password-reset'); // Navigate to confirmation page
    } catch (error) {
      if (error.response.status === 404) {
        setMessage('User not found. Please register your account.');
      } else {
        setMessage(error.response.data.error || 'An error occurred.');
      }
      swal.fire({
        title: "Failed to Send OTP",
        text: message,
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
    setLoading(false);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={6}>
          <div>
            <h2 className="text-center text-warning mb-4">Reset Password</h2>
            <p className="text-center mb-4">{message}</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading} className="mb-3">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetRequestForm;