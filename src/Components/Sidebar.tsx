import { memo, useState } from "react";
import { CircleMinus } from "lucide-react";

const Sidebar = ({
  openModList,
  setCurrentMod,
  handleModClose,
}: {
  openModList: string[];
  setCurrentMod: (modName: string) => void;
  handleModClose: (modName: string) => void;
}) => {
  return (
    <div className="w-50 flex flex-col">
      <h2 className="text-xl">Open Mods</h2>
      <ul className="overflow-auto scroll no-scrollbar">
        {openModList.map((modName) => (
          <SidebarButton
            key={modName}
            modName={modName}
            setCurrentMod={setCurrentMod}
            handleModClose={handleModClose}
          />
        ))}
      </ul>
    </div>
  );
};

const SidebarButton = ({
  modName,
  setCurrentMod,
  handleModClose,
}: {
  modName: string;
  setCurrentMod: (modName: string) => void;
  handleModClose: (modName: string) => void;
}) => {
  const [completionStatus, setCompletionStatus] = useState<number>(0);
  const completionColors = ["bg-gray-300", "bg-yellow-300", "bg-green-300"];

  function handleCompletionStatusChange() {
    setCompletionStatus((completionStatus + 1) % completionColors.length);
  }

  return (
    <li className={`pt-0.5 max-w-48 flex cursor-pointer hover:bg-gray-200`}>
      <CircleMinus
        size={20}
        onClick={() => handleModClose(modName)}
        className="hover:text-red-500 self-end"
      />
      <button
        className="w-full text-left text-1 text-nowrap text-ellipsis overflow-hidden cursor-pointer"
        onClick={() => setCurrentMod(modName)}
      >
        {modName}
      </button>
      <div
        onClick={handleCompletionStatusChange}
        className={`w-3 ${completionColors[completionStatus]} hover:border-black border-transparent border-1`}
      ></div>
    </li>
  );
};

export default memo(Sidebar);
