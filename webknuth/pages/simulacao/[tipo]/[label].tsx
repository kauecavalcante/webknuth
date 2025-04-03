"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/SharedSimulation.module.css";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

type Simulacao = {
  label: string;
  data: number[];
  tipo: string;
};

export default function SimulacaoPage() {
  const router = useRouter();
  const { tipo, label } = router.query;

  const [dados, setDados] = useState<Simulacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tipo || !label) return;

    const fetchSimulacao = async () => {
      try {
        const colecao = collection(db,tipo === "universal" || tipo === "colisoes" || tipo === "perfect" ? "hashing" : "datasets");
        const q = query(colecao, where("label", "==", decodeURIComponent(label as string)));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].data() as Simulacao;
          setDados(doc);
        } else {
          setDados(null);
        }
      } catch (err) {
        console.error("Erro ao buscar simulação:", err);
        setDados(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulacao();
  }, [tipo, label]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando simulação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {dados ? (
        <div className={styles.simulationCard}>
          <h1>📊 Simulação Compartilhada</h1>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <span>Tipo:</span>
              <strong>{dados.tipo.toUpperCase()}</strong>
            </div>
            <div className={styles.dataItem}>
              <span>Label:</span>
              <strong>{dados.label}</strong>
            </div>
            <div className={styles.dataItem}>
              <span>Valores:</span>
              <div className={styles.values}>
                {dados.data.map((v, i) => (
                  <span key={i}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.errorCard}>
          <h2>❌ Simulação não encontrada</h2>
          <p>Verifique se o link está correto ou expirado.</p>
          <button
            className={styles.primaryButton}
            onClick={() => window.location.href = "/"}
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
