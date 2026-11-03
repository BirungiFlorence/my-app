import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  IncidentReport, 
  IncidentCategory, 
  IncidentSeverity, 
  HousingBlockCode 
} from '../../types/prison';
import { 
  AlertOctagon, 
  Plus, 
  ShieldAlert, 
  FileText, 
  Gavel, 
  Search, 
  Clock, 
  CheckCircle,
  X
} from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const { 
    incidents, 
    inmates, 
    addIncident, 
    updateIncidentStatus,
    isIncidentModalOpen,
    setIsIncidentModalOpen
  } = usePrison();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Adjudication Modal
  const [adjudicatingIncident, setAdjudicatingIncident] = useState<IncidentReport | null>(null);
  const [newStatus, setNewStatus] = useState<IncidentReport['disciplinaryStatus']>('Sanctions Imposed');
  const [newSanctions, setNewSanctions] = useState<string>('');

  // New Incident Form State
  const [category, setCategory] = useState<IncidentCategory>('Physical Altercation');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [location, setLocation] = useState('Block B Dayroom');
  const [cellBlock, setCellBlock] = useState<HousingBlockCode>('Block B');
  const [reportingOfficer, setReportingOfficer] = useState('Sgt. D. Kowalski');
  const [badgeNumber, setBadgeNumber] = useState('408');
  const [selectedInmateId, setSelectedInmateId] = useState(inmates[0]?.id || '');
  const [inmateRole, setInmateRole] = useState<'Aggressor' | 'Victim' | 'Participant' | 'Witness'>('Aggressor');
  const [summary, setSummary] = useState('');
  const [evidence, setEvidence] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    if (categoryFilter !== 'ALL' && inc.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = inc.incidentNumber.toLowerCase().includes(q);
      const matchSum = inc.summary.toLowerCase().includes(q);
      const matchLoc = inc.location.toLowerCase().includes(q);
      const matchInm = inc.involvedInmates.some(i => i.inmateName.toLowerCase().includes(q));
      if (!matchNum && !matchSum && !matchLoc && !matchInm) return false;
    }
    return true;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      alert("Please provide an incident narrative summary.");
      return;
    }

    const targetInmate = inmates.find(i => i.id === selectedInmateId);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    addIncident({
      timestamp: formattedDate,
      location,
      cellBlock,
      category,
      severity,
      involvedInmates: targetInmate ? [
        {
          inmateId: targetInmate.id,
          inmateName: `${targetInmate.firstName} ${targetInmate.lastName}`,
          role: inmateRole
        }
      ] : [],
      reportingOfficer,
      badgeNumber,
      summary: summary.trim(),
      evidenceItems: evidence ? evidence.split('\n').filter(Boolean) : ['Institutional Incident Log recorded.'],
      disciplinaryStatus: 'Under Investigation'
    });

    setIsIncidentModalOpen(false);
    setSummary('');
    setEvidence('');
  };

  const handleSaveAdjudication = () => {
    if (!adjudicatingIncident) return;
    updateIncidentStatus(adjudicatingIncident.id, newStatus, newSanctions);
    setAdjudicatingIncident(null);
    setNewSanctions('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Security Incidents & Disciplinary Adjudication
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official institutional rule infractions, contraband confiscations, and hearing sanctions
            </p>
          </div>

          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 rounded transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>File Incident Report</span>
          </button>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
          <div>
            <input
              type="text"
              placeholder="Search incident number, summary, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Incident Categories</option>
              <option value="Physical Altercation">Physical Altercation</option>
              <option value="Contraband Seizure">Contraband Seizure</option>
              <option value="Rule Violation">Rule Violation</option>
              <option value="Staff Insubordination">Staff Insubordination</option>
              <option value="Attempted Escape">Attempted Escape</option>
              <option value="Property Destruction">Property Destruction</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Severity Levels</option>
              <option value="Critical">Critical Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded text-center text-slate-500 text-xs">
            No incident reports matching the current filter criteria.
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div key={inc.id} className="p-4 bg-slate-900 border border-slate-800 rounded space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold text-sm">{inc.incidentNumber}</span>
                  <span className="text-white font-semibold text-sm">{inc.category}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    inc.severity === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border-rose-800 font-bold'
                      : inc.severity === 'Medium'
                      ? 'bg-amber-950 text-amber-300 border-amber-800 font-medium'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {inc.severity} Severity
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{inc.timestamp}</span>
                </div>
              </div>

              {/* Location & Reporting Officer */}
              <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>Location: <strong className="text-slate-200">{inc.location}</strong></span>
                <span>Reporting: <strong className="text-slate-200">{inc.reportingOfficer} (#{inc.badgeNumber})</strong></span>
                <span>Status: <strong className="text-amber-400">{inc.disciplinaryStatus}</strong></span>
              </div>

              {/* Summary narrative */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded text-slate-300 leading-relaxed">
                {inc.summary}
              </div>

              {/* Involved inmates & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded space-y-1">
                  <span className="text-slate-500 uppercase font-mono block">Involved Inmates</span>
                  {inc.involvedInmates.map((inv, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span className="font-medium">{inv.inmateName} ({inv.inmateId})</span>
                      <span className="font-mono text-amber-400 text-[10px]">{inv.role}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded space-y-1">
                  <span className="text-slate-500 uppercase font-mono block">Physical Evidence Secured</span>
                  {inc.evidenceItems.map((ev, idx) => (
                    <div key={idx} className="text-slate-300 truncate font-mono">
                      • {ev}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sanctions & Action Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-[11px]">
                  {inc.sanctionsApplied ? (
                    <span className="text-rose-400">
                      <strong>Imposed Sanctions:</strong> {inc.sanctionsApplied}
                    </span>
                  ) : (
                    <span className="text-slate-500">Awaiting formal disciplinary hearing findings.</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setAdjudicatingIncident(inc);
                    setNewStatus(inc.disciplinaryStatus);
                    setNewSanctions(inc.sanctionsApplied || '');
                  }}
                  className="px-3 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Adjudicate / Update Status</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Incident Modal */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-xl p-6 space-y-4 my-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  File Disciplinary Incident Report
                </h3>
              </div>
              <button
                onClick={() => setIsIncidentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Infraction Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Physical Altercation">Physical Altercation</option>
                    <option value="Contraband Seizure">Contraband Seizure</option>
                    <option value="Rule Violation">Rule Violation</option>
                    <option value="Staff Insubordination">Staff Insubordination</option>
                    <option value="Attempted Escape">Attempted Escape</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Property Destruction">Property Destruction</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Severity Rating</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="Low">Low (Class 3)</option>
                    <option value="Medium">Medium (Class 2)</option>
                    <option value="Critical">Critical (Class 1 Major Breach)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Specific Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Block C Rec Yard North"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Cell Block Zone</label>
                  <select
                    value={cellBlock}
                    onChange={(e) => setCellBlock(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D (Segregation)</option>
                    <option value="Ward M">Ward M (Infirmary)</option>
                  </select>
                </div>
              </div>

              {/* Inmate Involved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Primary Inmate Involved</label>
                  <select
                    value={selectedInmateId}
                    onChange={(e) => setSelectedInmateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {inmates.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.lastName}, {i.firstName} ({i.id}) - {i.cellBlock}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Inmate Role</label>
                  <select
                    value={inmateRole}
                    onChange={(e) => setInmateRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aggressor">Aggressor / Instigator</option>
                    <option value="Participant">Active Participant</option>
                    <option value="Victim">Victim</option>
                    <option value="Witness">Witness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Factual Narrative Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Detail exact officer observations, time sequence, commands given, and physical force applied..."
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Evidence Confiscated (one item per line)</label>
                <textarea
                  rows={2}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. Item 1: Improvised metal shank&#10;Item 2: Inmate phone recording"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 rounded transition-colors"
                >
                  Submit Official Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjudication Hearing Modal */}
      {adjudicatingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Disciplinary Adjudication: {adjudicatingIncident.incidentNumber}
                </h3>
              </div>
              <button
                onClick={() => setAdjudicatingIncident(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono space-y-1">
              <div className="text-white font-bold">{adjudicatingIncident.category}</div>
              <div className="text-slate-400">{adjudicatingIncident.summary}</div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Adjudication Finding / Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Under Investigation">Under Investigation</option>
                <option value="Hearing Scheduled">Disciplinary Hearing Scheduled</option>
                <option value="Sanctions Imposed">Guilty - Sanctions Imposed</option>
                <option value="Dismissed">Dismissed / Insufficient Evidence</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Disciplinary Sanctions Imposed</label>
              <textarea
                rows={2}
                value={newSanctions}
                onChange={(e) => setNewSanctions(e.target.value)}
                placeholder="e.g. 15 days disciplinary solitary confinement; 30 days loss of phone & commissary privileges."
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setAdjudicatingIncident(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdjudication}
                className="px-4 py-1.5 font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors"
              >
                Save Adjudication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
