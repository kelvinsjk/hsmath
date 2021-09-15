import PolynomialFn from '../polynomialFnClass';
import convertNumberToFraction from '../../../internal/convertNumberToFraction';
import Fraction from '../../fractionClass';

/**
 * maclaurin series for (1+x)^n up to and including the term in x^r
 *
 * @param r expansion up to and including the term in x^r
 * @param options defaults to `{ a: 1, variableAtom: 'x' }` where a represents replacing x with ax
 */
function binomial(r: number, n: number | Fraction, options?: MaclaurinOptions): PolynomialFn {
  n = convertNumberToFraction(n);
  const defaultOptions = { a: 1, variableAtom: 'x' };
  const { a: aNumOrFrac, variableAtom } = { ...defaultOptions, ...options };
  const a = convertNumberToFraction(aNumOrFrac);
  const coeffArray: (number | Fraction)[] = [1];
  if (!(Number.isInteger(r) && r >= 0)) {
    throw new RangeError('r must be a non-negative integer');
  }
  for (let i = 1; i < r + 1; i++) {
    const coeff = fallingFactorial(n, i).divide(factorial(i)).times(a.pow(i));
    coeffArray.push(coeff);
  }
  return new PolynomialFn(coeffArray, { variableAtom, ascending: true });
}

/**
 * maclaurin series for e^x up to and including the term in x^r
 *
 * @param r expansion up to and including the term in x^r
 * @param options defaults to `{ a: 1, variableAtom: 'x' }` where a represents replacing x with ax
 */
function exp(r: number, options?: MaclaurinOptions): PolynomialFn {
  const defaultOptions = { a: 1, variableAtom: 'x' };
  const { a: aNumOrFrac, variableAtom } = { ...defaultOptions, ...options };
  const a = convertNumberToFraction(aNumOrFrac);
  const coeffArray: (number | Fraction)[] = [1];
  if (!(Number.isInteger(r) && r >= 0)) {
    throw new RangeError('r must be a non-negative integer');
  }
  for (let i = 1; i < r + 1; i++) {
    const coeff = Fraction.ONE.divide(factorial(i)).times(a.pow(i));
    coeffArray.push(coeff);
  }
  return new PolynomialFn(coeffArray, { variableAtom, ascending: true });
}

/**
 * maclaurin series for sin x up to and including the term in x^r
 *
 * @param r expansion up to and including the term in x^r
 * @param options defaults to `{ a: 1, variableAtom: 'x' }` where a represents replacing x with ax
 */
function sin(r: number, options?: MaclaurinOptions): PolynomialFn {
  const defaultOptions = { a: 1, variableAtom: 'x' };
  const { a: aNumOrFrac, variableAtom } = { ...defaultOptions, ...options };
  const a = convertNumberToFraction(aNumOrFrac);
  const coeffArray: (number | Fraction)[] = [];
  if (!(Number.isInteger(r) && r >= 0)) {
    throw new RangeError('r must be a non-negative integer');
  }
  for (let i = 0; i <= r; i++) {
    if (i % 2 === 1) {
      const j = (i - 1) / 2;
      const coeff = new Fraction(-1)
        .pow(j)
        .divide(factorial(2 * j + 1))
        .times(a.pow(2 * j + 1));
      coeffArray.push(coeff);
    } else {
      coeffArray.push(0);
    }
  }
  return new PolynomialFn(coeffArray, { variableAtom, ascending: true });
}

/**
 * maclaurin series for cos x up to and including the term in x^r
 *
 * @param r expansion up to and including the term in x^r
 * @param options defaults to `{ a: 1, variableAtom: 'x' }` where a represents replacing x with ax
 */
function cos(r: number, options?: MaclaurinOptions): PolynomialFn {
  const defaultOptions = { a: 1, variableAtom: 'x' };
  const { a: aNumOrFrac, variableAtom } = { ...defaultOptions, ...options };
  const a = convertNumberToFraction(aNumOrFrac);
  const coeffArray: (number | Fraction)[] = [];
  if (!(Number.isInteger(r) && r >= 0)) {
    throw new RangeError('r must be a non-negative integer');
  }
  for (let i = 0; i <= r; i++) {
    if (i % 2 === 0) {
      const j = i / 2;
      const coeff = new Fraction(-1)
        .pow(j)
        .divide(factorial(2 * j))
        .times(a.pow(2 * j));
      coeffArray.push(coeff);
    } else {
      coeffArray.push(0);
    }
  }
  return new PolynomialFn(coeffArray, { variableAtom, ascending: true });
}

/**
 * maclaurin series for ln(1+x) up to and including the term in x^r
 *
 * @param r expansion up to and including the term in x^r
 * @param options defaults to `{ a: 1, variableAtom: 'x' }` where a represents replacing x with ax
 */
function ln(r: number, options?: MaclaurinOptions): PolynomialFn {
  const defaultOptions = { a: 1, variableAtom: 'x' };
  const { a: aNumOrFrac, variableAtom } = { ...defaultOptions, ...options };
  const a = convertNumberToFraction(aNumOrFrac);
  const coeffArray: (number | Fraction)[] = [0];
  if (!(Number.isInteger(r) && r >= 0)) {
    throw new RangeError('r must be a non-negative integer');
  }
  for (let i = 1; i <= r; i++) {
    const coeff = new Fraction(-1)
      .pow(i + 1)
      .divide(i)
      .times(a.pow(i));
    coeffArray.push(coeff);
  }
  return new PolynomialFn(coeffArray, { variableAtom, ascending: true });
}

interface MaclaurinOptions {
  a?: number | Fraction;
  variableAtom?: string;
}

/**
 * @returns $n!$
 */
function factorial(n: number): number {
  let x = 1;
  for (let i = 1; i < n + 1; i++) {
    x = x * i;
  }
  return x;
}

/**
 * @returns n (n-1) ... (n-r+1)
 */
function fallingFactorial(n: Fraction, r: number): Fraction {
  let x = Fraction.ONE;
  for (let i = 0; i < r; i++) {
    x = x.times(n.minus(i));
  }
  return x;
}

/**
 * maclaurin standard series for (1+x)^n, sin x, cos x, e^x and ln(1+x)
 */
const maclaurin = { binomial, sin, cos, exp, ln };
export default maclaurin;
