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

export class SeedSelectListElement extends HTMLElement {
  static get observedAttributes() {
    return ['seeds'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener('change', this.onChange.bind(this));
  }

  //
  // Events
  //

  onChange() {
    const checkedItem = this.querySelector('input[name="seed"]:checked');
    this.setAttribute('value', checkedItem.value);
    this.dispatchEvent(new CustomEvent('seed:selected', {bubbles: true}));
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

      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'seed');
      radio.setAttribute('value', seed);
      label.appendChild(radio)
      label.appendChild(el);

      this.appendChild(label);
    }
  }
}