import { getLocalStorageMap } from "./LocalStorageUtils";
import fullModListRaw from "../fullList(May 15 2025).json";

type ModInfo = {
  modName: string;
  manualUrl: string;
};

const fullModList: Map<string, string[]> = new Map(
  Object.entries(fullModListRaw)
);

const getFullModListKeys = () => {
  return Array.from(fullModList.keys());
};

const setDefaultManualUrl = (modName: string, manualUrl: string) => {
  const defaultManuals = getLocalStorageMap<string>("KTyNE:defaultManuals");
  defaultManuals.set(modName, manualUrl);
  localStorage.setItem(
    "KTyNE:defaultManuals",
    JSON.stringify(Object.fromEntries(defaultManuals))
  );
};

const getAlternateManualList = (modName: string) => {
  return fullModList.get(modName) || [];
};

const getDefaulManualUrl = (modName: string): string | undefined => {
  const defaultManuals = getLocalStorageMap<string>("KTyNE:defaultManuals");
  return defaultManuals.get(modName);
};

const getManualUrl = (modName: string): string => {
  const defaultManual = getDefaulManualUrl(modName);
  if (defaultManual) return defaultManual;

  const mapEntry = fullModList.get(modName);
  if (mapEntry) return mapEntry[0];

  return "https://ktane.timwi.de/";
};

const parseAlternativeManualName = (text: string) => {
  const URL_PREFIX = "https://ktane.timwi.de/HTML/";
  if (!text.includes(URL_PREFIX)) return text;
  return decodeURIComponent(text).replace(URL_PREFIX, "").replace(".html", "");
};

const getBestMatchIndex = (list: string[], queryTerm: string) => {
  const lowerCaseList = list.map((item) =>
    item.toLowerCase().replace("’", "'")
  );
  const query = queryTerm.toLowerCase().trim();

  if (lowerCaseList.includes(query)) return lowerCaseList.indexOf(query);
  const startsWithQuery = lowerCaseList.find((item) => item.startsWith(query));
  if (startsWithQuery) return lowerCaseList.indexOf(startsWithQuery);
  return 0;
};

const getFinalModName = (modName: string, openModList: string[]): string => {
  if (!openModList.includes(modName)) return modName;

  let firstAvailableNumber = 2;
  while (openModList.includes(`${modName} (${firstAvailableNumber})`))
    firstAvailableNumber++;

  return `${modName} (${firstAvailableNumber})`;
};

const getFilteredMods = (
  list: string[],
  queryTerm: string,
  sorted: boolean = false
) => {
  let finalList;
  if (list.length < 2) return list;
  if (queryTerm === "") finalList = [...list];
  else
    finalList = list.filter(
      (mod) =>
        mod.toLowerCase().includes(queryTerm.toLowerCase()) ||
        mod.toLowerCase().replace("’", "'").includes(queryTerm.toLowerCase()) ||
        mod.replace("❖", "nonverbal simon").includes(queryTerm.toLowerCase()) ||
        mod.replace("×", "x").includes(queryTerm.toLowerCase()) ||
        mod
          .replace("ƎNA Cipher", "ena cipher")
          .includes(queryTerm.toLowerCase())
    );
  return sorted ? finalList.sort() : finalList;
};

export {
  setDefaultManualUrl,
  getDefaulManualUrl,
  getManualUrl,
  parseAlternativeManualName,
  getBestMatchIndex,
  getFinalModName,
  getFullModListKeys,
  getAlternateManualList,
  getFilteredMods,
};
export type { ModInfo };
