import Fraction from '../fractionClass';
import Term from '../expressions/termClass';

/**
 * angle class
 * 
 * @degrees angle in degrees
 * @rangeMinisZero if true, angle will be converted to be between 0 (inclusive) and 360 (exclusive). Otherwise we will be between -180 (exclusive) and 180 (inclusive).
 * 
 * class representing special angles that are multiples of 30 or 45 degrees.
 * 
 * as a extension of the `Term` class, the `toString` method will return the angle in radians (e.g. \frac{1}{2} \\pi)
 */
export default class Angle extends Term {
  /** angle in degrees */
  degrees: number;
  /** 
   * @rangeMinisZero
   * if true, angle will be converted to be between 0 (inclusive) and 360 (exclusive). Otherwise we will be between -180 (exclusive) and 180 (inclusive). 
   * */
  rangeMinIsZero: boolean;

  //// constructor
  /**
   * Creates a new angle instance
   *
   * @degrees angle in degrees
   * @rangeMinisZero if true (default), angle will be converted to be between 0 (inclusive) and 360 (exclusive). Otherwise we will be between -180 (exclusive) and 180 (inclusive).
   * 
   * we currently only support multiples of 30 and/or 45 degrees
   */
  constructor(degrees: number, rangeMinIsZero = true) {
    if (!(degrees % 45 === 0 || degrees % 30 === 0)) {
      throw new Error('angle ERROR: angle must be a multiple of 35/45');
    }
    degrees = degrees % 360;
    if (rangeMinIsZero) {
      degrees = degrees < 0 ? degrees + 360 : degrees;
    } else { // from -180 to 180
      if (degrees <= -180) {
        degrees = degrees + 360;
      } else if (degrees > 180) {
        degrees = degrees - 360;
      }
    }
    const radiansCoeff = new Fraction(degrees, 180);
    super(radiansCoeff, '\\pi');
    this.degrees = degrees;
    this.rangeMinIsZero = rangeMinIsZero;
  }

  /**
   * toggles principal range:
   * 
   * toggles the `rangeMinIsZero` property, changes the angle to fit, and return confirmation message as a string
   */
  togglePrincipalRange(): string {
    this.rangeMinIsZero = !this.rangeMinIsZero;
    const duplicate = new Angle(this.degrees, this.rangeMinIsZero);
    this.degrees = duplicate.degrees;
    return this.rangeMinIsZero ? "0 to 2pi" : "-pi to pi";
  }

  /**
   * addition
   */
  plus(B: Angle): Angle {
    return new Angle(this.degrees + B.degrees, this.rangeMinIsZero);
  }
  /**
   * subtraction
   * 
   * @return this minus B
   */
  minus(B: Angle): Angle {
    return new Angle(this.degrees - B.degrees, this.rangeMinIsZero);
  }
  /**
   * multiplication
   */
  times(k: number): Angle {
    return new Angle(this.degrees * k, this.rangeMinIsZero);
  }
  /**
   * multiplication
   */
  divide(k: number): Angle {
    if (k === 0) {
      throw new Error("angle ERROR: division by 0 is not allowed");
    }
    return new Angle(this.degrees / k, this.rangeMinIsZero);
  }
  /**
   * @returns 360 - this angle
   */
  negative(): Angle {
    return new Angle(-this.degrees, this.rangeMinIsZero);
  }
  /**
   * @returns 90 - this angle
   */
  complement(): Angle {
    return new Angle(90 - this.degrees, this.rangeMinIsZero);
  }
  /**
   * @returns 180 - this angle
   */
  supplement(): Angle {
    return new Angle(180 - this.degrees, this.rangeMinIsZero);
  }

  clone(): Angle {
    return new Angle(this.degrees, this.rangeMinIsZero);
  }
}