export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (!timeout) {
      fn(...args);
      timeout = setTimeout(() => {
        timeout = null;
      }, ms);
    }
  };
};
