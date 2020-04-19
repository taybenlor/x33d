import { getSeeds, removeSeed, addSeed, seedComponents } from "./storage";
import { generateShortId, mutate, breed, playSound } from "../helpers";

const breedButton = document.getElementById('breed-button');
const newSeedModal = document.getElementById('new-seed');
const newSeedCollect = newSeedModal.querySelector('button');

export function loadMachine() {
  updateSeedList();
  window.addEventListener('seed:grown', onSeedGrown);
  window.addEventListener('seed:collected', onSeedCollected);

  breedButton.addEventListener('click', onBreedClicked);
  newSeedCollect.addEventListener('click', onCloseModal);
}

function updateSeedList() {
  const seeds = getSeeds();

  const list = document.getElementById('seed-list');
  list.setAttribute('seeds', seeds.join(' '));

  const leftMachine = document.getElementById('left-seed-machine');
  leftMachine.setAttribute('seeds', seeds.join(' '));
  
  const rightMachine = document.getElementById('right-seed-machine');
  rightMachine.setAttribute('seeds', seeds.join(' '));
}

/**
 * 
 * @param {CustomEvent} event 
 */
function onSeedGrown(event) {
  const seed = event.detail.seed;
  removeSeed(seed);
  updateSeedList();

  playSound('button');
}

/**
 * 
 * @param {CustomEvent} event 
 */
function onSeedCollected(event) {
  const seed = seedComponents(event.detail.seed).seed;
  const numSeeds = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < numSeeds; i++) {
    const variant = generateShortId().slice(0, 2);
    const mutatedSeed = mutate(seed); // Add small mutations
    addSeed(`${mutatedSeed}-${variant}`);
  }
  updateSeedList();

  playSound('button');
}

/**
 * 
 * @param {Event} event 
 */
function onBreedClicked(event) {
  playSound('grow');

  const leftMachine = document.getElementById('left-seed-machine');
  const rightMachine = document.getElementById('right-seed-machine');
  const leftSeed = leftMachine.getAttribute('seed');
  const rightSeed = rightMachine.getAttribute('seed');

  const newSeed = breed(leftSeed, rightSeed);
  addSeed(newSeed);

  leftMachine.burn();
  rightMachine.burn();
  updateSeedList();

  const seedDisplay = newSeedModal.querySelector('seed-display');
  seedDisplay.setAttribute('seed', newSeed);

  const oldSeedLeft = document.getElementById('new-seed-left');
  oldSeedLeft.setAttribute('seed', leftSeed);
  const oldSeedRight = document.getElementById('new-seed-right');
  oldSeedRight.setAttribute('seed', rightSeed);

  newSeedModal.removeAttribute('hidden');
}

function onCloseModal() {
  newSeedModal.setAttribute('hidden', '');
}