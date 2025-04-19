const getLocalStorageMap = (localStorageKey: string): Map<string, string> => {
  const defaults = localStorage.getItem(localStorageKey);
  if (!defaults) return new Map<string, string>();

  const defaultsObj = JSON.parse(defaults);
  if (!defaultsObj || Object.keys(defaultsObj).length === 0)
    return new Map<string, string>();

  const fetchedMap = new Map<string, string>(Object.entries(defaultsObj));
  return fetchedMap;
};

export { getLocalStorageMap };
