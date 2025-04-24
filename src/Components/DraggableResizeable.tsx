import { Minus } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

const DraggableResizeable = ({
  children,
  setIframeCovered,
  isOpen,
  setIsOpen,
  disableResize = false,
}: {
  children: string | ReactNode;
  setIframeCovered: (newVal: boolean) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  disableResize?: boolean;
}) => {
  const rndRef = useRef<Rnd>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef || !wrapperRef.current) return;
    const firstInput =
      wrapperRef.current.querySelector("input") ||
      wrapperRef.current.querySelector("textarea");
    if (firstInput) firstInput.select();
  }, [isOpen]);

  return (
    <Rnd
      ref={rndRef}
      style={{
        visibility: isOpen ? "visible" : "hidden",
      }}
      bounds="window"
      cancel=".cancel-drag"
      enableResizing={disableResize ? resizeNone : resizeAll}
      onDragStart={() => setIframeCovered(true)}
      onDragStop={() => setIframeCovered(false)}
      onClick={(e: MouseEvent) => e.stopPropagation()}
    >
      <div
        ref={wrapperRef}
        className="w-full h-full bg-jet text-bg border-2 border-bg rounded-md relative p-2 pt-4 overflow-hidden"
      >
        <Minus
          className="right-1 top-1 hover:text-red-400 cursor-pointer absolute"
          onClick={() => setIsOpen(false)}
          size={16}
        />
        {children}
      </div>
    </Rnd>
  );
};

const resizeAll = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
};

const resizeNone = {
  top: false,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

export default DraggableResizeable;
