import "./App.css";

import { useCallback, useEffect, useState } from "react";

import {wordsList} from "./data/Words";



import './App.css';
import StartScreen from './components/StartScreen';
import Game from "./components/Game.js";
import GameOver from "./components/GameOver.js";

const Stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessedQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(Stages[0].name);
  const[words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessedQty);
  const [score, setScore] = useState(0);



  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categorys = Object.keys(words);
    const category = categorys[Math.floor(Math.random() * Object.keys(categorys).length)];
    //pick a random word
    const word= words[category][Math.floor(Math.random() * words[category].length)];
    

    return {word, category};
  },[words]);
  
  const startGame = useCallback(() => {
    //celar all letters
    clearLetterState(); 

    const {word,category} = pickWordAndCategory();

    //create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill state
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGameStage(Stages[1].name);
    //pick a random category
    
    

  },[pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    //check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      alert("Você já tentou essa letra!");
      return;
    }

    // push guessed letter or remove a guess

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
    
   
  };

  const clearLetterState=() => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //check win condition
  useEffect(() => {
    const uniqueLetters= [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length){
       setScore((actualScore) => actualScore += 100);
       startGame();

    }
},[guessedLetters, letters,startGame])




  useEffect(() => {
    if(guesses <= 0){
      //reset all states
      clearLetterState();

      setGameStage(Stages[2].name);
    }
  }, [guesses]);


  //restart the game
  const retry = () => {
    setScore(0);
    setGuesses(guessedQty);

    setGameStage(Stages[0].name);
  };


  return (
    <div className="App">
      {gameStage === "start" && <StartScreen  startGame={startGame}/>}
      {gameStage === "game" && <Game 
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
      
    </div>
  );
}

export default App;
