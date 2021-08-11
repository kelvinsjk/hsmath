import { Fraction } from '../../index';

const one = Fraction.ONE;
const zero = Fraction.ZERO;
const two = new Fraction(2, 1);
const negativeThree = new Fraction(-3);
const oneHalf = new Fraction(1, 2);
const oneThird = new Fraction(-1, -3);
const oneSixth = new Fraction(3, 18);
const negativeThreeQuarter = new Fraction(-6, 8);
const nineSixteenth = negativeThreeQuarter.square();
const negativeTwoFifth = new Fraction(2, -5);
const twentyTwoOverSeven = new Fraction(22, 7);
const oneSixthFloat = 1 / 6;
const threePointOneFourFraction = new Fraction(3.14);

test('fraction arithmetic', () => {
  expect(() => {
    new Fraction(1, 0);
  }).toThrow();
  expect(() => {
    new Fraction(1.5, 3);
  }).toThrow();
  expect(() => {
    new Fraction(1, 3.1);
  }).toThrow();
  expect(() => {
    new Fraction(oneSixthFloat);
  }).toThrow();

  expect(negativeThree.num).toBe(-3);
  expect(negativeThree.den).toBe(1);
  expect(oneHalf.num).toBe(1);
  expect(oneHalf.negative().num).toBe(-1);
  expect(oneHalf.den).toBe(2);
  expect(oneThird.num).toBe(1);
  expect(oneThird.den).toBe(3);
  expect(negativeThreeQuarter.num).toBe(-3);
  expect(negativeThreeQuarter.den).toBe(4);
  expect(negativeTwoFifth.num).toBe(-2);
  expect(negativeTwoFifth.den).toBe(5);
  expect(threePointOneFourFraction.num).toBe(157);
  expect(threePointOneFourFraction.den).toBe(50);

  expect(two.isEqual(2)).toBe(true);
  expect(one.divide(two).isEqual(oneHalf)).toBe(true);
  expect(oneHalf.minus(oneThird).isEqual(oneSixth)).toBe(true);
  expect(oneSixth.isEqual(oneHalf)).toBe(false);
  expect(zero.isInteger()).toBe(true);
  expect(negativeThree.isInteger()).toBe(true);
  expect(oneHalf.isInteger()).toBe(false);

  expect(oneHalf.plus(negativeThreeQuarter).num).toBe(-1);
  expect(oneHalf.plus(negativeThreeQuarter).den).toBe(4);
  expect(oneHalf.plus(1).num).toBe(3);
  expect(oneHalf.plus(1).den).toBe(2);
  expect(negativeThreeQuarter.minus(negativeTwoFifth).num).toBe(-7);
  expect(negativeThreeQuarter.minus(negativeTwoFifth).den).toBe(20);
  expect(negativeThreeQuarter.minus(2).num).toBe(-11);
  expect(negativeThreeQuarter.minus(2).den).toBe(4);
  expect(negativeThreeQuarter.times(negativeTwoFifth).num).toBe(3);
  expect(negativeThreeQuarter.times(negativeTwoFifth).den).toBe(10);
  expect(negativeThreeQuarter.times(-6).num).toBe(9);
  expect(negativeThreeQuarter.times(-6).den).toBe(2);
  expect(() => {
    oneSixth.divide(zero);
  }).toThrow();
  expect(() => {
    oneSixth.divide(0);
  }).toThrow();
  expect(negativeTwoFifth.divide(oneHalf).num).toBe(-4);
  expect(negativeTwoFifth.divide(oneHalf).den).toBe(5);
  expect(negativeTwoFifth.divide(-6).num).toBe(1);
  expect(negativeTwoFifth.divide(-6).den).toBe(15);
  expect(() => {
    oneSixth.pow(1.2);
  }).toThrow();
  expect(() => {
    oneSixth.pow(-2);
  }).toThrow();
  expect(negativeTwoFifth.pow(0).num).toBe(1);
  expect(negativeTwoFifth.pow(0).den).toBe(1);
  expect(negativeTwoFifth.pow(1).num).toBe(-2);
  expect(negativeTwoFifth.pow(1).den).toBe(5);
  expect(negativeTwoFifth.pow(2).num).toBe(4);
  expect(negativeTwoFifth.pow(2).den).toBe(25);
  expect(negativeTwoFifth.pow(3).num).toBe(-8);
  expect(negativeTwoFifth.pow(3).den).toBe(125);

  expect(one.valueOf()).toBe(1);
  expect(oneHalf.valueOf()).toBe(0.5);
});

test('string methods', () => {
  expect(one.toString()).toBe('1');
  expect(`${negativeThree}`).toBe('- 3');
  expect(`${nineSixteenth}`).toBe('\\frac{9}{16}');
  expect(`${oneHalf}`).toBe('\\frac{1}{2}');
  expect(`${negativeThreeQuarter}`).toBe('- \\frac{3}{4}');
  expect(negativeThreeQuarter.toString({ displayMode: true })).toBe('\\displaystyle - \\frac{3}{4}');
  expect(negativeThreeQuarter.toString({ displayMode: false })).toBe('- \\frac{3}{4}');
  expect(negativeThreeQuarter.toTerm().toString()).toBe('- \\frac{3}{4}');
  expect(two.toFixed()).toBe('2');
  expect(twentyTwoOverSeven.toFixed()).toBe('3');
  expect(twentyTwoOverSeven.toFixed(2)).toBe('3.14');
  expect(twentyTwoOverSeven.toPrecision(3)).toBe('3.14');
  expect(oneSixth.times(-1).toPrecision(3)).toBe('-0.167');
});

test('toFactor', () => {
  expect(`${one.toFactor()}`).toBe('x - 1');
  expect(`${zero.toFactor()}`).toBe('x');
  expect(`${oneHalf.toFactor()}`).toBe('2 x - 1');
  expect(`${oneHalf.toFactor().multiply(-1)}`).toBe('- 2 x + 1');
  expect(`${negativeThreeQuarter.toFactor()}`).toBe('4 x + 3');
  expect(`${negativeThreeQuarter.toFactor({ variableAtom: 'y', ascending: true })}`).toBe('3 + 4 y');
});

test('static methods', () => {
  expect(Fraction.abs(negativeThree).num).toBe(3);
  expect(Fraction.abs(oneSixth).num).toBe(1);
  expect(Fraction.abs(oneSixth).den).toBe(6);
  expect(Fraction.abs(negativeTwoFifth).num).toBe(2);
  expect(Fraction.abs(negativeTwoFifth).den).toBe(5);
  expect(`${Fraction.floor(twentyTwoOverSeven)}`).toBe('3');
  expect(`${Fraction.ceil(twentyTwoOverSeven)}`).toBe('4');
  expect(`${Fraction.round(twentyTwoOverSeven)}`).toBe('3');
  expect(Fraction.sign(negativeTwoFifth)).toBe(-1);
  expect(Fraction.sign(twentyTwoOverSeven)).toBe(1);
  expect(Fraction.sign(zero)).toBe(0);
  expect(Fraction.compare(1, '>', oneHalf)).toBe(true);
  expect(Fraction.compare(oneSixth, '>', 2)).toBe(false);
  expect(Fraction.compare(oneSixth, '>', oneHalf)).toBe(false);
  expect(Fraction.compare(oneSixth, '>', negativeTwoFifth)).toBe(true);
  expect(Fraction.compare(oneSixth, '>', oneSixth)).toBe(false);
  expect(Fraction.compare(oneSixth, '>=', oneHalf)).toBe(false);
  expect(Fraction.compare(oneSixth, '>=', negativeTwoFifth)).toBe(true);
  expect(Fraction.compare(oneSixth, '>=', oneSixth)).toBe(true);
  expect(Fraction.compare(oneSixth, '<', oneHalf)).toBe(true);
  expect(Fraction.compare(oneSixth, '<', negativeTwoFifth)).toBe(false);
  expect(Fraction.compare(oneSixth, '<', oneSixth)).toBe(false);
  expect(Fraction.compare(oneSixth, '<=', oneHalf)).toBe(true);
  expect(Fraction.compare(oneSixth, '<', negativeTwoFifth)).toBe(false);
  expect(Fraction.compare(oneSixth, '<=', oneSixth)).toBe(true);
  expect(Fraction.compare(oneSixth, '==', oneHalf)).toBe(false);
  expect(Fraction.compare(oneSixth, '==', oneSixth)).toBe(true);
  expect(Fraction.compare(oneSixth, '===', oneSixth)).toBe(true);
  expect(Fraction.compare(1, '===', 2)).toBe(false);
});

test('gcd', () => {
  expect(`${Fraction.gcd(negativeThreeQuarter)}`).toBe('- \\frac{3}{4}');
  expect(`${Fraction.gcd(negativeThreeQuarter, oneSixth)}`).toBe('\\frac{1}{12}');
  expect(`${Fraction.gcd(twentyTwoOverSeven, negativeTwoFifth, 4)}`).toBe('\\frac{2}{35}');
  expect(`${Fraction.factorize(negativeThreeQuarter, oneSixth)[0][0]}`).toBe('- 9');
  expect(`${Fraction.factorize(negativeThreeQuarter, oneSixth)[0][1]}`).toBe('2');
  expect(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[1]}`).toBe('\\frac{2}{35}');
  expect(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][0]}`).toBe('55');
  expect(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][1]}`).toBe('- 7');
  expect(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][2]}`).toBe('70');

  expect(() => {
    Fraction.gcd();
  }).toThrow();
});
