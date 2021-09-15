import Fraction from '../fractionClass';
import Term from '../algebra/termClass';
import Expression from '../algebra/expressionClass';
import { SquareRoot } from '../rootClasses';
import convertNumberToFraction from '../../internal/convertNumberToFraction';

/**
 * Vector class representing a 3d vector k(x,y,z)
 */
export default class Vector {
  // vector of the form k(x,y,z).
  x: Fraction;
  y: Fraction;
  z: Fraction;
  k: Fraction;
  /**
   * Vector class constructor for the vector represented by k(a,b,c).
   *
   * If `simplify` in the options is set to `true`, then we will factorize our expression such that x,y,z are integers with gcd=1.
   *
   * If `stretchable` in the options is set to `true`, then we will simplify plus set k to be 1.
   *
   * `new Vector(x: number | Fraction, y=0, z=0, {k: 1, simplify: false, stretchable: false})`
   */
  constructor(x: number | Fraction, y?: number | Fraction, z?: number | Fraction, options?: vectorOptions) {
    // options
    const defaultOptions = {
      k: Fraction.ONE,
      simplify: false,
      stretchable: false,
    };
    const optionsObject = { ...defaultOptions, ...options };
    // initialize default variables
    x = convertNumberToFraction(x);
    y = y === undefined ? Fraction.ZERO : convertNumberToFraction(y);
    z = z === undefined ? Fraction.ZERO : convertNumberToFraction(z);
    this.x = x;
    this.y = y;
    this.z = z;
    this.k = convertNumberToFraction(optionsObject.k);
    // simplify if necessary
    if (optionsObject.simplify || optionsObject.stretchable) {
      this.simplify(optionsObject.stretchable);
    }
  }
  /**
   * simplifies the vector to k(a, b, c) by taking out common factors so that
   * a,b,c are integers with gcd=1.
   *
   * If `stretchable` is set to `true`, then we will also set k to be 1.
   *
   * WARNING: mutates current instance
   */
  simplify(stretchable = false): void {
    if (this.isZero()) {
      this.k = Fraction.ONE;
      this.x = new Fraction(0);
      this.y = new Fraction(0);
      this.z = new Fraction(0);
    } else {
      const [[x, y, z], divisor] = Fraction.factorize(this.x, this.y, this.z);
      this.x = x;
      this.y = y;
      this.z = z;
      this.k = stretchable ? Fraction.ONE : divisor.times(this.k);
    }
  }
  /**
   * multiply k into the vector, taking this: k(x,y,z) and
   * @returns (kx, ky, kz)
   */
  multiplyKIn(): Vector {
    return new Vector(this.x.times(this.k), this.y.times(this.k), this.z.times(this.k));
  }
  /**
   * vector addition
   *
   * if `k` is the same for both vectors, we will do component wise addition, leaving the same `k`
   *
   * if `k`s is different, then we will expand in both `k`s such that the sum has `k=1`
   */
  plus(v2: Vector): Vector {
    if (this.k.isEqual(v2.k)) {
      return new Vector(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z), { k: this.k.clone() });
    } else {
      const newV1 = this.multiplyKIn();
      const newV2 = v2.multiplyKIn();
      return newV1.plus(newV2);
    }
  }
  /**
   * vector subtraction
   *
   * if `k` is the same for both vectors, we will do component wise addition, leaving the same `k`
   *
   * if `k`s is different, then we will expand in both `k`s such that the sum has `k=1`
   */
  minus(v2: Vector): Vector {
    const v3 = new Vector(v2.x.times(-1), v2.y.times(-1), v2.z.times(-1), { k: v2.k.clone() });
    return this.plus(v3);
  }
  /**
   * scalar multiplication
   *
   * @param options `{changeK: false}`
   *
   * if `changeK` is set to true, will only change `k` of this vector. otherwise will do component wise multiplication (default)
   */
  multiply(k: number | Fraction, options?: scalarMultiplicationOptions): Vector {
    const defaultOptions = { changeK: false };
    const optionsObject = { ...defaultOptions, ...options };
    return optionsObject.changeK
      ? new Vector(this.x, this.y, this.z, { k: this.k.times(k) })
      : new Vector(this.x.times(k), this.y.times(k), this.z.times(k), { k: this.k });
  }
  /**
   * negative vector
   *
   * @param options `{changeK: false}`
   *
   * if `changeK` is set to true, will only change `k` of this vector. otherwise will do component wise multiplication (default)
   */
  negative(options?: scalarMultiplicationOptions): Vector {
    const defaultOptions = { changeK: false };
    const optionsObject = { ...defaultOptions, ...options };
    return optionsObject.changeK
      ? new Vector(this.x, this.y, this.z, { k: this.k.times(-1) })
      : new Vector(this.x.times(-1), this.y.times(-1), this.z.times(-1), { k: this.k });
  }
  /**
   * scalar (dot) product
   *
   * if @param v2 is left empty, then we will return the dot product of this by itself
   */
  dot(v2?: Vector): Fraction {
    // dot product
    if (v2 === undefined) {
      v2 = this.clone();
    }
    return this.k.times(v2.k).times(this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z)));
  }
  /**
   * vector magnitude:
   *
   * returns the magnitude of this vector, in the SquareRoot class
   */
  magnitude(): SquareRoot {
    const magnitudeSquared = this.dot();
    return new SquareRoot(magnitudeSquared);
  }
  /**
   * vector (cross) product
   */
  cross(v2: Vector): Vector {
    const newK = this.k.times(v2.k);
    const newB = this.z.times(v2.x).minus(this.x.times(v2.z));
    const newA = this.y.times(v2.z).minus(this.z.times(v2.y));
    const newC = this.x.times(v2.y).minus(this.y.times(v2.x));
    return new Vector(newA, newB, newC, { k: newK });
  }
  /**
   * check if two vectors are parallel
   */
  isParallelTo(v2: Vector): boolean {
    if (this.isZero() || v2.isZero()) {
      throw new Error('Vector ERROR: parallel does not exist for zero vectors');
    }
    const n = this.cross(v2);
    return n.isZero();
  }
  /**
   * check if two vectors are perpendicular
   */
  isPerpendicular(v2: Vector): boolean {
    if (this.isZero() || v2.isZero()) {
      throw new Error('Vector ERROR: perpendicular does not exist for zero vectors');
    }
    const dotProduct = this.dot(v2);
    return dotProduct.isEqual(0);
  }
  /**
   * returns latex string representing the vector
   *
   * @param options default: `{ijkMode: false, multiplyKIn: false}`
   * ijkMode returns the vector in ijk notation (vs the default column vector notation)
   * multiplyKIn multiplies `k` into the vector
   */
  toString(options?: vectorToStringOptions): string {
    // return latex string: column vector mode or ijk mode
    const defaultOptions = {
      ijkMode: false,
      multiplyKIn: false,
    };
    const optionsObject = { ...defaultOptions, ...options };
    const vector = optionsObject.multiplyKIn ? this.multiplyKIn() : this;
    if (optionsObject.ijkMode) {
      const iTerm = new Term(vector.x, '\\mathbf{i}');
      const jTerm = new Term(vector.y, '\\mathbf{j}');
      const kTerm = new Term(vector.z, '\\mathbf{k}');
      const ijkExpression = new Expression(iTerm, jTerm, kTerm);
      const expressionWithK = new Term(vector.k, ijkExpression.toString());
      return expressionWithK.toString({ brackets: true });
    } else {
      // column vector
      const vectorTerm = new Term(
        vector.k,
        `\\begin{pmatrix} ${vector.x} \\\\ ${vector.y} \\\\ ${vector.z} \\end{pmatrix}`,
      );
      return vectorTerm.toString();
    }
  }
  /**
   * @returns (kx, ky, kz) as a coordinate triple. Can add the name of the point in front of the definition
   */
  toCoordinates(name?: string): string {
    const vector = this.multiplyKIn();
    const coordinates = `\\left( ${vector.x} , ${vector.y} , ${vector.z} \\right)`;
    if (name == undefined) {
      return coordinates;
    } else {
      return name + coordinates;
    }
  }
  /**
   * checks if two vectors are equal
   */
  isEqual(v2: Vector): boolean {
    return this.minus(v2).magnitude().valueOf() === 0;
  }
  /**
   * check if we are the zero vector
   */
  isZero(): boolean {
    return this.magnitude().valueOf() === 0;
  }
  /**
   * @returns the angle between the vectors, to 1dp (in degrees) (unless the answer is 0, 30, 45, 60 or 90)
   *
   * Example: 45.7^{\circ}
   *
   * @param angleOptions defaults to { acute: false, sineMode: false }.
   * acute will cause us to always return the acute angle, assuming the vectors can be of opposite direction.
   * sineMode uses arcsin instead of arccos (useful for angle between line and plane)
   */
  angle(v2: Vector, angleOptions?: { acute?: boolean; sineMode?: boolean }): string {
    if (this.isZero() || v2.isZero()) {
      throw new Error('Vector ERROR: angle is not defined for zero vectors');
    }
    const defaultOptions = { acute: false, sineMode: false };
    const options = { ...defaultOptions, ...angleOptions };
    const sineMode = options.sineMode;
    const cosThetaSquared = this.dot(v2).square().divide(this.dot().times(v2.dot()));
    if (sineMode) {
      if (cosThetaSquared.isEqual(0)) {
        return '0^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(1, 4))) {
        return '30^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(1, 2))) {
        return '45^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(3, 4))) {
        return '60^{\\circ}';
      } else if (cosThetaSquared.isEqual(1)) {
        return '90^{\\circ}';
      } else {
        const angle = (Math.asin(Math.pow(cosThetaSquared.valueOf(), 1 / 2)) / Math.PI) * 180;
        return angle.toFixed(1) + '^{\\circ}';
      }
    } else {
      // default cosine
      if (cosThetaSquared.isEqual(0)) {
        return '90^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(1, 4))) {
        return this.dot(v2).valueOf() < 0 && !options.acute ? '120^{\\circ}' : '60^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(1, 2))) {
        return this.dot(v2).valueOf() < 0 && !options.acute ? '135^{\\circ}' : '45^{\\circ}';
      } else if (cosThetaSquared.isEqual(new Fraction(3, 4))) {
        return this.dot(v2).valueOf() < 0 && !options.acute ? '150^{\\circ}' : '30^{\\circ}';
      } else if (cosThetaSquared.isEqual(1)) {
        return this.dot(v2).valueOf() < 0 && !options.acute ? '180^{\\circ}' : '0^{\\circ}';
      } else {
        const angle = options.acute
          ? (Math.acos(Math.pow(cosThetaSquared.valueOf(), 1 / 2)) / Math.PI) * 180
          : (Math.acos(Math.sign(this.dot(v2).valueOf()) * Math.pow(cosThetaSquared.valueOf(), 1 / 2)) / Math.PI) * 180;
        return angle.toFixed(1) + '^{\\circ}';
      }
    }
  }

  /**
   * clones a new instance of this vector
   */
  clone(): Vector {
    return new Vector(this.x.clone(), this.y.clone(), this.z.clone(), { k: this.k.clone() });
  }

  /**
   * ratio theorem: returns the position vector of M such that AM:MB = lambda:mu (extendedMode: false)
   *
   * @options `{extendedMode: false}` by default. if `extendedMode = true`, then M is on AB extended such that AB:BM = lambda:mu
   */
  static ratioTheorem(a: Vector, b: Vector, lambda = 1, mu = 1, options?: ratioTheoremOptions): Vector {
    const defaultOptions = { extendedMode: false };
    const optionsObject = { ...defaultOptions, ...options };
    if (optionsObject.extendedMode) {
      const one_over_lambda = new Fraction(1, lambda);
      const vector = b
        .multiply(lambda + mu)
        .minus(a.multiply(mu))
        .multiply(one_over_lambda);
      return vector;
    } else {
      const one_over_lambda_plus_mu = new Fraction(1, lambda + mu);
      const vector = b.multiply(lambda).plus(a.multiply(mu)).multiply(one_over_lambda_plus_mu);
      return vector;
    }
  }

  ////
  // static properties
  ////

  /**
   * the zero vector
   */
  static ZERO = new Vector(0, 0, 0);
  /**
   * the x-axis unit vector (1,0,0)
   */
  static I = new Vector(1, 0, 0);
  /**
  /**
   * the y-axis unit vector (0,1,0)
   */
  static J = new Vector(0, 1, 0);
  /**
  /**
   * the z-axis unit vector (0,0,1)
   */
  static K = new Vector(0, 0, 1);
}

interface vectorOptions {
  k?: number | Fraction;
  simplify?: boolean;
  stretchable?: boolean;
}
interface scalarMultiplicationOptions {
  changeK?: boolean;
}
interface vectorToStringOptions {
  ijkMode?: boolean;
  multiplyKIn?: boolean;
}
interface ratioTheoremOptions {
  extendedMode?: boolean;
}
