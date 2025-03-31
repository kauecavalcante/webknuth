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
}

function insertNode(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertNode(root.left, value);
  else root.right = insertNode(root.right, value);
  return root;
}

function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const value of values) {
    root = insertNode(root, value);
  }
  return root;
}

export default function BSTTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const rootData = buildBST(values);
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
        [d.left, d.right].filter((n): n is TreeNode => n !== null) // convertendo TreeNode em uma estrutura que o D3 consegue entende
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
