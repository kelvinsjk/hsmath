import {
  getRandomInt, getRandomFrac, getRandomLinear, getRandomQuadratic,
  Fraction, Polynomial
} from '../../../src/index';

const randomInt = getRandomInt(-9, 9);
const minus1Or1 = getRandomInt(-1, 1, {avoid: [0]});
const randomFrac = getRandomFrac();
const randomLinear = getRandomLinear();
const randomQuadratic = getRandomQuadratic().quadratic;

test('toString', () => {
  expect(randomInt).toBeLessThanOrEqual(9);
  expect(randomInt).toBeGreaterThanOrEqual(-9);
  expect(minus1Or1 === 1 || minus1Or1 === -1).toBe(true);
  expect(randomFrac).toBeInstanceOf(Fraction);
  expect(randomLinear).toBeInstanceOf(Polynomial);
  expect(randomLinear.terms.length).toBe(2);
  expect(randomQuadratic).toBeInstanceOf(Polynomial);
  expect(randomQuadratic.polynomialTerms.length).toBe(3);
});
