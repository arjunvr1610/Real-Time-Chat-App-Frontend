import React, { useEffect, useContext } from 'react'
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../features/userSlice';
import './Sidebar.css'

const Sidebar = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const { socket, rooms, setRooms, members, setMembers, currentRoom, setCurrentRoom, privateMemberMsgs, setPrivateMemberMsgs } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      setCurrentRoom('general');
      getRooms();
      socket.emit('join-room', 'general');
      socket.emit('new-user');
    }
  }, [])

  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload);
  })

  const getRooms = async () => {
    await fetch('http://localhost:5001/rooms').then((res) => res.json()).then((data) => setRooms(data));
  }

  const joinRoom = (room, isPublic = true) => {
    if (!user) return alert('Please Login!!');

    socket.emit('join-room', room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) { setPrivateMemberMsgs(null) }

    //dispatch notification
    dispatch(resetNotifications(room));
  }

  socket.off('notifications').on('notifications', (room) => {
    if (currentRoom !== room) { dispatch(addNotifications(room)) }
  })

  const orderIds = (id1, id2) => {
    if (id1 > id2) return id1 + '-' + id2;
    else return id2 + '-' + id1;
  }

  const handlePrivateMemberMsgs = (member) => {
    setPrivateMemberMsgs(member)
    const roomId = orderIds(user._id, member._id)
    joinRoom(roomId, false)
  }

  return (
    <>
      {user && (
        <>
          <h2 className='my-2'>Rooms</h2>
          <ListGroup style={{ border: '1px solid lightgray' }} className='rooms'>
            {
              rooms.map((room, index) => (
                <ListGroupItem key={index} active={room === currentRoom} onClick={() => joinRoom(room)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: 'medium', fontWeight: 'bolder' }}>{room}{currentRoom !== room && <span className='badge rounded-pill bg-primary'>{user.newMessages[room]}</span>}</ListGroupItem>
              ))
            }
          </ListGroup>
          <h2 className='my-2'>Members Available</h2>
          <ListGroup style={{ border: '1px solid lightgray' }} className='members'>
            {
              members.map((member) => (
                <ListGroupItem key={member._id} active={privateMemberMsgs?._id === member?._id} style={{ cursor: 'pointer'}} onClick={() => handlePrivateMemberMsgs(member)} disabled={member._id === user._id}>
                  <Row>
                    <Col xs={2}><img src={member.picture} style={{ width: 30, height: 30, marginLeft: 10, objectFit: "cover", borderRadius: "50%" }} /></Col>
                    <Col xs={8}><p style={{fontSize: 'medium', fontWeight: 'bolder'}}>{member.name === user.name ? member.name + ' (You)' : member.name}{' (' + member.status + ')'}</p></Col>
                    <Col xs={2}>{currentRoom !== member._id && <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(member._id, user._id)]}</span>}</Col>
                  </Row>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </>
      )}
    </>
  )
}

export default Sidebar
