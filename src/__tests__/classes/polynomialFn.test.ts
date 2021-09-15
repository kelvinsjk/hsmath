import { PolynomialFn, Fraction, Term } from '../../index';

const oneHalf = new Fraction(1, 2);

const xMinus1 = new PolynomialFn([1, -1]);
const minus5_PLUS_3x_PLUS_x2 = new PolynomialFn([1, 3, -5]); // before sort: descending

const polyOne = new PolynomialFn([1, 2, 0, -3, oneHalf]);

test('PolynomialFn', () => {
  expect(`${xMinus1.valueAt(1)}`).toBe('0');
  expect(`${xMinus1}`).toBe('x - 1');
  expect(`${xMinus1.algebraicValueAt(new Term(1, 'y'))}`).toBe('y - 1');
  expect(xMinus1.toNumberFunction()(1)).toBe(0);
  expect(`${minus5_PLUS_3x_PLUS_x2.derivative()}`).toBe('2 x + 3');
  expect(`${polyOne.integral()}`).toBe('\\frac{1}{5} x^5 + \\frac{1}{2} x^4 - \\frac{3}{2} x^2 + \\frac{1}{2} x');
  expect(`${xMinus1.definiteIntegral(0, 1)}`).toBe('- \\frac{1}{2}');
  expect(`${minus5_PLUS_3x_PLUS_x2.scale(2)}`).toBe('4 x^2 + 6 x - 5');
  expect(`${minus5_PLUS_3x_PLUS_x2.shift(1)}`).toBe('x^2 + 5 x - 1');
  expect(`${minus5_PLUS_3x_PLUS_x2.transform(new Fraction(1,2), new Fraction(1,3))}`).toBe('\\frac{1}{4} x^2 + \\frac{11}{6} x - \\frac{35}{9}');
});

