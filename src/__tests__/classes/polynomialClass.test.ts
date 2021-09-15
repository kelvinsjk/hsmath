import { Polynomial, Fraction } from '../../index';

const oneHalf = new Fraction(1, 2);

const twoX = new Polynomial([2], { initialDegree: 1 });
const threeX2 = new Polynomial([3], { initialDegree: 2 });
const oneHalfY10 = new Polynomial([oneHalf], { variableAtom: 'y', initialDegree: 10 });
const sixX3 = twoX.multiply(threeX2);
const x = new Polynomial([1], { initialDegree: 1 });
const sinXCubeLR = new Polynomial([1], { initialDegree: 3, variableAtom: '\\sin x', brackets: 'lr' });
const sinXTenLR = new Polynomial([1], { initialDegree: 10, variableAtom: '\\sin x', brackets: 'lr' });
const sinXTen = new Polynomial([1], { initialDegree: 10, variableAtom: '\\sin x', brackets: true });
const xMinus1 = new Polynomial([1, -1]);
const minus5_PLUS_3x_PLUS_x2 = new Polynomial([1, 3, -5]); // before sort: descending
minus5_PLUS_3x_PLUS_x2.sort(); // ascending now

const polyOne = new Polynomial([1, 2, 0, -3, oneHalf]);
const polyTwo = new Polynomial([-4, 0, 3], { variableAtom: '\\sin x', brackets: true });
const polyThree = new Polynomial([-4, 0, 3], { variableAtom: '\\sin x', brackets: 'lr', ascending: true });
const polyFour = new Polynomial([1, 2, 0, -3, oneHalf], { initialDegree: 7, ascending: false });

test('Polynomial', () => {
  expect(polyOne.toString()).toBe('x^4 + 2 x^3 - 3 x + \\frac{1}{2}');
  expect(polyTwo.toString()).toBe('- 4 ( \\sin x )^2 + 3');
  expect(polyThree.toString()).toBe('- 4 + 3 \\left( \\sin x \\right)^2');
  expect(polyFour.toString()).toBe('x^7 + 2 x^6 - 3 x^4 + \\frac{1}{2} x^3');
  expect(polyFour.reverse().toString()).toBe('\\frac{1}{2} x^3 - 3 x^4 + 2 x^6 + x^7');
  expect(polyFour.toString()).toBe('\\frac{1}{2} x^3 - 3 x^4 + 2 x^6 + x^7');
});

test('toString', () => {
  expect(`${twoX}`).toBe('2 x');
  expect(`${threeX2}`).toBe('3 x^2');
  expect(`${oneHalfY10}`).toBe('\\frac{1}{2} y^{10}');
  expect(`${sixX3}`).toBe('6 x^3');
  expect(`${minus5_PLUS_3x_PLUS_x2}`).toBe('- 5 + 3 x + x^2');

  expect(() => {
    new Polynomial([]);
  }).toThrow();

  expect(`${minus5_PLUS_3x_PLUS_x2.multiply(2)}`).toBe('2 x^2 + 6 x - 10');
  expect(`${minus5_PLUS_3x_PLUS_x2.multiply(twoX, { ascending: false })}`).toBe('2 x^3 + 6 x^2 - 10 x');
  expect(`${minus5_PLUS_3x_PLUS_x2.multiply(x, { ascending: true })}`).toBe('- 5 x + 3 x^2 + x^3');
  expect(`${minus5_PLUS_3x_PLUS_x2.multiply(xMinus1, { ascending: false })}`).toBe('x^3 + 2 x^2 - 8 x + 5');

  const x2_PLUS_3x_MINUS_5 = minus5_PLUS_3x_PLUS_x2.sort(false);

  expect(`${x2_PLUS_3x_MINUS_5}`).toBe('x^2 + 3 x - 5');
  expect(`${minus5_PLUS_3x_PLUS_x2}`).toBe('x^2 + 3 x - 5');
  expect(`${x2_PLUS_3x_MINUS_5.multiply(xMinus1)}`).toBe('x^3 + 2 x^2 - 8 x + 5');
  expect(`${sinXCubeLR}`).toBe('\\left( \\sin x \\right)^3');
  expect(`${sinXTenLR}`).toBe('\\left( \\sin x \\right)^{10}');
  expect(`${sinXTen}`).toBe('( \\sin x )^{10}');
});

test('fromRoots, add', () => {
  const xPlus1 = Polynomial.fromRoots(-1);
  const twoX2_PLUS_x_MINUS_1 = Polynomial.fromRoots(oneHalf, -1);
  const x3_MINUS_x = Polynomial.fromRoots(0, xMinus1, xPlus1);

  expect(`${xPlus1}`).toBe('x + 1');
  expect(`${twoX2_PLUS_x_MINUS_1}`).toBe('2 x^2 + x - 1');
  expect(`${twoX2_PLUS_x_MINUS_1.add(1)}`).toBe('2 x^2 + x');
  expect(`${twoX2_PLUS_x_MINUS_1.add(new Fraction(1, 2))}`).toBe('2 x^2 + x - \\frac{1}{2}');
  expect(`${twoX2_PLUS_x_MINUS_1.add(xPlus1)}`).toBe('2 x^2 + 2 x');
  expect(`${twoX2_PLUS_x_MINUS_1.subtract(1)}`).toBe('2 x^2 + x - 2');
  expect(`${twoX2_PLUS_x_MINUS_1.subtract(new Fraction(1, 2))}`).toBe('2 x^2 + x - \\frac{3}{2}');
  expect(`${twoX2_PLUS_x_MINUS_1.subtract(xPlus1)}`).toBe('2 x^2 - 2');
  expect(`${x3_MINUS_x}`).toBe('x^3 - x');

  expect(() => {
    Polynomial.fromRoots();
  }).toThrow();
});

test('square, pow, substitute, truncate', () => {
  const xPlus1 = new Polynomial([1, 1]);
  expect(() => `${xPlus1.pow(2.1)}`).toThrow();
  expect(() => `${xPlus1.pow(-2)}`).toThrow();
  expect(`${xPlus1.square()}`).toBe(`x^2 + 2 x + 1`);
  expect(`${xPlus1.pow(3)}`).toBe(`x^3 + 3 x^2 + 3 x + 1`);
  const x2Plus2xMinus1 = new Polynomial([1, 2, -1]);
  expect(`${x2Plus2xMinus1.substitute(1)}`).toBe('2');
  expect(`${x2Plus2xMinus1.substitute(new Fraction(1, 2))}`).toBe('\\frac{1}{4}');
  expect(`${x2Plus2xMinus1.substitute(xPlus1)}`).toBe('x^2 + 4 x + 2');
  expect(`${x2Plus2xMinus1.shift(1)}`).toBe('x^2 + 4 x + 2');
  expect(`${x2Plus2xMinus1.shift(new Fraction(-1, 2))}`).toBe('x^2 + x - \\frac{7}{4}');
  expect(`${x2Plus2xMinus1.truncate(1)}`).toBe('2 x - 1');
  expect(`${x2Plus2xMinus1.scale(2)}`).toBe('4 x^2 + 4 x - 1');
  expect(`${x2Plus2xMinus1.scale(new Fraction(1, 2))}`).toBe('\\frac{1}{4} x^2 + x - 1');
});

test('solve quadratic', () => {
  const x2Plus2xMinus1 = new Polynomial([1, 2, -1]);
  const x2Plus2Minus3 = new Polynomial([-1, -2, 3]);
  const x2Plus2Plus2 = new Polynomial([1, 2, 2]);
  const [root1, root2] = x2Plus2xMinus1.solveQuadratic();
  const [root3, root4] = x2Plus2Minus3.solveQuadratic();
  expect(() => x2Plus2Plus2.solveQuadratic()).toThrow(); // complex roots
  const cubic = new Polynomial([1, 2, 3, 4]);
  const cubic3 = new Polynomial([1, 2, 0, 4]);
  const cubic2 = new Polynomial([1, 2, 3], { initialDegree: 3 });
  const linear = new Polynomial([1, 2]);
  expect(() => cubic.solveQuadratic()).toThrow(); // cubic
  expect(() => cubic2.solveQuadratic()).toThrow(); // cubic
  expect(() => cubic3.solveQuadratic()).toThrow(); // cubic
  expect(() => linear.solveQuadratic()).toThrow(); // linear
  expect(`${root1}`).toBe('- 1 - \\sqrt{2}');
  expect(`${root2}`).toBe('- 1 + \\sqrt{2}');
  expect(`${root3}`).toBe('- 3');
  expect(`${root4}`).toBe('1');
  x2Plus2Minus3.sort();
  const [root5] = x2Plus2Minus3.solveQuadratic();
  expect(`${root5}`).toBe('- 3');
  const quadratic1 = new Polynomial([1, 2, 3], { initialDegree: 1 });
  expect(() => quadratic1.solveQuadratic()).toThrow();
});

test('long division', () => {
  const x2Plus2xMinus1 = new Polynomial([1, 2, -1]);
  const xPlusOne = new Polynomial([1, 1]);
  const [quotient, remainder] = x2Plus2xMinus1.longDivide(xPlusOne);
  //const [quotient, remainder] = xPlusOne.longDivide(x2Plus2xMinus1);
  expect(`${quotient}`).toBe('x + 1');
  expect(`${remainder}`).toBe('- 2');
});
