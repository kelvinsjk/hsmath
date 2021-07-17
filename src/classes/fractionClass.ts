import gcd from '../fns/arithmetic/gcd';
import Term from './termClass';
import { Polynomial } from './polynomialClasses';
/**
 * Fraction class `{num: numerator, den: denominator}`
 *
 * `num` is an integer and `den` is a positive integer (any negative signs are "hoisted" to `num`)
 */
export default class Fraction {
  //// instance properties
  /** numerator: integer */
  num: number;
  /** denominator: positive integer */
  den: number;

  //// constructor
  /**
   * Creates a new fraction instance, 'simplifying' the fraction to the form a/b such that a is an integer, b is a positive integer and gcd(a,b)=1.
   * @param num numerator.
   * @param den denominator (non-negative integer). default value: `1`. If `num` is not an integer, then must be `1`.
   */
  constructor(num: number, den = 1) {
    if (den === 0) {
      throw 'denominator cannot be zero';
    }
    if (!Number.isInteger(den)) {
      throw 'denominator must be an integer';
    }
    if (Number.isInteger(num)) {
      const divisor = gcd(num, den);
      const sign = Math.sign(num) * Math.sign(den);
      this.num = (sign * Math.abs(num)) / divisor;
      this.den = Math.abs(den) / divisor;
    } else {
      // num is non-integer
      if (den === 1) {
        [num, den] = convertDecimalToFraction(num);
        const divisor = gcd(num, den);
        this.num = Math.abs(num) / divisor;
        this.den = Math.abs(den) / divisor;
      } else {
        throw 'when using a non-integer numerator, only a denominator of 1 is supported';
      }
    }
  }

  //// instance methods
  /// arithmetic
  /**
   * addition
   * @param f2 the number/fraction to be added
   * @returns the sum of this fraction and `f2`
   */
  plus(f2: number | Fraction): Fraction {
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    return new Fraction(this.num * f2.den + f2.num * this.den, this.den * f2.den);
  }
  /**
   * multiplication
   * @param f2 the number/fraction to be multiplied
   * @returns the product of this fraction and `f2`
   */
  times(f2: number | Fraction): Fraction {
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    return new Fraction(this.num * f2.num, this.den * f2.den);
  }
  /**
   * subtraction
   * @param f2 the number/fraction to be subtracted
   * @returns this fraction minus `f2`
   */
  minus(f2: number | Fraction): Fraction {
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    const negativeF2 = f2.times(-1);
    return this.plus(negativeF2);
  }
  /**
   * division
   * @param f2 the number/fraction to be divided by. Cannot be zero.
   * @returns this fraction divided by `f2`
   */
  divide(f2: number | Fraction): Fraction {
    // take current fraction divided by f, returning the quotient
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    if (f2.isEqual(0)) {
      throw 'cannot be divided by 0';
    }
    const reciprocal = new Fraction(f2.den, f2.num);
    return this.times(reciprocal);
  }
  /**
   * exponentiation
   * @param n non-negative integer
   * @returns this fraction to the power of `n`
   */
  pow(n: number): Fraction {
    if (!Number.isInteger(n) || n < 0) {
      throw 'only non-negative n are allowed for fraction.pow(n)';
    }
    return new Fraction(Math.pow(this.num, n), Math.pow(this.den, n));
  }

  /// comparison
  /**
   * checks if this fraction is an integer
   */
  isInteger(): boolean {
    return this.den === 1;
  }
  /**
   * checks if this fraction is equal to `f2`
   */
  isEqual(f2: number | Fraction): boolean {
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    return this.num === f2.num && this.den == f2.den;
  }

  /// string methods
  /**
   * @param displayMode if `true`, adds `\displaystyle` at the start of the string
   * @returns the LaTeX string representation of the fraction
   */
  toString(options?: toStringOptions): string {
    if (this.den === 1) {
      // integer
      return this.num >= 0 ? this.num.toString() : `- ${Math.abs(this.num)}`;
    } else {
      // fraction
      const displayMode = options === undefined ? '' : options.displayMode;
      const displayText = displayMode ? '\\displaystyle ' : '';
      const sign = this.num < 0 ? '- ' : '';
      return `${displayText}${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
    }
  }

  /// methods relating to the primitive number type
  /**
   * converts to Javascript built-in Number type
   * @returns the float representation of this fraction in the JavaScript number format
   */
  valueOf(): number {
    return this.num / this.den;
  }
  /**
   * invokes the JavaScript `Number.prototype.toFixed()` method
   */
  toFixed(digits?: number): string {
    return this.valueOf().toFixed(digits);
  }
  /**
   * invokes the JavaScript `Number.prototype.toPrecision()` method
   */
  toPrecision(precision?: number): string {
    return this.valueOf().toPrecision(precision);
  }

  /// convert to Term class
  /**
   * returns the constant Term class representing this fraction
   */
  toTerm(): Term {
    return new Term(this);
  }

  /// convert to Polynomial class
  /**
   * convert to Polynomial class
   * @param options default: `{ascendingOrder: false, variableAtom = 'x'}`
   * @returns the Polynomial class representing the linear factor ax+b, with this fraction as the root
   *
   * coefficient of 'x' will always be positive: chain .multiply(-1) to modify this behavior
   */
  toFactor(options?: toFactorOptions): Polynomial {
    const defaultOptions = {
      ascendingOrder: false,
      variableAtom: 'x',
    };
    const optionsObject: polynomialOptions = { ...defaultOptions, ...options };
    if (optionsObject.ascendingOrder) {
      // b + a x
      return new Polynomial([-this.num, this.den], optionsObject);
    } else {
      optionsObject.initialDegree = 1;
      return new Polynomial([this.den, -this.num], optionsObject);
    }
  }

  //// static properties
  /**
   * the fraction class instance of 1
   */
  static ONE = new Fraction(1);
  /**
   * the fraction class instance of 0
   */
  static ZERO = new Fraction(0);

  //// static methods
  /// methods similar to those in the built-in Number/Math objects
  /**
   * @returns the absolute value of `f`
   */
  static abs(f: Fraction): Fraction {
    return new Fraction(Math.abs(f.num), f.den);
  }
  /**
   * invokes the built-in `Math.ceil(f)` function
   */
  static ceil(f: Fraction): Fraction {
    return new Fraction(Math.ceil(f.valueOf()));
  }
  /**
   * invokes the built-in `Math.floor(f)` function
   */
  static floor(f: Fraction): Fraction {
    return new Fraction(Math.floor(f.valueOf()));
  }
  /**
   * invokes the built-in `Math.round(f)` function
   */
  static round(f: Fraction): Fraction {
    return new Fraction(Math.round(f.valueOf()));
  }
  /**
   * invokes the built-in `Math.sign(f)` function
   */
  static sign(f: Fraction): number {
    return Math.sign(f.valueOf());
  }

  /// comparison methods
  /**new Fraction(
   */
  static compare(
    f1: Fraction | number,
    compare: '>' | '>=' | '<' | '<=' | '==' | '===',
    f2: Fraction | number,
  ): boolean {
    if (typeof f1 === 'number') {
      f1 = new Fraction(f1);
    }
    if (typeof f2 === 'number') {
      f2 = new Fraction(f2);
    }
    if (compare === '>') {
      return f1.valueOf() > f2.valueOf();
    } else if (compare === '>=') {
      return f1.valueOf() >= f2.valueOf();
    } else if (compare === '<') {
      return f1.valueOf() < f2.valueOf();
    } else if (compare === '<=') {
      return f1.valueOf() <= f2.valueOf();
    } else {
      //if (compare === "==" || compare === "===")
      return f1.isEqual(f2);
    }
  }
}

// returns [a, b], where we have converted num = a/b
// warning: make sure num is not an integer before calling
function convertDecimalToFraction(num: number): [number, number] {
  const x = num.toString(); //// x of the form 'aaaa.bbb'
  const decimalIndex = x.indexOf('.');
  const powerOfTen = Math.pow(10, x.length - decimalIndex - 1);
  const numerator = num * powerOfTen;
  if (Number.isSafeInteger(numerator) && Number.isSafeInteger(powerOfTen)) {
    return [numerator, powerOfTen];
  } else {
    throw 'conversion of decimal to Fraction failed (unsafe integer encountered)';
  }
}

/**
 * Options for converting to string
 */
interface toStringOptions {
  /** `displayMode`: if `true`, adds '\\displaystyle' at the start of the string */
  displayMode: boolean;
}
/**
 * Options for converting to polynomial
 */
interface toFactorOptions {
  /** if false (default), converts to ax+b. if true converts to b+ax */
  ascendingOrder?: boolean;
  /** variable string representation*/
  variableAtom?: string;
}
/**
 * Options for `Polynomial` constructor
 */
interface polynomialOptions {
  /** string representing the variable (default `x`) */
  variableAtom?: string;
  /** ascending (default) or descending order*/
  ascendingOrder?: boolean;
  /** degree of the first term (default `0`)*/
  initialDegree?: number;
  /** for powers, do we enclose the variable with brackets? `true` gives us regular parenthesis while `lr` gives us `\\left( xxx \\right)` */
  brackets?: boolean | 'lr';
}

// TODO: implement a compare function (to be combined with other Classes)
// TODO: implement the max and min static methods. possibly a clone instance method
