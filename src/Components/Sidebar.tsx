import SidebarButton from "./SidebarButton";

const Sidebar = ({
  openModList,
  currentManual,
  handleModChange,
  handleModClose,
}: {
  openModList: string[];
  currentManual: string | null;
  handleModChange: (modName: string, isCurrent: boolean) => void;
  handleModClose: (modName: string, isCurrent: boolean) => void;
}) => {
  return (
    <div className="p-2 flex flex-col">
      <h2 className="text-xl">Open Modules</h2>
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
