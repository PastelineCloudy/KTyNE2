import { ChevronDown, Search } from "lucide-react";
import { Ref, useCallback, useRef, useState } from "react";
import useOutsideClickTracker from "../Hooks/useOutsideClickTracker";
import fullModListRaw from "../fullList(Apr 20 2025).json";
import { getFilteredMods } from "../Utils/FilterUtils";
import OptionPopup from "./OptionPopup";
import {
  getBestMatchIndex,
  getFinalModName,
  getManualUrl,
  ItemSelectEvent,
  ModInfo,
  parseAlternativeManualName,
  setDefaultManualUrl,
} from "../Utils/ModSearchUtils";

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

const modList = Array.from(fullModList.keys()).sort();
const maxListSize = 100;

const ModSearch = ({
  handleOpenMod,
  setIframeCovered,
  openManuals,
}: {
  handleOpenMod: (
    modName: string,
    manualurl: string,
    changeCurrent?: boolean
  ) => void;
  setIframeCovered: (bool: boolean) => void;
  openManuals: string[];
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, _setIsOpen] = useState<boolean>(false);
  const setIsOpen = useCallback(
    (status: boolean) => {
      _setIsOpen(status);
      setIframeCovered(status);
    },
    [setIframeCovered]
  );
  const [bestMatchIndex, setBestMatchIndex] = useState<number>(0);
  const [tryingToOpen, setTryingToOpen] = useState<ModInfo | null>(null);

  const highlightedRef = useRef<HTMLLIElement>(null);
  const modSearchComponentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredMods = getFilteredMods(modList, query);

  useOutsideClickTracker(isOpen, setIsOpen, modSearchComponentRef);

  const handleSearchInput = (newQuery: string) => {
    const newFilteredMods = getFilteredMods(modList, newQuery);
    setQuery(newQuery);
    setBestMatchIndex(getBestMatchIndex(newFilteredMods, newQuery));
  };

  const resetModSearch = () => {
    setQuery("");
    setIsOpen(false);
    setBestMatchIndex(0);
    highlightedRef.current = null;
  };

  // Keydown pressed while list opened
  const handleKeyPress = (e: ItemSelectEvent) => {
    if (!e.target) return;
    switch (e.key) {
      case "Escape": {
        resetModSearch();
        break;
      }
      case "Enter": {
        openMod(e);
        break;
      }
      case "ArrowDown": {
        if (
          bestMatchIndex + 1 < filteredMods.length &&
          bestMatchIndex + 1 < maxListSize
        )
          setBestMatchIndex(bestMatchIndex + 1);
        break;
      }
      case "ArrowUp": {
        if (bestMatchIndex > 0) setBestMatchIndex(bestMatchIndex - 1);
        break;
      }
    }
  };

  const openMod = (e: ItemSelectEvent) => {
    const htmlTarget = e.target as HTMLElement;
    const modName = htmlTarget.dataset.modName;
    const manualUrl = htmlTarget.dataset.manualUrl;
    if (modName && manualUrl) {
      if (openManuals.includes(modName)) {
        setTryingToOpen({ modName, manualUrl, changeCurrent: e && !e.ctrlKey });
      } else {
        handleOpenMod(modName, manualUrl, e && !e.ctrlKey);
      }
      resetModSearch();
    } else {
      console.error(`Could not open mod ${modName}`);
    }
  };

  const handleOpenOption = (replace: boolean) => {
    inputRef.current?.blur();
    if (tryingToOpen) {
      handleOpenMod(
        replace
          ? tryingToOpen.modName
          : getFinalModName(tryingToOpen.modName, openManuals),
        tryingToOpen.manualUrl,
        tryingToOpen.changeCurrent
      );
      setTryingToOpen(null);
      setTimeout(() => {
        // tiny timeout before refocus to prevent keydown inputs from becoming query
        inputRef.current?.focus();
      }, 10);
    }
  };

  return (
    <>
      <OptionPopup
        isOpen={tryingToOpen != null}
        popupMessage={`"${tryingToOpen?.modName}" is already open. What would you like to do?`}
        options={[
          { text: "Replace", callback: () => handleOpenOption(true) },
          { text: "Open Another", callback: () => handleOpenOption(false) },
        ]}
        closeCallback={() => setTryingToOpen(null)}
      />
      <div
        className="relative m-2 backdrop:backdrop-blur-3xl"
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) =>
          handleKeyPress({
            ...e,
            target: highlightedRef.current,
          })
        }
        ref={modSearchComponentRef}
      >
        <label
          htmlFor="mod-list-select"
          className="absolute left-0 ml-1 mt-0.5 cursor-pointer"
        >
          <Search size="20" />
        </label>
        <input
          type="text"
          name="mod-list-select"
          id="mod-list-select"
          className="bg-white pl-6 rounded-md w-48 pt-[0.2rem]"
          value={query}
          onChange={(e) => {
            setIsOpen(true);
            handleSearchInput(e.target.value);
          }}
          placeholder="Open New Manual"
          autoComplete="off"
          ref={inputRef}
        />
        {isOpen && (
          <div className="bg-gray-200 p-2 border-2 border-black absolute top-7 rounded-md z-1">
            <ul className="overflow-auto no-scrollbar max-h-[80vh]">
              {filteredMods.slice(0, maxListSize).map((modName, i) => (
                <SearchListItem
                  key={modName}
                  modName={modName}
                  onClick={openMod}
                  isHighlighted={i === bestMatchIndex}
                  highlightedRef={highlightedRef}
                />
              ))}
              {filteredMods.length === 0 && (
                <SearchListItem
                  key={0}
                  modName={"New Repo Tab"}
                  onClick={openMod}
                  isHighlighted={false}
                  highlightedRef={highlightedRef}
                />
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

const SearchListItem = ({
  modName,
  onClick,
  isHighlighted = false,
  highlightedRef,
}: {
  modName: string;
  onClick: (e: ItemSelectEvent) => void;
  isHighlighted?: boolean;
  highlightedRef?: Ref<HTMLLIElement>;
}) => {
  const [dropDownEnabled, setDropDownEnabled] = useState(false);
  const [manualUrl, setManualUrl] = useState(() => getManualUrl(modName));

  const handleDropDownClick = () => {
    setDropDownEnabled(!dropDownEnabled);
  };

  const handleDefaultManualChange = (manualUrl: string) => {
    setManualUrl(manualUrl);
    setDefaultManualUrl(modName, manualUrl);
  };

  const manualList: string[] = fullModList.get(modName) || [];

  return (
    <li
      className="cursor-pointer"
      data-mod-name={modName}
      data-manual-url={manualUrl}
      ref={isHighlighted && highlightedRef ? highlightedRef : null}
    >
      <div
        className={`flex justify-between  hover:bg-gray-400 ${
          isHighlighted ? "bg-blue-300" : ""
        }`}
      >
        <div
          onClick={onClick}
          data-mod-name={modName}
          data-manual-url={manualUrl}
          className={`flex justify-between grow whitespace-nowrap`}
        >
          {modName}
        </div>
        {manualList.length > 0 && (
          <ChevronDown
            onClick={handleDropDownClick}
            className={`${
              dropDownEnabled ? "rotate-180" : ""
            } hover:text-white`}
          />
        )}
      </div>
      {dropDownEnabled && (
        <ul>
          {manualList.map((manual) => (
            <AlternativeManualItem
              key={manual}
              modName={parseAlternativeManualName(manual)}
              manualUrl={manual}
              isDefault={manualUrl === manual}
              onClick={onClick}
              handleDefaultManualChange={handleDefaultManualChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const AlternativeManualItem = ({
  modName,
  manualUrl,
  isDefault,
  onClick,
  handleDefaultManualChange,
}: {
  modName: string;
  manualUrl: string;
  isDefault: boolean;
  onClick: (e: ItemSelectEvent) => void;
  handleDefaultManualChange: (newDefault: string) => void;
}) => {
  return (
    <li
      className="cursor-pointer mb-1"
      data-mod-name={modName}
      data-manual-url={manualUrl}
    >
      <div className={`flex justify-between  hover:bg-gray-300`}>
        <div
          onClick={onClick}
          data-mod-name={modName}
          data-manual-url={manualUrl}
          className="pl-4 flex justify-between grow whitespace-nowrap"
        >
          {parseAlternativeManualName(manualUrl)}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDefaultManualChange(manualUrl);
            }}
            className={`ml-4 cursor-pointer border-2 w-20 border-black text-center text-xs ${
              isDefault ? "text-green-700" : ""
            } hover:text-white hover:bg-gray-400`}
          >
            {isDefault ? "Default" : "Set Default"}
          </button>
        </div>
      </div>
    </li>
  );
};

export default ModSearch;
