import { DE, Fraction } from '../../index';

const de1 = new DE.exponential({ k: new Fraction(-3, 100), x: 'P' });
const de2 = new DE.exponential({ b: -500, k: new Fraction(-3, 100), x: 'P' });

test('de', () => {
  expect(`${de1}`).toBe('\\frac{\\mathrm{d}P}{\\mathrm{d}t} = - \\frac{3}{100} P');
  expect(`${de1.generalSolution()}`).toBe('P = A \\mathrm{e}^{- \\frac{3}{100} t}');
  expect(`${de2.generalSolution()}`).toBe('P = A \\mathrm{e}^{- \\frac{3}{100} t} + 500');
  expect(`${de2.particularSolution(600)}`).toBe('P = 100 \\mathrm{e}^{- \\frac{3}{100} t} + 500');
});
