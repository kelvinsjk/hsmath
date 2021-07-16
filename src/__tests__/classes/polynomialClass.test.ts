import { Term, PolynomialTerm, Polynomial, Fraction } from '../../index';

const twoX = new PolynomialTerm(2);
const threeX2 = new PolynomialTerm(3, 'x', 2);
const oneHalfY10 = new PolynomialTerm(new Fraction(1,2), 'y', 10);
const sixX3 = twoX.multiply(threeX2);
const x2Plus3xMinus5 = new Polynomial([-5, 3, 1]);
const x = new Polynomial([1], { initialDegree: 1 });
const sinXCubeLR = new Polynomial([1], { initialDegree: 3, variableAtom: '\\sin x', brackets: 'lr' });
const sinXTenLR = new Polynomial([1], { initialDegree: 10, variableAtom: '\\sin x', brackets: 'lr' });
const sinXTen = new Polynomial([1], { initialDegree: 10, variableAtom: '\\sin x', brackets: true });
const xMinus1 = new Polynomial([-1, 1]);

const sqrt2Term = new Term(1, '\\sqrt{2}');

//console.log(x2Plus3XMinus5.terms)

test('toString', () => {
  expect(`${twoX}`).toBe('2 x');
  expect(`${threeX2}`).toBe('3 x^2');
  expect(`${oneHalfY10}`).toBe('\\frac{1}{2} y^{10}');
  expect(`${sixX3}`).toBe('6 x^3');
  expect(`${x2Plus3xMinus5}`).toBe('- 5 + 3 x + x^2');

  expect(`${x2Plus3xMinus5.multiply(twoX)}`).toBe('- 10 x + 6 x^2 + 2 x^3');
  expect(`${x2Plus3xMinus5.multiply(x)}`).toBe('- 5 x + 3 x^2 + x^3');
  expect(`${x2Plus3xMinus5.multiply(xMinus1)}`).toBe('5 - 8 x + 2 x^2 + x^3');
  expect(`${x2Plus3xMinus5.reverse()}`).toBe('x^2 + 3 x - 5');
  expect(`${sinXCubeLR}`).toBe('\\left( \\sin x \\right)^3');
  expect(`${sinXTenLR}`).toBe('\\left( \\sin x \\right)^{10}');
  expect(`${sinXTen}`).toBe('( \\sin x )^{10}');

  expect(() => { new Polynomial([]) }).toThrow();

})

test('multiply', () => {
  expect(`${threeX2.multiply(oneHalfY10)}`).toBe('\\frac{3}{2} x^2 y^{10}');
  expect(`${twoX.multiply(sqrt2Term)}`).toBe('2 x \\sqrt{2}');

})
