import Sidebar from "./Sidebar";
import fullModListRaw from "../fullList(Apr 13 2025).json";
import { useCallback, useEffect, useState } from "react";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import Header from "./Header";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

const modList = Array.from(fullModList.keys()).sort();

const getOpenManualsFromLocal = () => {
  const localOpenManuals = localStorage.getItem("KTyNE:openManuals");
  const localOpenManualsObj = JSON.parse(localOpenManuals ?? "{}");
  if (localOpenManuals && Object.keys(localOpenManualsObj).length !== 0) {
    return new Map<string, string>(Object.entries(localOpenManualsObj));
  } else {
    return new Map<string, string>();
  }
};

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, string>>(
    getOpenManualsFromLocal()
  );
  const [iframeCovered, setIframeCovered] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(
      "KTyNE:openManuals",
      JSON.stringify(Object.fromEntries(openManuals))
    );
  }, [openManuals]);

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
    const newOpenManuals = new Map<string, string>(openManuals).set(
      finalModName,
      modManual
    );
    setOpenManuals(newOpenManuals);
  };

  return (
    <div className="h-screen w-screen flex flex-col font-[special-elite] relative overflow-hidden">
      <Header
        modList={modList}
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
      />
      <main className="flex h-[calc(100vh-60px)] bg-(--color-bg)">
        <PanelGroup direction="horizontal" autoSaveId="main-ktyne">
          <Panel minSize={5} maxSize={11} collapsible>
            <Sidebar
              openModList={Array.from(openManuals.keys()).sort()}
              currentManual={currentManual}
              handleModChange={memoizedHandleModChange}
              handleModClose={memoizedHandleModClose}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel
            defaultSize={55}
            className="border-l-2 border-r-2 border-black"
          >
            <Manuals
              currentManual={currentManual}
              openManuals={openManuals}
              covered={iframeCovered}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel>
            <Notepad />
          </Panel>
        </PanelGroup>
      </main>
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
