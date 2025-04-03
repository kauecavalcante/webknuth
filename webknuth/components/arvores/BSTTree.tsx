"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSimulacao } from "../../hooks/useSimulacao";

interface Props {
  values: number[]; // Props: o componente espera receber um array de number[] chamado value
}

interface TreeNode { // TreeNode: representa um nó da árvore (valor + dois filhos)
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function insertNode(root: TreeNode | null, value: number): TreeNode { 
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertNode(root.left, value);
  else root.right = insertNode(root.right, value);
  return root;
} // Insere recursivamente um valor na posição correta da BST,  Menores valores vão à esquerda, maiores à direita, Retorna o nó raiz da árvore modificada

function buildBST(values: number[]): TreeNode | null { //Constrói a BST a partir de uma lista de valores, Vai chamando insertNode para cada valor.
  let root: TreeNode | null = null;
  for (const value of values) {
    root = insertNode(root, value);
  }
  return root;
}

export default function BSTTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentValues = useSimulacao(values, 800); // Simulação gradual

  useEffect(() => { // useEffect para desenhar com D3
    const rootData = buildBST(currentValues);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Seleciona o elemento SVG e limpa tudo que foi desenhado antes.

    const width = 600;
    const height = 400;
    const margin = 50;
    svg.attr("width", width).attr("height", height);

    if (!rootData) return;

    const root = d3.hierarchy(rootData, (d) =>
      [d.left, d.right].filter((n): n is TreeNode => n !== null)
    );

    const treeLayout = d3.tree<TreeNode>().size([width - margin * 2, height - margin * 2]);
    const tree = treeLayout(root);
    // Transforma a estrutura TreeNode em uma hierarquia que o D3 entende
    // efine o layout da árvore (tamanho e posições dos nós)

    const g = svg.append("g").attr("transform", `translate(${margin}, ${margin})`);

    g.selectAll("line") // linhas entre os nos 
      .data(tree.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "#aaa");

    const nodeGroup = g // circulos dos nos
      .selectAll("g.node")
      .data(tree.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodeGroup.append("circle").attr("r", 20).attr("fill", "#4f46e5");

    nodeGroup
      .append("text") // valores 
      .text((d) => d.data.value)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white");
  }, [currentValues]);

  return <svg ref={svgRef}></svg>;
}


// Resumo:
//Constrói uma árvore binária de busca (BST).
//Usa o useSimulacao para animar a inserção dos nós.
//Renderiza a árvore com D3.js usando SVG.
//Ideal para ensinar como uma BST é construída.

