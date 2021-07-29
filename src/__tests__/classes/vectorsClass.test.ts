import { Vector, Fraction } from '../../index';

const v1 = new Vector(2, 0, -1);
const v2 = new Vector(1, 3);

const v3 = new Vector(new Fraction(1, 2), -1);
const v4 = new Vector(new Fraction(1, 2), -1, 3, {simplify: true});
const v5 = new Vector(new Fraction(1, 2), -1, 3, { stretchable: true });

const v6 = new Vector(1, 2, -1, { k: new Fraction(-1, 3) });

test('vectors 1', () => {
  expect(`${v1.k}`).toBe('1');
  expect(`${v1.a}`).toBe('2');
  expect(`${v1.b}`).toBe('0');
  expect(`${v1.c}`).toBe('- 1');
  expect(`${v1.plus(v2).toString({ ijkMode: true })}`).toBe('3 \\mathbf{i} + 3 \\mathbf{j} - \\mathbf{k}');
  expect(`${v1.minus(v2).toString({ ijkMode: true })}`).toBe('\\mathbf{i} - 3 \\mathbf{j} - \\mathbf{k}');
  expect(`${v1.multiply(2).toString({ ijkMode: true })}`).toBe('4 \\mathbf{i} - 2 \\mathbf{k}');
  expect(`${v1.multiply(2, { changeK: true }).toString({ ijkMode: true })}`).toBe('2 ( 2 \\mathbf{i} - \\mathbf{k} )');
  expect(`${v1.dot(v2)}`).toBe('2');
  expect(`${v1.cross(v2).toString({ ijkMode: true })}`).toBe('3 \\mathbf{i} - \\mathbf{j} + 6 \\mathbf{k}');

  expect(`${v3.toString({ ijkMode: true })}`).toBe('\\frac{1}{2} \\mathbf{i} - \\mathbf{j}');
  v3.simplify();

  expect(`${v3.plus(v4).toString({ ijkMode: true })}`).toBe('\\frac{1}{2} ( 2 \\mathbf{i} - 4 \\mathbf{j} + 6 \\mathbf{k} )');
  expect(`${v3.plus(v4).toString({ ijkMode: true, multiplyKIn: true })}`).toBe('\\mathbf{i} - 2 \\mathbf{j} + 3 \\mathbf{k}');

  expect(`${v3.toString({ ijkMode: true })}`).toBe('\\frac{1}{2} ( \\mathbf{i} - 2 \\mathbf{j} )');
  v3.simplify(true);
  expect(`${v3.toString({ ijkMode: true })}`).toBe('\\mathbf{i} - 2 \\mathbf{j}');

  expect(`${v3.plus(v4).toString({ ijkMode: true })}`).toBe('\\frac{3}{2} \\mathbf{i} - 3 \\mathbf{j} + 3 \\mathbf{k}');


  expect(`${v4.toString({ ijkMode: true })}`).toBe('\\frac{1}{2} ( \\mathbf{i} - 2 \\mathbf{j} + 6 \\mathbf{k} )');
  expect(`${v5.toString({ ijkMode: true })}`).toBe('\\mathbf{i} - 2 \\mathbf{j} + 6 \\mathbf{k}');

  v4.simplify(true);
  expect(v4.isEqual(v5)).toBe(true);
})

test('vectors 2', () => {
  expect(`${v2.magnitude()}`).toBe('\\sqrt{10}');
  expect(v2.isParallel(v1)).toBe(false);
  const v2Parallel = new Vector(new Fraction(2, 3), 2, 0, { k: 5 });
  expect(v2.isParallel(v2Parallel)).toBe(true);
  expect(v1.isPerpendicular(v2)).toBe(false);
  const v1Perp = new Vector(1, 0, 2);
  expect(v1.isPerpendicular(v1Perp)).toBe(true);
  expect(v1.angle(v1Perp)).toBe('90^{\\circ}');
  expect(v1.toCoordinates()).toBe('\\left( 2 , 0 , - 1 \\right)');
  expect(v1.toCoordinates('A')).toBe('A\\left( 2 , 0 , - 1 \\right)');
  expect(`${v1}`).toBe('\\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix}');
  expect(`${v1}`).toBe('\\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix}');
  expect(`${v6}`).toBe('- \\frac{1}{3} \\begin{pmatrix} 1 \\\\ 2 \\\\ - 1 \\end{pmatrix}');

  const zeroV = new Vector(0, 0);
  expect(zeroV.magnitude().toString()).toBe('0');
  expect(() => zeroV.isParallel(v1)).toThrow();
  expect(() => zeroV.isPerpendicular(v1)).toThrow();
  expect(() => v1.angle(zeroV)).toThrow();
})


test('angle', () => {
  const x = new Vector(1, 0);
  const fortyFive = new Vector(1, 1);
  const fortyFive2 = new Vector(-1, 0, 1);
  const sixty = new Vector(1, 0, 1);

  const thirty = new Vector(1, 2, -1);
  const thirty2 = thirty.negative();
  const thirty3 = thirty.negative({changeK: true});
  
  expect(x.angle(fortyFive)).toBe('45^{\\circ}');
  expect(x.angle(fortyFive2)).toBe('135^{\\circ}');
  expect(sixty.angle(fortyFive)).toBe('60^{\\circ}');
  expect(fortyFive.angle(fortyFive2)).toBe('120^{\\circ}');
  expect(x.angle(x)).toBe('0^{\\circ}');
  expect(fortyFive.angle(thirty)).toBe('30^{\\circ}');
  expect(fortyFive.angle(thirty2)).toBe('150^{\\circ}');
  expect(fortyFive.angle(thirty3)).toBe('150^{\\circ}');

  const angleV1 = new Vector(-8, 9, -7);
  const angleV2 = new Vector(6, 9, 4);
  const angleV3 = new Vector(6, -9, 4);
  const angleV4 = new Vector(-6, 9, -4);

  expect(angleV1.angle(angleV2)).toBe('88.2^{\\circ}');
  expect(angleV1.angle(angleV3)).toBe('167.8^{\\circ}');
  expect(angleV4.angle(angleV3)).toBe('180^{\\circ}');
})

