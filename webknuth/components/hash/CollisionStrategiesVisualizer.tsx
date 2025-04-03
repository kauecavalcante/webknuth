"use client";

import { Dataset } from "../../lib/types";
import { useEffect, useRef, useMemo } from "react";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
    dataset: Dataset;
}

// Tamanho fixo da tabela de hash para resolução de colisões
const TABLE_SIZE = 10;

/**
 * Componente que visualiza estratégias de resolução de colisões.
 * São utilizadas três técnicas: Encadeamento, Sondagem Linear e Duplo Hashing.
 */
export default function CollisionStrategiesVisualizer({ dataset }: Props) {
    // Simula a inserção gradual dos valores
    const currentValues = useSimulacao(dataset.data, 800);
    const svgRef = useRef<SVGSVGElement>(null);

    // -------------------- CÁLCULO DAS TABELAS DE HASH --------------------

    // Função de hash base: resto da divisão pelo tamanho da tabela
    const hash = (x: number): number => x % TABLE_SIZE;

    // Função de hash secundária para Duplo Hashing
    const h2 = (x: number): number => {
        const step = 7 - (x % 7);
        return step === 0 ? 1 : step;
    };

    // Encadeamento: cada posição é um array que acumula os valores
    const chainTable = useMemo(() => {
        const table: number[][] = Array.from({ length: TABLE_SIZE }, () => []);
        currentValues.forEach((x) => {
            const idx = hash(x);
            table[idx].push(x);
        });
        return table;
    }, [currentValues]);

    // Sondagem Linear: armazena cada valor na primeira posição livre (ou null se não houver)
    const linearTable = useMemo(() => {
        const table: (number | null)[] = new Array(TABLE_SIZE).fill(null);
        currentValues.forEach((x) => {
            let idx = hash(x);
            let count = 0;
            while (table[idx] !== null && count < TABLE_SIZE) {
                idx = (idx + 1) % TABLE_SIZE;
                count++;
            }
            if (count < TABLE_SIZE) table[idx] = x;
        });
        return table;
    }, [currentValues]);

    // Duplo Hashing: utiliza uma segunda função de hash para definir o passo na resolução de colisões
    const doubleTable = useMemo(() => {
        const table: (number | null)[] = new Array(TABLE_SIZE).fill(null);
        currentValues.forEach((x) => {
            let idx = hash(x);
            const step = h2(x);
            let count = 0;
            while (table[idx] !== null && count < TABLE_SIZE) {
                idx = (idx + step) % TABLE_SIZE;
                count++;
            }
            if (count < TABLE_SIZE) table[idx] = x;
        });
        return table;
    }, [currentValues]);

    // -------------------- DESENHO DO SVG --------------------

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Limpa o SVG para redesenhar com os novos valores
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // CONFIGURAÇÃO DE LAYOUT
        const bucketSize = 50; // Tamanho do bucket principal
        const spacing = 15; // Espaço horizontal entre buckets
        const chainRectSize = 30; // Tamanho do retângulo para valores encadeados
        const chainSpacing = 10; // Espaço vertical entre os valores encadeados
        const offsetX = 40; // Margem esquerda
        const offsetY = 50; // Margem superior da primeira linha
        const tableSpacingY = 140; // Espaço vertical entre as estratégias

        const ns = "http://www.w3.org/2000/svg";

        // Calcula a altura necessária para a visualização do encadeamento
        const maxChainLength = Math.max(...chainTable.map((arr) => arr.length));
        const encadeamentoRowHeight =
            bucketSize + (maxChainLength - 1) * (chainRectSize + chainSpacing) + 20;

        // Altura fixa para as linhas de sondagem e duplo hashing
        const otherRowHeight = bucketSize + 40;
        const totalHeight = offsetY + encadeamentoRowHeight + otherRowHeight + otherRowHeight;

        svg.setAttribute("width", "1000");
        svg.setAttribute("height", totalHeight.toString());

        // Função auxiliar para desenhar textos no SVG
        const drawText = (
            parent: SVGElement,
            x: number,
            y: number,
            content: string,
            fontSize = 12,
            anchor: "start" | "middle" | "end" = "middle"
        ) => {
            const text = document.createElementNS(ns, "text");
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("text-anchor", anchor);
            text.setAttribute("font-size", fontSize.toString());
            text.textContent = content;
            parent.appendChild(text);
        };

        // Função auxiliar para desenhar linhas
        const drawLine = (
            parent: SVGElement,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) => {
            const line = document.createElementNS(ns, "line");
            line.setAttribute("x1", x1.toString());
            line.setAttribute("y1", y1.toString());
            line.setAttribute("x2", x2.toString());
            line.setAttribute("y2", y2.toString());
            line.setAttribute("stroke", "#000");
            line.setAttribute("stroke-width", "2");
            parent.appendChild(line);
        };

        // Desenha a visualização de encadeamento (chaining)
        const drawEncadeamento = (y: number, chainData: number[][]) => {
            drawText(svg, offsetX, y - 15, "Encadeamento", 16, "start");

            for (let i = 0; i < TABLE_SIZE; i++) {
                const x = offsetX + i * (bucketSize + spacing);
                const chain = chainData[i];

                // Desenha o bucket principal
                const bucketRect = document.createElementNS(ns, "rect");
                bucketRect.setAttribute("x", x.toString());
                bucketRect.setAttribute("y", y.toString());
                bucketRect.setAttribute("width", bucketSize.toString());
                bucketRect.setAttribute("height", bucketSize.toString());
                bucketRect.setAttribute("fill", "#e5e7eb");
                bucketRect.setAttribute("stroke", "#000");
                svg.appendChild(bucketRect);

                // Exibe o índice do bucket
                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                // Se houver valor, exibe o primeiro item dentro do bucket
                if (chain.length > 0) {
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, chain[0].toString(), 14);
                }

                // Se houver mais valores, desenha-os abaixo do bucket
                let currentY = y + bucketSize;
                for (let j = 1; j < chain.length; j++) {
                    currentY += chainSpacing;
                    const itemRect = document.createElementNS(ns, "rect");
                    itemRect.setAttribute("x", (x + (bucketSize - chainRectSize) / 2).toString());
                    itemRect.setAttribute("y", currentY.toString());
                    itemRect.setAttribute("width", chainRectSize.toString());
                    itemRect.setAttribute("height", chainRectSize.toString());
                    itemRect.setAttribute("fill", "#cbd5e1");
                    itemRect.setAttribute("stroke", "#000");
                    svg.appendChild(itemRect);

                    // Conecta o bucket ao retângulo do valor
                    const centerX = x + bucketSize / 2;
                    drawLine(svg, centerX, currentY, centerX, currentY - chainSpacing + 5);

                    // Exibe o valor
                    drawText(svg, x + bucketSize / 2, currentY + chainRectSize / 2 + 5, chain[j].toString(), 14);

                    currentY += chainRectSize;
                }
            }
        };

        // Desenha a visualização com Sondagem Linear
        const drawSondagemLinear = (y: number, linearData: (number | null)[]) => {
            drawText(svg, offsetX, y - 15, "Sondagem Linear", 16, "start");

            for (let i = 0; i < TABLE_SIZE; i++) {
                const x = offsetX + i * (bucketSize + spacing);

                const rect = document.createElementNS(ns, "rect");
                rect.setAttribute("x", x.toString());
                rect.setAttribute("y", y.toString());
                rect.setAttribute("width", bucketSize.toString());
                rect.setAttribute("height", bucketSize.toString());
                rect.setAttribute("fill", "#e5e7eb");
                rect.setAttribute("stroke", "#000");
                svg.appendChild(rect);

                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                if (linearData[i] !== null) {
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, linearData[i]!.toString(), 14);
                }
            }
        };

        // Desenha a visualização com Duplo Hashing
        const drawDuploHashing = (y: number, doubleData: (number | null)[]) => {
            drawText(svg, offsetX, y - 15, "Duplo Hashing", 16, "start");

            for (let i = 0; i < TABLE_SIZE; i++) {
                const x = offsetX + i * (bucketSize + spacing);

                const rect = document.createElementNS(ns, "rect");
                rect.setAttribute("x", x.toString());
                rect.setAttribute("y", y.toString());
                rect.setAttribute("width", bucketSize.toString());
                rect.setAttribute("height", bucketSize.toString());
                rect.setAttribute("fill", "#e5e7eb");
                rect.setAttribute("stroke", "#000");
                svg.appendChild(rect);

                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                if (doubleData[i] !== null) {
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, doubleData[i]!.toString(), 14);
                }
            }
        };

        // Coordenadas verticais para cada estratégia
        const yEncadeamento = offsetY;
        const ySondagem = yEncadeamento + encadeamentoRowHeight;
        const yDuplo = ySondagem + (bucketSize + 40);

        // Desenha todas as estratégias
        drawEncadeamento(yEncadeamento, chainTable);
        drawSondagemLinear(ySondagem, linearTable);
        drawDuploHashing(yDuplo, doubleTable);
    }, [chainTable, linearTable, doubleTable]);

    return (
        <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>Estratégias de Resolução de Colisão</h3>
            <svg ref={svgRef}></svg>
        </div>
    );
}
