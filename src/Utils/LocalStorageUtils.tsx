const getLocalStorageMap = <V,>(localStorageKey: string): Map<string, V> => {
  const defaults = localStorage.getItem(localStorageKey);
  if (!defaults) return new Map<string, V>();

  const defaultsObj = JSON.parse(defaults);
  if (!defaultsObj || Object.keys(defaultsObj).length === 0)
    return new Map<string, V>();

  const fetchedMap = new Map<string, V>(Object.entries(defaultsObj));
  return fetchedMap;
};

export { getLocalStorageMap };
