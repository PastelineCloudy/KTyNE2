import { RefObject, useEffect, useRef, useState } from "react";
import { evaluate } from "mathjs";
import { Rnd } from "react-rnd";

const initialWidth = 260;
const initialHeight = 130;
const Calculator = ({
  pageRef,
  isOpen,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}) => {
  const [calcInput, setCalcInput] = useState<string>("");
  const [draggingDisabled, setDraggingDisabled] = useState<boolean>(false);

  const rndRef = useRef<Rnd>(null);

  // Sets initial position to bottom right of window and sets retriggers on window resize
  useEffect(() => {
    const setBottomRightPosition = () => {
      if (rndRef.current) {
        const x = window.innerWidth - initialWidth;
        const y = window.innerHeight - initialHeight;

        rndRef.current.updatePosition({ x, y });
      }
    };

    setBottomRightPosition();
    window.addEventListener("resize", setBottomRightPosition);

    return () => {
      window.removeEventListener("resize", setBottomRightPosition);
    };
  }, []);

  const output: EvalRes = evalInput(calcInput);
  return (
    <Rnd
      minWidth={initialWidth}
      minHeight={initialHeight}
      style={{
        display: isOpen ? "flex" : "none",
        zIndex: 1,
      }}
      ref={rndRef}
      bounds={pageRef?.current || "parent"}
      disableDragging={draggingDisabled}
    >
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
          onMouseEnter={() => setDraggingDisabled(true)}
          onMouseLeave={() => setDraggingDisabled(false)}
          onChange={(e) => setCalcInput(e.target.value)}
          className="resize-none bg-bg mb-2 text-jet grow"
        ></textarea>
        <div
          className="w-fit pr-10"
          onMouseEnter={() => setDraggingDisabled(true)}
          onMouseLeave={() => setDraggingDisabled(false)}
        >
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
    </Rnd>
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
