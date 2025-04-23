import { useState } from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Alphabet = () => {
  const [indexByZero, setIndexByZero] = useState(false);
  return (
    <div className={`w-full h-full grid grid-cols-10 place-items-center gap-2`}>
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
  );
};

export default Alphabet;
