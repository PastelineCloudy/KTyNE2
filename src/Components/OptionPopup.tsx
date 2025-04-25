import { useEffect } from "react";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";

type Option = {
  text: string;
  callback?: () => void;
  className?: string;
};

const OptionPopup = ({
  isOpen,
  popupMessage,
  closeCallback,
  options = [{ text: "Close" }],
  optionShortcuts = true,
  listStyle = false,
}: {
  isOpen: boolean;
  popupMessage: string;
  closeCallback: () => void;
  options?: Option[];
  optionShortcuts?: boolean;
  listStyle?: boolean;
}) => {
  useEffect(() => {
    if (!isOpen || !optionShortcuts) return;
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
  }, [closeCallback, isOpen, optionShortcuts, options]);

  return (
    <CustomDialog open={isOpen} onClose={closeCallback}>
      <div className="text-center max-h-[80vh] overflow-scroll no-scrollbar">
        <p className="mb-8 text-xl">{popupMessage}</p>
        <ul
          className={`flex justify-center gap-2 ${
            listStyle && "flex-col items-center"
          }`}
        >
          {options.map((option, index) => (
            <CustomDialogButton
              key={index}
              onClick={() => {
                if (option.callback) option.callback();
                closeCallback();
              }}
              className={option.className}
            >
              <span>
                {optionShortcuts ? `${index + 1}: ${option.text}` : option.text}
              </span>
            </CustomDialogButton>
          ))}
        </ul>
      </div>
    </CustomDialog>
  );
};

export default OptionPopup;
