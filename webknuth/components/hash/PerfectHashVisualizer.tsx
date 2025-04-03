"use client";

import { useEffect, useRef } from "react";
import { Dataset } from "../../lib/types";
import { useSimulacao } from "../../hooks/useSimulacao"; 

interface Props {
  dataset: Dataset;
}

export default function PerfectHashVisualizer({ dataset }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Hook para simular inserção gradual
  const currentValues = useSimulacao(dataset.data, 800);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Limpa SVG
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const data = currentValues;
    const size = dataset.data.length; // Tamanho fixo da tabela 

    // Função de hash perfeita: usar posição no array original
    const hashTable: (number | null)[] = new Array(size).fill(null);
    for (let i = 0; i < data.length; i++) {
      hashTable[i] = data[i];
    }

    const boxSize = 60;
    const spacing = 10;

    const width = size * (boxSize + spacing);
    const height = 100;

    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());

    const ns = "http://www.w3.org/2000/svg";

    hashTable.forEach((value, index) => {
      const x = index * (boxSize + spacing);

      // Retângulo
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", x.toString());
      rect.setAttribute("y", "20");
      rect.setAttribute("width", boxSize.toString());
      rect.setAttribute("height", boxSize.toString());
      rect.setAttribute("fill", "#4f46e5");
      rect.setAttribute("stroke", "#000");
      svg.appendChild(rect);

      // Texto: índice
      const indexText = document.createElementNS(ns, "text");
      indexText.setAttribute("x", (x + boxSize / 2).toString());
      indexText.setAttribute("y", "15");
      indexText.setAttribute("text-anchor", "middle");
      indexText.setAttribute("font-size", "12");
      indexText.textContent = `${index}`;
      svg.appendChild(indexText);

      // Texto: valor
      if (value !== null) {
        const text = document.createElementNS(ns, "text");
        text.setAttribute("x", (x + boxSize / 2).toString());
        text.setAttribute("y", "50");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "16");
        text.textContent = value.toString();
        svg.appendChild(text);
      }
    });
  }, [currentValues, dataset]);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Hashing Perfeito (sem colisões)
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
