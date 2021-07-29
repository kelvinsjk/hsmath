import gcd from './gcd';

  /**
   * given a set of integers (a, b, c, ..., n)
   * @returns an array `[ k, [A, B, C, ..., N] ]`,
   * where k(A, B, C, ..., N) = (a, b, c, ..., n)
   */
  export default function factorize(...integers: (number)[]): [number, number[]]{
  const divisor = gcd(...integers);
  const simplifiedArray = integers.map(integer => {
    return integer / divisor;
  })
  return [divisor, simplifiedArray];
}