import { flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import TimeUtility from "../../../../utils/time/timeutility";
import { DEFAULT_NUMBER_DAYS, DEFAULT_END_DATE, DEFAULT_END_DATE_NAME, EVENTTYPE_APEXEXECUTION, FIELD_APINAME_ENTRYPOINT, FIELD_APINAME_CPUTIME, FIELD_APINAME_QUIDDITY } from "../../../../utils/contants";
import EventLogController from "../../../../mvc/controller/eventlog";
import EventLogMetadataEntry from "../../../../mvc/data/eventlogmetadataentry";
import StatEntry from "../../../../utils/stats/statentry";
import StatMetric from "../../../../utils/stats/statmetric";

/**
 * @class ListApexEntrypoints
 * @description SFDX command line to retrieve the Apex Entrypoints
 *              from Shield Event Monitoring 
 */
export default class ListApexEntrypoints extends SfdxCommand {

  /** 
   * @property List of flags for this SFDX command line
   */
  protected static flagsConfig = {
      enddate: flags.date({
        char: "e",
        required: false,
        default: DEFAULT_END_DATE,
        description: 'End date. By default: '+DEFAULT_END_DATE_NAME+'.'
      }),
      days: flags.integer({
        char: "d",
        required: false,
        min: 1,
        max: DEFAULT_NUMBER_DAYS,
        default: DEFAULT_NUMBER_DAYS,
        description: 'Number of days in the past from the end date. By default '+DEFAULT_NUMBER_DAYS+'.'
      }),
      quiddities: flags.array({
        char: "q",
        required: false,
        description: "List of quiddities (key names, not names) that you want to keep in the ouput. If not specified, we keep them all.",
        delimiter: ","
      }),
      verbose: flags.builtin()
  };

  /**
   * @property This command line needs a user name
   */
  protected static requiresUsername = true;

  /**
   * @property This command line supports dev hub
   */
  protected static supportsDevhubUsername = true;

  /**
   * @property This command line does not need a project
   */
  protected static requiresProject = false;

  /**
   * @method run Main method 
   * @returns list of Apex Entrypoints from Shield Event Monitoring 
   */
  public async run(): Promise<AnyJson> {

    // Set some key parameters
    const enddate: Date = this.flags.enddate;
    const days: number = this.flags.days;
    const startdate: Date = TimeUtility.GetDateBefore(enddate, days);

    // log
    this.ux.startSpinner('Progress...');
    this.ux.setSpinnerStatus('Retreiving metadata for files')

    // Get metadata about event log files correspoding to the criteria
    const files: Array<EventLogMetadataEntry> = await EventLogController.GetMetadata(
      this.org.getConnection(), EVENTTYPE_APEXEXECUTION, startdate, enddate);

    // log
    this.ux.setSpinnerStatus('Getting content for '+files.length+' files');

    // Get real content of all files
    const datas: Array<AnyJson> = await EventLogController.GetAllContent(
      this.org.getConnection(), files, [ FIELD_APINAME_ENTRYPOINT, FIELD_APINAME_QUIDDITY, FIELD_APINAME_CPUTIME ]);

    // log
    this.ux.setSpinnerStatus('Formatting result');

    let stats = new Map<string, StatEntry>();
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const entryPoint: string = data[FIELD_APINAME_ENTRYPOINT];
      const quiddity: string = data[FIELD_APINAME_QUIDDITY];
      if (entryPoint) {
        const classname: string = entryPoint.split('.')[0];
        const uniqKey: string = classname + '@' + quiddity;
        if (! stats.has(uniqKey)) {
          stats.set(uniqKey, new StatEntry());
        }
        stats.get(uniqKey).addValue('cpuTime', Number(data[FIELD_APINAME_CPUTIME]));
      }
    }

    // Get more readable quiddities
    const quiddities: Map<string, string> = EventLogController.GetQuiddities();

    // return the JSON format if --json used
    let out = [];
    stats.forEach(function (statEntry, uniqKey, map) {
      const metrics: Map<string, StatMetric> = statEntry.getAllMetrics();
      const splittedKey: Array<string> = uniqKey.split('@');
      const classname: string = splittedKey[0];
      const quiddity: string = splittedKey[1];
      metrics.forEach(function (metric, metricName, map) {
        out.push({
          class: classname,
          quiddity: (quiddity + ' - ' +quiddities.get(quiddity)),
          metric: metricName,
          min: metric.getMin(),
          max: metric.getMax(),
          avg: metric.getAverage(),
          count: metric.getCount()
        });
      });
    })

    // log
    this.ux.stopSpinner('Done');

    // Show information
    this.ux.table(out, [ 'class', 'quiddity', 'metric', 'avg', 'min', 'max', 'count' ]);
    
    return out;
  }
}
