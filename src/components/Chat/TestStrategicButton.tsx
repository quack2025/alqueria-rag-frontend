// Test component to verify strategic button appears
import React from 'react';
import { Target } from 'lucide-react';

const TestStrategicButton: React.FC = () => {
  return (
    <button
      onClick={() => alert('Strategic mode test!')}
      className="p-2 border border-purple-300 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
      title="Test estratégico"
    >
      <Target className="h-4 w-4" />
      <span className="text-xs font-medium">Test Estratégico</span>
    </button>
  );
};

export default TestStrategicButton;