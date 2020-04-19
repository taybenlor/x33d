import {generateShortId} from '../helpers';
import seedrandom from 'seedrandom';

/**
 * @returns {boolean}
 */
export function isNewUser() {
  return !window.localStorage.getItem('user_id');
}

/**
 * @returns {string}
 */
export function getOrCreateUserId() {
  let userId = window.localStorage.getItem('user_id');
  if (userId) {
    return userId;
  }

  userId = 'U' + generateShortId();
  window.localStorage.setItem('user_id', userId);
  return userId;
}

/**
 * Returns the user's seed ids
 * @returns {!Array<string>}
 */
export function getSeeds() {
  return JSON.parse(window.localStorage.getItem('seeds') || '[]');
}

/**
 * Removes a seed
 * 
 * @param {string} seed
 */
export function removeSeed(seed) {
  const seeds = getSeeds().filter(value => value != seed);
  window.localStorage.setItem('seeds', JSON.stringify(seeds));
}

/**
 * Removes a seed
 * 
 * @param {string} seed
 */
export function addSeed(seed) {
  const seeds = getSeeds();
  seeds.push(seed);
  window.localStorage.setItem('seeds', JSON.stringify(seeds));
}

/**
 * Returns the seeds components
 * @returns {{seed:string, variant:string|undefined}}
 */
export function seedComponents(seedString) {
  seedString = seedString.replace('#', '');
  const components = seedString.split('-');

  if (components.length === 1) {
    return {
      seed: components[0]
    };
  } else {
    return {
      seed: components[0],
      variant: components[1]
    }
  }
}

/**
 * Generates the appropriate seeds for the user
 */
export function generateSeeds() {
  const userId = getOrCreateUserId();
  const rng = seedrandom(userId);

  const seeds = [generateShortId(rng), generateShortId(rng), generateShortId(rng)];
  window.localStorage.setItem('seeds', JSON.stringify(seeds))
}
