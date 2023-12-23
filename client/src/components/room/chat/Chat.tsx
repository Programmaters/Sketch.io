import {useEffect, useState} from "react";
import useSocketListeners from "../../../socket/listeners";
import {Message} from "../../../domain/Message";
import {socket} from "../../../socket/socket";
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  function onMessage(msg: Message) {
    setMessages(prevMessages => [...prevMessages, msg])
  }

  function sendMessage() {
    if (message.length > 0) {
      socket.emit('message', { message });
      setMessage('');
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  const eventHandlers = {
    'message': onMessage
  };
  useSocketListeners(eventHandlers);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [message]);


  return (
    <div className="Chat">
      <h2>Chat</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.sender}: {message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Type your guess here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  )
}


export default Chat;