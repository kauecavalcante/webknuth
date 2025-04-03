"use client";

import React, { useEffect, useState } from 'react';
import styles from '../styles/ExportButton.module.css';
import { SiJson } from 'react-icons/si';
import { FaFileCsv, FaShareAlt, FaCopy, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type Simulacao = {
  label: string;
  data: number[];
  tipo: string;
};

export const ExportButton = () => {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]); //simulacoes: lista das simulações vindas do Firebase.
  const [simulacaoSelecionada, setSimulacaoSelecionada] = useState<string>(""); //simulacaoSelecionada: rótulo da simulação escolhida
  const [isGeneratingLink, setIsGeneratingLink] = useState(false); //isGeneratingLink: controla o estado do botão de gerar link.
// vai carregar as simulacoes do firebase
  useEffect(() => {
    const fetchSimulacoes = async () => {
      const datasetsSnap = await getDocs(collection(db, 'datasets'));
      const hashingSnap = await getDocs(collection(db, 'hashing'));

      const datasets = datasetsSnap.docs.map(doc => doc.data() as Simulacao);
      const hashing = hashingSnap.docs.map(doc => doc.data() as Simulacao);

      setSimulacoes([...datasets, ...hashing]);
    };

    fetchSimulacoes();
  }, []);
  // 👆🏼 Busca documentos das coleções datasets e hashing. Mapeia cada doc.data() para o tipo Simulacao. Junta os dois arrays e salva em simulacoes

  const exportarDados = (formato: 'json' | 'csv') => { // exporta em json ou csv
    const simulacao = simulacoes.find(s => s.label === simulacaoSelecionada);
    if (!simulacao) {
      toast.error('❌ Simulação não encontrada');
      return;
    }

    let conteudo: string;
    let nomeArquivo: string;

    if (formato === 'json') {
      conteudo = JSON.stringify(simulacao, null, 2);
      nomeArquivo = `simulacao_${simulacao.tipo}_${simulacao.label}.json`;
    } else {
      conteudo = `Label,Tipo,Valores\n${simulacao.label},${simulacao.tipo},"${simulacao.data.join(';')}"`;
      nomeArquivo = `simulacao_${simulacao.tipo}_${simulacao.label}.csv`;
    }

    const blob = new Blob([conteudo], { type: formato === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob); // Cria um URL temporário para o blob
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`✅ Arquivo ${formato.toUpperCase()} gerado com sucesso!`);
  };

  const compartilharSimulacao = async () => {
    const simulacao = simulacoes.find(s => s.label === simulacaoSelecionada);
    if (!simulacao) {
      toast.error('❌ Simulação não encontrada');
      return;
    }

    setIsGeneratingLink(true);

    const link = `${window.location.origin}/simulacao/${simulacao.tipo}/${encodeURIComponent(simulacao.label)}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success(
        <div className={styles.toastSuccess}>
          <FaLink /> Link copiado para a área de transferência!
          <div className={styles.linkPreview}>{link}</div>
        </div>
      );
    } catch (error) {
      toast.error("❌ Erro ao copiar o link.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Exportar Dados</h1>
        <p className={styles.subtitle}>Exporte ou compartilhe suas simulações</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.iconSection}>📤</span> Exportar</h2>
          <div className={styles.exportButtons}>
            <button onClick={() => exportarDados('json')} className={styles.buttonJson} disabled={!simulacaoSelecionada}>
              <SiJson className={styles.icon} /> Exportar JSON
            </button>
            <button onClick={() => exportarDados('csv')} className={styles.buttonCsv} disabled={!simulacaoSelecionada}>
              <FaFileCsv className={styles.icon} /> Exportar CSV
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><FaShareAlt className={styles.iconSection} /> Compartilhar</h2>
          <div className={styles.selectContainer}>
            <select
              value={simulacaoSelecionada}
              onChange={(e) => setSimulacaoSelecionada(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecione uma simulação...</option>
              {simulacoes.map((s, idx) => (
                <option key={idx} value={s.label}>
                  {s.tipo.toUpperCase()} - {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={compartilharSimulacao}
            className={styles.buttonShare}
            disabled={!simulacaoSelecionada || isGeneratingLink}
          >
            {isGeneratingLink ? "Gerando..." : <>
              <FaLink className={styles.icon} /> Gerar Link Compartilhável
            </>}
          </button>
        </div>
      </div>
    </div>
  );
};
