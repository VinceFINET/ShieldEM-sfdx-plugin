import { flags, SfdxCommand } from "@salesforce/command";
import EventLogLogic from "../../../../mvc/controller/eventlog";
import { AnyJson } from "@salesforce/ts-types";

/**
 * @class ListQuiddities
 * @description SFDX command line to retrieve the list of quiddities 
 *              from Shield Event Monitoring 
 */
export default class ListQuiddities extends SfdxCommand {

  /** 
   * @property List of flags for this SFDX command line
   */
  protected static flagsConfig = {
    verbose: flags.builtin()
  };

  /**
   * @property This command line needs a user name
   */
  protected static requiresUsername = false;

  /**
   * @property This command line supports dev hub
   */
  protected static supportsDevhubUsername = false;

  /**
   * @property This command line does not need a project
   */
  protected static requiresProject = false;

  /**
   * @method run Main method 
   * @returns list of quiddities from Shield Event Monitoring 
   */
  public async run(): Promise<Array<AnyJson>> {

    // Get distinct quiddities from event log files
    const quiddities: Map<string, string> = EventLogLogic.GetQuiddities();

    // Convert map into array
    let info: Array<AnyJson> = [];
    quiddities.forEach(function (name, key, map) {
      info.push({
        key: key,
        name: name
      });
    });

    // Show information
    this.ux.table(info, ['key', 'name']);

    // return the JSON format if --json used
    return info;
  }
}