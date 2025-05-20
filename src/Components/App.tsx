import Sidebar from "./Sidebar";
import { useCallback, useEffect, useState } from "react";
import Manuals from "./Manuals";
import Notepad from "./Notepad";
import Header from "./Header";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getLocalStorageMap } from "../Utils/LocalStorageUtils";
import { OpenManual } from "../Utils/Types";
import { getManualUrl } from "../Utils/ModSearchUtils";

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Next 2 lines are for legacy methods (Better browser support)
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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

  const closeAllManuals = () => {
    setCurrentManual(null);
    setOpenManuals(new Map<string, OpenManual>());
  };

  const resetAllManuals = () => {
    setCurrentManual(null);
    const newOpenManuals = new Map<string, OpenManual>();
    openManuals.forEach((value, key) => {
      newOpenManuals.set(key, {
        id: String(crypto.randomUUID()),
        manualUrl: value.manualUrl,
      });
    });
    setCurrentManual(null);
    setOpenManuals(newOpenManuals);
  };

  const memoizedHandleModChange = useCallback(
    (modName: string, isCurrent: boolean): void => {
      if (isCurrent) setCurrentManual(null);
      else setCurrentManual(modName);
    },
    []
  );

  const handleOpenMod = useCallback(
    (modName: string, manualUrl: string, preventChange: boolean = false) => {
      if (!manualUrl) manualUrl = getManualUrl(modName);
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
      if (!preventChange) setCurrentManual(modName);
      setOpenManuals(newOpenManuals);
    },
    [currentManual, openManuals]
  );

  return (
    <div className="h-screen flex flex-col font-[special-elite] relative overflow-hidden no-scrollbar">
      <Header setIframeCovered={setIframeCovered} />
      <main className="flex-1 flex bg-(--color-bg) overflow-hidden">
        <Sidebar
          handleOpenMod={handleOpenMod}
          setIframeCovered={setIframeCovered}
          openManuals={Array.from(openManuals.keys())}
          currentManual={currentManual}
          handleModChange={memoizedHandleModChange}
          handleModClose={memoizedHandleModClose}
          closeAllManuals={closeAllManuals}
          resetAllManuals={resetAllManuals}
        />
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={55}
            className="border-l-2 border-r-2 border-black"
            id="manual-window"
          >
            <Manuals
              currentManual={currentManual}
              openManuals={openManuals}
              covered={iframeCovered}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel collapsible minSize={5} maxSize={95} id="notepad-window">
            <Notepad />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default App;
