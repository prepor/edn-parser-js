import { ednParse, ednParseMulti, EDN } from '../src';
import { Map, List, Set } from 'immutable';

describe('parsing', () => {
  describe('symbols', () => {
    it('should parse a symbol', () => {
      expect(ednParse('foo')).toEqual({ symbol: 'foo' });
      expect(ednParse('foo|123<>+-')).toEqual({ symbol: 'foo|123<>+-' });

      expect(ednParse('bar/foo')).toEqual({ ns: 'bar', symbol: 'foo' });

      expect(ednParseMulti('-a1 a:#')).toEqual(
        List([{ symbol: '-a1' }, { symbol: 'a:#' }])
      );
    });
  });

  describe('keywords', () => {
    it('should parse a keyword', () => {
      expect(ednParse(':foo')).toEqual({ keyword: 'foo' });

      expect(ednParse(':bar/foo')).toEqual({ ns: 'bar', keyword: 'foo' });
    });
  });

  describe('special symbols', () => {
    it('should parse a special symbol', () => {
      expect(ednParseMulti('true false nil')).toEqual(
        List([true, false, null])
      );
    });
  });

  describe('integers', () => {
    it('should parse a integer', () => {
      expect(ednParseMulti('1 123 123N')).toEqual(List([1, 123, 123]));
    });
  });

  describe('float', () => {
    it('should parse a float', () => {
      expect(ednParseMulti('1.123 1E4 1M')).toEqual(List([1.123, 10000, 1]));
    });
  });

  describe('chars', () => {
    it('should parse a char', () => {
      expect(ednParseMulti('\\a \\tab \\newline')).toEqual(
        List([{ char: 'a' }, { char: '\t' }, { char: '\n' }])
      );

      expect(ednParse('\\u03A9')).toEqual({ char: 'Ω' });
    });
  });

  describe('strings', () => {
    it('should parse a string', () => {
      expect(ednParse('"hello world"')).toEqual('hello world');
      expect(ednParse('"hello\nworld"')).toEqual('hello\nworld');
    });
  });

  describe('comments', () => {
    it('should skip comments', () => {
      expect(ednParse(';123\n123;123')).toEqual(123);

      expect(ednParse('#_ [1 2 3] 123 #_ (1,2,3)')).toEqual(123);
    });
  });

  describe('lists', () => {
    it('should parse a list', () => {
      expect(ednParse('(1 2 3)')).toEqual({ list: List([1, 2, 3]) });

      expect(ednParse('(1,2,3)')).toEqual({ list: List([1, 2, 3]) });
    });
  });

  describe('vectors', () => {
    it('should parse a vector', () => {
      expect(ednParse('[1 2 3]')).toEqual(List([1, 2, 3]));
    });
  });

  describe('maps', () => {
    it('should parse a map', () => {
      expect(ednParse('{1 2 3 4}')).toEqual(
        Map([
          [1, 2],
          [3, 4],
        ])
      );
    });

    it('should work with complex keys', () => {
      expect(
        (ednParse('{[1 2] 2}') as Map<EDN, EDN>).get(List([1, 2]))
      ).toEqual(2);
    });
  });

  describe('sets', () => {
    it('should parse a set', () => {
      expect(ednParse('#{1 2 3 }')).toEqual(Set([1, 2, 3]));
    });
  });

  describe('tags', () => {
    it('should parse a tag', () => {
      expect(ednParse('#foo 123')).toEqual({
        tag: { symbol: 'foo' },
        value: 123,
      });

      expect(ednParse('#foo/bar 123')).toEqual({
        tag: { ns: 'foo', symbol: 'bar' },
        value: 123,
      });
    });
  });

  describe('namespaced maps', () => {
    it('should parse a namespaced map', () => {
      expect(ednParse('#:foo{:bar 1 :_/bar 2 :baz/bar 3 "str" 4}')).toEqual(
        Map<EDN, EDN>([
          [{ keyword: 'bar', ns: 'foo' }, 1],
          [{ keyword: 'bar' }, 2],
          [{ keyword: 'bar', ns: 'baz' }, 3],
          ['str', 4],
        ])
      );
    });
  });

  describe('meta', () => {
    it('should parse a meta', () => {
      expect(ednParse('^foo [1 2]')).toEqual({
        meta: Map([[{ symbol: 'tag' }, { symbol: 'foo' }]]),
        value: List([1, 2]),
      });
      expect(ednParse('^:foo [1 2]')).toEqual({
        meta: Map([[{ keyword: 'foo' }, true]]),
        value: List([1, 2]),
      });
      expect(ednParse('^{[3] :b} [1 2]')).toEqual({
        meta: Map([[List([3]), { keyword: 'b' }]]),
        value: List([1, 2]),
      });
    });
  });
});
