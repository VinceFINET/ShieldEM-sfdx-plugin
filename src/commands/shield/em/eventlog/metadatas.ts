import { flags, SfdxCommand } from "@salesforce/command";
import EventLogLogic from "../../../../mvc/controller/eventlog";
import TimeUtility from "../../../../utils/time/timeutility";
import { DEFAULT_END_DATE, DEFAULT_NUMBER_DAYS, DEFAULT_END_DATE_NAME } from "../../../../utils/contants";
import EventLogMetadataEntry from "../../../../mvc/data/eventlogmetadataentry";

/**
 * @class ListLogFiles
 * @description SFDX command line to retrieve the metadata of Shield Event Monitoring 
 */
export default class ListLogFiles extends SfdxCommand {

  /** 
   * @property List of flags for this SFDX command line
   */
  protected static flagsConfig = {
    eventtype: flags.string({
        char: "t",
        required: true,
        description: 'Type of the log event file.'
      }),
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
   * @returns metadata of Shield Event Monitoring 
   */
  public async run(): Promise<Array<EventLogMetadataEntry>> {

    // Set some key parameters
    const eventType: string = this.flags.eventtype;
    const enddate: Date = this.flags.enddate;
    const days: number = this.flags.days;
    const startdate: Date = TimeUtility.GetDateBefore(enddate, days);

    // Get metadata about event log files correspoding to the criteria
    let metadatas: Array<EventLogMetadataEntry> = await EventLogLogic.GetMetadata(this.org.getConnection(), eventType, startdate, enddate);

    // Output the context and the results
    this.ux.log("List of log files for:");
    this.ux.log(" - eventType: " + eventType);
    this.ux.log(" - startdate: " + startdate);
    this.ux.log(" - enddate: " + enddate);
    this.ux.log();
    
    // Output the results
    this.ux.table(metadatas, [ 'eventType', 'logDate', 'interval', 'logFile' ]);
    
    // return the JSON format if --json used
    return metadatas;
  }
}