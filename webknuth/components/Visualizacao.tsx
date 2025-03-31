'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

type Dataset = {
  label: string
  data: number[]
  tipo: string
}

interface Props {
  dataset: Dataset
}

export default function Visualizacao({ dataset }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Fazendo os dados como se fossse uma barra
    const width = 400
    const height = 200
    const barWidth = width / dataset.data.length

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset.data) || 1])
      .range([0, height])

    svg
      .attr('width', width)
      .attr('height', height)

    svg.selectAll('rect')
      .data(dataset.data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => i * barWidth)
      .attr('y', d => height - yScale(d))
      .attr('width', barWidth - 2)
      .attr('height', d => yScale(d))
      .attr('fill', 'steelblue')
  }, [dataset])

  return (
    <div>
      <h2 className="text-lg font-semibold">{dataset.label} ({dataset.tipo})</h2>
      <svg ref={svgRef}></svg>
    </div>
  )
}
