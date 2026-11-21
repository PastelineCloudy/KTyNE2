import { memo, useState } from "react";
import { SquareX } from "lucide-react";

const SidebarButton = ({
  modName,
  customName,
  isCurrentManual,
  handleModChange,
  handleModClose,
  onRename,
}: {
  modName: string;
  customName?: string;
  isCurrentManual: boolean;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  onRename: (modName: string, newName: string) => void;
}) => {
  const [hover, setHover] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState("");

  const displayName = customName || modName;

  const startRename = () => {
    setDraft(displayName);
    setIsRenaming(true);
  };

  const finishRename = () => {
    const trimmed = draft.trim();
    // If empty or matches the original modName, clear custom name
    onRename(modName, trimmed && trimmed !== modName ? trimmed : "");
    setIsRenaming(false);
  };

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
        onClick={(e) => {
          e.stopPropagation();
          handleModClose(modName, isCurrentManual);
        }}
        className={`hover:text-red-500 pr-1 shrink-0 ${hover ? "" : "opacity-0"}`}
      />

      {isRenaming ? (
        <input
          type="text"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={finishRename}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              finishRename();
            } else if (e.key === "Escape") {
              setIsRenaming(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full px-1 text-1 bg-white text-black border border-gray-500 rounded-sm outline-none"
        />
      ) : (
        <button
          type="button"
          title={`${displayName} (double-tap to rename)`}
          className="w-full text-left text-1 text-nowrap text-ellipsis overflow-hidden cursor-pointer"
          onClick={() => {
            handleModChange(modName, isCurrentManual);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            startRename();
          }}
          onMouseDown={(e) => {
            if (e.button === 1) {
              e.preventDefault();
              handleModClose(modName, isCurrentManual);
            }
          }}
        >
          {displayName}
        </button>
      )}
    </li>
  );
};

export default memo(SidebarButton);
