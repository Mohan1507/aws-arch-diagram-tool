import React from 'react';
import { AWS_SERVICES, CATEGORIES } from '../../utils/awsServices';

export default function Toolbar({ architecture }) {
  const handleExportSVG = () => {
    const svgElement = document.querySelector('.react-flow__renderer svg');
    if (!svgElement) {
      alert('Please wait for the diagram to load before exporting.');
      return;
    }
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-architecture-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!architecture) return;
    const blob = new Blob([JSON.stringify(architecture, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-architecture-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const usedCategories = architecture
    ? [...new Set(architecture.services?.map(s => s.type).filter(Boolean))]
    : [];

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginRight: 8 }}>
          {architecture?.title || 'AWS Architecture'}
        </span>
        {usedCategories.map(cat => {
          const c = CATEGORIES[cat];
          if (!c) return null;
          return (
            <span key={cat} style={{
              background: c.color,
              border: `1px solid ${c.border}`,
              color: c.border,
              borderRadius: 20,
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 500,
            }}>
              {c.label}
            </span>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-secondary"
          style={{ fontSize: 13, padding: '7px 16px' }}
          onClick={handleExportJSON}
        >
          Export JSON
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: 13, padding: '7px 16px' }}
          onClick={handleExportSVG}
        >
          Export SVG
        </button>
        <button
          className="btn-primary"
          style={{ fontSize: 13, padding: '7px 16px' }}
          onClick={() => window.location.reload()}
        >
          New Diagram
        </button>
      </div>
    </div>
  );
}
