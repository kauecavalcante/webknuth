"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
  values: number[]; //Props: o componente espera receber um array de números chamado values
}

interface TreeNode { // TreeNode: estrutura de um nó da árvore AVL (com valor, filhos e altura)
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
}

// Funcoes para a avl!!


function getHeight(node: TreeNode | null): number {
  return node ? node.height : 0; // Retorna a altura do nó (ou 0 se for null)
}

function updateHeight(node: TreeNode): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right)); // Atualiza a altura de um nó com base nas alturas dos filhos.
}

function getBalance(node: TreeNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0; // Calcula o fator de balanceamento do nó (esquerda - direita)
}

function rotateRight(y: TreeNode): TreeNode { // rotação simples à direita
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  return x;
}

function rotateLeft(x: TreeNode): TreeNode { // rotação simples à esquerda
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  return y;
}

function insertAVL(node: TreeNode | null, value: number): TreeNode { // Insere recursivamente um valor na árvore AVL, Após inserir, atualiza a altura e faz rotações se necessário ignorando valores duplicado s
  if (!node) return { value, left: null, right: null, height: 1 };

  if (value < node.value) {
    node.left = insertAVL(node.left, value);
  } else if (value > node.value) {
    node.right = insertAVL(node.right, value);
  } else {
    return node; // ignora duplicados
  }

  updateHeight(node);
  const balance = getBalance(node);

  if (balance > 1 && value < node.left!.value) return rotateRight(node);
  if (balance < -1 && value > node.right!.value) return rotateLeft(node);
  if (balance > 1 && value > node.left!.value) {
    node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right!.value) {
    node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }

  return node;
}

function buildAVL(values: number[]): TreeNode | null { // Constrói a árvore inserindo os valores um a um, mantendo balanceada com as funções anteriores.
  let root: TreeNode | null = null;
  for (const value of values) {
    root = insertAVL(root, value);
  }
  return root;
}

export default function AVLTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentValues = useSimulacao(values, 800); // Simulação gradual

  useEffect(() => { // para desenhar com D3
    const rootData = buildAVL(currentValues);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = 50;
    svg.attr("width", width).attr("height", height);

    if (!rootData) return;

    const root = d3.hierarchy(rootData, d =>
      [d.left, d.right].filter((n): n is TreeNode => n !== null)
    );

    const treeLayout = d3.tree<TreeNode>().size([width - margin * 2, height - margin * 2]);
    const tree = treeLayout(root);

    const g = svg.append("g").attr("transform", `translate(${margin}, ${margin})`);

    g.selectAll("line") // Desenha os elementos
      .data(tree.links())
      .enter()
      .append("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "#aaa");

    const nodeGroup = g
      .selectAll("g.node")
      .data(tree.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodeGroup.append("circle").attr("r", 20).attr("fill", "#4f46e5");

    nodeGroup
      .append("text")
      .text(d => d.data.value)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white");
  }, [currentValues]); // Toda vez que currentValues mudar (a cada valor novo), redesenha a árvore.

  return <svg ref={svgRef}></svg>;
}




// Resumo:
// Recebe uma lista de números.
// Simula a inserção gradual em uma árvore AVL.
// Usa D3.js para renderizar a árvore dinamicamente em SVG.
// Aplica balanceamento automático (AVL) com rotações.
// É ideal para visualizações educativas e entendimento de balanceamento de árvores.