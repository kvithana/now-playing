/* eslint-disable @typescript-eslint/ban-types */

/**
 * Pretty print an error message.
 * @param rest logging data
 */
export const logError = (...rest: Array<string | number | object>): void => {
  console.error('[ERROR 🚨]:', ...rest);
};

/**
 * Construct a logger with prefix string.
 * @param prefix logger prefix
 */
export const createLogger = (prefix: string) => (...rest: Array<string | number | object>): void => {
  console.log(prefix, ...rest);
};
