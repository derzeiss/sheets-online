import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    //if the value changes, we clear the timeout and do not change the value
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
