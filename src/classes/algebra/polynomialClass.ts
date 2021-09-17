import Term from './termClass';
import Expression from './expressionClass';
import Fraction from '../fractionClass';
import { SquareRoot } from '../rootClasses';

/**
 * A `Polynomial` is a special `Expression` made up of `PolynomialTerm`s
 */
export default class Polynomial extends Expression {
  polynomialTerms: PolynomialTerm[];
  variableAtom: string;
  //// constructor
  /**
   * Creates a new `Polynomial` instance
   * @param array array of coefficients (in `number` or `Fraction` type) of the polynomial, or an array of `PolynomialTerm`s.
   * @param options `{ascending: false, initialDegree: ?n?, variableAtom: 'x', brackets: false}` by default. See the `polynomialOptions` interface for more details
   *
   * the `initialDegree` will be zero if `ascending === true`. Otherwise, it is set such that the last coefficient in the array is the constant term.
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
      // construction from coefficients
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
      // construction from PolynomialTerms
      const variableArray: string[] = [];
      for (const term of array) {
        const polyTerm = term as PolynomialTerm;
        const index = variableArray.indexOf(polyTerm.variable);
        if (index === -1) {
          // new variable
          variableArray.push(polyTerm.variable);
          polynomialTerms.push(polyTerm.clone());
        } else {
          polynomialTerms[index].coeff = polynomialTerms[index].coeff.plus(polyTerm.coeff);
        }
      }
    }
    polynomialTerms = trimZeros(polynomialTerms, optionsObject.variableAtom);
    super(...polynomialTerms);
    this.polynomialTerms = polynomialTerms;
    this.variableAtom = optionsObject.variableAtom;
  }

  //// class methods

  /// arithmetic methods
  /**
   * adds the two polynomials
   * only supports one variable: we will assume the variable atom is that of the first term here
   * @returns the sum
   */
  add(polynomial2: Polynomial | number | Fraction): Polynomial {
    if (typeof polynomial2 === 'number' || polynomial2 instanceof Fraction) {
      polynomial2 = new Polynomial([polynomial2], { variableAtom: this.variableAtom });
    }
    const termsArray = [...this.clone().polynomialTerms, ...polynomial2.clone().polynomialTerms];
    return new Polynomial(termsArray, { variableAtom: this.variableAtom });
  }
  /**
   * finds the difference between two polynomials
   * only supports one variable: we will assume the variable atom is that of the first term here
   * @returns this minus polynomial2
   */
  subtract(polynomial2: Polynomial | number | Fraction): Polynomial {
    if (typeof polynomial2 === 'number' || polynomial2 instanceof Fraction) {
      polynomial2 = new Polynomial([polynomial2], { variableAtom: this.variableAtom });
    }
    const minusP2 = polynomial2.multiply(-1);
    return this.add(minusP2);
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
    const product = new Polynomial(newPolynomialTerms, { variableAtom: this.variableAtom });
    // order ascending/descending
    product.sort(optionsObject.ascending);
    return product;
  }
  /**
   * square a polynomial
   */
  square(): Polynomial {
    return this.multiply(this);
  }
  /**
   * @returns this polynomial taken to a power of `n`
   */
  pow(n: number): Polynomial {
    if (!(Number.isInteger(n) && n >= 0)) {
      throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
    }
    let newPoly = new Polynomial([1], { variableAtom: this.variableAtom });
    for (let i = 0; i < n; i++) {
      newPoly = newPoly.multiply(this);
    }
    return newPoly;
  }
  /**
   * substitutes an expression into this polynomial
   *
   * for example, if this is 3x^2 + x + 1, substituting x+1 returns 3(x+1)^2+x+1 after expansion
   */
  substitute(x: number | Fraction | Polynomial): Polynomial {
    x = typeof x === 'number' || x instanceof Fraction ? new Polynomial([x], { variableAtom: this.variableAtom }) : x;
    let newPoly = new Polynomial([0], { variableAtom: this.variableAtom });
    for (let i = 0; i < this.polynomialTerms.length; i++) {
      const newTerm = x.pow(this.polynomialTerms[i].n).multiply(this.polynomialTerms[i].coeff);
      newPoly = newPoly.add(newTerm);
    }
    newPoly.sort(false); // returns in descending order
    return newPoly;
  }
  /**
   * replaces 'x' in this Polynomial with 'x+a' and returns the expanded form
   */
  shift(a: number | Fraction): Polynomial {
    a = typeof a === 'number' ? new Fraction(a) : a;
    const substitutedPoly = new Polynomial([1, a], { variableAtom: this.variableAtom });
    return this.substitute(substitutedPoly);
  }
  /**
   * replaces 'x' in this Polynomial with 'ax' and returns the expanded form
   */
  scale(a: number | Fraction): Polynomial {
    a = typeof a === 'number' ? new Fraction(a) : a;
    const substitutedPoly = new Polynomial([a], {
      variableAtom: this.variableAtom,
      initialDegree: 1,
    });
    return this.substitute(substitutedPoly);
  }
  /**
   * replaces 'x' in this Polynomial with 'ax+b' and returns the expanded form
   */
  transform(a: number | Fraction, b: number | Fraction): Polynomial {
    a = typeof a === 'number' ? new Fraction(a) : a;
    b = typeof b === 'number' ? new Fraction(b) : b;
    const substitutedPoly = new Polynomial([a, b], { variableAtom: this.variableAtom });
    return this.substitute(substitutedPoly);
  }
  /**
   * truncate a polynomial such that only powers `n` and below are retained
   *
   * @returns truncated polynomial in ascending order
   */
  truncate(n: number): Polynomial {
    const arr: PolynomialTerm[] = [];
    this.polynomialTerms.forEach((e) => {
      if (e.n <= n) {
        arr.push(e);
      }
    });
    return new Polynomial(arr, { ascending: true, variableAtom: this.variableAtom});
  }

  /**
   * find the roots if this polynomial is a quadratic $ax^2+bx+c$
   *
   * warning: at the moment only real roots are supported so the user will have to check to ensure that to prevent errors
   */
  solveQuadratic(): [Expression, Expression] {
    if (this.polynomialTerms.length === 3) {
      const [t1, t2, t3] = this.polynomialTerms;
      let a: Fraction | null = null,
        b: Fraction | null = null,
        c: Fraction | null = null;
      // assign a, b, c
      if (t1.variable === '') {
        c = t1.coeff;
      } else if (t2.variable === '') {
        c = t2.coeff;
      } else if (t3.variable === '') {
        c = t3.coeff;
      }
      if (t1.n === 1) {
        b = t1.coeff;
      } else if (t2.n === 1) {
        b = t2.coeff;
      } else if (t3.n === 1) {
        b = t3.coeff;
      }
      if (t1.n === 2) {
        a = t1.coeff;
      } else if (t2.n === 2) {
        a = t2.coeff;
      } else if (t3.n === 2) {
        a = t3.coeff;
      }
      // proceed if a,b,c found
      if (a !== null && b !== null && c !== null) {
        a = a as Fraction;
        b = b as Fraction;
        c = c as Fraction;
        const discriminant = b.times(b).minus(a.times(c).times(4));
        const sqrt = new SquareRoot(discriminant);
        const root1 = new Expression(b.times(-1).divide(a.times(2)), sqrt.divide(a.times(2)));
        const root2 = new Expression(b.times(-1).divide(a.times(2)), sqrt.divide(a.times(-2)));
        return a.valueOf() < 0 ? [root1, root2] : [root2, root1];
      }
    }
    throw new TypeError(`this polynomial ${this} is not a quadratic`);
  }

  /// array methods
  /**
   * sort the polynomial
   * @param ascending default `true`
   * warning: mutates object
   * @returns a reference to the object
   */
  sort(ascending = true): this {
    this.polynomialTerms.sort((firstTerm, secondTerm) => {
      return ascending ? firstTerm.n - secondTerm.n : secondTerm.n - firstTerm.n;
    });
    const newPolynomial = new Polynomial(this.polynomialTerms, { variableAtom: this.variableAtom });
    this.terms = newPolynomial.terms;
    return this;
  }

  /**
   * clone
   * @returns a new instance of this
   */
  clone(): Polynomial {
    const terms: PolynomialTerm[] = [];
    for (const term of this.polynomialTerms) {
      terms.push(term.clone());
    }
    return new Polynomial(terms, { variableAtom: this.variableAtom });
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

  /**
   * long division
   *
   * @param quotient should be left blank. it is used internally to recursively obtain our result
   *
   * @return `[quotient, remainder]`
   */
  longDivide(divisor: Polynomial, quotient?: Polynomial): [Polynomial, Polynomial] {
    if (quotient === undefined) {
      // start of long division
      quotient = new Polynomial([0], { variableAtom: this.variableAtom });
      divisor.sort(false);
    }
    const dividend = this.clone();
    // put in descending order
    dividend.sort(false);
    const divisorPower = divisor.polynomialTerms[0].n;
    const dividendPower = dividend.polynomialTerms[0].n;
    if (dividendPower < divisorPower) {
      // done with division
      return [quotient, dividend];
    } else {
      // proceed recursively
      const divisorLeadingCoefficient = divisor.polynomialTerms[0].coeff;
      const dividendLeadingCoefficient = dividend.polynomialTerms[0].coeff;
      const quotientToAdd = new Polynomial([dividendLeadingCoefficient.divide(divisorLeadingCoefficient)], {
        initialDegree: dividendPower - divisorPower, variableAtom: this.variableAtom,
      });
      const newQuotient = quotient.add(quotientToAdd);
      const newDividend = dividend.subtract(divisor.multiply(quotientToAdd));
      return newDividend.longDivide(divisor, newQuotient);
    }
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
export class PolynomialTerm extends Term {
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
  multiply(term2: number | Fraction | PolynomialTerm): PolynomialTerm {
    if (term2 instanceof PolynomialTerm) {
      return new PolynomialTerm(this.coeff.times(term2.coeff), this.variableAtom, this.n + term2.n, this.powerOptions);
    } else {
      //if (typeof term2 === 'number' || term2 instanceof Fraction) {
      return new PolynomialTerm(this.coeff.times(term2), this.variableAtom, this.n, this.powerOptions);
    }
    //else { // term
    //  return super.multiply(term2, options);
    //}
  }

  clone(): PolynomialTerm {
    return new PolynomialTerm(
      new Fraction(this.coeff.num, this.coeff.den),
      this.variableAtom,
      this.n,
      this.powerOptions,
    );
  }
} // end of PolynomialTerm

/// internal function
function trimZeros(poly: PolynomialTerm[], variableAtom: string): PolynomialTerm[] {
  const newPolyTerms: PolynomialTerm[] = [];
  for (const polyTerm of poly) {
    if (!polyTerm.coeff.isEqual(0)) {
      newPolyTerms.push(polyTerm);
    }
  }
  if (newPolyTerms.length === 0) {
    newPolyTerms.push(new PolynomialTerm(0, variableAtom, 0));
  }
  return newPolyTerms;
}

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
 * Options for multiplying the Polynomial
 * `{ascending: true}` by default
 */
interface multiplyOptions {
  /** string representing the variable (default `x`) */
  ascending?: boolean;
}
