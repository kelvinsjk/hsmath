import Fraction from '../../classes/fractionClass';
import Term from '../../classes/expressions/termClass';
import Expression from '../../classes/expressions/expressionClass';
import Angle from '../../classes/trig/angleClass';

import { CosFn, SinFn } from '../../classes/calculus/index';

/**
 * integrates k (cos^2 (ax+b))
 *
 * @param options defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 *
 */
function integrateCosSquare(options?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff); // coeff after applying double angle formula
  const variableAtom = optionsObject.variableAtom;
  const doubleAngleOptions = {
    a: new Fraction(2).times(optionsObject.a),
    b: new Fraction(2).times(optionsObject.b),
    variableAtom,
    coeff,
  };
  const cos2x = new CosFn(doubleAngleOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral = cos2x.definiteIntegral(lower, upper);
    const upperTerm = new Term(upper.coeff.times(coeff), '\\pi');
    const lowerTerm = new Term(lower.coeff.times(coeff), '\\pi');
    return trigIntegral.add(upperTerm).subtract(lowerTerm);
  } else {
    // indefinite integral
    const xTerm = new Term(coeff, variableAtom);
    return new Expression(cos2x.integral(), xTerm);
  }
}

/**
 * integrates k (sin^2 (ax+b))
 *
 * @param options defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 * @param options2 defaults to `options` (giving us the sine double angle integral)
 *
 */
function integrateSinSquare(options?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff); // coeff after applying double angle formula
  const variableAtom = optionsObject.variableAtom;
  const doubleAngleOptions = {
    a: new Fraction(2).times(optionsObject.a),
    b: new Fraction(2).times(optionsObject.b),
    variableAtom,
    coeff: coeff.times(-1),
  };
  const cos2x = new CosFn(doubleAngleOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral = cos2x.definiteIntegral(lower, upper);
    const upperTerm = new Term(upper.coeff.times(coeff), '\\pi');
    const lowerTerm = new Term(lower.coeff.times(coeff), '\\pi');
    return trigIntegral.add(upperTerm).subtract(lowerTerm);
  } else {
    // indefinite integral
    const xTerm = new Term(coeff, variableAtom);
    return new Expression(xTerm, cos2x.integral());
  }
}

/**
 * integrates k sin (ax+b) cos(ax+b)
 *
 * @param options1 defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 * @param options2 defaults to options1
 *
 * WARNING: only `a` and `b` are used in options1. All other options should be set in options2
 */
function integrateSinCos(options1?: TrigIntegralOptions, options2?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options1 };
  const options2Object = { ...optionsObject, ...options2 };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff);
  const variableAtom = optionsObject.variableAtom;
  const a1 = convertNumberToFraction(optionsObject.a);
  const b1 = convertNumberToFraction(optionsObject.b);
  const pOptions = {
    a: a1.plus(options2Object.a),
    b: b1.plus(options2Object.b),
    variableAtom,
    coeff,
  };
  const a = a1.minus(options2Object.a);
  const b = b1.minus(options2Object.b);
  const qOptions = {
    a,
    b,
    variableAtom,
    coeff,
  };
  const sinPx = new SinFn(pOptions);
  const sinQx = a.isEqual(0) ? sinPx : new SinFn(qOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral1 = sinPx.definiteIntegral(lower, upper);
    const trigIntegral2 = sinQx.definiteIntegral(lower, upper);
    return a.isEqual(0) && b.isEqual(0) ? trigIntegral1 : trigIntegral1.add(trigIntegral2);
  } else {
    // indefinite integral
    return a.isEqual(0) && b.isEqual(0)
      ? new Expression(sinPx.integral())
      : new Expression(sinPx.integral(), sinQx.integral());
  }
}
/**
 * integrates k cos(ax+b) sin(ax+b)
 *
 * @param options1 defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 *
 * WARNING: only `a` and `b` are used in options1. All other options should be set in options2
 */
function integrateCosSin(options1?: TrigIntegralOptions, options2?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options1 };
  const options2Object = { ...defaultOptions, ...options2 };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff);
  const variableAtom = optionsObject.variableAtom;
  const a1 = convertNumberToFraction(optionsObject.a);
  const b1 = convertNumberToFraction(optionsObject.b);
  const pOptions = {
    a: a1.plus(options2Object.a),
    b: b1.plus(options2Object.b),
    variableAtom,
    coeff,
  };
  const a = a1.minus(options2Object.a);
  const b = b1.minus(options2Object.b);
  const qOptions = {
    a,
    b,
    variableAtom,
    coeff,
  };
  const sinPx = new SinFn(pOptions);
  const sinQx = a.isEqual(0) ? sinPx : new SinFn(qOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral1 = sinPx.definiteIntegral(lower, upper);
    const trigIntegral2 = sinQx.definiteIntegral(lower, upper);
    return a.isEqual(0) && b.isEqual(0) ? trigIntegral1 : trigIntegral1.subtract(trigIntegral2);
  } else {
    // indefinite integral
    return a.isEqual(0) && b.isEqual(0)
      ? new Expression(sinPx.integral())
      : new Expression(sinPx.integral(), sinQx.integral().multiply(-1));
  }
}
/**
 * integrates k cos (ax+b) cos(ax+b)
 *
 * @param options1 defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 *
 * WARNING: only `a` and `b` are used in options1. All other options should be set in options2
 */
function integrateCosCos(options1?: TrigIntegralOptions, options2?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options1 };
  const options2Object = { ...defaultOptions, ...options2 };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff);
  const variableAtom = optionsObject.variableAtom;
  const a1 = convertNumberToFraction(optionsObject.a);
  const b1 = convertNumberToFraction(optionsObject.b);
  const pOptions = {
    a: a1.plus(options2Object.a),
    b: b1.plus(options2Object.b),
    variableAtom,
    coeff,
  };
  const a = a1.minus(options2Object.a);
  const b = b1.minus(options2Object.b);
  const qOptions = {
    a,
    b,
    variableAtom,
    coeff,
  };
  const cosPx = new CosFn(pOptions);
  const cosQx = a.isEqual(0) ? cosPx : new CosFn(qOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral1 = cosPx.definiteIntegral(lower, upper);
    const trigIntegral2 = cosQx.definiteIntegral(lower, upper);
    const upperTerm = new Term(upper.coeff.times(coeff), '\\pi');
    const lowerTerm = new Term(lower.coeff.times(coeff), '\\pi');
    return a.isEqual(0) && b.isEqual(0)
      ? trigIntegral1.add(upperTerm).subtract(lowerTerm)
      : trigIntegral1.add(trigIntegral2);
  } else {
    // indefinite integral
    const xTerm = new Term(coeff, variableAtom);
    return a.isEqual(0) && b.isEqual(0)
      ? new Expression(cosPx.integral(), xTerm)
      : new Expression(cosPx.integral(), cosQx.integral());
  }
}
/**
 * integrates k sin (ax+b) sin(ax+b)
 *
 * @param options1 defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1, limits: []`
 *
 * WARNING: only `a` and `b` are used in options1. All other options should be set in options2
 */
function integrateSinSin(options1?: TrigIntegralOptions, options2?: TrigIntegralOptions): Expression {
  const defaultOptions = {
    a: 1,
    b: 0,
    variableAtom: 'x',
    coeff: 1,
    limits: [],
  };
  const optionsObject = { ...defaultOptions, ...options1 };
  const options2Object = { ...defaultOptions, ...options2 };

  const coeff = new Fraction(1, 2).times(optionsObject.coeff);
  const variableAtom = optionsObject.variableAtom;
  const a1 = convertNumberToFraction(optionsObject.a);
  const b1 = convertNumberToFraction(optionsObject.b);
  const pOptions = {
    a: a1.plus(options2Object.a),
    b: b1.plus(options2Object.b),
    variableAtom,
    coeff,
  };
  const a = a1.minus(options2Object.a);
  const b = b1.minus(options2Object.b);
  const qOptions = {
    a,
    b,
    variableAtom,
    coeff,
  };
  const cosPx = new CosFn(pOptions);
  const cosQx = a.isEqual(0) ? cosPx : new CosFn(qOptions);
  if (optionsObject.limits.length > 0) {
    // definite integral
    let lower = optionsObject.limits[0];
    let upper = optionsObject.limits[1];
    if (typeof lower === 'number') {
      lower = new Angle(lower);
    }
    if (typeof upper === 'number') {
      upper = new Angle(upper);
    }
    const trigIntegral1 = cosPx.definiteIntegral(lower, upper);
    const trigIntegral2 = cosQx.definiteIntegral(lower, upper);
    const upperTerm = new Term(upper.coeff.times(coeff), '\\pi');
    const lowerTerm = new Term(lower.coeff.times(coeff), '\\pi');
    return a.isEqual(0) && b.isEqual(0)
      ? trigIntegral1.multiply(-1).add(upperTerm).subtract(lowerTerm)
      : trigIntegral2.subtract(trigIntegral1);
  } else {
    // indefinite integral
    const xTerm = new Term(coeff, variableAtom);
    return a.isEqual(0) && b.isEqual(0)
      ? new Expression(xTerm, cosPx.integral().multiply(-1))
      : new Expression(cosQx.integral(), cosPx.integral().multiply(-1));
  }
}

export { integrateCosSquare, integrateSinSquare, integrateSinCos, integrateCosSin, integrateCosCos, integrateSinSin };

interface TrigIntegralOptions {
  a?: number | Fraction;
  b?: number | Fraction;
  coeff?: number | Fraction;
  variableAtom?: string;
  limits?: (number | Angle)[];
}

// convertNumberToFraction
export default function convertNumberToFraction(x: number | Fraction): Fraction {
  if (typeof x === 'number') {
    return new Fraction(x);
  } else {
    return new Fraction(x.num, x.den);
  }
}
