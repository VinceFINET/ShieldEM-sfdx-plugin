/**
 * @class EventLogDataHeader
 * @description This class represents the information of one header in the event log file
 */
export default class EventLogDataHeader {

    /**
     * @property Name of the header
     */
    private name: string;

    /**
     * @property Type of the header
     */
    private type: string;

    /**
     * @method Constructor of the class
     * @param name Name of the header
     * @param type Type of the header
     */
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    /**
     * @method getName Getter for the name of the header
     * @returns The name of the header
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @method getType Getter for the type of the header
     * @returns The type of the header
     */
    public getType(): string {
        return this.type;
    }
}
