import { Color, Object3D, Geometry, MeshLambertMaterial, DoubleSide, Mesh, Face3, Vector3, Triangle } from 'three';
import seedrandom from 'seedrandom';

import { PlantGrowth } from './plant-growth';
import { seedExtractColours, seedExtractChances, seedExtractShape } from '../helpers';

// Possible Instructions
// Grow by Unit - Grow all growths by this unit
// Change hue by Unit - Change all new growth hues by this unit
// Change sat and light by Unit - Change all new growth saturation and lightness by this unit
// Set hue to Unit - Change all new growth hues to this unit
// Set sat and light - Change all new growth sat and light to this unit
// Move growth by Vector - Shift all new growth normals by this vector

// First character encodes Start Colour and Black/White background
// Second character encodes New Growth Chance and Growth Finished Chance
// Third character encodes Base Triangle Shape

const INSTRUCTIONS = {
  '0': 'grow_1',
  '1': 'grow_2',
  '2': 'grow_3',
  '3': 'grow_4',
  '4': 'grow_5',
  '5': 'new_growth',
  '6': 'grow_1',
  '7': 'grow_1',
  '8': 'grow_1',
  '9': 'grow_1',
  'A': 'grow_1',
  'B': 'grow_1',
  'C': 'grow_1',
  'D': 'grow_1',
  'E': 'grow_1',
  'F': 'grow_1',
  'G': 'grow_1',
  'H': 'grow_1',
  'I': 'grow_1',
  'J': 'grow_1',
  'K': 'grow_1',
  'L': 'grow_1',
  'M': 'grow_1',
  'N': 'grow_1',
  'O': 'grow_1',
  'P': 'grow_1',
  'Q': 'grow_1',
  'R': 'grow_1',
  'S': 'grow_1',
  'T': 'grow_1',
  'U': 'grow_1',
  'V': 'grow_1',
  'W': 'grow_1',
  'X': 'grow_1',
  'Y': 'grow_1',
  'Z': 'grow_1',
}

export class Plant extends Object3D {
  /**
   * @param {string} seed
   */
  constructor(seed) {
    super();

    // TODO: Use the RNG in a way that every person will get a consistent result
    this.rng = seedrandom(seed);

    /** @const {string} */
    this.seed = seed;

    const colourString = seedExtractColours(seed).colour;
    const colourInt = parseInt(colourString.split('#')[1], 16);  // TODO: Using slice(1) breaks - maybe compiler?

    this.colour = new Color(colourInt);
    const chances = seedExtractChances(seed);
    this.newChance = chances.newChance;
    this.finishChance = chances.finishChance;

    /** @const {!Geometry} */
    this.geometry = new Geometry();
    /** @const {!MeshLambertMaterial} */
    this.material = new MeshLambertMaterial({color: this.colour, side: DoubleSide});
    /** @const {!Mesh} */
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);

    /* Create a base for the plant */
    const points = seedExtractShape(seed);
    console.log('extracted points', points);
    this.geometry.vertices.push(new Vector3(1 + points[0], 0, 1 + points[1]));
    this.geometry.vertices.push(new Vector3(points[2], 0, 1 + points[3]));
    this.geometry.vertices.push(new Vector3(points[4], 0, points[5]));
    this.geometry.verticesNeedUpdate = true;

    const face = new Face3(0, 1, 2);
    this.geometry.faces.push(face);
    this.geometry.elementsNeedUpdate = true;

    /** @const {!Array<PlantGrowth>} */
    this.growths = [];

    /** @type {number} */
    this.age = 0;
  }

  /**
   * Handle updating logic
   * 
   * @param {number} delta 
   */
  update(delta) {
    this.grow(delta);
    this.age += delta*0.001;

    this.rotation.y += 0.001; // Gently rotate
  }

  /**
   * Figure out growing logic
   * 
   * @param {number} delta 
   */
  grow(delta) {
    // Start a new growth
    // The older we are the less likely we will start a new growth
    if (this.rng() < (this.newChance - this.age) * delta) {
      this.createNewGrowth();
    }

    // Grow all our existing growths
    for (const growth of this.growths) {
      growth.grow(delta, this.age);
    }

    // Chance that we should finish growing a growth
    // The older we are the more likely we finish growths
    // TODO: Maybe multiply by number of growths
    if (this.rng() < (this.finishChance + this.age) * delta) {
      const index = Math.floor(this.growths.length * this.rng());
      this.growths.splice(index, 1);
    }

    // TODO: Only set these if we did updates
    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.computeFaceNormals();
  }

  /**
   * Construct a new growth.
   * 
   * Find a face, turn it into a pyramid.
   *
   * Then create a new growth from that.
   */
  createNewGrowth() {
    const faces = this.geometry.faces;

    // Pick a random face
    /** @type {!Face3} */
    const faceIndex = Math.floor(faces.length * this.rng());
    const face = faces[faceIndex];

    const vertexA = this.geometry.vertices[face.a];
    const vertexB = this.geometry.vertices[face.b];
    const vertexC = this.geometry.vertices[face.c];
    const triangle = new Triangle(vertexA, vertexB, vertexC);

    const growthPoint = new Vector3();
    triangle.getMidpoint(growthPoint);
    const normal = new Vector3();
    triangle.getNormal(normal);
    const newGrowth = new PlantGrowth(growthPoint, normal);
    this.growths.push(newGrowth);

    // Update the geometry

    // first add the new point to the vertices
    this.geometry.vertices.push(growthPoint);
    const newIndex = this.geometry.vertices.length - 1;
    
    // remove this face (we'll be splitting it up to create a pyramid)
    this.geometry.faces.splice(faceIndex, 1);

    // create new faces from each of the original vertex combinations
    // with tops at the new growth point
    // consider that these need to be in appropriate clockwise order
    const faceAB = new Face3(face.a, face.b, newIndex);
    const faceBC = new Face3(face.b, face.c, newIndex);
    const faceCA = new Face3(face.c, face.a, newIndex);
    this.geometry.faces.push(faceAB, faceBC, faceCA);
  }
}