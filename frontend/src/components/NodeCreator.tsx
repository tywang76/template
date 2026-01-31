import { useState } from 'react';
import './NodeCreator.css';

type NodeState = 'Question' | 'Rule' | 'Action';

interface NodeCreatorProps {
  onNodeCreate?: (content: string, state: NodeState) => void;
}

export function NodeCreator({ onNodeCreate }: NodeCreatorProps) {
  const [content, setContent] = useState('');
  const [state, setState] = useState<NodeState>('Question');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onNodeCreate?.(content, state);
      setContent('');
    }
  };

  return (
    <div className="node-creator">
      <form onSubmit={handleSubmit}>
        <div className="node-card">
          <div className="node-header">
            <select
              value={state}
              onChange={(e) => setState(e.target.value as NodeState)}
              className="node-state-select"
            >
              <option value="Question">Question</option>
              <option value="Rule">Rule</option>
              <option value="Action">Action</option>
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter node content..."
            className="node-content-input"
            rows={4}
          />
          <button type="submit" className="create-button">
            Create Node
          </button>
        </div>
      </form>
    </div>
  );
}
