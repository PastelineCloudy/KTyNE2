import Sidebar from "./Sidebar";
import { useCallback, useEffect, useState } from "react";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import Header from "./Header";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getLocalStorageMap } from "../Utils/LocalStorageUtils";
import { OpenManual } from "../Utils/Types";

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, OpenManual>>(() =>
    getLocalStorageMap<OpenManual>("KTyNE:openManuals")
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

      const newManualList = new Map<string, OpenManual>(openManuals);
      if (newManualList.delete(modToClose)) {
        setOpenManuals(newManualList);
      }
    },
    [openManuals]
  );

  const closeAllMods = () => {
    setCurrentManual(null);
    setOpenManuals(new Map<string, OpenManual>());
  };

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
    const modLimit = 250;
    const modsOpen = openManuals.size;
    if (modsOpen >= modLimit) {
      const lastVal = openManuals.keys().next().value;
      let warnMessage = "Mod limit reached.";

      if (lastVal) {
        if (currentManual === lastVal) setCurrentManual(null);
        if (openManuals.delete(lastVal))
          warnMessage += ` Closing oldest mod (${lastVal})`;
      }
      console.warn(warnMessage);
    }
    const newOpenManuals = new Map<string, OpenManual>(openManuals).set(
      modName,
      {
        id: String(crypto.randomUUID()),
        manualUrl: manualUrl,
      }
    );
    if (changeCurrent) setCurrentManual(modName);
    setOpenManuals(newOpenManuals);
  };

  return (
    <div className="h-[100vh] flex flex-col font-[special-elite] relative overflow-hidden">
      <Header
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
        openManuals={Array.from(openManuals.keys())}
      />
      <main className="flex h-[calc(100vh-75px)] bg-(--color-bg)">
        <Sidebar
          openModList={Array.from(openManuals.keys()).sort()}
          currentManual={currentManual}
          handleModChange={memoizedHandleModChange}
          handleModClose={memoizedHandleModClose}
          closeAllMods={closeAllMods}
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
          <Panel minSize={1} maxSize={95}>
            <Notepad />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default App;
