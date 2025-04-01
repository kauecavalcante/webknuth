import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/SharedSimulation.module.css';

export default function SimulacaoPage() {
  const router = useRouter();
  const [dados, setDados] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!router.isReady) return;
    
    if (router.query.dados) {
      try {
        const decoded = decodeURIComponent(router.query.dados as string);
        setDados(JSON.parse(decoded));
      } catch (error) {
        console.error("Erro ao processar dados:", error);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router.isReady, router.query]);

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
              <span>ID:</span>
              <strong>{dados.id}</strong>
            </div>
            <div className={styles.dataItem}>
              <span>Valores:</span>
              <div className={styles.values}>
                {dados.valores.map((v: number, i: number) => (
                  <span key={i}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.errorCard}>
          <h2>🔍 Nenhuma simulação encontrada</h2>
          <p>O link pode estar incompleto ou expirado</p>
          <button
            className={styles.primaryButton}
            onClick={() => window.location.href = '/'}
          >
            Voltar ao início
          </button>
        </div>
      )}
    </div>
  );
}