'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CircuitNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  isActive?: boolean;
}

interface CircuitConnection {
  from: string;
  to: string;
  isActive?: boolean;
}

interface Circuit {
  nodes: CircuitNode[];
  connections: CircuitConnection[];
}

interface ZKCircuitProps {
  circuit?: Circuit;
  nodes?: CircuitNode[];
  connections?: CircuitConnection[];
  step?: number;
  activeStep?: number;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

export function ZKCircuit({ 
  circuit, 
  nodes: propNodes, 
  connections: propConnections, 
  step, 
  activeStep = 0, 
  size = 'md',
  onComplete 
}: ZKCircuitProps) {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());

  // Use circuit prop if provided, otherwise use individual props
  const nodes = circuit?.nodes || propNodes || [];
  const connections = circuit?.connections || propConnections || [];
  const currentStep = step !== undefined ? step : activeStep;

  useEffect(() => {
    if (currentStep > 0) {
      // Activate nodes progressively
      const nodesToActivate = nodes.slice(0, currentStep);
      const nodeIds = new Set(nodesToActivate.map(n => n.id));
      setActiveNodes(nodeIds);

      // Activate connections progressively
      const connectionsToActivate = connections.slice(0, currentStep - 1);
      const connectionIds = new Set(connectionsToActivate.map(c => `${c.from}-${c.to}`));
      setActiveConnections(connectionIds);

      // Complete animation
      if (currentStep >= nodes.length && onComplete) {
        setTimeout(onComplete, 1000);
      }
    }
  }, [currentStep, nodes, connections, onComplete]);

  const getNodeColor = (node: CircuitNode) => {
    if (activeNodes.has(node.id)) {
      // Use terminal-style green/cyan colors instead of the node's original color
      return '#10B981'; // emerald-500 (terminal green)
    }
    return '#374151'; // gray-700
  };

  const getConnectionColor = (connection: CircuitConnection) => {
    const connectionId = `${connection.from}-${connection.to}`;
    if (activeConnections.has(connectionId)) {
      return '#06B6D4'; // cyan-500 (terminal cyan)
    }
    return '#374151'; // gray-700
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-32';
      case 'lg': return 'h-80';
      default: return 'h-64';
    }
  };

  return (
    <div className={`relative w-full ${getSizeClasses()} bg-black border border-green-500/30 rounded-lg p-4`}>
      <svg className="w-full h-full font-mono" viewBox="0 0 400 200">
        {/* Connections */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={getConnectionColor(connection)}
              strokeWidth="3"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: activeConnections.has(`${connection.from}-${connection.to}`) ? 1 : 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={getNodeColor(node)}
              stroke={activeNodes.has(node.id) ? '#22D3EE' : '#6B7280'}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ 
                scale: activeNodes.has(node.id) ? 1 : 0.8,
                opacity: activeNodes.has(node.id) ? 1 : 0.5
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                type: 'spring',
                stiffness: 200
              }}
            />
            <motion.text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className="font-mono text-xs fill-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeNodes.has(node.id) ? 1 : 0.3 }}
              transition={{ delay: index * 0.2 + 0.3 }}
            >
              {node.label}
            </motion.text>
          </motion.g>
        ))}
      </svg>

      {/* Step indicator */}
      <div className="absolute top-2 right-2">
        <div className="font-mono text-xs text-gray-400">
          Step {activeStep} / {nodes.length}
        </div>
      </div>
    </div>
  );
}

// Predefined circuit configurations
export const proofBuilderCircuit = {
  nodes: [
    { id: 'commitment', label: 'Commit', x: 50, y: 100, color: '#8B5CF6' },
    { id: 'predicate', label: 'Check', x: 150, y: 100, color: '#3B82F6' },
    { id: 'circuit', label: 'ZK Circuit', x: 250, y: 100, color: '#10B981' },
    { id: 'result', label: 'Result', x: 350, y: 100, color: '#06B6D4' }
  ],
  connections: [
    { from: 'commitment', to: 'predicate' },
    { from: 'predicate', to: 'circuit' },
    { from: 'circuit', to: 'result' }
  ]
};

export const proofCombinerCircuit = {
  nodes: [
    { id: 'vault', label: 'Vault', x: 80, y: 80, color: '#8B5CF6' },
    { id: 'length', label: 'Length', x: 200, y: 80, color: '#3B82F6' },
    { id: 'age', label: 'Age', x: 80, y: 160, color: '#EAB308' },
    { id: 'payment', label: 'Payment', x: 200, y: 160, color: '#10B981' },
    { id: 'combined', label: 'Combined', x: 320, y: 120, color: '#06B6D4' }
  ],
  connections: [
    { from: 'vault', to: 'combined' },
    { from: 'length', to: 'combined' },
    { from: 'age', to: 'combined' },
    { from: 'payment', to: 'combined' }
  ]
};
