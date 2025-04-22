import { useEffect, useRef, useState } from "react";
import { LabelInput } from "./EdgeworkModal";
import DraggableResizeable from "./DraggableResizeable";
import { ArrowRightLeft } from "lucide-react";

const BaseConverter = ({
  isOpen,
  setIframeCovered,
}: {
  isOpen: boolean;
  setIframeCovered: (val: boolean) => void;
}) => {
  const [input, setInput] = useState<string>("15");
  const [fromBase, setFromBase] = useState<string>("10");
  const [toBase, setToBase] = useState<string>("2");

  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.select();
    }
  }, [isOpen]);
  return (
    <DraggableResizeable
      isOpen={isOpen}
      disableResize
      corner={"bottom-right"}
      setIframeCovered={setIframeCovered}
    >
      <div className="text-bg bg-jet rounded-md border-2 border-bg">
        <div className="p-2 gap-2 flex">
          <LabelInput
            labelText="Input"
            width="w-30"
            id="from-input"
            darkMode
            value={input}
            setValue={(newVal) => setInput(newVal)}
            ref={firstInputRef}
          />
          <LabelInput
            labelText="Base"
            width="w-12"
            id="from-base-input"
            darkMode
            value={fromBase}
            setValue={(newVal) => setFromBase(newVal)}
          />
          <span>
            <ArrowRightLeft
              className="text-bg hover:text-blue-500 cancel-drag cursor-pointer"
              onClick={() => {
                setInput(
                  convertBase(input, parseInt(fromBase), parseInt(toBase))
                );
                setFromBase(toBase);
                setToBase(fromBase);
              }}
            />
          </span>
          <LabelInput
            labelText="Base"
            width="w-12"
            id="to-base-input"
            darkMode
            value={toBase}
            setValue={(newVal) => setToBase(newVal)}
          />
          <LabelInput
            labelText="Output"
            width="w-30"
            id="to-input"
            disabled
            darkMode
            inputClassName="cursor-text leading-8 border-2 pl-1"
            value={convertBase(input, parseInt(fromBase), parseInt(toBase))}
            setValue={() => {}}
          />
        </div>
      </div>
    </DraggableResizeable>
  );
};

const convertBase = (
  input: string,
  fromBase: number = 10,
  toBase: number = 2
) => {
  if (fromBase < 2 || fromBase > 32) return "???";
  if (toBase < 2 || toBase > 32) return "???";
  return parseInt(input, fromBase).toString(toBase);
};

export default BaseConverter;
