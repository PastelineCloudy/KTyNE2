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

  return (
    open && (
      <div
        className="fixed left-0 top-0 z-2 w-full h-full flex place-self-center bg-black/50"
        onMouseDown={onClose}
      >
        <div
          className={`m-auto bg-white p-8 border-2 rounded-2xl`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
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

export default CustomDialog;
