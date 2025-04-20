import { useRef, useState } from "react";
import SidebarButton from "./SidebarButton";
import { getFilteredMods } from "../Utils/FilterUtils";
import { PanelLeftClose } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  return (
    <div className="relative">
      <PanelLeftClose
        className={`absolute -right-7 hover:text-gray-400 cursor-pointer
${sidebarOpen ? "" : "rotate-180"}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className={`h-full flex flex-col ${sidebarOpen ? "m-2" : "w-0"}`}>
        <input
          type="text"
          value={filter}
          className={`bg-white rounded-md pl-1 border-2 w-full
        ${sidebarOpen ? "" : "hidden"}`}
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
        <div
          className={`mt-auto flex justify-center border-t-2 p-2 m-2 ${
            sidebarOpen ? "" : "hidden"
          }`}
        >
          <button
            className="heartbeat"
            onClick={() => closeAllDialogRef.current?.showModal()}
          >
            Close all
          </button>
          <dialog
            ref={closeAllDialogRef}
            className="m-auto p-8 border-black border-2 rounded-md"
          >
            <p className="mb-8">
              Are you sure you want to close all open manuals?
            </p>
            <div className="flex justify-around">
              <button
                className="border-2 border-black cursor-pointer hover:bg-gray-200 p-1 w-20 rounded-md"
                onClick={() => closeAllDialogRef.current?.close()}
              >
                No
              </button>
              <button
                className="border-2 border-black cursor-pointer hover:bg-gray-200 p-1 w-20 rounded-md"
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
    </div>
  );
};

export default Sidebar;
