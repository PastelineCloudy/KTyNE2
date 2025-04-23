import { ReactNode, useState } from "react";
import { HeaderButton } from "./Popups";

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
      {open && (
        <div className="h-0">
          <ul className="mt-1 bg-gray-200 rounded-md border-2 border-black flex flex-col">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};

export const MenuItem = ({
  onClick,
  underlineFirst = false,
  children,
}: {
  onClick: () => void;
  underlineFirst?: boolean;
  children: string | ReactNode;
}) => {
  return (
    <li className="m-1 p-1 hover:bg-gray-400 cursor-pointer" onClick={onClick}>
      {typeof children === "string" ? (
        underlineFirst ? (
          <>
            <span className="underline">{children.slice(0, 1)}</span>
            <span>{children.slice(1)}</span>
          </>
        ) : (
          <span>{children.slice(1)}</span>
        )
      ) : (
        children
      )}
    </li>
    // <li className="m-1 p-1 hover:bg-gray-400 cursor-pointer" onClick={onClick}>
    //   {underlineFirst && (
    //     <span className="underline">{children.slice(0, 1)}</span>
    //   )}
    //   <span>{underlineFirst ? children.slice(1) : children}</span>
    // </li>
  );
};
