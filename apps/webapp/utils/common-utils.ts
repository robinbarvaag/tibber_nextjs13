type Procedure = (...args: any[]) => void;

function debounce<T extends Procedure>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  const debounced = function (this: any, ...args: any[]) {
    const context = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };

  return debounced as T;
}

export { debounce };
