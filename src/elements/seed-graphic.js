import { buildTemplate, seedExtractColours } from '../helpers';

const template = buildTemplate(`
<template>
  <style>
  :host {
    display: block;
  }

  svg {
    width: 100%;
    height: 100%;
  }
  </style>
  <svg width="128px" height="128px" viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <circle id="path-1" cx="64" cy="66" r="50"></circle>
        <filter x="-22.5%" y="-22.5%" width="145.0%" height="145.0%" filterUnits="objectBoundingBox" id="filter-3">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="7.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Seed" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <mask id="mask-2" fill="white">
            <use xlink:href="#path-1"></use>
        </mask>
        <g>
            <use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use>
            <use id="fill" fill="#000000" fill-rule="evenodd" xlink:href="#path-1"></use>
        </g>
        <path id="colour" fill="#FFE1A2" d="M30,75 C36.1859768,98.029249 49.5193101,111.73661 70,116.122083 L21.8197293,129 L-4,32.8779172 L44.1802707,20 C28.5407801,33.6374177 23.8140232,51.970751 30,75 Z" mask="url(#mask-2)"></path>
    </g>
  </svg>
</template>
`);

export class SeedGraphicElement extends HTMLElement {
  
  static get observedAttributes() {
    return ['seed', 'variant'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fill = this.shadowRoot.getElementById('fill');
    this.colour = this.shadowRoot.getElementById('colour');
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

    const colours = seedExtractColours(seedText);
    this.fill.setAttribute('fill', colours.background);
    this.colour.setAttribute('fill', colours.colour);
  }
}