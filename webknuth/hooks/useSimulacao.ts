import { useEffect, useState } from "react";

export function useSimulacao(values: number[], delay = 800) {
  const [currentValues, setCurrentValues] = useState<number[]>([]);

  useEffect(() => {
    let i = 0;
    setCurrentValues([]); // resetar antes

    const interval = setInterval(() => {
      setCurrentValues((prev) => {
        const next = [...prev, values[i]];
        i++;
        if (i >= values.length) clearInterval(interval);
        return next;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [values, delay]);

  return currentValues;
}
