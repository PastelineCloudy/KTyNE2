import { ChevronDown, Search } from "lucide-react";
import {
  KeyboardEvent,
  memo,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import useOutsideClickTracker from "../Hooks/useOutsideClickTracker";
import OptionPopup from "./OptionPopup";
import {
  getBestMatchIndex,
  getFinalModName,
  ModInfo,
  parseAlternativeManualName,
  setDefaultManualUrl,
  getFullModListKeys,
  getAlternateManualList,
  getFilteredMods,
  getManualUrl,
} from "../Utils/ModSearchUtils";

const modList = getFullModListKeys().sort();
const maxListSize = 100;

const ModSearch = ({
  handleOpenMod,
  setIframeCovered,
  openManuals,
}: {
  handleOpenMod: (
    modName: string,
    manualUrl: string,
    preventChange?: boolean
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
  const [altManualSelection, setAltManualSelection] = useState<string | null>(
    null
  );
  const [differentFromDefault, setDifferentFromDefault] =
    useState<ModInfo | null>(null);

  const modSearchComponentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredMods = getFilteredMods(modList, query);

  useOutsideClickTracker(isOpen, setIsOpen, modSearchComponentRef);

  const handleSearchInput = (newQuery: string) => {
    const newFilteredMods = getFilteredMods(modList, newQuery) || [];
    setQuery(newQuery);
    setBestMatchIndex(getBestMatchIndex(newFilteredMods, newQuery));
  };

  const resetModSearch = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    setBestMatchIndex(0);
    setTimeout(() => {
      // tiny timeout prevent shortcut key inputs from becoming query
      inputRef.current?.focus();
    }, 10);
  }, [setIsOpen]);

  const openMod = useCallback(
    (modInfo: ModInfo, force: boolean = false) => {
      inputRef.current?.blur();
      if (!force && openManuals.includes(modInfo.modName)) {
        setTryingToOpen(modInfo);
      } else {
        handleOpenMod(modInfo.modName, modInfo.manualUrl);
      }
      resetModSearch();
    },
    [handleOpenMod, openManuals, resetModSearch]
  );

  const handleSearchListItemClick = useCallback(
    (e: MouseEvent) => {
      if (!e || !e.target) return;
      const htmlTarget = e.target as HTMLElement;
      const modName = htmlTarget.dataset.modName;
      const manualUrl = htmlTarget.dataset.manualUrl;
      if (modName && manualUrl) openMod({ modName, manualUrl });
    },
    [openMod]
  );

  // Keydown pressed while list opened
  const handleKeyPress = (e: KeyboardEvent | KeyboardEvent<HTMLDivElement>) => {
    if (!e.target) return;
    switch (e.key) {
      case "Escape": {
        resetModSearch();
        break;
      }
      case "Enter": {
        const modName = filteredMods
          ? filteredMods[bestMatchIndex]
          : "New Repo Tab";
        const manualUrl = getManualUrl(modName);
        openMod({ modName, manualUrl });
        break;
      }
      case "ArrowDown": {
        if (
          bestMatchIndex + 1 < (filteredMods?.length || 0) &&
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

  return (
    <div className="z-3">
      <div
        className="relative m-2 ml-0 backdrop:backdrop-blur-3xl"
        onKeyDown={handleKeyPress}
        ref={modSearchComponentRef}
      >
        <label
          htmlFor="mod-list-select"
          className="absolute left-0 ml-0.5 mt-0.5 cursor-pointer"
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
          onClick={() => setIsOpen(true)}
          placeholder="Open New Manual"
          autoComplete="off"
          ref={inputRef}
        />
        {isOpen && (
          <div className="bg-gray-200 p-2 border-2 border-black absolute top-7 rounded-md z-1">
            <ul className="overflow-auto no-scrollbar max-h-[80vh]">
              {filteredMods && filteredMods.length > 0 ? (
                filteredMods
                  .slice(0, maxListSize)
                  .map((modName, i) => (
                    <SearchListItem
                      key={modName}
                      modName={modName}
                      onClick={handleSearchListItemClick}
                      isHighlighted={i === bestMatchIndex}
                      setAltManualSelection={setAltManualSelection}
                    />
                  ))
              ) : (
                <SearchListItem
                  key={0}
                  modName={"New Repo Tab"}
                  onClick={() =>
                    openMod({
                      modName: "New Repo Tab",
                      manualUrl: "https://ktane.timwi.de/",
                    })
                  }
                  isHighlighted={false}
                />
              )}
            </ul>
          </div>
        )}
        {altManualSelection && altManualSelection != "" && (
          <OptionPopup
            isOpen={altManualSelection != "" && altManualSelection != ""}
            popupMessage={`Alternate Manuals for ${altManualSelection}`}
            closeCallback={() => {
              setAltManualSelection(null);
            }}
            options={getAlternateManualList(altManualSelection).map(
              (altManual) => {
                const currentDefault = getManualUrl(altManualSelection);
                return {
                  text: parseAlternativeManualName(altManual),
                  callback: () => {
                    if (altManual === currentDefault) {
                      openMod({
                        modName: altManualSelection,
                        manualUrl: altManual,
                      });
                    } else {
                      setDifferentFromDefault({
                        modName: altManualSelection,
                        manualUrl: altManual,
                      });
                    }
                  },
                  className:
                    altManual === currentDefault ? "!text-green-500" : "",
                };
              }
            )}
            optionShortcuts={false}
            listStyle
          />
        )}
        {differentFromDefault && differentFromDefault.manualUrl && (
          <OptionPopup
            isOpen={differentFromDefault != null}
            popupMessage={`This is different from your default manual. What would you like to do?`}
            closeCallback={() => {
              setDifferentFromDefault(null);
            }}
            options={[
              {
                text: "Open",
                callback: () => {
                  openMod(differentFromDefault);
                },
              },
              {
                text: "Set As Default",
                callback: () => {
                  if (differentFromDefault.manualUrl)
                    setDefaultManualUrl(
                      differentFromDefault.modName,
                      differentFromDefault.manualUrl
                    );
                },
              },
              {
                text: "Both",
                callback: () => {
                  if (differentFromDefault.manualUrl)
                    setDefaultManualUrl(
                      differentFromDefault.modName,
                      differentFromDefault.manualUrl
                    );
                  openMod(differentFromDefault);
                },
              },
            ]}
          />
        )}
      </div>
      {tryingToOpen && (
        <OptionPopup
          isOpen={tryingToOpen != null}
          popupMessage={`"${tryingToOpen?.modName}" is already open. What would you like to do?`}
          options={[
            {
              text: "Replace",
              callback: () => {
                if (tryingToOpen) openMod(tryingToOpen, true);
              },
            },
            {
              text: "Open Another",
              callback: () => {
                if (tryingToOpen)
                  openMod({
                    ...tryingToOpen,
                    modName: getFinalModName(tryingToOpen.modName, openManuals),
                  });
              },
            },
          ]}
          closeCallback={() => {
            setTryingToOpen(null);
          }}
        />
      )}
    </div>
  );
};

const SearchListItem = memo(
  ({
    modName,
    onClick,
    isHighlighted = false,
    setAltManualSelection,
  }: {
    modName: string;
    onClick: (e: MouseEvent) => void;
    isHighlighted?: boolean;
    setAltManualSelection?: (val: string) => void;
  }) => {
    const manualList: string[] = getAlternateManualList(modName);

    return (
      <li className="cursor-pointer">
        <div
          className={`flex justify-between  hover:bg-gray-400 ${
            isHighlighted ? "bg-blue-300" : ""
          }`}
        >
          <div
            onClick={onClick}
            data-mod-name={modName}
            data-manual-url={getManualUrl(modName)}
            className={`flex justify-between grow whitespace-nowrap`}
          >
            {modName}
          </div>
          {manualList.length > 1 && (
            <ChevronDown
              onClick={() => {
                if (setAltManualSelection) setAltManualSelection(modName);
              }}
              className="hover:text-white"
            />
          )}
        </div>
      </li>
    );
  }
);

export default ModSearch;
