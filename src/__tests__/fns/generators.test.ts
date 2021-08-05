import {
  getRandomInt,
  getRandomFrac,
  getRandomLinear,
  getRandomQuadratic,
  Fraction,
  Polynomial,
  Vector,
  getRandomVec
} from '../../../src/index';

const randomInt = getRandomInt(-9, 9);
const minus1Or1 = getRandomInt(-1, 1, { avoid: [0] });
const randomFrac = getRandomFrac();
const randomLinear = getRandomLinear();
const randomQuadratic = getRandomQuadratic().quadratic;
const randomMonicLinear = getRandomLinear({ monic: true });
const randomMonic = getRandomQuadratic({ monic: true });

test('toString', () => {
  expect(randomInt).toBeLessThanOrEqual(9);
  expect(randomInt).toBeGreaterThanOrEqual(-9);
  expect(minus1Or1 === 1 || minus1Or1 === -1).toBe(true);
  expect(randomFrac).toBeInstanceOf(Fraction);
  expect(randomLinear).toBeInstanceOf(Polynomial);
  expect(randomLinear.terms.length).toBe(2);
  expect(randomQuadratic).toBeInstanceOf(Polynomial);
  expect(randomQuadratic.polynomialTerms.length).toBe(3);
  expect(randomMonic.coefficients[0]).toBe(1);
  expect(`${randomMonicLinear}`[0]).toBe('x');

  expect(getRandomVec()).toBeInstanceOf(Vector);

  for (let i = 0; i < 30; i++) {
    getRandomVec();
    getRandomVec({simplified: false});
    getRandomInt(-1, 1, { avoid: [0] });
    getRandomFrac({ numMin: 1, numMax: 3, denMin: 2, denMax: 2, avoid: [new Fraction(1, 2)] });
    getRandomQuadratic({complex: false});
    getRandomQuadratic({rational: false});
    getRandomQuadratic({irrational: false});
    getRandomQuadratic({monic: true, bMin:2, bMax:2, cMin: 1, cMax: 2, repeated: false});
    getRandomQuadratic({ monic: true, bMin: 2, bMax: 2, cMin: 1, cMax: 2 });
  }
});
