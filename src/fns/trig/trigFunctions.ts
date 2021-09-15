import Angle from '../../classes/trig/angleClass';
import { SquareRoot } from '../../classes/rootClasses';
import Fraction from '../../classes/fractionClass';

/**
 * sine function
 *
 * @param x Angle | number
 * @returns the trig ratio of the SquareRoot class
 *
 * only works for angles in multiples of 30 and 45
 */
function sin(x: Angle | number): SquareRoot {
  if (typeof x === 'number') {
    x = new Angle(x);
  }
  let basicAngle = Math.abs(x.degrees % 180);
  basicAngle = basicAngle > 90 ? 180 - basicAngle : basicAngle;
  const trigRatios: TrigRatios = {
    '0': new SquareRoot(1, 0),
    '30': new SquareRoot(1, new Fraction(1, 2)),
    '45': new SquareRoot(2, new Fraction(1, 2)),
    '60': new SquareRoot(3, new Fraction(1, 2)),
    '90': new SquareRoot(1),
  };
  let ratio = trigRatios[basicAngle];
  if (ratio === undefined) {
    throw new RangeError('angle is not a variation of the special angles (0, 30, 45, 60, 90)')
  }
  if (x.degrees < 0 || x.degrees > 180) {
    ratio = ratio.negative();
  }
  return ratio;
}
/**
 * cosine function
 *
 * @param x Angle | number
 * @returns the trig ratio of the SquareRoot class
 *
 * only works for angles in multiples of 30 and 45
 */
function cos(x: Angle | number): SquareRoot {
  if (typeof x === 'number') {
    x = new Angle(x);
  }
  let basicAngle = Math.abs(x.degrees % 180);
  basicAngle = basicAngle > 90 ? 180 - basicAngle : basicAngle;
  const trigRatios: TrigRatios = {
    '0': new SquareRoot(1),
    '30': new SquareRoot(3, new Fraction(1, 2)),
    '45': new SquareRoot(2, new Fraction(1, 2)),
    '60': new SquareRoot(1, new Fraction(1, 2)),
    '90': new SquareRoot(1, 0),
  };
  let ratio = trigRatios[basicAngle];
  if ((x.degrees > 90 && x.degrees < 270) || x.degrees < -90) {
    ratio = ratio.negative();
  }
  return ratio;
}
/**
 * tangent function
 *
 * @param x Angle | number
 * @returns the trig ratio of the SquareRoot class
 *
 * only works for angles in multiples of 30 and 45.
 *
 * throws an error if angle is an odd multiple of 90
 */
function tan(x: Angle | number): SquareRoot {
  if (typeof x === 'number') {
    x = new Angle(x);
  }
  let basicAngle = Math.abs(x.degrees % 180);
  basicAngle = basicAngle > 90 ? 180 - basicAngle : basicAngle;
  if (basicAngle === 90) {
    throw new Error('trig ERROR: tan 90 is undefined');
  }
  const trigRatios: TrigRatios = {
    '0': new SquareRoot(1, 0),
    '30': new SquareRoot(3, new Fraction(1, 3)),
    '45': new SquareRoot(1),
    '60': new SquareRoot(3),
  };
  let ratio = trigRatios[basicAngle];
  if ((x.degrees > 90 && x.degrees < 180) || (x.degrees < 0 && x.degrees > -90) || x.degrees > 270) {
    ratio = ratio.negative();
  }
  return ratio;
}

export const Trig = {
  sin: sin,
  cos: cos,
  tan: tan,
};

interface TrigRatios {
  [key: string]: SquareRoot;
}
