import React, { useState } from "react";
import SelectionScreen from "./SelectionScreen";
import GameScreen from "./GameScreen";

const Game: React.FC = () => {
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [gameMode, setGameMode] = useState<"PvP" | "PvC" | null>(null);
  const [boardSize, setBoardSize] = useState<number>(3);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const startGame = () => {
    if (playerSymbol && gameMode) {
      setGameStarted(true);
    } else {
      alert("Please select both a symbol and a game mode.");
    }
  };

  const backGame = () => {
    setPlayerSymbol(null);
    setGameMode(null);
    setBoardSize(3);
    setGameStarted(false);
  };

  return (
    <div>
      {gameStarted ? (
        <GameScreen
          playerSymbol={playerSymbol!}
          gameMode={gameMode!}
          boardSize={boardSize}
          onBack={backGame}
        />
      ) : (
        <SelectionScreen
          playerSymbol={playerSymbol}
          setPlayerSymbol={setPlayerSymbol}
          gameMode={gameMode}
          setGameMode={setGameMode}
          boardSize={boardSize}
          setBoardSize={setBoardSize}
          onStart={startGame}
        />
      )}
    </div>
  );
};

export default Game;
