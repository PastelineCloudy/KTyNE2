/* eslint-disable react-refresh/only-export-components */
export const parsePorts = (portString: string): Port[][] => {
  if (portString == "") return [];

  const replacedInput = portString
    .toLowerCase()
    .replace(/dvid|dvi-d/g, "dvi")
    .replace(/parallel|para/g, "parallel")
    .replace(/ps\/2/g, "ps2")
    .replace(/rj-45|rj45/g, "rj")
    .replace(/stereo-rca|stereo rca|stereo|ster/g, "rca")
    .replace(/all2|sp/g, "serial parallel")
    .replace(/all4/g, "dvi rca rj ps2")
    .replace(/\(\)/g, "(empty)")
    .replace(/,/g, " ")
    .replace(/\s\s/g, " ")
    .trim();
  console.log(replacedInput);
  const plateInputs = replacedInput.match(/[([]([A-za-z0-9 ,-]+)+/g);
  const plateStrings = plateInputs
    ? plateInputs.map((plate) => plate.replace(/[[(]/g, ""))
    : [];

  const ports: string[][] = plateStrings.map((plateString) =>
    plateString
      .split(" ")
      .map((port) => (PORTS.includes(port as Port) ? port : ""))
  );
  return ports as Port[][];
};

export const parseInds = (indList: string): Ind[] => {
  return indList
    .split(" ")
    .map((ind) => ind.toLowerCase())
    .filter((ind) => isValidInd(ind))
    .map((ind) => ind as Ind);
};

function isValidInd(value: string): value is Ind {
  return INDS.includes(value as Ind);
}

export const INDS = [
  "bob",
  "car",
  "clr",
  "frk",
  "frq",
  "ind",
  "msa",
  "nsa",
  "sig",
  "snd",
  "trn",
] as const;
export type Ind = (typeof INDS)[number];

export const PORTS = [
  "rj",
  "ps2",
  "dvi",
  "rca",
  "parallel",
  "serial",
  "",
] as const;
export type Port = (typeof PORTS)[number];
