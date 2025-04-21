import { ReactNode, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

const DraggableResizeable = ({
  isOpen = true,
  corner = "top-left",
  disableResize = false,
  children,
  xOffset = 0,
  yOffset = 0,
  setIframeCovered,
}: {
  isOpen?: boolean;
  corner?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  disableResize?: boolean;
  children: string | ReactNode;
  xOffset?: number;
  yOffset?: number;
  setIframeCovered: (newVal: boolean) => void;
}) => {
  const rndRef = useRef<Rnd>(null);

  useEffect(() => {
    const setBottomRightPosition = () => {
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
            // Default Bahavior
            break;
          case "top-right":
            newX = viewportWidth - elementWidth;
            break;
          case "bottom-right":
            newX = viewportWidth - elementWidth - xOffset;
            newY = viewportHeight - elementHeight - yOffset;
            break;
          case "bottom-left":
            newY = viewportHeight - elementHeight;
            break;
        }

        rndRef.current.updatePosition({
          x: newX,
          y: newY,
        });
      }
    };

    setBottomRightPosition();
    window.addEventListener("resize", setBottomRightPosition);

    return () => {
      window.removeEventListener("resize", setBottomRightPosition);
    };
  }, [isOpen, corner, xOffset, yOffset]);

  return (
    <Rnd
      style={{
        display: isOpen ? "flex" : "none",
        zIndex: 1,
      }}
      ref={rndRef}
      bounds="window"
      cancel=".cancel-drag"
      enableResizing={disableResize ? resizeNone : resizeAll}
      onDragStart={() => setIframeCovered(true)}
      onDragStop={() => setIframeCovered(false)}
    >
      {children}
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
