import Vector from './vectorClass';
import Fraction from '../fractionClass';
import Polynomial from '../algebra/polynomialClass';
import type { SquareRoot } from '../rootClasses';

/**
 * Line class representing a line, r = a + lambda d
 * @a position vector of a point on the line
 * @d direction vector of a the line (will be simplified)
 */
export default class Line {
  a: Vector;
  d: Vector;
  /**
   * Line class constructor
   *
   * @param a position vector of a point on the line
   * @param d direction vector of the line (cannot be zero)
   *
   * @param options default `{twoPointsMode: false}`. if true, will treat d as another point on the line
   */
  constructor(a: Vector, d: Vector, options?: lineOptions) {
    const defaultOptions = { twoPointsMode: false };
    const optionsObject = { ...defaultOptions, ...options };
    d = optionsObject.twoPointsMode ? a.minus(d) : d.clone();
    d.simplify(true);
    if (d.isZero()) {
      throw new Error('line ERROR: direction vector cannot be zero');
    }
    this.a = a.multiplyKIn();
    this.d = d.multiplyKIn();
  }

  // TODO: contains
  // TODO: intersection + check skew
  // TODO: foot of perpendicular

  /**
   * checks if line is parallel to line/vector
   */
  isParallelTo(l: Line | Vector): boolean {
    const d2 = l instanceof Line ? l.d : l;
    return this.d.isParallelTo(d2);
  }

  /**
   * sub in lambda, and return position vector of the resulting point on the line
   */
  point(lambda: number | Fraction): Vector {
    if (typeof lambda === 'number') {
      lambda = new Fraction(lambda, 1);
    }
    const coord1 = this.a.x.times(this.a.k).plus(this.d.x.times(lambda).times(this.d.k));
    const coord2 = this.a.y.times(this.a.k).plus(this.d.y.times(lambda).times(this.d.k));
    const coord3 = this.a.z.times(this.a.k).plus(this.d.z.times(lambda).times(this.d.k));
    return new Vector(coord1, coord2, coord3);
  }
  /**
   * @returns angle between this line and given vector/line
   *
   * WARNING: for skew lines, angle between direction vectors will be returned but should not be used
   */
  angle(item: Vector | Line): string {
    // TODO: Plane
    let vector: Vector; //planeMode = false;
    if (item instanceof Vector) {
      vector = item;
    } else {
      //if (item instanceof Line) {
      vector = item.d;
      if (vector.dot(this.d).valueOf() < 0) {
        // returns acute angle for line and line
        vector = vector.negative();
      }
    }
    //else if (item instanceof Plane) {
    //  vector = item.n;
    //  planeMode = true;
    //}
    return vector.angle(this.d);
  }
  /**
   * finds distance between this line and given item (point, line or TODO: plane)
   */
  distanceTo(item: Vector | Line): SquareRoot {
    // TODO: plane
    if (item instanceof Line) {
      if (this.isParallelTo(item)) {
        item = item.a;
      } else {
        throw new Error('line ERROR: distances between non-parallel line not currently supported');
      }
    }
    const ab = item.minus(this.a);
    return ab.cross(this.d).magnitude().divide(this.d.magnitude());
  }

  /**
   * toString method
   *
   * @param options default `{lambda: '\\lambda', mode: 'vector', ijkMode: false}`
   *
   * mode: 'vector': r = a + lambda d
   * mode: 'combined': a + lambda d together in one column vector
   * mode: 'cartesian'
   */
  toString(options?: lineToStringOptions): string {
    const defaultOptions = {
      lambda: '\\lambda',
      ijkMode: false,
      mode: 'vector',
    };
    const optionsObject = { ...defaultOptions, ...options };
    if (optionsObject.mode === 'vector') {
      // default vector mode
      return optionsObject.ijkMode
        ? `\\mathbf{r} = \\left( ${this.a.toString({ ijkMode: optionsObject.ijkMode, multiplyKIn: true })} \\right) + ${
            optionsObject.lambda
          } \\left( ${this.d.toString({ ijkMode: optionsObject.ijkMode, multiplyKIn: true })} \\right)`
        : `\\mathbf{r} = ${this.a.toString({ ijkMode: optionsObject.ijkMode, multiplyKIn: true })} + ${
            optionsObject.lambda
          } ${this.d.toString({ ijkMode: optionsObject.ijkMode, multiplyKIn: true })}`;
    } else if (optionsObject.mode == 'combined') {
      // combine into one column vector
      const a = this.a;
      const d = this.d;
      const xComponent = new Polynomial([a.x, d.x], { ascending: true, variableAtom: '\\lambda' });
      const yComponent = new Polynomial([a.y, d.y], { ascending: true, variableAtom: '\\lambda' });
      const zComponent = new Polynomial([a.z, d.z], { ascending: true, variableAtom: '\\lambda' });

      return `\\begin{pmatrix} ${xComponent} \\\\ ${yComponent} \\\\ ${zComponent} \\end{pmatrix}`;
    } else {
      // cartesian
      if (this.d.x.isEqual(0)) {
        if (this.d.y.isEqual(0)) {
          // x,y 0: z must be non-zero
          return `x = ${this.a.x}, y = ${this.a.y}, z \\in \\mathbb{R}`;
        } else {
          // x 0, y non-zero
          if (this.d.z.isEqual(0)) {
            return `x = ${this.a.x}, z = ${this.a.z}, y \\in \\mathbb{R}`;
          } else {
            // x 0
            const yPoly = new Polynomial([1, this.a.y.negative()], { variableAtom: 'y' });
            const yFrac = this.d.y.isEqual(1) ? `${yPoly}` : `\\frac{ ${yPoly} }{ ${this.d.y} }`;
            const zPoly = new Polynomial([1, this.a.z.negative()], { variableAtom: 'z' });
            const zFrac = this.d.z.isEqual(1) ? `${zPoly}` : `\\frac{ ${zPoly} }{ ${this.d.z} }`;
            return `${yFrac} = ${zFrac}, x = ${this.a.x}`;
          }
        }
      } else {
        // x non-zero
        if (this.d.y.isEqual(0)) {
          // x non-zero, y=0
          if (this.d.z.isEqual(0)) {
            // x non-zero, y=z=0
            return `y = ${this.a.y}, z = ${this.a.z}, x \\in \\mathbb{R}`;
          } else {
            // x non-zero, y=0, z non-zero
            const xPoly = new Polynomial([1, this.a.x.negative()], { variableAtom: 'x' });
            const xFrac = this.d.x.isEqual(1) ? `${xPoly}` : `\\frac{ ${xPoly} }{ ${this.d.x} }`;
            const zPoly = new Polynomial([1, this.a.z.negative()], { variableAtom: 'z' });
            const zFrac = this.d.z.isEqual(1) ? `${zPoly}` : `\\frac{ ${zPoly} }{ ${this.d.z} }`;
            return `${xFrac} = ${zFrac}, y = ${this.a.y}`;
          }
        } else {
          // x, y non-zero
          if (this.d.z.isEqual(0)) {
            const xPoly = new Polynomial([1, this.a.x.negative()], { variableAtom: 'x' });
            const xFrac = this.d.x.isEqual(1) ? `${xPoly}` : `\\frac{ ${xPoly} }{ ${this.d.x} }`;
            const yPoly = new Polynomial([1, this.a.y.negative()], { variableAtom: 'y' });
            const yFrac = this.d.y.isEqual(1) ? `${yPoly}` : `\\frac{ ${yPoly} }{ ${this.d.y} }`;
            return `${xFrac} = ${yFrac}, z = ${this.a.z}`;
          } else {
            // all non-zero
            const xPoly = new Polynomial([1, this.a.x.negative()], { variableAtom: 'x' });
            const xFrac = this.d.x.isEqual(1) ? `${xPoly}` : `\\frac{ ${xPoly} }{ ${this.d.x} }`;
            const yPoly = new Polynomial([1, this.a.y.negative()], { variableAtom: 'y' });
            const yFrac = this.d.y.isEqual(1) ? `${yPoly}` : `\\frac{ ${yPoly} }{ ${this.d.y} }`;
            const zPoly = new Polynomial([1, this.a.z.negative()], { variableAtom: 'z' });
            const zFrac = this.d.z.isEqual(1) ? `${zPoly}` : `\\frac{ ${zPoly} }{ ${this.d.z} }`;
            return `${xFrac} = ${yFrac} = ${zFrac}`;
          }
        }
      }
    }
  }

  ////
  // static properties
  ////

  /**
   * the x-axis as a line
   */
  static X = new Line(Vector.ZERO, Vector.I);
  /**
   * the x-axis as a line
   */
  static Y = new Line(Vector.ZERO, Vector.J);
  /**
   * the x-axis as a line
   */
  static Z = new Line(Vector.ZERO, Vector.K);
}

/**
 * options for creating new line instance
 * `twoPointsMode`: if true, will treat the two parameters as two points on the line
 */
interface lineOptions {
  twoPointsMode?: boolean;
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
interface lineToStringOptions {
  lambda?: string;
  ijkMode?: boolean;
  mode?: string;
}
