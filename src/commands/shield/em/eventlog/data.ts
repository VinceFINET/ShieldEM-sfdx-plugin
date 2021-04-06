import { SfdxCommand, flags } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import EventLogLogic from "../../../../mvc/controller/eventlog";
import { DEFAULT_END_DATE, DEFAULT_NUMBER_DAYS, DEFAULT_END_DATE_NAME } from "../../../../utils/contants";
import TimeUtility from "../../../../utils/time/timeutility";
import EventLogMetadataEntry from "../../../../mvc/data/eventlogmetadataentry";

/**
 * @class LogFile
 * @description SFDX command line to retrieve the data of Shield Event Monitoring 
 */
export default class LogFile extends SfdxCommand {

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
    fields: flags.array({
      char: "f",
      required: false,
      description: "List of fields (API Names) that you want to keep in the ouput. If not specified, we keep them all.",
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
   * @returns data of Shield Event Monitoring 
   */
  public async run(): Promise<Array<AnyJson>> {

    // Set some key parameters
    const eventType: string = this.flags.eventtype;
    const enddate: Date = this.flags.enddate;
    const days: number = this.flags.days;
    const startdate: Date = TimeUtility.GetDateBefore(enddate, days);
    const fields: Array<string> = this.flags.fields;

    // Get metadata about event log files correspoding to the criteria
    let metadatas: Array<EventLogMetadataEntry> = await EventLogLogic.GetMetadata(this.org.getConnection(), eventType, startdate, enddate);

    // Output the context and the results
    this.ux.log("List of log files for:");
    this.ux.log(" - eventType: " + eventType);
    this.ux.log(" - startdate: " + startdate);
    this.ux.log(" - enddate: " + enddate);
    this.ux.log(" - days: " + days);
    this.ux.log();
    this.ux.log(metadatas.length + " log event files found corresponding to your request.");

    // Get the content of those files (as an array of lines)
    const lines: Array<AnyJson> = await EventLogLogic.GetAllContent(this.org.getConnection(), metadatas, fields);

    // Output the context and the results
    this.ux.log(lines.length + " log events found corresponding to your request.");
    
    // return the JSON format if --json used
    return lines;
  }
}
