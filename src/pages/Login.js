import React, { useContext, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Login.css'
import { useLoginUserMutation } from '../services/appApi'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/appContext'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, {isLoading, error}] = useLoginUserMutation();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);

  const loginHandler = (e) => {
    e.preventDefault();
    //add login logic
    loginUser({email, password}).then(({data}) => {
      if(data) {
        socket.emit('new-user');
        navigate('/chat');
      }     
    })
  }

  return (
    <Container>
      <Row>
        <Col md={6} className={'login__bg'}></Col>
        <Col md={6} className={"d-flex flex-direction-column align-items-center justify-content-center"}>
          <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={loginHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} vlaue={email} required />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <div className="py-4">
              <p className="text-center">
                Not registered yet ? <Link to={'/signup'}>Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
