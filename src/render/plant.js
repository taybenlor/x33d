import { Color, Object3D, Geometry, MeshLambertMaterial, DoubleSide, Mesh, Face3, Vector3, Triangle } from 'three';
import seedrandom from 'seedrandom';

import { PlantGrowth } from './plant-growth';
import { seedExtractColours, seedExtractChances, seedExtractShape, randomChoice } from '../helpers';
import { seedComponents } from '../menu/storage';

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
  '5': 'changehue_1',
  '6': 'changehue_2',
  '7': 'changehue_3',
  '8': 'changehue_4',
  '9': 'changehue_5',
  'A': 'changesat_1',
  'B': 'changesat_2',
  'C': 'changesat_3',
  'D': 'changesat_4',
  'E': 'changesat_5',
  'F': 'sethue_1',
  'G': 'sethue_2',
  'H': 'sethue_3',
  'I': 'sethue_4',
  'J': 'sethue_5',
  'K': 'setsat_1',
  'L': 'setsat_2',
  'M': 'setsat_3',
  'N': 'setsat_4',
  'O': 'setsat_5',
  'P': 'movevector_1',
  'Q': 'movevector_2',
  'R': 'movevector_3',
  'S': 'movevector_4',
  'T': 'movevector_5',
  'U': 'movevector_6',
  'V': 'movevector_7',
  'W': 'movevector_8',
  'X': 'movevector_9',
  'Y': 'movevector_0',
  'Z': 'junk',
}

function seedExtractInstructions(seed) {
  seed = seedComponents(seed).seed;
  const one = seed[3];
  const two = seed[4];
  const three = seed[5]
  return [
    INSTRUCTIONS[one],
    INSTRUCTIONS[two],
    INSTRUCTIONS[three]
  ]
}

function getInstruction(instruction) {
  return instruction.split('_')[0];
}

function getValue(instruction) {
  const splitStruction = instruction.split('_')[1];
  if (splitStruction.length == 2) {
    return parseInt(splitStruction[1], 10);
  }

  return 0;
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
    this.instructions = seedExtractInstructions(this.seed);

    const colourString = seedExtractColours(seed).colour;
    const colourInt = parseInt(colourString.split('#')[1], 16);  // TODO: Using slice(1) breaks - maybe compiler?

    this.colour = new Color(colourInt);
    const chances = seedExtractChances(seed);
    this.newChance = chances.newChance;
    this.finishChance = chances.finishChance;

    /** @const {!Geometry} */
    this.geometry = new Geometry();
    /** @const {!MeshLambertMaterial} */
    this.material = new MeshLambertMaterial({color: 0xffffff, side: DoubleSide, vertexColors: true});
    /** @const {!Mesh} */
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);

    /* Create a base for the plant */
    const points = seedExtractShape(seed);
    this.geometry.vertices.push(new Vector3(1 + points[0], 0, 1 + points[1]));
    this.geometry.vertices.push(new Vector3(points[2], 0, 1 + points[3]));
    this.geometry.vertices.push(new Vector3(points[4], 0, points[5]));
    this.geometry.verticesNeedUpdate = true;

    const face = new Face3(0, 1, 2);
    face.color = this.colour;
    face.vertexColors = [this.colour, this.colour, this.colour];
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
    // Custom growth for this seed

    for (const instruction of this.instructions) {
      const type = getInstruction(instruction);
      if (type === 'grow') {
        for (let i = 0; i < getValue(instruction); i++) {
          const growth = randomChoice(this.growths, this.rng);
          if (!growth) {
            continue;
          }
          growth.grow(delta, this.age);
        }
      } else if (type === 'changehue') {
        const amount = getValue(instruction);
        const color = this.colour.clone();
        const obj = {h:0, s:0, l:0};
        color.getHSL(obj);
        obj.h += ((amount-2)/3) * delta;
        while (obj.h > 1) {
          obj.h -= 1;
        }
        while (obj.h < 0) {
          obj.h += 1;
        }
        color.setHSL(obj.h, obj.s, obj.l);
        this.colour = color;
      } else if (type === 'changesat') {
        const amount = getValue(instruction);
        const color = this.colour.clone();
        const obj = {h:0, s:0, l:0};
        color.getHSL(obj);
        obj.s += ((amount-2)/3) * delta;
        obj.l += ((amount-2)/3) * delta;
        while (obj.s > 1) {
          obj.s -= 1;
        }
        while (obj.s < 0) {
          obj.s += 1;
        }
        while (obj.l > 1) {
          obj.l -= 1;
        }
        while (obj.l < 0) {
          obj.l += 1;
        }
        color.setHSL(obj.h, obj.s, obj.l);
        this.colour = color;
      } else if (type === 'sethue') {
        const amount = getValue(instruction);
        const color = this.colour.clone();
        const obj = {h:0, s:0, l:0};
        color.getHSL(obj);
        color.setHSL(amount/5, obj.s, obj.l);
        this.colour = color;
      } else if (type === 'setsat') {
        const amount = getValue(instruction);
        const color = this.colour.clone();
        const obj = {h:0, s:0, l:0};
        color.getHSL(obj);
        color.setHSL(obj.h, amount/5, amount/5);
        this.colour = color;
      } else if (type === 'movevector') {
        const amount = getValue(instruction);
        const growth = randomChoice(this.growths, this.rng);
        if (!growth) {
          continue;
        }

        if (amount < 3) {
          const move = ((amount+1)/6 - 0.25) * delta;
          growth.normal.add(new Vector3(move, 0, 0));
        } else if (amount < 6) {
          const move = ((amount - 2)/6 - 0.25) * delta;
          growth.normal.add(new Vector3(0, move, 0));
        } else if (amount < 9) {
          const move = ((amount - 5)/6 - 0.25) * delta;
          growth.normal.add(new Vector3(0, 0, move));
        }
      }
    }

    // Do normal growth

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
    faceAB.color = this.color;
    faceAB.vertexColors = [this.colour, this.colour, this.colour];
    const faceBC = new Face3(face.b, face.c, newIndex);
    faceBC.color = this.color;
    faceBC.vertexColors = [this.colour, this.colour, this.colour];
    const faceCA = new Face3(face.c, face.a, newIndex);
    faceCA.color = this.color;
    faceCA.vertexColors = [this.colour, this.colour, this.colour];
    this.geometry.faces.push(faceAB, faceBC, faceCA);
  }
}