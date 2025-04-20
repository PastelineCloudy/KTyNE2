import { useState } from "react";
import DraggableResizeable from "./DraggableResizeable";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Alphabet = ({
  isOpen,
  setIframeCovered,
}: {
  isOpen: boolean;
  setIframeCovered: (newVal: boolean) => void;
}) => {
  const [indexByZero, setIndexByZero] = useState(false);
  return (
    <DraggableResizeable
      isOpen={isOpen}
      corner={"bottom-right"}
      setIframeCovered={setIframeCovered}
    >
      <div
        className={`bg-jet text-bg w-full h-full
        border-2 border-bg rounded-2 p-[10px] 
        grid grid-cols-10 place-items-center gap-2`}
      >
        {alphabet.split("").map((letter, i) => {
          return (
            <span
              className={`${
                i < (indexByZero ? 10 : 9) ? "pl-[1ch]" : ""
              } text-lg`}
              key={letter}
            >{`${indexByZero ? i : i + 1}:${letter}`}</span>
          );
        })}
        <span className="col-span-4">
          <button
            className="border-2 border-white p-1 rounded-md cursor-pointer hover:text-gray-400 hover:border-gray-400"
            onClick={() => setIndexByZero(!indexByZero)}
          >
            Index By {indexByZero ? "1" : "0"}
          </button>
        </span>
      </div>
    </DraggableResizeable>
  );
};

export default Alphabet;
