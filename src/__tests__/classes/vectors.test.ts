import { Vector, Fraction, Line, Plane } from '../../index';

const v1 = new Vector(2, 0, -1);
const v2 = new Vector(1, 3);

const v3 = new Vector(new Fraction(1, 2), -1);
const v4 = new Vector(new Fraction(1, 2), -1, 3, {simplify: true});
const v5 = new Vector(new Fraction(1, 2), -1, 3, { stretchable: true });

const v6 = new Vector(1, 2, -1, { k: new Fraction(-1, 3) });

const l1 = new Line(v1, v2);
const l1Parallel = new Line(v5, v2);
//const l1Intersect = new Line(new Vector(3, 3, -1), new Vector(5, -1, 11), {twoPointsMode: true});
const l2 = new Line(v3, v4);
const l3 = new Line(v5, v6);


test('vectors 1', () => {
  expect(`${v1.k}`).toBe('1');
  expect(`${v1.x}`).toBe('2');
  expect(`${v1.y}`).toBe('0');
  expect(`${v1.z}`).toBe('- 1');
  expect(`${v1.plus(v2).toString({ ijkMode: true })}`).toBe('3 \\mathbf{i} + 3 \\mathbf{j} - \\mathbf{k}');
  expect(`${v1.minus(v2).toString({ ijkMode: true })}`).toBe('\\mathbf{i} - 3 \\mathbf{j} - \\mathbf{k}');
  expect(`${v1.multiply(2).toString({ ijkMode: true })}`).toBe('4 \\mathbf{i} - 2 \\mathbf{k}');
  expect(`${v1.multiply(2, { changeK: true }).toString({ ijkMode: true })}`).toBe('2 ( 2 \\mathbf{i} - \\mathbf{k} )');
  expect(`${v1.dot(v2)}`).toBe('2');
  expect(`${v1.cross(v2).toString({ ijkMode: true })}`).toBe('3 \\mathbf{i} - \\mathbf{j} + 6 \\mathbf{k}');

  expect(`${v3.toString({ ijkMode: true })}`).toBe('\\frac{1}{2} \\mathbf{i} - \\mathbf{j}');
  v3.simplify();
  expect(`${v3.toString({ ijkMode: true })}`).toBe('\\frac{1}{2} ( \\mathbf{i} - 2 \\mathbf{j} )');

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
  expect(v2.isParallelTo(v1)).toBe(false);
  const v2Parallel = new Vector(new Fraction(2, 3), 2, 0, { k: 5 });
  expect(v2.isParallelTo(v2Parallel)).toBe(true);
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
  expect(() => zeroV.isParallelTo(v1)).toThrow();
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
  expect(x.angle(fortyFive, true)).toBe('45^{\\circ}');
  expect(x.angle(fortyFive2)).toBe('135^{\\circ}');
  expect(sixty.angle(fortyFive)).toBe('60^{\\circ}');
  expect(sixty.angle(fortyFive, true)).toBe('30^{\\circ}');
  expect(fortyFive.angle(fortyFive2)).toBe('120^{\\circ}');
  expect(x.angle(x)).toBe('0^{\\circ}');
  expect(x.angle(x, true)).toBe('90^{\\circ}');
  expect(fortyFive.angle(thirty)).toBe('30^{\\circ}');
  expect(fortyFive.angle(thirty, true)).toBe('60^{\\circ}');
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

test('line', () => {
  expect(`${Line.X}`).toBe('\\mathbf{r} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix} + \\lambda \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\end{pmatrix}')
  expect(`${Line.Y}`).toBe('\\mathbf{r} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix} + \\lambda \\begin{pmatrix} 0 \\\\ 1 \\\\ 0 \\end{pmatrix}')
  expect(`${Line.Z}`).toBe('\\mathbf{r} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix} + \\lambda \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\end{pmatrix}')

  expect(`${v2.magnitude()}`).toBe('\\sqrt{10}');
  expect(l1.isParallelTo(l2)).toBe(false);
  expect(l1.isParallelTo(l1Parallel)).toBe(true);
  expect(l1.isParallelTo(new Vector(-2, -6, 0, { k: 5 }))).toBe(true);
  expect(`${l2.point(0).toCoordinates()}`).toBe('\\left( \\frac{1}{2} , - 1 , 0 \\right)');
  expect(`${l2.point(new Fraction(1, 2))}`).toBe('\\begin{pmatrix} 1 \\\\ - 2 \\\\ 3 \\end{pmatrix}');
  expect(l2.angle(l3)).toBe('55.0^{\\circ}');
  expect(l2.angle(new Vector(1, 2, -1))).toBe('125.0^{\\circ}');
  const l3Clone = new Line(v5, new Vector(1, 2, -1));
  expect(l2.angle(l3Clone)).toBe('55.0^{\\circ}');
  expect(`${l1.distanceTo(new Vector(new Fraction(1,2), -1, 0))}`).toBe('\\frac{1}{20} \\sqrt{890}');
  expect(`${l1.distanceTo(l1Parallel)}`).toBe('\\frac{1}{10} \\sqrt{4910}');

  const l1Clone = new Line(v1, new Vector(4, 6, -1), {twoPointsMode: true});
  expect(`${l1Clone}`).toBe('\\mathbf{r} = \\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix} + \\lambda \\begin{pmatrix} 1 \\\\ 3 \\\\ 0 \\end{pmatrix}');
  expect(`${l1}`).toBe('\\mathbf{r} = \\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix} + \\lambda \\begin{pmatrix} 1 \\\\ 3 \\\\ 0 \\end{pmatrix}');
  expect(`${l1.toString({ lambda: 's' })}`).toBe('\\mathbf{r} = \\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix} + s \\begin{pmatrix} 1 \\\\ 3 \\\\ 0 \\end{pmatrix}');
  expect(`${l1.toString({ ijkMode: true })}`).toBe('\\mathbf{r} = \\left( 2 \\mathbf{i} - \\mathbf{k} \\right) + \\lambda \\left( \\mathbf{i} + 3 \\mathbf{j} \\right)');
  expect(`${l1.toString({ mode: 'combined' })}`).toBe('\\begin{pmatrix} 2 + \\lambda \\\\ 3 \\lambda \\\\ - 1 \\end{pmatrix}');
  
  const minus123 = new Vector(-1, 2, 3);
  const z = new Vector(0, 0, 1);
  const y = new Vector(0, -1);
  const x = new Vector(2, 0);
  const yz = new Vector(0, 1, 2);
  const xz = new Vector(new Fraction(-1, 2), 0, new Fraction(3, 2));
  const xy = new Vector(3, -4);
  const xyz = new Vector(1, -1, 2);
  
  const lz = new Line(minus123, z);
  const ly = new Line(minus123, y);
  const lx = new Line(minus123, x);
  const lxy = new Line(minus123, xy);
  const lxz = new Line(minus123, xz);
  const lyz = new Line(minus123, yz);
  const lxyz = new Line(minus123, xyz);

  expect(`${lz.toString({ mode: 'cartesian' })}`).toBe('x = - 1, y = 2, z \\in \\mathbb{R}');
  expect(`${ly.toString({ mode: 'cartesian' })}`).toBe('x = - 1, z = 3, y \\in \\mathbb{R}');
  expect(`${lx.toString({ mode: 'cartesian' })}`).toBe('y = 2, z = 3, x \\in \\mathbb{R}');
  expect(`${lxy.toString({ mode: 'cartesian' })}`).toBe('\\frac{ x + 1 }{ 3 } = \\frac{ y - 2 }{ - 4 }, z = 3');
  expect(`${lxz.toString({ mode: 'cartesian' })}`).toBe('\\frac{ x + 1 }{ - 1 } = \\frac{ z - 3 }{ 3 }, y = 2');
  expect(`${lyz.toString({ mode: 'cartesian' })}`).toBe('y - 2 = \\frac{ z - 3 }{ 2 }, x = - 1');
  expect(`${lxyz.toString({ mode: 'cartesian' })}`).toBe('x + 1 = \\frac{ y - 2 }{ - 1 } = \\frac{ z - 3 }{ 2 }');

  
  const zeroV = new Vector(0, 0);
  expect(() => new Line(v1, zeroV)).toThrow();
  expect(() => new Line(zeroV, v1)).not.toThrow();
  expect(() => l1.distanceTo(l2)).toThrow();
})

const p1 = new Plane(v1, { d: 2 });
const p2 = new Plane(v2, { mode: 'pt', point: v1 });
const p3 = new Plane(v3, { mode: '2pt', point: v1, v2: v2 });
const p4 = new Plane(v1, { mode: '3pt', point: v2, v2: v5 });
const p5 = new Plane(v1, { mode: '2d', v2: v2 });

test('plane', () => {
  expect(`${p1}`).toBe('\\mathbf{r} \\cdot \\begin{pmatrix} 2 \\\\ 0 \\\\ - 1 \\end{pmatrix} = 2');
  expect(`${p2.toString({cartesianMode: true})}`).toBe('x + 3 y = 2');
  expect(`${p3.toString({ ijkMode: true })}`).toBe('\\mathbf{r} \\cdot \\left( 2 \\mathbf{i} + \\mathbf{j} - \\mathbf{k} \\right) = 5');

  expect(p1.contains(v2)).toBe(true);
  expect(p1.contains(v5)).toBe(false);
  
  expect(p4.isParallelTo(p1)).toBe(false);
  expect(p5.isParallelTo(l1)).toBe(true);
  expect(p4.isParallelTo(Vector.I)).toBe(false);

  expect(`${p1.point().toCoordinates()}`).toBe('\\left( 1 , 0 , 0 \\right)');
  expect(`${Plane.XZ.point().toCoordinates()}`).toBe('\\left( 0 , 0 , 0 \\right)');
  expect(`${new Plane(new Vector(0, new Fraction(1,2), 0), {d: new Fraction(1,3)}).point().toCoordinates()}`).toBe('\\left( 0 , \\frac{2}{3} , 0 \\right)');
  expect(`${new Plane(new Vector(0, 0, -3), {d: 1}).point().toCoordinates()}`).toBe('\\left( 0 , 0 , - \\frac{1}{3} \\right)');

  expect(p1.angle(p2)).toBe('73.6^{\\circ}');
  expect(p1.angle(l1)).toBe('16.4^{\\circ}');
  expect(p1.angle(Vector.J)).toBe('0^{\\circ}');

  expect(`${p1.distanceTo(p2)}`).toBe('0');
  const p1Parallel = new Plane(v1);
  expect(`${p1.distanceTo(p1Parallel)}`).toBe('\\frac{2}{5} \\sqrt{5}');
  expect(`${p1.distanceTo(Vector.ZERO)}`).toBe('\\frac{2}{5} \\sqrt{5}');
  expect(`${p1.distanceTo(l1)}`).toBe('0');
  const lineParallelToP5 = new Line(Vector.I, v2);
  expect(`${p5.distanceTo(lineParallelToP5)}`).toBe('\\frac{3}{46} \\sqrt{46}');

  
  expect(() => new Plane(v1)).not.toThrow();
  expect(() => new Plane(v1,{mode: 'pt'})).not.toThrow();
  expect(() => new Plane(v1,{mode: '2pt'})).toThrow();
  expect(() => new Plane(v1,{mode: '2pt', point: v2, v2: v2})).toThrow();
  expect(() => new Plane(v1,{mode: '3pt', point: v2, v2: v2})).toThrow();
  expect(() => new Plane(v1,{mode: '3pt'})).toThrow();
  expect(() => new Plane(v1,{mode: '2d'})).toThrow();
  expect(() => new Plane(v1,{mode: '2d', v2: v1})).toThrow();
  expect(() => new Plane(Vector.ZERO)).toThrow();
})

test('vector extra', () => {
  const negativeVec = new Vector(-2, -4, -6);
  negativeVec.simplify();
  expect(`${negativeVec}`).toBe('- 2 \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}');

  const ratioVec3 = new Vector(3, 6, -9);
  const ratioVec1 = new Vector(1, 2, -3);

  expect(`${Vector.ratioTheorem(Vector.ZERO, ratioVec3, 1, 2)}`).toBe(`${ratioVec1}`);
  expect(`${Vector.ratioTheorem(Vector.ZERO, ratioVec1, 1, 2, { extendedMode: true })}`).toBe(`${ratioVec3}`);
});