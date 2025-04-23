import { Minus } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

const DraggableResizeable = ({
  children,
  setIframeCovered,
  isOpen,
  setIsOpen,
  corner = "top-left",
  disableResize = false,
  xOffset = 0,
  yOffset = 0,
}: {
  children: string | ReactNode;
  setIframeCovered: (newVal: boolean) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  corner?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  disableResize?: boolean;
  xOffset?: number;
  yOffset?: number;
}) => {
  const rndRef = useRef<Rnd>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [previouslyOpened, setPreviouslyOpened] = useState<boolean>(false);

  useEffect(() => {
    const updatePosition = () => {
      if (rndRef.current && rndRef.current.getSelfElement()) {
        const initialRect = rndRef.current
          .getSelfElement()!
          .getBoundingClientRect();
        const [initialX, initialY] = [0, 0];
        const [elementWidth, elementHeight] = [
          initialRect.width,
          initialRect.height,
        ];
        const [viewportWidth, viewportHeight] = [
          window.innerWidth,
          window.innerHeight,
        ];

        let [newX, newY] = [initialX, initialY];
        switch (corner) {
          case "top-left":
            newX = xOffset;
            newY = yOffset;
            break;
          case "top-right":
            newX = viewportWidth - elementWidth - xOffset;
            newY = yOffset;
            break;
          case "bottom-right":
            newX = viewportWidth - elementWidth - xOffset;
            newY = viewportHeight - elementHeight - yOffset;
            break;
          case "bottom-left":
            newX = xOffset;
            newY = viewportHeight - elementHeight - yOffset;
            break;
        }

        rndRef.current.updatePosition({
          x: newX,
          y: newY,
        });
      }
    };

    if (!previouslyOpened && isOpen) {
      setPreviouslyOpened(true);
      updatePosition();
    } else if (!previouslyOpened && !isOpen) {
      // First run - Throws it off screen to prevent flash on first "show"
      updatePosition();
    }

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, corner, xOffset, yOffset, previouslyOpened]);

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
    >
      <div
        ref={wrapperRef}
        className="w-full h-full bg-jet text-bg border-2 border-bg rounded-md p-2 pt-1"
      >
        <Minus
          className="float-end hover:text-red-400 cursor-pointer"
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
