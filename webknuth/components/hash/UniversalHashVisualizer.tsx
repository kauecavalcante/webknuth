"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Dataset } from "../../lib/types";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
    dataset: Dataset;
}

/**
 * Visualiza o hashing universal, onde a função de hash é definida por:
 *   h(x) = ((a * x + b) mod p) mod m
 * e colisões são resolvidas por sondagem linear.
 */
export default function UniversalHashVisualizer({ dataset }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Parâmetros da função de hash universal
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [p, setP] = useState(31);
    const [m, setM] = useState(dataset.data.length);

    // Simula a inserção gradual dos valores
    const currentValues = useSimulacao(dataset.data, 800);

    // Computa a tabela de hash usando a função universal e resolução por sondagem linear
    const hashTable = useMemo<(number | null)[]>(() => {
        if (p < 1 || m < 1) return [];
        const table = new Array<number | null>(m).fill(null);

        currentValues.forEach((value) => {
            // Calcula h(x) = ((a * x + b) mod p) mod m, garantindo não ter valor negativo
            let modP = (a * value + b) % p;
            if (modP < 0) modP += p;
            let idx = modP % m;
            let count = 0;
            // Sondagem linear para resolução de colisões
            while (table[idx] !== null && count < m) {
                idx = (idx + 1) % m;
                count++;
            }
            if (count < m) {
                table[idx] = value;
            } else {
                console.warn(`Valor ${value} não coube na tabela.`);
            }
        });

        return table;
    }, [a, b, p, m, currentValues]);

    // Desenha a tabela de hash no SVG
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Limpa o SVG
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        const ns = "http://www.w3.org/2000/svg";

        // Caso os parâmetros sejam inválidos, exibe mensagem de aviso
        if (p < 1 || m < 1) {
            svg.setAttribute("width", "600");
            svg.setAttribute("height", "60");
            const text = document.createElementNS(ns, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "30");
            text.setAttribute("font-size", "16");
            text.textContent = "Parâmetros inválidos (p >= 1 e m >= 1)";
            svg.appendChild(text);
            return;
        }

        // Configura o layout da tabela
        const boxSize = 60;
        const spacing = 20;
        const width = m * (boxSize + spacing);
        const height = 150;

        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());

        // Desenha cada bucket da tabela de hash
        hashTable.forEach((value, index) => {
            const x = index * (boxSize + spacing);

            // Desenha o retângulo do bucket
            const rect = document.createElementNS(ns, "rect");
            rect.setAttribute("x", x.toString());
            rect.setAttribute("y", "40");
            rect.setAttribute("width", boxSize.toString());
            rect.setAttribute("height", boxSize.toString());
            rect.setAttribute("fill", value !== null ? "#6366f1" : "#d1d5db");
            rect.setAttribute("stroke", "#000");
            svg.appendChild(rect);

            // Exibe o índice do bucket
            const indexText = document.createElementNS(ns, "text");
            indexText.setAttribute("x", (x + boxSize / 2).toString());
            indexText.setAttribute("y", "30");
            indexText.setAttribute("text-anchor", "middle");
            indexText.setAttribute("font-size", "12");
            indexText.textContent = `${index}`;
            svg.appendChild(indexText);

            // Se houver valor, exibe-o centralizado no bucket
            if (value !== null) {
                const valueText = document.createElementNS(ns, "text");
                valueText.setAttribute("x", (x + boxSize / 2).toString());
                valueText.setAttribute("y", "75");
                valueText.setAttribute("text-anchor", "middle");
                valueText.setAttribute("fill", "white");
                valueText.setAttribute("font-size", "16");
                valueText.textContent = value.toString();
                svg.appendChild(valueText);
            }
        });
    }, [hashTable, p, m]);

    return (
        <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "1rem 0" }}>Hashing Universal (Sondagem Linear)</h3>

            {/* Explicação dos parâmetros */}
            <div style={{ maxWidth: "600px", margin: "0 auto 1rem", textAlign: "left" }}>
                <p style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>
                    A função de hash universal é definida como: <br />
                    <code>h(x) = ((a * x + b) mod p) mod m</code>
                    <br />
                    E resolvemos colisões por <strong>sondagem linear</strong>.
                </p>
                <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
                    <li><strong>a</strong>: Multiplicador</li>
                    <li><strong>b</strong>: Deslocamento</li>
                    <li><strong>p</strong>: Número primo (≥ 1)</li>
                    <li><strong>m</strong>: Tamanho da tabela (≥ 1)</li>
                </ul>
            </div>

            {/* Inputs para alterar os parâmetros */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                    <label style={{ fontWeight: 600 }}>a:</label>
                    <input
                        type="number"
                        value={a}
                        onChange={(e) => setA(parseInt(e.target.value))}
                        style={{ marginLeft: "0.3rem", width: "50px" }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600 }}>b:</label>
                    <input
                        type="number"
                        value={b}
                        onChange={(e) => setB(parseInt(e.target.value))}
                        style={{ marginLeft: "0.3rem", width: "50px" }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600 }}>p:</label>
                    <input
                        type="number"
                        value={p}
                        onChange={(e) => setP(parseInt(e.target.value))}
                        style={{ marginLeft: "0.3rem", width: "50px" }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600 }}>m:</label>
                    <input
                        type="number"
                        value={m}
                        onChange={(e) => setM(parseInt(e.target.value))}
                        style={{ marginLeft: "0.3rem", width: "50px" }}
                    />
                </div>
            </div>

            {/* Área com scroll horizontal para a tabela, se necessário */}
            <div style={{ overflowX: "auto", margin: "0 auto", maxWidth: "90%" }}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}
