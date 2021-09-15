import Term from './termClass';
import Fraction from '../fractionClass';

/**
 * An `Expression` is a representation of the sum of `Terms`
 */
export default class Expression {
  terms: Term[];

  ////
  // constructor
  ////
  /**
   * Creates a new `Expression` instance, converting any Fraction inputs into the Term class
   * Combines like terms by adding the coefficients, such that no term types are repeated in the array
   * @param args one or more Terms/Fractions
   */
  constructor(...args: (Term | Fraction | number | string)[]) {
    const terms: Term[] = [];
    for (let arg of args) {
      if (typeof arg === 'number') {
        arg = new Fraction(arg);
      } else if (typeof arg === 'string') {
        arg = new Term(1, arg);
      }
      const term = arg instanceof Fraction ? arg.toTerm() : arg.clone();
      terms.push(term);
    }
    if (terms.length === 0) {
      throw 'we do not support empty Expression at the moment';
    } else {
      this.terms = combineLikeTerms(terms);
    }
  }

  ////
  // class methods
  ////
  /// string methods
  /**
   * @param displayMode if `true`, adds `\displaystyle` at the start of the string
   * @returns the LaTeX string representation of the sum of all the terms
   */
  toString(options?: toStringOptions): string {
    const optionsObject = {
      displayMode: false,
      fractionalCoefficient: true,
    };
    Object.assign(optionsObject, options);
    const termOptions = {
      fractionalCoefficient: optionsObject.fractionalCoefficient,
    };
    let firstTerm = true,
      outputString = '';
    for (const term of this.terms) {
      const variable = term.toString(termOptions);
      if (variable !== '0') {
        // only add to output for non-zero terms
        if (firstTerm) {
          outputString += `${variable}`;
          firstTerm = false;
        } else {
          // non-first term: add + sign if no - signs found
          if (variable[0] !== '-') {
            outputString += ` + ${variable}`;
          } else {
            outputString += ` ${variable}`;
          }
        }
      }
    }
    const displayText = optionsObject.displayMode ? '\\displaystyle ' : '';
    outputString = outputString === '' ? '0' : outputString;
    return displayText + outputString;
  }

  /**
   * reverse the order of the terms
   * warning: mutates object
   * @returns a reference to this expression after reversal
   */
  reverse(): Expression {
    this.terms.reverse();
    return this;
  }

  /**
   * performs scalar multiplication on each term of this
   */
  multiply(x: number | Fraction): Expression {
    const terms: Term[] = [];
    for (const term of this.terms) {
      terms.push(term.multiply(x));
    }
    return new Expression(...terms);
  }

  /**
   * adds the two expressions
   * similar to concatenating the terms in the two expressions, combining like terms
   * @returns the sum
   */
  add(newExpression: Term | Fraction | number | string | Expression): Expression {
    if (newExpression instanceof Expression) {
      return new Expression(...this.terms, ...newExpression.terms);
    } else {
      return new Expression(...this.terms, newExpression);
    }
  }
  /**
   * subtracts the two expressions
   *
   * @returns the difference
   */
  subtract(newExpression: Term | Fraction | number | string | Expression): Expression {
    if (newExpression instanceof Expression) {
      const negativeExp = newExpression.multiply(-1);
      return new Expression(...this.terms, ...negativeExp.terms);
    } else if (newExpression instanceof Term) {
      return new Expression(...this.terms, newExpression.multiply(-1));
    } else if (newExpression instanceof Fraction) {
      return new Expression(...this.terms, newExpression.times(-1));
    } else if (typeof newExpression === 'number') {
      return new Expression(...this.terms, newExpression * -1);
    } else {
      // string
      const newTerm = new Term(-1, newExpression);
      return new Expression(...this.terms, newTerm);
    }
  }
  /**
   * solves a linear expression $ax+b=0$ where this expression is $ax+b$
   * 
   * only works if this expression is made up of a single constant term and a variable term
   * 
   * @returns -b/a given this expression $ax+b$
   */
  solveLinear(): Fraction {
    if (this.terms.length === 2) {
      const [t1, t2] = this.terms;
      if (t1.variable === '' || t2.variable === '') {
        const b = t1.variable === '' ? t1.coeff : t2.coeff;
        const a = t1.variable === '' ? t2.coeff : t1.coeff;
        return b.divide(a).times(-1);
      }
    }
    throw new TypeError(`Expression ${this} is not linear`)
  }
  /**
   * clones the object, creating a new instance of this expression
   */
  clone(): Expression {
    const terms: Term[] = [];
    for (const term of this.terms) {
      terms.push(term.clone());
    }
    return new Expression(...terms);
  }
  /**
   * @returns itself, useful for situations to convert a Term class to an Expression class
   */
  toExpression(): Expression {
    return this;
  }
}

function combineLikeTerms(terms: Term[]): Term[] {
  const variableArray: string[] = [],
    simplifiedTermArray: Term[] = [];
  for (const term of terms) {
    const variableIndex = variableArray.indexOf(term.variable);
    if (variableIndex === -1) {
      // new term type
      simplifiedTermArray.push(term.clone());
      variableArray.push(term.variable);
    } else {
      // term type has appeared before
      simplifiedTermArray[variableIndex].coeff = simplifiedTermArray[variableIndex].coeff.plus(term.coeff);
    }
  }
  return simplifiedTermArray;
}

/**
 * Options for converting to string
 */
interface toStringOptions {
  /** `displayMode`: if `true`, adds '\\displaystyle' at the start of the string */
  displayMode?: boolean;
  /**
   * `fractionalCoefficient`:
   *
   * consider the example 3/4 x
   *
   * setting `true` (default) will typeset the string as 3/4 x (coefficient followed by variable)
   *
   * `false` will typeset the  string as 3x/4 (adds the variable on the numerator)
   *
   * has no effect if coefficient is an integer
   */
  fractionalCoefficient?: boolean;
}
