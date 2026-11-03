import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  Inmate, 
  SecurityLevel, 
  CustodyStatus, 
  HousingBlockCode 
} from '../../types/prison';
import { 
  Search, 
  Filter, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Eye, 
  ArrowUpDown, 
  Printer, 
  UserPlus,
  Bed,
  CheckCircle2
} from 'lucide-react';

export const InmatesRosterView: React.FC = () => {
  const { 
    inmates, 
    searchQuery, 
    setSearchQuery, 
    setSelectedInmateForDossier,
    setSelectedInmateForPrint,
    setIsBookingModalOpen,
    updateInmateStatus
  } = usePrison();

  const [securityFilter, setSecurityFilter] = useState<string>('ALL');
  const [blockFilter, setBlockFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'cell' | 'admission'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Quick cell transfer modal state
  const [reassignModalInmate, setReassignModalInmate] = useState<Inmate | null>(null);

  // Filter logic
  const filteredInmates = inmates.filter(inmate => {
    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const fullName = `${inmate.firstName} ${inmate.lastName} ${inmate.middleName || ''}`.toLowerCase();
      const matchName = fullName.includes(q);
      const matchId = inmate.id.toLowerCase().includes(q);
      const matchBooking = inmate.bookingNumber.toLowerCase().includes(q);
      const matchOffense = inmate.primaryOffense.toLowerCase().includes(q);
      const matchCell = inmate.cellNumber.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchBooking && !matchOffense && !matchCell) {
        return false;
      }
    }

    // Security level filter
    if (securityFilter !== 'ALL' && inmate.securityLevel !== securityFilter) {
      return false;
    }

    // Housing block filter
    if (blockFilter !== 'ALL' && inmate.cellBlock !== blockFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && inmate.custodyStatus !== statusFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.lastName.localeCompare(b.lastName);
    } else if (sortBy === 'id') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortBy === 'cell') {
      comparison = a.cellNumber.localeCompare(b.cellNumber);
    } else if (sortBy === 'admission') {
      comparison = new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Inmate Master Custody Roster</h2>
              <p className="text-xs text-slate-400">
                Authorized census of all active and segregated offenders
              </p>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 text-amber-400 rounded font-semibold">
              {filteredInmates.length} Records Found
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Intake New Offender</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, ID, charge, cell..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Security Tier */}
          <div>
            <select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Security Tiers</option>
              <option value="Minimum">Minimum Security</option>
              <option value="Medium">Medium Security</option>
              <option value="Maximum">Maximum Security</option>
              <option value="Supermax">Supermax / Administrative</option>
            </select>
          </div>

          {/* Housing Block */}
          <div>
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Housing Blocks</option>
              <option value="Block A">Block A (Minimum)</option>
              <option value="Block B">Block B (Medium)</option>
              <option value="Block C">Block C (Maximum)</option>
              <option value="Block D">Block D (Segregation)</option>
              <option value="Ward M">Ward M (Medical)</option>
            </select>
          </div>

          {/* Custody Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Custody Statuses</option>
              <option value="In Custody">In Custody</option>
              <option value="Solitary Confinement">Solitary Confinement</option>
              <option value="Medical Ward">Medical Ward</option>
              <option value="Court Transit">Court Transit</option>
              <option value="Work Detail">Work Detail</option>
              <option value="Released">Released</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inmate Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 pl-4 cursor-pointer hover:text-white" onClick={() => {
                  if (sortBy === 'name') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('name'); setSortOrder('asc'); }
                }}>
                  <div className="flex items-center gap-1.5">
                    <span>Inmate Profile</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => {
                  if (sortBy === 'id') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('id'); setSortOrder('asc'); }
                }}>
                  <div className="flex items-center gap-1.5">
                    <span>Identifiers</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5">Security Tier</th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => {
                  if (sortBy === 'cell') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('cell'); setSortOrder('asc'); }
                }}>
                  <div className="flex items-center gap-1.5">
                    <span>Housing Location</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5">Primary Charges</th>
                <th className="py-2.5">Custody Status</th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => {
                  if (sortBy === 'admission') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('admission'); setSortOrder('asc'); }
                }}>
                  <div className="flex items-center gap-1.5">
                    <span>Admission / Release</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInmates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No inmate records match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInmates.map((inmate) => (
                  <tr key={inmate.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Inmate Photo & Full Name */}
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        {inmate.photoUrl ? (
                          <img 
                            src={inmate.photoUrl} 
                            alt={`${inmate.firstName} ${inmate.lastName}`}
                            className="w-10 h-10 rounded object-cover border border-slate-700 shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-300 shrink-0">
                            {inmate.firstName[0]}{inmate.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-2">
                            <span>{inmate.lastName}, {inmate.firstName} {inmate.middleName || ''}</span>
                            {inmate.suicideWatch && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-950 text-red-300 border border-red-700 rounded">
                                SUICIDE WATCH
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            DOB: <span className="font-mono">{inmate.dateOfBirth}</span> · {inmate.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="py-3 font-mono text-[11px] text-slate-300">
                      <div className="font-semibold text-amber-400">{inmate.id}</div>
                      <div className="text-slate-500">Book: {inmate.bookingNumber}</div>
                    </td>

                    {/* Security Tier */}
                    <td className="py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        inmate.securityLevel === 'Supermax'
                          ? 'bg-rose-950 text-rose-300 border-rose-800 font-bold'
                          : inmate.securityLevel === 'Maximum'
                          ? 'bg-red-950 text-red-300 border-red-800 font-semibold'
                          : inmate.securityLevel === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {inmate.securityLevel}
                      </span>
                    </td>

                    {/* Housing Location */}
                    <td className="py-3">
                      <div className="font-mono font-semibold text-slate-200">
                        {inmate.cellNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inmate.cellBlock} ({inmate.bunk} Bunk)
                      </div>
                    </td>

                    {/* Primary Charge */}
                    <td className="py-3 max-w-[220px]">
                      <div className="text-slate-200 font-medium truncate" title={inmate.primaryOffense}>
                        {inmate.primaryOffense}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {inmate.charges.length} active charges
                      </div>
                    </td>

                    {/* Custody Status */}
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${
                        inmate.custodyStatus === 'Solitary Confinement'
                          ? 'bg-red-950/70 text-red-300 border-red-800'
                          : inmate.custodyStatus === 'Medical Ward'
                          ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800'
                          : inmate.custodyStatus === 'Court Transit'
                          ? 'bg-purple-950/70 text-purple-300 border-purple-800'
                          : inmate.custodyStatus === 'Work Detail'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {inmate.custodyStatus}
                      </span>
                    </td>

                    {/* Admission / Release */}
                    <td className="py-3 font-mono text-[11px]">
                      <div className="text-slate-300">In: {inmate.admissionDate}</div>
                      <div className="text-slate-500">Rel: {inmate.projectedReleaseDate}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInmateForDossier(inmate)}
                          title="Open Inmate Master Dossier"
                          className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => setSelectedInmateForPrint(inmate)}
                          title="Print Custody Booking Sheet"
                          className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
