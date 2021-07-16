import Fraction from '../../classes/fractionClass';

/**
 * Generates a random integer between `min` and `max`
 * 
 * @param options we can specify an array of numbers to avoid
 * 
 * warning: we do not check if the avoid array prevents us from returning a value (leading to an infinite loop)
 */
function getRandomInt(min: number, max: number, options?: randomIntOptions): number {
  min = Math.ceil(min); // in case min is non-integer
  max = Math.floor(max); // in case max is non-integer
  let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  if (options !== undefined && options.avoid.length !== 0) {
    while (options.avoid.includes(randomInt)) {
      randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  return randomInt;
}

/**
 * Generates a random Fraction
 * 
 * @param options we can specify minNum (minimum numerator), maxNum, minDen and maxDen. (default -9 to 9), and whether to avoid Zero
 */
function getRandomFrac(options?: randomFracOptions): Fraction {
  const defaultOptions = {
    minNum: -9,
    maxNum: 9,
    minDen: -9,
    maxDen: 9,
    avoid: []
  };
  const optionsObject = { ...defaultOptions, ...options };
  let den = getRandomInt(optionsObject.minDen, optionsObject.maxDen, { avoid: [0] });
  let num = getRandomInt(optionsObject.minNum, optionsObject.maxNum);
  let randomFrac = new Fraction(num, den);
  let checkAvoid = (optionsObject.avoid.length > 0); // if avoid is non-empty: have to check if generated fraction is inside
  while (checkAvoid) {
    for (let i = 0; i < optionsObject.avoid.length; i++){
      const avoidFrac = optionsObject.avoid[i];
      if (randomFrac.isEqual(avoidFrac)) {
        den = getRandomInt(optionsObject.minDen, optionsObject.maxDen, { avoid: [0] });
        num = getRandomInt(optionsObject.minNum, optionsObject.maxNum);
        randomFrac = new Fraction(num, den);
        break;
      }
      if (i === optionsObject.avoid.length-1) {
        checkAvoid = false;
      }
    }
  }
  return randomFrac;
}

/**
 * Options for generating random numbers
 */
interface randomIntOptions {
  /** will not return numbers in the `avoid` array */
  avoid: number[]
}

/**
 * Options for generating random numbers
 */
interface randomFracOptions {
  /** will not return numbers in the `avoid` array */
  minNum?: number,
  maxNum?: number,
  minDen?: number,
  maxDen?: number,
  avoid?: (number|Fraction)[]
}

export {getRandomInt, getRandomFrac}