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
  const [completionStatus, setCompletionStatus] = useState<number>(0);
  const completionColors = ["bg-yellow-400", "bg-green-400"];

  return (
    <li
      className={`pt-0.5 max-w-48 flex cursor-pointer hover:bg-gray-200 ${
        isCurrentManual ? "bg-gray-200" : ""
      }`}
    >
      <SquareX
        size={20}
        onClick={() => handleModClose(modName, isCurrentManual)}
        className="hover:text-red-500"
      />
      <button
        className="w-full text-left text-1 text-nowrap text-ellipsis overflow-hidden cursor-pointer"
        onClick={() => handleModChange(modName, isCurrentManual)}
      >
        {modName}
      </button>
      <div
        onClick={() =>
          setCompletionStatus((completionStatus + 1) % completionColors.length)
        }
        className={`w-3 ${completionColors[completionStatus]} hover:border-black border-transparent border-1`}
      ></div>
    </li>
  );
};

export default memo(SidebarButton);
