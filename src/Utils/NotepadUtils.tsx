import { KeyboardEvent } from "react";

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
const handleTabPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  const e = event as unknown as EType;
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

// eslint-disable-next-line react-refresh/only-export-components
const LineAndOffsetToOffset = (
  lines: string[],
  line: number,
  offset: number
) => {
  for (let i = 0; i < line; i++) offset += lines[i].length + 1;

  return offset;
};

export { handleTabPress };
