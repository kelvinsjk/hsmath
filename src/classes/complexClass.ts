import Fraction from './fractionClass';
//import { SquareRoot } from './rootClasses';
import Expression from './expressionClass';
import Term from './termClass';

/**
 * complex class
 * 
 * @x real part (Fraction)
 * @y imaginary part (Fraction)
 * 
 * we currently only support integer/fractional real and imaginary parts
 */
export default class Complex extends Expression {
  /** real part */
  x: Fraction;
  /** imaginary part */
  y: Fraction;

  //// constructor
  /**
   * Creates a new complex instance
   *
   * @param x real part 
   * @param y imaginary part (default 0)
   * 
   * we currently only support integer/fractional real and imaginary parts
   */
  constructor(x: Fraction | number, y: number | Fraction = 0) {
    x = convertToFraction(x);
    const imaginaryTerm = new Term(y, '\\mathrm{i}');
    super(x, imaginaryTerm);
    this.x = x;
    this.y = convertToFraction(y);
  }

  /**
   * complex addition
   */
  plus(w: Complex | number | Fraction): Complex{
    w = convertToComplex(w);
    return new Complex(this.x.plus(w.x), this.y.plus(w.y));
  }

  /**
   * negative of this complex number: -x-yi
   */
  negative(): Complex {
    return new Complex(this.x.negative(), this.y.negative());
  }

  /**
 * complex subtraction: 
 * 
 * @returns this minus w
 */
  minus(w: Complex | number | Fraction): Complex {
    w = convertToComplex(w);
    return this.plus(w.negative());
  }

  /**
   * complex multiplication
  */
  times(w: Complex | number | Fraction): Complex {
    w = convertToComplex(w);
    const newX = this.x.times(w.x).minus(this.y.times(w.y));
    const newY = this.x.times(w.y).plus(this.y.times(w.x));
    return new Complex(newX, newY);
  }

  /**
   * complex conjugate
   */
  conjugate(): Complex {
    return new Complex(this.x, this.y.negative());
  }

  /** 
   * complex division
   */
  divide(w: Complex | number | Fraction): Complex {
    w = convertToComplex(w);
    const z_wStar = this.times(w.conjugate());
    const rSquared = w.x.times(w.x).plus(w.y.times(w.y));
    const rSquaredReciprocal = Fraction.ONE.divide(rSquared);
    return z_wStar.times(rSquaredReciprocal);
  }

  clone(): Complex {
    return new Complex(this.x, this.y);
  }

  /**
   * the purely imaginary unit i (0+1i)
   */
  static I = new Complex(0, 1);
}

///**
// * options for constructing a complex class instance
// * can be used to set form to 'cartesian'(default), 'polar' or 'exponential'
// * TODO: WARNING: only cartesian mode supported currently
// */
//interface complexOptions{
//  form?: 'cartesian' | 'exponential' | 'polar';
//}

/// convertNumberToFraction
function convertToFraction(num: number | Fraction): Fraction {
  if (typeof num === 'number') {
    num = new Fraction(num);
  }
  return num.clone();
}
/// convertNumberToFraction
function convertToComplex(x: number | Fraction | Complex): Complex {
  return x instanceof Complex ? x.clone() : new Complex(x);
}