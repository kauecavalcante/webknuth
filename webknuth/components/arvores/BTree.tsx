"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSimulacao } from "../../hooks/useSimulacao"; 

interface Props {
  values: number[];
}

interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
}

function buildBTree(values: number[], t: number): BTreeNode {
  let root: BTreeNode = { keys: [], children: [], leaf: true };

  function splitChild(parent: BTreeNode, i: number) {
    const fullChild = parent.children[i];
    const mid = t - 1;
    const newChild: BTreeNode = {
      keys: fullChild.keys.slice(mid + 1),
      children: fullChild.leaf ? [] : fullChild.children.slice(mid + 1),
      leaf: fullChild.leaf,
    };
    parent.keys.splice(i, 0, fullChild.keys[mid]);
    parent.children.splice(i + 1, 0, newChild);
    fullChild.keys = fullChild.keys.slice(0, mid);
    if (!fullChild.leaf) {
      fullChild.children = fullChild.children.slice(0, mid + 1);
    }
  }

  function insertNonFull(node: BTreeNode, value: number) {
    let i = node.keys.length - 1;
    if (node.leaf) {
      node.keys.push(value);
      node.keys.sort((a, b) => a - b);
    } else {
      while (i >= 0 && value < node.keys[i]) i--;
      i++;
      if (node.children[i].keys.length === 2 * t - 1) {
        splitChild(node, i);
        if (value > node.keys[i]) i++;
      }
      insertNonFull(node.children[i], value);
    }
  }

  for (const value of values) {
    if (root.keys.length === 2 * t - 1) {
      const newRoot: BTreeNode = {
        keys: [],
        children: [root],
        leaf: false,
      };
      splitChild(newRoot, 0);
      insertNonFull(newRoot, value);
      root = newRoot;
    } else {
      insertNonFull(root, value);
    }
  }

  return root;
}

export default function BTree({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const currentValues = useSimulacao(values, 1000); // Simulação passo a passo
  const t = 2;

  useEffect(() => {
    const rootData = buildBTree(currentValues, t);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = 50;

    svg.attr("width", width).attr("height", height);

    function draw(node: BTreeNode, x: number, y: number, level: number) {
      const g = svg.append("g").attr("transform", `translate(${x}, ${y})`);
      const boxWidth = node.keys.length * 30;

      g.append("rect")
        .attr("width", boxWidth)
        .attr("height", 30)
        .attr("fill", "#4f46e5")
        .attr("rx", 6);

      node.keys.forEach((key, i) => {
        g.append("text")
          .text(key)
          .attr("x", i * 30 + 15)
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .attr("fill", "white");
      });

      if (!node.leaf) {
        const step = width / Math.pow(2, level + 1);
        node.children.forEach((child, i) => {
          const childX = x - (step * (node.children.length - 1)) / 2 + i * step;
          const childY = y + 80;

          svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("y1", y + 30)
            .attr("x2", childX + child.keys.length * 15)
            .attr("y2", childY)
            .attr("stroke", "#aaa");

          draw(child, childX, childY, level + 1);
        });
      }
    }

    draw(rootData, width / 2 - (currentValues.length * 10), margin, 0);
  }, [currentValues]);

  return <svg ref={svgRef}></svg>;
}
