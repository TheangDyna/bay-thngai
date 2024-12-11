export const logger = {
  info: (...args: unknown[]): void => {
    console.log(new Date().toISOString(), "INFO:", ...args);
  },
  error: (...args: unknown[]): void => {
    console.error(new Date().toISOString(), "ERROR:", ...args);
  },
  warn: (...args: unknown[]): void => {
    console.warn(new Date().toISOString(), "WARN:", ...args);
  }
};
