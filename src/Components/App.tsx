import Sidebar from "./Sidebar";
import fullModList from "../fullList(Apr 13 2025).json";
import { useCallback, useState } from "react";

const fakeOpenModList = Object.keys(fullModList).slice(10, 160);

function App() {
  const [currentMod, setCurrentMod] = useState<string | null>(null);
  const [openModList, setOpenModList] = useState<string[]>(fakeOpenModList);

  const memorizeHandleModClose = useCallback(
    (modToClose: string) => {
      setOpenModList([...openModList.filter((mod) => mod !== modToClose)]);
      console.log("mod close", modToClose);
    },
    [openModList]
  );

  return (
    <>
      <div className="h-screen flex flex-col">
        <header className="h-[60px] bg-jet">Header</header>
        <main className="flex h-[calc(100vh-60px)]">
          <Sidebar
            openModList={openModList}
            setCurrentMod={setCurrentMod}
            handleModClose={memorizeHandleModClose}
          />

          <div className="grow bg-amber-300">{currentMod}</div>
          <div className="w-[600px] bg-amber-400">Notepad</div>
        </main>
      </div>
    </>
  );
}

export default App;
