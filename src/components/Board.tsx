import React from "react";
import python from "../assets/python.png";
import golang from "../assets/golang.png";

interface BoardProps {
  gameState: string[];
  onCellClick: (index: number) => void;
  boardSize: number;
  winningIndices: number[];
}

const Board: React.FC<BoardProps> = ({
  gameState,
  onCellClick,
  boardSize,
  winningIndices,
}) => {
  const cellSize = boardSize <= 15 ? 60 : 20;

  return (
    <div className="board">
      {gameState.map((cell, index) => (
        <div
          key={index}
          className={`board-cell ${
            winningIndices.includes(index) ? "winner" : ""
          }`}
          onClick={() => onCellClick(index)}
        >
          {cell === "X" && <img src={golang} alt="golang" />}
          {cell === "O" && <img src={python} alt="python" />}
        </div>
      ))}

      <style>{`
        .board {
          display: grid;
          grid-template-columns: repeat(${boardSize}, 1fr);
          grid-gap: 5px;
          overflow-x: auto;
          overflow-y: auto;
          max-width: 100%;
          max-height: 70vh;
          background-color: #fff;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
        }
        .board-cell {
          width: ${cellSize}px;
          height: ${cellSize}px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: #2074f5;
          border: 1px solid #ccc;
        }
      
      `}</style>
    </div>
  );
};

export default Board;
