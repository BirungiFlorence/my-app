import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { FacilityAlertLevel } from '../../types/prison';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const LockdownModal: React.FC = () => {
  const { 
    facility, 
    setFacilityAlertLevel, 
    isLockdownModalOpen, 
    setIsLockdownModalOpen 
  } = usePrison();

  const [selectedLevel, setSelectedLevel] = useState<FacilityAlertLevel>(facility.facilityAlertLevel);
  const [reason, setReason] = useState<string>(facility.lockdownReason || '');

  if (!isLockdownModalOpen) return null;

  const handleApply = () => {
    setFacilityAlertLevel(selectedLevel, reason);
    setIsLockdownModalOpen(false);
  };

  const levels: { level: FacilityAlertLevel; desc: string; color: string; badge: string }[] = [
    {
      level: 'Normal Operations',
      desc: 'Standard scheduled movement, work crews, outdoor recreation, and regular visitation enabled.',
      color: 'border-emerald-700 bg-emerald-950/20 text-emerald-300',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      level: 'Elevated Precaution',
      desc: 'Enhanced pat-downs, two-officer escorts in maximum wings, and heightened watchtower readiness.',
      color: 'border-amber-700 bg-amber-950/20 text-amber-300',
      badge: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      level: 'Cellblock Lockdown',
      desc: 'Specific housing block locked in cells. Dayrooms cleared. Internal block movement frozen.',
      color: 'border-rose-700 bg-rose-950/30 text-rose-300',
      badge: 'bg-rose-950 text-rose-300 border-rose-800'
    },
    {
      level: 'Facility Full Lockdown',
      desc: 'CRITICAL EMERGENCY: All cell doors electronically deadbolted. Perimeter Sally Ports sealed. Immediate headcount required.',
      color: 'border-red-600 bg-red-950/50 text-red-200',
      badge: 'bg-red-900 text-red-200 border-red-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-xl p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Facility Security Protocol & Alert State
            </h3>
          </div>
          <button
            onClick={() => setIsLockdownModalOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-400">
          Select authorized correctional facility alert posture. Command overrides will be broadcast to all control rooms and logged to the permanent institutional archive.
        </p>

        {/* Level Options */}
        <div className="space-y-2.5">
          {levels.map(item => (
            <div
              key={item.level}
              onClick={() => setSelectedLevel(item.level)}
              className={`p-3.5 rounded border cursor-pointer transition-all ${
                selectedLevel === item.level
                  ? `${item.color} ring-1 ring-amber-400`
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white tracking-wide">
                  {item.level}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badge}`}>
                  {selectedLevel === item.level ? 'SELECTED' : 'OPTION'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Reason / Incident Directive */}
        {selectedLevel !== 'Normal Operations' && (
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 block">
              Authorization Directive / Security Reason *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Unscheduled contraband search in Block C following altercation"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsLockdownModalOpen(false)}
            className="px-3 py-1.5 text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className={`px-4 py-1.5 font-semibold rounded text-slate-950 transition-colors ${
              selectedLevel === 'Normal Operations'
                ? 'bg-emerald-400 hover:bg-emerald-300'
                : 'bg-red-500 hover:bg-red-400 text-white'
            }`}
          >
            Enforce Security State
          </button>
        </div>
      </div>
    </div>
  );
};
