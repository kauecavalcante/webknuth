import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Dataset } from "../../lib/types";
import BSTTree from "../../components/arvores/BSTTree";
import styles from "../../styles/bst.module.css";

export default function BSTPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selected, setSelected] = useState<Dataset | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      const q = query(collection(db, "datasets"), where("tipo", "==", "bst"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dataset[];
      setDatasets(data);
    };

    fetchDatasets();
  }, []);

  return (
    <main className={styles.bstContainer}>
      <div className={styles.bstCard}>
        <h1 className={styles.bstTitle}>Árvore Binária de Busca (BST)</h1>

        {!selected ? (
          <div>
            <p className={styles.bstSubtitle}>
              Escolha um conjunto para visualizar:
            </p>
            <ul className={styles.bstList}>
              {datasets.map((ds) => (
                <li key={ds.id}>
                  <button
                    className={styles.bstButton}
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
            <div className={styles.bstSubtitle}>
              <h2>{selected.label}</h2>
              <p>[{selected.data.join(", ")}]</p>
            </div>

            <div className={styles.bstTreeWrapper}>
              <BSTTree values={selected.data} />
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className={styles.bstClearButton}
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
