import Term from './termClass';
import Fraction from './fractionClass';

/**
 * NthRoot class (extends the `Term` class) `{coeff: Fraction, n: positive integer, radicand: non-negative integer}`
 *
 * let $a$ be `coeff` (the coefficient) and $b$ be the `radicand`.
 * Then this NthRoot class is the representation of the radical $a \sqrt[n]{b}$.
 * For the special case `n=2`, we recommend using the SquareRoot class extension for more available methods
 * 
 * Note that we do not support negative radicands at this point (for odd `n`, you may want to consider 'hoisting' the negative sign to the coefficient)
 */
class NthRoot extends Term{
  /** the n-th root */
  n: number;
  /** the non-negative integer inside the radical */
  radicand: number;

  //// constructor
  /**
   * creates a new NthRoot instance representing $a \sqrt[n]{b}$.
   * @param radicand only non-negative integers or Fractions are supported at this moment.
   * @param coeff coefficient of the radical.
   * 
   * If a fraction is provided as the radicand, we will 'rationalize' it such that
   * $a \sqrt[n]{b/c}$ is converted to $\frac{a}{c} \sqrt[n]{bc}$ so that the radicand is an integer.
   * 
   * we will also simplify our radical such that the final surd $a\sqrt[n]{b}$ such that b is n-th power free (e.g. square free), up to prime powers less than 100.
   * at n = 9 and above, 97^9 is no longer a safe integer so this simplification may fail
   * 
   */
  constructor(radicand: number | Fraction, n: number, coeff?: number | Fraction) {
    // default coeff value of 1, make coeff a fraction
    if (coeff === undefined) {
      coeff = new Fraction(1);
    } else if (typeof coeff === 'number') {
      coeff = new Fraction(coeff)
    }
    // 'rationalizes' our radical, converting a*nroot(b/c) to a/c * nroot(b*c)
    if (typeof radicand !== 'number') {
      coeff = coeff.divide(radicand.den);
      radicand = radicand.num*radicand.den;
    }
    // throws if radicand not integer
    if (!Number.isInteger(radicand) || radicand < 0) {
      throw 'radicand must be a non-negative integer or Fraction'
    }

    // extract nth-powers
    const [a, b] = extractPowers(radicand, n); // radicand = a^2 * b

    // calls Term constructor and termString for rational answers
    super(coeff.times(a), `\\sqrt[${n}]{${b}}`);
    this.n = n;
    this.radicand = b;
    if (this.radicand === 0) { // 0 term
      this.coeff = Fraction.ZERO;
      this.termString = '';
    } else if (this.radicand === 1) { // a sqrt{1} = a
      this.termString = '';
    } else {
      this.termString = `\\sqrt[${n}]{${this.radicand}}`;
    }
  }
}

/**
 * SquareRoot class (extends the `NthRoot` and `Term` classes) `{coeff: Fraction, n=2, radicand: non-negative integer}`
 *
 * let $a$ be `coeff` (the coefficient) and $b$ be the `radicand`.
 * Then this SquareRoot class is the representation of the radical $a \\sqrt{b}$.
 * 
 */
class SquareRoot extends NthRoot{
  //// constructor
  /**
   * creates a new SquareRoot instance representing $a \sqrt{b}$. Special case of the NthRoot class
   * @param radicand a non-negative integer or Fraction
   * @coeff coefficient of the radical
   * 
   * If a fraction is provided as the radicand, we will 'rationalize' it such that
   * $a \sqrt{b/c}$ is converted to $\frac{a}{c} \sqrt{bc}$ so that the radicand $bc$ is an integer
   * 
   * We also simplify our SquareRoots such that the radicand is square free (up to 100^2)
   * 
   */
  constructor(radicand: number | Fraction, coeff?: number | Fraction) {
    super(radicand, 2, coeff);
    if (this.radicand !== 0 && this.radicand !== 1) { // valid square root radical
      this.termString = `\\sqrt{${this.radicand}}`;
    }
  }
}

// takes an integer x, and returns [a, b] such that x = a^n b and b is n-power free (up to 100)
function extractPowers(x: number, n=2, y=1): [number, number] {
  if (!Number.isInteger(x) || x < 0 || !Number.isInteger(n) || n < 2) {
    throw 'only non-negative integers supported, n must be an integer more than 2'
  }
  if (x == 0) {
    return [0, 0];
  }
  // primes up to 100
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  for (let prime of primes) {
    if (x % (Math.pow(prime,n)) === 0) {
      return extractPowers((x / Math.pow(prime,n)), n, y * prime)
    } else if (x < Math.pow(prime, n)) {
      break;
    }
  }
  return [y, x];
}

export { NthRoot, SquareRoot }