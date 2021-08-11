import Vector from './vectorClass';
import Line from './lineClass';
import Fraction from '../fractionClass';
import Term from '../expressions/termClass';
import Expression from '../expressions/expressionClass';
import { SquareRoot } from '../rootClasses';
import convertNumberToFraction from '../../internal/convertNumberToFraction';

/**
 * Plane class representing a plane, r dot n = d
 * 
 * @param n normal vector of the plane (will be simplified)
 * @param options defaults to `{mode: 'd', d: 0, point: (0,0,0), v2: Vector}`
 * 
 * @mode 'd': supplies the scalar d
 * 'pt': derives d from the point on the plane
 * '2d': uses n as a direction vector, and derives the plane using point, and v2 (a second direction vector)
 * '2pt': uses n as a direction vector, and derives the plane using point, and v2 (a second point)
 * '3pt': uses n as a point on the plane, and derives the plane using point, and v2 (a second direction vector)
 */
export default class Plane {
  n: Vector
  d: Fraction
  /**
   * plane class constructor
   * 
   * @param n normal vector of the plane (for modes that are not 'd' or 'pt', will be simplified)
   * @param options defaults to `{mode: 'd', d: 0, point: (0,0,0), v2: Vector}`
   *
   * @mode 'd': supplies the scalar d
   * 'pt': derives d from the point on the plane
   * '2d': uses n as a direction vector, and derives the plane using point, and v2 (a second direction vector)
   * '2pt': uses n as a direction vector, and derives the plane using point, and v2 (a second point)
   * '3pt': uses n as a point on the plane, and derives the plane using point, and v2 (a second direction vector)
   */
  constructor(n: Vector, options?: planeOptions) {
    const defaultOptions = { mode: 'd', d: 0, point: Vector.ZERO, v2: undefined };
    const optionsObject = { ...defaultOptions, ...options };
    const mode = optionsObject.mode;
    if (mode !== '3pt' && n.isZero()) {
      throw new Error('plane ERROR: normal/direction vector not allowed to be 0');
    }
    if (mode === 'd') { // rhs supplied
      const d = convertNumberToFraction(optionsObject.d);
      this.n = n;
      this.d = d;
    } else if (mode === 'pt') { // point given
      this.n = n.clone();
      this.d = n.dot(optionsObject.point);
    } else if (mode === '2d') { // 2 direction vectors
      if (optionsObject.v2 === undefined) {
        throw new Error('plane ERROR: for mode "2d": a direction vector must be supplied as v2 in the options object')
      } else {
        const normal = n.cross(optionsObject.v2);
        if (normal.isZero()) {
          throw new Error('plane ERROR: normal vector not allowed to be 0: check supplied direction vectors');
        } else {
          normal.simplify(true);
          this.n = normal;
          this.d = normal.dot(optionsObject.point);
        }
      }
    } else if (mode === '2pt') { // 2 points given 
      if (optionsObject.v2 === undefined) {
        throw new Error('plane ERROR: for mode "2pt": a point must be supplied as v2 in the options object')
      } else {
        const d2 = optionsObject.v2.minus(optionsObject.point);
        const normal = d2.cross(n);
        if (normal.isZero()) {
          throw new Error('plane ERROR: normal vector not allowed to be 0: check supplied direction vector and points');
        } else {
          normal.simplify(true);
          this.n = normal;
          this.d = normal.dot(optionsObject.point);
        }
      }
    } else { // mode === '3pt'
      if (optionsObject.v2 === undefined) {
        throw new Error('plane ERROR: for mode "3pt": a point must be supplied as v2 in the options object')
      } else {
        const d1 = optionsObject.point.minus(n);
        const d2 = optionsObject.v2.minus(optionsObject.point);
        const normal = d2.cross(d1);
        if (normal.isZero()) {
          throw new Error('plane ERROR: normal vector not allowed to be 0: check supplied direction vector and points');
        } else {
          normal.simplify(true);
          this.n = normal;
          this.d = normal.dot(optionsObject.point);
        }
      }
    }

  }

  /**
   * check if plane contains given point
   */
  contains(point: Vector): boolean {
    return this.n.dot(point).isEqual(this.d);
  }

  // TODO: intersection
  // TODO: foot of perpendicular

  /**
   * checks if plane is parallel to line/vector/plane
   */
  isParallelTo(item: Line | Vector | Plane): boolean {
    if (item instanceof Vector) {
      return this.n.dot(item).isEqual(0);
    } else if (item instanceof Line) {
      return this.n.dot(item.d).isEqual(0);
    } else { // item instanceof Plane
      return this.n.isParallelTo(item.n);
    }
  }

  /**
   * @returns a point on the plane
   * 
   * will try to be of the form (x, 0, 0) if allowed, otherwise (0, y, 0) or (0, 0, z)
   */
  point(): Vector {
    if (this.d.isEqual(0)) {
      return Vector.ZERO;
    } else {
      if (!this.n.x.isEqual(0)) {
        return new Vector(this.d.divide(this.n.x), 0, 0);
      } else if (!this.n.y.isEqual(0)) {
        return new Vector(0, this.d.divide(this.n.y), 0);
      } else { // z coordinate will be non-zero by construction
        return new Vector(0, 0, this.d.divide(this.n.z));
      }
    }
  }

  /**
   * @returns angle between this plane and given vector/line/plane
   * 
   * WARNING: for skew lines, angle between direction vectors will be returned but should not be used
   */
  angle(item: Vector | Line | Plane): string {
    if (item instanceof Plane) {
      const nNegative = this.n.dot(item.n).valueOf() < 0 ? item.n.negative() : item.n;
      return this.n.angle(nNegative);
    } else { //if (item instanceof Line || item instanceof Vector) {
      const vector = item instanceof Vector ? item : item.d;
      return vector.angle(this.n, true);      
    }
  }

  /**
   * finds distance between this plane and given item (point, line or plane)
   */
  distanceTo(item: Vector | Line | Plane): SquareRoot { // TODO: plane
    let point: Vector;
    if (item instanceof Vector) {
      point = item;
    } else { // line or plane
      if (!this.isParallelTo(item)) {
        return new SquareRoot(0);
      }
      point = item instanceof Line ? item.a : item.point();
    }
    const ab = this.point().minus(point);
    const dotProduct = ab.dot(this.n);
    const modNSquared = this.n.dot(this.n);
    return this.n.magnitude().times(Fraction.abs(dotProduct).divide(modNSquared));
  }

  /**
   * toString method
   * 
   * @param options default `{cartesianMode: false, ijkMode: false}`
   * 
   * defaults to scalar product form (cartesianMode: false)
   */
  toString(options?: planeToStringOptions): string {
    const defaultOptions = {
      cartesianMode: false,
      ijkMode: false
    }
    const optionsObject = { ...defaultOptions, ...options };
    let normal = this.n.multiplyKIn();
    const [[a, b, c, d]] = Fraction.factorize(normal.x, normal.y, normal.z, this.d);
    if (optionsObject.cartesianMode) { // cartesian mode
      const xTerm = new Term(a, 'x'), yTerm = new Term(b, 'y'), zTerm = new Term(c, 'z');
      const xyz = new Expression(xTerm, yTerm, zTerm);
      return `${xyz} = ${d}`;
    } else { // default scalar product mode
      normal = new Vector(a, b, c);
      return optionsObject.ijkMode ?
        `\\mathbf{r} \\cdot \\left( ${normal.toString({ ijkMode: optionsObject.ijkMode })} \\right) = ${d}`
        : `\\mathbf{r} \\cdot ${normal} = ${d}`;
    }
  }

  ////
  // static properties
  ////

  /**
   * the x-y plane
   */
  static XY = new Plane(Vector.K);
  /**
  /**
   * the x-y plane
   */
  static XZ = new Plane(Vector.J);
  /**
  /**
   * the x-y plane
   */
  static YZ = new Plane(Vector.I);

}

/**
 * options for creating new line instance
 * `twoPointsMode`: if true, will treat the two parameters as two points on the line
 */
interface planeOptions {
  mode?: string,
  d?: number | Fraction,
  point?: Vector,
  v2?: Vector
}
/**
 * options for line toString method
 * 
 * @lambda symbol for "lambda" 
 * @ijkMode if true, vectors in ijk components (vs column vectors if false)
 *
 * @mode 'vector': r = a + lambda d
 * @mode 'combined': a + lambda d together in one column vector
 * @mode 'cartesian'
 */
interface planeToStringOptions {
  cartesianMode?: boolean,
  ijkMode?: boolean
}