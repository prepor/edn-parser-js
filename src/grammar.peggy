{{
  import Imm from 'immutable';
}}  

edn_multi = ws? v:value|.., ws| ws? { return Imm.List(v) }

edn = ws? @value ws?

value = nil / true / false / string / char / float / integer / symbol / keyword / list / vector / set / map / ns_map / tag / meta

ws "whitespace" = ([ \t\n\r,] / comment / skip)+

comment = ";" [^\n]* ("\n" / EOF)
skip = "#_" edn
EOF = !.

symbolChar = [-.*+!_?$%&=<>|a-z]i+
notFirstSymbolChar = [:#0-9] / symbolChar

nonNSsymbol = $ ([-+.] [a-z]i notFirstSymbolChar* / symbolChar notFirstSymbolChar*)

nil = "nil" { return null }
true = "true" { return true }
false = "false" { return false }

char = "\\newline" { return {char: "\n" } } / 
       "\\return" { return { char: "\r" } } /
       "\\space" { return {char: " " } } /
       "\\tab" { return {char: "\t" } } /
       "\\u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return {char: String.fromCharCode(parseInt(digits, 16))};
        } /
       "\\" ch:[^\0-\x1F] { return {char: ch } }

HEXDIG = [0-9a-f]i

symbol = ns:(@nonNSsymbol "/")? symbol:nonNSsymbol { 
  if (ns) {
    return {
      ns: ns,
      symbol: symbol
    }
  } else {
    return {
      symbol: symbol
    }
  }
 }

keyword = ":" s: symbol { 
  if (s.ns) {
    return {
      ns: s.ns,
      keyword: s.symbol
    }
  } else {
    return {
      keyword: s.symbol
    }
  }
 }
 
string "string"
  = quotation_mark chars:string_char* quotation_mark { return chars.join(""); }

string_char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\\"]
  
integer = i:$int "N"? { return parseInt(i) }
int = ("+" / "-")? digit+

float = int (frac exp / frac / exp) { return parseFloat(text()) } /
        i:$int "M" { return parseFloat(i) }

decimal_point = "."

e = [eE]

exp = e ("-" / "+")? digit+

frac = decimal_point digit+
  
digit1_9 = [1-9]
  
digit = [0-9]

list = "(" values: edn_multi ")" { return {list: values} }

vector = "[" @edn_multi "]"

set = "#{" values: edn_multi "}" { 
  return Imm.Set(values)
}

map = "{" kv:(k:edn v:edn)+ "}" { 
  return Imm.Map(kv)
}

ns_map = "#:" ns:symbol m:map {
  for (const [k,v] of m) {
    if (k.keyword) {
      if (k.ns == "_") {
        delete k.ns
      } else if (k.ns === undefined) {
        k.ns = ns.symbol
      }
    }
  }
  return m
}

tag = "#" tag:symbol value:edn { return {tag, value} } 

metaVal = tag:symbol { return Imm.Map([[{symbol: 'tag'}, tag]]) } /
          k:keyword { return Imm.Map([[k, true]]) } /
          m:map { return m }

meta = "^" meta:metaVal value:edn { return {meta, value} }