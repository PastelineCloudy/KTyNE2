import { ChevronDown, Search } from "lucide-react";
import { Ref, useRef, useState } from "react";
import useOutsideClickTracker from "../Hooks/useOutsideClickTracker";
import { getLocalStorageMap } from "../Utils/LocalStorageUtils";
import fullModListRaw from "../fullList(Apr 13 2025).json";

type ItemSelectEvent = {
  key?: string;
  target: EventTarget | Element | null;
  ctrlKey: boolean;
  preventDefault: () => void;
};

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

const modList = Array.from(fullModList.keys()).sort();
const maxListSize = 100;

const ModSearch = ({
  handleOpenMod,
  setIframeCovered,
}: {
  handleOpenMod: (
    modName: string,
    manualurl: string,
    changeCurrent?: boolean
  ) => void;
  setIframeCovered: (bool: boolean) => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, _setIsOpen] = useState<boolean>(false);
  const [bestMatchIndex, setBestMatchIndex] = useState<number>(0);
  const highlightedRef = useRef<HTMLLIElement>(null);

  const filteredMods = getFilteredMods(modList, query);

  const handleSearchInput = (newQuery: string) => {
    const newFilteredMods = getFilteredMods(modList, newQuery);
    setQuery(newQuery);
    setBestMatchIndex(getBestMatchIndex(newFilteredMods, newQuery));
  };

  const setIsOpen = (status: boolean) => {
    _setIsOpen(status);
    setIframeCovered(status);
  };

  const resetModSearch = () => {
    setQuery("");
    setIsOpen(false);
    setBestMatchIndex(0);
    highlightedRef.current = null;
  };

  const modSearchComponentRef = useRef(null);
  useOutsideClickTracker(isOpen, setIsOpen, modSearchComponentRef);

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
      handleOpenMod(modName, manualUrl, e && !e.ctrlKey);
      resetModSearch();
    } else {
      console.error(`Could not open mod ${modName}`);
    }
  };

  return (
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
        placeholder="Search Modules"
        autoComplete="off"
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
          </ul>
        </div>
      )}
    </div>
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
        <ChevronDown
          onClick={handleDropDownClick}
          className={`${dropDownEnabled ? "rotate-180" : ""} hover:text-white`}
        />
      </div>
      {dropDownEnabled && (
        <ul className="">
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
      className="cursor-pointer"
      data-mod-name={modName}
      data-manual-url={manualUrl}
    >
      <div className={`flex justify-between  hover:bg-gray-400`}>
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
            className={`ml-4 cursor-pointer border-2 border-black text-center text-xs ${
              isDefault ? "opacity-0" : ""
            } hover:text-white`}
          >
            Set Default
          </button>
        </div>
      </div>
    </li>
  );
};

const setDefaultManualUrl = (modName: string, manualUrl: string) => {
  const defaultManuals = getLocalStorageMap("KTyNE:defaultManuals");
  defaultManuals.set(modName, manualUrl);
  localStorage.setItem(
    "KTyNE:defaultManuals",
    JSON.stringify(Object.fromEntries(defaultManuals))
  );
};

const getDefaulManualUrl = (modName: string): string | undefined => {
  const defaultManuals = getLocalStorageMap("KTyNE:defaultManuals");
  return defaultManuals.get(modName);
};

const getManualUrl = (modName: string): string => {
  const defaultManual = getDefaulManualUrl(modName);
  if (defaultManual) return defaultManual;

  const mapEntry = fullModList.get(modName);
  if (mapEntry) return mapEntry[0];

  return "https://ktane.timwi.de/";
};

const parseAlternativeManualName = (text: string) => {
  const URL_PREFIX = "https://ktane.timwi.de/HTML/";
  if (!text.includes(URL_PREFIX)) return text;
  return decodeURIComponent(text).replace(URL_PREFIX, "").replace(".html", "");
};

const getFilteredMods = (list: string[], queryTerm: string) => {
  return list.filter((mod) =>
    mod.toLowerCase().includes(queryTerm.toLowerCase())
  );
};

const getBestMatchIndex = (list: string[], queryTerm: string) => {
  const lowerCaseList = list.map((item) => item.toLowerCase());
  const query = queryTerm.toLowerCase().trim();

  if (lowerCaseList.includes(query)) return lowerCaseList.indexOf(query);
  const startsWithQuery = lowerCaseList.find((item) => item.startsWith(query));
  if (startsWithQuery) return lowerCaseList.indexOf(startsWithQuery);
  return 0;
};

export default ModSearch;
