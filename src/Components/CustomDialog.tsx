import { ReactNode } from "react";

const CustomDialog = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    open && (
      <div
        className="fixed left-0 top-0 z-2 w-full h-full flex place-self-center bg-black/50"
        onMouseDown={onClose}
      >
        <div
          className="m-auto bg-white p-8 border-2 rounded-2xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default CustomDialog;
