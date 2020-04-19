import { buildTemplate } from '../helpers';

const template = buildTemplate(`
<template>
  <style>
    :host {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
    }

    seed-graphic {
      width: 100%;
    }

    seed-id {
      font-size: 18px;
    }
  </style>
  <seed-graphic id="graphic"></seed-graphic>
  <seed-id id="ident"></seed-id>
</template>
`);

export class SeedDisplayElement extends HTMLElement {
  
  static get observedAttributes() {
    return ['seed', 'variant'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.graphic = this.shadowRoot.getElementById('graphic');
    this.ident = this.shadowRoot.getElementById('ident');
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
    const seedText = this.getAttribute('seed') || '';
    this.graphic.setAttribute('seed', seedText);
    this.ident.setAttribute('seed', seedText);

    const variantText = this.getAttribute('variant');
    if (variantText) {
      this.graphic.setAttribute('variant', variantText);
      this.ident.setAttribute('variant', variantText)
    }

    // TODO: We also should create the "decoration" elements
    // These can be encoded in the next 5 digits
    // Angle, Distance, Symbol, Color => all in one char, so 5 possible symbols
  }
}