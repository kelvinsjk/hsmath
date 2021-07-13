import { Fraction, Term } from '../../index';

const oneHalf = new Fraction(1, 2);
const negativeTwoFifth = new Fraction(2, -5);

const oneX = new Term(1, 'x');
const half = new Term(oneHalf);
const negativeTwoFifthSqrt2 = new Term(negativeTwoFifth, '\\sqrt{2}')
const zeroX2 = new Term(0, 'x^2');
const negativeOne = new Term(-1, '');
const negativeX = new Term(-1, 'x');

test('toString', () => {
  expect(oneX.toString()).toBe('x');
  expect(`${half}`).toBe('\\frac{1}{2}');
  expect(`${negativeTwoFifthSqrt2}`).toBe('-\\frac{2}{5} \\sqrt{2}');
  expect(negativeTwoFifthSqrt2.toString(true)).toBe('\\displaystyle -\\frac{2}{5} \\sqrt{2}');
  expect(zeroX2.toString()).toBe('0');
  expect(negativeX.toString()).toBe('-x');
  expect(negativeOne.toString()).toBe('-1');
})