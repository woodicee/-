import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ROLES, TOPOLOGY_LINKS } from '../constants';
import { Node, Link } from '../types';

export default function CollaborationTopology() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    svg.selectAll('*').remove();

    // Create marker for arrows
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#475569')
      .style('stroke', 'none');

    const nodes: Node[] = ROLES.map(r => ({
      id: r.id,
      name: r.name,
      avatar: r.avatar,
      color: r.color.split(' ')[0].replace('bg-', '#')
    }));

    const links = TOPOLOGY_LINKS.map(l => ({ ...l }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    const linkLabels = svg.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', '10px')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.label);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 20)
      .attr('fill', '#0f172a')
      .attr('stroke', (d: any) => d.color || '#334155')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text((d: any) => d.avatar);

    node.append('text')
      .attr('dy', '35px')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('font-weight', 'bold')
      .text((d: any) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 5);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tighter text-white">Agent 协作拓扑图</h3>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">Multi-Agent Workflow Topology</p>
        </div>
        <div className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OpenClaw 实时监控中</span>
        </div>
      </div>

      <div className="jianghu-card p-4 rounded-3xl border border-slate-800/50 relative overflow-hidden bg-slate-950/50">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        <svg ref={svgRef} className="w-full h-[500px] relative z-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="jianghu-card p-6 rounded-3xl border border-slate-800/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">协作链路健康度</h5>
          <div className="space-y-3">
            {[
              { label: '市场情报 -> 决策中心', status: '正常', latency: '12ms' },
              { label: '营销方案 -> 销售终端', status: '正常', latency: '45ms' },
              { label: '售后反馈 -> 营销优化', status: '延迟', latency: '120ms' },
            ].map((link, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-400">{link.label}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${link.status === '正常' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {link.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{link.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="jianghu-card p-6 rounded-3xl border border-slate-800/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">自动化节点状态</h5>
          <div className="flex flex-wrap gap-2">
            {ROLES.map(role => (
              <div key={role.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm">{role.avatar}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role.name}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
