import {
  getRandomInt,
  getRandomFrac,
  getRandomLinear,
  getRandomQuadratic,
  Fraction,
  Polynomial,
  Vector,
  getRandomVec,
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
  expect(checkLinear(randomLinear)).toBe(true);
  expect(randomQuadratic).toBeInstanceOf(Polynomial);
  expect(checkQuadratic(randomQuadratic)).toBe(true);
  expect(randomMonic.coefficients[0]).toBe(1);
  expect(`${randomMonicLinear}`[0]).toBe('x');

  expect(getRandomVec()).toBeInstanceOf(Vector);

  for (let i = 0; i < 30; i++) {
    getRandomVec();
    getRandomVec({ simplified: false });
    getRandomInt(-1, 1, { avoid: [0] });
    getRandomFrac({ numMin: 1, numMax: 3, denMin: 2, denMax: 2, avoid: [new Fraction(1, 2)] });
    getRandomQuadratic({ complex: false });
    getRandomQuadratic({ rational: false });
    getRandomQuadratic({ irrational: false });
    getRandomQuadratic({ monic: true, bMin: 2, bMax: 2, cMin: 1, cMax: 2, repeated: false });
    getRandomQuadratic({ monic: true, bMin: 2, bMax: 2, cMin: 1, cMax: 2 });
  }
});

function checkQuadratic(x: Polynomial): boolean{
    if (x.polynomialTerms.length === 3) {
      return true;
    } else if (x.polynomialTerms.length === 2) {
      const ascending = (x.polynomialTerms[0].n === 0 || x.polynomialTerms[0].n === 1) && x.polynomialTerms[1].n === 2;
      const descending = (x.polynomialTerms[1].n === 0 || x.polynomialTerms[1].n === 1) && x.polynomialTerms[2].n === 2;
      return ascending || descending;
    } else if (x.polynomialTerms.length === 1) {
      return x.polynomialTerms[0].n === 2;
    } else {
      return false;
    }
}

function checkLinear(x: Polynomial): boolean {
  if (x.polynomialTerms.length === 2) {
    return true
  } else if (x.polynomialTerms.length === 1) {
    return x.polynomialTerms[0].n === 1;
  } else {
    return false;
  }
}