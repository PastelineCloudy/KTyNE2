const Notepad = () => {
  return (
    <textarea
      className="p-1 w-[35vw] bg-size-[100%_1.4em] 
      bg-local bg-linear-to-t from-[#85c1e9] from-[0.1em] to-[#d2d7df] to-[0.1em]
      pt-[0.2rem]
      pl-2
      leading-[1.4]
      font-[NotoSansMono]
      outline-none"
      // contentEditable="plaintext-only"
      spellCheck="false"
      onKeyDown={(e) => {
        if (e.key == "Tab") handleTabPress(e as unknown as EType);
      }}
    ></textarea>
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
