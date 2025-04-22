import { ReactNode, useEffect, useState } from "react";
import Calculator from "./Calculator";
import EdgeworkModal from "./EdgeworkModal";
import Alphabet from "./Alphabet";

const Popups = ({
  setEdgework,
  setIframeCovered,
}: {
  setEdgework: (newVal: ReactNode) => void;
  setIframeCovered: (newVal: boolean) => void;
}) => {
  const [calcIsOpen, setCalcIsOpen] = useState<boolean>(false);
  const [alphaIsOpen, setAlphaIsOpen] = useState<boolean>(false);
  const [edgeworkModalIsOpen, setEdgeworkModalIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case "a": {
            event.preventDefault();
            setAlphaIsOpen(!alphaIsOpen);
            break;
          }
          case "c": {
            event.preventDefault();
            setCalcIsOpen(!calcIsOpen);
            break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [alphaIsOpen, calcIsOpen, edgeworkModalIsOpen]);
  return (
    <>
      <div className="flex flex-wrap justify-around gap-2">
        <HeaderButton
          underlineFirst={false}
          onClick={() => setEdgeworkModalIsOpen(true)}
        >
          Edgework
        </HeaderButton>
        <HeaderButton
          underlineFirst={true}
          onClick={() => setAlphaIsOpen(!alphaIsOpen)}
        >
          Alphabet
        </HeaderButton>
        <HeaderButton
          underlineFirst={true}
          onClick={() => setCalcIsOpen(!calcIsOpen)}
        >
          Calculator
        </HeaderButton>
        <Alphabet isOpen={alphaIsOpen} setIframeCovered={setIframeCovered} />
        <Calculator isOpen={calcIsOpen} setIframeCovered={setIframeCovered} />
        <EdgeworkModal
          edgeworkModalIsOpen={edgeworkModalIsOpen}
          setEdgeworkModalIsOpen={setEdgeworkModalIsOpen}
          setEdgework={setEdgework}
        />
      </div>
    </>
  );
};

const HeaderButton = ({
  children,
  underlineFirst,
  onClick,
}: {
  children: string;
  underlineFirst: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className="cursor-pointer text-white border-2 p-2 border-white rounded-md h-fit hover:text-gray-400 hover:border-gray-400"
      onClick={onClick}
    >
      <span className={`${underlineFirst ? "underline" : ""}`}>
        {children.slice(0, 1)}
      </span>
      {children.slice(1)}
    </button>
  );
};

export default Popups;
