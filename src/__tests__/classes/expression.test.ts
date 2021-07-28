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
