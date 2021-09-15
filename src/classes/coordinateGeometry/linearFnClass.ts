import PolynomialFn from "../calculus/polynomialFnClass";
import convertNumberToFraction from '../../internal/convertNumberToFraction';

import Fraction from '../fractionClass';
import Expression from '../algebra/expressionClass';
import Term from '../algebra/termClass';

export default class LinearFn extends PolynomialFn {
  /**
   * class representing the linear function y = mx + c
   */
  m: Fraction;
  c: Fraction;

  ////
  // constructor
  ////
  /**
   * Creates a new linearFn instance
   *
   * @param parameterObject defaults to `{m: 1, c: 0, x1: 0, y1: 0, x2: 1, y2: 1}`
   * @param options defaults to `{mode: 'mc'}` representing m and c provided in parameterObject. 
   * Other modes: 'mp' representing m and a point provided, 'pp' representing two points provided.
   *
   */
  constructor(parameterObject: LinearFnParameters, options?: LinearFnOptions) {
    const defaultParameters: LinearFnParameters = { m: 1, c: 0, x1: 0, y1: 0, x2: 1, y2: 1 };
    let { m, c, x1, y1, x2, y2 } = { ...defaultParameters, ...parameterObject }; // eslint-disable-line
    const defaultOptions = { mode: 'mc' };
    const { mode } = { ...defaultOptions, ...options };
    if (mode === 'mp') {
      m = convertNumberToFraction(m!);
      c = m.times(-1).times(x1!).plus(y1!);
    } else if (mode === 'pp') {
      x2 = convertNumberToFraction(x2!);
      y2 = convertNumberToFraction(y2!);
      m = y2.minus(y1!).divide(x2.minus(x1!));
      c = m.times(-1).times(x2).plus(y2);
    }
    super([m!, c!]);
    m = convertNumberToFraction(m!);
    c = convertNumberToFraction(c!);
    this.m = m;
    this.c = c;
  }

  /**
   * x-intercept
   * 
   * @returns x-coordinate of x-intercept
   */
  xIntercept(): Fraction {
    return this.c.times(-1).divide(this.m);
  }

  /**
   * y-intercept
   * 
   * @returns y-coordinate of y-intercept
   */
  yIntercept(): Fraction {
    return this.c;
  }

  /**
   * toString
   * 
   * @returns 'y = mx + c' with m and c subbed in by default
   * 
   */
  toString(): string {
    return `y = ${this.m} x + ${this.c}`;
  }

  /**
   * toIntegerString
   * 
   * @return 'ax + by = c', where $a,b,c$ are integers
   */
  toIntegerString(): string{
    const [[a, b, c]] = Fraction.factorize(this.m.times(-1), 1, this.c);
    const lineNExpression = new Expression(new Term(a, 'x'), new Term(b, 'y'));
    return `${lineNExpression} = ${c}`;
  }
}

interface LinearFnParameters{
  m?: number | Fraction,
  c?: number | Fraction,
  x1?: number | Fraction,
  y1?: number | Fraction,
  x2?: number | Fraction,
  y2?: number | Fraction,  
}

interface LinearFnOptions{
  mode: 'mc' | 'mp' | 'pp',
}