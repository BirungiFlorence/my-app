import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { VisitorRecord } from '../../types/prison';
import { 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  Search,
  Filter,
  X
} from 'lucide-react';

export const VisitorsView: React.FC = () => {
  const { 
    visitors, 
    inmates, 
    addVisitor, 
    updateVisitorStatus,
    isVisitorModalOpen,
    setIsVisitorModalOpen
  } = usePrison();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Visit Form
  const [visitorName, setVisitorName] = useState('');
  const [idType, setIdType] = useState<VisitorRecord['idDocumentType']>('Driver License');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('(555) 000-0000');
  const [selectedInmateId, setSelectedInmateId] = useState(inmates[0]?.id || '');
  const [relationship, setRelationship] = useState<VisitorRecord['relationship']>('Immediate Family');
  const [timeSlot, setTimeSlot] = useState('11:00 - 12:00');
  const [boothNumber, setBoothNumber] = useState('Booth 02');

  const filteredVisitors = visitors.filter(vis => {
    if (statusFilter !== 'ALL' && vis.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVis = vis.visitorName.toLowerCase().includes(q);
      const matchInm = vis.inmateName.toLowerCase().includes(q);
      const matchId = vis.idNumber.toLowerCase().includes(q);
      if (!matchVis && !matchInm && !matchId) return false;
    }
    return true;
  });

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !idNumber.trim()) {
      alert("Please provide the visitor's full legal name and ID number.");
      return;
    }

    const inmate = inmates.find(i => i.id === selectedInmateId);

    addVisitor({
      visitorName: visitorName.trim(),
      idDocumentType: idType,
      idNumber: idNumber.trim(),
      phone: phone.trim(),
      inmateId: selectedInmateId,
      inmateName: inmate ? `${inmate.firstName} ${inmate.lastName}` : 'Assigned Inmate',
      relationship,
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot,
      boothNumber,
      backgroundCheck: 'Approved',
      contrabandScreeningPassed: false,
      status: 'Scheduled',
      officerNotes: 'Scheduled in visiting hall queue.'
    });

    setIsVisitorModalOpen(false);
    setVisitorName('');
    setIdNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Visitor Registration & Access Control
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure visitor intake, government ID verification, contraband checkpoints, and booth tracking
            </p>
          </div>

          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Visit</span>
          </button>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
          <div>
            <input
              type="text"
              placeholder="Search visitor name, inmate, or government ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Visit Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Checked In">Currently Checked In</option>
              <option value="Completed">Completed</option>
              <option value="Denied Entry">Denied Entry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 pl-4">Visitor Profile</th>
                <th className="py-2.5">Gov ID Credentials</th>
                <th className="py-2.5">Visiting Offender</th>
                <th className="py-2.5">Relationship</th>
                <th className="py-2.5">Time & Booth</th>
                <th className="py-2.5">Security Screening</th>
                <th className="py-2.5">Visit Status</th>
                <th className="py-2.5 pr-4 text-right">Checkpoint Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No visitor records match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map(vis => (
                  <tr key={vis.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-4">
                      <div className="font-semibold text-slate-100">{vis.visitorName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{vis.phone}</div>
                    </td>

                    <td className="py-3 font-mono text-[11px]">
                      <div className="text-slate-300 font-semibold">{vis.idNumber}</div>
                      <div className="text-slate-500">{vis.idDocumentType}</div>
                    </td>

                    <td className="py-3">
                      <div className="font-medium text-amber-400">{vis.inmateName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{vis.inmateId}</div>
                    </td>

                    <td className="py-3 text-slate-300">
                      {vis.relationship}
                    </td>

                    <td className="py-3 font-mono text-[11px]">
                      <div className="text-slate-200">{vis.timeSlot}</div>
                      <div className="text-slate-500">{vis.boothNumber}</div>
                    </td>

                    {/* Screening Status */}
                    <td className="py-3">
                      {vis.contrabandScreeningPassed ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CLEARED</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-amber-400/80">
                          PENDING SCREEN
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                        vis.status === 'Checked In'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 font-bold'
                          : vis.status === 'Denied Entry'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : vis.status === 'Completed'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {vis.status}
                      </span>
                    </td>

                    {/* Checkpoint Actions */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {vis.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => updateVisitorStatus(vis.id, 'Checked In', true)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded transition-colors"
                            >
                              Check In (Screened)
                            </button>
                            <button
                              onClick={() => updateVisitorStatus(vis.id, 'Denied Entry', false)}
                              className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/60 border border-rose-800 rounded"
                            >
                              Deny
                            </button>
                          </>
                        )}

                        {vis.status === 'Checked In' && (
                          <button
                            onClick={() => updateVisitorStatus(vis.id, 'Completed')}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors"
                          >
                            Conclude Visit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4 my-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Schedule Inmate Visitation Appointment
                </h3>
              </div>
              <button
                onClick={() => setIsVisitorModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Visitor Legal Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Gonzalez"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Government ID Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Driver License">State Driver License</option>
                    <option value="Passport">U.S. / International Passport</option>
                    <option value="State ID">State Identification Card</option>
                    <option value="Bar Association Card">State Bar Card (Attorney)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">ID Document Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-X8910482"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Inmate to Visit</label>
                  <select
                    value={selectedInmateId}
                    onChange={(e) => setSelectedInmateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {inmates.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.lastName}, {i.firstName} ({i.cellBlock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Immediate Family">Immediate Family</option>
                    <option value="Attorney / Legal Counsel">Attorney / Legal Counsel</option>
                    <option value="Clergy">Clergy / Faith Leader</option>
                    <option value="Case Officer">Case Officer</option>
                    <option value="Authorized Visitor">Approved Friend / Contact</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Assigned Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="09:00 - 10:00">09:00 - 10:00 AM</option>
                    <option value="10:00 - 11:00">10:00 - 11:00 AM</option>
                    <option value="11:00 - 12:00">11:00 - 12:00 PM</option>
                    <option value="13:30 - 14:30">13:30 - 14:30 PM</option>
                    <option value="15:00 - 16:00">15:00 - 16:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Visiting Booth / Room</label>
                  <input
                    type="text"
                    value={boothNumber}
                    onChange={(e) => setBoothNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded transition-colors"
                >
                  Confirm Visitation Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
