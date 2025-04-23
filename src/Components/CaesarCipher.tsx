import { useState } from "react";
import { ArrowRight } from "lucide-react";
import LabelInput from "./LabelInput";

const CaesarCipher = () => {
  const [input, setInput] = useState<string>("KTyNE");
  const [offset, setOffset] = useState<number>(1);

  return (
    <div className="p-2 gap-2 flex">
      <LabelInput
        labelText="Input"
        width="w-30"
        id="cipher-input"
        darkMode
        value={input}
        setValue={(newVal) => setInput(newVal)}
      />
      <LabelInput
        labelText="Offset"
        type="number"
        width="w-16"
        id="offset-input"
        darkMode
        value={offset}
        setValue={(newVal) => setOffset(+newVal)}
      />
      <span>
        <ArrowRight className="text-bg" />
      </span>
      <LabelInput
        labelText="Output"
        width="w-30"
        id="cipher-output"
        disabled
        darkMode
        inputClassName="cursor-text leading-8 border-2 pl-1"
        value={applyCipher(input, offset)}
        setValue={() => {}}
      />
    </div>
  );
};

const applyCipher = (input: string, offset: number) => {
  while (offset < 0) offset = offset + 26;
  if (offset === 0) return input;

  return input
    .split("")
    .map((letter, i) => {
      if (letter.match(/[a-z]/i)) {
        let code = input.charCodeAt(i);

        if (code >= 65 && code <= 90) {
          code = ((code - 65 + offset) % 26) + 65;
        } else if (code >= 97 && code <= 122) {
          code = ((code - 97 + offset) % 26) + 97;
        }
        return String.fromCharCode(code);
      } else {
        return letter;
      }
    })
    .join("");
};

export default CaesarCipher;
