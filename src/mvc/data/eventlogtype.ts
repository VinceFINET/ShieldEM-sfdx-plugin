/**
 * @class EventLogType
 * @description This class represents the data of a type of event from Shield
 *              Event Monitoring, with some basic statistics.
 */
export default class EventLogType {

    /**
     * @property Name of the event directly from Shield Event Monitoring
     */
     private apiname: string;

     /**
      * @property Number of daily event log for this Event type. By default,
      *           this property is set to zero.
      */
     private dailyCount: number;

     /**
      * @property Number of hourly event log for this Event type. By default,
      *           this property is set to zero.
      */
     private hourlyCount: number;

    /**
     * @method Constructor of the class
     * @param apiname Name of the event direclty from Shield Event Monitoring
     * @param dailyCount The daily count
     * @param hourlyCount The hourly count
     */
    constructor(apiname: string, dailyCount: number, hourlyCount: number) {
        this.apiname = apiname;
        this.dailyCount = dailyCount;
        this.hourlyCount = hourlyCount;
    }

    /**
     * @method getApiname Getter for the API Name of this event
     * @returns the API name of this event from Shield Event Monitoring
     */
    public getApiname(): string {
        return this.apiname;
    }

    /**
     * @method getDailyCount Getter for the number of daily event log for this Event type.
     * @returns the daily count
     */
    public getDailyCount(): number {
        return this.dailyCount;
    }

    /**
     * @method getHourlyCount Getter for the number of hourly event log for this Event type.
     * @returns the hourly count
     */
    public getHourlyCount(): number {
        return this.hourlyCount;
    }
}
