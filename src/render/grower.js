import * as THREE from 'three';

import {Plant} from './plant';
import {Manager} from './manager';
import {seedExtractColours} from '../helpers';

export class Grower {
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {string} seed 
   */
  constructor(canvas, seed) {
    const backgroundString = seedExtractColours(seed).background;
    let backgroundInt = 0x02161D;
    if (backgroundString.includes('ff') || backgroundString.includes('FF') ) {
      backgroundInt = 0xffffff;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundInt); // default is white

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const aspect = width/height;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.width = 1024;
    renderer.shadowMap.height = 1024;

    const plant = new Plant(seed);
    scene.add(plant);

    // Global illumination
    const light = new THREE.AmbientLight(0xA0A0A0); // mid white light
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.castShadow = true;
    directionalLight.position.set(3, 3, 0);
    scene.add(directionalLight);

    // Dumb cube for debug
    // var geometry = new THREE.BoxGeometry();
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    const manager = new Manager(renderer, scene, camera);
    manager.addUpdater(plant.update.bind(plant));
  }

  destroy() {
    // TODO: Actually destroy this grower.
  }
}