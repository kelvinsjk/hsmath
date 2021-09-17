import { AP, GP, Fraction, NthRoot } from '../../index';

const ap1 = new AP(4, new Fraction(10 - 4, 4));
const ap2 = new AP(new Fraction(4));
const fifthTerm = new Fraction(16384, 10000);
const rRoot = new NthRoot(fifthTerm.divide(4), 4);
const r = rRoot.coeff;
const gp1 = new GP(4, r);

test('ap,gp', () => {
  expect(`${ap1.uNValueAt(30)}`).toBe('\\frac{95}{2}');
  expect(`${ap2.uNValueAt(2)}`).toBe('5');
  expect(`${ap1.sNValueAt(50).minus(ap1.sNValueAt(20))}`).toBe('\\frac{3345}{2}');
  expect(`${gp1.sInfty()}`).toBe('20');
  expect(`${gp1.uNValueAt(5)}`).toBe('\\frac{1024}{625}');
  expect(`${gp1.sNValueAt(2)}`).toBe('\\frac{36}{5}');
  expect(`${gp1.uN()}`).toBe('4 \\left( \\frac{4}{5} \\right)^{n - 1}');
  expect(`${gp1.sN()}`).toBe('20 \\left( 1 - \\frac{4}{5}^n \\right)');
})