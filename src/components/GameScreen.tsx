import React, { useState } from "react";
import Board from "./Board";
import StatusDisplay from "./StatusDisplay";
import ControlButtons from "./ControlButtons";

interface GameScreenProps {
  playerSymbol: "X" | "O";
  gameMode: "PvP" | "PvC";
  boardSize: number;
  onBack: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  playerSymbol,
  gameMode,
  boardSize,
  onBack,
}) => {
  const [gameState, setGameState] = useState<string[]>(
    Array(boardSize * boardSize).fill("")
  );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">(playerSymbol);
  const [gameActive, setGameActive] = useState<boolean>(true);

  const checkWinner = (newGameState: string[]): "X" | "O" | null => {
    for (let i = 0; i < boardSize; i++) {
      const start = i * boardSize;
      const row = newGameState.slice(start, start + boardSize);
      if (row.every((cell) => cell === row[0] && cell !== "")) {
        return row[0] as "X" | "O";
      }
    }

    for (let i = 0; i < boardSize; i++) {
      const column: string[] = [];
      for (let j = 0; j < boardSize; j++) {
        column.push(newGameState[i + j * boardSize]);
      }
      if (column.every((cell) => cell === column[0] && cell !== "")) {
        return column[0] as "X" | "O";
      }
    }

    const mainDiagonal: string[] = [];
    for (let i = 0; i < boardSize; i++) {
      mainDiagonal.push(newGameState[i * (boardSize + 1)]);
    }
    if (mainDiagonal.every((cell) => cell === mainDiagonal[0] && cell !== "")) {
      return mainDiagonal[0] as "X" | "O";
    }

    const antiDiagonal: string[] = [];
    for (let i = 0; i < boardSize; i++) {
      antiDiagonal.push(newGameState[(i + 1) * (boardSize - 1)]);
    }
    if (antiDiagonal.every((cell) => cell === antiDiagonal[0] && cell !== "")) {
      return antiDiagonal[0] as "X" | "O";
    }

    return null;
  };

  // const handleResultValidation = (newGameState: string[]) => {
  //   const winner = checkWinner(newGameState);
  //   if (winner) {
  //     setGameActive(false);
  //   } else if (!newGameState.includes("")) {
  //     setGameActive(false);
  //   }
  // };

  const handlePlayerMove = (index: number) => {
    if (gameState[index] !== "" || !gameActive) return;

    const newGameState = [...gameState];
    newGameState[index] = currentPlayer;

    setGameState(newGameState);

    const winner = checkWinner(newGameState);
    if (winner || !newGameState.includes("")) {
      setGameActive(false);
    } else {
      if (gameMode === "PvP") {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      } else if (gameMode === "PvC") {
        setTimeout(() => {
          handleAIMove(newGameState);
        }, 300);
      }
    }
  };

  const handleAIMove = (newGameState: string[]) => {
    const aiMove = getBestMove(newGameState);
    if (aiMove !== undefined) {
      newGameState[aiMove] = currentPlayer === "X" ? "O" : "X";
      setGameState([...newGameState]);

      const winner = checkWinner(newGameState);
      if (winner || !newGameState.includes("")) {
        setGameActive(false);
      } else {
        setCurrentPlayer(playerSymbol);
      }
    }
  };

  const getBestMove = (newGameState: string[]): number | undefined => {
    for (let i = 0; i < newGameState.length; i++) {
      if (newGameState[i] === "") {
        return i;
      }
    }
    return undefined;
  };

  const handleRestart = () => {
    setGameState(Array(boardSize * boardSize).fill(""));
    setCurrentPlayer(playerSymbol);
    setGameActive(true);
  };

  return (
    <div id="game-screen">
      <ControlButtons onBack={onBack} onRestart={handleRestart} />
      <Board
        gameState={gameState}
        onCellClick={handlePlayerMove}
        boardSize={boardSize}
      />
      <StatusDisplay currentPlayer={currentPlayer} gameActive={gameActive} />
    </div>
  );
};

export default GameScreen;
