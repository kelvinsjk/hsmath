// import { Fraction } from 'math-edu'; TODO:
import { Fraction, Term, Exp, Polynomial, Expression }
// from 'math-edu';
from '../../../../math-edu/src/index';

export default class ExpFn extends Term {
  /**
   * class representing the k exp(ax+b) function
   */
  variableAtom: string;
  a: Fraction;
  b: Fraction;

  ////
  // constructor
  ////
  /**
   * Creates a new expFn instance
   *
   * @options defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1`
   *
   */
  constructor(options?: ExpOptions) {
    const defaultOptions = {
      a: 1,
      b: 0,
      variableAtom: 'x',
      coeff: 1,
    };
    const optionsObject = { ...defaultOptions, ...options };
    const a = convertNumberToFraction(optionsObject.a);
    const b = convertNumberToFraction(optionsObject.b);
    const coeff = convertNumberToFraction(optionsObject.coeff);
    if (a.isEqual(0)) {
      throw new Error('expFn ERROR: a must be non-zero');
    }
    const axPLUSb = new Polynomial([a, b], { variableAtom: optionsObject.variableAtom });
    super(coeff, `\\mathrm{e}^{${axPLUSb}}`);
    this.variableAtom = optionsObject.variableAtom;
    this.a = a;
    this.b = b;
  }

  /**
   * subs in the value of x
   */
  valueAt(x: number | Fraction): Exp {
    const axPLUSb = this.a.times(x).plus(this.b);
    return new Exp(axPLUSb, this.coeff);
  }

  /**
   * toNumberFunction
   *
   * @return a javascript function that takes in a number type and output a number type.
   * useful for numerical methods (eg Simpson's rule)
   */
  toNumberFunction(): (x: number) => number {
    return (x: number) => this.coeff.valueOf() * Math.exp(this.a.valueOf() * x + this.b.valueOf());
  }

  /**
   * derivative
   */
  derivative(): ExpFn {
    return new ExpFn({
      a: this.a,
      b: this.b,
      variableAtom: this.variableAtom,
      coeff: this.coeff.times(this.a),
    });
  }

  /**
   * integral
   */
  integral(): ExpFn {
    return new ExpFn({
      a: this.a,
      b: this.b,
      variableAtom: this.variableAtom,
      coeff: this.coeff.divide(this.a),
    });
  }

  /**
   * definite integral
   */
  definiteIntegral(lower: number | Fraction, upper: number | Fraction): Expression {
    lower = convertNumberToFraction(lower);
    upper = convertNumberToFraction(upper);
    const upperExpression = new Expression(this.integral().valueAt(upper));
    return upperExpression.subtract(this.integral().valueAt(lower));
  }
}

interface ExpOptions {
  a?: number | Fraction;
  b?: number | Fraction;
  coeff?: number | Fraction;
  variableAtom?: string;
}

// type MathTypes = number | Fraction | Exp;

// convertNumberToFraction
function convertNumberToFraction(x: number | Fraction): Fraction {
  if (typeof x === 'number') {
    return new Fraction(x);
  } else {
    return new Fraction(x.num, x.den);
  }
}
