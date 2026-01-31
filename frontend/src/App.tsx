import { useState } from 'react';
import { NodeCreator } from './components/NodeCreator';
import './App.css';

type NodeState = 'Question' | 'Rule' | 'Action';

interface Node {
  id: string;
  content: string;
  state: NodeState;
  createdAt?: string;
  updatedAt?: string;
  from: any[];
  to: any[];
}

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [error, setError] = useState<string>('');

  const handleNodeCreate = async (content: string, state: NodeState) => {
    try {
      const response = await fetch('http://localhost:3000/api/node/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          body: {
            content,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create node');
      }

      const newNode = await response.json();
      setNodes([...nodes, newNode]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create node');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Roadtrix - Node Creator</h1>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <NodeCreator onNodeCreate={handleNodeCreate} />

      <div className="nodes-list">
        <h2>Created Nodes ({nodes.length})</h2>
        <div className="nodes-grid">
          {nodes.map((node) => (
            <div key={node.id} className="node-item">
              <div className="node-item-header">
                <span className={`node-badge ${node.state.toLowerCase()}`}>
                  {node.state}
                </span>
                <span className="node-id">{node.id.slice(-6)}</span>
              </div>
              <p className="node-item-content">{node.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
