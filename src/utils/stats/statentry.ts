import StatMetric from "./statmetric";

/**
 * @class StatEntry
 * @description StatEntry represents a name and a set of values (number).
 */
export default class StatEntry {
    
  /**
   * @method Constructor of the class
   */
  constructor() {
    this.metrics = new Map();
  }
  
  /**
   * @property Map of all statistic metrics for this stat 
   */
  private metrics: Map<string, StatMetric>;
  
  /**
   * @method addValue
   * @param metricName Name of the metric
   * @param value New value to add, the metric will automatically calculates some basics stats
   */
  public addValue(metricName: string, value: number) {
    if (! this.metrics.has(metricName)) {
      this.metrics.set(metricName, new StatMetric());
    }
    this.metrics.get(metricName).addValue(value);
  }
  
  /**
   * @method getAllMetrics
   * @returns all the metrics as a map
   */
  public getAllMetrics(): Map<string, StatMetric> {
    return this.metrics;
  }

  /**
   * @method getMetric
   * @returns the metric given its name
   */
  public getMetric(metricName: string): StatMetric {
    return this.metrics.get(metricName);
  }
}