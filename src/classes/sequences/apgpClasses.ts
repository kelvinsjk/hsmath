import Fraction from '../fractionClass';
import PolynomialFn from '../calculus/polynomialFnClass';
import convertNumberToFraction from '../../internal/convertNumberToFraction';
import Term from '../algebra/termClass';
/**
 * AP class `{a: first term, d: common difference}`
 *
 */
class AP {
  //// instance properties
  /** a: first term */
  a: Fraction;
  /** d: common difference */
  d: Fraction;

  //// constructor
  /**
   * Creates a new AP instance
   * @param a first term
   * @param d common difference
   */
  constructor(a: number | Fraction, d: number | Fraction = 1) {
    this.a = convertNumberToFraction(a);
    this.d = convertNumberToFraction(d);
  }

  /**
   * u_n
   * 
   * @param n variable name (defaults to `n`)
   * 
   * returns the nth term a+(n-1)d = a-d + n d as a linear polynomial in n
   */
  uN(n='n'): PolynomialFn{
    return new PolynomialFn([this.d, this.a.minus(this.d)], {variableAtom: n})
  }

  /**
   * @returns the value of u_n
   */
  uNValueAt(n: number): Fraction{
    return this.uN().valueAt(n);
  }

  /**
   * S_n
   * 
   * @param n variable name (defaults to `n`)
   * 
   * returns the sum of n terms 1/2 (n)(2a + (n-1)d)
   * = 1/2 (2an + dn^2 - dn)
   * = d/2 n^2 + (a-d/2) n
   *  as a linear polynomial in n
   */
  sN(n='n'): PolynomialFn{
    return new PolynomialFn([this.d.divide(2), this.a.minus(this.d.divide(2)), 0], {variableAtom: n})
  }

  /**
   * @returns the value of S_n
   */
  sNValueAt(n: number): Fraction {
    return this.sN().valueAt(n);
  }
}

/**
 * GP class `{a: first term, d: common difference}`
 *
 */
class GP {
  //// instance properties
  /** a: first term */
  a: Fraction;
  /** r: common ratio */
  r: Fraction;

  //// constructor
  /**
   * Creates a new GP instance
   * @param a first term
   * @param r common ratio
   */
  constructor(a: number | Fraction, r: number | Fraction) {
    this.a = convertNumberToFraction(a);
    this.r = convertNumberToFraction(r);
  }

  /**
   * u_n
   * 
   * @param n variable name (defaults to `n`)
   * 
   * returns the nth term as a `Term` class for typesetting
   */
  uN(n = 'n'): Term{
    const nMinus1 = new PolynomialFn([1, -1], { variableAtom: n });
    const rPower = `\\left( ${this.r} \\right)^{${nMinus1}}`;
    return new Term(this.a, rPower);
  }

  /**
   * @returns the value of u_n
   */
  uNValueAt(n: number): Fraction{
    return this.a.times(this.r.pow(n - 1));
  }

  /**
   * S_n
   * 
   * @param n variable name (defaults to `n`)
   * 
   * returns the sum of n terms as a `Term` class for typesetting
   */
  sN(n='n'): Term {
    const coeff = this.a.divide(Fraction.ONE.minus(this.r));
    const variable = `\\left( 1 - ${this.r}^${n} \\right)`;
    return new Term(coeff, variable);
  }

  /**
   * @returns the value of S_n
   */
  sNValueAt(n: number): Fraction {
    const coeff = this.a.divide(Fraction.ONE.minus(this.r));
    return coeff.times(Fraction.ONE.minus(this.r.pow(n)));
  }

  /**
   * @return S_infty
   */
  sInfty(): Fraction {
    return this.a.divide(Fraction.ONE.minus(this.r));
  }
}

export {AP, GP}