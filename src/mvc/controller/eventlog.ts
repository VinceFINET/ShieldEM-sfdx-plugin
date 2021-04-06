import { Connection } from "@salesforce/core";
import { AnyJson } from "@salesforce/ts-types";
import EventLogType from "../data/eventlogtype";
import EventLogMetadataEntry from "../data/eventlogmetadataentry";
import EventLogDataHeader from "../data/eventlogdataheader";

/**
 * @class EventLogController
 * @description This class represents the controller for the Shield Event Monitoring
 */
export default class EventLogController {

    /**
     * @method GetTypes Connects to the Salesforce database and retrieves the list 
     *                  of distinct Event Types
     * @param conn Connection to the Salesforce database
     * @returns a list of EventLogType items
     * @see EventLogType
     */
    public static async GetTypes(conn: Connection): Promise<Array<EventLogType>> {

        const res = await conn.query<AnyJson>(
            'SELECT '+EVENTTYPE_FIELDNAME+', '+INTERVAL_FIELDNAME+', '+
            'COUNT('+ID_FIELDNAME+') '+COUNT_FIELDNAME+' ' +
            'FROM '+EVENTLOGFILE_TABLE+' ' +
            'WHERE '+INTERVAL_FIELDNAME+" IN ('"+INTERVAL_HOURLY_VALUE+"', '"+
            INTERVAL_DAILY_VALUE+"') " +
            'GROUP BY '+EVENTTYPE_FIELDNAME+', '+INTERVAL_FIELDNAME+' ' +
            'ORDER BY '+EVENTTYPE_FIELDNAME+' ASC, '+INTERVAL_FIELDNAME+' ASC '
        );

        let types = new Array<EventLogType>();

        if (res.records) {
            let tMap = new Map<string, Array<number>>();
            res.records.forEach(row => {
                let type: string = row[EVENTTYPE_FIELDNAME];
                if (! tMap.has(type)) {
                    tMap.set(type, [ 0, 0 ]);
                }
                let entry: Array<number> = tMap.get(type);
                switch (row[INTERVAL_FIELDNAME]) {
                    case INTERVAL_HOURLY_VALUE: { entry[INDEX_HOURLY] += row[COUNT_FIELDNAME]; break; }
                    case INTERVAL_DAILY_VALUE:  { entry[INDEX_DAILY]  += row[COUNT_FIELDNAME]; break; }
                }
            });
            tMap.forEach((value: Array<number>, key: string) => {
                types.push(new EventLogType(key, value[INDEX_DAILY], value[INDEX_HOURLY]));
            });
        }
        return types;
    }

    /**
     * @method GetQuiddities Mapping for Quiddities (code and name)
     * @returns a list of Quiddities
     */
    public static GetQuiddities(): Map<string, string> {

        let quidditiesMap: Map<string, string> = new Map<string, string>();
        quidditiesMap.set('A', 'QueryLocator Batch Apex');
        quidditiesMap.set('BA', 'Batch Apex (for debugger)');
        quidditiesMap.set('C', 'Scheduled Apex');
        quidditiesMap.set('E', 'Inbound Email Service');
        quidditiesMap.set('F', 'Future');
        quidditiesMap.set('H', 'Apex REST');
        quidditiesMap.set('I', 'Invocable Action');
        quidditiesMap.set('K', 'Quick Action');
        quidditiesMap.set('L', 'Lightning');
        quidditiesMap.set('M', 'Remote Action');
        quidditiesMap.set('Q', 'Queuable');
        quidditiesMap.set('R', 'Synchronous uncategorized');
        quidditiesMap.set('S', 'Serial Batch Apex');
        quidditiesMap.set('TA', 'Tests Async');
        quidditiesMap.set('TD', 'Tests Deployment');
        quidditiesMap.set('TS', 'Tests Synchronous');
        quidditiesMap.set('V', 'Visualforce');
        quidditiesMap.set('W', 'SOAP Webservices');
        quidditiesMap.set('X', 'Execute Anonymous');
        return quidditiesMap;
    }
   
    /**
     * @method GetMetadata Connects to the Salesforce database and retrieves the list 
     *                     of the metadata describing the log file
     * @param conn Connection to the Salesforce database
     * @param eventType API name of the event type to consider
     * @param startdate Starting date to consider
     * @param enddate Ending date to consider
     * @returns a list of EventLogMetadataEntry items
     * @see EventLogMetadataEntry
     */
    public static async GetMetadata(conn: Connection, eventType: string, 
        startdate: Date, enddate: Date): Promise<Array<EventLogMetadataEntry>> {

        const query: string = 
            'SELECT '+ID_FIELDNAME+', '+EVENTTYPE_FIELDNAME+', '+LOGDATE_FIELDNAME+', '+
            LOGFILE_FIELDNAME+', '+LOGFILELEN_FIELDNAME+', ' +
            LOGFILEFIELDNAMES_FIELDNAME+', '+LOGFILEFIELDTYPES_FIELDNAME+', '+
            SEQUENCE_FIELDNAME+', '+INTERVAL_FIELDNAME+' ' +
            'FROM '+EVENTLOGFILE_TABLE+' ' +
            'WHERE '+EVENTTYPE_FIELDNAME+" = '"+eventType+"' " + 
            'AND '+LOGDATE_FIELDNAME+' >= '+startdate.toISOString()+' ' + 
            'AND '+LOGDATE_FIELDNAME+' < '+enddate.toISOString()+' ' + 
            'AND '+INTERVAL_FIELDNAME+" = '"+INTERVAL_DAILY_VALUE+"' " +
            'ORDER BY '+LOGDATE_FIELDNAME+' DESC, '+SEQUENCE_FIELDNAME+' ';

        const res = await conn.query<AnyJson>(query);

        let files = new Array();

        if (res.records) {
            res.records.forEach(row => {

                // Generation of the list of headers
                let logFileFields = new Array<EventLogDataHeader>();
                const logFileFieldNames: string = row[LOGFILEFIELDNAMES_FIELDNAME];
                const logFileFieldTypes: string = row[LOGFILEFIELDTYPES_FIELDNAME];
                if (logFileFieldNames && logFileFieldTypes) {
                    let fields: Array<string> = logFileFieldNames.split(',');
                    let types: Array<string> = logFileFieldTypes.split(',');
                    if (fields && types) for (let i = 0; i < fields.length; i++) {
                        logFileFields.push(new EventLogDataHeader(fields[i], types[i]));
                    }
                }

                // Add in the array
                files.push(
                    new EventLogMetadataEntry(
                        row[ID_FIELDNAME], row[EVENTTYPE_FIELDNAME],
                        row[LOGDATE_FIELDNAME], row[LOGFILE_FIELDNAME],
                        row[LOGFILELEN_FIELDNAME], logFileFields, 
                        row[SEQUENCE_FIELDNAME], row[INTERVAL_FIELDNAME]
                    )
                );
            });
        }

        return files;
    }

    /**
     * @method GetContent Connects to the Salesforce database and retrieves the content
     *                    of a specific LogEventFile
     * @param conn Connection to the Salesforce database
     * @param logFileURI URI of the file (as retrieved in the method GetMetadata)
     * @param fieldsToKeep Optional list of fields to output in the JSON (all if not specified)
     * @returns a list of AnyJson items
     * @see GetMetadata
     */
    public static async GetContent(conn: Connection, logFileURI: string, 
        fieldsToKeep?: Array<string>): Promise<Array<AnyJson>> {

        const logFileLines = await conn.request(logFileURI);

        let lines = new Array<AnyJson>();
        for (const k in logFileLines) if (logFileLines.hasOwnProperty(k)) {
            const logFileLine = logFileLines[k];
            if (fieldsToKeep) {
                let line = {};
                for (const l in fieldsToKeep) if (fieldsToKeep.hasOwnProperty(l)) {
                    line[fieldsToKeep[l]] = logFileLine[fieldsToKeep[l]];
                };
                lines.push(line);
            } else {
                lines.push(logFileLine);
            }
        }
        return lines;
    }

    /**
     * @method GetAllContent Calls the method GetContent for a list of files and append it 
     *                       to a single object.
     * @param conn Connection to the Salesforce database
     * @param files List of files to consider (as retrieved in the method GetMetadata)
     * @param fields Optional list of fields to output in the JSON (all if not specified)
     * @returns a list of EventLogType items
     * @see GetMetadata
     * @see GetContent
     */
    public static async GetAllContent(conn: Connection, files: Array<EventLogMetadataEntry>, 
        fields?: Array<string>, quiddities?: Array<string>): Promise<Array<AnyJson>> {

        let allLines = new Array<AnyJson>();
        for (let i = 0; i < files.length; i++) {
            const file: EventLogMetadataEntry = files[i];
            const fileLines: Array<AnyJson> = await EventLogController.GetContent(conn, file.getLogFile(), fields);
            allLines = allLines.concat(fileLines);
        }        
        return allLines;
    }
}

/**
 * @description Index used for counting daily in an array
 */
const INDEX_DAILY: number = 0;

/**
 * @description Index used for counting hourly in an array 
 */
const INDEX_HOURLY: number = 1;

/** 
 * @description Internal constant to store the name of the table that 
 *              contains the event log files
 */
const EVENTLOGFILE_TABLE: string = 'EventLogFile';

/**
 * @description Internal constant to store the Salesforce Id field
 */
const ID_FIELDNAME: string = 'Id';

/**
 * @description Internal constant to store the Type field
 */
const EVENTTYPE_FIELDNAME: string = 'EventType';

/**
 * @description Internal constant to store the count(Id) aggregate field
 */
const COUNT_FIELDNAME: string = 'Total';

/**
 * @description Internal constant to store the date field
 */
const LOGDATE_FIELDNAME: string = 'LogDate';

/**
 * @description Internal constant to store the URI field
 */
const LOGFILE_FIELDNAME: string = 'LogFile';

/**
 * @description Internal constant to store the size of the file
 */
const LOGFILELEN_FIELDNAME: string = 'LogFileLength';

/** 
 * @description Internal constant to store the list of fields name for each file
 */
const LOGFILEFIELDNAMES_FIELDNAME: string = 'LogFileFieldNames';

/**
 * @description Internal constant to store the list of types fields for each file
 */
const LOGFILEFIELDTYPES_FIELDNAME: string = 'LogFileFieldTypes';

/**
 * @description Internal constant to store the sequence field
 */
const SEQUENCE_FIELDNAME: string = 'Sequence';

/**
 * @description Internal constant to store the interval field
 */
const INTERVAL_FIELDNAME: string = 'Interval';

/**
 * @description Internal constant to store the value HOURLY of Internal field
 */
const INTERVAL_HOURLY_VALUE: string = 'Hourly';

/**
 * @description Internal constant to store the value DAILY of Internal field
 */
const INTERVAL_DAILY_VALUE: string = 'Daily';
