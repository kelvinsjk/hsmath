import Fraction from '../fractionClass';

/**
 * term class `{coeff: Fraction, variable: string}`
 *
 * let $a$ be `coeff` (the coefficient) and $x$ be the `variable`.
 * Then this term class is the representation of the 'term' $ax$.
 *
 * For example, `Term(new Fraction(2,3), '')` represents the constant term $\frac{2}{3}$ and `Term(5, 'x^2')` represents the $x^2$ term $5x^2$.
 */
export default class Term {
  /** coefficient of the term */
  coeff: Fraction;
  /** string representation of the term 'variable'. An empty string here represents the constant term */
  variable: string;

  //// constructor
  /**
   * Creates a new term instance
   * @param coeff coefficient of the term
   * @param variable string representation of the term/'variable'. An empty string (default) means we are working with the constant term
   */
  constructor(coeff: Fraction | number, variable = '') {
    //if (typeof coeff === 'number') {
    //  coeff = new Fraction(coeff);
    //}
    coeff = typeof coeff === 'number' ? new Fraction(coeff) : new Fraction(coeff.num, coeff.den);
    this.coeff = coeff;
    this.variable = variable;
  }

  /// string methods
  /**
   * @param options default {displayMode: false, fractionalCoefficient: true, brackets: false}
   * 
   * `fractionalCoefficient` true returns a/b x, vs ax/b
   * 
   * `brackets` adds brackets around the variable k(x) (warning: incompatible with `fractionalCoefficient=false`)
   * 
   * @returns the LaTeX string representation of the term
   */
  toString(options?: toStringOptions): string {
    const optionsObject = {
      displayMode: false,
      fractionalCoefficient: true,
      brackets: false
    };
    Object.assign(optionsObject, options);
    const displayText = optionsObject.displayMode ? '\\displaystyle ' : '';
    if (this.coeff.isEqual(0)) {
      return '0';
    } else if (this.coeff.isEqual(1)) {
      return this.variable === '' ? '1' : `${displayText}${this.variable}`;
    } else if (this.coeff.isEqual(-1)) {
      return this.variable === '' ? '-1' :
        optionsObject.brackets ? `${displayText}- ( ${this.variable} )` : `${displayText}- ${this.variable}`;
    } else {
      // non 0/1/-1 coefficient
      if (this.variable === '') {
        // constant term
        return `${displayText}${this.coeff}`;
      } else {
        // variable term and non 0/1/-1 coefficient
        if (optionsObject.fractionalCoefficient) {
          return optionsObject.brackets ? `${displayText}${this.coeff} ( ${this.variable} )` : `${displayText}${this.coeff} ${this.variable}`;
        } else {
          // adds term to numerator
          const sign = this.coeff.num < 0 ? '- ' : '';
          const modNumeratorString = Math.abs(this.coeff.num) === 1 ? '' : `${Math.abs(this.coeff.num)} `;
          return this.coeff.isInteger()
            ? `${displayText}${this.coeff} ${this.variable}`
            : `${displayText}${sign}\\frac{${modNumeratorString}${this.variable}}{${this.coeff.den}}`;
        }
      }
    }
  }

  /// multiplication
  /**
   * performs scalar multiplication if a `number`, `Fraction` or constant `Term` (empty `variable`) is provided.
   *
   * if another `Term` is provided, return a new `Term` type representing their product (this feature is experimental)
   * @param options to set a new variable name after term multiplication (by default, the new variable name will be the two variables side by side)
   */
  multiply(t2: number | Fraction | Term, options?: variableOptions): Term {
    if (typeof t2 === 'number') {
      t2 = new Fraction(t2);
    }
    if (t2 instanceof Fraction) {
      return new Term(this.coeff.times(t2), this.variable);
    } else {
      // term
      if (t2.variable === '') {
        // t2 is a constant
        return new Term(this.coeff.times(t2.coeff), this.variable);
      } else if (this.variable == '') {
        // this is a constant
        return new Term(this.coeff.times(t2.coeff), t2.variable);
      }
      const newVariable = options === undefined ? `${this.variable} ${t2.variable}` : options.variable;
      return new Term(this.coeff.times(t2.coeff), newVariable);
    }
  }
  /**
   * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
   */
  negative(): Term {
    return this.multiply(-1);
  }

  clone(): Term {
    return new Term(new Fraction(this.coeff.num, this.coeff.den), this.variable);
  }

  /// note: addition is handled by the Expression class
}

/**
 * Options for naming the variable
 */
interface variableOptions {
  /** string representing the variable (default `x`) */
  variable?: string
}

/**
 * Options for converting to string
 */
interface toStringOptions {
  /** `displayMode`: if `true`, adds '\\displaystyle' at the start of the string */
  displayMode?: boolean,
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
  fractionalCoefficient?: boolean,
  /**
   * adds brackets to the variable 
   */
  brackets?: boolean
}
// TODO: addition, scalar multiplication, subtraction
