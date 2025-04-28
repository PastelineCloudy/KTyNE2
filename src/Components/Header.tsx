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
    preventChange?: boolean
  ) => void;
  setIframeCovered: (bool: boolean) => void;
  openManuals: string[];
}) => {
  const [edgework, setEdgework] = useState<ReactNode>(null);
  return (
    <header className={"max-h-[225px] bg-jet flex items-center p-2 flex-wrap"}>
      <div className="flex grow mr-auto mt-1 mb-1">
        <ModSearch
          handleOpenMod={handleOpenMod}
          setIframeCovered={setIframeCovered}
          openManuals={openManuals}
        />
        <Popups setEdgework={setEdgework} setIframeCovered={setIframeCovered} />
      </div>
      <div className="m-auto mt-1 mb-1">{edgework}</div>
    </header>
  );
};

export default Header;
