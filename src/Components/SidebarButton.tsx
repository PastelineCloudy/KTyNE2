import { memo } from "react";
import { useState } from "react";
import { SquareX } from "lucide-react";

const SidebarButton = ({
  modName,
  isCurrentManual,
  handleModChange,
  handleModClose,
}: {
  modName: string;
  isCurrentManual: boolean;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <li
      className={`pt-0.5 flex cursor-pointer hover:bg-gray-200 max-w-50 ${
        isCurrentManual ? "bg-gray-200" : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <SquareX
        size={20}
        onClick={() => handleModClose(modName, isCurrentManual)}
        className={`hover:text-red-500 pr-1 ${hover ? "" : "opacity-0"}`}
      />
      <button
        className="w-full text-left text-1 text-nowrap text-ellipsis overflow-hidden cursor-pointer"
        onClick={() => {
          handleModChange(modName, isCurrentManual);
        }}
        onMouseDown={(e) => {
          if (e.button === 1) handleModClose(modName, isCurrentManual);
        }}
      >
        {modName}
      </button>
    </li>
  );
};

export default memo(SidebarButton);
