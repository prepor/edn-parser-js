import { parse } from './parser';

export type EDN =
  | number
  | null
  | boolean
  | string
  | EDN[]
  | Map<EDN, EDN>
  | Set<EDN>
  | { symbol: string; ns?: string }
  | { keyword: string; ns?: string }
  | { list: EDN[] };

export const ednParseMulti = (s: string): EDN[] => {
  return parse(s) as EDN[];
};

export const ednParse = (edn: string): EDN => {
  return ednParseMulti(edn)[0];
};
