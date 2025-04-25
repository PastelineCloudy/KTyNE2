import { Ref } from "react";

const LabelInput = ({
  labelText,
  id,
  value,
  checked,
  setValue = () => {},
  placeholder,
  name,
  type = "text",
  labelClassName,
  inputClassName,
  inputOnClick,
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
  checked?: boolean;
  setValue?: (newVal: string) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputOnClick?: () => void;
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
  return (
    <div className="flex flex-col items-center w-fit">
      <label htmlFor={id} className={labelClassName + " text-xl mt-2"}>
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className={`${inputClassName} 
          ${darkMode ? `border-bg bg-bg` : `border-black`} 
          ${disabled ? "text-gray-500" : "text-jet hover:border-blue-600"} 
          w-full leading-8 border-2 pl-1 focus:border-blue-600 focus:ring-0 focus:outline-0 cancel-drag `}
        placeholder={placeholder}
        value={value || ""}
        checked={checked}
        onChange={(e) => setValue(e.target.value)}
        onClick={inputOnClick}
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
