import { ReactNode } from "react";

const CustomDialog = ({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    open && (
      <div
        className="fixed left-0 top-0 z-2 w-full h-full flex place-self-center bg-black/50"
        onMouseDown={onClose}
      >
        <div
          className={`m-auto bg-white p-8 border-2 rounded-2xl ${className}`}
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
}: {
  children: string | ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="border-2 border-black w-fit cursor-pointer p-1 rounded-md hover:bg-gray-200"
    >
      {children}
    </button>
  );
};

export default CustomDialog;
