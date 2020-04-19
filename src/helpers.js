import { seedComponents } from "./menu/storage";

/**
 * 
 * @param {!Array<T>} array
 * @param {function():number=} rng
 * @returns {T}
 * @template T
 */
export function randomChoice(array, rng) {
  rng = rng || Math.random;
  const choice = Math.floor(array.length * rng());
  return array[choice];
}

const ID_SYMBOLS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * @param {function():number=} rng
 * @returns {string}
 */
export function generateShortId(rng) {
  // By the birthday paradox, if we have 6 symbols = 36**6 combinations
  // Then there is a 0.02% chance of a conflict if there are 1000 selected
  // There is a 2% chance if 10,000 are selected - lets just assume thats fine
  // Hopefully no more than 10,000 people play my game, lol

  let id = '';
  for (let i = 0; i < 6; i++) {
    id += randomChoice(ID_SYMBOLS, rng);
  }

  return id;
}


/**
 * Finds all elements with attributes data-fill of this name.
 * Then puts this value in their textContent.
 *
 * @param {string} name 
 * @param {string} value 
 */
export function fillText(name, value) {
  const spaces = document.querySelectorAll(`[data-fill="${name}"]`);
  for (const element of spaces) {
    element.textContent = value;
  }
}

export function buildTemplate(text) {
  const doc = (new DOMParser()).parseFromString(text, 'text/html');
  return doc.querySelector('template');
}

const NUM_TO_COLOUR = {
  '0': '--pink',
  '1': '--blue',
  '2': '--green',
  '3': '--yellow',
  '4': '--red',
  '5': '--purple',
  '6': '--lime',
  '7': '--banana',
  '8': '--tomato',
  '9': '--grape',
  '10': '--olive',
  '11': '--light-grey',
  '12': '--dark-grey',
  '13': '--dark-pink',
  '14': '--dark-blue',
  '15': '--dark-green',
  '16': '--dark-yellow',
  '17': '--dark-grape',
};

/**
 * Extracts colours from the first digit
 * 
 * @param {string} seed 
 * @returns {{colour: string, background: string}}
 */
export function seedExtractColours(seed) {
  const value = parseInt(seed[0], 36);
  const backgroundVariable = (value % 2) == 0 ? '--dark' : '--white';
  const index = Math.floor(value/2);
  const colourVariable = NUM_TO_COLOUR[index.toString()];
  const computedStyle = getComputedStyle(document.documentElement);
  const colour = computedStyle.getPropertyValue(colourVariable);
  const background = computedStyle.getPropertyValue(backgroundVariable)
  return {colour, background};
}


/**
 * Extracts chances from the second digit
 * 
 * @param {string} seed 
 * @returns {{newChance: number, finishChance: number}}
 */
export function seedExtractChances(seed) {
  const value = parseInt(seed[1], 36);
  let split = value.toString(6); // split that base 36 number into two digits
  if (split.length < 2) {
    split = '0' + split;
  }
  const newChance = (parseInt(split[0], 6)/7) + (1/7); // Range(1/7, 6/7)
  const finishChance = (parseInt(split[1], 6)/7) + (1/7); // Range(1/7, 6/7)
  return {newChance, finishChance};
}


/**
 * Extracts shape from the third digit
 * Returns an array of 6 numbers
 * These are added on to (x, z) of each point of a triangle
 * @param {string} seed 
 * @returns {!Array<number>}
 */
export function seedExtractShape(seed) {
  const value = parseInt(seed[2], 36);
  const numbers = value.toString(2).split('');
  while (numbers.length < 6) {
    numbers.push('0');
  }
  return numbers.map(digit => parseInt(digit, 10)/2); // 0, 1 => 0, 0.5
}

/**
 * 
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
export function breed(leftSeed, rightSeed) {
  leftSeed = seedComponents(leftSeed).seed;
  rightSeed = seedComponents(rightSeed).seed;

  // Really mutate the heck out of breeding
  return mutate(mutate(mutate(combine(leftSeed, rightSeed))));
}

/**
 * Combines two seeds
 * 
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
export function combine(leftSeed, rightSeed) {
  // Combine Colours
  const colours = combineColours(leftSeed, rightSeed);

  // Combine Chances
  const chances = combineChances(leftSeed, rightSeed)
  
  // Combine Shapes
  const shapes = combineShapes(leftSeed, rightSeed)

  // Combine Instructions
  const instructions = combineInstructions(leftSeed, rightSeed);

  return colours + chances + shapes + instructions;
}

/**
 * Takes two seeds and combines only their colour component
 * returns only the colour component
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
function combineColours(leftSeed, rightSeed) {
  const leftValue = parseInt(leftSeed[0], 36);
  const leftBackground = leftValue % 2;
  const leftColour = Math.floor(leftValue/2);
  const rightValue = parseInt(rightSeed[0], 36);
  const rightBackground = rightValue % 2;
  const rightColour = Math.floor(rightValue/2);
  const newColour = randomChoice([leftColour, rightColour]);
  const newBackground = randomChoice([leftBackground, rightBackground]);
  
  const newValue = (newColour * 2) + newBackground;
  return newValue.toString(36).toUpperCase();
}

/**
 * Takes two seeds and combines only their chances component
 * returns only the chances component
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
function combineChances(leftSeed, rightSeed) {
  // Creates a string of base 6 (4 digits) from our base 36 (2 digit) combination
  const parts = parseInt(leftSeed[1] + rightSeed[1], 36).toString(6);
  const partsArray = parts.split(''); // Splits that into an array of maximum 4 items

  // Make sure we include the 0s as appropriate
  while (partsArray.length < 4) {
    partsArray.push('0');
  }

  const first = randomChoice(partsArray);
  const second = randomChoice(partsArray);

  const combined = parseInt(first + second, 6);
  return combined.toString(36).toUpperCase();
}

/**
 * Takes two seeds and combines only their chances component
 * returns only the shapes component
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
function combineShapes(leftSeed, rightSeed) {
  return randomChoice([leftSeed[2], rightSeed[2]]);
}

/**
 * Takes two seeds and combines only their instructions component
 * returns only the instructions component
 * @param {string} leftSeed 
 * @param {string} rightSeed 
 * @returns {string}
 */
function combineInstructions(leftSeed, rightSeed) {
  const firstInstruction = randomChoice([leftSeed[3], rightSeed[3]]);
  const secondInstruction = randomChoice([leftSeed[4], rightSeed[4]]);
  const thirdInstruction = randomChoice([leftSeed[5], rightSeed[5]]);

  return firstInstruction + secondInstruction + thirdInstruction;
}

export function mutate(seed) {
  seed = seedComponents(seed).seed;
  if (Math.random() < 0.5) {
    // No mutations
    return seed;
  }

  const seedArray = seed.split('');
  const index = Math.floor(Math.random() * seedArray.length);
  const operation = randomChoice(['increment', 'decrement', 'switch', 'replace']);

  if (operation === 'increment') {
    const value = parseInt(seedArray[index], 36) + 1;
    const asString = value.toString(36).toUpperCase();
    seedArray[index] = asString[asString.length - 1]; // Make sure to only grab the last digit
  } else if (operation === 'decrement') {
    const value = parseInt(seedArray[index], 36) - 1;
    const asString = (value === -1 ? 35 : value).toString(36).toUpperCase();
    seedArray[index] = asString; // Turn -1 into 35
  } else if (operation === 'switch') {
    const secondIndex = Math.floor(Math.random() * seedArray.length);
    const firstString = seedArray[index];
    const secondString = seedArray[secondIndex];
    seedArray[index] = secondString;
    seedArray[secondIndex] = firstString;
  } else if (operation === 'replace') {
    const value = Math.floor(Math.random() * 36);
    const asString = value.toString(36).toUpperCase();
    seedArray[index] = asString;
  }

  return seedArray.join('');
}

const buttonEls = [
  document.getElementById('note_1'),
  document.getElementById('note_2'),
];

const badEls = [
  document.getElementById('bad'),
  document.getElementById('brr'),
];

const growEls = [
  document.getElementById('grow_1'),
  document.getElementById('grow_2'),
  document.getElementById('grow_3'),
  document.getElementById('grow_4'),
];

for (const el of buttonEls.concat(badEls).concat(growEls)) {
  el.volume = 0.5;
}
export function playSound(name) {
  if (name === 'button') {
    randomChoice(buttonEls).play();
  } else if (name === 'bad') {
    randomChoice(badEls).play();
  } else if (name === 'grow') {
    randomChoice(growEls).play();
  }
}