import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AWS_SERVICES, matchService } from '../../utils/awsServices';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 64;

function AWSNode({ data }) {
  return (
    <div style={{
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      background: data.color,
      border: `1.5px solid ${data.border}`,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      <span style={{ fontSize: 20 }}>{data.icon}</span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: data.textColor,
        textAlign: 'center',
        padding: '0 8px',
        lineHeight: 1.3,
      }}>
        {data.label}
      </span>
    </div>
  );
}

function GroupNode({ data, style }) {
  return (
    <div style={{
      width: style?.width || 200,
      height: style?.height || 200,
      border: '1.5px dashed #94a3b8',
      borderRadius: 12,
      background: 'rgba(241,245,249,0.5)',
      position: 'relative',
    }}>
      <span style={{
        position: 'absolute',
        top: 8,
        left: 12,
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {data.label}
      </span>
    </div>
  );
}

const nodeTypes = {
  awsNode: AWSNode,
  groupNode: GroupNode,
};

function buildNodes(architecture) {
  const { services = [], regions = [] } = architecture;
  const NODE_W = NODE_WIDTH + 60;
  const NODE_H = NODE_HEIGHT + 80;
  const COLS = Math.min(4, Math.ceil(Math.sqrt(services.length)));

  const positions = {};
  const assigned = new Set();
  let currentY = 100;

  regions.forEach(region => {
    if (!region.contains?.length) return;
    let currentX = 60;
    region.contains.forEach(id => {
      if (!assigned.has(id)) {
        positions[id] = { x: currentX, y: currentY };
        currentX += NODE_W;
        assigned.add(id);
      }
    });
    currentY += NODE_H + 60;
  });

  let col = 0, row = 0;
  services.forEach(svc => {
    if (!assigned.has(svc.id)) {
      positions[svc.id] = { x: 60 + col * NODE_W, y: currentY + row * NODE_H };
      col++;
      if (col >= COLS) { col = 0; row++; }
    }
  });

  const serviceNodes = services.map(svc => {
    const key = matchService(svc.awsKey || svc.name);
    const style = AWS_SERVICES[key] || AWS_SERVICES.default;
    return {
      id: svc.id,
      type: 'awsNode',
      position: positions[svc.id] || { x: 0, y: 0 },
      data: {
        label: svc.name,
        icon: style.icon,
        color: style.color,
        border: style.border,
        textColor: style.text,
      },
    };
  });

  const groupNodes = regions
    .filter(r => r.contains?.length > 0)
    .map(region => {
      const members = region.contains
        .map(id => positions[id])
        .filter(Boolean);
      if (!members.length) return null;
      const minX = Math.min(...members.map(p => p.x)) - 24;
      const minY = Math.min(...members.map(p => p.y)) - 40;
      const maxX = Math.max(...members.map(p => p.x)) + NODE_WIDTH + 24;
      const maxY = Math.max(...members.map(p => p.y)) + NODE_HEIGHT + 24;
      return {
        id: `group-${region.id}`,
        type: 'groupNode',
        position: { x: minX, y: minY },
        style: { width: maxX - minX, height: maxY - minY },
        data: { label: region.label },
        zIndex: -1,
      };
    })
    .filter(Boolean);

  return [...groupNodes, ...serviceNodes];
}

function buildEdges(architecture) {
  const { connections = [] } = architecture;
  return connections.map((conn, i) => ({
    id: `edge-${i}`,
    source: conn.from,
    target: conn.to,
    label: conn.label || '',
    type: 'smoothstep',
    style: { stroke: '#94a3b8', strokeWidth: 1.5 },
    labelStyle: { fontSize: 10, fill: '#64748b' },
    labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
    markerEnd: { type: 'arrowclosed', color: '#94a3b8' },
  }));
}

export default function DiagramCanvas({ architecture }) {
  const initialNodes = architecture ? buildNodes(architecture) : [];
  const initialEdges = architecture ? buildEdges(architecture) : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  if (!architecture) {
    return (
      <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>No architecture data yet.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <MiniMap
          nodeColor={node => node.data?.color || '#f1f5f9'}
          style={{ background: '#f8fafc' }}
        />
        <Background color="#e2e8f0" gap={20} />
      </ReactFlow>
    </div>
  );
}
