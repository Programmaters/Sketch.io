import CustomButton from '../components/custombutton/CustomButton';
import Incrementer from '../components/incrementer/Incrementer';
import Looper from '../components/looper/Looper';
import './GameSetup.scss';
import PT from '../assets/pt.svg'
import EN from '../assets/uk.svg'
import Language from '../assets/language.svg'
import Timer from '../assets/timer.png'
import Hint from '../assets/hint.png'

function startGame(){}

function GameSetup(_props: { children: React.ReactNode }) {
  const data = ['3', '4', '5', '6'];
  const ns = data.length+1
  return (
    <div className="gamesetup-container">

      <div className="gamesetup" id='languages'>

        <h2> Game Setup </h2>
        
        <div className='wordsAndImage'>
          <img src={Language} alt="Hints/Pistas"></img>
          <span>Words Language</span>
        </div>

        <div id='chooseWordsLanguage'>
          <img src={EN} alt="Words in English"></img>
          <img src={PT} alt="Palavras em Portugues"></img>
        </div>

      </div>

      <div className="gamesetup">

        <div className='wordsAndImage'>
          <img src={Hint} alt="Hints/Pistas"></img>
          <Incrementer label={"Hint number"}></Incrementer>
        </div>

        <div className='wordsAndImage'>
          <img src={Timer} alt="Time/Tempo"></img>
          <Incrementer label={"Prompt Time"} unit={" s"}></Incrementer>
        </div>

        <div className='wordsAndImage'>
          <img src={Timer} alt="Time/Tempo"></img>
          <Incrementer label={"Word number"}></Incrementer>
        </div>
      </div>

      <div className="gamesetup" id='chooseRounds'>
        <label> Rounds </label>
        <Looper nButtons={ns} buttonLabels={data}></Looper>
      </div>

      <div className="gamesetup" id='startGame'>
        <CustomButton action={startGame} label='Start Game'></CustomButton>
      </div>

    </div>
  );
}

export default GameSetup;
