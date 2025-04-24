import { useState } from "react";
import SidebarButton from "./SidebarButton";
import { getFilteredMods } from "../Utils/FilterUtils";
import { ArrowDown01, ArrowDownAZ, PanelLeftClose } from "lucide-react";
import OptionPopup from "./OptionPopup";

const localStorageFilterPrefenceRaw = localStorage.getItem(
  "KTyNE:sidebarFilterPreference"
);
const localStorageFilterPrefence = localStorageFilterPrefenceRaw
  ? JSON.parse(localStorageFilterPrefenceRaw)
  : "";

const Sidebar = ({
  openModList,
  currentManual,
  handleModChange,
  handleModClose,
  closeAllManuals,
  resetAllManuals,
}: {
  openModList: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  closeAllManuals: () => void;
  resetAllManuals: () => void;
}) => {
  const [filter, setFilter] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [closingAll, setClosingAll] = useState<boolean>(false);
  const [resetingAll, setResetingAll] = useState<boolean>(false);
  const [filterAlpha, setFilterAlpha] = useState<boolean>(
    localStorageFilterPrefence
  );

  const handleFilterChange = (newVal: boolean) => {
    localStorage.setItem(
      "KTyNE:sidebarFilterPreference",
      JSON.stringify(newVal)
    );
    setFilterAlpha(newVal);
  };

  const manualList = filterAlpha
    ? getFilteredMods(openModList, filter)?.sort()
    : getFilteredMods(openModList, filter);
  return (
    <div className="relative">
      <PanelLeftClose
        className={`absolute -right-7 hover:text-gray-400 cursor-pointer
${sidebarOpen ? "" : "rotate-180"}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className={`h-full flex flex-col ${sidebarOpen ? "p-2" : "w-0"}`}>
        <ul className="overflow-auto no-scrollbar mt-2 mb-2">
          {manualList &&
            manualList.map((modName) => (
              <SidebarButton
                key={modName}
                modName={modName}
                isCurrentManual={currentManual === modName}
                handleModChange={handleModChange}
                handleModClose={handleModClose}
              />
            ))}
        </ul>
        <div className="flex mt-auto ">
          <input
            type="text"
            value={filter}
            className={`bg-white rounded-md pl-1 border-2 w-full mb-2
          ${sidebarOpen ? "" : "hidden"} ${
              openModList.length === 0 ? "opacity-0" : ""
            }`}
            id="open-manual-filter"
            placeholder="Filter Open Manuals"
            onChange={(e) => setFilter(e.target.value)}
          />
          {filterAlpha ? (
            <ArrowDownAZ
              className="cursor-pointer hover:text-gray-500"
              onClick={() => handleFilterChange(false)}
            />
          ) : (
            <ArrowDown01
              className="cursor-pointer hover:text-gray-500"
              onClick={() => handleFilterChange(true)}
            />
          )}
        </div>
        <div
          className={`flex justify-center border-t-2 p-2 gap-1 mb-2 ${
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
            closeCallback={() => setClosingAll(false)}
            options={[
              { text: "Cancel" },
              { text: "Yes, I'm sure", callback: closeAllManuals },
            ]}
          />

          {openModList.length > 0 && (
            <button className="heartbeat" onClick={() => setResetingAll(true)}>
              Reset all
            </button>
          )}

          <OptionPopup
            isOpen={resetingAll}
            popupMessage="Are you sure you want to reset all open manuals?"
            closeCallback={() => setResetingAll(false)}
            options={[
              { text: "Cancel" },
              { text: "Yes, I'm sure", callback: resetAllManuals },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
