import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { HeaderButton } from "./Popups";
import DraggableResizeable from "./DraggableResizeable";
import useOutsideClickTracker from "../Hooks/useOutsideClickTracker";

export const Menu = ({
  text,
  children,
}: {
  text: string;
  children?: string | ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClickTracker(open, setOpen, menuRef);
  return (
    <div
      className="flex flex-col z-1"
      onClick={() => setOpen(!open)}
      ref={menuRef}
    >
      <HeaderButton>{text}</HeaderButton>
      <div className={`h-0 w-0 ${open ? "" : "overflow-hidden"}`}>
        <ul className="mt-1 bg-gray-200 rounded-md border-2 border-black flex flex-col w-max">
          {children}
        </ul>
      </div>
    </div>
  );
};

export const MenuItem = ({
  buttonText,
  children,
  setIframeCovered,
  underLineIndex,
  shortCutKey,
  disableResize,
}: {
  buttonText: string;
  children: ReactNode;
  setIframeCovered: (val: boolean) => void;
  underLineIndex?: number;
  shortCutKey?: string;
  disableResize?: boolean;
}) => {
  const [itemIsOpen, _setItemIsOpen] = useState<boolean>(false);
  const [previouslyOpened, setPreviouslyOpened] = useState<boolean>(false);

  const setItemIsOpen = useCallback(
    (val: boolean) => {
      if (!previouslyOpened) setPreviouslyOpened(true);
      _setItemIsOpen(val);
    },
    [previouslyOpened]
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        shortCutKey &&
        event.key.toLowerCase() === shortCutKey.toLowerCase()
      ) {
        event.preventDefault();
        setItemIsOpen(!itemIsOpen);
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [itemIsOpen, setItemIsOpen, shortCutKey]);
  return (
    <div className="flex">
      <li
        className="m-1 p-1 hover:bg-gray-400 cursor-pointer w-full"
        onClick={() => setItemIsOpen(!itemIsOpen)}
      >
        {underLineIndex || underLineIndex === 0 ? (
          <>
            <span>{buttonText.slice(0, underLineIndex)}</span>
            <span className="underline">
              {buttonText.slice(underLineIndex, underLineIndex + 1)}
            </span>
            <span>{buttonText.slice(underLineIndex + 1)}</span>
          </>
        ) : (
          <span>{buttonText}</span>
        )}
      </li>
      {previouslyOpened && (
        <div>
          <DraggableResizeable
            isOpen={itemIsOpen}
            setIsOpen={setItemIsOpen}
            setIframeCovered={setIframeCovered}
            disableResize={disableResize}
          >
            {children}
          </DraggableResizeable>
        </div>
      )}
    </div>
  );
};
