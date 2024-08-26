import React from "react";
import golang from "../assets/golang.png";
import python from "../assets/python.png";

interface SelectionScreenProps {
  playerSymbol: "X" | "O" | null;
  setPlayerSymbol: (symbol: "X" | "O") => void;
  gameMode: "PvP" | "PvC" | null;
  setGameMode: (mode: "PvP" | "PvC") => void;
  boardSize: number;
  setBoardSize: (size: number) => void;
  onStart: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({
  playerSymbol,
  setPlayerSymbol,
  gameMode,
  setGameMode,
  boardSize,
  setBoardSize,
  onStart,
}) => {
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setBoardSize(size);
  };

  const handleStartClick = () => {
    if (isNaN(boardSize) || boardSize < 3 || boardSize > 64) {
      alert("Please enter an integer number between 3 and 64.");
      return;
    }
    onStart();
  };

  return (
    <div id="selection-screen">
      <h1 id="name">Tic-Tac-Toe</h1>

      <div id="board-size-selection">
        <label htmlFor="board-size">Select Size:</label>
        <input
          type="number"
          id="board-size"
          value={boardSize}
          onChange={handleBoardSizeChange}
        />
      </div>

      <div id="player-selection">
        <p>Select Your Symbol:</p>
        <button
          id="select-x"
          className={playerSymbol === "X" ? "selected" : ""}
          onClick={() => setPlayerSymbol("X")}
        >
          <img src={golang} alt="golang" />
        </button>
        <button
          id="select-o"
          className={playerSymbol === "O" ? "selected" : ""}
          onClick={() => setPlayerSymbol("O")}
        >
          <img src={python} alt="python" />
        </button>
      </div>

      <div id="mode-selection">
        <p>Select Game Mode:</p>
        <button
          id="pvp"
          className={gameMode === "PvP" ? "selected" : ""}
          onClick={() => setGameMode("PvP")}
        >
          PvP
        </button>
        <button
          id="pvc"
          className={gameMode === "PvC" ? "selected" : ""}
          onClick={() => setGameMode("PvC")}
        >
          PvC
        </button>
      </div>

      <button
        id="start-game"
        disabled={!playerSymbol || !gameMode}
        onClick={handleStartClick}
      >
        Start Game
      </button>
    </div>
  );
};

export default SelectionScreen;
