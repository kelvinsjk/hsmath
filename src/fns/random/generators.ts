import Fraction from '../../classes/fractionClass';
import { Polynomial } from '../../classes/polynomialClasses';
import gcd from '../arithmetic/gcd';

/**
 * Generates a random integer between `min` and `max`
 *
 * @param options we can specify an array of numbers to avoid
 *
 * warning: we do not check if the avoid array prevents us from returning a value (leading to an infinite loop)
 */
function getRandomInt(min: number, max: number, options?: randomIntOptions): number {
  min = Math.ceil(min); // in case min is non-integer
  max = Math.floor(max); // in case max is non-integer
  let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  if (options !== undefined && options.avoid.length !== 0) {
    while (options.avoid.includes(randomInt)) {
      randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  return randomInt;
}

/**
 * Generates a random Fraction
 *
 * @param options of the form `{numMin: -9, numMax: 9, denMin, denMax, avoid: number|Fraction[]}`
 *
 */
function getRandomFrac(options?: randomFracOptions): Fraction {
  const defaultOptions = {
    numMin: -9,
    numMax: 9,
    denMin: -9,
    denMax: 9,
    avoid: [],
  };
  const optionsObject = { ...defaultOptions, ...options };
  let den = getRandomInt(optionsObject.denMin, optionsObject.denMax, { avoid: [0] });
  let num = getRandomInt(optionsObject.numMin, optionsObject.numMax);
  let randomFrac = new Fraction(num, den);
  let checkAvoid = optionsObject.avoid.length > 0; // if avoid is non-empty: have to check if generated fraction is inside
  while (checkAvoid) {
    for (let i = 0; i < optionsObject.avoid.length; i++) {
      const avoidFrac = optionsObject.avoid[i];
      if (randomFrac.isEqual(avoidFrac)) {
        den = getRandomInt(optionsObject.denMin, optionsObject.denMax, { avoid: [0] });
        num = getRandomInt(optionsObject.numMin, optionsObject.numMax);
        randomFrac = new Fraction(num, den);
        break;
      }
      if (i === optionsObject.avoid.length - 1) {
        checkAvoid = false;
      }
    }
  }
  return randomFrac;
}

/**
 * Generates a random linear factor ax + b
 *
 * @param options `{monic: boolean, aMin, aMax, bMin, bMax: integers, avoid: number|Fraction[]}`
 */
function getRandomLinear(options?: randomLinearOptions): Polynomial {
  const defaultOptions = {
    monic: false,
    aMin: -9,
    aMax: 9,
    bMin: -9,
    bMax: 9,
    avoid: [],
  };
  const optionsObject = { ...defaultOptions, ...options };
  const randomFracOptions = {
    numMin: optionsObject.bMax * -1,
    numMax: optionsObject.bMin * -1,
    denMin: optionsObject.aMin,
    denMax: optionsObject.aMax,
    avoid: optionsObject.avoid,
  };
  if (optionsObject.monic) {
    (randomFracOptions.denMin = 1), (randomFracOptions.denMax = 1);
  }
  return getRandomFrac(randomFracOptions).toFactor();
}

/**
 * Generates a random quadratic
 *
 * @param options of the form `{monic: false, aMin: -9, aMax: 9, etc, complex, irrational, rational, repeated, simplified: boolean }`
 */
function getRandomQuadratic(options?: randomQuadraticOptions): randomQuadraticOutput {
  const defaultOptions = {
    monic: false,
    aMin: -9,
    aMax: 9,
    bMin: -9,
    bMax: 9,
    cMin: -9,
    cMax: 9,
    /** allow complex roots */
    complex: true,
    /** allow irrational roots */
    irrational: true,
    /** allow rational roots */
    rational: true,
    /** allow repeated roots */
    repeated: true,
    /** whether gcd(a,b,c)==1 */
    simplified: true,
  };
  const optionsObject = { ...defaultOptions, ...options };
  if (optionsObject.monic) {
    optionsObject.aMin = 1;
    optionsObject.aMax = 1;
  }
  let a = getRandomInt(optionsObject.aMin, optionsObject.aMax, { avoid: [0] });
  let b = getRandomInt(optionsObject.aMin, optionsObject.aMax, { avoid: [0] });
  let c = getRandomInt(optionsObject.aMin, optionsObject.aMax, { avoid: [0] });
  let divisor = gcd(gcd(a, b), c);
  if (optionsObject.simplified) {
    a = a / divisor;
    b = b / divisor;
    c = c / divisor;
    divisor = 1;
  }
  // initialize output
  const output = {
    coefficients: [a, b, c] as [number, number, number],
    complex: false,
    irrational: false,
    rational: false,
    repeated: false,
    simplified: divisor === 1,
  };
  const discriminant = b * b - 4 * a * c;
  const squareRoot = Math.sqrt(discriminant);
  // TODO: update code to make use of SquareRoot class
  // determine type of roots
  if (discriminant < 0) {
    if (optionsObject.complex === false) {
      return getRandomQuadratic(options);
    }
    output.complex = true;
    const quadratic = new Polynomial([c, b, a]).reverse() as Polynomial;
    return { ...output, quadratic: quadratic };
  } else if (Number.isInteger(squareRoot)) {
    if (optionsObject.rational === false) {
      return getRandomQuadratic(options);
    }
    if (discriminant === 0) {
      if (optionsObject.repeated === false) {
        return getRandomQuadratic(options);
      }
      output.repeated = true;
    }
    output.rational = true;
  } else {
    if (optionsObject.irrational === false) {
      return getRandomQuadratic(options);
    }
    output.irrational = true;
  }
  const quadratic = new Polynomial([c, b, a]).reverse() as Polynomial;
  return { ...output, quadratic: quadratic };
}

/**
 * Options for generating random numbers
 */
interface randomIntOptions {
  /** will not return numbers in the `avoid` array */
  avoid: number[];
}

/**
 * Options for generating random numbers
 */
interface randomFracOptions {
  /** will not return numbers in the `avoid` array */
  numMin?: number;
  numMax?: number;
  denMin?: number;
  denMax?: number;
  avoid?: (number | Fraction)[];
}

/**
 * Options for generating random linear factors ax+b
 */
interface randomLinearOptions {
  /** whether a===1 */
  monic?: boolean;
  aMin?: number;
  aMax?: number;
  bMin?: number;
  bMax?: number;
  /** -b/a to not be in the avoid array */
  avoid?: (number | Fraction)[];
}

/**
 * Options for generating random quadratics ax^2 + bx + c
 */
interface randomQuadraticOptions {
  /** whether a===1 */
  monic?: boolean;
  aMin?: number;
  aMax?: number;
  bMin?: number;
  bMax?: number;
  cMin?: number;
  cMax?: number;
  /** complex roots */
  complex?: boolean;
  /** irrational roots */
  irrational?: boolean;
  /** rational roots */
  rational?: boolean;
  /** repeated roots */
  repeated?: boolean;
  /** whether gcd(a,b,c)==1 */
  simplified?: boolean;
}

/**
 * Output for `getRandomQuadratic`:
 */
interface randomQuadraticOutput {
  quadratic: Polynomial;
  coefficients: [number, number, number];
  roots?: [Fraction, Fraction]; // only rational outputs at the moment. TODO: surd and complex roots
  /** complex roots */
  complex: boolean;
  /** irrational roots */
  irrational: boolean;
  /** rational roots */
  rational: boolean;
  /** repeated roots */
  repeated: boolean;
  /** whether gcd(a,b,c)==1 */
  simplified: boolean;
}

export { getRandomInt, getRandomFrac, getRandomLinear, getRandomQuadratic };
