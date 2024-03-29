import { parse } from './parser';

export type EDN =
  | number
  | null
  | boolean
  | string
  | { symbol: string; ns?: string }
  | { keyword: string; ns?: string }
  | { char: string }
  | EDN[]
  | Map<EDN, EDN>
  | Set<EDN>
  | { list: EDN[] }
  | { meta: Map<EDN, EDN>; value: EDN };

export const ednParseMulti = (s: string): EDN[] => {
  return parse(s) as EDN[];
};

export const ednParse = (edn: string): EDN => {
  return ednParseMulti(edn)[0];
};
