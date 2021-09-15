import type Fraction from '../../classes/fractionClass';
//import type { Exp } from '../../classes/exponential/index';
//import type { SquareRoot } from '../../classes/rootClasses';
import type {
  PowerFn,
  PolynomialFn,
  //CosFn, SinFn, LnFn, ExpFn,
} from '../../classes/calculus/index';
type CalculusFn = PowerFn | PolynomialFn; // | ExpFn | LnFn | CosFn | SinFn;

/**
 * differentiate f(x)g(x) using product rule, and subs in x
 *
 */
function productRule(f: CalculusFn, g: CalculusFn, x: number | Fraction): Fraction {
  //| Exp | SquareRoot
  return f
    .derivative()
    .valueAt(x)
    .times(g.valueAt(x))
    .plus(f.valueAt(x).times(g.derivative().valueAt(x)));
}

/**
 * differentiate f(x)/g(x) using quotient rule, and subs in x
 *
 */
function quotientRule(f: CalculusFn, g: CalculusFn, x: number | Fraction): Fraction {
  //| Exp | SquareRoot
  const num = f
    .derivative()
    .valueAt(x)
    .times(g.valueAt(x))
    .minus(f.valueAt(x).times(g.derivative().valueAt(x)));
  const den = g.valueAt(x).square();
  return num.divide(den);
}

/**
 * `differentiate.productRule(f,g,x)` and `differentiate.quotientRule(f,g,x)`
 */
const differentiate = { productRule, quotientRule };

export default differentiate;
