import {useEffect, useState} from "react";
import useSocketListeners from "../../../socket/useSocketListeners";
import {MessageType} from "../../../domain/MessageType";
import {socket} from "../../../socket/socket";
import './Chat.css';
import {useSession} from "../../../contexts/SessionContext";

function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState('');
  const {session} = useSession();

  function onMessage(msg: MessageType) {
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
      <ul>
        <li>
          {session!.name} is now the room owner!
        </li>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.sender}: </strong> {message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Type your guess here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  )
}


export default Chat;