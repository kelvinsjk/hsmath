import { LinearFn, Fraction } from '../../index';

const twoXPlus3 = new LinearFn({ m: 2, c: 3 });
const halfXMinusOneThird = new LinearFn({ m: new Fraction(1, 2), c: new Fraction(-1, 3) });
const fourXMinus5 = new LinearFn({ m: 4, x1: 1, y1: -1 }, { mode: 'mp' });
const xPlus1 = new LinearFn({ x1: 1, y1: 2, x2: 3, y2: 4 }, { mode: 'pp' });

test('linear function', () => {
  expect(`${twoXPlus3}`).toBe('y = 2 x + 3');
  expect(`${fourXMinus5.xIntercept()}`).toBe('\\frac{5}{4}');
  expect(`${xPlus1.yIntercept()}`).toBe('1');
  expect(`${halfXMinusOneThird.toIntegerString()}`).toBe('- 3 x + 6 y = - 2');
});
