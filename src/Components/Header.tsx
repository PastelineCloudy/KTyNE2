import { ReactNode, useState } from "react";
import Popups from "./Popups";

const Header = ({
  setIframeCovered,
}: {
  setIframeCovered: (bool: boolean) => void;
}) => {
  const [edgework, setEdgework] = useState<ReactNode>(null);
  return (
    <header className={"bg-jet flex items-center p-2 gap-2 flex-wrap"}>
      <Popups setEdgework={setEdgework} setIframeCovered={setIframeCovered} />
      <div className="ml-auto">{edgework}</div>
    </header>
  );
};

export default Header;
