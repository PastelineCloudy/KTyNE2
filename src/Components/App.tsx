import Sidebar from "./Sidebar";
import { ReactNode, useCallback, useEffect, useState } from "react";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getLocalStorageMap } from "../Utils/LocalStorageUtils";
import { OpenManual } from "../Utils/Types";
import ModSearch from "./ModSearch";
import Popups from "./Popups";

function App() {
  const [currentManual, setCurrentManual] = useState<string | null>(null);
  const [openManuals, setOpenManuals] = useState<Map<string, OpenManual>>(() =>
    getLocalStorageMap<OpenManual>("KTyNE:openManuals")
  );
  const [iframeCovered, setIframeCovered] = useState<boolean>(false);
  const [edgework, setEdgework] = useState<ReactNode>(null);

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

  const resetBomb = () => {
    const newOpenManuals = new Map<string, OpenManual>();
    openManuals.forEach((value, key) => {
      newOpenManuals.set(key, {
        id: String(crypto.randomUUID()),
        manualUrl: value.manualUrl,
      });
    });
    setCurrentManual(null);
    setOpenManuals(newOpenManuals);
    setEdgework(null);
  };

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
      <header className="min-h-[85px] bg-jet flex items-center p-2">
        <ModSearch
          handleOpenMod={handleOpenMod}
          setIframeCovered={setIframeCovered}
          openManuals={Array.from(openManuals.keys())}
        />
        <Popups setEdgework={setEdgework} setIframeCovered={setIframeCovered} />
        <div className="ml-auto flex content-center flex-wrap">{edgework}</div>
      </header>
      <main className="flex h-[calc(100vh-75px)] bg-(--color-bg)">
        <Sidebar
          openModList={Array.from(openManuals.keys()).sort()}
          currentManual={currentManual}
          handleModChange={memoizedHandleModChange}
          handleModClose={memoizedHandleModClose}
          closeAllMods={closeAllMods}
          resetBomb={resetBomb}
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
