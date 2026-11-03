import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { StaffOfficer } from '../../types/prison';
import { 
  ShieldCheck, 
  Radio, 
  Phone, 
  Users, 
  Clock, 
  Search, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const StaffRosterView: React.FC = () => {
  const { staff, updateStaffStatus } = usePrison();
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStaff = staff.filter(s => {
    if (shiftFilter !== 'ALL' && !s.shift.includes(shiftFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchBadge = s.badge.toLowerCase().includes(q);
      const matchPost = s.assignedPost.toLowerCase().includes(q);
      if (!matchName && !matchBadge && !matchPost) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Correctional Staff & Guard Shift Roster
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active post assignments, supervisory chain of command, and perimeter coverage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 text-emerald-400 rounded font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{staff.filter(s => s.status === 'On Duty' || s.status === 'On Patrol').length} Officers Active</span>
            </span>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
          <div>
            <input
              type="text"
              placeholder="Search officer name, badge number, post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="ALL">All Operational Shifts</option>
              <option value="Day Shift">Day Shift (06:00 - 14:00)</option>
              <option value="Swing Shift">Swing Shift (14:00 - 22:00)</option>
              <option value="Night Shift">Night Shift (22:00 - 06:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(officer => (
          <div key={officer.id} className="p-4 bg-slate-900 border border-slate-800 rounded space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <span>{officer.name}</span>
                </div>
                <div className="font-mono text-[11px] text-amber-400 font-semibold mt-0.5">
                  {officer.rank} · Badge #{officer.badge}
                </div>
              </div>

              <select
                value={officer.status}
                onChange={(e) => updateStaffStatus(officer.id, e.target.value as any)}
                className={`font-mono text-[10px] px-2 py-0.5 rounded border focus:outline-none ${
                  officer.status === 'On Duty'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800 font-bold'
                    : officer.status === 'On Patrol'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : officer.status === 'Meal Break'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="On Duty">On Duty</option>
                <option value="On Patrol">On Patrol</option>
                <option value="Meal Break">Meal Break</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded space-y-1 font-mono">
              <div className="text-slate-400 text-[10px] uppercase">Assigned Security Post</div>
              <div className="font-semibold text-slate-200">{officer.assignedPost}</div>
            </div>

            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-1">
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>{officer.radioChannel}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Ext. {officer.phoneExtension}</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
              Shift: {officer.shift}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
