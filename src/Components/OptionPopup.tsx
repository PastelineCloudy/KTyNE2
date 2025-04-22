import { useCallback, useEffect } from "react";
import CustomDialog from "./CustomDialog";

const OptionPopup = ({
  triggerState,
  popupMessage,
  options,
  optionCallbacks,
  closeCallback,
}: {
  triggerState: boolean;
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
    if (!triggerState) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCallback();
      if (!e.key || !(isFinite(parseInt(e.key)) && e.key !== " ")) return;
      doCallback(parseInt(e.key) - 1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCallback, doCallback, optionCallbacks, triggerState]);

  return (
    <CustomDialog open={triggerState} onClose={closeCallback}>
      <div className="text-center">
        <p className="mb-8 text-xl">{popupMessage}</p>
        <div className="flex justify-center gap-2">
          {options.map((option, index) => (
            <button
              key={option}
              className="border-2 border-black cursor-pointer hover:bg-gray-200 p-1 rounded-md"
              onClick={() => doCallback(index)}
            >
              <span>
                {index + 1}: {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    </CustomDialog>
  );
};

export default OptionPopup;
