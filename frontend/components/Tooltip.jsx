import { useState } from 'react';
import { tooltips } from '../data/staticData';

export default function Tooltip({ text, term }) {
  const tooltipText = text || tooltips[term] || '';

  if (!tooltipText) return null;

  return (
    <span className="tooltip-wrapper">
      <span className="tooltip-icon">?</span>
      <span className="tooltip-content">{tooltipText}</span>
    </span>
  );
}
