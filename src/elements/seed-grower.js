import { buildTemplate } from '../helpers';
import { Grower } from '../render/grower';

const template = buildTemplate(`
<template>
  <style>
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    #canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
  <canvas id="canvas"></canvas>
</template>
`);

export class SeedGrowerElement extends HTMLElement {
  static get observedAttributes() {
    return ['seed'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    /** @type {!HTMLCanvasElement} */
    this.canvas = this.shadowRoot.getElementById('canvas');
    this.grower = null;
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
    if (this.grower) {
      // Destroy and replace canvas
      // Cleans everything up
      this.grower.destroy();
      this.grower = null;
      this.shadowRoot.removeChild(this.canvas);
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('id', 'canvas');
      this.shadowRoot.appendChild(this.canvas);
    }

    const seed = this.getAttribute('seed');
    if (!seed) {
      return;
    }

    this.grower = new Grower(this.canvas, seed);
  }
}