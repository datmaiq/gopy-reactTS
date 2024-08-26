import React from "react";
import golang from "../assets/golang.png";
import python from "../assets/python.png";

interface StatusDisplayProps {
  currentPlayer: "X" | "O";
  gameActive: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  currentPlayer,
  gameActive,
}) => {
  return (
    <div id="status">
      {gameActive ? (
        <div>
          It's
          {currentPlayer === "X" ? (
            <img src={golang} alt="golang" />
          ) : (
            <img src={python} alt="python" />
          )}
          's turn
        </div>
      ) : (
        "Game over"
      )}
    </div>
  );
};

export default StatusDisplay;
