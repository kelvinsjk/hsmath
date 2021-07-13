import Fraction from './fractionClass';

/**
 * term class `{coeff: Fraction, termString: string}`
 *
 * let $a$ be `coeff` (the coefficient) and $x$ be the `termString`. 
 * Then this term class is the representation of the 'term' $ax$.
 * 
 * For example, `Term(new Fraction(2,3), '')` represents the constant term $\frac{2}{3}$ and `Term(5, 'x^2')` represents the $x^2$ term $5x^2$.
 */
export default class Term{
  /** coefficient of the term */
  coeff: Fraction;
  /** string representation of the term 'variable'. An empty string here represents the constant term */
  termString: string;

  //// constructor
  /**
   * Creates a new term instance
   * @param coeff coefficient of the term
   * @param termString string representation of the term/'variable'. An empty string (default) means we are working with the constant term
   */
  constructor(coeff: Fraction | number, termString = '') {
    if (typeof coeff === 'number') {
      coeff = new Fraction(coeff);
    }
    this.coeff = coeff;
    this.termString = termString;
  }

  /// string methods
  /**
   * @param displayMode if `true`, adds `\displaystyle` at the start of the string
   * @returns the LaTeX string representation of the term
   */
  toString(displayMode = false): string {
    const displayText = displayMode ? '\\displaystyle ' : '';
    if (this.coeff.isEqual(0)) {
      return '0';
    } else if (this.coeff.isEqual(1)) {
      return (this.termString === '') ? '1' : `${displayText}${this.termString}`;
    } else if (this.coeff.isEqual(-1)) {
      return (this.termString === '') ? '-1' : `-${displayText}${this.termString}`;
    } else{
      return (this.termString === '') ? `${displayText}${this.coeff}` : `${displayText}${this.coeff} ${this.termString}`;
    }
  }  
}

  //// addition, scalar multiplication, subtraction
  // TODO: addition, scalar multiplication, subtraction