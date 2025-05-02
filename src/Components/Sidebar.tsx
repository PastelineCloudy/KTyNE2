import { useRef, useState } from "react";
import SidebarButton from "./SidebarButton";
import { ArrowDown01, ArrowDownAZ, ArrowUp, Pin, PinOff } from "lucide-react";
import OptionPopup from "./OptionPopup";
import { getFilteredMods } from "../Utils/ModSearchUtils";
import ModSearch from "./ModSearch";

const localStorageFilterPrefenceRaw = localStorage.getItem(
  "KTyNE:sidebarFilterPreference"
);
const localStorageFilterPrefence = localStorageFilterPrefenceRaw
  ? JSON.parse(localStorageFilterPrefenceRaw)
  : "";

const Sidebar = ({
  handleOpenMod,
  setIframeCovered,
  openManuals,
  currentManual,
  handleModChange,
  handleModClose,
  closeAllManuals,
  resetAllManuals,
}: {
  handleOpenMod: (
    modName: string,
    manualUrl: string,
    preventChange?: boolean
  ) => void;
  setIframeCovered: (bool: boolean) => void;
  openManuals: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  closeAllManuals: () => void;
  resetAllManuals: () => void;
}) => {
  const [filter, setFilter] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarTempOpen, setSidebarTempOpen] = useState<boolean>(false);
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

  const manualList = getFilteredMods(openManuals, filter, filterAlpha);
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`flex flex-col flex-1 relative transition-all duration-250 ease-in-out
        ${sidebarOpen || sidebarTempOpen ? "min-w-52" : "min-w-10"}
        `}
      onMouseMove={(e) => {
        // onMouseMove and boundingBox used for popups
        // (since they're considered children of this div)
        const sidebarBox = sidebarRef.current?.getBoundingClientRect();
        if (sidebarOpen || !sidebarBox) return;
        if (e.clientX > sidebarBox?.width || e.clientY < sidebarBox?.y) {
          setSidebarTempOpen(false);
        } else {
          setSidebarTempOpen(true);
        }
      }}
      // onMouseEnter handled in onMouseMove
      onMouseLeave={() => setSidebarTempOpen(false)}
      ref={sidebarRef}
    >
      <ModSearch
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
        openManuals={openManuals}
      />
      <div
        className={`hover:text-gray-400 cursor-pointer absolute top-2.5 right-2.5
          transition-all delay-100 ${
            sidebarOpen || sidebarTempOpen ? "" : "opacity-0"
          }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <Pin /> : <PinOff />}
      </div>

      <div
        className={`flex-1 m-2 mt-0 flex flex-col gap-2 overflow-hidden 
          transition-all delay-100 ${
            sidebarOpen || sidebarTempOpen ? "" : "opacity-0"
          }`}
      >
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
            placeholder="Filter Opened"
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
        <div className={`flex justify-between`}>
          {openManuals.length > 0 && (
            <button
              className="heartbeat whitespace-nowrap"
              onClick={() => setClosingAll(true)}
            >
              Close all
            </button>
          )}

          {openManuals.length > 0 && (
            <button
              className="heartbeat whitespace-nowrap"
              onClick={() => setResetingAll(true)}
            >
              Reset all
            </button>
          )}
        </div>
      </div>
      <>
        <OptionPopup
          isOpen={closingAll}
          popupMessage="Are you sure you want to close all open manuals?"
          closeCallback={() => setClosingAll(false)}
          options={[
            { text: "Cancel" },
            { text: "Yes, I'm sure", callback: closeAllManuals },
          ]}
        />
        <OptionPopup
          isOpen={resetingAll}
          popupMessage="Are you sure you want to reset all open manuals?"
          closeCallback={() => setResetingAll(false)}
          options={[
            { text: "Cancel" },
            { text: "Yes, I'm sure", callback: resetAllManuals },
          ]}
        />
      </>
    </div>
  );
};

export default Sidebar;
