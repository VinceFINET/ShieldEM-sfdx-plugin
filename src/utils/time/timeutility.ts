/**
 * @class TimeUtility
 * @description Time utility class
 */
export default class TimeUtility {

    /**
     * @method GetToday
     * @returns Today's date
     */
    public static GetToday(): Date {
        return TimeUtility.GenerateDateInThePast(Date.now(), 0);
    }

    /**
     * @method GetYesterday
     * @returns Yesterday's date
     */
    public static GetYesterday(): Date {
        return TimeUtility.GenerateDateInThePast(Date.now(), 1);
    }

    /**
     * @method GetDateBefore
     * @param d Starting date
     * @param days Additional days (can be positive or negative)
     * @returns The date generated
     */
    public static GetDateBefore(d: Date, days: number): Date {
        return TimeUtility.GenerateDateInThePast(d.getTime(), days);
    }

    /**
     * @method GetDateBeforeFromNow
     * @param days Additional days from now
     * @returns The date generated
     */
    public static GetDateBeforeFromNow(days: number): Date {
        return TimeUtility.GenerateDateInThePast(Date.now(), days);
    }

    /**
     * @method GenerateDateInThePast
     * @param time Starting date as timestamp
     * @param days Additional days (can be positive or negative)
     * @returns The date generated
     */
     private static GenerateDateInThePast(time: number, days: number): Date {
        return new Date(time - days * 24 * 60 * 60 * 1000);
    }
}
