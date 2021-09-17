import { Ln, Fraction } from '../../index';

const ln2 = new Ln(2);
const ln3 = new Ln(3);
const lnOneSixth = new Ln(new Fraction(1, 6));
const ln16 = new Ln(16);
const twoLn3 = new Ln(3, 2);
const ln4 = ln2.plus(ln2);
const lnTwoThird = ln2.minus(ln3);
const negativeLn2 = ln2.negative();

test('ln class', () => {
  expect(() => new Ln(-1)).toThrow();
  expect(() => twoLn3.plus(ln2)).toThrow();
  expect(() => twoLn3.minus(ln2)).toThrow();
  expect(`${ln4}`).toBe('\\ln 4');
  expect(`${lnTwoThird}`).toBe('\\ln \\frac{2}{3}');
  expect(`${ln16.simplify()}`).toBe('4 \\ln 2');
  expect(`${lnOneSixth.simplify()}`).toBe('- \\ln 6');
  expect(`${negativeLn2}`).toBe('- \\ln 2');
  expect(ln2.valueOf()).toBeCloseTo(Math.LN2);
});
