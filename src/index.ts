// Fraction, Roots
import Fraction from './classes/fractionClass';
import { NthRoot, SquareRoot } from './classes/rootClasses';
// Term, Expressions, Polynomials
import Term from './classes/expressions/termClass';
import Expression from './classes/expressions/expressionClass';
import Polynomial from './classes/expressions/polynomialClass';
// Trig
import Angle from './classes/trig/angleClass';
import { Trig } from './fns/trig/trigFunctions';
// Exp/Ln
import { Exp, Ln } from './classes/exponential/index';
// Calculus
import { ExpFn, LnFn, PowerFn, CosFn, SinFn } from './classes/calculus/index';
import {
  integrateCosSquare,
  integrateSinSquare,
  integrateSinCos,
  integrateCosSin,
  integrateCosCos,
  integrateSinSin,
} from './fns/calculus/trig';
import integrateByParts from './fns/calculus/integrateByParts';
// Complex
import Complex from './classes/complex/complexClass';
// Vector
import { Vector, Line, Plane } from './classes/vectors/index';
// arithmetic functions
import gcd from './fns/arithmetic/gcd';
import factorize from './fns/arithmetic/factorize';
// algebra functions
import solveQuadratic from './fns/algebra/solveQuadratic';
// random functions
import { getRandomInt, getRandomFrac, getRandomLinear, getRandomQuadratic } from './fns/random/generators';
import { getRandomVec } from './fns/random/vectorGenerators';
// misc
import RationalFunction from './classes/misc/rationalClass';

const integrate = {
  cosSquare: integrateCosSquare,
  sinSquare: integrateSinSquare,
  sinCos: integrateSinCos,
  cosSin: integrateCosSin,
  cosCos: integrateCosCos,
  sinSin: integrateSinSin,
  byParts: integrateByParts,
};

export {
  Fraction,
  NthRoot,
  SquareRoot,
  Term,
  Expression,
  Polynomial,
  Angle,
  Trig,
  Exp,
  Ln,
  Complex,
  Vector,
  Line,
  Plane,
  ExpFn,
  LnFn,
  PowerFn,
  CosFn,
  SinFn,
  integrate,
  gcd,
  factorize,
  solveQuadratic,
  getRandomInt,
  getRandomFrac,
  getRandomLinear,
  getRandomQuadratic,
  getRandomVec,
  RationalFunction,
};
