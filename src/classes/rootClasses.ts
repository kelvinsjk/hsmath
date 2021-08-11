import Term from './expressions/termClass';
import Fraction from './fractionClass';

/**
 * NthRoot class (extends the `Term` class) `{coeff: Fraction, n: positive integer, radicand: non-negative integer}`
 *
 * let $a$ be `coeff` (the coefficient) and $b$ be the `radicand`.
 * Then this NthRoot class is the representation of the radical $a \sqrt[n]{b}$.
 * For the special case `n=2`, we also have a SquareRoot class extension
 *
 * Note that we do not support negative radicands at this point (for odd `n`, you may want to consider 'hoisting' the negative sign to the coefficient)
 */
class NthRoot extends Term {
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
      coeff = new Fraction(coeff);
    }
    // 'rationalizes' our radical, converting a*nroot(b/c) to a/c * nroot(b*c)
    if (typeof radicand !== 'number') {
      coeff = coeff.divide(radicand.den);
      radicand = radicand.num * radicand.den;
    }
    // throws if radicand not integer
    if (!Number.isInteger(radicand) || radicand < 0) {
      throw 'radicand must be a non-negative integer or Fraction';
    }

    // extract nth-powers
    const [a, b] = extractPowers(radicand, n); // radicand = a^2 * b

    // calls Term constructor and variable for rational answers
    super(coeff.times(a), `\\sqrt[${n}]{${b}}`);
    this.n = n;
    this.radicand = b;
    if (this.radicand === 0) {
      // 0 term
      this.coeff = Fraction.ZERO;
      this.variable = '';
    } else if (this.radicand === 1) {
      // a sqrt{1} = a
      this.variable = '';
    } else {
      this.variable = `\\sqrt[${n}]{${this.radicand}}`;
    }
  }

  /**
   * exponentiation
   * @param n non-negative integer
   * @returns this NthRoot to the power of `n`
   */
  pow(n: number): NthRoot {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('NthRoot ERROR: only non-negative n are allowed for fraction.pow(n)');
    }
    return new NthRoot(Math.pow(this.radicand, n), this.n, this.coeff.pow(n));
  }

  /**
   * exponentiation
   * @param n non-negative integer
   * @returns this NthRoot to the power of `n`
   */
  valueOf(): number {
    return Math.pow(this.radicand, 1 / this.n) * this.coeff.valueOf();
  }
}

/**
 * SquareRoot class (extends the `NthRoot` and `Term` classes) `{coeff: Fraction, n=2, radicand: non-negative integer}`
 *
 * let $a$ be `coeff` (the coefficient) and $b$ be the `radicand`.
 * Then this SquareRoot class is the representation of the radical $a \\sqrt{b}$.
 *
 */
class SquareRoot extends NthRoot {
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
    if (this.radicand !== 0 && this.radicand !== 1) {
      // valid square root radical
      this.variable = `\\sqrt{${this.radicand}}`;
    }
  }

  /**
   * exponentiation
   * @param n non-negative integer
   * @returns this SquareRoot to the power of `n`
   *
   * for n=2 use the `square` method to get a Fraction class
   */
  pow(n: number): SquareRoot {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('SquareRoot ERROR: only non-negative n are allowed for fraction.pow(n)');
    }
    return new SquareRoot(Math.pow(this.radicand, n), this.coeff.pow(n));
  }

  /**
   * square: if this is a\sqrt{b}
   * @returns the fraction a^2 b
   */
  square(): Fraction {
    return this.coeff.pow(2).times(this.radicand);
  }

  /**
   * multiplication (by a number/Fraction)
   */
  times(k: number | Fraction): SquareRoot {
    const newCoeff = this.coeff.times(k);
    return new SquareRoot(this.radicand, newCoeff);
  }

  /**
   * division (by a number/Fraction/SquareRoot)
   */
  divide(k: number | Fraction | SquareRoot): SquareRoot {
    if (typeof k === 'number' || k instanceof Fraction) {
      const newCoeff = this.coeff.divide(k);
      return new SquareRoot(this.radicand, newCoeff);
    } else {
      // k is also a square root: after rationalization, l sqrt(a) / m sqrt(b) = l sqrt(ab) / mb
      return new SquareRoot(this.radicand * k.radicand, this.coeff.divide(k.coeff).divide(k.radicand));
    }
  }

  /**
   * negative: if this is a\sqrt{b}
   * @returns the -a\sqrt{b}
   */
  negative(): SquareRoot {
    return new SquareRoot(this.radicand, this.coeff.negative());
  }

  clone(): SquareRoot {
    return new SquareRoot(this.radicand, this.coeff.clone());
  }
}

// takes an integer x, and returns [a, b] such that x = a^n b and b is n-power free (up to 100)
function extractPowers(x: number, n = 2, y = 1): [number, number] {
  if (!Number.isInteger(n) || n < 2) {
    throw 'n must be an integer more than 2';
  }
  if (x == 0) {
    return [0, 0];
  }
  // primes up to 100
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  for (const prime of primes) {
    if (x % Math.pow(prime, n) === 0) {
      return extractPowers(x / Math.pow(prime, n), n, y * prime);
    } else if (x < Math.pow(prime, n)) {
      break;
    }
  }
  return [y, x];
}

export { NthRoot, SquareRoot };
