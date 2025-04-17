import { Search } from "lucide-react";
import fullModList from "../fullList(Apr 13 2025).json";

const ModSearch = ({
  handleOpenMod,
}: {
  handleOpenMod: (modName: string) => void;
}) => {
  return (
    <div className="flex relative">
      <label
        htmlFor="mod-list-select"
        className="absolute left-0 ml-1 mt-0.5 cursor-pointer"
      >
        <Search size="20" />
      </label>
      <select
        name="mod-list-select"
        id="mod-list-select"
        className="bg-white ml-1 pl-6 rounded-md"
        onChange={(e) => handleOpenMod((e.target as HTMLSelectElement).value)}
      >
        {Object.keys(fullModList)
          .sort()
          .map((modName) => {
            return (
              <option key={modName} value={modName}>
                {modName}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default ModSearch;
