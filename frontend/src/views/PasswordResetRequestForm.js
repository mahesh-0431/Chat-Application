import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const PasswordResetConfirmationForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/password-reset-confirm/`;
      const response = await axios.post(url, { email, otp, new_password: newPassword });
      setMessage(response.data.detail);
      swal.fire({
        title: "Password Reset Successful",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate('/login'); // Redirect to the login page after successful password reset
    } catch (error) {
      setMessage(error.response.data.detail || 'An error occurred.');
      swal.fire({
        title: "Failed to Reset Password",
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
            <Form onSubmit={handleResetPassword}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="otp" className="mb-3">
                <Form.Label>OTP:</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="newPassword" className="mb-3">
                <Form.Label>New Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading} className="mb-3">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetConfirmationForm;