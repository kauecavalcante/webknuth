"use client";

import { useEffect, useRef, useMemo } from "react";
import { Dataset } from "../../lib/types";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
  dataset: Dataset;
}

/**
 * Visualiza o hashing perfeito, onde cada valor é colocado na posição correspondente
 * (sem colisões), de acordo com o índice original do conjunto de dados.
 */
export default function PerfectHashVisualizer({ dataset }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Simula a inserção gradual dos valores
  const currentValues = useSimulacao(dataset.data, 800);
  // Define o tamanho da tabela com base na quantidade de dados
  const tableSize = dataset.data.length;

  // Como o hashing perfeito utiliza a própria ordem dos dados,
  // o hashTable é simplesmente igual aos valores simulados.
  const hashTable = useMemo<(number | null)[]>(() => {
    const table = new Array<number | null>(tableSize).fill(null);
    currentValues.forEach((value, index) => {
      table[index] = value;
    });
    return table;
  }, [currentValues, tableSize]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Limpa o SVG antes de redesenhar
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const boxSize = 60; // Tamanho de cada célula da tabela
    const spacing = 10; // Espaçamento entre as células
    const width = tableSize * (boxSize + spacing);
    const height = 100;
    const ns = "http://www.w3.org/2000/svg";

    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());

    // Desenha cada célula do hash
    hashTable.forEach((value, index) => {
      const x = index * (boxSize + spacing);

      // Retângulo representando o bucket
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", x.toString());
      rect.setAttribute("y", "20");
      rect.setAttribute("width", boxSize.toString());
      rect.setAttribute("height", boxSize.toString());
      rect.setAttribute("fill", "#4f46e5");
      rect.setAttribute("stroke", "#000");
      svg.appendChild(rect);

      // Exibe o índice acima do bucket
      const indexText = document.createElementNS(ns, "text");
      indexText.setAttribute("x", (x + boxSize / 2).toString());
      indexText.setAttribute("y", "15");
      indexText.setAttribute("text-anchor", "middle");
      indexText.setAttribute("font-size", "12");
      indexText.textContent = `${index}`;
      svg.appendChild(indexText);

      // Exibe o valor (se existir) centralizado no bucket
      if (value !== null) {
        const valueText = document.createElementNS(ns, "text");
        valueText.setAttribute("x", (x + boxSize / 2).toString());
        valueText.setAttribute("y", "50");
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("fill", "white");
        valueText.setAttribute("font-size", "16");
        valueText.textContent = value.toString();
        svg.appendChild(valueText);
      }
    });
  }, [hashTable, tableSize]);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Hashing Perfeito (sem colisões)
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
