// Fraction, Roots
import Fraction from './classes/fractionClass';
import { NthRoot, SquareRoot } from './classes/rootClasses';
// Term, Expressions, Polynomials
import Term from './classes/algebra/termClass';
import Expression from './classes/algebra/expressionClass';
import Polynomial from './classes/algebra/polynomialClass';
// Trig
import Angle from './classes/trig/angleClass';
import { Trig } from './fns/trig/trigFunctions';
// Exp/Ln
import { Exp, Ln } from './classes/exponential/index';
// Coordinate geometry
import LinearFn from './classes/coordinateGeometry/linearFnClass';
// Calculus
import { ExpFn, LnFn, PowerFn, CosFn, SinFn, PolynomialFn, maclaurin } from './classes/calculus/index';
import {
  integrateCosSquare,
  integrateSinSquare,
  integrateSinCos,
  integrateCosSin,
  integrateCosCos,
  integrateSinSin,
} from './fns/calculus/trig';
import differentiate from './fns/calculus/differentiate';
import integrateByParts from './fns/calculus/integrateByParts';
// Complex
import { Complex, ComplexExp } from './classes/complex/index';
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
  ComplexExp,
  Vector,
  Line,
  Plane,
  ExpFn,
  LnFn,
  PowerFn,
  PolynomialFn,
  LinearFn,
  CosFn,
  SinFn,
  integrate,
  differentiate,
  maclaurin,
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
