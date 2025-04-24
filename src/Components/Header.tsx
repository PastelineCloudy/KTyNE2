import { ReactNode, useState } from "react";
import ModSearch from "./ModSearch";
import Popups from "./Popups";
import useWindowSize from "../Hooks/useWindowSize";

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
  const windowSize = useWindowSize();
  return (
    <header
      className={`max-h-[225px] bg-jet flex items-center p-2 ${
        windowSize[0] < 975 ? "flex-wrap" : ""
      }`}
    >
      <div
        className={`flex ${
          windowSize[0] < 975
            ? "grow justify-around"
            : windowSize[0] < 1175
            ? "flex-col"
            : ""
        }`}
      >
        <ModSearch
          handleOpenMod={handleOpenMod}
          setIframeCovered={setIframeCovered}
          openManuals={openManuals}
        />
        <Popups setEdgework={setEdgework} setIframeCovered={setIframeCovered} />
      </div>
      <div className={`${windowSize[0] < 975 ? "mr-auto" : ""} ml-auto`}>
        {edgework}
      </div>
    </header>
  );
};

export default Header;
