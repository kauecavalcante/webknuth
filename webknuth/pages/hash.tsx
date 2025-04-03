import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Dataset } from "../lib/types";

import PerfectHashVisualizer from "../components/hash/PerfectHashVisualizer";
import UniversalHashVisualizer from "../components/hash/UniversalHashVisualizer";
import CollisionStrategiesVisualizer from "../components/hash/CollisionStrategiesVisualizer";

import styles from "../styles/bst.module.css";

/**
 * Página principal para visualização das diferentes estratégias de hashing.
 * Permite selecionar o tipo de hash (Perfeito, Universal ou Resolução de Colisões)
 * e escolher um conjunto de dados para visualização.
 */
export default function HashPage() {
    // Estado que define a estratégia selecionada
    const [tipo, setTipo] = useState<"perfect" | "universal" | "colisoes">("perfect");
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [selected, setSelected] = useState<Dataset | null>(null);

    // Busca os conjuntos de dados de acordo com a estratégia selecionada
    useEffect(() => {
        const fetchDatasets = async () => {
            const q = query(collection(db, "hashing"), where("tipo", "==", tipo));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Dataset[];

            // Ordena os dados com base no número extraído do label
            data.sort((a, b) => {
                const numA = parseInt(a.label.match(/\d+/)?.[0] || "0");
                const numB = parseInt(b.label.match(/\d+/)?.[0] || "0");
                return numA - numB;
            });

            setDatasets(data);
            setSelected(null);
        };

        fetchDatasets();
    }, [tipo]);

    return (
        <main className={styles.bstContainer}>
            <div className={styles.bstCard} style={{ textAlign: "center" }}>
                <h1 className={styles.bstTitle} style={{ marginBottom: "1.5rem" }}>
                    Visualização de Hashing
                </h1>

                {/* Bloco de seleção de estratégia e conjunto de dados */}
                {!selected ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        {/* Seletor de estratégia */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <label htmlFor="tipo" style={{ fontWeight: 600, margin: 0, fontSize: "1rem" }}>
                                Estratégia:
                            </label>
                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value as any)}
                                style={{
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    fontSize: "1rem",
                                }}
                            >
                                <option value="perfect">Hashing Perfeito</option>
                                <option value="universal">Hashing Universal</option>
                                <option value="colisoes">Resolução de Colisões</option>
                            </select>
                        </div>

                        {/* Título para seleção do conjunto de dados */}
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: 600, margin: 0, fontSize: "1rem" }}>
                                Escolha um conjunto de dados:
                            </p>
                        </div>

                        {/* Lista de conjuntos de dados */}
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            {datasets.map((ds) => (
                                <li key={ds.id}>
                                    <button
                                        onClick={() => setSelected(ds)}
                                        style={{
                                            padding: "0.4rem 0.8rem",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            background: "#fff",
                                            cursor: "pointer",
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {ds.label} → [{ds.data.join(", ")}]
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    // Visualização do conjunto de dados selecionado
                    <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "1rem" }}>
                            <h2 style={{ margin: 0 }}>{selected.label}</h2>
                            <p style={{ margin: 0, color: "#555" }}>[{selected.data.join(", ")}]</p>
                        </div>

                        {/* Renderiza o visualizador de hashing de acordo com a estratégia selecionada */}
                        <div>
                            {tipo === "perfect" && <PerfectHashVisualizer dataset={selected} />}
                            {tipo === "universal" && <UniversalHashVisualizer dataset={selected} />}
                            {tipo === "colisoes" && <CollisionStrategiesVisualizer dataset={selected} />}
                        </div>

                        <div style={{ marginTop: "1rem" }}>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    background: "#f87171",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                }}
                            >
                                Limpar Visualização
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
