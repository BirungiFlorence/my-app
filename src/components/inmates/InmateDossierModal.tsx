import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  Inmate, 
  SecurityLevel, 
  CustodyStatus, 
  HousingBlockCode 
} from '../../types/prison';
import { 
  X, 
  Printer, 
  Shield, 
  Scale, 
  HeartPulse, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const InmateDossierModal: React.FC = () => {
  const { 
    selectedInmateForDossier, 
    setSelectedInmateForDossier, 
    setSelectedInmateForPrint,
    updateInmate,
    reassignCell,
    housingBlocks,
    incidents
  } = usePrison();

  if (!selectedInmateForDossier) return null;

  const inmate = selectedInmateForDossier;

  // Local state for editing cell or status
  const [editingHousing, setEditingHousing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<HousingBlockCode>(inmate.cellBlock);
  const [selectedCell, setSelectedCell] = useState<string>(inmate.cellNumber);
  const [selectedBunk, setSelectedBunk] = useState<'Lower' | 'Upper' | 'Single'>(inmate.bunk);
  const [currentStatus, setCurrentStatus] = useState<CustodyStatus>(inmate.custodyStatus);
  const [activeDossierTab, setActiveDossierTab] = useState<'profile' | 'charges' | 'housing' | 'incidents' | 'medical'>('profile');

  // Filter available cells in the selected block
  const currentBlockObj = housingBlocks.find(b => b.code === selectedBlock);
  const availableCells = currentBlockObj?.cells || [];

  const inmateIncidents = incidents.filter(inc => 
    inc.involvedInmates.some(inv => inv.inmateId === inmate.id)
  );

  const handleSaveHousing = () => {
    reassignCell(inmate.id, selectedBlock, selectedCell, selectedBunk);
    setEditingHousing(false);
  };

  const handleStatusChange = (newStatus: CustodyStatus) => {
    setCurrentStatus(newStatus);
    updateInmate(inmate.id, { custodyStatus: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-wide">
                  {inmate.lastName}, {inmate.firstName} {inmate.middleName || ''}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-semibold">
                  {inmate.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Corrections · Inmate Master Custody Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedInmateForPrint(inmate);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Jacket</span>
            </button>
            <button
              onClick={() => setSelectedInmateForDossier(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inmate Quick Summary Banner */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 block text-[10px]">BOOKING NUMBER</span>
              <span className="font-mono text-slate-200 font-semibold">{inmate.bookingNumber}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 block text-[10px]">STATE ID (SID)</span>
              <span className="font-mono text-slate-200 font-semibold">{inmate.stateIdNumber}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 block text-[10px]">SECURITY CLASS</span>
              <span className="font-mono text-amber-400 font-semibold">{inmate.securityLevel}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 block text-[10px]">HOUSING</span>
              <span className="font-mono text-slate-200 font-semibold">{inmate.cellBlock} - {inmate.cellNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as CustodyStatus)}
              className="bg-slate-950 border border-slate-700 text-slate-200 px-2 py-1 rounded text-xs focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="In Custody">In Custody</option>
              <option value="Solitary Confinement">Solitary Confinement</option>
              <option value="Medical Ward">Medical Ward</option>
              <option value="Court Transit">Court Transit</option>
              <option value="Work Detail">Work Detail</option>
              <option value="Released">Released</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          {[
            { id: 'profile', label: 'Biometrics & Profile' },
            { id: 'charges', label: 'Charges & Sentences' },
            { id: 'housing', label: 'Cell & Movement' },
            { id: 'incidents', label: `Disciplinary (${inmateIncidents.length})` },
            { id: 'medical', label: 'Medical & Welfare' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDossierTab(tab.id as any)}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeDossierTab === tab.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: BIOMETRICS & PROFILE */}
          {activeDossierTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo & Booking Mugshot */}
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded p-2 text-center">
                  {inmate.photoUrl ? (
                    <img
                      src={inmate.photoUrl}
                      alt={inmate.lastName}
                      className="w-full aspect-square rounded object-cover border border-slate-700 mx-auto"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-slate-800 rounded flex flex-col items-center justify-center font-mono text-2xl font-bold text-slate-400">
                      <span>{inmate.firstName[0]}{inmate.lastName[0]}</span>
                      <span className="text-xs text-slate-500 font-sans mt-2">Mugshot Pending</span>
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-mono text-slate-400">
                    ISCF Booking Photo · Intake {inmate.admissionDate}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Fingerprints:</span>
                    <span className="text-emerald-400 font-semibold">ON FILE (AFIS)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>DNA Sample:</span>
                    <span className="text-emerald-400 font-semibold">VERIFIED</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Blood Type:</span>
                    <span className="text-slate-200">{inmate.biometrics.bloodType}</span>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics & Aliases */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-3">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                    Physical Characteristics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">HEIGHT</span>
                      <span className="text-slate-200 font-semibold">{inmate.biometrics.height}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">WEIGHT</span>
                      <span className="text-slate-200 font-semibold">{inmate.biometrics.weight}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EYES</span>
                      <span className="text-slate-200 font-semibold">{inmate.biometrics.eyeColor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">HAIR</span>
                      <span className="text-slate-200 font-semibold">{inmate.biometrics.hairColor}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] mb-1">SCARS, MARKS & TATTOOS</span>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                      {inmate.biometrics.scarsAndTattoos || 'None recorded at intake.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] mb-1">ALIASES / MONIKERS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {inmate.aliases.length > 0 ? (
                        inmate.aliases.map((al, idx) => (
                          <span key={idx} className="font-mono text-[11px] px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">
                            "{al}"
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">None known.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact & Supervision */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                    Custody Assignment & Emergency Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ASSIGNED CORRECTIONAL OFFICER</span>
                      <span className="text-slate-200 font-medium">{inmate.assignedOfficer}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EMERGENCY CONTACT</span>
                      <span className="text-slate-200 font-medium">
                        {inmate.emergencyContact.name} ({inmate.emergencyContact.relationship}) - {inmate.emergencyContact.phone}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">INTERNAL ESCORT & CUSTODY NOTES</span>
                    <p className="text-slate-300 mt-1">{inmate.notes || 'Standard protocol applies.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHARGES & SENTENCES */}
          {activeDossierTab === 'charges' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                    Active Charges & Judicial Convictions
                  </h4>
                  <span className="font-mono text-slate-400">
                    Total Incarceration Term: {inmate.charges.reduce((acc, c) => acc + c.sentenceYears, 0)} Years
                  </span>
                </div>

                <div className="space-y-3">
                  {inmate.charges.map((charge, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 font-bold">{charge.code}</span>
                            <span className="font-semibold text-slate-100">{charge.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Jurisdiction: {charge.courtJurisdiction} · Convicted: {charge.convictionDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-semibold">
                            {charge.felonyClass}
                          </span>
                          <div className="font-mono font-bold text-slate-200 mt-1">
                            {charge.sentenceYears} Years Term
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentencing Timeline & Parole Eligibility */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
                  <span className="text-slate-500 block text-[10px]">ADMISSION DATE</span>
                  <span className="text-slate-200 font-bold text-sm">{inmate.admissionDate}</span>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
                  <span className="text-slate-500 block text-[10px]">PAROLE ELIGIBILITY</span>
                  <span className="text-amber-400 font-bold text-sm">{inmate.paroleEligibilityDate}</span>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
                  <span className="text-slate-500 block text-[10px]">PROJECTED DISCHARGE</span>
                  <span className="text-emerald-400 font-bold text-sm">{inmate.projectedReleaseDate}</span>
                </div>
              </div>

              {/* Bail Information */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-center justify-between font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">BAIL AMOUNT / STATUS</span>
                  <span className="text-slate-200 font-bold">
                    {inmate.bailEligible ? `$${inmate.bailAmount.toLocaleString()} (Eligible)` : 'No Bail Authorized (Remanded)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">INMATE COMMISSARY TRUST</span>
                  <span className="text-emerald-400 font-bold">
                    ${inmate.trustAccountBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CELL HOUSING & REASSIGNMENT */}
          {activeDossierTab === 'housing' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                      Current Housing Assignment
                    </h4>
                    <p className="text-xs text-slate-400">
                      Assigned cell, tier location, and cellmate compatibility
                    </p>
                  </div>
                  {!editingHousing ? (
                    <button
                      onClick={() => setEditingHousing(true)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors"
                    >
                      Reassign Housing Cell
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveHousing}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded transition-colors"
                      >
                        Confirm Transfer
                      </button>
                      <button
                        onClick={() => setEditingHousing(false)}
                        className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!editingHousing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-slate-500 block text-[10px]">CELLBLOCK</span>
                      <span className="text-slate-100 font-bold text-sm">{inmate.cellBlock}</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-slate-500 block text-[10px]">CELL NUMBER</span>
                      <span className="text-slate-100 font-bold text-sm">{inmate.cellNumber}</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-slate-500 block text-[10px]">BUNK ASSIGNMENT</span>
                      <span className="text-slate-100 font-bold text-sm">{inmate.bunk} Bunk</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900 border border-amber-500/50 rounded space-y-4">
                    <div className="text-xs text-amber-300 font-medium">
                      Select target cell block, cell, and bunk location:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Target Block</label>
                        <select
                          value={selectedBlock}
                          onChange={(e) => {
                            const newBlock = e.target.value as HousingBlockCode;
                            setSelectedBlock(newBlock);
                            const bObj = housingBlocks.find(b => b.code === newBlock);
                            if (bObj && bObj.cells.length > 0) {
                              setSelectedCell(bObj.cells[0].cellNumber);
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="Block A">Block A (Minimum)</option>
                          <option value="Block B">Block B (Medium)</option>
                          <option value="Block C">Block C (Maximum)</option>
                          <option value="Block D">Block D (Segregation)</option>
                          <option value="Ward M">Ward M (Medical)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Available Cells</label>
                        <select
                          value={selectedCell}
                          onChange={(e) => setSelectedCell(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500"
                        >
                          {availableCells.map(c => (
                            <option key={c.cellNumber} value={c.cellNumber}>
                              {c.cellNumber} ({c.occupiedBy.length}/{c.capacity} occupied) - {c.status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Bunk Tier</label>
                        <select
                          value={selectedBunk}
                          onChange={(e) => setSelectedBunk(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="Lower">Lower Bunk</option>
                          <option value="Upper">Upper Bunk</option>
                          <option value="Single">Single Cell</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Work Detail Assignment */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">AUTHORIZED WORK DETAIL</span>
                <span className="text-slate-200 font-medium">
                  {inmate.workDetail || 'No active work assignment.'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: DISCIPLINARY & INCIDENTS */}
          {activeDossierTab === 'incidents' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400 mb-3">
                  Institutional Infraction & Disciplinary Record ({inmateIncidents.length})
                </h4>

                {inmateIncidents.length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">
                    No disciplinary infractions or security incidents recorded for this inmate.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {inmateIncidents.map(inc => {
                      const role = inc.involvedInmates.find(inv => inv.inmateId === inmate.id)?.role;
                      return (
                        <div key={inc.id} className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-400 font-bold">{inc.incidentNumber}</span>
                              <span className="font-semibold text-slate-200">{inc.category}</span>
                            </div>
                            <span className="font-mono text-[10px] px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">
                              Role: {role || 'Involved'}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{inc.summary}</p>
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Status: {inc.disciplinaryStatus}</span>
                            <span>{inc.timestamp}</span>
                          </div>
                          {inc.sanctionsApplied && (
                            <div className="text-[11px] text-rose-400 pt-1">
                              <strong>Sanctions:</strong> {inc.sanctionsApplied}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MEDICAL & WELFARE */}
          {activeDossierTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                  Medical & Psychiatric Classification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                    <span className="text-slate-500 block text-[10px]">SUICIDE RISK ASSESSMENT</span>
                    <span className={`font-mono font-bold text-sm ${inmate.suicideWatch ? 'text-red-400' : 'text-emerald-400'}`}>
                      {inmate.suicideWatch ? 'ACTIVE SUICIDE WATCH (Continuous 15-min logs)' : 'Low Risk / Standard Housing'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                    <span className="text-slate-500 block text-[10px]">SECURITY GANG INTEL</span>
                    <span className="font-mono font-bold text-sm text-slate-200">
                      {inmate.gangAffiliation || 'None Reported'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] mb-1">DOCUMENTED MEDICAL ALERTS & ALLERGIES</span>
                  {inmate.medicalAlerts.length > 0 ? (
                    <div className="space-y-1.5">
                      {inmate.medicalAlerts.map((alert, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded flex items-center gap-2 text-slate-200">
                          <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400">No active chronic medical flags on file.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 font-mono text-[11px]">
            Ironwood State Correctional Facility · Secure System Record
          </span>
          <button
            onClick={() => setSelectedInmateForDossier(null)}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
