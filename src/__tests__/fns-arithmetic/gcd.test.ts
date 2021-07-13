import { gcd } from '../../index';

test('gcd', () => {
  expect(() => { gcd(0, 0) }).toThrow();
  expect(() => { gcd(5, 1.2) }).toThrow();
  expect(gcd(0, 5)).toBe(5);
  expect(gcd(-1, 0)).toBe(1);
  expect(gcd(2, 3)).toBe(1);
  expect(gcd(20, 65)).toBe(5);
  expect(gcd(20, -65)).toBe(5);
  expect(gcd(-20, 65)).toBe(5);
  expect(gcd(-20, -65)).toBe(5);  
})