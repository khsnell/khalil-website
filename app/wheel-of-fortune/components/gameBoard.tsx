'use client';

//import Image from "next/image";
//import WOFWheel from "@/public/WOFWheel.svg";
import { useState, useEffect } from 'react';
import { wheelSections } from "@/app/wheel-of-fortune/data/wheel";
import { answerList } from "@/app/wheel-of-fortune/data/answers";

export default function GameBoard() {
    const [isSolved, setIsSolved] = useState(false);
    const [answer, setAnswer] = useState("");
    const [clue, setClue] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([] as string[]);
    const [guessError, setGuessError] = useState("");
    const [solveError, setSovleError] = useState("");
    const [vowelError, setVowelError] = useState("");
    const [playerArray, setPlayerArray] = useState([
        {name: "", score: 0, color: "red", player: "player"}, 
        {name: "Annie", score: 0, color: "blue", player: "cpu"}, 
        {name: "Frank", score: 0, color: "yellow", player: "cpu"}]);
    const [currentSpin, setCurrentSpin] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [gameInitialized, setGameInitialized] = useState(false);

    let wheel: HTMLElement | null;
    let playerName: HTMLInputElement;
    let guessInput: HTMLInputElement;
    let solveInput: HTMLInputElement;
    let vowelInput: HTMLInputElement;

    useEffect(() => { 
        if (!gameInitialized) return;

        if (checkIfPlayerCPU(currentPlayer) && !checkAnswerComplete()) {
            //console.log("currentSpin: " + currentSpin);
            if (currentSpin != "" && currentSpin != "lost turn" && currentSpin != "bankrupt") {
                runCPUPlayer(); 
            } else {
                triggerCPUPlayer(currentPlayer);
                return;
            }
            
            if (currentSpin == "") {
                triggerCPUPlayer(currentPlayer);
            }
        }
    }, [currentSpin, currentPlayer]);

    //if (!setHTMLElementVariables()) return;

    function setHTMLElementVariables() {
        let result = false;
        
        if (typeof document !== "undefined") {
            result = true;
            wheel = document.getElementById("wheel");
            playerName = (document.getElementById("playerName") as HTMLInputElement);
            guessInput = (document.getElementById("guess") as HTMLInputElement);
            solveInput = (document.getElementById("solve") as HTMLInputElement);
            vowelInput = (document.getElementById("vowel") as HTMLInputElement);
        }

        return result;
    }

    function handleGameInitialization() {
        setHTMLElementVariables();
        
        if (playerName) {
            playerArray[0].name = playerName.value;
        }
        
        setGameInitialized(true);

        if (answer == "") {
            const randomAnswer = Math.floor(Math.random() * answerList.length);
            setAnswer(answerList[randomAnswer].value);
            setClue(answerList[randomAnswer].type);
        }

        buildGameBoard();
    }

    function resetGame() {
        setGameInitialized(false);
        setIsSolved(false);
        setGuessedLetters([]);
        setPlayerArray([
            {name: "", score: 0, color: "red", player: "player"}, 
            {name: "Annie", score: 0, color: "blue", player: "cpu"}, 
            {name: "Frank", score: 0, color: "yellow", player: "cpu"}
        ]);
        setGuessError("");
        setSovleError("");
        setVowelError("");

        setCurrentPlayer(0);
        handlePlayerTurn("", 0);

        const randomAnswer = Math.floor(Math.random() * answerList.length);
        setAnswer(answerList[randomAnswer].value);
        setClue(answerList[randomAnswer].type);

        for (let i = 0; i < playerArray.length; i++) {
            playerArray[i].score = 0;
        }
    }

    function resetPlayerBoard() {
        if (guessInput) guessInput.value = "";
        if (solveInput) solveInput.value = "";
        if (vowelInput) vowelInput.value = "";
        setGuessError("");
        setSovleError("");
        setVowelError("");
    }

    function checkIfPlayerCPU(player: number) {
        return playerArray[player].player == "cpu";
    }

    function checkIsInGuessedLetters(letter: string) {
        let result = false;

        for (let i = 0; i < guessedLetters.length; i++) {
            if (guessedLetters[i] == letter) result = true;
        }

        return result;
    }

    function checkIsInAnswer(letter: string) {
        return answer.includes(letter);
    }

    function checkTimesInAnswer(letter: string) {
        return answer.split(letter).length - 1;
    }

    function checkSolvePuzzle(puzzle: string) {
        return puzzle == answer;
    }

    function checkAnswerComplete() {
        const glInAnswer: string[] = [];

        for (let i = 0; i < guessedLetters.length; i++) {
            if (checkIsInAnswer(guessedLetters[i])) glInAnswer.push(guessedLetters[i]);
        }

        const complete = [];

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
        if (!solveInput) {
            setHTMLElementVariables();
        }

        const puzzle = solveInput.value;
        const result = checkSolvePuzzle(puzzle.toUpperCase());
        
        if (!result) {
            setSovleError("Incorrect answer!");
            incrementCurrentPlayer();
            handlePlayerTurn("", getNextPlayer());
        }

        setIsSolved(result);
    }

    function handleBuyVowel(val: string) {
        if (!val) return;

        const mValue: string = val.toUpperCase();
        const vowels = "AEIOU";
        let vowelScoreCounted = false;

        setHTMLElementVariables();

        setTimeout(() => { if (vowelInput) vowelInput.value = ""; }, 1000);

        for (let i = 0; i < vowels.length; i++) {
            if (mValue == vowels[i]) {
                vowelScoreCounted = true;
            }
        }

        if (!vowelScoreCounted) {
            setVowelError("You must enter a vowel!");
        } else if (playerArray[currentPlayer].score < 250) {
            setVowelError("You don't have enough money to buy a vowel!");
        } else if (checkIsInGuessedLetters(mValue)) {
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

    function handleGuess(val: string) {
        if(!val) return;
        
        const mValue = val.toUpperCase();
        const vowels = "AEIOU";

        setHTMLElementVariables();
        
        setTimeout(() => { if (guessInput) guessInput.value = ""; }, 2000);

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
        } else {
            //console.log(playerArray);

            setGuessError("");
            setGuessedLetters([...guessedLetters, mValue]);
            
            playerArray[currentPlayer].score += checkTimesInAnswer(mValue) * parseInt(currentSpin);
            
            handlePlayerTurn("", currentPlayer);
            
            //if (checkIfPlayerCPU(currentPlayer)) triggerCPUPlayer(currentPlayer);
        }

        //console.log(currentPlayer);
        setCurrentSpin("");
    } 

    function buildGameBoard() {
        const gbArray = [];
        let output = <></>;
        const wordArray = answer.split(" ");
        let widthLeft = 0;
        let j = 0;
        let singleCharLength = 55;

        if (typeof document !== "undefined") {
            widthLeft = document.body.clientWidth;

            if (widthLeft <= 600) singleCharLength = 25;
        }

        if (!gameInitialized) {
            output = (
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

            return output;
        } else {
            for (let i = 0; i < answer.length; i++) {
                let cName = "m-1 md:m-2 w-5 md:w-12 text-center inline-block text-lg md:text-4xl ";
                const letter = answer[i];

                if (!isSolved && (!guessedLetters.includes(letter) && letter.match(/[A-Z ]/))) cName += "text-white ";
                if (letter != " ") cName += "bg-white border-black border-2 md:border-4";
                else { j++; }

                widthLeft = widthLeft - singleCharLength;

                gbArray.push(
                    <div key={widthLeft + "_" + letter + "_" + i} className={cName}>{letter}</div>
                );
                
                if (letter == " " && widthLeft - ((wordArray[j].length + 1) * singleCharLength) < singleCharLength) {
                    gbArray.push(<br key={widthLeft + "_br_" + i} />);
                    widthLeft = document.body.clientWidth;
                }
            }

            return gbArray;
        }
    }

    function getPlayerBoard() {
        let playerBoard = <></>;

        if (!gameInitialized) return;

        if (checkAnswerComplete() || isSolved) {
            //setIsSolved(true);
            //setGameInitialized(false);

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
                    <label>I&apos;d like to buy a vowel: </label>
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
                    <label>I&apos;d like to solve the puzzle: </label>
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

        const tmpClass = "p-5 border border-black rounded-xl ";

        return (
            <div id="playerBoard" className={tmpClass}>
                {playerBoard}
            </div>
        );
    }    

    function spinWheel() {
        if (!gameInitialized) return;

        const spin = 15 * Math.floor(Math.random() * 24);
        let spinValue: string = "";

        //if (currentPlayer == 1) spin = 105;

        setTimeout(() => { 
            resetPlayerBoard(); 
        }, 1000);

        for (let i = 0; i < wheelSections.length; i++) {
            if (wheelSections[i].deg === spin) {
                spinValue = wheelSections[i].value.toString();
            }
        }

        setCurrentSpin(spinValue);
        setHTMLElementVariables();

        if (wheel) {
            wheel.className = "wheel-spin";
            wheel.setAttribute("style", `transform: rotate(${spin}deg)`);
        }

        //console.log(playerArray[currentPlayer]);
        //console.log("spinValue: " + spinValue);

        if (spinValue == "bankrupt") {
            playerArray[currentPlayer].score = 0;

            setTimeout(() => {
                incrementCurrentPlayer();
                handlePlayerTurn("", getNextPlayer());
                return;
            }, 2000);
        } else if (spinValue == "lost turn") {
            setTimeout(() => {
                incrementCurrentPlayer();
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

    function triggerCPUPlayer(player: number) {
        if (!checkIfPlayerCPU(player)) return;

        spinWheel();
    }

    function runCPUPlayer() {
        //console.log("currentSpin: " + currentSpin);

        let cpuGuess = "";
        const vocab = "RSTLNBCDFGHJKMPQUVWXYZ";

        for (let i = 0; i < vocab.length; i++) {
            if (!guessedLetters.includes(vocab[i])) {
                cpuGuess = vocab[i];
                break;
            }
        }

        setHTMLElementVariables();

        setTimeout(() => {
            if (guessInput) guessInput.value = cpuGuess;
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
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[0].name}</div>
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[0].score}</div>
            </div>
            <div className="inline-block text-center border-blue-500 border-4 pl-5 pr-5 bg-blue-300 rounded-xl">
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[1].name}</div>
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[1].score}</div>
            </div>
            <div className="inline-block text-center border-yellow-500 border-4 pr-5 pl-5 bg-yellow-300 rounded-xl">
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[2].name}</div>
                <div className="pl-2 pr-2 md:pl-5 md:pr-5">{playerArray[2].score}</div>
            </div>
            </>
        );
    }

    function handlePlayerTurn(spinValue: string, player: number) {
        if (!document) return;
        
        const color = playerArray[player].color;
        const wContainer = document.getElementById("wheelContainer");
        const pBoard = document.getElementById("playerBoard");

        //console.log("player: " + player);

        if (spinValue === "") {
            if (wContainer && pBoard) {
                wContainer.className = "relative mt-5 border border-black rounded-xl bg-" + color + "-300";
                pBoard.className = "p-5 border border-black rounded-xl bg-white";
            }
        } else {
            if (wContainer && pBoard) {
                wContainer.className = "relative mt-5 border border-black rounded-xl bg-white";
                pBoard.className = "p-5 border border-black rounded-xl bg-" + color + "-300";
            }
        }
    }

    return (
    <>
        <div className="mt-5 md:mt-32 border-black border-3 bg-blue-600 rounded-xl text-center text-white">{clue}</div>
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
            className="relative mt-5 border border-black rounded-xl bg-red-300">
            <button 
                id="spin"
                onClick={spinWheel}
                className="border border-black p-2 ml-3 rounded-lg"
                >SPIN!!!</button>
            <div className='arrow-down'></div>
            <img
                id="wheel"
                src="./WOFWheel.svg"
                width={300}
                height={300}
                alt="wheel"
            />
        </div>
    </>
  );
}