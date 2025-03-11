'use client';

import Image from "next/image";
import WOFWheel from "@/public/WOFWheel.svg";
import { useState, useEffect } from 'react';
import { wheelSections } from "@/app/wheel-of-fortune/data/wheel";
import { answerList } from "@/app/wheel-of-fortune/data/answers";

export default function GameBoard() {
    const [isSolved, setIsSolved] = useState(false);
    const [answer, setAnswer] = useState("");
    const [clue, setClue] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [guessError, setGuessError] = useState("");
    const [solveError, setSovleError] = useState("");
    const [vowelError, setVowelError] = useState("");
    const [playerArray, setPlayerArray] = useState([
        {name: "Khalil", score: 0, color: "red", player: "player"}, 
        {name: "Annie", score: 0, color: "blue", player: "cpu"}, 
        {name: "Frank", score: 0, color: "yellow", player: "cpu"}]);
    const [currentSpin, setCurrentSpin] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [gameInitialized, setGameInitialized] = useState(false);

    useEffect(() => { 
        if (!gameInitialized) return;

        if (checkIfPlayerCPU(currentPlayer)) {
            if (currentSpin != "lost turn" && currentSpin != "bankrupt") {
                runCPUPlayer(); 
            } else {
                triggerCPUPlayer(currentPlayer);
            }
            
            if (currentSpin == "") {
                triggerCPUPlayer(currentPlayer);
            }
        }
    }, [currentSpin]);

    function handleGameInitialization() {
        setGameInitialized(true);

        playerArray[0].name = document.getElementById("playerName").value;

        if (answer == "") {
            let randomAnswer = Math.floor(Math.random() * answerList.length);
            setAnswer(answerList[randomAnswer].value);
            setClue(answerList[randomAnswer].type);
        }

        buildGameBoard();
    }

    function resetGame() {
        setGameInitialized(false);
        setIsSolved(false);
        setGuessedLetters([]);

        let randomAnswer = Math.floor(Math.random() * answerList.length);
        setAnswer(answerList[randomAnswer].value);
        setClue(answerList[randomAnswer].type);

        for (let i = 0; i < playerArray.length; i++) {
            playerArray[i].score = 0;
        }
    }

    function resetPlayerBoard() {
        document.getElementById("guess").value = "";
        document.getElementById("solve").value = "";
        document.getElementById("vowel").value = "";
        setGuessError("");
        setSovleError("");
        setVowelError("");
    }

    function checkIfPlayerCPU(player) {
        return playerArray[player].player == "cpu";
    }

    function checkIsInAnswer(letter) {
        return answer.includes(letter);
    }

    function checkTimesInAnswer(letter) {
        return answer.split(letter).length - 1;
    }

    function checkSolvePuzzle(puzzle) {
        return puzzle == answer;
    }

    function checkAnswerComplete() {
        let glInAnswer = [];

        for (let i = 0; i < guessedLetters.length; i++) {
            if (checkIsInAnswer(guessedLetters[i])) glInAnswer.push(guessedLetters[i]);
        }

        let complete = [];

        for (let j = 0; j < answer.length; j++) {
            if (answer[j].match(/[^A-Z]/)) continue;
            complete.push(glInAnswer.includes(answer[j]));
        }

        return !complete.includes(false);
    }

    function getNextPlayer() {
        let player = 0;

        if (currentPlayer < 2) player = currentPlayer + 1;

        return player;
    }

    function solvePuzzle() {
        let puzzle = document.getElementById("solve").value;
        let result = checkSolvePuzzle(puzzle.toUpperCase());
        
        if (!result) {
            setSovleError("Incorrect answer!");
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        }

        setIsSolved(result);
    }

    function handleBuyVowel(val) {
        if (!val) return;

        let mValue = val.toUpperCase();
        let vowels = "AEIOU";
        let vowelScoreCounted = false;

        setTimeout(() => {document.getElementById("vowel").value = "";}, 1000);

        for (let i = 0; i < vowels.length; i++) {
            if (mValue == vowels[i]) {
                vowelScoreCounted = true;
            }
        }

        if (!vowelScoreCounted) {
            setVowelError("You must enter a vowel!");
        } else if (playerArray[currentPlayer].score < 250) {
            setVowelError("You don't have enough money to buy a vowel!");
        } else if (guessedLetters.includes(mValue)) {
            setVowelError("You have already guessed this letter!");
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        } else if (!checkIsInAnswer(mValue)) {
            setVowelError("The letter " + mValue + " is not in the answer!");
            setGuessedLetters([...guessedLetters, mValue]);
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        } else {
            setVowelError("");

            playerArray[currentPlayer].score -= 250;

            setGuessedLetters([...guessedLetters, mValue]);
            handlePlayerTurn("", currentPlayer);
        }

        setCurrentSpin("");
    }

    function handleGuess(val) {
        if(!val) return;
        
        let mValue = val.toUpperCase();
        let vowels = "AEIOU";
        
        setTimeout(() => {document.getElementById("guess").value = "";}, 2000);

        if (currentSpin == "" || currentSpin == "bankrupt" || currentSpin == "lost turn") {
            setGuessError("You must spin first!");
            return;
        }

        if (vowels.includes(mValue)) {
            setGuessError("You must enter a non-vowel letter!");
            return;
        }

        if (mValue.match(/[^A-Z]/)) {
            setGuessError("You must enter a letter!");
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        } else if (guessedLetters.includes(mValue)) {
            setGuessError("You have already guessed the letter " + mValue + "!");
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        } else if (!checkIsInAnswer(mValue)) {
            setGuessError("The letter " + mValue + " is not in the answer!");
            setGuessedLetters([...guessedLetters, mValue]);
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
            //console.log(checkIfPlayerCPU(getNextPlayer()));
            /*if (checkIfPlayerCPU(getNextPlayer())) {
                setTimeout(() => { triggerCPUPlayer(getNextPlayer()) }, 5000);
            }*/
        } else {
            //console.log(playerArray);

            setGuessError("");
            setGuessedLetters([...guessedLetters, mValue]);
            
            playerArray[currentPlayer].score += checkTimesInAnswer(mValue) * currentSpin;
            
            handlePlayerTurn("", currentPlayer);
            
            //if (checkIfPlayerCPU(currentPlayer)) triggerCPUPlayer(currentPlayer);
        }

        //console.log(currentPlayer);
        setCurrentSpin("");
    } 

    function buildGameBoard() {
        let gbArray = [];
        let wordArray = answer.split(" ");
        let widthLeft = document.body.clientWidth;
        let j = 0;

        if (!gameInitialized) {
            gbArray = (
                <>
                    <div className="text-center">
                        Initializing Game:<br /><br />

                        <label>Player 1 enter your name:</label>
                        <input id="playerName" type="text" className="ml-2 border border-black" /><br /><br />

                        <button 
                            onClick={handleGameInitialization}
                            className="border border-black p-5 rounded-xl bg-white"
                        >Start Game!</button>
                    </div>
                </>
            );
        } else {
            for (let i = 0; i < answer.length; i++) {
                let cName = "m-2 w-12 text-center inline-block text-4xl ";
                let letter = answer[i];

                if (!isSolved && (!guessedLetters.includes(letter) && letter.match(/[A-Z ]/))) cName += "text-white ";
                if (letter != " ") cName += "bg-white border-black border-4";
                else { j++; }

                widthLeft = widthLeft - 55;

                gbArray.push(
                    <div key={widthLeft + "_" + letter + "_" + i} className={cName}>{letter}</div>
                );
                
                if (letter == " " && widthLeft - ((wordArray[j].length + 1) * 55) < 55) {
                    gbArray.push(<br key={widthLeft + "_br_" + i} />);
                    widthLeft = document.body.clientWidth;
                }
            }
        }

        return gbArray;
    }

    function getPlayerBoard() {
        let playerBoard = <></>;

        if (!gameInitialized) return;

        if (checkAnswerComplete() || isSolved) {
            playerBoard = (
                <>
                <span className="text-green-600">Congratulations! {playerArray[currentPlayer].name} guessed the puzzle!</span>  
                <button 
                    onClick={resetGame}
                    className="border border-black p-2 ml-2 rounded-xl"
                >New Game?</button>
                </>
            );
        } else {
            playerBoard = (
                <>
                <div>
                    <label>Please enter a guess: </label>
                    <input
                        id="guess" 
                        type="text" 
                        onChange={(e) => handleGuess(e.target.value)}
                        size={1} 
                        maxLength={1}
                        className="border-4 border-green-600" />
                    <span id="guessError" className="text-red-500 pl-5">{guessError}</span>
                </div>
                <div className="mt-2">
                    <label>I'd like to buy a vowel: </label>
                    <input
                        id="vowel" 
                        type="text" 
                        onChange={(e) => handleBuyVowel(e.target.value)}
                        size={1} 
                        maxLength={1}
                        className="border-4 border-green-600" />
                    <span id="vowelError" className="text-red-500 pl-5">{vowelError}</span>
                </div>
                <div>
                    <label>I'd like to solve the puzzle: </label>
                    <input 
                        id="solve"
                        type="text"
                        className="border-4 border-green-600" />
                    <button
                        id="solveButton"
                        className="border border-black p-2 ml-3 rounded-lg"
                        onClick={solvePuzzle}
                    >Solve</button>
                    <span id="guessError" className="text-red-500 pl-5">{solveError}</span>
                </div>
                </>
            );
        }

        let tmpClass = "p-5 border border-black rounded-xl ";

        return (
            <div id="playerBoard" className={tmpClass}>
                {playerBoard}
            </div>
        );
    }    

    function spinWheel() {
        if (!gameInitialized) return;

        let wheel = document.getElementById("wheel");
        let spin = 15 * Math.floor(Math.random() * 24);
        let spinValue;

        //spin = 165;

        setTimeout(() => { 
            resetPlayerBoard(); 
        }, 1000);

        for (let i = 0; i < wheelSections.length; i++) {
            if (wheelSections[i].deg === spin) spinValue = wheelSections[i].value;
        }

        setCurrentSpin(spinValue);
        
        wheel.className = "wheel-spin";
        wheel.style = `transform: rotate(${spin}deg)`;

        console.log(playerArray[currentPlayer]);
        console.log("spinValue: " + spinValue);

        if (spinValue == "bankrupt") {
            playerArray[currentPlayer].score = 0;
            incrementCurrentPlayer();

            setTimeout(() => {
                handlePlayerTurn("", getNextPlayer());
                return;
            });
        } else if (spinValue == "lost turn") {
            incrementCurrentPlayer();

            setTimeout(() => {
                handlePlayerTurn("", getNextPlayer());
                return;
            }, 2000);
        }

        handlePlayerTurn(spinValue, currentPlayer);
    }

    function incrementCurrentPlayer() {
        if (currentPlayer < 2) setCurrentPlayer(currentPlayer + 1);
        else setCurrentPlayer(0);
    }

    function triggerCPUPlayer(player) {
        if (!checkIfPlayerCPU(player)) return;

        spinWheel();
    }

    function runCPUPlayer() {
        //console.log("currentSpin: " + currentSpin);

        let cpuGuess = "";
        let vocab = "RSTLNBCDFGHJKMPQUVWXYZ";

        for (let i = 0; i < vocab.length; i++) {
            if (!guessedLetters.includes(vocab[i])) {
                cpuGuess = vocab[i];
                break;
            }
        }

        setTimeout(() => {
            document.getElementById("guess").value = cpuGuess;
        }, 2000);

        setTimeout(() => {
            //console.log("cpuGuess: " + cpuGuess);
            handleGuess(cpuGuess);
        }, 4000);
    }

    function buildPlayers() {
        if (!gameInitialized) return;

        return (
            <>
            <div className="inline-block text-center border-red-500 border-4 pl-5 pr-5 bg-red-300 rounded-xl">
                <div className="pl-5 pr-5">{playerArray[0].name}</div>
                <div className="pl-5 pr-5">{playerArray[0].score}</div>
            </div>
            <div className="inline-block text-center border-blue-500 border-4 pl-5 pr-5 bg-blue-300 rounded-xl">
                <div className="pl-5 pr-5">{playerArray[1].name}</div>
                <div className="pl-5 pr-5">{playerArray[1].score}</div>
            </div>
            <div className="inline-block text-center border-yellow-500 border-4 pr-5 pl-5 bg-yellow-300 rounded-xl">
                <div className="pl-5 pr-5">{playerArray[2].name}</div>
                <div className="pl-5 pr-5">{playerArray[2].score}</div>
            </div>
            </>
        );
    }

    function handlePlayerTurn(spinValue, player) {
        let color = playerArray[player].color;
        let wContainer = document.getElementById("wheelContainer");
        let pBoard = document.getElementById("playerBoard");

        //console.log("player: " + player);

        if (spinValue === "") {
            if (wContainer && pBoard) {
                wContainer.className = "mt-5 border border-black rounded-xl bg-" + color + "-300";
                pBoard.className = "p-5 border border-black rounded-xl bg-white";
            }
        } else {
            if (wContainer && pBoard) {
                wContainer.className = "mt-5 border border-black rounded-xl bg-white";
                pBoard.className = "p-5 border border-black rounded-xl bg-" + color + "-300";
            }
        }
    }

    return (
    <>
        <div className="mt-32 border-black border-3 bg-blue-600 rounded-xl text-center text-white">{clue}</div>
        <div 
            id="gameBoard"
            className="text-left bg-emerald-600 w-full h-60 rounded-xl"
        >
            {buildGameBoard()}
        </div>
        <div className="text-center">
            {buildPlayers()}
        </div>
        {getPlayerBoard()}
        <div 
            id="wheelContainer" 
            className="mt-5 border border-black rounded-xl bg-red-300">
            <button 
                id="spin"
                onClick={spinWheel}
                className="border border-black p-2 ml-3 rounded-lg"
                >SPIN!!!</button>
            <Image
                id="wheel"
                src={WOFWheel}
                width={300}
                height={300}
                alt="wheel"
            >
            </Image>
        </div>
    </>
  );
}