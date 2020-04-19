import { buildTemplate } from '../helpers';
import { seedComponents } from '../menu/storage';

const template = buildTemplate(`
<template>
  <style>
    :host {
      display: block;
    }
  </style>
  <slot></slot>
</template>
`);

export class SeedListElement extends HTMLElement {
  static get observedAttributes() {
    return ['seeds'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  //
  // Lifecycle
  //

  connectedCallback() {
    this.update();
  }

  /**
   * 
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.update();
  }

  //
  // Helpers
  //
  update() {
    this.innerHTML = '';

    const seeds = this.getAttribute('seeds');
    if (!seeds) {
      return;
    }

    const seedList = seeds.split(' ');
    seedList.sort();

    for (const seed of seedList) {
      const components = seedComponents(seed);
      const el = document.createElement('seed-item');
      el.setAttribute('seed', components.seed);
      if (components.variant) {
        el.setAttribute('variant', components.variant);
      }
      this.appendChild(el);
    }
  }
}