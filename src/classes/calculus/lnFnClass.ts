//import {
//  Term, Polynomial
//  // Ln, Fraction
//} from 'math-edu';
import {Ln, Fraction, Term, Polynomial} from '../../../../math-edu/src/index';
import PowerFn from './powerFnClass';

export default class LnFn extends Term {
  /**
   * class representing the k ln(ax+b) function
   * @param n is used to represent k (ln ax+b)^n for by parts integration, will not be used otherwise.
   */
  variableAtom: string;
  a: Fraction;
  b: Fraction;
  n: number;

  ////
  // constructor
  ////
  /**
   * Creates a new lnFn instance
   *
   * @options defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, n: 1`
   *
   */
  constructor(options?: LnOptions) {
    const defaultOptions = {
      a: 1,
      b: 0,
      variableAtom: 'x',
      coeff: 1,
      n: 1
    };
    const optionsObject = { ...defaultOptions, ...options };
    const a = convertNumberToFraction(optionsObject.a);
    const b = convertNumberToFraction(optionsObject.b);
    const coeff = convertNumberToFraction(optionsObject.coeff);
    if (a.isEqual(0)) {
      throw new Error('lnFn ERROR: a must be non-zero');
    }
    const axPLUSb = new Polynomial([a, b], { variableAtom: optionsObject.variableAtom });
    const lnTerm = b.isEqual(0) ? `\\ln ${axPLUSb}` : `\\ln ( ${axPLUSb} )`
    super(coeff, lnTerm);
    this.variableAtom = optionsObject.variableAtom;
    this.a = a;
    this.b = b;
    this.n = optionsObject.n;
  }

  /**
   * subs in the value of x
   */
  valueAt(x: number | Fraction): Ln {
    const axPLUSb = this.a.times(x).plus(this.b);
    return new Ln(axPLUSb, this.coeff);
  }

  /**
   * toNumberFunction
   *
   * @return a javascript function that takes in a number type and output a number type.
   * useful for numerical methods (eg Simpson's rule)
   */
  toNumberFunction(): (x: number) => number {
    return (x: number) => this.coeff.valueOf() * Math.log(this.a.valueOf() * x + this.b.valueOf());
  }

  /**
   * derivative
   */
  derivative(): PowerFn {
    return new PowerFn({
      a: this.a,
      b: this.b,
      variableAtom: this.variableAtom,
      coeff: this.coeff.times(this.a),
      n: -1
    });
  }

  // /**
  //  * integral
  //  */
  // integral(): ExpFn {
  //   return new ExpFn({
  //     a: this.a,
  //     b: this.b,
  //     variableAtom: this.variableAtom,
  //     coeff: this.coeff.divide(this.a),
  //   });
  // }
// 
  // /**
  //  * definite integral
  //  */
  // definiteIntegral(lower: number | Fraction, upper: number | Fraction): Expression {
  //   lower = convertNumberToFraction(lower);
  //   upper = convertNumberToFraction(upper);
  //   const upperExpression = new Expression(this.integral().valueAt(upper));
  //   return upperExpression.subtract(this.integral().valueAt(lower));
  // }
}

interface LnOptions {
  a?: number | Fraction,
  b?: number | Fraction,
  coeff?: number | Fraction,
  variableAtom?: string,
  n?: number,
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
