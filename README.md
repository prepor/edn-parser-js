# edn-parser-js

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]

EDN parser library for JS/TS.

## Rationaly

There are a number of existing EDN parsers for JS/TS. But I'm not aware of one that supports all EDN features that modern Clojure could emit/parse. First of all, it's [namespaced maps](https://clojure.org/reference/reader#_maps) introduced in Clojure 1.9

This parser is trying to support everything that Clojure could emit and parse using `clojure.edn`, even if it's not in [EDN "spec"](https://github.com/edn-format/edn). It includes namespaced maps, `|` in symbols/keywords, metadata parsing.

## Types mapping

| EDN Type      | TS Type                             | EDN Value             | JS Value                              |
| ------------- | ----------------------------------- | --------------------- | ------------------------------------- |
| integer/float | number                              | 123                   | 123                                   |
| nil           | null                                | nil                   | null                                  |
| boolean       | boolean                             | true                  | true                                  |
| string        | string                              | "hello"               | "hello!"                              |
| char          | { char: string }                    | \a                    | { char: "a" }                         |
| symbol        | { symbol: string; ns?: string }     | foo                   | { symbol: "foo" }                     |
|               |                                     | bar/foo               | { symbol: "foo", ns: "bar" }          |
| keyword       | { keyword: string; ns?: string }    | :foo                  | { keyword: "foo" }                    |
|               |                                     | :bar/foo              | { keyword: "foo", ns: "bar" }         |
| vector        | EDN[]                               | [1 2 3]               | [1, 2, 3]                             |
| map           | Map<EDN, EDN>                       | {"hello" "world}      | new Map([["hello", "world"]])         |
| set           | Set<EDN>                            | #{1 2 3}              | new Set([1, 2, 3])                    |
| list          | { list: EDN[] }                     | (1 2 3)               | {list: [1, 2 ,3] }                    |
| ^meta ...     | { meta: Map<EDN, EDN>; value: EDN } | ^{"comment": "hi"} [] | { meta: {"comment": "hi"}, value: []} |

## Install

```bash
npm install edn-parser-js
```

## Usage

```ts
import { ednParse } from 'edn-parser-js';

ednParse('{:hello "world"}');
//=> Map(1) { { keyword: 'hello' } => 'world' }
```

## API

```ts
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
```

### ednParse(string): EDN

### ednParseMulti(string): EDN[]

[build-img]: https://github.com/prepor/edn-parser-js/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/prepor/edn-parser-js/actions/workflows/release.yml
[npm-img]: https://img.shields.io/npm/v/edn-parser-js
[npm-url]: https://www.npmjs.com/package/edn-parser-js
