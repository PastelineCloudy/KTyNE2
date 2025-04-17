import Sidebar from "./Sidebar";
import fullModListRaw from "../fullList(Apr 13 2025).json";
import { useCallback, useState } from "react";
import ModSearch from "./ModSearch";
import Manuals from "./Manuals";

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, string>>(
    new Map<string, string>()
  );

  const memoizedHandleModClose = useCallback(
    (modToClose: string, isCurrent: boolean) => {
      if (isCurrent) {
        setCurrentManual(null);
      }

      const newManualList = new Map<string, string>(openManuals);
      if (newManualList.delete(modToClose)) {
        setOpenManuals(newManualList);
      }
    },
    [openManuals]
  );

  const memoizedHandleModChange = useCallback(
    (modName: string, isCurrent: boolean): void => {
      if (isCurrent) setCurrentManual(null);
      else setCurrentManual(modName);
    },
    []
  );

  const handleOpenMod = (modName: string) => {
    const modManual = getModManual(modName);
    if (!modManual) return;

    const finalModName = getFinalModName(
      modName,
      Array.from(openManuals.keys())
    );
    setCurrentManual(finalModName);
    setOpenManuals(
      new Map<string, string>(openManuals).set(finalModName, modManual)
    );
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        <header className="h-[60px] bg-jet">
          <ModSearch handleOpenMod={handleOpenMod} />
        </header>
        <main className="flex h-[calc(100vh-60px)]">
          <Sidebar
            openModList={Array.from(openManuals.keys()).sort()}
            currentManual={currentManual}
            handleModChange={memoizedHandleModChange}
            handleModClose={memoizedHandleModClose}
          />
          <Manuals currentManual={currentManual} openManuals={openManuals} />
          <div className="w-[600px] bg-amber-400">Notepad</div>
        </main>
      </div>
    </>
  );
}

const getFinalModName = (modName: string, openModList: string[]): string => {
  if (!openModList.includes(modName)) return modName;

  let firstAvailableNumber = 2;
  while (openModList.includes(`${modName} (${firstAvailableNumber})`))
    firstAvailableNumber++;

  return `${modName} (${firstAvailableNumber})`;
};

function getModManual(modName: string): string | null {
  const mod = fullModList.get(modName);
  if (mod) return mod[0];
  else return null;
}

export default App;
