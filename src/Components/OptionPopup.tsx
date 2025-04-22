import { useEffect } from "react";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";

type Option = {
  text: string;
  callback?: () => void;
};

const OptionPopup = ({
  isOpen,
  popupMessage,
  closeCallback,
  options = [{ text: "Close" }],
}: {
  isOpen: boolean;
  popupMessage: string;
  closeCallback: () => void;
  options?: Option[];
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key || !(isFinite(parseInt(e.key)) && e.key !== " ")) return;
      const index = parseInt(e.key) - 1;
      if (options[index].callback) options[index].callback();
      closeCallback();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCallback, isOpen, options]);

  return (
    <CustomDialog open={isOpen} onClose={closeCallback}>
      <div className="text-center">
        <p className="mb-8 text-xl">{popupMessage}</p>
        <div className="flex justify-center gap-2">
          {options.map((option, index) => (
            <CustomDialogButton
              key={index}
              onClick={() => {
                if (option.callback) option.callback();
                closeCallback();
              }}
            >
              <span>
                {index + 1}: {option.text}
              </span>
            </CustomDialogButton>
          ))}
        </div>
      </div>
    </CustomDialog>
  );
};

export default OptionPopup;
