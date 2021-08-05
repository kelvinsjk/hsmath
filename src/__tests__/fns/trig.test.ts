import { Angle, Trig } from '../../index';

const fortyFive = new Angle(45);
const oneTwenty = new Angle(120);
const twoTen = new Angle(210);
const negativeThirty = new Angle(-30, false);

const zero = new Angle(0);
const ninety = new Angle(90);
const oneEighty = new Angle(180);
const oneEightyV2 = new Angle(-180);
const twoSeventy = new Angle(270);
const negativeNinety = new Angle(270, false);

test('Angles', () => {
  expect(`${fortyFive}`).toBe('\\frac{1}{4} \\pi');
  expect(`${negativeThirty}`).toBe('- \\frac{1}{6} \\pi');
  expect(`${fortyFive.complement()}`).toBe('\\frac{1}{4} \\pi');
  expect(`${fortyFive.supplement()}`).toBe('\\frac{3}{4} \\pi');
  expect(`${fortyFive.clone()}`).toBe('\\frac{1}{4} \\pi');
  expect(`${zero}`).toBe('0');
  expect(`${oneEighty}`).toBe('\\pi');
  expect(`${oneTwenty.plus(ninety)}`).toBe('\\frac{7}{6} \\pi');
  expect(ninety.minus(twoSeventy).degrees).toBe(180);
  expect(ninety.negative().degrees).toBe(270);
  expect(negativeThirty.negative().degrees).toBe(30);
  expect(negativeThirty.times(7).degrees).toBe(150);
  expect(negativeNinety.divide(3).degrees).toBe(-30);

  expect(negativeNinety.degrees).toBe(-90);
  expect(negativeNinety.rangeMinIsZero).toBe(false);
  expect(oneEightyV2.degrees).toBe(180);
  expect(oneEightyV2.rangeMinIsZero).toBe(true);

  expect(twoTen.degrees).toBe(210);
  expect(twoTen.togglePrincipalRange()).toMatch('-pi to pi');
  expect(twoTen.degrees).toBe(-150);
  expect(twoTen.togglePrincipalRange()).toMatch('0 to 2pi');

  expect(() => oneEighty.divide(0)).toThrow();
  expect(() => new Angle(75)).toThrow();
})

test('Angles', () => {
  expect(`${Trig.sin(fortyFive)}`).toBe('\\frac{1}{2} \\sqrt{2}');
  expect(`${Trig.sin(oneEightyV2)}`).toBe('0');
  expect(`${Trig.sin(negativeThirty)}`).toBe('- \\frac{1}{2}');
  expect(`${Trig.sin(twoSeventy)}`).toBe('-1');
  expect(`${Trig.cos(oneTwenty)}`).toBe('- \\frac{1}{2}');
  expect(`${Trig.cos(zero)}`).toBe('1');
  expect(`${Trig.cos(ninety)}`).toBe('0');
  expect(`${Trig.cos(twoSeventy)}`).toBe('0');
  expect(`${Trig.tan(twoTen)}`).toBe('\\frac{1}{3} \\sqrt{3}');
  expect(`${Trig.tan(oneEighty)}`).toBe('0');

  expect(`${Trig.tan(-60)}`).toBe('- \\sqrt{3}');
  expect(`${Trig.tan(225)}`).toBe('1');
  expect(`${Trig.cos(150)}`).toBe('- \\frac{1}{2} \\sqrt{3}');
  expect(`${Trig.sin(60)}`).toBe('\\frac{1}{2} \\sqrt{3}');
  
  expect(() => Trig.tan(ninety)).toThrow();

});