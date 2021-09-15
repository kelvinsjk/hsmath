import { maclaurin, Fraction } from '../../index';

test('maclaurin', () => {
  expect(`${maclaurin.binomial(2, 3)}`).toBe('1 + 3 x + 3 x^2');
  expect(`${maclaurin.binomial(2, new Fraction(-1, 2))}`).toBe('1 - \\frac{1}{2} x + \\frac{3}{8} x^2');
  expect(`${maclaurin.exp(3)}`).toBe('1 + x + \\frac{1}{2} x^2 + \\frac{1}{6} x^3');
  expect(`${maclaurin.sin(3, { a: 2 })}`).toBe('2 x - \\frac{4}{3} x^3');
  expect(`${maclaurin.cos(3, { variableAtom: '\\theta' })}`).toBe('1 - \\frac{1}{2} \\theta^2');
  expect(`${maclaurin.ln(3, { a: new Fraction(1, 2) })}`).toBe('\\frac{1}{2} x - \\frac{1}{8} x^2 + \\frac{1}{24} x^3');

  expect(() => maclaurin.binomial(2.1, 1)).toThrow();
  expect(() => maclaurin.exp(2.1)).toThrow();
  expect(() => maclaurin.sin(2.1)).toThrow();
  expect(() => maclaurin.cos(2.1)).toThrow();
  expect(() => maclaurin.ln(2.1)).toThrow();
});
