import EventLogDataHeader from './eventlogdataheader';

/**
 * @class EventLogMetadataEntry
 * @description This class represents the metadata of a single Log Event File.
 */
export default class EventLogMetadataEntry {

    /**
     * @property Salesforce of the event log file
     */
    private id: string;

    /**
     * @property Type of the event log file
     */
    private eventType: string;

    /**
     * @property Reference date of the event log file (when it was generated)
     */
    private logDate: Date;

    /**
     * @property URI of the event log file (used to access the content of the file itself)
     */
    private logFile: string;

    /**
     * @property Size of the file in bytes
     */
    private logFileLength: number;

    /**
     * @property List of data headers
     */
    private logFileFields: EventLogDataHeader[];

    /**
     * @property Sequence of the event log file
     */
    private sequence: number;

    /**
     * @property Interval of the event log file (daily or hourly)
     */
    private interval: string;

    /**
     * @method Constructor of the class
     * @param id Salesforce of the event log file
     * @param eventType Type of the event log file
     * @param logDate Reference date of the event log file (when it was generated)
     * @param logFile URI of the event log file (used to access the content of the file itself)
     * @param logFileLength Size of the file in bytes
     * @param headers List of header names and types.
     * @param sequence Sequence of the event log file
     * @param interval Interval of the event log file (daily or hourly)
     */
    constructor(id: string, eventType: string, logDate: Date, logFile: string, logFileLength: number, headers: EventLogDataHeader[], sequence: number, interval: string) {
            this.id = id;
            this.eventType = eventType;
            this.logDate = logDate;
            this.logFile = logFile;
            this.logFileLength = logFileLength;
            this.sequence = sequence;
            this.interval = interval;
            this.logFileFields = headers;
    }

    /**
     * @method getId Getter for the Salesforce Id of the event log file
     * @returns the Salesforce Id
     */
    public getId(): string {
        return this.id;
    }

    /**
     * @method getEventType Getter for the type of the event log file
     * @returns the type
     */
    public getEventType(): string {
        return this.eventType;
    }

    /**
     * @method getLogDate Getter for the reference date of the event log file (when it was generated)
     * @returns the reference date
     */
    public getLogDate(): Date {
        return this.logDate;
    }

    /**
     * @method getLogFile Getter for the URI of the event log file (used to access the content of the file itself)
     * @returns the URI of the file
     */
    public getLogFile(): string {
        return this.logFile;
    }

    /**
     * @method getLogFileLength Getter for the size of the file in bytes
     * @returns the size of the file
     */
    public getLogFileLength(): number {
        return this.logFileLength;
    }

    /**
     * @method getLogFileFields Getter for the list of data headers
     * @returns the list of fields for this file (name and type)
     */
    public getLogFileFields(): EventLogDataHeader[] {
        return this.logFileFields;
    }

    /**
     * @method getSequence Getter for the sequence of the event log file
     * @returns the sequence
     */
    public getSequence(): number {
        return this.sequence;
    }

    /**
     * @method getInterval Getter for the interval of the event log file (daily or hourly)
     * @returns the interval
     */
    public getInterval(): string {
        return this.interval;
    }
}
