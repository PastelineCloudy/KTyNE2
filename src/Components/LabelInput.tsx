import { Ref } from "react";

const LabelInput = ({
  labelText,
  id,
  value,
  setValue = () => {},
  placeholder,
  name,
  type = "text",
  width = "w-full",
  labelClassName,
  inputClassName,
  min,
  max,
  minlength,
  maxlength,
  required,
  autoFocus,
  ref,
  disabled,
  darkMode = false,
  spellCheck = false,
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
  spellCheck?: boolean;
}) => {
  if (!name) name = id;
  const inputLabelCSS = darkMode
    ? `${width} ${inputClassName} border-bg bg-bg text-jet cancel-drag`
    : `${width} ${inputClassName} border-black hover:bg-gray-200 cancel-drag`;
  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor={id} className={"text-xl mt-2 " + labelClassName}>
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className={"leading-8 border-2 pl-1 " + inputLabelCSS}
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
        spellCheck={spellCheck}
      />
    </div>
  );
};

export default LabelInput;
