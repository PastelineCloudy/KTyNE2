import { ReactNode, useState } from "react";
import ModSearch from "./ModSearch";
import Popups from "./Popups";

const Header = ({
  modList,
  handleOpenMod,
}: {
  modList: string[];
  handleOpenMod: (modName: string, changeCurrent?: boolean) => void;
}) => {
  const [edgework, setEdgework] = useState<ReactNode>(null);
  return (
    <header className="min-h-[75px] bg-jet flex items-center">
      <ModSearch modList={modList} handleOpenMod={handleOpenMod} />
      <Popups setEdgework={setEdgework} />
      <div className="ml-auto flex content-center flex-wrap">{edgework}</div>
    </header>
  );
};

export default Header;
