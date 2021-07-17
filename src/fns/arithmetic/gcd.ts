/**
 * Finds greatest common divisor of two **integers**
 * of which at least one is non-zero
 */
export default function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a === 0 && b === 0) {
    throw 'gcd(0,0) not defined';
  }
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw 'gcd not defined for non-integers';
  }
  if (a === 0 || b === 0) {
    // at least one non-zero due to earlier check
    return Math.max(a, b);
  }
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
