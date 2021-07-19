import Term from './termClass';
import Expression from './expressionClass';
import Fraction from './fractionClass';

/**
 * A `Polynomial` is a special `Expression` made up of `PolynomialTerm`s
 */
export default class Polynomial extends Expression {
  polynomialTerms: PolynomialTerm[];
  //// constructor
  /**
   * Creates a new `Polynomial` instance
   * @param array array of coefficients (in `number` or `Fraction` type) of the polynomial, or an array of `PolynomialTerm`s.
   * @param variable the string representing the variable (default `x`)
   * @param options `{ascending: false, initialDegree: ?n?, variableAtom: 'x', brackets: false}` by default. See the `polynomialOptions` interface for more details
   * the `initialDegree` will be zero if `ascending === true` and set such that the last coefficient is the constant term is not.
   */
  constructor(array: (number | Fraction)[] | PolynomialTerm[], options?: polynomialOptions) {
    // update options
    const defaultOptions = { ascending: false, variableAtom: 'x', brackets: false, initialDegree: NaN };
    const optionsObject = { ...defaultOptions, ...options };
    if (isNaN(optionsObject.initialDegree)) {
      optionsObject.initialDegree = optionsObject.ascending ? 0 : array.length - 1;
    }
    // create array of terms
    if (array.length === 0) {
      throw 'we do not support empty Polynomials at this time';
    }
    let polynomialTerms: PolynomialTerm[] = [];
    if (typeof array[0] === 'number' || array[0] instanceof Fraction) {
      let power = optionsObject.initialDegree;
      for (const coeff of array) {
        const coeffFrac = coeff as number | Fraction;
        const newTerm = new PolynomialTerm(coeffFrac, optionsObject.variableAtom, power, {
          brackets: optionsObject.brackets,
        });
        polynomialTerms.push(newTerm);
        optionsObject.ascending ? power++ : power--;
      }
    } else {
      polynomialTerms = array as PolynomialTerm[];
    }
    super(...polynomialTerms);
    this.polynomialTerms = polynomialTerms;
  }

  //// class methods

  /// arithmetic methods
  /**
   * adds the two polynomials
   * only supports one variable: we will assume the variable atom is that of the first term here
   * @returns the sum
   */
  add(polynomial2: Polynomial): Polynomial {
    const firstTerm = this.polynomialTerms[0];
    const termsArray = [...this.polynomialTerms, ...polynomial2.polynomialTerms];
    return new Polynomial(termsArray, { variableAtom: firstTerm.variableAtom });
  }
  /**
   * polynomial multiplication (if polynomial/polynomialTerm provided), scalar multiplication otherwise
   * @param options specify if output is in ascending or descending (default) order
   *
   * we currently assume both are polynomials in the same variable, the first variable atom in this will be used
   *
   * @returns the product
   */

  multiply(polynomial2: number | Fraction | PolynomialTerm | Polynomial, options?: multiplyOptions): Polynomial {
    // options
    const defaultOptions = {
      ascending: false,
    };
    const optionsObject = { ...defaultOptions, ...options };
    // multiply terms
    const newPolynomialTerms: PolynomialTerm[] = [];
    if (typeof polynomial2 === 'number' || polynomial2 instanceof Fraction || polynomial2 instanceof PolynomialTerm) {
      for (const term of this.polynomialTerms) {
        newPolynomialTerms.push(term.multiply(polynomial2) as PolynomialTerm);
      }
    } else {
      // polynomial given
      for (const term1 of this.polynomialTerms) {
        for (const term2 of polynomial2.polynomialTerms) {
          newPolynomialTerms.push(term1.multiply(term2) as PolynomialTerm);
        }
      }
    }
    // set variable atom using first term of this
    const firstTerm = this.polynomialTerms[0];
    const product = new Polynomial(newPolynomialTerms, { variableAtom: firstTerm.variableAtom });
    // order ascending/descending
    product.sort(optionsObject.ascending);
    return product;
  }

  /// array methods
  /**
   * sort the polynomial
   * @param ascending
   * warning: mutates object
   * @returns a reference to the object
   */
  /**
   * reverse the order of the terms
   * warning: mutates object
   * @returns a reference to the object
   */
  sort(ascending = true): this {
    this.polynomialTerms.sort((firstTerm, secondTerm) => {
      return ascending ? firstTerm.n - secondTerm.n : secondTerm.n - firstTerm.n;
    });
    const newPolynomial = new Polynomial(this.polynomialTerms, { variableAtom: this.polynomialTerms[0].variableAtom });
    this.terms = newPolynomial.terms;
    return this;
  }

  /**
   * clone
   * @returns a new instance of this
   */
  clone(): Polynomial {
    const firstTerm = this.polynomialTerms[0];
    const termsArray = [...this.polynomialTerms];
    return new Polynomial(termsArray, { variableAtom: firstTerm.variableAtom });
  }

  ////
  //static methods
  ////

  /**
   * Creates a new `Polynomial` instance
   * @param args one or more Fractions/Factors (Polynomials)
   * @return polynomial in descending order: use `sort` method afterwards if ascending needed
   */
  static fromRoots(...args: (number | Fraction | Polynomial)[]): Polynomial {
    if (args.length === 0) {
      throw 'we do not support empty Expression at the moment';
    }
    let poly = new Polynomial([1]); // constant polynomial
    for (let arg of args) {
      if (typeof arg === 'number') {
        arg = new Fraction(arg);
      }
      const factor = arg instanceof Fraction ? arg.toFactor() : arg.clone();
      poly = poly.multiply(factor);
    }
    return poly;
  }
} // end of Polynomial

//// PolynomialTerm class (internal?)
/**
 * polynomialTerm class `{coeff: Fraction, variable: string, n: number}`
 *
 * let $a$ be `coeff` (the coefficient), $x$ be the `variable`.
 * Then this polynomialTerm class is the representation of the 'term' $ax^n$.
 *
 * For example, `new Term(5, 'x', 2)` represents the polynomialTerm $5x^2$.
 */
class PolynomialTerm extends Term {
  /** the string representation of the variable (without any powers) */
  variableAtom: string;
  /** the degree/exponent of the term */
  n: number;
  /** the options object on how to handle the power */
  powerOptions: powerOptions;

  //// constructor
  /**
   * Creates a new polynomialTerm instance
   * @param coeff coefficient of the term
   * @param variableAtom string representation of the term/'variable'. if empty string then n must be 0
   * @param n degree/exponent of the term
   * @param options object of the form { brackets?: boolean | 'lr' } to handle the power
   */
  constructor(coeff: Fraction | number, variableAtom = 'x', n = 1, options?: powerOptions) {
    // update options
    const defaultOptions = { brackets: false };
    const optionsObject = { ...defaultOptions, ...options };
    // create variable
    let variable: string;
    if (variableAtom === '' || n === 0) {
      variable = '';
      n = 0;
    } else if (n === 1) {
      variable = variableAtom;
    } else {
      if (optionsObject.brackets === false) {
        // no brackets
        variable = n.toString().length > 1 ? `${variableAtom}^{${n}}` : `${variableAtom}^${n}`;
      } else {
        // either true or 'lr'
        if (optionsObject.brackets === 'lr') {
          variable =
            n.toString().length > 1
              ? `\\left( ${variableAtom} \\right)^{${n}}`
              : `\\left( ${variableAtom} \\right)^${n}`;
        } else {
          variable = n.toString().length > 1 ? `( ${variableAtom} )^{${n}}` : `( ${variableAtom} )^${n}`;
        }
      }
    }
    super(coeff, variable);
    this.n = n;
    this.variableAtom = variableAtom;
    this.powerOptions = optionsObject;
  }
  /// multiplication
  /**
   * if this is $ax^n$ another PolynomialTerm $bx^m$ is provided, returns the PolynomialTerm $(ab) x^{n+m}$
   *
   * performs scalar multiplication if a `number`, `Fraction` or constant `Term` (empty `variable`) is provided.
   *
   * if another `Term` is provided, return a new `Term` type representing their product (this feature is experimental)
   * @param options to set a new variable name after term multiplication (by default, the new variable name will be the two variables side by side)
   */
  multiply(term2: number | Fraction | Term | PolynomialTerm, options?: variableOptions): Term | PolynomialTerm {
    if (term2 instanceof PolynomialTerm) {
      return new PolynomialTerm(this.coeff.times(term2.coeff), this.variableAtom, this.n + term2.n, this.powerOptions);
    } else {
      return super.multiply(term2, options);
    }
  }
} // end of PolynomialTerm

//// options interfaces
/**
 * Options for `Polynomial` constructor
 */
interface polynomialOptions {
  /** string representing the variable (default `x`) */
  variableAtom?: string;
  /** ascending (default) or descending order*/
  ascending?: boolean;
  /** degree of the first term (default `0`)*/
  initialDegree?: number;
  /** for powers, do we enclose the variable with brackets? `true` gives us regular parenthesis while `lr` gives us `\\left( xxx \\right)` */
  brackets?: boolean | 'lr';
}
/**
 * Options for converting variableAtom to variable
 */
interface powerOptions {
  /** for powers, do we enclose the variable with brackets? `true` gives us regular parenthesis while `lr` gives us `\\left( xxx \\right)` */
  brackets?: boolean | 'lr';
}
/**
 * Options for naming the variable
 */
interface variableOptions {
  /** string representing the variable (default `x`) */
  variable?: string;
}
/**
 * Options for multiplying the Polynomial
 * `{ascending: true}` by default
 */
interface multiplyOptions {
  /** string representing the variable (default `x`) */
  ascending?: boolean;
}
