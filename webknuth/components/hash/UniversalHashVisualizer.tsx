"use client";

import { useEffect, useRef, useState } from "react";
import { Dataset } from "../../lib/types";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
    dataset: Dataset;
}

export default function UniversalHashVisualizer({ dataset }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Parâmetros da função de hash universal
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [p, setP] = useState(31);
    const [m, setM] = useState(dataset.data.length);

    // Simulação de inserção gradual
    const currentValues = useSimulacao(dataset.data, 800);

    // Tabela para sondagem linear: cada posição tem 1 valor ou null
    const [hashTable, setHashTable] = useState<(number | null)[]>([]);

    // Recalcula a tabela sempre que algum parâmetro mudar
    useEffect(() => {
        // Se p < 1 ou m < 1, não podemos fazer hashing
        if (p < 1 || m < 1) {
            setHashTable([]);
            return;
        }

        // Cria um array de m posições, iniciando com null
        const table = new Array(m).fill(null);

        currentValues.forEach((value) => {
            // h(x) = ((a * x + b) mod p) mod m
            // Evita valores negativos em % (JS)
            let modP = (a * value + b) % p;
            if (modP < 0) modP += p;

            let idx = modP % m;
            let count = 0;

            // Sondagem linear: se ocupado, avança
            while (table[idx] !== null && count < m) {
                idx = (idx + 1) % m;
                count++;
            }

            if (count < m) {
                // Encontrou posição livre
                table[idx] = value;
            } else {
                // Tabela cheia ou colisões demais
                console.warn(`Valor ${value} não coube na tabela.`);
            }
        });

        setHashTable(table);
    }, [a, b, p, m, currentValues]);

    // Desenha a tabela no SVG
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Limpa o SVG
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Se p < 1 ou m < 1 => exibe aviso
        if (p < 1 || m < 1) {
            svg.setAttribute("width", "600");
            svg.setAttribute("height", "60");
            const ns = "http://www.w3.org/2000/svg";
            const text = document.createElementNS(ns, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "30");
            text.setAttribute("font-size", "16");
            text.textContent = "Parâmetros inválidos (p >= 1 e m >= 1)";
            svg.appendChild(text);
            return;
        }

        // Ajuste de layout
        const boxSize = 60;
        const spacing = 20;
        const width = m * (boxSize + spacing);
        const height = 150;

        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());

        const ns = "http://www.w3.org/2000/svg";

        // Desenha cada posição (bucket)
        hashTable.forEach((value, index) => {
            const x = index * (boxSize + spacing);

            // Retângulo do bucket
            const rect = document.createElementNS(ns, "rect");
            rect.setAttribute("x", x.toString());
            rect.setAttribute("y", "40");
            rect.setAttribute("width", boxSize.toString());
            rect.setAttribute("height", boxSize.toString());
            rect.setAttribute("fill", value !== null ? "#6366f1" : "#d1d5db");
            rect.setAttribute("stroke", "#000");
            svg.appendChild(rect);

            // Texto do índice (acima do quadrado)
            const indexText = document.createElementNS(ns, "text");
            indexText.setAttribute("x", (x + boxSize / 2).toString());
            indexText.setAttribute("y", "30");
            indexText.setAttribute("text-anchor", "middle");
            indexText.setAttribute("font-size", "12");
            indexText.textContent = `${index}`;
            svg.appendChild(indexText);

            // Se houver valor, desenha no centro do quadrado
            if (value !== null) {
                const text = document.createElementNS(ns, "text");
                text.setAttribute("x", (x + boxSize / 2).toString());
                text.setAttribute("y", "75");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("fill", "white");
                text.setAttribute("font-size", "16");
                text.textContent = value.toString();
                svg.appendChild(text);
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
                    E resolvemos colisões por <strong>sondagem linear</strong>:
                </p>
                <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
                    <li><strong>a</strong>: Multiplicador</li>
                    <li><strong>b</strong>: Deslocamento (offset)</li>
                    <li><strong>p</strong>: Número primo (≥ 1)</li>
                    <li><strong>m</strong>: Tamanho da tabela (≥ 1)</li>
                    <li><em>Sondagem Linear</em>: se o bucket estiver ocupado, avança para o próximo até encontrar vazio</li>
                </ul>
            </div>

            {/* Inputs para alterar a, b, p, m */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                }}
            >
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

            {/* Scroll horizontal, caso a tabela fique larga */}
            <div style={{ overflowX: "auto", margin: "0 auto", maxWidth: "90%" }}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}
