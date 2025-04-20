const getFilteredMods = (list: string[], queryTerm: string) => {
  return list.filter((mod) =>
    mod.toLowerCase().includes(queryTerm.toLowerCase())
  );
};

export { getFilteredMods };
