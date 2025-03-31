"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
// @ts-ignore: js-sdsl não exporta corretamente por nome
import { Heap } from "js-sdsl";

interface Props {
  values: number[];
}

interface HeapNode {
  key: number;
  x: number;
  y: number;
}

export default function FibonacciVisualizer({ values }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    try {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svg.attr("width", 800).attr("height", 400);
  
      const heap = new Heap<number>((a: number, b: number) => a - b);
  
      values.forEach(v => {
        if (typeof v === "number") {
          heap.push(v);
        }
      });
  
      const nodes: HeapNode[] = values.map((v, i) => {
        const angle = (2 * Math.PI * i) / values.length;
        return {
          key: v,
          x: 400 + 150 * Math.cos(angle),
          y: 200 + 150 * Math.sin(angle),
        };
      });
  
      const g = svg.append("g");
  
      g.selectAll("line")
        .data(nodes)
        .enter()
        .append("line")
        .attr("x1", 400)
        .attr("y1", 200)
        .attr("x2", d => d.x)
        .attr("y2", d => d.y)
        .attr("stroke", "#ccc");
  
      const node = g
        .selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
  
      node.append("circle").attr("r", 20).attr("fill", "#4f46e5");
  
      node.append("text")
        .text(d => d.key)
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "white");
  
    } catch (error) {
      console.error("Erro ao renderizar FibonacciVisualizer:", error);
    }
  }, [values]);
  

  return <svg ref={svgRef}></svg>;
}
