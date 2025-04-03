"use client";

import { Dataset } from "../../lib/types";
import { useEffect, useRef } from "react";
import { useSimulacao } from "../../hooks/useSimulacao"; 

interface Props {
    dataset: Dataset;
}

// Tamanho fixo da tabela
const tableSize = 10;

export default function CollisionStrategiesVisualizer({ dataset }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Hook de simulação para inserção gradual
    const currentValues = useSimulacao(dataset.data, 800); 

    // Função base de hash
    const hash = (x: number) => x % tableSize;

    // Função de hash 2 (Duplo Hashing)
    const h2 = (x: number) => {
        const step = 7 - (x % 7);
        return step === 0 ? 1 : step;
    };

    // 1) Encadeamento
    const chainTable: number[][] = Array.from({ length: tableSize }, () => []);
    currentValues.forEach((x) => {
        const idx = hash(x);
        chainTable[idx].push(x);
    });

    // 2) Sondagem Linear
    const linearTable: (number | null)[] = new Array(tableSize).fill(null);
    currentValues.forEach((x) => {
        let idx = hash(x);
        let count = 0;
        while (linearTable[idx] !== null && count < tableSize) {
            idx = (idx + 1) % tableSize;
            count++;
        }
        if (count < tableSize) linearTable[idx] = x;
    });

    // 3) Duplo Hashing
    const doubleTable: (number | null)[] = new Array(tableSize).fill(null);
    currentValues.forEach((x) => {
        let idx = hash(x);
        const step = h2(x);
        let count = 0;
        while (doubleTable[idx] !== null && count < tableSize) {
            idx = (idx + step) % tableSize;
            count++;
        }
        if (count < tableSize) {
            doubleTable[idx] = x;
        }
    });

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Limpa o SVG antes de redesenhar
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // ---------- CONFIGURAÇÃO DE LAYOUT ----------
        const bucketSize = 50;    // Tamanho do bucket principal
        const spacing = 15;       // Espaço horizontal entre buckets
        const chainRectSize = 30; // Tamanho do retângulo de cada valor extra em encadeamento
        const chainSpacing = 10;  // Espaço vertical entre valores encadeados
        const offsetX = 40;       // Margem esquerda
        const offsetY = 50;       // Margem superior para a primeira linha
        const tableSpacingY = 140;// Distância vertical entre cada estratégia (linhas)

        const ns = "http://www.w3.org/2000/svg";

        // ---------- CÁLCULO DE ALTURA DA LINHA DE ENCADEAMENTO ----------
        // Para não "invadir" a linha de Sondagem Linear, vamos descobrir qual é o bucket com mais elementos
        // e reservar altura suficiente para desenhar todos verticalmente.
        const maxChainLength = Math.max(...chainTable.map((arr) => arr.length));
        // A altura mínima para desenhar a linha de encadeamento:
        //   - bucketSize é a altura do bucket principal
        //   - (maxChainLength - 1) * (chainRectSize + chainSpacing) é o espaço pros valores extras
        const encadeamentoRowHeight =
            bucketSize + (maxChainLength - 1) * (chainRectSize + chainSpacing) + 20;

        // As outras linhas (sondagem, duplo hashing) vão usar uma altura fixa (bucketSize + algo de margem)
        const otherRowHeight = bucketSize + 40;

        // Altura total do SVG = offsetY + encadeamento + sondagem + duplo hashing
        const totalHeight = offsetY + encadeamentoRowHeight + otherRowHeight + otherRowHeight;
        svg.setAttribute("width", "1000");
        svg.setAttribute("height", totalHeight.toString());

        // ---------- FUNÇÕES AUXILIARES DE DESENHO ----------
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

        const drawLine = (parent: SVGElement, x1: number, y1: number, x2: number, y2: number) => {
            const line = document.createElementNS(ns, "line");
            line.setAttribute("x1", x1.toString());
            line.setAttribute("y1", y1.toString());
            line.setAttribute("x2", x2.toString());
            line.setAttribute("y2", y2.toString());
            line.setAttribute("stroke", "#000");
            line.setAttribute("stroke-width", "2");
            parent.appendChild(line);
        };

        // ---------- DESENHO DO ENCADEAMENTO (vertical) ----------
        const drawEncadeamento = (y: number, chainData: number[][]) => {
            drawText(svg, offsetX, y - 15, "Encadeamento", 16, "start");

            for (let i = 0; i < tableSize; i++) {
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

                // Índice no topo
                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                if (chain.length > 0) {
                    // Primeiro valor fica dentro do bucket
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, chain[0].toString(), 14);
                }

                // Se houver mais de 1 valor, desenha-os abaixo do bucket
                let currentY = y + bucketSize; // início logo abaixo do bucket
                for (let j = 1; j < chain.length; j++) {
                    currentY += chainSpacing; // espaço entre cada valor
                    // Retângulo para o valor j
                    const itemRect = document.createElementNS(ns, "rect");
                    itemRect.setAttribute("x", (x + (bucketSize - chainRectSize) / 2).toString());
                    itemRect.setAttribute("y", currentY.toString());
                    itemRect.setAttribute("width", chainRectSize.toString());
                    itemRect.setAttribute("height", chainRectSize.toString());
                    itemRect.setAttribute("fill", "#cbd5e1");
                    itemRect.setAttribute("stroke", "#000");
                    svg.appendChild(itemRect);

                    // Desenha a linha ligando o bucket de cima com este retângulo
                    const centerX = x + bucketSize / 2;
                    drawLine(svg, centerX, currentY, centerX, currentY - chainSpacing + 5);

                    // Texto do valor
                    drawText(
                        svg,
                        x + bucketSize / 2,
                        currentY + chainRectSize / 2 + 5,
                        chain[j].toString(),
                        14
                    );

                    // Avança para baixo para o próximo
                    currentY += chainRectSize;
                }
            }
        };

        // ---------- DESENHO DA SONDAGEM LINEAR ----------
        const drawSondagemLinear = (y: number, linearData: (number | null)[]) => {
            drawText(svg, offsetX, y - 15, "Sondagem Linear", 16, "start");

            for (let i = 0; i < tableSize; i++) {
                const x = offsetX + i * (bucketSize + spacing);

                // Retângulo do bucket
                const rect = document.createElementNS(ns, "rect");
                rect.setAttribute("x", x.toString());
                rect.setAttribute("y", y.toString());
                rect.setAttribute("width", bucketSize.toString());
                rect.setAttribute("height", bucketSize.toString());
                rect.setAttribute("fill", "#e5e7eb");
                rect.setAttribute("stroke", "#000");
                svg.appendChild(rect);

                // Índice
                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                // Se houver valor
                if (linearData[i] !== null) {
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, linearData[i]!.toString(), 14);
                }
            }
        };

        // ---------- DESENHO DO DUPLO HASHING ----------
        const drawDuploHashing = (y: number, doubleData: (number | null)[]) => {
            drawText(svg, offsetX, y - 15, "Duplo Hashing", 16, "start");

            for (let i = 0; i < tableSize; i++) {
                const x = offsetX + i * (bucketSize + spacing);

                // Retângulo
                const rect = document.createElementNS(ns, "rect");
                rect.setAttribute("x", x.toString());
                rect.setAttribute("y", y.toString());
                rect.setAttribute("width", bucketSize.toString());
                rect.setAttribute("height", bucketSize.toString());
                rect.setAttribute("fill", "#e5e7eb");
                rect.setAttribute("stroke", "#000");
                svg.appendChild(rect);

                // Índice
                drawText(svg, x + bucketSize / 2, y - 5, i.toString(), 10);

                // Se houver valor
                if (doubleData[i] !== null) {
                    drawText(svg, x + bucketSize / 2, y + bucketSize / 2 + 5, doubleData[i]!.toString(), 14);
                }
            }
        };

        // ---------- DESENHAR TUDO ----------

        // Linha 1: Encadeamento (vertical)
        const yEncadeamento = offsetY;
        drawEncadeamento(yEncadeamento, chainTable);

        // Linha 2: Sondagem Linear
        const ySondagem = yEncadeamento + encadeamentoRowHeight;
        drawSondagemLinear(ySondagem, linearTable);

        // Linha 3: Duplo Hashing
        const yDuplo = ySondagem + otherRowHeight;
        drawDuploHashing(yDuplo, doubleTable);
    }, [currentValues]); 

    return (
        <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>Estratégias de Resolução de Colisão</h3>
            <svg ref={svgRef}></svg>
        </div>
    );
}
