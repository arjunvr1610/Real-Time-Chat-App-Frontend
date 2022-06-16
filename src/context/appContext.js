import {io} from 'socket.io-client';
import React from 'react';

const socket_URL = 'http://localhost:5001';

export const socket = io(socket_URL);
export const AppContext = React.createContext();