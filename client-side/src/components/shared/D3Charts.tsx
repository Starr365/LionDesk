import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarData {
  name: string;
  count: number;
}

export const D3BarChart: React.FC<{ data: BarData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const width = 340;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Draw bars
    svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.name) || 0)
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#004d26')
      .transition()
      .duration(800)
      .attr('y', d => y(d.count))
      .attr('height', d => y(0) - y(d.count));

    // Draw value labels above bars
    svg.append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', height - margin.bottom)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#004d26')
      .text(d => d.count)
      .transition()
      .duration(800)
      .attr('y', d => y(d.count) - 6);

    // Draw X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', '#b9c0c3'))
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', '#686a6d');

  }, [data]);

  return (
    <svg ref={svgRef} viewBox="0 0 340 200" className="w-full h-auto max-w-85" />
  );
};

interface PieData {
  status: string;
  count: number;
}

export const D3PieChart: React.FC<{ data: PieData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (data.length === 0) {
      svg.append('circle')
        .attr('cx', 75)
        .attr('cy', 75)
        .attr('r', 50)
        .attr('fill', 'none')
        .attr('stroke', '#e1e5e9')
        .attr('stroke-width', 20);
      return;
    }

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const colors = ['#004d26', '#005d2e', '#d4dee5', '#b9c0c3', '#686a6d'];

    const pie = d3.pie<PieData>()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(30)
      .outerRadius(radius - 5)
      .cornerRadius(4);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('d', arc)
      .each(function (d) {
        (this as any)._current = d;
      })
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) || '';
        };
      });

  }, [data]);

  return (
    <svg ref={svgRef} viewBox="0 0 150 150" className="w-full h-auto max-w-37.5" />
  );
};
