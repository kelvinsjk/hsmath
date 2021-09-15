import Fraction from '../fractionClass';
import { SquareRoot } from '../rootClasses';
import Expression from '../algebra/expressionClass';
import Term from '../algebra/termClass';
import Angle from '../trig/angleClass';
import { Trig } from '../../fns/trig/trigFunctions';

/**
 * complex Exp class representing a complex number in the form r e^{i \\theta}
 *
 * @r complex modulus
 * @theta complex argument
 *
 * we currently only support integer/fractional real and imaginary parts
 */
export default class ComplexExp {
  /** complex modulus */
  r: SquareRoot;
  /** complex argument */
  theta: Angle;
  /** principal range either from 0 to 2pi or from -pi to pi (default, `principalArgFromZero=false`) */
  principalArgFromZero: boolean;

  //// constructor
  /**
   * Creates a new complex instance
   *
   * @param r complex modulus
   * @param theta complex argument
   * @param options defaults to `{principalArgFromZero: false}`, which will assume a principal range from -pi to pi. If `true`, principal range will be taken as 0 to 2pi.
   *
   */
  constructor(r: Fraction | number | SquareRoot, theta: number | Angle, options?: ComplexExpOptions) {
    r = r instanceof SquareRoot ? r : new SquareRoot(1, r);
    const defaultOptions = { principalArgFromZero: false };
    const { principalArgFromZero } = { ...defaultOptions, ...options };
    theta = typeof theta === 'number' ? new Angle(theta, principalArgFromZero) : theta.clone();
    this.r = r;
    this.theta = theta;
    this.principalArgFromZero = principalArgFromZero;
  }

  ///**
  // * complex addition
  // */
  //plus(w: Complex | number | Fraction): Complex {
  //  w = convertToComplex(w);
  //  return new Complex(this.x.plus(w.x), this.y.plus(w.y));
  //}

  /**
   * negative of this complex number: -r e^{i \\theta} = r e^{i (\\theta + \\pi)}
   */
  negative(): ComplexExp {
    return new ComplexExp(this.r, this.theta.plus(180), {principalArgFromZero: this.principalArgFromZero});
  }

  /**
   * complex multiplication
   */
  times(w: ComplexExp | number | Fraction): ComplexExp {
    w = convertToComplex(w);
    const newR = this.r.times(w.r);
    const newTheta = this.theta.plus(w.theta);
    return new ComplexExp(newR, newTheta, { principalArgFromZero: this.principalArgFromZero });
  }

  /**
   * complex conjugate
   */
  conjugate(): ComplexExp {
    return new ComplexExp(this.r, this.theta.negative(), { principalArgFromZero: this.principalArgFromZero });
  }

  /**
   * complex division
   */
  divide(w: ComplexExp | number | Fraction): ComplexExp {
    w = convertToComplex(w);
    const newR = this.r.divide(w.r);
    const newTheta = this.theta.minus(w.theta);
    return new ComplexExp(newR, newTheta, { principalArgFromZero: this.principalArgFromZero });
  }

  /**
   * clones a new instance of this complex Exp number
   */
  clone(): ComplexExp {
    return new ComplexExp(this.r, this.theta, { principalArgFromZero: this.principalArgFromZero });
  }

  /**
   * @returns the LaTeX string of this complex number in exponential form r e^{i theta}
   */
  toString(): string {
    const rString = this.r.isEqual(1) ? '' : `${this.r} `;
    return `${rString}\\mathrm{e}^{ ${this.theta} \\mathrm{i} }`;
  }

  /**
   * @returns the LaTeX string of this complex number in polar form r (cos theta + i sin theta)
   */
  toPolarString(): string {
    let polarString = `\\cos ${this.theta} + \\mathrm{i} \\sin ${this.theta}`;
    if (this.r.isEqual(0)) {
      return '0';
    }
    polarString = this.r.isEqual(1) ? polarString : `${this.r} \\left( ${polarString} \\right)`;
    return polarString;
  }

  /**
   * @returns the LaTeX string of this complex number in cartesian form x + yi
   * 
   * WARNING: at the moment this only works if theta is a special angle
   */
  toCartesianString(): string {
    const x = Trig.cos(this.theta).times(this.r);
    const y = Trig.sin(this.theta).times(this.r);
    const xTerm = x.isRational() ? new Term(x.toFraction()) : `${x}`;
    const absY = y.abs();
    const plusMinus1 = y.isEqual(absY) ? 1 : -1;
    const yTerm = y.isRational() ? new Term(y.toFraction(), '\\mathrm{i}') : new Term(plusMinus1, `${absY} \\mathrm{i}`);
    const cartesianExpression = new Expression(xTerm, yTerm)
    return `${cartesianExpression}`;
  }


  ///**
  // * the purely imaginary unit i (0+1i)
  // */
  //static I = new Complex(0, 1);
}

interface ComplexExpOptions{
  principalArgFromZero?: boolean,
}

/// convertNumberToComplex
function convertToComplex(x: number | Fraction | ComplexExp): ComplexExp {
  return x instanceof ComplexExp ? x.clone() : new ComplexExp(x, 0);
}
