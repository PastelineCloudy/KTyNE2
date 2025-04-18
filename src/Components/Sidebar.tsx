import SidebarButton from "./SidebarButton";

const Sidebar = ({
  openModList,
  currentManual,
  handleModChange,
  handleModClose,
  sidebarWidth,
}: {
  openModList: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
  sidebarWidth: number;
}) => {
  return (
    <div
      style={{ minWidth: `${sidebarWidth}px` }}
      className="min-w-50 m-2 flex flex-col"
    >
      <h2 className="text-xl">Open Mods</h2>
      <ul className="overflow-auto no-scrollbar">
        {openModList.map((modName) => (
          <SidebarButton
            key={modName}
            modName={modName}
            isCurrentManual={currentManual === modName}
            handleModChange={handleModChange}
            handleModClose={handleModClose}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
