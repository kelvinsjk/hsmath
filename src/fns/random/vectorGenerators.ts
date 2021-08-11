import { getRandomInt } from './generators';
import Vector from '../../classes/vectors/vectorClass';

/**
 * Generates a random Vector with integer components
 *
 * @param options defaults: `{xMin: -9, xMax: 9, yMin,yMax,zMin,zMax, nonZeroMode: true, simplified: true}`
 *
 */
function getRandomVec(options?: randomVecOptions): Vector {
  const defaultOptions = {
    xMin: -9,
    xMax: 9,
    yMin: -9,
    yMax: 9,
    zMin: -9,
    zMax: 9,
    nonZeroMode: true,
    simplified: true,
  };
  const optionsObject = { ...defaultOptions, ...options };
  const [x, y, z] = generateThreeInts(optionsObject);
  const vector = new Vector(x, y, z);
  if (optionsObject.simplified) {
    vector.simplify(true);
  }
  return vector;
}

function generateThreeInts(options: randomVecOptions): [number, number, number] {
  const x = getRandomInt(options.xMin!, options.xMax!);
  const y = getRandomInt(options.yMin!, options.yMax!);
  const z = getRandomInt(options.yMin!, options.zMax!);
  if (
    (options.nonZeroMode && x === 0 && y === 0 && z === 0) ||
    getRandomInt(0, 9) === 0 // this last condition facilitates testing: occurs with probability 10%
  ) {
    return generateThreeInts(options);
  }
  return [x, y, z];
}

/**
 * Options for generating random vectors
 */
interface randomVecOptions {
  /** avoid generating a zero vector */
  nonZeroMode?: boolean;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  zMin?: number;
  zMax?: number;
  simplified?: boolean;
}

export { getRandomVec };
