import Fraction from '../fractionClass';
import Ln from './lnClass';
import Term from '../expressions/termClass';
import convertNumberToFraction from '../../internal/convertNumberToFraction';

/**
 * ln class
 * 
 * @exponent Fraction | Exp
 * 
 * class representing exponentiation by Euler's number
 * 
 * as a extension of the `Term` class
 */
export default class Exp extends Term {
  /** exponent */
  exponent: Fraction;

  //// 
  // constructor
  ////
  /**
   * Creates a new exp instance
   *
   * @exponent number | Fraction | Ln
   *
   */
  constructor(exponent: number | Fraction | Ln, coeff?: number | Fraction) {
    coeff = coeff === undefined ? Fraction.ONE : convertNumberToFraction(coeff);
    if (exponent instanceof Ln) {
      if (exponent.coeff.isEqual(1)) {
        super(exponent.argument.times(coeff));
        this.exponent = Fraction.ZERO;
      } else {
        throw new Error('exp ERROR: change the coefficient of the logarithm to 1 to proceed')
      }
    } else {
      exponent = convertNumberToFraction(exponent);
      if (exponent.valueOf() === 0) {
        super(coeff);
      } else if (exponent.valueOf() === 1) {
        super(coeff, `\\mathrm{e}`);
      } else {
        super(coeff, `\\mathrm{e}^{${exponent}}`);
      }
      this.exponent = exponent;
    }
  }

  /**
   * multiplication
   */
  times(expY: Exp): Exp {
    const exponent = this.exponent.plus(expY.exponent);
    return new Exp(exponent, this.coeff.times(expY.coeff));
  }
  /**
   * multiplication
   */
  divide(expY: Exp): Exp {
    const exponent = this.exponent.minus(expY.exponent);
    return new Exp(exponent, this.coeff.divide(expY.coeff));
  }
  /**
   * multiplication
   */
  pow(n: number): Exp {
    if (Number.isInteger(n)) {
      const exponent = this.exponent.times(n);
      let coeff: Fraction;
      if (n === 0) {
        coeff = Fraction.ONE;
      } else if (n < 0) {
        coeff = Fraction.ONE.divide(this.coeff.pow(Math.abs(n)));
      } else {
        coeff = this.coeff.pow(n);
      }
      return new Exp(exponent, coeff);
    } else {
      throw new Error('exp ERROR: pow of non-integers not supported at this point')
    }
  }
  /**
   * @returns - k e^x
   */
  negative(): Exp {
    return new Exp(this.coeff.negative(), this.exponent);
  }
  /**
 * @returns the value of the logarithm in the javascript number type
 */
  valueOf(): number {
    return this.coeff.valueOf() * Math.exp(this.exponent.valueOf());
  }

  clone(): Exp {
    return new Exp(this.coeff, this.exponent);
  }
}