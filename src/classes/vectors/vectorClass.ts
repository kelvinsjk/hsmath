import Fraction from '../fractionClass';
import Term from '../termClass';
import Expression from '../expressionClass';
import {SquareRoot} from '../rootClasses';
import convertNumberToFraction from '../../internal/convertNumberToFraction';

/**
 * Vector class representing a 3d vector k(a,b,c)
 */
export default class Vector { // vector of the form k(a,b,c). 
  a: Fraction;
  b: Fraction;
  c: Fraction;
  k: Fraction;
  /**
   * Vector class constructor for the vector represented by k(a,b,c).
   * 
   * If `simplify` in the options is set to `true`, then we will factorize our expression such that a,b,c are integers with gcd=1.
   * 
   * If `stretchable` in the options is set to `true`, then we will simplify plus set k to be 1.
   * 
   * `new Vector(a: number | Fraction, b, c=0, {k: 1, simplify: false, stretchable: false})`
   */
  constructor(a: number | Fraction, b: number | Fraction, c?: number | Fraction, options?: vectorOptions) {
    // options
    const defaultOptions = {
      k: Fraction.ONE,
      simplify: false,
      stretchable: false
    }
    const optionsObject = { ...defaultOptions, ...options };
    // initialize default variables
    a = convertNumberToFraction(a);
    b = convertNumberToFraction(b);
    c = c === undefined ? Fraction.ZERO : convertNumberToFraction(c);
    this.a = a;
    this.b = b;
    this.c = c;
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
    const [divisor, [a, b, c]] = Fraction.factorize(this.a, this.b, this.c);
    this.a = a; this.b = b; this.c = c;
    this.k = stretchable ? Fraction.ONE : divisor.times(this.k);
  }
  /**
   * multiply k into the vector, taking this: k(a,b,c) and 
   * @returns (ka, kb, kc)
   */
  multiplyKIn(): Vector{
    return new Vector(this.a.times(this.k), this.b.times(this.k), this.c.times(this.k));
  }
  /**
   * vector addition
   * 
   * if `k` is the same for both vectors, we will do component wise addition, leaving the same `k`
   * 
   * if `k`s is different, then we will expand in both `k`s such that the sum has `k=1`
   */
  plus(v2: Vector): Vector {
    if (this.k.isEqual(v2.k)){
      return new Vector(this.a.plus(v2.a), this.b.plus(v2.b), this.c.plus(v2.c), { k: this.k.clone() });
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
    const v3 = new Vector(v2.a.times(-1), v2.b.times(-1), v2.c.times(-1), { k: v2.k.clone() });
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
    return optionsObject.changeK ? new Vector(this.a, this.b, this.c, { k: this.k.times(k) }) : new Vector(this.a.times(k), this.b.times(k), this.c.times(k), {k: this.k});
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
    return optionsObject.changeK ? new Vector(this.a, this.b, this.c, { k: this.k.times(-1) }) : new Vector(this.a.times(-1), this.b.times(-1), this.c.times(-1), {k: this.k});
  }
  /**
   * scalar (dot) product
   * 
   * if @param v2 is left empty, then we will return the dot product of this by itself
   */
  dot(v2?: Vector): Fraction { // dot product
    if (v2 === undefined) {
      v2 = this.clone();
    }
    return this.k.times(v2.k).times( this.a.times(v2.a).plus(this.b.times(v2.b)).plus(this.c.times(v2.c)) );
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
    const newB = this.c.times(v2.a).minus((this.a.times(v2.c)));
    const newA = this.b.times(v2.c).minus((this.c.times(v2.b)));
    const newC = this.a.times(v2.b).minus((this.b.times(v2.a)));
    return new Vector(newA, newB, newC, { k: newK });
  }
  /**
   * check if two vectors are parallel
   */
  isParallel(v2: Vector): boolean {
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
    return dotProduct.isEqual(0)
  }
  /**
   * returns latex string representing the vector
   * 
   * @param options default: `{ijkMode: false, multiplyKIn: false}`
   * ijkMode returns the vector in ijk notation (vs the default column vector notation)
   * multiplyKIn multiplies `k` into the vector
   */
  toString(options?: toStringOptions): string { // return latex string: column vector mode or ijk mode
    const defaultOptions = {
      ijkMode: false,
      multiplyKIn: false
    };
    const optionsObject = { ...defaultOptions, ...options };
    const vector = optionsObject.multiplyKIn ? this.multiplyKIn() : this;
    if (optionsObject.ijkMode) {
      const iTerm = new Term(vector.a, '\\mathbf{i}');
      const jTerm = new Term(vector.b, '\\mathbf{j}');
      const kTerm = new Term(vector.c, '\\mathbf{k}');
      const ijkExpression = new Expression(iTerm, jTerm, kTerm);
      const expressionWithK = new Term(vector.k, ijkExpression.toString());
      return expressionWithK.toString({brackets: true})
    } else { // column vector
      const vectorTerm = new Term(vector.k, `\\begin{pmatrix} ${vector.a} \\\\ ${vector.b} \\\\ ${vector.c} \\end{pmatrix}`);
      return vectorTerm.toString();
    }
  }
  /**
   * @returns (ka, kb, kc) as a coordinate triple. Can Add the name of the point in front of the definition
   */
  toCoordinates(name?: string): string {
    const vector = this.multiplyKIn();
    const coordinates = `\\left( ${vector.a} , ${vector.b} , ${vector.c} \\right)`
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
    return (this.minus(v2).magnitude().valueOf() === 0);
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
   */
  angle(v2: Vector): string {
    if (this.isZero() || v2.isZero()) {
      throw new Error('Vector ERROR: angle is not defined for zero vectors');
    }
    const cosThetaSquared = this.dot(v2).square().divide(this.dot().times(v2.dot()));
    if (cosThetaSquared.isEqual(0)) {
      return '90^{\\circ}';
    } else if (cosThetaSquared.isEqual(new Fraction(1, 4))) {
      return this.dot(v2).valueOf() < 0 ? '120^{\\circ}' : '60^{\\circ}';
    } else if (cosThetaSquared.isEqual(new Fraction(1, 2))) {
      return this.dot(v2).valueOf() < 0 ? '135^{\\circ}' : '45^{\\circ}';
    } else if (cosThetaSquared.isEqual(new Fraction(3, 4))) {
      return this.dot(v2).valueOf() < 0 ? '150^{\\circ}' : '30^{\\circ}';
    } else if (cosThetaSquared.isEqual(1)) {
      return this.dot(v2).valueOf() < 0 ? '180^{\\circ}' : '0^{\\circ}';
    } else {
      const angle = Math.acos(Math.sign(this.dot(v2).valueOf()) * Math.pow(cosThetaSquared.valueOf(), 1 / 2)) / Math.PI * 180;
      return angle.toFixed(1) + '^{\\circ}';      
    }
  }

  /**
   * clones a new instance of this vector
   */
  clone(): Vector{
    return new Vector(this.a.clone(), this.b.clone(), this.c.clone(), {k: this.k.clone()})
  }
}

interface vectorOptions {
  k?: number | Fraction,
  simplify?: boolean,
  stretchable?: boolean
}
interface scalarMultiplicationOptions {
  changeK?: boolean
}
interface toStringOptions {
  ijkMode?: boolean,
  multiplyKIn?: boolean
}