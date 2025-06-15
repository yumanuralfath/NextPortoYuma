export const withErrorHandler = async <T>(
  fn: () => Promise<T>,
  message = "Failed to load data"
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    throw new Error(`${message}: ${error}`);
  }
};

export const withErrorHandlerSync = <T>(fn: () => T, message = "Error"): T => {
  try {
    return fn();
  } catch (error) {
    throw new Error(`${message}: ${error}`);
  }
};
