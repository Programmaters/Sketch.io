import {useEffect, useRef, useState} from "react";
import useSocketListeners from "../../socket/useSocketListeners";
import {MessageType} from "../../domain/MessageType";
import {socket} from "../../socket/socket";
import './Chat.css';
import {useSession} from "../../contexts/SessionContext";
import {useRoom} from "../../contexts/RoomContext";
import {useGame} from "../../contexts/GameContext";
import {PlayerType} from "../../domain/PlayerType";

function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState('');
  const {session} = useSession();
  const {isHost} = useRoom()
  const {setWord, isDrawing} = useGame()
  const messagesEndRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  function onPlayerGuessed ({player}: {player: PlayerType}) {
    setMessages(prevMessages => [...prevMessages, {text: `${player.name} has guessed the word!`, type: 'message'}])
  }

  useSocketListeners({
    'message': onMessage,
    'closeGuess': onCloseGuess,
    'correctGuess': onCorrectGuess,
    'playerGuessed': onPlayerGuessed,
  });

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
        <li ref={messagesEndRef} />
      </ul>
      <input
        type="text"
        placeholder="Type your guess here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isDrawing}
      />
    </div>
  )
}


export default Chat;