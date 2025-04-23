import { Minus, Plus } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import LabelInput from "./LabelInput";
import { HeaderButton } from "./Popups";

type ColorChoiceType = {
  shortCut: string;
  color: string;
};

const defaultColors: ColorChoiceType[] = [
  { shortCut: "1", color: "#0000ff" },
  { shortCut: "2", color: "#ff0000" },
  { shortCut: "3", color: "#008000" },
  { shortCut: "4", color: "#ffff00" },
  { shortCut: "5", color: "#ff00ff" },
  { shortCut: "6", color: "#ffa500" },
  { shortCut: "q", color: "#00ffff" },
  { shortCut: "w", color: "#ffffff" },
  { shortCut: "e", color: "#000000" },
  { shortCut: "r", color: "#808080" },
  { shortCut: "v", color: "#800080" },
];

const GridPopup = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [cellSize, setCellSize] = useState<number>(4);
  const [paintEnabled, setPaintEnabled] = useState<boolean>(true);
  const [paintOnHover, setPaintOnHover] = useState<boolean>(false);
  const [resetToggle, setResetToggle] = useState<boolean>(false);

  const cellArr: ReactNode[] = [];

  const resetGrid = () => {
    setResetToggle(!resetToggle);
  };

  useEffect(() => {
    const disablePaintOnHover = () => {
      setPaintOnHover(false);
    };
    window.addEventListener("mouseup", disablePaintOnHover);
    return () => {
      window.removeEventListener("mouseup", disablePaintOnHover);
    };
  }, []);

  // Alt + Key shortcuts
  useEffect(() => {
    const setColor = (color: string) => {
      setCurrentColor(color);
      setPaintEnabled(true);
    };
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey) {
        event.preventDefault();
        switch (event.key) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
          case "0":
            setColor(defaultColors[parseInt(event.key) - 1].color);
            break;
          case "q":
            setColor(defaultColors[6].color);
            break;
          case "w":
            setColor(defaultColors[7].color);
            break;
          case "e":
            setColor(defaultColors[8].color);
            break;
          case "r":
            setColor(defaultColors[9].color);
            break;
          case "p":
          case "v":
            setColor(defaultColors[10].color);
            break;
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  for (let i = 0; i <= cols; i++) {
    cellArr.push(
      <IndexCell
        key={`index-col-${i}`}
        index={i === 0 ? " " : `${numToLetter(i - 1)}(${i})`}
        size={cellSize}
      />
    );
  }

  for (let row = 1; row <= rows; row++) {
    cellArr.push(
      <IndexCell key={`index-row-${row}`} index={String(row)} size={cellSize} />
    );
    for (let col = 1; col <= cols; col++) {
      cellArr.push(
        <Cell
          key={`${col}-${row}`}
          currentColor={currentColor}
          size={cellSize}
          paintEnabled={paintEnabled}
          paintOnHover={paintOnHover}
          setPaintOnHover={setPaintOnHover}
        />
      );
    }
  }

  return (
    <div className="pt-2 flex flex-col" key={String(resetToggle)}>
      <div className="flex pl-6 gap-2">
        <div className="flex">
          <Minus
            className="hover:text-red-500 cursor-pointer cancel-drag"
            onClick={() => setCols(cols - 1)}
          />
          <p>Cols</p>
          <Plus
            className="hover:text-green-500 cursor-pointer cancel-drag"
            onClick={() => setCols(cols + 1)}
          />
        </div>
        <div className="flex">
          <Minus
            className="hover:text-red-500 cursor-pointer cancel-drag"
            onClick={() => setRows(rows - 1)}
          />
          <p>Rows</p>
          <Plus
            className="hover:text-green-500 cursor-pointer cancel-drag"
            onClick={() => setRows(rows + 1)}
          />
        </div>
        <div className="flex">
          <Minus
            className="hover:text-red-500 cursor-pointer cancel-drag"
            onClick={() => setCellSize(cellSize - 1)}
          />
          <p>Size</p>
          <Plus
            className="hover:text-green-500 cursor-pointer cancel-drag"
            onClick={() => setCellSize(cellSize + 1)}
          />
        </div>
      </div>
      <div
        className="grid w-fit h-fit p-2 self-center"
        style={{
          gridTemplateColumns: `repeat(${cols + 1}, 1fr)`,
          gridTemplateRows: `repeat(${rows + 1}, 1fr)`,
        }}
      >
        {cellArr.map((cell) => cell)}
      </div>
      <div className="flex gap-2 self-center">
        <div className="grid grid-cols-4 grid-rows-3 w-fit h-fit cancel-drag">
          {defaultColors.map((choice) => (
            <ColorChoice
              key={choice.color}
              choice={choice}
              setColor={setCurrentColor}
              setPaintEnabled={setPaintEnabled}
            />
          ))}
          <input
            type="color"
            name="color-input"
            id="color-input"
            value={currentColor}
            className="h-full border-2 border-black"
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center">
          <HeaderButton onClick={resetGrid}>Reset Grid</HeaderButton>
          <LabelInput
            type="checkbox"
            id="paint-input"
            labelText="Paint?"
            width="12"
            checked={paintEnabled}
            inputOnClick={() => setPaintEnabled(!paintEnabled)}
            inputClassName="h-6 w-6 cursor-pointer"
          />
          <kbd className="mt-4">(alt+key)</kbd>
        </div>
      </div>
    </div>
  );
};

const ColorChoice = ({
  choice,
  setColor,
  setPaintEnabled,
}: {
  choice: ColorChoiceType;
  setColor: (color: string) => void;
  setPaintEnabled: (val: boolean) => void;
}) => {
  return (
    <div
      style={{
        backgroundColor: choice.color,
        color: getFontColor(choice.color),
      }}
      className="w-12 h-12 border-2 cancel-drag cursor-pointer border-bg text-white grid place-items-center font-[NotoSansMono]"
      onClick={() => {
        setColor(choice.color);
        setPaintEnabled(true);
      }}
    >
      {choice.shortCut}
    </div>
  );
};

const hexToRgb = (hexColor: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const getFontColor = (bgColor: string) => {
  if (getLuminance(bgColor) === 0 || getLuminance(bgColor) < 0.5)
    return "#ffffff";
  else if (getLuminance(bgColor) >= 0.5) return "#000000";
};

const getLuminance = (bgColor: string) => {
  const { r, g, b } = hexToRgb(bgColor);

  const luminance =
    (0.2126 * +r) / 255 + (0.7152 * +g) / 255 + (0.0722 * +b) / 255;

  return luminance;
};

const IndexCell = ({ index, size }: { index: string; size: number }) => {
  return (
    <div
      spellCheck="false"
      style={{
        width: size * 12 + "px",
        height: size * 12 + "px",
        backgroundColor: "transparent",
      }}
      className={`grid place-items-center border-bg 
        caret-transparent font-[NotoSansMono] select-none
      overflow-hidden text-[1em] break-all outline-0`}
    >
      {index}
    </div>
  );
};

const Cell = ({
  currentColor,
  size,
  paintEnabled,
  paintOnHover,
  setPaintOnHover,
}: {
  currentColor: string;
  size: number;
  setPaintOnHover: (val: boolean) => void;
  paintEnabled: boolean;
  paintOnHover: boolean;
}) => {
  const [bgColor, setBgColor] = useState<string>("#ffffff");

  return (
    <div
      contentEditable
      spellCheck="false"
      style={{
        width: size * 12 + "px",
        height: size * 12 + "px",
        backgroundColor: bgColor,
        color: getFontColor(bgColor),
      }}
      className={`border-2 cancel-drag cursor-pointer
      grid place-items-center border-bg caret-transparent font-[NotoSansMono] select-none
      overflow-hidden text-[1em] break-all outline-0`}
      onMouseDown={() => {
        if (paintEnabled) {
          setBgColor(currentColor);
          setPaintOnHover(true);
        }
      }}
      onMouseEnter={() => {
        if (paintOnHover && paintEnabled) setBgColor(currentColor);
      }}
    ></div>
  );
};

const numToLetter = (number: number) => {
  return String.fromCharCode(65 + number);
};

export default GridPopup;
