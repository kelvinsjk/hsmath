import { Fraction, NthRoot, SquareRoot } from '../../index';

const oneHalf = new Fraction(1, 2);
const negativeTwoFifth = new Fraction(2, -5);

const cubeRoot5 = new NthRoot(5, 3);
const negativeTwoFifthCubeRoot5 = new NthRoot(5, 3, negativeTwoFifth);
const twoFifthRoot64 = new NthRoot(64, 5, 2);
const cubeRootHalf = new NthRoot(oneHalf, 3);
const cubeRootEight = new NthRoot(8, 3);
const cubeRootSixteen = new NthRoot(16, 3);

const sqrt2 = new SquareRoot(2);
const sixSqrt30 = new SquareRoot(8*27*5);
const sqrt10Factorial = new SquareRoot(10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2);
const sqrtOne = new SquareRoot(1);
const sqrtZero = new SquareRoot(0);
const sqrt4 = new SquareRoot(4);

const sqrt96Cube = new SquareRoot(Math.pow(97, 3));


test('toString', () => {
  expect(`${cubeRoot5}`).toBe('\\sqrt[3]{5}');
  expect(`${twoFifthRoot64}`).toBe('4 \\sqrt[5]{2}');
  expect(`${negativeTwoFifthCubeRoot5}`).toBe('- \\frac{2}{5} \\sqrt[3]{5}');
  expect(`${cubeRootHalf}`).toBe('\\frac{1}{2} \\sqrt[3]{2}');
  expect(`${cubeRootEight}`).toBe('2');
  expect(`${cubeRootSixteen}`).toBe('2 \\sqrt[3]{2}');
  expect(`${sqrt2}`).toBe('\\sqrt{2}');
  expect(`${sixSqrt30}`).toBe('6 \\sqrt{30}');
  expect(`${sqrt10Factorial}`).toBe('720 \\sqrt{7}');
  expect(`${sqrt96Cube}`).toBe('97 \\sqrt{97}');
  expect(`${sqrtOne}`).toBe('1');
  expect(`${sqrtZero}`).toBe('0');
  expect(`${sqrt4}`).toBe('2');

  expect(() => { new SquareRoot(negativeTwoFifth) }).toThrow();
  expect(() => { new NthRoot(1.2, 3) }).toThrow();
  expect(() => { new NthRoot(5, 1) }).toThrow();
  expect(() => { new NthRoot(5, 2.3) }).toThrow();

  
})