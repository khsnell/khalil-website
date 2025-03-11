'use client';

export default function PlayerBoard({handleGuess}, resetGuess, errMsg) {
    //console.log("guessError: " + errMsg);
    
    return (
        <>
            <label>Please enter a guess: </label>
            <input 
                id="guess" 
                type="text" 
                onChange={(e) => handleGuess(e.target.value)}
                onMouseEnter={resetGuess}
                size={1} 
                maxLength={1}
                className="border-4 border-green-600" />
            <span id="guessError" className="text-red-500 pl-5">{errMsg}</span>
        </>
    )
}