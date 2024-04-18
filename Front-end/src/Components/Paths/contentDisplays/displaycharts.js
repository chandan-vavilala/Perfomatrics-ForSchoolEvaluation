
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DisplayCharts = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      const svg = d3.select(svgRef.current);
  
      const width = 450;
      const height = 400;
      const radius = Math.max(width, height) / 2;
      const labelOffset = 20; // Offset for placing labels outside the chart
  
      svg.selectAll('*').remove();
  
      const color = d3.scaleOrdinal()
        .domain(data.map(d => d._id))
        .range(d3.schemeCategory10);
  
      const arc = d3.arc()
        .outerRadius(radius - 100)
        .innerRadius(radius - 150)
        .padAngle(0.02);
  
      const pie = d3.pie()
        .sort(null)
        .value(d => d.count);
  
      const arcs = pie(data);
  
      const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
  
      // Display total number of students in the center
      g.append('text')
        .attr('class', 'total')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .text('Total Students: ' + data.reduce((acc, cur) => acc + cur.count, 0))
        .attr('fill', 'black');
  
      // Display counts and data labels with percentages
      const total = data.reduce((acc, cur) => acc + cur.count, 0);
      g.selectAll('path')
        .data(arcs)
        .enter().append('path')
        .attr('fill', d => color(d.data._id))
        .attr('d', arc);
  
      g.selectAll('.label')
        .data(arcs)
        .enter().append('text')
        .attr('class', 'label')
        .attr('transform', d => {
          const pos = arc.centroid(d);
          pos[0] = pos[0] * 1.4; // Move the labels further outside the chart
          pos[1] = pos[1] * 1.4; // Move the labels further outside the chart
          return `translate(${pos})`;
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => `${d.data.count} (${((d.data.count / total) * 100).toFixed(1)}%)`)
        .attr('fill', 'black');
  
      // Display legends
      const legend = svg.selectAll('.legend')
        .data(data)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 20 + height + 40})`); // Adjust the transform
  
      legend.append('rect')
        .attr('x', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', d => color(d._id));
  
      legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .text(d => d._id);
    }
  }, [data]);
  
  return (
    <svg ref={svgRef} width="500" height="600" style={{justifyContent: 'center'}}></svg> 
  );
};

export default DisplayCharts;