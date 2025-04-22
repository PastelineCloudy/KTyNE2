import { ReactNode, useEffect, useState } from "react";
import Calculator from "./Calculator";
import EdgeworkModal from "./EdgeworkModal";
import Alphabet from "./Alphabet";
import { Menu, MenuItem } from "./Menu";
import BaseConverter from "./BaseConverter";

const Popups = ({
  setEdgework,
  setIframeCovered,
}: {
  setEdgework: (newVal: ReactNode) => void;
  setIframeCovered: (newVal: boolean) => void;
}) => {
  const [calcIsOpen, setCalcIsOpen] = useState<boolean>(false);
  const [alphaIsOpen, setAlphaIsOpen] = useState<boolean>(false);
  const [baseConverterIsOpen, setBaseConverterIsOpen] =
    useState<boolean>(false);
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
          case "b": {
            event.preventDefault();
            setBaseConverterIsOpen(!baseConverterIsOpen);
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
  }, [alphaIsOpen, baseConverterIsOpen, calcIsOpen, edgeworkModalIsOpen]);
  return (
    <>
      <div className="flex flex-wrap justify-around gap-2">
        <HeaderButton onClick={() => setEdgeworkModalIsOpen(true)}>
          Edgework
        </HeaderButton>
        <Menu text="Tools">
          <MenuItem underlineFirst onClick={() => setAlphaIsOpen(!alphaIsOpen)}>
            Alphabet
          </MenuItem>
          <MenuItem
            underlineFirst
            onClick={() => setBaseConverterIsOpen(!baseConverterIsOpen)}
          >
            Base Converter
          </MenuItem>
          <MenuItem underlineFirst onClick={() => setCalcIsOpen(!calcIsOpen)}>
            Calculator
          </MenuItem>
        </Menu>
        <Alphabet isOpen={alphaIsOpen} setIframeCovered={setIframeCovered} />
        <BaseConverter
          isOpen={baseConverterIsOpen}
          setIframeCovered={setIframeCovered}
        />
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

export const HeaderButton = ({
  children,
  underlineFirst = false,
  onClick,
}: {
  children: string;
  underlineFirst?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className="cursor-pointer text-white border-2 p-2 border-white rounded-md h-fit hover:text-gray-400 hover:border-gray-400 max-w-fit"
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
