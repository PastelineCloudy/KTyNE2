import { ReactNode, useState } from "react";
import ModSearch from "./ModSearch";
import Popups from "./Popups";

const Header = ({
  handleOpenMod,
  setIframeCovered,
  openManuals,
}: {
  handleOpenMod: (
    modName: string,
    manualUrl: string,
    changeCurrent?: boolean
  ) => void;
  setIframeCovered: (bool: boolean) => void;
  openManuals: string[];
}) => {
  const [edgework, setEdgework] = useState<ReactNode>(null);
  return (
    <header className="min-h-[85px] bg-jet flex items-center p-2">
      <ModSearch
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
        openManuals={openManuals}
      />
      <Popups setEdgework={setEdgework} setIframeCovered={setIframeCovered} />
      <div className="ml-auto flex content-center flex-wrap">{edgework}</div>
    </header>
  );
};

export default Header;
