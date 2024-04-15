import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

function Loginpage() {
    const { loginUser } = useContext(AuthContext);
    const history = useNavigate();
    const [loginError, setLoginError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const success = await loginUser(email, password);
        if (success) {
            history('/msg');
        } else {
            setLoginError(true);
        }
    };
    const bgStyle = {
        backgroundImage: `url(${'./images/bg2.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={bgStyle}>
            <Container className="" style={{ maxWidth: '400px', height: 'auto'}}>
                <div className="box p-4">
                    <h2 className="text-center text-primary">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                            <Form.Control type="text" placeholder="Username" name="email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Control type="password" placeholder="Password" name="password" />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mb-3" block>
                            Login
                        </Button>
                    </Form>
                    {loginError && <p style={{ color: 'red' }} className="text-center">Incorrect username or password</p>}
                    <p className="text-center">
                        <Link to='/password'>Forgot Password?</Link>
                    </p>
                    <p className="text-center">Don't have an account? <Link to='/register'>Register Here</Link></p>
                </div>
            </Container>
        </div>
    );
}

export default Loginpage;