import { Fraction, Term } from '../../index';

const oneHalf = new Fraction(1, 2);
const negativeTwoFifth = new Fraction(2, -5);

const oneX = new Term(1, 'x');
const half = new Term(oneHalf);
const negativeTwoFifthSqrt2 = new Term(negativeTwoFifth, '\\sqrt{2}');
const zeroX2 = new Term(0, 'x^2');
const negativeOne = new Term(-1, '');
const negativeX = new Term(-1, 'x');
const twoX = new Term(2, 'x');
const halfX = new Term(oneHalf, 'x');

test('toString', () => {
  expect(oneX.toString()).toBe('x');
  expect(`${half}`).toBe('\\frac{1}{2}');
  expect(`${negativeTwoFifthSqrt2}`).toBe('- \\frac{2}{5} \\sqrt{2}');
  expect(negativeTwoFifthSqrt2.toString({ displayMode: true })).toBe('\\displaystyle - \\frac{2}{5} \\sqrt{2}');
  expect(negativeTwoFifthSqrt2.toString({ fractionalCoefficient: false })).toBe('- \\frac{2 \\sqrt{2}}{5}');
  expect(twoX.toString({ fractionalCoefficient: false })).toBe('2 x');
  expect(halfX.toString({ fractionalCoefficient: false })).toBe('\\frac{x}{2}');
  expect(zeroX2.toString()).toBe('0');
  expect(negativeX.toString()).toBe('- x');
  expect(negativeOne.toString()).toBe('-1');
});

test('multiplication', () => {
  expect(`${oneX.multiply(3)}`).toBe('3 x');
  expect(`${oneX.multiply(oneHalf)}`).toBe('\\frac{1}{2} x');
  expect(`${oneX.multiply(half)}`).toBe('\\frac{1}{2} x');
  expect(`${oneX.multiply(negativeTwoFifthSqrt2)}`).toBe('- \\frac{2}{5} x \\sqrt{2}');
  expect(`${oneX.multiply(negativeX, { variable: 'x^2' })}`).toBe('- x^2');
  expect(`${half.multiply(negativeX)}`).toBe('- \\frac{1}{2} x');

  expect(`${halfX.negative()}`).toBe('- \\frac{1}{2} x');
});
