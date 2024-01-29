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
  const {players, host} = useRoom()
  const {setWord, isDrawing, gameState} = useGame()
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
    setMessages(prevMessages => [...prevMessages, {...msg}])
  }

  function onCloseGuess(msg: MessageType) {
    setMessages(prevMessages => [...prevMessages, {...msg, type: 'close'}])
  }

  function onCorrectGuess(msg: {text: string, word: string}) {
    setMessages(prevMessages => [...prevMessages, {...msg, type: 'correct'}])
    setWord(msg.word)
  }

  function onPlayerGuessed ({player}: {player: PlayerType}) {
    setMessages(prevMessages => [...prevMessages, {text: `${player.name} has guessed the word!`}])
  }

  function onEndTurn(data: { word: string, everyoneGuessed?: boolean } | undefined) {
    if (!data) return;
    setMessages(prevMessages => [...prevMessages, {text: `The word was '${data?.word}'`, type: 'event'}])
    if (data?.everyoneGuessed) {
      setMessages(prevMessages => [...prevMessages, {text: `Everyone guessed the word!`, type: 'correct'}])
    }
  }

  function onPlayerJoinedRoom({name}: PlayerType) {
    setMessages(prevMessages => [...prevMessages, {text: `${name} has joined the room`, type: 'event'}])
  }

  function onPlayerLeftRoom({name}: PlayerType) {
    setMessages(prevMessages => [...prevMessages, {text: `${name} has left the room`, type: 'event'}])
  }

  function onGameStarted() {
    setMessages(prevMessages => [...prevMessages, {text: `The game has started!`, type: 'event'}])
  }

  useSocketListeners({
    'message': onMessage,
    'closeGuess': onCloseGuess,
    'correctGuess': onCorrectGuess,
    'playerGuessed': onPlayerGuessed,
    'gameStarted': onGameStarted,
    'playerJoinedRoom': onPlayerJoinedRoom,
    'playerLeftRoom': onPlayerLeftRoom,
    'endTurn': onEndTurn,
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

  const hostName = players.find(player => player.id === host)?.name
  const messageColors: Record<string, string> = {
    correct: 'green',
    close: 'yellow',
    event: 'var(--primary-color)'
  }
  return (
    <div className="Chat">
      <ul>
        {<li>{hostName} is now the room owner!</li>}
        {messages.map((message, index) => (
          <li key={index} style={{color: message.type ? messageColors[message.type] : 'black'}}>
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
        disabled={isDrawing || gameState.startsWith('You guessed the word')}
        maxLength={50}
      />
    </div>
  )
}


export default Chat;