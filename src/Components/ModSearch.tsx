import { Search } from "lucide-react";
import { useState } from "react";

const ModSearch = ({
  modNames,
  handleOpenMod,
}: {
  modNames: string[];
  handleOpenMod: (modName: string, changeCurrent?: boolean) => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bestMatchIndex, setBestMatchIndex] = useState<number>(0);
  const [filteredMods, setFilteredMods] = useState<string[]>(modNames);

  let lastHovered: string = "";

  const handleSearchInput = (newQuery: string) => {
    const newFilteredMods = getFilteredMods(modNames, newQuery);
    setQuery(newQuery);
    setBestMatchIndex(getBestMatchIndex(newFilteredMods, newQuery));
    setFilteredMods(newFilteredMods);
  };

  const handleKeyDown = (e: {
    key: string;
    shiftKey: boolean;
    ctrlKey: boolean;
  }) => {
    switch (e.key) {
      case "Escape": {
        setQuery("");
        setIsOpen(false);
        break;
      }
      case "Enter": {
        handleOpenMod(filteredMods[bestMatchIndex], !e.ctrlKey);
        setQuery("");
        if (!e.shiftKey) setIsOpen(false);
        break;
      }
      case "ArrowDown": {
        if (bestMatchIndex < filteredMods.length - 1)
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
    <div
      className="relative w-48 m-2"
      onFocus={() => setIsOpen(true)}
      onBlur={() => {
        if (lastHovered) {
          handleOpenMod(lastHovered);
          setQuery("");
          setBestMatchIndex(0);
        }
        setIsOpen(false);
      }}
      onKeyDown={(e) => handleKeyDown(e)}
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
        placeholder="Search Mods"
        autoComplete="off"
      />
      {isOpen && (
        <div className="bg-gray-200 p-2 border-2 border-black absolute top-7 rounded-md w-full ">
          <ul className="overflow-auto no-scrollbar max-h-[80vh] ">
            {filteredMods.map((mod) => {
              return (
                <li
                  key={mod}
                  className={`hover:bg-gray-400 ${
                    mod === filteredMods[bestMatchIndex] ? "bg-blue-300" : ""
                  } cursor-pointer`}
                  // lastHovered used because parent onBlur fires before child onClick
                  onMouseOver={() => (lastHovered = mod)}
                  onMouseOut={() => (lastHovered = "")}
                >
                  {mod}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
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
