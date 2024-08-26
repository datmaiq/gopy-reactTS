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
  const [winningIndices, setWinningIndices] = useState<number[]>([]);

  const checkWinner = useCallback(
    (
      newGameState: string[]
    ): { winner: "X" | "O" | null; winningIndices: number[] } => {
      const winCondition = boardSize <= 5 ? 3 : 5;

      // Check rows
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j <= boardSize - winCondition; j++) {
          const rowSegment = newGameState.slice(
            i * boardSize + j,
            i * boardSize + j + winCondition
          );
          const indices = Array.from(
            { length: winCondition },
            (_, k) => i * boardSize + j + k
          );
          if (
            rowSegment.every((cell) => cell === rowSegment[0] && cell !== "")
          ) {
            return {
              winner: rowSegment[0] as "X" | "O",
              winningIndices: indices,
            };
          }
        }
      }

      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j <= boardSize - winCondition; j++) {
          const columnSegment: string[] = [];
          const indices = [];
          for (let k = 0; k < winCondition; k++) {
            columnSegment.push(newGameState[(j + k) * boardSize + i]);
            indices.push((j + k) * boardSize + i);
          }
          if (
            columnSegment.every(
              (cell) => cell === columnSegment[0] && cell !== ""
            )
          ) {
            return {
              winner: columnSegment[0] as "X" | "O",
              winningIndices: indices,
            };
          }
        }
      }

      for (let i = 0; i <= boardSize - winCondition; i++) {
        for (let j = 0; j <= boardSize - winCondition; j++) {
          const diagonalSegment: string[] = [];
          const indices = [];
          for (let k = 0; k < winCondition; k++) {
            diagonalSegment.push(newGameState[(i + k) * boardSize + j + k]);
            indices.push((i + k) * boardSize + j + k);
          }
          if (
            diagonalSegment.every(
              (cell) => cell === diagonalSegment[0] && cell !== ""
            )
          ) {
            return {
              winner: diagonalSegment[0] as "X" | "O",
              winningIndices: indices,
            };
          }
        }
      }

      for (let i = 0; i <= boardSize - winCondition; i++) {
        for (let j = winCondition - 1; j < boardSize; j++) {
          const antiDiagonalSegment: string[] = [];
          const indices = [];
          for (let k = 0; k < winCondition; k++) {
            antiDiagonalSegment.push(newGameState[(i + k) * boardSize + j - k]);
            indices.push((i + k) * boardSize + j - k);
          }
          if (
            antiDiagonalSegment.every(
              (cell) => cell === antiDiagonalSegment[0] && cell !== ""
            )
          ) {
            return {
              winner: antiDiagonalSegment[0] as "X" | "O",
              winningIndices: indices,
            };
          }
        }
      }

      return { winner: null, winningIndices: [] };
    },
    [boardSize]
  );

  const getBestMove = useCallback(
    (newGameState: string[]): number | undefined => {
      for (let i = 0; i < newGameState.length; i++) {
        if (newGameState[i] === "") {
          return i;
        }
      }
      return undefined;
    },
    []
  );

  const handleAIMove = useCallback(
    (newGameState: string[]) => {
      const aiMove = getBestMove(newGameState);
      if (aiMove !== undefined) {
        newGameState[aiMove] = currentPlayer === "X" ? "O" : "X";
        setGameState([...newGameState]);

        const { winner, winningIndices } = checkWinner(newGameState);
        if (winner || !newGameState.includes("")) {
          setGameActive(false);
          setWinningIndices(winningIndices);
        } else {
          setCurrentPlayer(playerSymbol);
        }
      }
    },
    [currentPlayer, playerSymbol, checkWinner, getBestMove]
  );

  const handlePlayerMove = useCallback(
    (index: number) => {
      if (gameState[index] !== "" || !gameActive) return;

      const newGameState = [...gameState];
      newGameState[index] = currentPlayer;

      setGameState(newGameState);

      const { winner, winningIndices } = checkWinner(newGameState);
      if (winner || !newGameState.includes("")) {
        setGameActive(false);
        setWinningIndices(winningIndices);
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
    [gameState, gameActive, currentPlayer, gameMode, checkWinner, handleAIMove]
  );

  const handleRestart = useCallback(() => {
    setGameState(Array(boardSize * boardSize).fill(""));
    setCurrentPlayer(playerSymbol);
    setGameActive(true);
    setWinningIndices([]);
  }, [boardSize, playerSymbol]);

  return (
    <div id="game-screen">
      <ControlButtons onBack={onBack} onRestart={handleRestart} />
      <Board
        gameState={gameState}
        onCellClick={handlePlayerMove}
        boardSize={boardSize}
        winningIndices={winningIndices}
      />
      <StatusDisplay currentPlayer={currentPlayer} gameActive={gameActive} />
    </div>
  );
};

export default GameScreen;
