"use client"; 

import { useEffect, useRef } from "react";
import * as d3 from "d3"; 
import { useSimulacao } from "../../hooks/useSimulacao"; 

interface Props {
  values: number[]; // Props: o componente recebe uma lista de números.
}

interface BTreeNode {
  keys: number[]; // Chaves armazenadas no nó
  children: BTreeNode[]; // Filhos do nó (vazio se for uma folha)
  leaf: boolean; // Indica se o nó é uma folha
}

// Função para construir uma B-Tree com grau mínimo 't'
function buildBTree(values: number[], t: number): BTreeNode {
  let root: BTreeNode = { keys: [], children: [], leaf: true }; // Inicializa a raiz da árvore

  // Função para dividir um filho cheio do nó pai
  function splitChild(parent: BTreeNode, i: number) {
    const fullChild = parent.children[i]; // Filho que está cheio
    const mid = t - 1; // Índice da chave do meio a ser promovida
    const newChild: BTreeNode = {
      keys: fullChild.keys.slice(mid + 1), // Chaves do novo nó
      children: fullChild.leaf ? [] : fullChild.children.slice(mid + 1), // Filhos do novo nó
      leaf: fullChild.leaf, // Mesmo status de folha
    };
    parent.keys.splice(i, 0, fullChild.keys[mid]); // Promove a chave do meio
    parent.children.splice(i + 1, 0, newChild); // Insere novo filho no pai
    fullChild.keys = fullChild.keys.slice(0, mid); // Reduz as chaves do filho original
    if (!fullChild.leaf) {
      fullChild.children = fullChild.children.slice(0, mid + 1); // Ajusta filhos do filho original
    }
  }

  // Função auxiliar para inserir em um nó não cheio
  function insertNonFull(node: BTreeNode, value: number) {
    let i = node.keys.length - 1;
    if (node.leaf) {
      node.keys.push(value); // Insere valor
      node.keys.sort((a, b) => a - b); // Ordena chaves
    } else {
      while (i >= 0 && value < node.keys[i]) i--; // Encontra o filho correto
      i++;
      if (node.children[i].keys.length === 2 * t - 1) {
        splitChild(node, i); // Divide se o filho estiver cheio
        if (value > node.keys[i]) i++; // Decide em qual dos filhos inserir
      }
      insertNonFull(node.children[i], value); // Inserção recursiva
    }
  }

  // Loop principal: insere todos os valores na árvore
  for (const value of values) {
    if (root.keys.length === 2 * t - 1) {
      const newRoot: BTreeNode = {
        keys: [],
        children: [root],
        leaf: false,
      };
      splitChild(newRoot, 0); // Divide a raiz
      insertNonFull(newRoot, value); // Insere no novo root
      root = newRoot; // Atualiza a raiz
    } else {
      insertNonFull(root, value); // Insere no root atual
    }
  }

  return root; // Retorna a árvore construída
}

// Componente principal da visualização da B-Tree
export default function BTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null); // Referência ao elemento SVG

  const currentValues = useSimulacao(values, 1000); // Simula inserção passo a passo a cada 1000ms
  const t = 2; // Grau mínimo da B-Tree

  useEffect(() => {
    const rootData = buildBTree(currentValues, t); // Constrói a árvore com os valores atuais
    const svg = d3.select(svgRef.current); // Seleciona o SVG
    svg.selectAll("*").remove(); // Limpa o SVG anterior

    const width = 800; // Largura da visualização
    const height = 400; // Altura da visualização
    const margin = 50; // Margem superior

    svg.attr("width", width).attr("height", height); // Define dimensões do SVG

    // Função recursiva para desenhar a árvore
    function draw(node: BTreeNode, x: number, y: number, level: number) {
      const g = svg.append("g").attr("transform", `translate(${x}, ${y})`); // Agrupamento de cada nó
      const boxWidth = node.keys.length * 30; // Largura do retângulo do nó

      g.append("rect")
        .attr("width", boxWidth)
        .attr("height", 30)
        .attr("fill", "#4f46e5") // Cor do nó
        .attr("rx", 6); // Borda arredondada

      node.keys.forEach((key, i) => {
        g.append("text")
          .text(key)
          .attr("x", i * 30 + 15)
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .attr("fill", "white"); // Cor do texto
      });

      if (!node.leaf) {
        const step = width / Math.pow(2, level + 1); // Distância entre filhos
        node.children.forEach((child, i) => {
          const childX = x - (step * (node.children.length - 1)) / 2 + i * step; // X do filho
          const childY = y + 80; // Y do filho (próximo nível)

          // Desenha a linha entre pai e filho
          svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("y1", y + 30)
            .attr("x2", childX + child.keys.length * 15)
            .attr("y2", childY)
            .attr("stroke", "#aaa");

          draw(child, childX, childY, level + 1); // Desenha recursivamente os filhos
        });
      }
    }

    draw(rootData, width / 2 - (currentValues.length * 10), margin, 0); // Desenha a árvore começando do topo
  }, [currentValues]); // Atualiza a cada novo valor da simulação

  return <svg ref={svgRef}></svg>; // Renderiza o SVG
}
