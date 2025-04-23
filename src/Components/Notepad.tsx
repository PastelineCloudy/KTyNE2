import { ArrowDownRight } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

const Notepad = () => {
  return (
    <PanelGroup
      direction="vertical"
      autoSaveId="notepads-hor"
      className="relative"
    >
      <Panel defaultSize={75} minSize={10}>
        <PanelGroup direction="horizontal" autoSaveId="notepads-left">
          <Panel defaultSize={50} minSize={5}>
            <Notearea position="tl" />
          </Panel>
          <PanelResizeHandle className={"border-l-2 border-black"} />
          <Panel defaultSize={50} minSize={5} collapsible>
            <Notearea position="bl" />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className={"border-t-2 border-black"} />
      <Panel defaultSize={25} minSize={10} collapsible>
        <PanelGroup direction="horizontal" autoSaveId="notepads-right">
          <Panel defaultSize={100} minSize={5}>
            <Notearea position="tr" />
          </Panel>
          <PanelResizeHandle className={"border-l-2 border-black"} />
          <Panel defaultSize={0} minSize={5} collapsible>
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

  const theme = {
    width: "full",
    height: "full",
  };

  function onError(error: Error) {
    console.error(error);
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  return (
    <div className="relative w-full h-full">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder={"Enter some text..."}
              placeholder={<div>Enter some text...</div>}
              className={`p-1 w-full h-full bg-size-[100%_1.4em]
                bg-local bg-linear-to-t from-[#85c1e9] from-[0.1em] to-[#d2d7df] to-[0.1em]
                pt-[0.2rem]
                pl-2
                leading-[1.4]
                font-[NotoSansMono]
                outline-none
                resize-none
                overflow-scroll
                no-scrollbar
                ${className}`}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabIndentationPlugin />
      </LexicalComposer>
      {/* <textarea
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
      ></textarea> */}

      <ArrowDownRight
        size={12}
        strokeWidth={1}
        className={`absolute ${arrowCss}`}
      />
    </div>
  );
};

export default Notepad;
