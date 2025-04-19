import { useState } from "react";
import { evaluate } from "mathjs";
import DraggableResizeable from "./DraggableResizeable";

const Calculator = ({ isOpen }: { isOpen: boolean }) => {
  const [calcInput, setCalcInput] = useState<string>("");

  return (
    <DraggableResizeable isOpen={isOpen} corner={"bottom-right"}>
      <div
        className={`bg-jet w-full h-full
        border-2 border-bg rounded-2 p-[10px] text-bg
        flex flex-col`}
      >
        <div className="">Text-Field Calculator</div>
        <textarea
          name="calc-input"
          id="calc-input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={calcInput}
          onChange={(e) => setCalcInput(e.target.value)}
          className="cancel-drag resize-none bg-bg mb-2 p-1 text-jet grow"
        ></textarea>
        <div className="w-fit pr-10 cancel-drag cursor-text">
          Output: {<span>{evalInput(calcInput)}</span>}
        </div>
      </div>
    </DraggableResizeable>
  );
};

const evalInput = (input: string): string => {
  const cleanInput = escapeHtml(input);
  try {
    let result = evaluate(cleanInput);
    if (Number.isNaN(result) || result === undefined) result = 0;
    return String(Math.round(result * 1e8) / 1e8); // round to 8
  } catch (e) {
    if (e instanceof Error) {
      return "???";
    } else {
      return "Unknown Error";
    }
  }
};

// Credit : https://stackoverflow.com/a/6234804/8213163
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default Calculator;
