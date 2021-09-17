import Fraction from '../fractionClass';
import Term from '../algebra/termClass';
import convertNumberToFraction from '../../internal/convertNumberToFraction';
import Exp from './expClass';
import { SquareRoot } from '../rootClasses';

/**
 * ln class
 *
 * @argument argument Fraction | Exp
 *
 * class representing the natural logarithm k ln (ax+b)
 *
 * as a extension of the `Term` class
 */
export default class Ln extends Term {
  /** argument */
  argument: Fraction;

  ////
  // constructor
  ////
  /**
   * Creates a new ln instance representing $k \ln x$
   *
   * @argument argument number | Fraction | Exp
   *
   */
  constructor(argument: number | Fraction | Exp, coeff?: number | Fraction) {
    coeff = coeff === undefined ? Fraction.ONE : convertNumberToFraction(coeff);
    if (argument instanceof Exp) {
      if (argument.coeff.isEqual(1)) {
        super(coeff.times(argument.exponent));
        this.argument = Fraction.ONE;
      } else {
        throw new Error('ln ERROR: change the coefficient of the exponential to 1 to proceed');
      }
    } else {
      argument = convertNumberToFraction(argument);
      if (argument.valueOf() <= 0) {
        throw new Error('ln ERROR: argument must be positive');
      }
      if (argument.valueOf() === 1) {
        super(0);
      } else {
        super(coeff, `\\ln ${argument}`);
      }
      this.argument = argument;
    }
  }

  /**
   * addition
   */
  plus(lnY: Ln): Ln {
    if (this.coeff.isEqual(lnY.coeff)) {
      const argument = this.argument.times(lnY.argument);
      return new Ln(argument, this.coeff);
    } else {
      throw new Error('ln ERROR: addition of logarithms with different coefficients not currently supported');
    }
  }
  /**
   * subtraction
   *
   * @return this minus B
   */
  minus(lnY: Ln): Ln {
    if (this.coeff.isEqual(lnY.coeff)) {
      const argument = this.argument.divide(lnY.argument);
      return new Ln(argument, this.coeff);
    } else {
      throw new Error('ln ERROR: subtraction of logarithms with different coefficients not currently supported');
    }
  }
  /**
   * @returns '- k ln x', where this is 'k ln x'
   */
  negative(): Ln {
    return new Ln(this.argument, this.coeff.negative());
  }

  /**
   * simplifies the logarithm using two rules:
   * (a) if x is a perfect square y^2, in k ln x = k ln y^2, then returns 2k ln y (done recursively)
   * (b) if x is a reciprocal 1/y, in k ln x = k ln 1/y, then returns to -k ln y
   *
   * @returns a reference to this object
   */
  simplify(): Ln {
    if (this.argument.num === 1 && this.argument.den !== 1) {
      this.argument = new Fraction(this.argument.den);
      this.coeff = this.coeff.negative();
    }
    const squareRoot = new SquareRoot(this.argument);
    if (squareRoot.isRational() && !squareRoot.isEqual(1)) {
      this.argument = squareRoot.coeff;
      this.coeff = this.coeff.times(2);
      return new Ln(this.coeff.clone(), this.argument.clone());
    }
    return this.clone();
  }

  /**
   * @returns the value of the logarithm in the javascript number type
   */
  valueOf(): number {
    return this.coeff.valueOf() * Math.log(this.argument.valueOf());
  }

  clone(): Ln {
    return new Ln(this.argument.clone(), this.coeff.clone());
  }
}
