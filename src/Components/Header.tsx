import { ReactNode, useState } from "react";
import ModSearch from "./ModSearch";
import Popups from "./Popups";

const Header = ({
  modList,
  handleOpenMod,
  setIframeCovered,
}: {
  modList: string[];
  handleOpenMod: (modName: string, changeCurrent?: boolean) => void;
  setIframeCovered: (bool: boolean) => void;
}) => {
  const [edgework, setEdgework] = useState<ReactNode>(null);
  return (
    <header className="min-h-[75px] bg-jet flex items-center">
      <ModSearch
        modList={modList}
        handleOpenMod={handleOpenMod}
        setIframeCovered={setIframeCovered}
      />
      <Popups setEdgework={setEdgework} />
      <div className="ml-auto flex content-center flex-wrap">{edgework}</div>
    </header>
  );
};

export default Header;
