import { useState } from "react";
import SidebarButton from "./SidebarButton";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp,
  PanelLeftClose,
} from "lucide-react";
import OptionPopup from "./OptionPopup";
import { getFilteredMods } from "../Utils/ModSearchUtils";

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

  const manualList = getFilteredMods(openModList, filter, filterAlpha);

  return (
    <div
      className={`flex-1 relative flex flex-col ${
        sidebarOpen ? "min-w-52" : "w-0"
      }`}
    >
      <PanelLeftClose
        className={`${
          sidebarOpen ? "" : "rotate-180"
        } absolute -right-7 hover:text-gray-400 cursor-pointer`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />
      {sidebarOpen && (
        <div className={`flex-1 p-2 flex flex-col gap-2 overflow-hidden`}>
          <ul className="flex-1 overflow-scroll no-scrollbar">
            {manualList && manualList.length > 0 ? (
              manualList.map((modName) => (
                <SidebarButton
                  key={modName}
                  modName={modName}
                  isCurrentManual={currentManual === modName}
                  handleModChange={handleModChange}
                  handleModClose={handleModClose}
                />
              ))
            ) : (
              <div className="text-center">
                <ArrowUp className="ml-auto mr-auto" />
                <p>Open a manual to get started</p>
              </div>
            )}
          </ul>
          <div className="flex mt-auto">
            <input
              type="text"
              value={filter}
              className={`bg-white rounded-md pl-1 border-2 w-0 flex-1`}
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
          <div className={`flex justify-between gap-1`}>
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
              <button
                className="heartbeat"
                onClick={() => setResetingAll(true)}
              >
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
      )}
    </div>
  );
};

export default Sidebar;
