import { parse } from './parser';

export type EDNSymbol = { symbol: string; ns?: string };

export type EDN =
  | number
  | null
  | boolean
  | string
  | EDNSymbol
  | { keyword: string; ns?: string }
  | { char: string }
  | EDN[]
  | { map: [EDN, EDN][] }
  | { set: EDN[] }
  | { list: EDN[] }
  | { tag: EDNSymbol; value: EDN }
  | { meta: [EDN, EDN][]; value: EDN };

export const ednParseMulti = (s: string): EDN[] => {
  return parse(s) as EDN[];
};

export const ednParse = (edn: string): EDN | undefined => {
  return ednParseMulti(edn)[0];
};
