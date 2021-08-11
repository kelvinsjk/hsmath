import Fraction from '../../classes/fractionClass';

/**
 * solves a quadratic equation
 * 
 * @returns `[root1, root2]`, where root1 < root2
 */
export default function solveQuadratic(a: number | Fraction, b: number | Fraction, c: number | Fraction): [number, number]{
  a = typeof a === 'number' ? a : a.valueOf();
  b = typeof b === 'number' ? b : b.valueOf();
  c = typeof c === 'number' ? c : c.valueOf();
  
  const discriminant = b * b - 4 * a * c;
  if (a === 0) {
    throw new Error('a must be non-zero');
  }
  if (discriminant < 0) {
    throw new Error('solveQuadratic ERROR: we do not currently support complex roots');
  }

  const root1 = (-b - Math.sqrt(discriminant)) / 2 / a;
  const root2 = (-b + Math.sqrt(discriminant)) / 2 / a;

  return root1 < root2 ? [root1, root2] : [root2, root1];
}