import Term from './termClass';
import Fraction from './fractionClass';

/**
 * `MathFunction` class (extends the `Term` class) `{coeff: Fraction, termString: string, fn: (x: number|Fraction|Term)=> {Fraction|Term} }`
 *
 * In addition to all the `Term` class properties (ability to typeset and combine with other like terms/functions),
 * the MathFunction class has a function `fn` that returns a `Fraction` or `Term` when given a `number|Fraction|Term` input.
 * 
 * For example, if we were to implement the sine function, the `termString` will be `\\sin x`, and the `fn` will be such that
 * `fn(2)` returns the term `\\sin 2`, `fn(1/4 \\pi)` returns the term '1/2 \\sqrt{2}` and `fn(0)` returns the fraction `0`.
 * 
 */
class MathFunction extends Term { // coeff, termString from Term
  /** TODO: docs */
  fn: MathFn;

  //// constructor
  /**
   * Creates a new `MathFunction` instance
   * @param coeff coefficient of the function
   * @param termString string representation of the function
   * @param fn: TODO: docs
   */
  constructor(coeff: Fraction | number, termString: string, fn: MathFn) {
    super(coeff, termString);
    this.fn = fn;
  }
  
  /**
   * TODO: docs
   */
  substituteX(x: number | Fraction | Term): (Fraction|Term) {
    return this.fn(x);
  }

  /** The 'identity' function $f(x)=x$ */
  static IDENTITY = new MathFunction(1, 'x', (x: number | Fraction | Term) => {
    return (typeof x === 'number') ? new Fraction(x) : x;
  })
}

interface MathFn {
  (x: number | Fraction | Term): (Fraction | Term);
}

// TODO: plus, minus, times, divide, compose

export {MathFunction}