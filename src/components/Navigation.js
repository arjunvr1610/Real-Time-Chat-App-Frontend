import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import thunder from '../assets/thunder.png';
import { useSelector } from 'react-redux';
import { useLogoutUserMutation } from '../services/appApi';

const Navigation = () => {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();

    const handleLogout = async(e) => {
        e.preventDefault();
        await logoutUser(user);
        window.location.replace('/');
    }
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                         <img alt='' src={thunder} style={{width: 50, hieght: 50}}/> 
                         Monkey Chat
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {!user && (
                                <LinkContainer to={'/login'}>
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                            )}
                            <LinkContainer to={'/chat'}>
                                <Nav.Link>Chat</Nav.Link>
                            </LinkContainer>                           
                            {user && (<NavDropdown 
                                title={
                                    <>
                                    <img src={user.picture} style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
                                    {user.name}
                                    </>
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    <Button variant='danger' onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation
