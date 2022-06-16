import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket } from './context/appContext';

function App() {
  const user = useSelector((state) => state.user);

  const [rooms, setRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsgs, setPrivateMemberMsgs] = useState({});
  const [newMessages, setNewMessages] = useState({});

  return (
    <AppContext.Provider value={
      {
        socket, rooms, setRooms, members, setMembers, currentRoom, setCurrentRoom, messages, setMessages, privateMemberMsgs, setPrivateMemberMsgs, newMessages, setNewMessages
      }
    }>
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path='/' element={<Home/>} />
          {!user && (
            <>
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
            </>
          )}
          <Route path='/chat' element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
