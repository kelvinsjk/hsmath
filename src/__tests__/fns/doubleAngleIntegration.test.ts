import { Angle, Fraction, integrate } from '../../index';

const piOver2 = new Angle(90);
const piOver3 = new Angle(60);
const piOver4 = new Angle(45);

test('doubleAngle', () => {
  expect(`${integrate.cosSquare()}`).toBe('\\frac{1}{4} \\sin ( 2 x ) + \\frac{1}{2} x');
  expect(`${integrate.cosSquare({ limits: [0, 90] })}`).toBe('\\frac{1}{4} \\pi');
  expect(`${integrate.cosSquare({ limits: [0, 45] })}`).toBe('\\frac{1}{4} + \\frac{1}{8} \\pi');
  expect(`${integrate.cosSquare({ limits: [piOver3, piOver2] })}`).toBe(
    '- \\frac{1}{8} \\sqrt{3} + \\frac{1}{12} \\pi',
  );
  expect(`${integrate.sinSquare()}`).toBe('\\frac{1}{2} x - \\frac{1}{4} \\sin ( 2 x )');
  expect(`${integrate.sinSquare({ limits: [0, 90] })}`).toBe('\\frac{1}{4} \\pi');
  expect(`${integrate.sinSquare({ limits: [0, 45] })}`).toBe('- \\frac{1}{4} + \\frac{1}{8} \\pi');
  expect(`${integrate.sinSquare({ limits: [piOver3, piOver2] })}`).toBe('\\frac{1}{8} \\sqrt{3} + \\frac{1}{12} \\pi');
});

test('factor formula', () => {
  expect(`${integrate.sinCos()}`).toBe('- \\frac{1}{4} \\cos ( 2 x )');
  expect(`${integrate.cosSin()}`).toBe('- \\frac{1}{4} \\cos ( 2 x )');
  expect(`${integrate.cosCos()}`).toBe(`${integrate.cosSquare()}`);
  expect(`${integrate.sinSin()}`).toBe(`${integrate.sinSquare()}`);
  expect(`${integrate.cosCos({ limits: [0, piOver4] })}`).toBe(`${integrate.cosSquare({ limits: [0, 45] })}`);
  expect(`${integrate.sinSin({ limits: [0, piOver4] })}`).toBe(`${integrate.sinSquare({ limits: [0, 45] })}`);
  expect(`${integrate.sinCos({ a: 2 }, { a: 1 })}`).toBe('- \\frac{1}{6} \\cos ( 3 x ) - \\frac{1}{2} \\cos x');
  expect(`${integrate.sinCos({ a: new Fraction(2), limits: [0, 45] }, { a: 1 })}`).toBe(
    '- \\frac{1}{6} \\sqrt{2} + \\frac{2}{3}',
  );
  expect(`${integrate.sinCos({ a: new Fraction(2), limits: [piOver4, piOver3] }, { a: 1 })}`).toBe(
    '- \\frac{1}{12} + \\frac{1}{6} \\sqrt{2}',
  );
  expect(`${integrate.cosSin({ a: 3, limits: [0, piOver4] })}`).toBe('0');
  expect(`${integrate.cosSin({ a: 3, limits: [0, 45] })}`).toBe('0');
  expect(`${integrate.cosCos({ a: 3, limits: [0, 45] }, { a: 2 })}`).toBe('\\frac{1}{5} \\sqrt{2}');
  expect(`${integrate.sinSin({ a: 3, limits: [0, 45] }, { a: 2 })}`).toBe('\\frac{3}{10} \\sqrt{2}');
});
