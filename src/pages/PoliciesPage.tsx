import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText, Trash2, Search, ArrowRightLeft, Plus,
  Filter, Wallet, ArrowDownLeft, Target, Palmtree,
  BarChart2, PieChart, TrendingDown, Calendar, ChevronRight,
  BookMarked, X
} from 'lucide-react';
import { usePolicyStore } from '../store/policyStore';
import { useAuthStore } from '../store/authStore';
import { Policy } from '../types';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import ComparePoliciesModal from '../components/ui/ComparePoliciesModal';

/* ── helpers ── */
const TYPE_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  sip:        { label: 'SIP',        color: 'text-blue',    bg: 'bg-blue/10',    border: 'border-blue/20',    icon: <Wallet className="w-4 h-4" /> },
  swp:        { label: 'SWP',        color: 'text-green',   bg: 'bg-green/10',   border: 'border-green/20',   icon: <ArrowDownLeft className="w-4 h-4" /> },
  lumpsum:    { label: 'Lumpsum',    color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: <PieChart className="w-4 h-4" /> },
  goal:       { label: 'Goal SIP',   color: 'text-blue',    bg: 'bg-blue/10',    border: 'border-blue/20',    icon: <Target className="w-4 h-4" /> },
  retirement: { label: 'Retirement', color: 'text-amber',   bg: 'bg-amber/10',   border: 'border-amber/20',   icon: <Palmtree className="w-4 h-4" /> },
  cagr:       { label: 'CAGR',       color: 'text-blue',    bg: 'bg-blue/10',    border: 'border-blue/20',    icon: <BarChart2 className="w-4 h-4" /> },
  inflation:  { label: 'Inflation',  color: 'text-error',   bg: 'bg-error/10',   border: 'border-error/20',   icon: <TrendingDown className="w-4 h-4" /> },
};

function getMeta(type: string) {
  return TYPE_META[type?.toLowerCase()] ?? TYPE_META['sip'];
}

function PolicyCard({ policy, compareMode, selected, onDelete, onToggleCompare, onView }: {
  policy: Policy;
  compareMode: boolean;
  selected: boolean;
  onDelete: () => void;
  onToggleCompare: () => void;
  onView: () => void;
}) {
  const meta = getMeta(policy.type);
  const d = policy.data || {};
  const metrics: { label: string; value: string }[] = [];

  if (d.totalValue)      metrics.push({ label: 'Final Value',   value: `₹${formatCurrency(d.totalValue)}` });
  if (d.totalInvestment) metrics.push({ label: 'Invested',      value: `₹${formatCurrency(d.totalInvestment)}` });
  if (d.totalReturns)    metrics.push({ label: 'Returns',       value: `₹${formatCurrency(d.totalReturns)}` });
  if (d.cagr)            metrics.push({ label: 'CAGR',          value: `${Number(d.cagr).toFixed(2)}%` });
  if (d.monthlyRequired) metrics.push({ label: 'Monthly SIP',   value: `₹${formatCurrency(d.monthlyRequired)}` });
  if (d.corpusRequired)  metrics.push({ label: 'Corpus Needed', value: `₹${formatCurrency(d.corpusRequired)}` });
  if (d.futureValue)     metrics.push({ label: 'Future Cost',   value: `₹${formatCurrency(d.futureValue)}` });

  return (
    <div
      onClick={() => compareMode ? onToggleCompare() : onView()}
      className={`group card p-5 flex flex-col gap-4 transition-all cursor-pointer relative
        ${selected ? 'ring-2 ring-blue border-blue bg-blue/5' : 'hover:border-slate-600'}
        ${compareMode ? 'hover:border-blue/50' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-10 border ${meta.bg} ${meta.color} ${meta.border}`}>
          {meta.icon} {meta.label}
        </span>
        {!compareMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-8 text-slate-500 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        {compareMode && selected && (
          <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">✓</span>
          </div>
        )}
      </div>

      {/* Name / desc */}
      <div>
        <h3 className="font-bold text-white truncate text-sm mb-0.5">{policy.name}</h3>
        <p className="text-xs text-slate-500 truncate">{policy.description}</p>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {metrics.slice(0, 4).map(m => (
            <div key={m.label} className="bg-slate-800/50 rounded-10 p-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{m.label}</p>
              <p className={`text-xs font-bold font-numbers ${meta.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-auto">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Calendar className="w-3 h-3" />
          {policy.effectiveDate}
        </span>
        <span className={`text-xs font-bold flex items-center gap-1 ${meta.color} group-hover:underline`}>
          View <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const PoliciesPage: React.FC = () => {
  const { policies, loading, loadPolicies, deletePolicy, clearAll } = usePolicyStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => { loadPolicies(user?.id); }, [user]);

  const filtered = policies.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || p.type?.toLowerCase() === typeFilter;
    return matchSearch && matchType;
  });

  const toggleCompare = (id: string) =>
    setSelectedForCompare(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );

  const types = ['all', ...Array.from(new Set(policies.map(p => p.type?.toLowerCase()).filter(Boolean)))];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <Helmet>
        <title>My Financial Policies – Save, Compare & Track Investment Scenarios | Finlytic</title>
        <meta name="description" content="Manage and compare all your saved financial scenarios on Finlytic. Track SIP, SWP, lumpsum, and retirement plans side-by-side to make the best investment decisions." />
        <meta name="keywords" content="financial policy manager, investment scenario comparison, saved SIP plans, financial dashboard India, compare investment returns, mutual fund scenario tracker" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://finlytic.in/policies" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finlytic.in/policies" />
        <meta property="og:title" content="My Financial Policies | Finlytic Dashboard" />
        <meta property="og:description" content="View and compare your saved investment scenarios — SIP, SWP, CAGR, Lumpsum, and more." />
        <meta property="og:image" content="https://finlytic.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Financial Policies | Finlytic" />
        <meta name="twitter:description" content="Compare and manage all your saved investment plans in one place." />
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sora flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-blue" />
            My Policies
          </h1>
          <p className="text-slate-400 mt-1">All your saved financial scenarios in one place</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={compareMode ? 'primary' : 'secondary'}
            onClick={() => { setCompareMode(!compareMode); setSelectedForCompare([]); }}
            icon={<ArrowRightLeft className="w-4 h-4" />}
          >
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </Button>
          {policies.length > 0 && (
            <button
              onClick={() => clearAll(user?.id)}
              className="h-11 px-4 text-sm flex items-center gap-2 rounded-10 border border-error/30 bg-error/5 text-error hover:bg-error hover:text-white transition-all font-semibold"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {policies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4 bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Saved</p>
            <p className="text-2xl font-bold text-white font-numbers">{policies.length}</p>
            <p className="text-xs text-slate-500 mt-1">Policies</p>
          </div>
          <div className="card p-4 bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Calculator Types</p>
            <p className="text-2xl font-bold text-blue font-numbers">{new Set(policies.map(p=>p.type)).size}</p>
            <p className="text-xs text-slate-500 mt-1">Unique tools used</p>
          </div>
          <div className="card p-4 bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Saved</p>
            <p className="text-sm font-bold text-green mt-1">{policies[policies.length-1]?.effectiveDate ?? '—'}</p>
            <p className="text-xs text-slate-500 mt-1">Most recent entry</p>
          </div>
          <div className="card p-4 bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Compare Limit</p>
            <p className="text-2xl font-bold text-warning font-numbers">3</p>
            <p className="text-xs text-slate-500 mt-1">Max simultaneous</p>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved policies..."
            className="w-full pl-10 pr-4 h-11 rounded-10 border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:border-blue focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-10 border transition-all
                ${typeFilter === t
                  ? 'bg-blue text-white border-blue'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-blue/50 hover:text-white'
                }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500 text-sm">Loading policies...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-20 text-center bg-slate-900/50 border border-dashed border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-5 rounded-full">
              <FileText className="w-12 h-12 text-slate-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No policies saved yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
            Use any calculator and click <strong>"Save as Policy"</strong> to store your scenarios here for future reference.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {['SIP Calculator', 'SWP Calculator', 'CAGR Calculator'].map(name => (
              <span key={name} className="px-4 py-2 rounded-10 border border-slate-700 text-slate-400 text-xs font-bold">{name}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(policy => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              compareMode={compareMode}
              selected={!!(policy.id && selectedForCompare.includes(policy.id))}
              onDelete={() => policy.id && deletePolicy(policy.id, user?.id)}
              onToggleCompare={() => policy.id && toggleCompare(policy.id)}
              onView={() => setViewPolicy(policy)}
            />
          ))}
        </div>
      )}

      {/* Compare Floating Bar */}
      {compareMode && selectedForCompare.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-full shadow-2xl z-[60] flex items-center gap-6">
          <span className="text-sm font-bold">{selectedForCompare.length}/3 selected</span>
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-5 py-2 bg-blue rounded-full text-sm font-bold hover:bg-blue/80 transition-all"
          >
            Compare Now
          </button>
          <button onClick={() => setSelectedForCompare([])} className="text-slate-400 text-xs font-bold hover:text-white transition-all">
            Clear
          </button>
        </div>
      )}

      {/* Policy Detail Modal */}
      {viewPolicy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setViewPolicy(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-24 p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-10 border mb-3 ${getMeta(viewPolicy.type).bg} ${getMeta(viewPolicy.type).color} ${getMeta(viewPolicy.type).border}`}>
                  {getMeta(viewPolicy.type).icon} {getMeta(viewPolicy.type).label}
                </span>
                <h2 className="text-xl font-bold text-white font-sora">{viewPolicy.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{viewPolicy.description}</p>
              </div>
              <button onClick={() => setViewPolicy(null)} className="p-2 hover:bg-slate-800 rounded-10 text-slate-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(viewPolicy.data || {}).filter(([k, v]) => typeof v === 'number' || typeof v === 'string').slice(0, 8).map(([k, v]) => (
                <div key={k} className="bg-slate-800 rounded-10 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className={`text-sm font-bold font-numbers ${getMeta(viewPolicy.type).color}`}>
                    {typeof v === 'number' && v > 1000 ? `₹${formatCurrency(v as number)}` : String(v)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">Saved on {viewPolicy.effectiveDate}</span>
              <button
                onClick={() => { if (viewPolicy.id) deletePolicy(viewPolicy.id, user?.id); setViewPolicy(null); }}
                className="ml-auto flex items-center gap-1.5 text-xs text-error hover:text-white hover:bg-error px-3 py-1.5 rounded-10 transition-all font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Compare Policies Modal */}
      {compareModalOpen && (
        <ComparePoliciesModal
          policies={policies.filter(p => p.id && selectedForCompare.includes(p.id))}
          onClose={() => setCompareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PoliciesPage;
