import { Polynomial, Fraction, Term, Expression, SquareRoot, NthRoot } from '../../index';

const oneHalf = new Fraction(1, 2);
const negativeTwoFifth = new Fraction(2, -5);

const zeroX2 = new Term(0, 'x^2');
const negativeX = new Term(-1, 'x');

const oneX = new Term(1, 'x');
const half = new Term(oneHalf);
const negativeTwoFifthSqrt2 = new Term(negativeTwoFifth, '\\sqrt{2}')
const negativeOne = new Term(-1, '');

const sqrtTwo = new SquareRoot(2);
const cubeRootTwo = new NthRoot(2, 3);

const arrayOne = new Expression(zeroX2, negativeX, 1, negativeTwoFifth, negativeTwoFifthSqrt2)
const arrayTwo = new Expression(oneX, negativeX, half, negativeOne);
const arrayThree = new Expression(sqrtTwo, cubeRootTwo, negativeTwoFifthSqrt2);

test('toString', () => {
  expect(arrayOne.toString()).toBe('- x + \\frac{3}{5} - \\frac{2}{5} \\sqrt{2}');
  expect(arrayOne.toString({displayMode: true})).toBe('\\displaystyle - x + \\frac{3}{5} - \\frac{2}{5} \\sqrt{2}');
  expect(`${arrayTwo}`).toBe('- \\frac{1}{2}');
  expect(`${arrayThree}`).toBe('\\frac{3}{5} \\sqrt{2} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({displayMode: true})}`).toBe('\\displaystyle \\frac{3}{5} \\sqrt{2} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({ fractionalCoefficient: false })}`).toBe('\\frac{3 \\sqrt{2}}{5} + \\sqrt[3]{2}');
  expect(`${arrayThree.toString({displayMode: true, fractionalCoefficient: false })}`).toBe('\\displaystyle \\frac{3 \\sqrt{2}}{5} + \\sqrt[3]{2}');

  expect(() => { new Expression() }).toThrow();
})

const polyOne = new Polynomial([1, 2, 0, -3, oneHalf]);
const polyTwo = new Polynomial([-4, 0, 3], { variableAtom: '\\sin x', brackets: true});
const polyThree = new Polynomial([-4, 0, 3], { variableAtom: '\\sin x', brackets: 'lr' });
const polyFour = new Polynomial([1, 2, 0, -3, oneHalf], {initialDegree: 7, ascendingOrder: false});

test('Polynomial', () => {
  expect(polyOne.toString()).toBe('1 + 2 x - 3 x^3 + \\frac{1}{2} x^4');  
  expect(polyTwo.toString()).toBe('- 4 + 3 ( \\sin x )^2');  
  expect(polyThree.toString()).toBe('- 4 + 3 \\left( \\sin x \\right)^2');  
  expect(polyFour.toString()).toBe('x^7 + 2 x^6 - 3 x^4 + \\frac{1}{2} x^3');  
  expect(polyFour.reverse().toString()).toBe('\\frac{1}{2} x^3 - 3 x^4 + 2 x^6 + x^7');  
  expect(polyFour.toString()).toBe('\\frac{1}{2} x^3 - 3 x^4 + 2 x^6 + x^7');  
})