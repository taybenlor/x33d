import {Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, AmbientLight, DirectionalLight, MeshLambertMaterial} from 'three';

export class Manager {
  /**
   * @param {!WebGLRenderer} renderer 
   * @param {!Scene} scene 
   * @param {!PerspectiveCamera} camera 
   */
  constructor(renderer, scene, camera) {
    /** @const {!WebGLRenderer} */
    this.renderer = renderer;
    /** @const {!Scene} */
    this.scene = scene;
    /** @const {!PerspectiveCamera} */
    this.camera = camera;

    /** @const {!Array<!Object>} */
    this.updaters = [];

    /** @type {DOMHighResTimeStamp} */
    this.lastUpdate = performance.now();

    this.boundUpdate = this.update.bind(this);
    requestAnimationFrame(this.boundUpdate);
  }

  /**
   * @param {!Object} fn
   */
  addUpdater(fn) {
    this.updaters.push(fn);
  }

  /**
   * @param {DOMHighResTimeStamp} now
   */
  update(now) {
    requestAnimationFrame(this.boundUpdate);
    const delta = (now - this.lastUpdate)/1000; // convert to seconds
    this.lastUpdate = now;

    for (const updater of this.updaters) {
      updater(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}