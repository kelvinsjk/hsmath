import { Fraction, Complex, ComplexExp, SquareRoot } from '../../index';

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

const z1 = new ComplexExp(2, 60);
const z2 = new ComplexExp(new SquareRoot(2), -45);
const z3 = new ComplexExp(2, 30);
const z4 = z1.divide(z2.times(z3));
const z5 = new ComplexExp(1, 120);
const zero2 = new ComplexExp(0, 120);

test('complex exp', () => {
  expect(`${z1}`).toBe('2 \\mathrm{e}^{ \\frac{1}{3} \\pi \\mathrm{i} }');
  expect(`${z1.divide(2)}`).toBe('\\mathrm{e}^{ \\frac{1}{3} \\pi \\mathrm{i} }');
  expect(`${z2}`).toBe('\\sqrt{2} \\mathrm{e}^{ - \\frac{1}{4} \\pi \\mathrm{i} }');
  expect(`${z1.toCartesianString()}`).toBe('1 + \\sqrt{3} \\mathrm{i}');
  expect(`${z2.toCartesianString()}`).toBe('1 - \\mathrm{i}');
  expect(`${z3.toPolarString()}`).toBe(
    '2 \\left( \\cos \\frac{1}{6} \\pi + \\mathrm{i} \\sin \\frac{1}{6} \\pi \\right)',
  );
  expect(`${z3.toCartesianString()}`).toBe('\\sqrt{3} + \\mathrm{i}');
  expect(`${z4.toPolarString()}`).toBe(
    '\\frac{1}{2} \\sqrt{2} \\left( \\cos \\frac{5}{12} \\pi + \\mathrm{i} \\sin \\frac{5}{12} \\pi \\right)',
  );
  expect(`${z5}`).toBe('\\mathrm{e}^{ \\frac{2}{3} \\pi \\mathrm{i} }');
  expect(`${z5.toPolarString()}`).toBe('\\cos \\frac{2}{3} \\pi + \\mathrm{i} \\sin \\frac{2}{3} \\pi');
  expect(`${z5.toCartesianString()}`).toBe('- \\frac{1}{2} + \\frac{1}{2} \\sqrt{3} \\mathrm{i}');
  expect(`${z5.negative().toCartesianString()}`).toBe('\\frac{1}{2} - \\frac{1}{2} \\sqrt{3} \\mathrm{i}');
  expect(`${z5.conjugate().toCartesianString()}`).toBe('- \\frac{1}{2} - \\frac{1}{2} \\sqrt{3} \\mathrm{i}');
  expect(`${zero2.toPolarString()}`).toBe('0');
});
