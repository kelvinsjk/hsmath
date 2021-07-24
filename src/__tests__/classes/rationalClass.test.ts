import { RationalFunction, Polynomial } from '../../index';

const twoX = new Polynomial([2], { initialDegree: 1 });
//const threeX2 = new Polynomial([3], {initialDegree: 2});
////const sixX3 = twoX.multiply(threeX2);
const x = new Polynomial([1], { initialDegree: 1 });
const xMinus1 = new Polynomial([1, -1]);

//const x2Plus3xMinus5 = new Polynomial([1, 3, -5]);
//const rational3 = new RationalFunction(x2Plus3xMinus5, xMinus1);
//const rational4 = rational3.add(xMinus1);

//
const rational1 = new RationalFunction(twoX, xMinus1);
const rational2 = rational1.add(x);

//const sqrt2Term = new Term(1, '\\sqrt{2}');

test('addition', () => {
  expect(`${twoX}`).toBe('2 x');
  expect(`${rational1}`).toBe('\\frac{ 2 x }{ x -1 }');
  expect(`${rational1.toString({ displayMode: true })}`).toBe('\\displaystyle \\frac{ 2 x }{ x -1 }');
  expect(`${rational2}`).toBe('\\frac{ x^2 + x }{ x -1 }');

  expect(() => {
    new RationalFunction(twoX, new Polynomial([0]));
  }).toThrow();
});
