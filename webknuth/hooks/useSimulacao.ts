import { useEffect, useState } from "react";

export function useSimulacao(values: number[], delay = 800) { // Recebendo dois parametros, values: um array de números a serem simulados; delay: o tempo de espera entre cada inserção (em ms)
  const [currentValues, setCurrentValues] = useState<number[]>([]); // vai criar um estado que começa vazio, ele vai sendo preenchido aos poucos com os valores do array original, um por um

  useEffect(() => {
    let i = 0;
    setCurrentValues([]); // resetar antes

    const interval = setInterval(() => { // Cria um intervalo que será executado a cada delay 
      setCurrentValues((prev) => {
        const next = [...prev, values[i]];
        i++;
        if (i >= values.length) clearInterval(interval);
        return next;
      }); // Adiciona o próximo valor (values[i]) ao array atual (prev) incrementando ao i, e quando todos os valores forem inseridos esse intervalo vai parar (clearInterval)
    }, delay);

    return () => clearInterval(interval);
  }, [values, delay]);

  return currentValues;
}
