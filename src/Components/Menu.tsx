import { ReactNode, useEffect, useState } from "react";
import { HeaderButton } from "./Popups";
import DraggableResizeable from "./DraggableResizeable";

export const Menu = ({
  text,
  children,
}: {
  text: string;
  children?: string | ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col z-1" onClick={() => setOpen(!open)}>
      <HeaderButton>{text}</HeaderButton>
      <div className={`h-0 ${open ? "" : "overflow-hidden"}`}>
        <ul
          className="mt-1 bg-gray-200 rounded-md border-2 border-black flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
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
  underLineIndex = 0,
  shortCutKey,
  corner = "top-left",
  xOffset = 0,
  yOffset = 0,
}: {
  buttonText: string;
  children: ReactNode;
  setIframeCovered: (val: boolean) => void;
  underLineIndex?: number;
  shortCutKey?: string;
  corner?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  xOffset?: number;
  yOffset?: number;
}) => {
  const [itemIsOpen, setItemIsOpen] = useState<boolean>(false);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.key === shortCutKey) {
        event.preventDefault();
        setItemIsOpen(!itemIsOpen);
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [itemIsOpen, shortCutKey]);
  return (
    <>
      <li
        className="m-1 p-1 hover:bg-gray-400 cursor-pointer"
        onClick={() => setItemIsOpen(!itemIsOpen)}
      >
        {underLineIndex ? (
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
      <DraggableResizeable
        isOpen={itemIsOpen}
        setIsOpen={setItemIsOpen}
        corner={corner}
        setIframeCovered={setIframeCovered}
        xOffset={xOffset}
        yOffset={yOffset}
      >
        {children}
      </DraggableResizeable>
    </>
  );
};
