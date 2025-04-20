import { useRef, useState } from "react";
import SidebarButton from "./SidebarButton";
import { getFilteredMods } from "../Utils/FilterUtils";

const Sidebar = ({
  openModList,
  currentManual,
  handleModChange,
  handleModClose,
  setOpenManuals,
}: {
  openModList: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  setOpenManuals: (newVal: Map<string, string>) => void;
}) => {
  const closeAllDialogRef = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState<string>("");
  return (
    <div className="p-2 flex flex-col">
      <input
        type="text"
        value={filter}
        className="bg-white rounded-md pl-1 border-2 w-full"
        placeholder="Filter Manuals"
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul className="overflow-auto no-scrollbar mt-2 mb-2">
        {getFilteredMods(openModList, filter)
          .sort()
          .map((modName) => (
            <SidebarButton
              key={modName}
              modName={modName}
              isCurrentManual={currentManual === modName}
              handleModChange={handleModChange}
              handleModClose={handleModClose}
            />
          ))}
      </ul>
      <div className="mt-auto flex justify-center border-t-2 pt-2">
        <button
          className="heartbeat"
          onClick={() => closeAllDialogRef.current?.showModal()}
        >
          Close all
        </button>
        <dialog ref={closeAllDialogRef} className="m-auto p-2">
          <p>Close all open modules?</p>
          <div className="flex justify-around">
            <button
              className="border-2 border-black cursor-pointer hover:bg-gray-200 p-1 w-12 rounded-md"
              onClick={() => closeAllDialogRef.current?.close()}
            >
              No
            </button>
            <button
              className="border-2 border-black cursor-pointer hover:bg-gray-200 p-1 w-12 rounded-md"
              onClick={() => {
                setOpenManuals(new Map<string, string>());
                closeAllDialogRef.current?.close();
              }}
            >
              Yes
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Sidebar;
