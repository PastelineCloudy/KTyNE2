import { useState } from "react";

const SettingsPopup = () => {
  return (
    <div>
      <SettingsToggle
        toggleText="Confirm popup before page close"
        id="pageCloseConfirmation"
      />
    </div>
  );
};

const SettingsToggle = ({
  toggleText,
  id,
}: {
  toggleText: string;
  id: string;
}) => {
  const localStorageKey = `KTyNE:setting-${id}`;
  const localStoragePreference =
    localStorage.getItem(localStorageKey) === "true";
  const [toggleState, setToggleState] = useState(localStoragePreference);
  return (
    <div className="flex gap-2">
      <div>{toggleText}</div>
      <input
        type="checkbox"
        name={id}
        id={id}
        checked={toggleState}
        onChange={(e) => {
          if (e.target instanceof HTMLInputElement) {
            console.log(e.target.checked);
            setToggleState(e.target.checked);
            localStorage.setItem(localStorageKey, String(e.target.checked));
          }
        }}
      />
    </div>
  );
};

export default SettingsPopup;
