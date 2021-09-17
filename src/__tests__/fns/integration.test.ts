import { Angle, ExpFn, PowerFn, CosFn, SinFn, LnFn, integrate, Term } from '../../index';

const ex = new ExpFn();
const one = new PowerFn({ n: 0 });
const x = new PowerFn();
const nineX2 = new PowerFn({ coeff: 9, n: 2 });

const sinX = new SinFn();
const sin4X = new SinFn({ a: 4 });
const cos2X = new CosFn({ a: 2 });
const piOver4 = new Angle(45);
const piOver2 = new Angle(90);

const exp2xIntegral = new ExpFn({ a: 2 }).definiteIntegral(4, 5);
const x_exIntegral = integrate.byParts(x, ex, [4, 5]).multiply(6);
const nineX2Integral = nineX2.definiteIntegral(4, 5);
const definite = exp2xIntegral.subtract(x_exIntegral).add(nineX2Integral);

test('powerFn', () => {
  expect(`${x.integral()}`).toBe('\\frac{1}{2} x^{ 2 }');
  expect(`${x.definiteIntegral(piOver4, piOver2)}`).toBe('\\frac{3}{32} \\left( \\pi \\right)^{ 2 }');
  const twoXPlus1 = new PowerFn({ a: 2, b: 1 });
  const five_twoXPlus1 = new PowerFn({ a: 2, b: 1, coeff: 5 });
  const twoXPlus1Square = new PowerFn({ a: 2, b: 1, n: 2 });
  const five_twoXPlus1Square = new PowerFn({ a: 2, b: 1, n: 2, coeff: 5 });
  expect(`${twoXPlus1.algebraicValueAt(new Term(1, 'y^2'))}`).toBe('2 y^2 + 1');
  expect(`${five_twoXPlus1.algebraicValueAt(new Term(1, 'y^2'))}`).toBe('5 \\left( 2 y^2 + 1 \\right)');
  expect(`${twoXPlus1Square.algebraicValueAt(new Term(1, 'y^2'))}`).toBe('\\left( 2 y^2 + 1 \\right)^{ 2 }');
  expect(`${five_twoXPlus1Square.algebraicValueAt(new Term(1, 'y^2'))}`).toBe('5 \\left( 2 y^2 + 1 \\right)^{ 2 }');
  expect(() => new PowerFn({ a: 0 })).toThrow();
  expect(twoXPlus1.toNumberFunction()(2)).toBe(5);

  const twoOver3xPlus4 = new PowerFn({ a: 3, b: 4, coeff: 2, n: -1 });
  expect(() => twoOver3xPlus4.integral()).toThrow();
  expect(() => twoXPlus1.lnIntegral()).toThrow();
  expect(`${twoOver3xPlus4.lnIntegral()}`).toBe('\\frac{2}{3} \\ln \\left| 3 x + 4 \\right|');
  expect(`${twoOver3xPlus4.lnDefiniteIntegral(0, 1)}`).toBe('\\frac{2}{3} \\ln \\frac{7}{4}');
});

test('by parts', () => {
  expect(`${integrate.byParts(one, cos2X)}`).toBe('\\frac{1}{2} \\sin ( 2 x )');
  expect(`${integrate.byParts(x, sinX)}`).toBe('- x \\cos x + \\sin x');
  expect(`${integrate.byParts(x, sinX)}`).toBe('- x \\cos x + \\sin x');
  expect(`${integrate.byParts(x, sinX, [0, piOver2])}`).toBe('1');
  expect(`${integrate.byParts(x, sin4X, [0, 90])}`).toBe('- \\frac{1}{8} \\pi');
  expect(`${integrate.byParts(x, sinX, [piOver2, 0])}`).toBe('- 1');
  expect(`${integrate.byParts(one, ex)}`).toBe('\\mathrm{e}^{x}');
  expect(`${integrate.byParts(x, ex)}`).toBe('x \\mathrm{e}^{x} - \\mathrm{e}^{x}');
  expect(`${integrate.byParts(one, ex, [0, 1])}`).toBe('\\mathrm{e} - 1');
  expect(`${integrate.byParts(x, ex, [0, 1])}`).toBe('1');
  expect(definite.toString()).toBe(
    '\\frac{1}{2} \\mathrm{e}^{10} - \\frac{1}{2} \\mathrm{e}^{8} - 24 \\mathrm{e}^{5} + 18 \\mathrm{e}^{4} + 183',
  );

  const xHalf = new PowerFn({ n: -1 });
  expect(() => integrate.byParts(xHalf, sinX)).toThrow();
  expect(() => integrate.byParts(xHalf, x)).toThrow();
});

test('ln', () => {
  const lnX = new LnFn();
  const lnXSquare = new LnFn({ n: 2 });
  expect(`${integrate.byParts(lnX, one)}`).toBe('x \\ln x - x');
  expect(`${integrate.byParts(lnX, one, [1, 2])}`).toBe('2 \\ln 2 - 1');
  expect(`${integrate.byParts(lnX, x)}`).toBe('\\frac{1}{2} x^{ 2 } \\ln x - \\frac{1}{4} x^{ 2 }');
  expect(`${integrate.byParts(lnX, x, [1, 2])}`).toBe('2 \\ln 2 - \\frac{3}{4}');
  expect(`${integrate.byParts(lnXSquare, one)}`).toBe('x \\left( \\ln x \\right)^2 - 2 x \\ln x + 2 x');
  expect(`${integrate.byParts(lnXSquare, one, [1, 2])}`).toBe('2 \\left( \\ln 2 \\right)^2 - 4 \\ln 2 + 2');

  expect(() => integrate.byParts(lnX, sinX)).toThrow();
  expect(() => integrate.byParts(new LnFn({ a: 2 }), new PowerFn())).toThrow();
});
