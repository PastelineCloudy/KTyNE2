import { RefObject, useRef, useState } from "react";
import { evaluate } from "mathjs";
import Draggable from "react-draggable";

const Calculator = () => {
  const [calcInput, setCalcInput] = useState<string>("");
  const calcRef = useRef<HTMLDivElement>(null);

  const output: EvalRes = evalInput(calcInput);
  return (
    <Draggable
      nodeRef={calcRef as RefObject<HTMLDivElement>}
      bounds="parent"
      cancel="textarea"
    >
      <div
        ref={calcRef}
        className="
          absolute right-4 bottom-4
          min-w-[120px] w-[250px] min-h-[180px] h-[180px]
        bg-jet
        border-2 border-bg rounded-2 p-[10px] text-bg
        flex flex-col"
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
          onMouseEnter={(e) => e.stopPropagation()}
          onChange={(e) => setCalcInput(e.target.value)}
          className="resize-none bg-bg mb-2 text-jet grow p-2"
        ></textarea>
        <div>
          Output:{" "}
          {
            <span
              className={`${output.error ? "text-red-500" : "text-green-300"}`}
            >
              {output.message}
            </span>
          }
        </div>
      </div>
    </Draggable>
  );
};

type EvalRes = {
  error: boolean;
  message: string;
};

const evalInput = (input: string): EvalRes => {
  const cleanInput = escapeHtml(input);
  try {
    let result = evaluate(cleanInput);
    if (Number.isNaN(result) || result === undefined) result = 0;
    return { error: false, message: String(Math.round(result * 1e8) / 1e8) }; // round to 8
  } catch (e) {
    if (e instanceof Error) {
      return { error: true, message: "???" };
    } else {
      return { error: true, message: "Unknown Error" };
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
