import Fraction from '../../fractionClass';
import convertNumberToFraction from '../../../internal/convertNumberToFraction';
import Polynomial from '../../algebra/polynomialClass';
import Term from '../../algebra/termClass';
import Expression from '../../algebra/expressionClass';
import ExpFn from '../expFnClass';

/**
 * DE of the form dxdt = k (x+b) which gives a solution
 * x = A e^{kt} - b
 *
 */
export default class exponential {
  k: Fraction;
  b: Fraction;
  x: string;
  t: string;

  /**
   * creates a new DE.exponential instance representing
   * dxdt = k (x+b)
   *
   * @param params defaults to
   * `{k: 1, b: 0, x: 'x', t: 't' }`
   */
  constructor(params: ExpDEParameters) {
    const defaultB = { k: 1, b: 0, x: 'x', t: 't' };
    const { k, b, x, t } = { ...defaultB, ...params };
    this.k = convertNumberToFraction(k);
    this.b = convertNumberToFraction(b);
    this.x = x;
    this.t = t;
  }

  /**
   * @returns the general solution of this DE
   * x = Ae^{kt}-b
   */
  generalSolution(): string {
    const kT = new Term(this.k, this.t);
    const AeKtMinusB = new Expression(`A \\mathrm{e}^{${kT}}`, this.b.negative());
    return `${this.x} = ${AeKtMinusB}`;
  }

  /**
   * @returns the particular solution of this DE
   * x = Ae^{kt}-b
   *
   * @param initialValue the value of x at t=0
   */
  particularSolution(initialValue: number | Fraction): string {
    const A = this.b.plus(initialValue);
    const AeKt = new ExpFn({ a: this.k, coeff: A, variableAtom: this.t });
    const AeKtMinusB = new Expression(AeKt, this.b.negative());
    return `${this.x} = ${AeKtMinusB}`;
  }

  /**
   * @returns LaTeX string representing dxdt = k(x+b) = kx + kb
   */
  toString(): string {
    const dxdt = `\\frac{\\mathrm{d}${this.x}}{\\mathrm{d}${this.t}}`;
    const kxPlusKb = new Polynomial([this.k, this.k.times(this.b)], { variableAtom: this.x });
    return `${dxdt} = ${kxPlusKb}`;
  }
}

interface ExpDEParameters {
  k?: number | Fraction;
  b?: number | Fraction;
  x?: string;
  t?: string;
}
