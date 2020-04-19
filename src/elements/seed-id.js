import { buildTemplate } from '../helpers';

const template = buildTemplate(`
<template>
  <style>
    :host {
      color: var(--white);
      text-shadow: 1px 1px 0px var(--dark), 2px 2px 0px var(--pink);
    }
  </style>
  <span id="text"></span>
</template>
`);

export class SeedIdElement extends HTMLElement {
  static get observedAttributes() {
    return ['seed', 'variant'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.text = this.shadowRoot.getElementById('text');
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
    const seedText = this.getAttribute('seed');
    if (!seedText) {
      return;
    }

    const variantText = this.getAttribute('variant');
    if (variantText) {
      this.text.textContent = `#${seedText}-${variantText}`;
    } else {
      this.text.textContent = `#${seedText}`;
    }
  }
}