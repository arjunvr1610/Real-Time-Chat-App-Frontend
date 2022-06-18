import React, { useContext, useEffect, useRef, useState } from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import './MessageForm.css'

const MessageForm = () => {
    const [message, setMessage] = useState('');
    const user = useSelector(state => state.user);
    const { socket, messages, setMessages, currentRoom, privateMemberMsgs } = useContext(AppContext);
    const messageEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    const getFormattedDate = () => {
        const date = new Date()
        const year = date.getFullYear()
        let month = (1 + date.getMonth()).toString()
        month = month.length > 1 ? month : '0' + month
        let day = date.getDate().toString()
        day = day.length > 1 ? day : '0' + day
        return month + '/' + day + '/' + year
    }

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const todayDate = getFormattedDate()

    socket.off('room-messages').on('room-messages', roomMessages => { setMessages(roomMessages) })

    socket.off('message-room').on('message-room', roomMessages => {
        setMessages(roomMessages)
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!message) return;
        const today = new Date()
        const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
        const time = today.getHours() + ':' + minutes
        const roomId = currentRoom
        socket.emit('message-room', roomId, message, user, time, todayDate)
        setMessage("")
    }

    const submitByEnterKey = (event) => {
        if (event.keyCode === 13) {
            handleSubmit()
        }
    }
    return (
        <>
            {!user && <div className='alert alert-danger' >Please login to join chat</div>}
            <div className="messages-output my-2">
                {user && messages.map(({ _id: date, messagesByDate }, index) => (
                    <div key={index}>
                        <p className='text-center' style={{ fontWeight: 'bold' }}>{date}</p>
                        {
                            messagesByDate.map(({ content, time, from: sender }, msgIndex) => (
                                <div className={sender._id === user._id ? 'message' : 'incomming-message'}>
                                    <div key={msgIndex} className='message-body'>
                                        <div className='msg-sender'>{sender.name}</div>
                                        <div className='msg-content'>{content}</div>
                                        <div className='msg-time'>{time}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={10}>
                        <Form.Group style={{border: '1px solid lightgray', borderRadius: '10px'}}>
                            <Form.Control id='typeField' type='text' disabled={!user} placeholder='Type...' onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={e => submitByEnterKey(e)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
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
