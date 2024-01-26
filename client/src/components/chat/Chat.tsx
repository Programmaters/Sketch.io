import {useEffect, useState} from "react";
import useSocketListeners from "../../socket/useSocketListeners";
import {MessageType} from "../../domain/MessageType";
import {socket} from "../../socket/socket";
import './Chat.css';
import {useSession} from "../../contexts/SessionContext";
import {useRoom} from "../../contexts/RoomContext";
import {useGame} from "../../contexts/GameContext";

function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState('');
  const {session} = useSession();
  const {isHost} = useRoom()
  const {setWord} = useGame()

  function sendMessage() {
    if (message.length > 0) {
      socket.emit('message', { message });
      setMessages(prevMessages => [...prevMessages, {text: message, sender: session!.name, type: 'message'}])
      setMessage('');
    }
  }

  function onMessage(msg: MessageType) {
    setMessages(prevMessages => [...prevMessages, {...msg, type: 'message'}])
  }

  function onCloseGuess(msg: MessageType) {
    setMessages(prevMessages => [...prevMessages, {...msg, type: 'close'}])
  }

  function onCorrectGuess(msg: {text: string, word: string}) {
    setMessages(prevMessages => [...prevMessages, {...msg, type: 'correct'}])
    setWord(msg.word)
  }

  const eventHandlers = {
    'message': onMessage,
    'closeGuess': onCloseGuess,
    'correctGuess': onCorrectGuess,
  };
  useSocketListeners(eventHandlers);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [message]);

  return (
    <div className="Chat">
      <ul>
        {isHost && <li>{session!.name} is now the room owner!</li>}
        {messages.map((message, index) => (
          <li key={index} style={{color: message.type === 'correct' ? 'green' : message.type === 'close' ? 'yellow' : 'black'}}>
            {message.sender ? (
              <>
                <strong>{message.sender}: </strong> {message.text}
              </>
            ) : (
              <>{message.text}</>
            )}
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