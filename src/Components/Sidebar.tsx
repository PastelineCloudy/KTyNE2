import { useState } from "react";
import SidebarButton from "./SidebarButton";
import { getFilteredMods } from "../Utils/FilterUtils";
import { PanelLeftClose } from "lucide-react";
import OptionPopup from "./OptionPopup";

const Sidebar = ({
  openModList,
  currentManual,
  handleModChange,
  handleModClose,
  closeAllMods,
}: {
  openModList: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  closeAllMods: () => void;
}) => {
  const [filter, setFilter] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [closingAll, setClosingAll] = useState<boolean>(false);
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
        ${sidebarOpen ? "" : "hidden"} ${
            openModList.length === 0 ? "opacity-0" : ""
          }`}
          placeholder="Filter Open Manuals"
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
          {openModList.length > 0 && (
            <button className="heartbeat" onClick={() => setClosingAll(true)}>
              Close all
            </button>
          )}

          <OptionPopup
            isOpen={closingAll}
            popupMessage="Are you sure you want to close all open manuals?"
            options={["Cancel", "Yes, I'm sure"]}
            optionCallbacks={[
              () => {},
              () => {
                closeAllMods();
              },
            ]}
            closeCallback={() => setClosingAll(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
