import gcd from './gcd';

/**
 * given a set of integers (a, b, c, ..., n)
 * @returns an array `[ [A, B, C, ..., N], k ]`,
 * where k(A, B, C, ..., N) = (a, b, c, ..., n)
 */
export default function factorize(...integers: number[]): [number[], number] {
  let divisor = gcd(...integers);
  let simplifiedArray = integers.map((integer) => integer / divisor);
  if (simplifiedArray.reduce((acc, current) => acc && current <= 0, true)) {
    simplifiedArray = simplifiedArray.map((integer) => integer * -1);
    divisor = divisor * -1;
  }
  return [simplifiedArray, divisor];
}
