/**
 * @class StatMetric
 * @description
 */
export default class StatMetric {

  /**
   * @property sum of all values
   */
  private sum: number;

  /**
   * @property min of all values
   */
  private min: number;

  /**
   * @property max of all values
   */
  private max: number;

  /**
   * @property all values
   */
  private values: number[];

  /**
   * @method Constructor of the class
   */
   constructor() {
    this.values = [];
    this.sum = 0;
    this.min = undefined;
    this.max = undefined;
  }

  /**
   * @method addValue
   * @param value to add
   */
  public addValue(value: number) {
    this.sum += value;
    this.values.push(value);
    if (this.min === undefined || this.min > value) {
      this.min = value;
    }
    if (this.max === undefined || this.max < value) {
      this.max = value;
    }
  }

  /**
   * @method getValues
   * @returns all values
   */
  public getValues(): number[] {
    return this.values;
  }

  /**
   * @method getCount
   * @returns current count of values
   */
  public getCount(): number {
    return this.values.length;
  }

  /**
   * @method getAverage
   * @returns the average of all values
   */
  public getAverage(): number {
    return this.values.length === 0 ? undefined : this.sum / this.values.length;
  }

  /**
   * @method getMin
   * @returns current min of values
   */
  public getMin(): number {
    return this.min;
  }

  /**
   * @method getMax
   * @returns current max of values
   */
  public getMax(): number {
    return this.max;
  }
}
