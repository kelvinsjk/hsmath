import Polynomial from '../polynomialClass';

/**
 * A `RationalFunction` is a representation of a `Polynomial` divided by another
 */
export default class RationalFunction {
  num: Polynomial;
  den: Polynomial;

  //// constructor
  /**
   * Creates a new `RationalFunction` instance
   * @param num numerator
   * @param den denominator
   */
  constructor(num: Polynomial, den: Polynomial) {
    if (den.toString() === '0') {
      throw 'division by 0 not allowed'
    }
    this.num = num.clone();
    this.den = den.clone();
  }

  //// class methods

  /**
   * addition
   * we currently only support addition with another Polynomial
   * @returns the sum
   */
  add(polynomial2: Polynomial): RationalFunction {
    // options
    const numerator = this.num.add(polynomial2.multiply(this.den));
    numerator.sort(false);
    return new RationalFunction(numerator, this.den);
  }

  /// string methods
  /**
   * @param displayMode if `true`, adds `\displaystyle` at the start of the string
   * @returns the LaTeX string representation of the sum of all the terms
   */
  toString(options?: toStringOptions): string {
    const defaultOptions = {
      displayMode: false,
    };
    const optionsObject = { ...defaultOptions, ...options };
    const displayText = optionsObject.displayMode ? '\\displaystyle ' : '';
    return `${displayText}\\frac{ ${this.num} }{ ${this.den} }`;
  }
}

/**
 * Options for converting to string
 */
interface toStringOptions {
  /** `displayMode`: if `true`, adds '\\displaystyle' at the start of the string */
  displayMode?: boolean;
}