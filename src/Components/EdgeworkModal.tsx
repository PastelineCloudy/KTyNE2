import { ReactNode, Ref, SyntheticEvent, useRef, useState } from "react";
import Edgework from "./Edgework";
import CustomDialog, { CustomDialogButton } from "./CustomDialog";
import { parseInds, parsePorts } from "../Utils/EdgeworkUtils";

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
            width="w-32"
            min={0}
            max={10}
            value={batteries}
            autoFocus={true}
            setValue={(newVal) => {
              const val = parseInt(newVal);
              if (val > 10) {
                // Safe gaurd for if tab is hit after holders input
                setHolders(Math.floor(val / 10));
              } else {
                setBatteries(val);
              }
            }}
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
              setHolders(parseInt(newVal) > 5 ? 5 : parseInt(newVal))
            }
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

export const LabelInput = ({
  labelText,
  id,
  value,
  setValue = () => {},
  placeholder,
  name,
  type = "text",
  width = "w-full",
  labelClassName = "text-xl mt-2",
  inputClassName = "leading-8 border-2 pl-1",
  min,
  max,
  minlength,
  maxlength,
  required,
  autoFocus,
  ref,
  disabled,
  darkMode = false,
}: {
  labelText: string;
  id: string;
  value?: string | number | null;
  setValue?: (newVal: string) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  width?: string;
  labelClassName?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  autoFocus?: boolean;
  ref?: Ref<HTMLInputElement>;
  disabled?: boolean;
  darkMode?: boolean;
}) => {
  if (!name) name = id;
  const inputLabelCSS = darkMode
    ? `${width} ${inputClassName} border-bg bg-bg text-jet cancel-drag`
    : `${width} ${inputClassName} border-black hover:bg-gray-200 cancel-drag`;
  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor={id} className={labelClassName}>
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className={inputLabelCSS}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        minLength={minlength}
        maxLength={maxlength}
        required={required}
        autoComplete="off"
        min={min}
        max={max}
        autoFocus={autoFocus}
        ref={ref}
        disabled={disabled}
      />
    </div>
  );
};

export default EdgeworkModal;
