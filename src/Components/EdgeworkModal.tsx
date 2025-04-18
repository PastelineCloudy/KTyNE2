import { ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";
import Edgework, { Ind, INDS, Port, PORTS } from "./Edgework";

const EdgeworkModal = ({
  edgeworkModalIsOpen,
  setEdgeworkModalIsOpen,
  setEdgework,
}: {
  edgeworkModalIsOpen: boolean;
  setEdgeworkModalIsOpen: (newVal: boolean) => void;
  setEdgework: (newVal: ReactNode) => void;
}) => {
  const [batteries, setBatteries] = useState("");
  const [holders, setHolders] = useState("");
  const [litInds, setLitInds] = useState<Ind[]>([]);
  const [unlitInds, setUnlitInds] = useState<Ind[]>([]);
  const [portPlates, setPortPlates] = useState<string>("");
  const [serial, setSerial] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (edgeworkModalIsOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [edgeworkModalIsOpen]);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setEdgeworkModalIsOpen(false);
    setEdgework(
      <Edgework
        batteries={parseInt(batteries) ?? 0}
        holders={parseInt(holders) ?? 0}
        litInds={parseInds(litInds)}
        unlitInds={parseInds(unlitInds)}
        portPlates={parsePorts(portPlates)}
        serial={serial}
      />
    );
  };

  const resetEdgework = () => {
    setBatteries("");
    setHolders("");
    setLitInds([]);
    setUnlitInds([]);
    setPortPlates("");
    setSerial("");
  };

  const widgetCount =
    (parseInt(holders) | 0) +
    litInds.length +
    unlitInds.length +
    parsePorts(portPlates).length;

  return (
    <>
      <dialog className="m-auto p-8 border-2 rounded-2xl w-150" ref={dialogRef}>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl text-center">Edgework</h1>
          <div className="flex justify-center gap-2">
            <LabelInput
              labelText="Batteries"
              id="battery-input"
              placeholder="0"
              type="number"
              width="w-32"
              min={0}
              max={10}
              autoFocus={true}
              value={batteries}
              setValue={(newVal) =>
                setBatteries(parseInt(newVal) > 10 ? "10" : newVal)
              }
            />
            <LabelInput
              labelText="Holders"
              id="battery-holder-input"
              placeholder="0"
              type="number"
              width="w-32"
              value={holders}
              min={0}
              max={10}
              setValue={(newVal) =>
                setHolders(parseInt(newVal) > 5 ? "5" : newVal)
              }
            />
          </div>
          <div className="flex justify-center gap-2 w-125">
            <LabelInput
              labelText="Lit Indicators"
              id="lit-inds"
              placeholder="ex: FRK CLR"
              value={litInds.join(" ")}
              setValue={(newVal) =>
                setLitInds(
                  newVal.split(" ").filter((ind) => ind !== "") as Ind[]
                )
              }
            />
            <LabelInput
              labelText="Unlit Indicators"
              id="unlit-inds"
              placeholder="ex: SIG NSA"
              value={unlitInds.join(" ")}
              setValue={(newVal) =>
                setUnlitInds(
                  newVal.split(" ").filter((ind) => ind !== "") as Ind[]
                )
              }
            />
          </div>
          <LabelInput
            labelText="Ports"
            id="ports-input"
            placeholder="ex: (dvi ps2) (para serial) (empty)"
            width="w-125"
            value={portPlates}
            setValue={(newVal) => setPortPlates(newVal)}
          />
          <LabelInput
            labelText="Serial Number"
            id="serial-input"
            width="w-20"
            value={serial}
            setValue={(newVal) => setSerial(newVal)}
            minlength={6}
            maxlength={6}
            required={true}
          />
          <p
            className={`${
              widgetCount === 5 ? "text-green-600" : "text-red-500"
            } mt-2`}
          >
            {widgetCount !== 5
              ? `Warning: ${widgetCount < 5 ? "Less" : "More"} than 5 widgets. `
              : "Exactly 5 widgets"}
          </p>
          <div className="pt-2 flex gap-2">
            <DialogButton
              text="Close"
              onClick={() => setEdgeworkModalIsOpen(false)}
            />
            <DialogButton text="Reset" onClick={resetEdgework} />
            <DialogButton text="Submit" type="submit" />
          </div>
          <div className="mt-2 p-4 pt-2 bg-jet w-full h-40">
            {
              <Edgework
                batteries={parseInt(batteries) ?? 0}
                holders={parseInt(holders) ?? 0}
                litInds={parseInds(litInds)}
                unlitInds={parseInds(unlitInds)}
                portPlates={parsePorts(portPlates)}
                serial={serial}
              />
            }
          </div>
        </form>
      </dialog>
    </>
  );
};

const parsePorts = (portString: string): Port[][] => {
  if (portString == "") return [];

  const replacedInput = portString
    .toLowerCase()
    .replace(/dvid|dvi-d/g, "dvi")
    .replace(/parallel|para/g, "parallel")
    .replace("ps/2", "ps2")
    .replace(/rj-45|rj45/g, "rj")
    .replace(/stereo-rca|stereo rca|stereo|ster/g, "rca")
    .replace(/all2|sp/g, "serial parallel")
    .replace(/all4/g, "dvi rca rj ps2")
    .replace("()", "(empty)")
    .replace(",", " ")
    .replace("  ", " ")
    .trim();
  const plateInputs = replacedInput.match(/[([]([A-za-z0-9 ,-]+)+/g);
  const plateStrings = plateInputs
    ? plateInputs.map((plate) => plate.replace(/[[(]/g, ""))
    : [];

  const ports: string[][] = plateStrings.map((plateString) =>
    plateString
      .split(" ")
      .map((port) => (PORTS.includes(port as Port) ? port : ""))
  );
  return ports as Port[][];
};

const parseInds = (indList: string[]): Ind[] => {
  return indList
    .map((ind) => ind.toLowerCase())
    .filter((ind) => isValidInd(ind))
    .map((ind) => ind as Ind);
};

function isValidInd(value: string): value is Ind {
  return INDS.includes(value as Ind);
}

const DialogButton = ({
  text,
  onClick,
  type = "button",
}: {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="border-2 border-black w-fit cursor-pointer p-1 rounded-md hover:bg-gray-200"
    >
      {text}
    </button>
  );
};

const LabelInput = ({
  labelText,
  id,
  value = undefined,
  setValue,
  placeholder,
  name,
  type = "text",
  width = "w-full",
  min,
  max,
  minlength,
  maxlength,
  required,
  autoFocus = false,
}: {
  labelText: string;
  id: string;
  value?: string | number | undefined;
  setValue: (newVal: string) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  width?: string;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  autoFocus?: boolean;
}) => {
  if (!name) name = id;
  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor={id} className="text-xl mt-2">
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className={`leading-8 border-2 border-black pl-1 ${width} hover:bg-gray-200 focus:border-blue-200`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minLength={minlength}
        maxLength={maxlength}
        required={required}
        autoComplete="off"
        min={min}
        max={max}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default EdgeworkModal;
