import React, { useState } from 'react'
import { Col, Container, Row, Form, Button } from 'react-bootstrap'
import './Signup.css'
import avatar from '../assets/avatar.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupUserMutation } from '../services/appApi'

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupUser, {isLoading, error}] = useSignupUserMutation();
  const navigate = useNavigate();

  //save image state
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingimage] = useState(false);
  const [imagePreview, setImagepreview] = useState(null);

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size > 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagepreview(URL.createObjectURL(file));
    }
  }

  const uploadImage = async() => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", 'vdgyhn8h');

    try {
      setUploadingimage(true);
      let res = await fetch("https://api.cloudinary.com/v1_1/arjun-media/image/upload", {
        method: "post",
        body: data
      });
      const urlData = await res.json();
      setUploadingimage(false);
      return urlData.url;     
    } catch (error) {
      setUploadingimage(false);
      console.log(error);
    }
  }

  const signupHandler = async(e) => {
    e.preventDefault();
    if (!image) return alert("Please upload your profile picture!");
    const url = await uploadImage(image);
    console.log(url);

    signupUser({name, email, password, picture: url}).then(({data}) => {
      if(data) {
        console.log(data);
        navigate('/chat');
      } 
    })
  }

  return (
    <Container>
      <Row>
        <Col md={6} className={'signup__bg'}></Col>
        <Col md={6} className={"d-flex flex-direction-column align-items-center justify-content-center"}>
          <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={signupHandler}>
            <div className="text-center">Create Account</div>
            <div className='signup-profile-pic__container'>
              <img alt='' src={imagePreview || avatar} className='signup-profile-pic' />
              <label htmlFor='image-upload' className='image-upload-label'>
                <i className='fas fa-plus-circle add-picture-icon'></i>
              </label>
              <input type="file" id='image-upload' hidden accept='image/png, image/jpeg, image/jpg' onChange={validateImg} />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" onChange={e => setName(e.target.value)} required value={name} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} required value={email} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required value={password} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {uploadingImage ? "Registering user..." : "Register User"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account ? <Link to={'/login'}>Login</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Signup
