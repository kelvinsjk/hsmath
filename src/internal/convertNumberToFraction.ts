import Fraction from '../classes/fractionClass';

// convertNumberToFraction
export default function convertNumberToFraction(num: number | Fraction): Fraction {
  if (typeof num === 'number') {
    num = new Fraction(num);
  }
  return num.clone();
}