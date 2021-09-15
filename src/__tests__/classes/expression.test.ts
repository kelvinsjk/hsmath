import { Fraction, Term, Expression, SquareRoot, NthRoot } from '../../index';

const oneHalf = new Fraction(1, 2);
const negativeTwoFifth = new Fraction(2, -5);

const zeroX2 = new Term(0, 'x^2');
const negativeX = new Term(-1, 'x');

const oneX = new Term(1, 'x');
const half = new Term(oneHalf);
const negativeTwoFifthSqrt2 = new Term(negativeTwoFifth, '\\sqrt{2}');
const negativeOne = new Term(-1, '');

const sqrtTwo = new SquareRoot(2);
const cubeRootTwo = new NthRoot(2, 3);

const arrayOne = new Expression(zeroX2, negativeX, 1, negativeTwoFifth, negativeTwoFifthSqrt2);
const arrayTwo = new Expression(oneX, negativeX, half, negativeOne);
const arrayThree = new Expression(sqrtTwo, cubeRootTwo, negativeTwoFifthSqrt2);

const one_PLUS_x = new Expression(1, 'x');

test('toString', () => {
  expect(arrayOne.toString()).toBe('- x + \\frac{3}{5} - \\frac{2}{5} \\sqrt{2}');
  expect(arrayOne.toString({ displayMode: true })).toBe('\\displaystyle - x + \\frac{3}{5} - \\frac{2}{5} \\sqrt{2}');
  expect(`${arrayTwo}`).toBe('- \\frac{1}{2}');
  expect(`${one_PLUS_x}`).toBe('1 + x');
  expect(`${arrayThree}`).toBe('\\frac{3}{5} \\sqrt{2} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({ displayMode: true })}`).toBe('\\displaystyle \\frac{3}{5} \\sqrt{2} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({ fractionalCoefficient: false })}`).toBe('\\frac{3 \\sqrt{2}}{5} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({ displayMode: true, fractionalCoefficient: false })}`).toBe(
    '\\displaystyle \\frac{3 \\sqrt{2}}{5} + \\sqrt[3]{2}',
  );

  expect(() => {
    new Expression();
  }).toThrow();
});

test('multiply', () => {
  expect(`${arrayThree.multiply(-2)}`).toBe('- \\frac{6}{5} \\sqrt{2} - 2 \\sqrt[3]{2}');
  expect(`${arrayOne.add(arrayTwo)}`).toBe('- x + \\frac{1}{10} - \\frac{2}{5} \\sqrt{2}');
  expect(arrayOne.multiply(oneHalf).toString()).toBe('- \\frac{1}{2} x + \\frac{3}{10} - \\frac{1}{5} \\sqrt{2}');
});

const xPlusTwo = new Expression(new Term(1, 'x'), 2);
test('solve linear, subtract', () => {
  expect(`${xPlusTwo.solveLinear()}`).toBe('- 2');
  expect(`${xPlusTwo.subtract(2)}`).toBe('x');
  expect(`${xPlusTwo.subtract('x')}`).toBe('2');
  expect(() => `${arrayOne.solveLinear()}`).toThrow(); // more than two terms
  const x2Plus3x = new Expression(new Term(1, 'x^2'), new Term(3, 'x'));
  expect(() => `${x2Plus3x.solveLinear()}`).toThrow(); // no constant term
  const oneThirdMinus2x = new Expression(new Fraction(1, 3), new Term(-2, 'x'));
  expect(`${oneThirdMinus2x.solveLinear()}`).toBe('\\frac{1}{6}');
});

test('clone', () => {
  const xPlusTwoV2 = xPlusTwo.clone();
  xPlusTwoV2.reverse();
  expect(`${xPlusTwo}`).toBe('x + 2');
  expect(`${xPlusTwoV2}`).toBe('2 + x');

})
