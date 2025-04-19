import { ArrowDownRight } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const Notepad = () => {
  return (
    <PanelGroup
      direction="horizontal"
      autoSaveId="notepads-hor"
      className="relative"
    >
      <Panel minSize={8} collapsible>
        <PanelGroup direction="vertical" autoSaveId="notepads-left">
          <Panel defaultSize={100} minSize={8} collapsible>
            <Notearea position="tl" />
          </Panel>
          <PanelResizeHandle className={"border-t-1 border-black"} />
          <Panel defaultSize={0} minSize={8} collapsible>
            <Notearea position="bl" />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className={"border-l-1 border-black"} />
      <Panel minSize={8} collapsible>
        <PanelGroup direction="vertical" autoSaveId="notepads-right">
          <Panel minSize={8} collapsible>
            <Notearea position="tr" />
          </Panel>
          <PanelResizeHandle className={"border-t-1 border-black"} />
          <Panel minSize={8} collapsible>
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
    case "bl":
      arrowCss = "top-0 right-0 rotate-90";
      break;
    case "tr":
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
          if (e.key == "Tab") handleTabPress(e as unknown as EType);
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

type EType = {
  preventDefault: () => void;
  shiftKey: string;
  target: {
    selectionStart: number;
    selectionEnd: number;
    value: string;
  };
};

/* 
  Credit: Renan Le Caro - https://stackoverflow.com/questions/16058602/how-to-use-tab-to-ident-multiple-lines-in-textarea-editor-in-chrome/77774714
*/
const handleTabPress = (e: EType) => {
  e.preventDefault();
  const target = e.target;
  const lines = target.value.split("\n");
  const selection = [
    offsetToLineAndOffset(lines, target.selectionStart),
    offsetToLineAndOffset(lines, target.selectionEnd),
  ];
  if (selection[0].line != selection[1].line) {
    // Multiple Lines selected
    for (let l = selection[0].line; l <= selection[1].line; l++) {
      const originalLength = lines[l].length;
      if (e.shiftKey) {
        lines[l] = lines[l].replace(/^ {0,4}/, "");
      } else {
        lines[l] = "    " + lines[l];
      }
      // How much the line moved
      const delta = lines[l].length - originalLength;
      // Update the user selection if it's on this line
      selection.forEach((sel) => {
        if (sel.line == l) {
          sel.offset = Math.max(0, sel.offset + delta);
        }
      });
    }
    target.value = lines.join("\n");
    target.selectionStart = LineAndOffsetToOffset(
      lines,
      selection[0].line,
      selection[0].offset
    );
    target.selectionEnd = LineAndOffsetToOffset(
      lines,
      selection[1].line,
      selection[1].offset
    );
  } else if (!e.shiftKey) {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    target.value =
      target.value.substring(0, start) + "    " + target.value.substring(end);
    target.selectionStart = target.selectionEnd = start + 4;
  }
};

const offsetToLineAndOffset = (lines: string[], offset: number) => {
  let line = 0;
  while (offset > lines[line].length && line < lines.length - 1) {
    offset = offset - lines[line].length - 1;
    line++;
  }
  return { line, offset };
};
const LineAndOffsetToOffset = (
  lines: string[],
  line: number,
  offset: number
) => {
  for (let i = 0; i < line; i++) offset += lines[i].length + 1;

  return offset;
};

export default Notepad;
