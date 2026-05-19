import React, { useEffect, useMemo } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const PrecedenceGraph = ({ analysisResult }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (analysisResult) {
      const newNodes = analysisResult.nodes.map((nodeId, index) => {
        // Distribute nodes in a circle
        const angle = (index / analysisResult.nodes.length) * 2 * Math.PI;
        const radius = 150;
        return {
          id: nodeId,
          position: { 
            x: 250 + radius * Math.cos(angle), 
            y: 200 + radius * Math.sin(angle) 
          },
          data: { label: nodeId },
          style: {
             background: analysisResult.cyclePath.includes(nodeId) ? 'rgba(239, 68, 68, 0.2)' : 'var(--panel-bg)',
             borderColor: analysisResult.cyclePath.includes(nodeId) ? 'var(--accent-danger)' : 'var(--accent-primary)',
          }
        };
      });

      const newEdges = analysisResult.edges.map(edge => {
        const isCycleEdge = analysisResult.cyclePath.includes(edge.source) && analysisResult.cyclePath.includes(edge.target);
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          animated: edge.animated,
          style: {
            stroke: isCycleEdge ? 'var(--accent-danger)' : 'var(--text-muted)',
            strokeWidth: isCycleEdge ? 3 : 2
          },
          labelStyle: { fill: 'var(--text-main)', fontWeight: 600 },
          labelBgStyle: { fill: 'var(--panel-bg)' }
        };
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [analysisResult, setNodes, setEdges]);

  return (
    <div className="glass-panel" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 600 }}>Precedence Graph</h2>
      <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            colorMode="dark"
          >
            <Background color="var(--border-color)" gap={20} />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
            Run analysis to generate the precedence graph.
          </div>
        )}
      </div>
    </div>
  );
};

export default PrecedenceGraph;
