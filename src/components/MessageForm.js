import React, { useContext, useState } from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import './MessageForm.css'

const MessageForm = () => {
    const [message, setMessage] = useState('');
    const user = useSelector(state => state.user);
    const { socket, messages, setMessages, currentRoom } = useContext(AppContext);

    const getFormattedDate = () => {
        const date = new Date()
        const year = date.getFullYear()
        let month = (1 + date.getMonth()).toString()
        month = month.length > 1 ? month : '0' + month
        let day = date.getDate().toString()
        day = day.length > 1 ? day : '0' + day
        return month + '/' + day + '/' + year
    }

    const todayDate = getFormattedDate()

    socket.off('room-messages').on('room-messages', roomMessages => {setMessages(roomMessages)})

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes
        const roomId = currentRoom
        socket.emit('message-room', roomId, message, user, time, todayDate)
        setMessage('')
    }
    return (
        <>
            {!user && <div className='alert alert-danger' >Please login to join chat</div>}
            <div className="messages-output">
                {user && messages.map(({_id: date, messagesByDate}, index) => (
                    <div key={index}>
                        <p className='aler alert-info text-center message-date-indicator'>{date}</p>
                        {
                            messagesByDate.map(({content, time, from: sender}, msgIndex) => (
                                <div key={msgIndex}>
                                    <p className="message-content">{content}</p>
                                    
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control type='text' disabled={!user} placeholder='Type...' onChange={e => setMessage(e.target.value)} vlaue={message}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant='primary' type='submit' disabled={!user} style={{ width: '100%', backgroundColor: 'green' }}>
                            <i className='fas fa-paper-plane'></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default MessageForm
