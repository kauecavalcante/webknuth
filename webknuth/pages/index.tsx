"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.container}>
      
      <h1 style={styles.title}>WebKnuth</h1>

      
      <p style={styles.subtitle}>
        Integrantes: Kauê Cavalcante, Eduardo Veith, Cesar Aranha, Bernardo Torres, Pedro Teixeira
      </p>

      
      <div style={styles.mainContent}>
        <div style={styles.buttonContainer}>
          <Link href="../arvores/bst"><button style={styles.button}>BST</button></Link>
          <Link href="../arvores/avl"><button style={styles.button}>AVL</button></Link>
          <Link href="/hash"><button style={styles.button}>Hashing</button></Link>
          <Link href="/graph"><button style={styles.button}>Grafos</button></Link>
          <Link href="../arvores/btree"><button style={styles.button}>Arvore B</button></Link>
          <Link href="/export-test"><button style={styles.button}>Exportação</button></Link>
        </div>

       
        <div style={styles.imageBox}>
          <Image
            src="/estrutura.png" 
            alt="Ilustração Estruturas"
            width={300}
            height={300}
          />
        </div>
      </div>

      {/* Tecnologias usadas! */}
      <p style={styles.techs}>
        Tecnologias: React, TypeScript, Next.js, D3, vis-network, Firebase, CSS, JSX
      </p>
    </main>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap" as const,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  button: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  imageBox: {
    display: "flex",
    alignItems: "center",
  },
  techs: {
    marginTop: "3rem",
    fontSize: "1rem",
    color: "#555",
  },
};
