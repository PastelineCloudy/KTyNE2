import { Search } from "lucide-react";
import { Ref, useCallback, useRef, useState } from "react";
import useOutsideClickTracker from "../Hooks/useOutsideClickTracker";

type ItemSelectEvent = {
  key?: string;
  target: EventTarget | Element | null;
  shiftKey: boolean;
  ctrlKey: boolean;
  preventDefault: () => void;
};

const ModSearch = ({
  modList,
  handleOpenMod,
  setIframeCovered,
}: {
  modList: string[];
  handleOpenMod: (modName: string, changeCurrent?: boolean) => void;
  setIframeCovered: (bool: boolean) => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, _setIsOpen] = useState<boolean>(false);
  const [bestMatchIndex, setBestMatchIndex] = useState<number>(0);
  const highlightedRef = useRef<HTMLLIElement>(null);

  const getFilteredModsCallback = useCallback(
    () => getFilteredMods(modList, query),
    [query, modList]
  );
  const filteredMods = getFilteredModsCallback();

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

  const handleKeyPress = (e: ItemSelectEvent) => {
    if (!e.target) return;
    const htmlTarget = e.target as HTMLElement;
    const modName = htmlTarget.dataset.modName;
    switch (e.key) {
      case "Escape": {
        setQuery("");
        setIsOpen(false);
        break;
      }
      case "Enter": {
        if (modName) openMod(modName, e);
        break;
      }
      case "ArrowDown": {
        if (highlightedRef.current)
          highlightedRef.current.scrollIntoView({
            block: "center",
          });
        if (bestMatchIndex < filteredMods.length - 1)
          setBestMatchIndex(bestMatchIndex + 1);
        break;
      }
      case "ArrowUp": {
        if (highlightedRef.current)
          highlightedRef.current.scrollIntoView({
            block: "center",
          });
        if (bestMatchIndex > 0) setBestMatchIndex(bestMatchIndex - 1);
        break;
      }
    }
  };

  const openMod = (modName: string, e?: ItemSelectEvent) => {
    handleOpenMod(modName, e ? !e.ctrlKey : false);
    if (!e || !e.shiftKey) resetModSearch();
  };

  // Keydown pressed while list opened
  const handleItemSelect = (e: ItemSelectEvent) => {
    const htmlTarget = e.target as HTMLElement;
    const modName = htmlTarget.dataset.modName;

    if (e.key) {
      switch (e.key) {
        case "Escape": {
          setQuery("");
          setIsOpen(false);
          break;
        }
        case "Enter": {
          if (modName) openMod(modName, e);
          break;
        }
        case "ArrowDown": {
          if (highlightedRef.current)
            highlightedRef.current.scrollIntoView(false);
          if (bestMatchIndex < filteredMods.length - 1)
            setBestMatchIndex(bestMatchIndex + 1);
          break;
        }
        case "ArrowUp": {
          if (highlightedRef.current)
            highlightedRef.current.scrollIntoView(false);
          if (bestMatchIndex > 0) setBestMatchIndex(bestMatchIndex - 1);
          break;
        }
      }
    } else {
      if (modName) {
        openMod(modName, e);
      } else {
        console.error(`Could not open mod ${modName}`);
      }
    }
  };

  return (
    <div
      className="relative w-48 m-2 backdrop:backdrop-blur-3xl"
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
        className="bg-white pl-6 rounded-md w-full pt-[0.2rem]"
        value={query}
        onChange={(e) => {
          setIsOpen(true);
          handleSearchInput(e.target.value);
        }}
        placeholder="Search Modules"
        autoComplete="off"
      />
      {isOpen && (
        <div className="bg-gray-200 p-2 border-2 border-black absolute top-7 rounded-md w-full ">
          {/* 40vh used for scrollInto */}
          <ul className="overflow-auto no-scrollbar max-h-[40vh] ">
            {filteredMods.slice(0, 100).map((modName, i) => (
              <SearchListItem
                key={modName}
                modName={modName}
                isHighlighted={i === bestMatchIndex}
                handleItemSelect={handleItemSelect}
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
  isHighlighted,
  handleItemSelect,
  highlightedRef,
}: {
  modName: string;
  isHighlighted: boolean;
  handleItemSelect: (e: ItemSelectEvent) => void;
  highlightedRef: Ref<HTMLLIElement>;
}) => {
  return (
    <li
      className={`hover:bg-gray-400 cursor-pointer ${
        isHighlighted ? "bg-blue-300" : ""
      }`}
      onClick={handleItemSelect}
      data-mod-name={modName}
      ref={isHighlighted ? highlightedRef : null}
    >
      <div className="flex justify-between" data-mod-name={modName}>
        {modName}
      </div>
    </li>
  );
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
