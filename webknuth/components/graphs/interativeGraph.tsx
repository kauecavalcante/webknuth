"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Dataset } from "../../lib/types";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";
import styles from "../../styles/graph.module.css";

export default function GraphComponent() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      const q = query(collection(db, "datasets"), where("tipo", "==", "hash")); // Filtrando por hash
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dataset[];
      setDatasets(data);
    };

    fetchDatasets();
  }, []);

  useEffect(() => {
    if (selected) {
      const container = document.getElementById("network-container");
      if (!container) return;

      const nodes = selected.data.map((value, index) => ({
        id: index,
        label: value.toString(),
      }));

      const edges = nodes.slice(1).map((node, index) => ({
        from: index,
        to: index + 1,
      }));

      const data = { nodes, edges };
      const options = {
        nodes: { shape: "dot", size: 15, color: "#007bff" },
        edges: { color: "#aaa" },
        physics: { enabled: true },
      };

      const networkInstance = new Network(container, data, options);
      setNetwork(networkInstance);
    }
  }, [selected]);

  return (
    <main className={styles.graphContainer}>
      <div className={styles.graphCard}>
        <h1 className={styles.graphTitle}>Grafo Interativo com Vis-Network</h1>

        {!selected ? (
          <div>
            <p className={styles.graphSubtitle}>
              Escolha um conjunto para visualizar:
            </p>
            <ul className={styles.graphList}>
              {datasets.map((ds) => (
                <li key={ds.id}>
                  <button
                    className={styles.graphButton}
                    onClick={() => setSelected(ds)}
                  >
                    {ds.label} → [{ds.data.join(", ")}]
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className={styles.graphSubtitle}>
              <h2>{selected.label}</h2>
              <p>[{selected.data.join(", ")}]</p>
            </div>

            <div id="network-container" className={styles.graphWrapper}></div>

            <div style={{ textAlign: "center" }}>
              <button
                className={styles.graphClearButton}
                onClick={() => setSelected(null)}
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
