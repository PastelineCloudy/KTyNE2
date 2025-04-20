import { ReactNode, useState } from "react";
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
  return (
    <>
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
      <div className="ml-auto absolute flex content-center flex-wrap">
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
