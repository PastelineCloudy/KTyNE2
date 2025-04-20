import Sidebar from "./Sidebar";
import { useCallback, useEffect, useState } from "react";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import Header from "./Header";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getLocalStorageMap } from "../Utils/LocalStorageUtils";

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, string>>(() =>
    getLocalStorageMap("KTyNE:openManuals")
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

  const handleOpenMod = (
    modName: string,
    manualUrl: string,
    changeCurrent: boolean = true
  ) => {
    const finalModName = getFinalModName(
      modName,
      Array.from(openManuals.keys())
    );
    if (Object.entries(openManuals).length >= 500) {
      console.warn("Mod limit reached");
      return;
    }
    const newOpenManuals = new Map<string, string>(openManuals).set(
      finalModName,
      manualUrl
    );
    if (changeCurrent) setCurrentManual(finalModName);
    setOpenManuals(newOpenManuals);
  };

  return (
    <div className="h-[100vh] flex flex-col font-[special-elite] relative overflow-hidden">
      <Header
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
      />
      <main className="flex h-[calc(100vh-75px)] bg-(--color-bg)">
        <Sidebar
          openModList={Array.from(openManuals.keys()).sort()}
          currentManual={currentManual}
          handleModChange={memoizedHandleModChange}
          handleModClose={memoizedHandleModClose}
          setOpenManuals={setOpenManuals}
        />
        <PanelGroup direction="horizontal" autoSaveId="main-ktyne">
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

export default App;
