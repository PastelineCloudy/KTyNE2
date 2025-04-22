import { useCallback, useEffect } from "react";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";

const OptionPopup = ({
  isOpen,
  popupMessage,
  options,
  optionCallbacks,
  closeCallback,
}: {
  isOpen: boolean;
  popupMessage: string;
  options: string[];
  optionCallbacks: (() => void)[];
  closeCallback: () => void;
}) => {
  const doCallback = useCallback(
    (index: number) => {
      if (index < 0 || index > optionCallbacks.length) return;
      else optionCallbacks[index]();
      closeCallback();
    },
    [closeCallback, optionCallbacks]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key || !(isFinite(parseInt(e.key)) && e.key !== " ")) return;
      doCallback(parseInt(e.key) - 1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCallback, doCallback, optionCallbacks, isOpen]);

  return (
    <CustomDialog open={isOpen} onClose={closeCallback}>
      <div className="text-center">
        <p className="mb-8 text-xl">{popupMessage}</p>
        <div className="flex justify-center gap-2">
          {options.map((option, index) => (
            <CustomDialogButton key={index} onClick={() => doCallback(index)}>
              <span>
                {index + 1}: {option}
              </span>
            </CustomDialogButton>
          ))}
        </div>
      </div>
    </CustomDialog>
  );
};

export default OptionPopup;
