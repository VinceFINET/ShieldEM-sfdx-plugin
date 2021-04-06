/**
 * @class FormatUtility
 * @description Formatting utility for default String class
 */
export default class FormatUtility {

  /**
   * @method format
   * @param msg String message with {0}, {1} etc...
   * @param replacements List of arguments
   * @returns the formatted string
   */
  public static format(msg: string, ...replacements: any[]): string {
    var args = arguments;
    return msg.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  }
}