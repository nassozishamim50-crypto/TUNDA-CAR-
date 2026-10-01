import React from 'react';
import { X, Trash2, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { formatUgx, getWhatsAppLink } from '../utils/formatters';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedVehicles: Vehicle[];
  onRemoveSaved: (id: string) => void;
  onViewVehicle: (id: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedVehicles,
  onRemoveSaved,
  onViewVehicle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base">Saved Listings</span>
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {savedVehicles.length}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {savedVehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No saved vehicles yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click the heart icon on any vehicle card to save it for quick comparison.
              </p>
            </div>
          ) : (
            savedVehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50"
              >
                <img
                  src={v.images[0]}
                  alt={v.title}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{v.title}</h4>
                  <p className="text-xs font-black text-amber-600 mt-0.5">{formatUgx(v.priceUgx)}</p>
                  <p className="text-[11px] text-slate-500 truncate">{v.location} • {v.sellerName}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onViewVehicle(v.id);
                      onClose();
                    }}
                    className="p-2 bg-slate-900 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    title="View vehicle"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveSaved(v.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
