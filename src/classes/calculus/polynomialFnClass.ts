import PowerFn from './powerFnClass';
import { default as Polynomial, PolynomialTerm } from '../algebra/polynomialClass';
import Fraction from '../fractionClass';
import Expression from '../algebra/expressionClass';
import type Term from '../algebra/termClass';

export default class PolynomialFn extends Polynomial {
  /**
   * class representing the polynomial function ax^n + bx^{n-1} + ...
   */
  powerFns: PowerFn[];

  ////
  // constructor
  ////
  /**
   * Creates a new polynomialFn instance
   *
   * @param array array of coefficients (in `number` or `Fraction` type) of the polynomial, or an array of `PolynomialTerm`s.
   * @param options `{ascending: false, initialDegree: ?n?, variableAtom: 'x', brackets: false}` by default. See the `polynomialOptions` interface for more details
   *
   * the `initialDegree` will be zero if `ascending === true`. Otherwise, it is set such that the last coefficient in the array is the constant term.
   */
  constructor(array: (number | Fraction)[] | PolynomialTerm[], options?: polynomialOptions) {
    super(array, options);
    const powerFns: PowerFn[] = [];
    for (const polyTerm of this.polynomialTerms) {
      powerFns.push(new PowerFn({ coeff: polyTerm.coeff, n: polyTerm.n, variableAtom: polyTerm.variableAtom }));
    }
    this.powerFns = powerFns;
  }

  /**
   * subs in the value of x
   *
   * warning: only valid for non-negative integral power n at the moment
   */
  valueAt(x: number | Fraction): Fraction {
    let sum = new Fraction(0);
    for (const powerFn of this.powerFns) {
      sum = sum.plus(powerFn.valueAt(x));
    }
    return sum;
  }
  /**
   * subs in the value of x, where x is an algebraic term
   */
  algebraicValueAt(x: Term): Expression {
    let sum: Expression | undefined = undefined;
    for (const powerFn of this.powerFns) {
      sum = sum === undefined ? new Expression(powerFn.algebraicValueAt(x)) : sum.add(powerFn.algebraicValueAt(x));
    }
    return sum as Expression;
  }
  /**
   * toNumberFunction
   *
   * @return a javascript function that takes in a number type and output a number type.
   * useful for numerical methods (eg Simpson's rule)
   */
  toNumberFunction(): (x: number) => number {
    return (x: number) => {
      let sum = 0;
      for (const powerFn of this.powerFns) {
        sum = sum + powerFn.valueAt(x).valueOf();
      }
      return sum;
    };
  }
  /**
   * replaces 'x' in this Polynomial with 'ax+b' and returns the expanded form
   */
  transform(a: number | Fraction, b: number | Fraction): PolynomialFn {
    a = typeof a === 'number' ? new Fraction(a) : a;
    b = typeof b === 'number' ? new Fraction(b) : b;
    const substitutedPoly = new Polynomial([a, b], { variableAtom: this.polynomialTerms[0].variableAtom });
    return new PolynomialFn(this.substitute(substitutedPoly).polynomialTerms);
  }
  /**
   * replaces 'x' in this Polynomial with 'x+a' and returns the expanded form
   */
  shift(a: number | Fraction): PolynomialFn {
    return this.transform(1, a);
  }
  /**
   * replaces 'x' in this Polynomial with 'ax' and returns the expanded form
   */
  scale(a: number | Fraction): PolynomialFn {
    return this.transform(a, 0);
  }

  /**
   * derivative
   *
   * TODO: recover Polynomials from PowerFns to return a PolynomialFn type
   */
  derivative(): PolynomialFn {
    const polynomialTerms: PolynomialTerm[] = [];
    for (const powerFn of this.powerFns) {
      const derivativeFn = powerFn.derivative();
      polynomialTerms.push(new PolynomialTerm(derivativeFn.coeff, derivativeFn.variableAtom, derivativeFn.n.num)); // warning: assumes integer powers
    }
    return new PolynomialFn(polynomialTerms);
  }

  /**
   * integral
   *
   * TODO: recover Polynomials from PowerFns to return a PolynomialFn type
   */
  integral(): PolynomialFn {
    const polynomialTerms: PolynomialTerm[] = [];
    for (const powerFn of this.powerFns) {
      const integralFn = powerFn.integral();
      polynomialTerms.push(new PolynomialTerm(integralFn.coeff, integralFn.variableAtom, integralFn.n.num)); // warning: assumes integer powers
    }
    return new PolynomialFn(polynomialTerms);
  }

  /**
   * definite integral
   */
  definiteIntegral(lower: number | Fraction | Term, upper: number | Fraction | Term): Expression {
    let expression: Expression | undefined = undefined;
    for (const powerFn of this.powerFns) {
      expression =
        expression === undefined
          ? powerFn.definiteIntegral(lower, upper)
          : expression.add(powerFn.definiteIntegral(lower, upper));
    }
    return expression as Expression;
  }
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
