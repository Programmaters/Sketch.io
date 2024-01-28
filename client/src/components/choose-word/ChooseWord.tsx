import {useGame} from "../../contexts/GameContext";

function ChooseWord() {
  const {choosingWords, chooseWord} = useGame();
  return (
    <div>
      {choosingWords.map(word =>
        <button key={word} onClick={() => chooseWord(word)}>{word}</button>
      )}
    </div>
  );
}

export default ChooseWord;