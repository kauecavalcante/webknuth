"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  values: number[];
}

interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    height: number; // altura do nó - vou usar para calcular o balanceamento
  }

  function getHeight(node: TreeNode | null): number {
    return node ? node.height : 0;
  } // se o nó existir vai retornar sua altura

  function updateHeight(node: TreeNode): void {
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  } // atualiza a altura de um nó com base na altura de seus filhos

  function getBalance(node: TreeNode | null): number {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  } // fator de balanceamento: 0 → equilibrado | > 1 → pesado para a esquerda | < -1 → pesado para a direita

  function rotateRight(y: TreeNode): TreeNode {
    const x = y.left!;
    const T2 = x.right;
  
    x.right = y;
    y.left = T2;
  
    updateHeight(y);
    updateHeight(x);
  
    return x;
  }
  
  function rotateLeft(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left;
  
    y.left = x;
    x.right = T2;
  
    updateHeight(x);
    updateHeight(y);
  
    return y;
  }
  
  
  

  function insertAVL(node: TreeNode | null, value: number): TreeNode {
    if (!node)
      return { value, left: null, right: null, height: 1 };
  
    if (value < node.value) {
      node.left = insertAVL(node.left, value);
    } else if (value > node.value) {
      node.right = insertAVL(node.right, value);
    } else {
      return node; // ignora duplicados
    }
  
    updateHeight(node);
    const balance = getBalance(node);
  
    // Esquerda Esquerda
    if (balance > 1 && value < node.left!.value)
      return rotateRight(node);
  
    // Direita Direita
    if (balance < -1 && value > node.right!.value)
      return rotateLeft(node);
  
    // Esquerda Direita
    if (balance > 1 && value > node.left!.value) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }
  
    // Direita Esquerda
    if (balance < -1 && value < node.right!.value) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }
  
    return node;
  }
  

  function buildAVL(values: number[]): TreeNode | null {
    let root: TreeNode | null = null;
    for (const value of values) {
      root = insertAVL(root, value);
    }
    return root;
  }
  

export default function BSTTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const rootData = buildAVL(values);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // ======== Area do desenho ======== // 
    const width = 600;
    const height = 400;
    const margin = 50;

    svg.attr("width", width).attr("height", height);
    // =================================== //
    if (!rootData) return; // se nao tiver nada ele n desenha nenhuma arvore.

    const root = d3.hierarchy(rootData, d =>
        [d.left, d.right].filter((n): n is TreeNode => n !== null) // convertendo TreeNode em uma estrutura que o D3 consegue entender
      )
      

    const treeLayout = d3
      .tree<TreeNode>()
      .size([width - margin * 2, height - margin * 2]);
    const tree = treeLayout(root);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    // linhas
    g.selectAll("line")
      .data(tree.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "#aaa");

    // Circulo e o valor
    const nodeGroup = g
      .selectAll("g.node")
      .data(tree.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodeGroup.append("circle").attr("r", 20).attr("fill", "#4f46e5");

    nodeGroup
      .append("text")
      .text((d) => d.data.value)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white");
  }, [values]);

  return <svg ref={svgRef}></svg>;
}
