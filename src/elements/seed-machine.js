import { buildTemplate, playSound } from '../helpers';
import { seedComponents } from '../menu/storage';

const template = buildTemplate(`
<template>
  <style>
  * {
    box-sizing: border-box;
  }

  :host {
    display: block;
    height: 100%;
    font-family: 'Nova Square', monospace;
  }

  #wrapper {
    border: 1px solid var(--white);
    padding: 6px;
    height: 100%;
  }

  button {
    border: none;
    background: var(--white);
    color: var(--dark);
    font-size: 18px;
    padding: 6px;
    font-family: 'Nova Square', monospace;
    cursor: pointer;
    outline: none;
  }
  

  #grow-button {
    background: var(--pink);
  }

    #grow-button:hover {
      background: var(--white);
      color: var(--pink);
    }

    #grow-button:disabled {
      background: var(--light-grey);
      cursor: not-allowed;
      color: var(--dark);
    }

  #seed-button {
    background: var(--blue);
  }

  #share-button {
    background: var(--green);
  }

  #burn-button {
    background: var(--red);
  }

  #select-seed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

    #select-seed-header h1 {
      font-size: 16px;
      margin: 0;
    }

    #select-seed seed-item {
      margin: 8px 0;
    }

    #select-seed input {
      display: none;
    }

    #select-seed :checked + seed-item {
      background: var(--pink);
    }

  #select {
    overflow: scroll;
    max-height: 30vw;
  }

  #canvas-area {
    box-sizing: content-box;
    height: 0;
    width: 100%;
    padding-top: 100%; /* 1:1 ratio */
    position: relative;
  }

  #canvas-area button {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  #canvas-area #grower {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  #menu {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 4px;
  }

    #menu[hidden] {
      display: none;
    }
  </style>

  <div id="wrapper">
    <div id="select-seed">
      <div id="select-seed-header">
        <h1>Select</h1>
        <button id="grow-button" disabled>
          Grow
        </button>
      </div>
      <seed-select-list id="select"></seed-select-list>
    </div>

    <div id="canvas-area" hidden>
      <seed-grower id="grower"></seed-grower>
      <button id="burn-button">
        Burn
      </button>
    </div>

    <div id="menu" hidden>
      <seed-item id="seed-item"></seed-item>
      <div>
        <button id="seed-button">
          Collect
        </button>
        <button id="share-button">
          Share
        </button>
      </div>
    </div>
  </div>
</template>
`);

export class SeedMachineElement extends HTMLElement {
  
  static get observedAttributes() {
    return ['seeds'];
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.select = this.shadowRoot.getElementById('select');
    this.selectSeed = this.shadowRoot.getElementById('select-seed');
    this.canvasArea = this.shadowRoot.getElementById('canvas-area');
    this.menu = this.shadowRoot.getElementById('menu');
    this.grower = this.shadowRoot.getElementById('grower');
    this.seedItem = this.shadowRoot.getElementById('seed-item');

    this.growButton = this.shadowRoot.getElementById('grow-button');
    this.seedButton = this.shadowRoot.getElementById('seed-button');
    this.shareButton = this.shadowRoot.getElementById('share-button');
    this.burnButton = this.shadowRoot.getElementById('burn-button');

    this.growButton.addEventListener('click', this.onGrowClicked.bind(this));
    this.seedButton.addEventListener('click', this.onSeedClicked.bind(this));
    this.shareButton.addEventListener('click', this.onShareClicked.bind(this));
    this.burnButton.addEventListener('click', this.onBurnClicked.bind(this));

    this.select.addEventListener('seed:selected', this.onSeedSelected.bind(this)); 
  }

  /**
   * @public
   */
  burn() {
    this.selectSeed.removeAttribute('hidden');
    this.canvasArea.setAttribute('hidden', '');
    this.menu.setAttribute('hidden', '');

    this.grower.setAttribute('seed', '');
    this.removeAttribute('seed');
  }

  //
  // Events
  //

  onSeedSelected() {
    if (this.select.getAttribute('value')) {
      this.growButton.removeAttribute('disabled');
    }
  }

  onGrowClicked() {
    const seed = this.select.getAttribute('value');

    this.setAttribute('seed', seed);

    this.selectSeed.setAttribute('hidden', '');
    this.canvasArea.removeAttribute('hidden');
    this.menu.removeAttribute('hidden');

    this.grower.setAttribute('seed', seed);

    const components = seedComponents(seed);
    this.seedItem.setAttribute('seed', components.seed);
    if (components.variant) {
      this.seedItem.setAttribute('variant', components.variant);
    }

    this.dispatchEvent(new CustomEvent('seed:grown', {bubbles: true, detail: {seed}}))
  }

  onSeedClicked() {
    const seed = this.select.getAttribute('value');
    
    this.burn();

    this.dispatchEvent(new CustomEvent('seed:collected', {bubbles: true, detail: {seed}}))
  }

  onShareClicked() {

  }

  onBurnClicked() {
    this.burn();

    playSound('bad');
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
    this.select.setAttribute('seeds', this.getAttribute('seeds'));
  }
}