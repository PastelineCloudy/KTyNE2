import { ReactNode, RefObject, useState } from "react";
import Calculator from "./Calculator";
import EdgeworkModal from "./EdgeworkModal";
import HeaderButton from "./HeaderButton";

const Popups = ({
  pageRef,
  setEdgework,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
  setEdgework: (newVal: ReactNode) => void;
}) => {
  const [calcIsOpen, setCalcIsOpen] = useState<boolean>(false);

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
      <Calculator pageRef={pageRef} isOpen={calcIsOpen} />
      <div className="ml-auto flex content-center flex-wrap">
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
