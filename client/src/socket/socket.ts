import { io } from 'socket.io-client';

const url = 'ws://localhost:8080';
const options = { autoConnect: false };
export const socket = io(url, options);
socket.on('error', error => alert(error))