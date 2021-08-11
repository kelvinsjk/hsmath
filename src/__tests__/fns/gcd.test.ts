import { gcd, factorize } from '../../index';

test('gcd', () => {
  expect(() => {
    gcd(0, 0);
  }).toThrow();
  expect(() => {
    gcd();
  }).toThrow();
  expect(() => {
    gcd(5, 1.2);
  }).toThrow();
  expect(gcd(0, 5)).toBe(5);
  expect(gcd(-1, 0)).toBe(1);
  expect(gcd(2, 3)).toBe(1);
  expect(gcd(20, 65)).toBe(5);
  expect(gcd(20, -65)).toBe(5);
  expect(gcd(-20, 65)).toBe(5);
  expect(gcd(-20, -65)).toBe(5);
  expect(gcd(-20)).toBe(20);
  expect(gcd(6, 10, 28)).toBe(2);
});

const [[a, b, c], d] = factorize(2, 4, -6);
const [[e, f, g], h] = factorize(-2, -4, -6);
test('factorize', () => {
  expect(a).toBe(1);
  expect(b).toBe(2);
  expect(c).toBe(-3);
  expect(d).toBe(2);
  expect(e).toBe(1);
  expect(f).toBe(2);
  expect(g).toBe(3);
  expect(h).toBe(-2);
});
