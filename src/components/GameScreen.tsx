import React, { useState, useCallback } from "react";
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
    const winCondition = boardSize <= 5 ? 3 : 5;

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j <= boardSize - winCondition; j++) {
        const rowSegment: string[] = newGameState.slice(
          i * boardSize + j,
          i * boardSize + j + winCondition
        );
        if (rowSegment.every((cell) => cell === rowSegment[0] && cell !== "")) {
          return rowSegment[0] as "X" | "O";
        }
      }
    }

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j <= boardSize - winCondition; j++) {
        const columnSegment: string[] = [];
        for (let k = 0; k < winCondition; k++) {
          columnSegment.push(newGameState[(j + k) * boardSize + i]);
        }
        if (
          columnSegment.every(
            (cell) => cell === columnSegment[0] && cell !== ""
          )
        ) {
          return columnSegment[0] as "X" | "O";
        }
      }
    }

    for (let i = 0; i <= boardSize - winCondition; i++) {
      for (let j = 0; j <= boardSize - winCondition; j++) {
        const diagonalSegment: string[] = [];
        for (let k = 0; k < winCondition; k++) {
          diagonalSegment.push(newGameState[(i + k) * boardSize + j + k]);
        }
        if (
          diagonalSegment.every(
            (cell) => cell === diagonalSegment[0] && cell !== ""
          )
        ) {
          return diagonalSegment[0] as "X" | "O";
        }
      }
    }

    for (let i = 0; i <= boardSize - winCondition; i++) {
      for (let j = winCondition - 1; j < boardSize; j++) {
        const antiDiagonalSegment: string[] = [];
        for (let k = 0; k < winCondition; k++) {
          antiDiagonalSegment.push(newGameState[(i + k) * boardSize + j - k]);
        }
        if (
          antiDiagonalSegment.every(
            (cell) => cell === antiDiagonalSegment[0] && cell !== ""
          )
        ) {
          return antiDiagonalSegment[0] as "X" | "O";
        }
      }
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

  const handlePlayerMove = useCallback(
    (index: number) => {
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
    },
    [gameState, gameActive, currentPlayer, checkWinner, gameMode]
  );

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
