import { ReactNode, useEffect, useState } from "react";
import Calculator from "./Calculator";
import EdgeworkModal from "./EdgeworkModal";
import HeaderButton from "./HeaderButton";
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
          case "c": {
            event.preventDefault();
            setCalcIsOpen(!calcIsOpen);
            break;
          }
          case "a": {
            event.preventDefault();
            setAlphaIsOpen(!alphaIsOpen);
            break;
          }
          // case "e" - handled inside edgework modal component
          // case "n" - handled inside mod search component
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
          text="Edgework"
          onClick={() => setEdgeworkModalIsOpen(true)}
        />
        <HeaderButton
          text="Calculator"
          onClick={() => setCalcIsOpen(!calcIsOpen)}
        />
        <HeaderButton
          text="Alphabet"
          onClick={() => setAlphaIsOpen(!alphaIsOpen)}
        />
        <Calculator isOpen={calcIsOpen} setIframeCovered={setIframeCovered} />
        <Alphabet isOpen={alphaIsOpen} setIframeCovered={setIframeCovered} />
      </div>
      <div className="ml-auto absolute flex flex-wrap content-center ">
        <EdgeworkModal
          edgeworkModalIsOpen={edgeworkModalIsOpen}
          setEdgeworkModalIsOpen={setEdgeworkModalIsOpen}
          setEdgework={setEdgework}
        />
      </div>
    </>
  );
};

export default Popups;
