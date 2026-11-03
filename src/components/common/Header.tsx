import React from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  UserPlus, 
  Search, 
  RotateCcw,
  Printer
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    facility, 
    setIsLockdownModalOpen, 
    setIsBookingModalOpen,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    resetToDefaults
  } = usePrison();

  const isLockdown = facility.facilityAlertLevel !== 'Normal Operations';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
      {/* Zone 1: Institutional Wordmark & Facility Code */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 border border-slate-700 text-amber-500 font-bold text-xs tracking-wider">
          PIMS
        </div>
        <div className="leading-tight">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
            {facility.facilityName}
          </span>
          <span className="text-xs font-mono text-slate-400 block">
            {facility.institutionCode} · LEVEL-IV CORRECTIONAL FACILITY
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inmate by name, ID (e.g. INM-84920), cell, or charge..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() && window.location.hash !== '#inmates') {
                setActiveTab('inmates');
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/80 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Security Protocol Button & Primary Intake Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Reset / Demo restore button */}
        <button
          onClick={() => {
            if (confirm("Reset prison system data to initial state?")) {
              resetToDefaults();
            }
          }}
          title="Restore Initial Facility Records"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Security Alert Status Badge / Trigger */}
        <button
          onClick={() => setIsLockdownModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-colors whitespace-nowrap ${
            facility.facilityAlertLevel === 'Normal Operations'
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/40'
              : facility.facilityAlertLevel === 'Elevated Precaution'
              ? 'bg-amber-950/60 text-amber-300 border-amber-700 hover:bg-amber-900/60 animate-pulse'
              : 'bg-red-950/80 text-red-200 border-red-700 hover:bg-red-900/80 animate-pulse'
          }`}
        >
          {facility.facilityAlertLevel === 'Normal Operations' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          )}
          <span>{facility.facilityAlertLevel}</span>
        </button>

        {/* Primary Action: New Inmate Booking Intake */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Inmate Intake</span>
        </button>
      </div>
    </header>
  );
};
