import TimeUtility from './time/timeutility';

/**
 * @constant DEFAULT_END_DATE Default end date for the command line
 */
export const DEFAULT_END_DATE: Date = TimeUtility.GetYesterday();

/**
 * @constant DEFAULT_END_DATE_NAME Name of the default end date (used for message)
 */
export const DEFAULT_END_DATE_NAME: string = 'Yesterday';

/**
 * @constant DEFAULT_NUMBER_DAYS Default number of days for the command line
 */
export const DEFAULT_NUMBER_DAYS: number = 30;

/**
 * @constant EVENTTYPE_APEXEXECUTION Name of the ApexExecution event type
 */
export const EVENTTYPE_APEXEXECUTION: string = 'ApexExecution';

/**
 * @constant FIELD_APINAME_ENTRYPOINT Name of the field that contains Entry Point
 */
export const FIELD_APINAME_ENTRYPOINT: string = 'ENTRY_POINT';

/**
 * @constant FIELD_APINAME_QUIDDITY Name of the field that contains Quiddity
 */
export const FIELD_APINAME_QUIDDITY: string = 'QUIDDITY';

/**
 * @constant FIELD_APINAME_CPUTIME Name of the field that contains the CPU time
 */
export const FIELD_APINAME_CPUTIME: string = 'CPU_TIME';
