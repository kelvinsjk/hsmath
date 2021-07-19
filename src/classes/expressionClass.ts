import Term from './termClass';
import Fraction from './fractionClass';

/**
 * An `Expression` is a representation of the sum of `Terms`
 */
export default class Expression {
  terms: Term[];

  //// constructor
  /**
   * Creates a new `Expression` instance, converting any Fraction inputs into the Term class
   * Combines like terms by adding the coefficients, such that no term types are repeated in the array
   * @param args one or more Terms/Fractions
   */
  constructor(...args: (Term | Fraction | number)[]) {
    const terms: Term[] = [];
    for (let arg of args) {
      if (typeof arg === 'number') {
        arg = new Fraction(arg);
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

  //// class methods
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
   * @returns a reference to the object
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
  add(expression2: Expression): Expression {
    return new Expression(...this.terms, ...expression2.terms);
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
