import { PowerFn, PolynomialFn, differentiate } from '../../index';

const x = new PowerFn();
const x2Minus3 = new PolynomialFn([1, 0, -3]);

test('differentiate', () => {
  expect(`${differentiate.productRule(x, x2Minus3, 1)}`).toBe('0');
  expect(`${differentiate.quotientRule(x2Minus3, x, 2)}`).toBe('\\frac{7}{4}');
});
