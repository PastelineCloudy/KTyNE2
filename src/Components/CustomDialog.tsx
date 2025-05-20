import { ReactNode, useEffect } from "react";

const CustomDialog = ({
  open,
  onClose,
  children,
  closeOnEscape = true,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnEscape?: boolean;
}) => {
  useEffect(() => {
    if (!closeOnEscape || !open) return;
    const escapePress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", escapePress);

    return () => {
      window.removeEventListener("keydown", escapePress);
    };
  }, [closeOnEscape, onClose, open]);

  const element = document.querySelector("#manual-window");
  const elementRect = element?.getBoundingClientRect();

  const centerPopups = true; // TODO: Add off center option for popups (for powertools full screen)

  return (
    open && (
      <div
        className="fixed left-0 top-0 z-1 w-full h-full flex bg-black/50"
        onMouseDown={onClose}
      >
        <div
          style={
            centerPopups
              ? {
                  margin: "auto",
                }
              : {
                  marginTop: elementRect?.top,
                  marginLeft: elementRect?.left,
                  width: elementRect?.width,
                  height: elementRect?.height,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
          }
        >
          <div
            className={`bg-white p-8 border-2 rounded-2xl`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    )
  );
};

export const CustomDialogButton = ({
  children,
  onClick,
  type = "button",
  className,
}: {
  children: string | ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} border-2 border-black w-full cursor-pointer p-1 rounded-md hover:bg-gray-200`}
    >
      {children}
    </button>
  );
};

export const CustomDialogTitle = ({
  children,
}: {
  children: string | ReactNode;
}) => {
  return <div className="text-3xl text-center mb-8">{children}</div>;
};

export default CustomDialog;
