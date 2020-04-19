import { generateSeeds, getSeeds, seedComponents } from "./storage";

export function loadHomepage() {
  generateSeeds();
  const seeds = getSeeds();

  const seedZone = document.getElementById('seed-zone');
  for (const seed of seeds) {
    const components = seedComponents(seed);
    const displayEl = document.createElement('seed-display');
    displayEl.setAttribute('seed', components.seed);
    if (components.variant) {
      displayEl.setAttribute('variant', components.variant);
    }
    seedZone.appendChild(displayEl)
  }
}