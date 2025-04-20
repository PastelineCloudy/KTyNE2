import { useRef } from "react";
import SidebarButton from "./SidebarButton";

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
  return (
    <div className="p-2 flex flex-col">
      <h2 className="text-xl">Open Modules</h2>
      <div>
        <button
          className="border-2 border-black rounded-md p-1 mb-1 cursor-pointer"
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
      <ul className="overflow-auto no-scrollbar">
        {openModList.sort().map((modName) => (
          <SidebarButton
            key={modName}
            modName={modName}
            isCurrentManual={currentManual === modName}
            handleModChange={handleModChange}
            handleModClose={handleModClose}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
