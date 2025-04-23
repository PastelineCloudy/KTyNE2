import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import LabelInput from "./LabelInput";

const BaseConverter = () => {
  const [input, setInput] = useState<string>("15");
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);

  return (
    <div className="p-2 gap-2 flex">
      <LabelInput
        labelText="Input"
        width="w-30"
        id="from-input"
        darkMode
        value={input}
        setValue={(newVal) => setInput(newVal)}
      />
      <LabelInput
        labelText="Base"
        type="tel"
        width="w-12"
        id="from-base-input"
        inputClassName={`${
          +fromBase < 2 || +fromBase > 32 ? "text-red-500" : ""
        }`}
        darkMode
        value={fromBase}
        setValue={(newVal) => {
          if (!isNaN(+newVal)) setFromBase(+newVal);
        }}
      />
      <span>
        <ArrowRightLeft
          className="text-bg hover:text-blue-500 cancel-drag cursor-pointer"
          onClick={() => {
            setInput(convertBase(input, fromBase, toBase));
            setFromBase(toBase);
            setToBase(fromBase);
          }}
        />
      </span>
      <LabelInput
        labelText="Base"
        type="tel"
        width="w-12"
        id="to-base-input"
        inputClassName={`${+toBase < 2 || +toBase > 32 ? "text-red-500" : ""}`}
        darkMode
        value={toBase}
        setValue={(newVal) => {
          if (!isNaN(+newVal)) setToBase(+newVal);
        }}
      />
      <LabelInput
        labelText="Output"
        width="w-30"
        id="to-input"
        disabled
        darkMode
        inputClassName="cursor-text"
        value={convertBase(input, fromBase, toBase)}
        setValue={() => {}}
      />
    </div>
  );
};

const convertBase = (
  input: string,
  fromBase: number,
  toBase: number
): string => {
  try {
    if (fromBase < 2 || fromBase > 32) return "???";
    if (toBase < 2 || toBase > 32) return "???";
    return parseInt(input, fromBase).toString(toBase);
  } catch {
    return "???";
  }
};

export default BaseConverter;
