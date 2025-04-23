const getFilteredMods = (list: string[], queryTerm: string) => {
  try {
    return list.filter((mod) =>
      mod.toLowerCase().includes(queryTerm.toLowerCase())
    );
  } catch {
    console.log("something");
  }
};

export { getFilteredMods };
