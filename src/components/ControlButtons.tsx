import React from "react";

interface ControlButtonsProps {
  onBack: () => void;
  onRestart: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onBack,
  onRestart,
}) => (
  <div id="control-buttons">
    <button id="back" onClick={onBack}>
      Back
    </button>
    <button id="restart" onClick={onRestart}>
      Restart Game
    </button>
  </div>
);

export default ControlButtons;
