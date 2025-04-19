import { RefObject, useEffect } from "react";

export default function useOutsideClickTracker(
  isOpen: boolean,
  handleOpenSearch: (val: boolean) => void,
  ref: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | null) {
      if (ref.current && event && !ref.current.contains(event.target as Node)) {
        handleOpenSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleOpenSearch, ref]);
}
