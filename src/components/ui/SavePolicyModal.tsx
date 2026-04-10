import React, { useState, useEffect, useRef } from 'react';
import { BookMarked, X } from 'lucide-react';

interface SavePolicyModalProps {
  isOpen: boolean;
  defaultName: string;
  description: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const SavePolicyModal: React.FC<SavePolicyModalProps> = ({
  isOpen,
  defaultName,
  description,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1526] border border-slate-700 rounded-24 p-8 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue/10 border border-blue/20 p-2.5 rounded-12">
              <BookMarked className="w-5 h-5 text-blue" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sora">Save Policy</h2>
              <p className="text-xs text-slate-400 mt-0.5">Give this calculation a name to save it for later comparison.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-10 text-slate-500 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description preview */}
        {description && (
          <div className="mb-5 px-3 py-2.5 bg-slate-800/60 border border-slate-700 rounded-10 text-xs text-slate-400">
            {description}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            POLICY NAME
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Retirement Plan 2026"
            className="w-full h-12 px-4 rounded-10 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue transition-all text-sm font-medium"
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-10 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 h-11 rounded-10 bg-blue text-white font-bold text-sm hover:bg-blue/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavePolicyModal;
