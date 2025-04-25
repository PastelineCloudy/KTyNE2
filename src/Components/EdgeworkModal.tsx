import { ReactNode, SyntheticEvent, useRef, useState } from "react";
import Edgework from "./Edgework";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";
import { parseInds, parsePorts } from "../Utils/EdgeworkUtils";
import LabelInput from "./LabelInput";

const EdgeworkModal = ({
  edgeworkModalIsOpen,
  setEdgeworkModalIsOpen,
  setEdgework,
}: {
  edgeworkModalIsOpen: boolean;
  setEdgeworkModalIsOpen: (newVal: boolean) => void;
  setEdgework: (newVal: ReactNode) => void;
}) => {
  const [batteries, setBatteries] = useState<number | null>(null);
  const [holders, setHolders] = useState<number | null>(null);
  const [litInds, setLitInds] = useState<string>("");
  const [unlitInds, setUnlitInds] = useState<string>("");
  const [portPlates, setPortPlates] = useState<string>("");
  const [serial, setSerial] = useState("");

  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setEdgeworkModalIsOpen(false);
    setEdgework(
      <Edgework
        batteries={batteries || 0}
        holders={holders || 0}
        litInds={parseInds(litInds)}
        unlitInds={parseInds(unlitInds)}
        portPlates={parsePorts(portPlates)}
        serial={serial}
      />
    );
  };

  const resetEdgework = () => {
    setBatteries(null);
    setHolders(null);
    setLitInds("");
    setUnlitInds("");
    setPortPlates("");
    setSerial("");
    setEdgework(null);
    firstInputRef.current?.focus();
  };

  const widgetCount =
    (holders || 0) +
    parseInds(litInds).length +
    parseInds(unlitInds).length +
    parsePorts(portPlates).length;

  return (
    <CustomDialog
      open={edgeworkModalIsOpen}
      onClose={() => setEdgeworkModalIsOpen(false)}
      closeOnEscape={false}
    >
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
        <h1 className="text-4xl text-center">Edgework</h1>
        <div className="flex justify-center gap-2">
          <LabelInput
            ref={firstInputRef}
            labelText="Batteries"
            id="battery-input"
            placeholder="0"
            type="number"
            inputClassName="!w-32"
            min={0}
            max={10}
            value={batteries}
            autoFocus={true}
            setValue={(newVal) => setBatteries(parseInt(newVal))}
          />
          <LabelInput
            labelText="Holders"
            id="battery-holder-input"
            placeholder="0"
            type="number"
            inputClassName="!w-32"
            value={holders}
            min={0}
            max={10}
            setValue={(newVal) => setHolders(parseInt(newVal))}
          />
        </div>
        <div className="flex justify-center gap-2 w-125">
          <LabelInput
            labelText="Lit Indicators"
            id="lit-inds"
            placeholder="ex: FRK CLR"
            value={litInds}
            setValue={(newVal) => setLitInds(newVal)}
          />
          <LabelInput
            labelText="Unlit Indicators"
            id="unlit-inds"
            placeholder="ex: SIG NSA"
            value={unlitInds}
            setValue={(newVal) => setUnlitInds(newVal)}
          />
        </div>
        <LabelInput
          labelText="Ports"
          id="ports-input"
          placeholder="ex: (dvi ps2) (para serial) (empty)"
          inputClassName="!w-125"
          value={portPlates}
          setValue={(newVal) => setPortPlates(newVal)}
        />
        <LabelInput
          labelText="Serial Number"
          id="serial-input"
          inputClassName="!w-20"
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
          <CustomDialogButton onClick={() => setEdgeworkModalIsOpen(false)}>
            Close
          </CustomDialogButton>
          <CustomDialogButton onClick={resetEdgework}>Reset</CustomDialogButton>
          <CustomDialogButton type="submit">Submit</CustomDialogButton>
        </div>
        <div className="mt-2 p-4 pt-2 bg-jet w-115 h-40">
          {
            <Edgework
              batteries={batteries || 0}
              holders={holders || 0}
              litInds={parseInds(litInds)}
              unlitInds={parseInds(unlitInds)}
              portPlates={parsePorts(portPlates)}
              serial={serial}
            />
          }
        </div>
      </form>
    </CustomDialog>
  );
};

export default EdgeworkModal;
