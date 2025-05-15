import { ReactNode, useState } from "react";
import Calculator from "./Calculator";
import EdgeworkModal from "./EdgeworkModal";
import Alphabet from "./Alphabet";
import { Menu, MenuItem } from "./Menu";
import BaseConverter from "./BaseConverter";
import TimerPopup from "./Timer";
import CaesarCipher from "./CaesarCipher";
import GridPopup from "./GridPopup";
import Faq from "./Faq";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";

const Popups = ({
  setEdgework,
  setIframeCovered,
}: {
  setEdgework: (newVal: ReactNode) => void;
  setIframeCovered: (newVal: boolean) => void;
}) => {
  const [edgeworkModalIsOpen, setEdgeworkModalIsOpen] =
    useState<boolean>(false);
  const [faqModalIsOpen, setfaqModalIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-wrap justify-around gap-1">
        <HeaderButton onClick={() => setEdgeworkModalIsOpen(true)}>
          Edgework
        </HeaderButton>
        <Menu text="Tools">
          <MenuItem
            underLineIndex={0}
            buttonText="Alphabet"
            setIframeCovered={setIframeCovered}
            shortCutKey="a"
            disableResize
          >
            <Alphabet />
          </MenuItem>
          <MenuItem
            underLineIndex={0}
            buttonText="Base Converter"
            setIframeCovered={setIframeCovered}
            shortCutKey="b"
          >
            <BaseConverter />
          </MenuItem>
          <MenuItem
            buttonText="Caesar Cipher"
            setIframeCovered={setIframeCovered}
          >
            <CaesarCipher />
          </MenuItem>
          <MenuItem
            underLineIndex={0}
            buttonText="Grid"
            setIframeCovered={setIframeCovered}
            shortCutKey="g"
            disableResize
          >
            <GridPopup />
          </MenuItem>
          <MenuItem
            underLineIndex={2}
            buttonText="Text-Field Calc."
            setIframeCovered={setIframeCovered}
            shortCutKey="x"
          >
            <Calculator />
          </MenuItem>
          <MenuItem
            underLineIndex={0}
            buttonText="Timer"
            setIframeCovered={setIframeCovered}
            shortCutKey="t"
            disableResize
          >
            <TimerPopup />
          </MenuItem>
        </Menu>
        <HeaderButton onClick={() => setfaqModalIsOpen(true)}>FAQ</HeaderButton>
        <EdgeworkModal
          edgeworkModalIsOpen={edgeworkModalIsOpen}
          setEdgeworkModalIsOpen={setEdgeworkModalIsOpen}
          setEdgework={setEdgework}
        />
        <CustomDialog
          open={faqModalIsOpen}
          onClose={() => setfaqModalIsOpen(false)}
        >
          <Faq />
          <div className="text-center">
            <CustomDialogButton
              onClick={() => setfaqModalIsOpen(false)}
              className="max-w-fit"
            >
              Close
            </CustomDialogButton>
          </div>
        </CustomDialog>
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
