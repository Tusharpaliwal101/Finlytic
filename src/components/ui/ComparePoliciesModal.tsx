import React from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { Policy } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ComparePoliciesModalProps {
  policies: Policy[];
  onClose: () => void;
}

const TYPE_COLOR: Record<string, string> = {
  sip: 'text-blue',
  swp: 'text-green',
  lumpsum: 'text-warning',
  goal: 'text-blue',
  retirement: 'text-amber',
  cagr: 'text-blue',
  inflation: 'text-error',
};

const getColor = (type: string) => TYPE_COLOR[type?.toLowerCase()] ?? 'text-blue';

/** Flatten policy.data into readable key-value pairs */
function flattenData(data: Record<string, unknown>): { key: string; value: string }[] {
  return Object.entries(data)
    .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
    .map(([k, v]) => ({
      key: k.replace(/([A-Z])/g, ' $1').trim().toUpperCase(),
      value:
        typeof v === 'number' && v > 1000
          ? `₹${formatCurrency(v as number)}`
          : typeof v === 'number'
          ? Number(v).toFixed(2)
          : String(v),
    }));
}

/** Get all unique keys across selected policies */
function getAllKeys(policies: Policy[]): string[] {
  const keys = new Set<string>();
  policies.forEach(p =>
    Object.entries(p.data || {})
      .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
      .forEach(([k]) => keys.add(k.replace(/([A-Z])/g, ' $1').trim().toUpperCase()))
  );
  return Array.from(keys);
}

const ComparePoliciesModal: React.FC<ComparePoliciesModalProps> = ({ policies, onClose }) => {
  const allKeys = getAllKeys(policies);

  const getValue = (policy: Policy, displayKey: string): string => {
    const entry = Object.entries(policy.data || {}).find(([k]) =>
      k.replace(/([A-Z])/g, ' $1').trim().toUpperCase() === displayKey
    );
    if (!entry) return '—';
    const [, v] = entry;
    if (typeof v === 'number' && v > 1000) return `₹${formatCurrency(v)}`;
    if (typeof v === 'number') return Number(v).toFixed(2);
    return String(v);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0b1120] border border-slate-700 rounded-24 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue/10 border border-blue/20 p-2 rounded-10">
              <ArrowRightLeft className="w-5 h-5 text-blue" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sora">Policy Comparison</h2>
              <p className="text-xs text-slate-400">Side-by-side view of {policies.length} selected policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-10 text-slate-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy name headers */}
        <div className="grid border-b border-slate-800 shrink-0" style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}>
          <div className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            METRIC
          </div>
          {policies.map((p, i) => (
            <div key={i} className="px-6 py-4 border-l border-slate-800">
              <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${getColor(p.type)}`}>
                {p.type?.toUpperCase()}
              </span>
              <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        <div className="overflow-y-auto flex-1">
          {allKeys.map((key, rowIdx) => (
            <div
              key={key}
              className={`grid border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors`}
              style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}
            >
              <div className="px-6 py-3.5 flex items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{key}</span>
              </div>
              {policies.map((p, i) => {
                const val = getValue(p, key);
                return (
                  <div key={i} className="px-6 py-3.5 border-l border-slate-800/50 flex items-center">
                    <span className={`text-sm font-bold font-numbers ${val === '—' ? 'text-slate-600' : getColor(p.type)}`}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Date row */}
          <div
            className="grid border-b border-slate-800/50 bg-slate-800/10"
            style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}
          >
            <div className="px-6 py-3.5 flex items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SAVED ON</span>
            </div>
            {policies.map((p, i) => (
              <div key={i} className="px-6 py-3.5 border-l border-slate-800/50 flex items-center">
                <span className="text-xs text-slate-400">{p.effectiveDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-10 px-6 rounded-10 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 hover:text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparePoliciesModal;
