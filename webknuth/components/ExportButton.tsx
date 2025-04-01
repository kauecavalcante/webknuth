import React from 'react';
import styles from '../styles/ExportButton.module.css';
import { SiJson } from 'react-icons/si';
import { toast } from 'react-toastify';
import { FaFileCsv, FaShareAlt, FaCopy, FaLink } from 'react-icons/fa';


const dadosFixos = [
  {
    id: "12",
    tipo: "bst",
    valores: [10, 5, 15, 3, 7],
    tempo: "0.2s",
    memoria: "1988"
  },
  {
    id: "37",
    tipo: "hash",
    valores: [44, 55, 66, 77, 88],
    tempo: "0.3s",
    memoria: "2048"
  },
  {
    id: "33",
    tipo: "hash",
    valores: [18, 36, 72, 144, 288],
    tempo: "0.25s",
    memoria: "3096"
  },
  {
    id: "03",
    tipo: "hash",
    valores: [23, 42, 4, 16, 8],
    tempo: "0.18s",
    memoria: "1024"
  },
  {
    id: "20",
    tipo: "hash",
    valores: [12, 22, 32, 42, 52],
    tempo: "0.22s",
    memoria: "2048"
  },
  {
    id: "34",
    tipo: "lista",
    valores: [8, 9, 10, 11, 12],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "25",
    tipo: "hash",
    valores: [100, 200, 300, 400, 500],
    tempo: "0.4s",
    memoria: "4096"
  },
  {
    id: "26",
    tipo: "avl",
    valores: [90, 60, 30, 20, 10],
    tempo: "0.35s",
    memoria: "2048"
  },
  {
    id: "06",
    tipo: "lista",
    valores: [1, 2, 3, 4, 5],
    tempo: "0.1s",
    memoria: "256"
  },
  {
    id: "04",
    tipo: "bst",
    valores: [2, 7, 11, 3, 5],
    tempo: "0.2s",
    memoria: "1024"
  },
  {
    id: "16",
    tipo: "lista",
    valores: [3, 6, 9, 12, 15],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "40",
    tipo: "avl",
    valores: [2, 3, 5, 7, 11],
    tempo: "0.25s",
    memoria: "1024"
  },
  {
    id: "27",
    tipo: "lista",
    valores: [8, 6, 4, 2, 0],
    tempo: "0.12s",
    memoria: "384"
  },
  {
    id: "18",
    tipo: "avl",
    valores: [40, 30, 50, 60, 20],
    tempo: "0.3s",
    memoria: "1536"
  },
  {
    id: "31",
    tipo: "bst",
    valores: [100, 50, 25, 75, 150],
    tempo: "0.35s",
    memoria: "2048"
  },
  {
    id: "39",
    tipo: "bst",
    valores: [3, 7, 11, 15, 19],
    tempo: "0.2s",
    memoria: "896"
  },
  {
    id: "01",
    tipo: "bst",
    valores: [5, 3, 8, 1, 4],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "21",
    tipo: "bst",
    valores: [60, 50, 70, 40, 80],
    tempo: "0.3s",
    memoria: "1536"
  },
  {
    id: "15",
    tipo: "bst",
    valores: [70, 40, 50, 90, 20],
    tempo: "0.28s",
    memoria: "1280"
  },
  {
    id: "08",
    tipo: "bst",
    valores: [9, 1, 6, 3, 7],
    tempo: "0.18s",
    memoria: "768"
  },
  {
    id: "13",
    tipo: "avl",
    valores: [25, 20, 30, 10, 22],
    tempo: "0.25s",
    memoria: "1024"
  },
  {
    id: "29",
    tipo: "avl",
    valores: [19, 7, 5, 2, 1],
    tempo: "0.2s",
    memoria: "896"
  },
  {
    id: "36",
    tipo: "bst",
    valores: [15, 10, 5, 20, 25],
    tempo: "0.22s",
    memoria: "1024"
  },
  {
    id: "22",
    tipo: "lista",
    valores: [1, 4, 9, 16, 25],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "11",
    tipo: "hash",
    valores: [17, 4, 6, 10, 2],
    tempo: "0.18s",
    memoria: "768"
  },
  {
    id: "23",
    tipo: "bst",
    valores: [11, 13, 17, 19, 23],
    tempo: "0.25s",
    memoria: "1024"
  },
  {
    id: "02",
    tipo: "lista",
    valores: [10, 9, 8, 7, 6],
    tempo: "0.12s",
    memoria: "384"
  },
  {
    id: "30",
    tipo: "hash",
    valores: [3, 1, 4, 1, 5],
    tempo: "0.1s",
    memoria: "256"
  },
  {
    id: "24",
    tipo: "lista",
    valores: [2, 4, 6, 8, 10],
    tempo: "0.1s",
    memoria: "256"
  },
  {
    id: "38",
    tipo: "lista",
    valores: [5, 6, 7, 8, 9],
    tempo: "0.12s",
    memoria: "384"
  },
  {
    id: "14",
    tipo: "lista",
    valores: [6, 7, 8, 9, 10],
    tempo: "0.12s",
    memoria: "384"
  },
  {
    id: "19",
    tipo: "lista",
    valores: [5, 10, 15, 20, 25],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "35",
    tipo: "avl",
    valores: [7, 14, 21, 28, 35],
    tempo: "0.25s",
    memoria: "1024"
  },
  {
    id: "17",
    tipo: "bst",
    valores: [7, 2, 9, 4, 1],
    tempo: "0.15s",
    memoria: "512"
  },
  {
    id: "07",
    tipo: "hash",
    valores: [100, 90, 80, 70, 60],
    tempo: "0.3s",
    memoria: "1536"
  },
  {
    id: "32",
    tipo: "lista",
    valores: [33, 66, 99, 132, 165],
    tempo: "0.35s",
    memoria: "2048"
  },
  {
    id: "05",
    tipo: "avl",
    valores: [33, 18, 14, 21, 30],
    tempo: "0.28s",
    memoria: "1280"
  },
  {
    id: "28",
    tipo: "bst",
    valores: [12, 14, 16, 18, 20],
    tempo: "0.2s",
    memoria: "896"
  },
  {
    id: "09",
    tipo: "avl",
    valores: [55, 40, 65, 30, 50],
    tempo: "0.35s",
    memoria: "2048"
  },
  {
    id: "10",
    tipo: "lista",
    valores: [13, 21, 34, 55, 89],
    tempo: "0.25s",
    memoria: "1024"
  }
];

export const ExportButton = () => {
  const [simulacaoSelecionada, setSimulacaoSelecionada] = React.useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = React.useState(false);

  const exportarDados = (formato: 'json' | 'csv') => {
    if (!simulacaoSelecionada) {
      toast.error('❌ Selecione uma simulação primeiro');
      return;
    }

    const simulacao = dadosFixos.find(item => item.id === simulacaoSelecionada);
    if (!simulacao) {
      toast.error('❌ Simulação não encontrada');
      return;
    }

    let conteudo: string;
    let nomeArquivo: string;

    if (formato === 'json') {
      conteudo = JSON.stringify(simulacao, null, 2);
      nomeArquivo = `simulacao_${simulacao.tipo}_${simulacao.id}.json`;
    } else {
      const cabecalho = ['ID', 'Tipo', 'Valores', 'Tempo', 'Memória'];
      const linha = [
        simulacao.id,
        simulacao.tipo,
        simulacao.valores.join(';'),
        simulacao.tempo,
        simulacao.memoria
      ];
      conteudo = [cabecalho.join(','), linha.join(',')].join('\n');
      nomeArquivo = `simulacao_${simulacao.tipo}_${simulacao.id}.csv`;
    }

    const blob = new Blob([conteudo], { type: formato === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
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
    if (!simulacaoSelecionada) {
      toast.error('❌ Selecione uma simulação primeiro');
      return;
    }

    setIsGeneratingLink(true);
    
    try {
      const simulacao = dadosFixos.find(item => item.id === simulacaoSelecionada);
      if (!simulacao) {
        throw new Error('Simulação não encontrada');
      }

      const link = `${window.location.origin}/simulacao/${simulacao.tipo}/${simulacao.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Simulação ${simulacao.tipo.toUpperCase()} - ID ${simulacao.id}`,
          text: 'Confira esta simulação de estrutura de dados',
          url: link
        });
        return;
      }

      try {
        await navigator.clipboard.writeText(link);
        toast.success(
          <div className={styles.toastSuccess}>
            <FaLink /> Link copiado para a área de transferência!
            <div className={styles.linkPreview}>{link}</div>
          </div>
        );
      } catch (err) {
        console.warn('Falha no clipboard API:', err);
        copiarTextoFallback(link);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        toast.error(`❌ ${error.message || 'Erro ao compartilhar'}`);
      }
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copiarTextoFallback = (texto: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.success(
      <div className={styles.toastSuccess}>
        <FaCopy /> Link copiado (método alternativo)
        <div className={styles.linkPreview}>{texto}</div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Exportar Dados</h1>
        <p className={styles.subtitle}>Exporte ou compartilhe suas simulações</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.iconSection}>📤</span> Exportar
          </h2>
          <div className={styles.exportButtons}>
            <button 
              onClick={() => exportarDados('json')} 
              className={styles.buttonJson}
              disabled={!simulacaoSelecionada}
            >
              <SiJson className={styles.icon} /> 
              <span>Exportar JSON</span>
            </button>
            <button 
              onClick={() => exportarDados('csv')} 
              className={styles.buttonCsv}
              disabled={!simulacaoSelecionada}
            >
              <FaFileCsv className={styles.icon} /> 
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaShareAlt className={styles.iconSection} /> Compartilhar
          </h2>
          
          <div className={styles.selectContainer}>
            <select
              value={simulacaoSelecionada}
              onChange={(e) => setSimulacaoSelecionada(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecione uma simulação...</option>
              {dadosFixos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tipo.toUpperCase()} - ID: {item.id} (Tempo: {item.tempo}, Memória: {item.memoria}KB)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={compartilharSimulacao}
            className={styles.buttonShare}
            disabled={!simulacaoSelecionada || isGeneratingLink}
          >
            {isGeneratingLink ? (
              <span className={styles.buttonLoading}>Gerando...</span>
            ) : (
              <>
                <FaLink className={styles.icon} /> 
                <span>Gerar Link Compartilhável</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
