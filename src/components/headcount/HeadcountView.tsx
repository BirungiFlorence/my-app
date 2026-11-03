import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { CountShift, HousingBlockCode } from '../../types/prison';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Printer, 
  RotateCw, 
  UserCheck, 
  Filter,
  CheckCheck
} from 'lucide-react';

export const HeadcountView: React.FC = () => {
  const { 
    headcount, 
    verifyInmateInCount, 
    flagInmateUnaccounted, 
    reconcileHeadcount, 
    startNewHeadcount,
    facility 
  } = usePrison();

  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');
  const [supervisorName, setSupervisorName] = useState('Captain J. Miller (#101)');
  const [showSignoffSuccess, setShowSignoffSuccess] = useState(false);

  const verifications = headcount.inmateVerifications || [];

  const filteredVerifications = verifications.filter(v => {
    if (selectedBlockFilter !== 'ALL' && v.cellBlock !== selectedBlockFilter) {
      return false;
    }
    return true;
  });

  const progressPercent = headcount.censusTarget > 0 
    ? Math.round((headcount.verifiedTotal / headcount.censusTarget) * 100) 
    : 100;

  // Batch verify block
  const handleBatchVerifyBlock = (blockCode: string) => {
    verifications
      .filter(v => v.cellBlock === blockCode && !v.verified)
      .forEach(v => {
        verifyInmateInCount(v.inmateId, true, "Verified during physical tier pass");
      });
  };

  const handleVerifyAll = () => {
    verifications
      .filter(v => !v.verified)
      .forEach(v => {
        verifyInmateInCount(v.inmateId, true, "Verified during muster sweep");
      });
  };

  const handleReconcile = () => {
    reconcileHeadcount(supervisorName);
    setShowSignoffSuccess(true);
    setTimeout(() => setShowSignoffSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Shift Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Facility Muster & Census Verification
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Mandatory institutional headcounts · Department of Corrections Protocol §402
            </p>
          </div>

          {/* Shift Picker / New Count */}
          <div className="flex items-center gap-2">
            <select
              value={headcount.shift}
              onChange={(e) => startNewHeadcount(e.target.value as CountShift)}
              className="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500 font-mono font-medium"
            >
              <option value="Morning Muster (06:00)">Morning Muster (06:00)</option>
              <option value="Midday Count (12:00)">Midday Count (12:00)</option>
              <option value="Evening Muster (18:00)">Evening Muster (18:00)</option>
              <option value="Night Lockup (22:00)">Night Lockup (22:00)</option>
            </select>

            <button
              onClick={() => startNewHeadcount(headcount.shift)}
              title="Reset and start new count round"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset Count</span>
            </button>
          </div>
        </div>

        {/* Count Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-300 font-semibold">
              Muster Progress: {headcount.verifiedTotal} of {headcount.censusTarget} Verified
            </span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
              headcount.status === 'Reconciled'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : headcount.status === 'Emergency Discrepancy'
                ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              {headcount.status}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded transition-all duration-300 ${
                headcount.status === 'Emergency Discrepancy'
                  ? 'bg-red-500'
                  : headcount.verifiedTotal === headcount.censusTarget
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Emergency Discrepancy Warning */}
      {headcount.unaccountedCount > 0 && (
        <div className="p-4 bg-red-950/80 border border-red-700 rounded text-red-100 flex items-start justify-between animate-pulse">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm uppercase">
                EMERGENCY HEADCOUNT DISCREPANCY: {headcount.unaccountedCount} INMATE(S) UNACCOUNTED
              </div>
              <p className="text-xs text-red-200 mt-1">
                A physical verification check failed. Tier officers must immediately halt all inmate movement and conduct secondary master verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Block Filter & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Filter Block:</span>
          {['ALL', 'Block A', 'Block B', 'Block C', 'Block D', 'Ward M'].map(blk => (
            <button
              key={blk}
              onClick={() => setSelectedBlockFilter(blk)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                selectedBlockFilter === blk
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {blk}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {selectedBlockFilter !== 'ALL' && (
            <button
              onClick={() => handleBatchVerifyBlock(selectedBlockFilter)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 text-xs flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Entire {selectedBlockFilter}</span>
            </button>
          )}

          <button
            onClick={handleVerifyAll}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 text-xs flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify All Remaining ({headcount.censusTarget - headcount.verifiedTotal})</span>
          </button>
        </div>
      </div>

      {/* Inmate Muster Checklist Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 pl-4">Verification Status</th>
                <th className="py-2.5">Inmate ID & Name</th>
                <th className="py-2.5">Housing Cell</th>
                <th className="py-2.5">Custody Status</th>
                <th className="py-2.5">Verification Log</th>
                <th className="py-2.5 pr-4 text-right">Physical Check Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVerifications.map(item => (
                <tr 
                  key={item.inmateId} 
                  className={`transition-colors ${
                    item.flaggedUnaccounted 
                      ? 'bg-red-950/40 hover:bg-red-950/60' 
                      : item.verified 
                      ? 'hover:bg-slate-800/40' 
                      : 'bg-amber-950/10 hover:bg-slate-800/40'
                  }`}
                >
                  {/* Status Indicator */}
                  <td className="py-3 pl-4">
                    {item.flaggedUnaccounted ? (
                      <span className="flex items-center gap-1.5 font-bold font-mono text-red-400">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span>UNACCOUNTED</span>
                      </span>
                    ) : item.verified ? (
                      <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-mono text-amber-400/80">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>PENDING</span>
                      </span>
                    )}
                  </td>

                  {/* Inmate Details */}
                  <td className="py-3">
                    <div className="font-semibold text-slate-200">{item.inmateName}</div>
                    <div className="font-mono text-[11px] text-slate-500">{item.inmateId}</div>
                  </td>

                  {/* Cell Location */}
                  <td className="py-3 font-mono">
                    <div className="text-slate-200 font-bold">{item.cellNumber}</div>
                    <div className="text-[11px] text-slate-500">{item.cellBlock}</div>
                  </td>

                  {/* Custody Status */}
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                      {item.status}
                    </span>
                  </td>

                  {/* Log Note */}
                  <td className="py-3 text-[11px] text-slate-400 font-mono">
                    {item.verifiedAt ? (
                      <div>
                        <span className="text-slate-300">{item.verifiedAt}</span> by {item.verifiedBy || 'Officer'}
                        {item.notes && <div className="text-slate-500 truncate max-w-xs">{item.notes}</div>}
                      </div>
                    ) : (
                      <span className="text-slate-600">Awaiting visual tier confirmation</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!item.verified ? (
                        <button
                          onClick={() => verifyInmateInCount(item.inmateId, true)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded transition-colors"
                        >
                          Confirm Present
                        </button>
                      ) : (
                        <button
                          onClick={() => verifyInmateInCount(item.inmateId, false)}
                          className="px-2 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700"
                        >
                          Revoke
                        </button>
                      )}

                      {!item.flaggedUnaccounted ? (
                        <button
                          onClick={() => flagInmateUnaccounted(item.inmateId, true)}
                          className="px-2 py-1 text-[11px] font-semibold bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded transition-colors"
                        >
                          Flag Missing
                        </button>
                      ) : (
                        <button
                          onClick={() => flagInmateUnaccounted(item.inmateId, false)}
                          className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 rounded"
                        >
                          Clear Flag
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Supervisor Sign-off Reconciliation Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Muster Reconciliation & Electronic Certification
            </h3>
            <p className="text-xs text-slate-400">
              Department regulation requires watch commander certification following physical count verification
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 whitespace-nowrap">Supervisor:</label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleReconcile}
              className="px-4 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors whitespace-nowrap shadow-sm"
            >
              Certify & Sign Off Muster
            </button>
          </div>
        </div>

        {showSignoffSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-700 rounded text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Official Muster Count certified and archived to facility ledger. Log Timestamp: {new Date().toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
