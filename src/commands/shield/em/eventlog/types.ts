import { flags, SfdxCommand } from "@salesforce/command";
import EventLogLogic from "../../../../mvc/controller/eventlog";
import EventLogType from "../../../../mvc/data/eventlogtype";

/**
 * @class ListTypes
 * @description SFDX command line to retrieve the list of event types 
 *              from Shield Event Monitoring 
 */
export default class ListTypes extends SfdxCommand {

  /** 
   * @property List of flags for this SFDX command line
   */
  protected static flagsConfig = {
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
   * @returns list of event types from Shield Event Monitoring 
   */
  public async run(): Promise<Array<EventLogType>> {

    // Get distinct types of event log files
    const types: Array<EventLogType> = await EventLogLogic.GetTypes(this.org.getConnection());

    // Show information
    this.ux.table(types, [ 'apiname', 'dailyCount', 'hourlyCount' ]);

    // return the JSON format if --json used
    return types;
  }
}