import { parse } from './parser';
import { Map, List, Set } from 'immutable';

export type EDN =
  | number
  | null
  | boolean
  | string
  | { symbol: string; ns?: string }
  | { keyword: string; ns?: string }
  | { char: string }
  | List<EDN>
  | Map<EDN, EDN>
  | Set<EDN>
  | { list: List<EDN> }
  | { meta: Map<EDN, EDN>; value: EDN };

export const ednParseMulti = (s: string): List<EDN> => {
  return parse(s) as List<EDN>;
};

export const ednParse = (edn: string): EDN => {
  return ednParseMulti(edn).first() ?? null;
};
