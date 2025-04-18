import Sidebar from "./Sidebar";
import fullModListRaw from "../fullList(Apr 13 2025).json";
import { ReactNode, useCallback, useState } from "react";
import ModSearch from "./ModSearch";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import EdgeworkModal from "./EdgeworkModal";
import EdgeworkButton from "./EdgeworkButton";
import Calculator from "./Calculator";
import HeaderButton from "./HeaderButton";

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [edgework, setEdgework] = useState<ReactNode>(null);
  const [edgeworkModalIsOpen, setEdgeworkModalIsOpen] =
    useState<boolean>(false);

  const [calcIsOpen, setCalcIsOpen] = useState<boolean>(false);

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

  const handleOpenMod = (modName: string, changeCurrent: boolean = true) => {
    const modManual = getModManual(modName);
    if (!modManual) return;

    const finalModName = getFinalModName(
      modName,
      Array.from(openManuals.keys())
    );
    if (changeCurrent) setCurrentManual(finalModName);
    setOpenManuals(
      new Map<string, string>(openManuals).set(finalModName, modManual)
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col font-[special-elite]">
      <header className="min-h-[75px] bg-jet flex items-center">
        <ModSearch
          modNames={Object.keys(fullModList).sort()}
          handleOpenMod={handleOpenMod}
        />
        <div className="flex gap-2">
          <HeaderButton
            text="Edgework"
            onClick={() => setEdgeworkModalIsOpen(true)}
          />
          <HeaderButton
            text="Calculator"
            onClick={() => setCalcIsOpen(!calcIsOpen)}
          />
        </div>
        <div className="ml-auto flex content-center flex-wrap">
          {edgework}
          <EdgeworkModal
            edgeworkModalIsOpen={edgeworkModalIsOpen}
            setEdgeworkModalIsOpen={setEdgeworkModalIsOpen}
            setEdgework={setEdgework}
          />
        </div>
      </header>
      <main className="flex h-[calc(100vh-60px)] bg-(--color-bg) relative">
        <Sidebar
          openModList={Array.from(openManuals.keys()).sort()}
          currentManual={currentManual}
          handleModChange={memoizedHandleModChange}
          handleModClose={memoizedHandleModClose}
        />
        <Manuals currentManual={currentManual} openManuals={openManuals} />
        <Notepad />
      </main>

      {calcIsOpen && <Calculator />}
    </div>
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
