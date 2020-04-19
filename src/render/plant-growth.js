import {Vector3} from 'three';

const GROWTH_AMOUNT = 0.01;

export class PlantGrowth {
  /**
   * @param {Vector3} point
   * @param {Vector3} normal
   */
  constructor(point, normal) {
    /** @const {Vector3} */
    this.point = point;

    /** @const {Vector3} */
    this.normal = normal;
  }

  /**
   * @param {number} delta
   * @param {number} age
   */
  grow(delta, age) {
    this.point.addScaledVector(this.normal, (delta * GROWTH_AMOUNT)/(age*10 + 0.01));
  }
}