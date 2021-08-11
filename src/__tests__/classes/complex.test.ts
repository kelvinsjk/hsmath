import { Fraction, Complex } from '../../index';

const oneHalf = new Fraction(1, 2);
const zero = new Complex(0);
const two_PLUS_i = new Complex(2, 1);
const two_MINUS_i = two_PLUS_i.conjugate();
const threeI = new Complex(0, 3);
const four_PLUS_threeI = new Complex(4, 3);
const negativeOne_PLUS_halfI = new Complex(-1, oneHalf);

test('complex', () => {
  expect(`${zero}`).toBe('0');
  expect(`${threeI}`).toBe('3 \\mathrm{i}');
  expect(`${two_PLUS_i}`).toBe('2 + \\mathrm{i}');
  expect(`${two_MINUS_i}`).toBe('2 - \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI}`).toBe('- 1 + \\frac{1}{2} \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI.plus(1)}`).toBe('\\frac{1}{2} \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI.plus(oneHalf)}`).toBe('- \\frac{1}{2} + \\frac{1}{2} \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI.plus(two_PLUS_i)}`).toBe('1 + \\frac{3}{2} \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI.minus(two_PLUS_i)}`).toBe('- 3 - \\frac{1}{2} \\mathrm{i}');
  expect(`${negativeOne_PLUS_halfI.times(two_PLUS_i)}`).toBe('- \\frac{5}{2}');
  expect(`${two_PLUS_i.times(3)}`).toBe('6 + 3 \\mathrm{i}');
  expect(`${two_PLUS_i.times(zero)}`).toBe('0');
  expect(`${two_PLUS_i.divide(four_PLUS_threeI)}`).toBe('\\frac{11}{25} - \\frac{2}{25} \\mathrm{i}');

  expect(`${two_PLUS_i.toQuadratic()}`).toBe('z^2 - 4 z + 5');
  expect(`${two_PLUS_i.modulusSquared()}`).toBe('5');
});
