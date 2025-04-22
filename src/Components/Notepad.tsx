import { ArrowDownRight } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { handleTabPress } from "../Utils/NotepadUtils";

const Notepad = () => {
  return (
    <PanelGroup
      direction="vertical"
      autoSaveId="notepads-hor"
      className="relative"
    >
      <Panel minSize={10}>
        <PanelGroup direction="horizontal" autoSaveId="notepads-left">
          <Panel defaultSize={100} minSize={5}>
            <Notearea position="tl" />
          </Panel>
          <PanelResizeHandle className={"border-l-1 border-black"} />
          <Panel defaultSize={0} minSize={5} collapsible>
            <Notearea position="bl" />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className={"border-t-1 border-black"} />
      <Panel minSize={10} collapsible>
        <PanelGroup direction="horizontal" autoSaveId="notepads-right">
          <Panel minSize={5}>
            <Notearea position="tr" />
          </Panel>
          <PanelResizeHandle className={"border-l-1 border-black"} />
          <Panel minSize={5} collapsible>
            <Notearea position="br" />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

type Position = "tl" | "tr" | "bl" | "br";

const Notearea = ({
  className,
  position,
}: {
  className?: string;
  position: Position;
}) => {
  let arrowCss;
  switch (position) {
    case "tl":
      arrowCss = "bottom-0 right-0 rotate-180";
      break;
    case "tr":
      arrowCss = "top-0 right-0 rotate-90";
      break;
    case "bl":
      arrowCss = "bottom-0 left-0 rotate-270";
      break;
    case "br":
      arrowCss = "top-0 left-0 rotate-0";
      break;
  }
  return (
    <div className="relative w-full h-full">
      <textarea
        className={`p-1 w-full h-full bg-size-[100%_1.4em]
        bg-local bg-linear-to-t from-[#85c1e9] from-[0.1em] to-[#d2d7df] to-[0.1em]
        pt-[0.2rem]
        pl-2
        leading-[1.4]
        font-[NotoSansMono]
        outline-none
        resize-none
        ${className}`}
        spellCheck="false"
        onKeyDown={(e) => {
          if (e.key == "Tab") handleTabPress(e);
        }}
      ></textarea>

      <ArrowDownRight
        size={12}
        strokeWidth={1}
        className={`absolute ${arrowCss}`}
      />
    </div>
  );
};

export default Notepad;
