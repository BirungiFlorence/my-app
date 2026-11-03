import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { MedicationAdminRecord } from '../../types/prison';
import { 
  Stethoscope, 
  Pill, 
  CheckCircle2, 
  Plus, 
  HeartPulse, 
  Clock, 
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

export const MedicalWardView: React.FC = () => {
  const { 
    medications, 
    inmates, 
    markMedicationAdministered, 
    addMedication 
  } = usePrison();

  const [nurseName, setNurseName] = useState('Nurse E. Garcia, RN');
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  // Form
  const [selectedInmateId, setSelectedInmateId] = useState(inmates[0]?.id || '');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily morning (08:00)');
  const [doctor, setDoctor] = useState('Dr. Rachel Kim, MD');
  const [schedTime, setSchedTime] = useState('08:00');
  const [instructions, setInstructions] = useState('');

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !dosage.trim()) {
      alert("Please provide the medication name and dosage.");
      return;
    }

    const inmate = inmates.find(i => i.id === selectedInmateId);

    addMedication({
      inmateId: selectedInmateId,
      inmateName: inmate ? `${inmate.firstName} ${inmate.lastName}` : 'Inmate',
      cellLocation: inmate ? `${inmate.cellBlock} / ${inmate.cellNumber}` : 'Cell',
      medicationName: medName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      prescribingDoctor: doctor.trim(),
      scheduledTime: schedTime,
      administered: false,
      specialInstructions: instructions.trim() || undefined
    });

    setIsAddMedOpen(false);
    setMedName('');
    setDosage('');
    setInstructions('');
  };

  const pendingCount = medications.filter(m => !m.administered).length;
  const completedCount = medications.filter(m => m.administered).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Infirmary & Medication Administration Record (MAR)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily pill line passes, controlled substance dispensing logs, and physician orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMedOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication Order</span>
            </button>
          </div>
        </div>

        {/* MAR Quick Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
            <span className="text-slate-500 block text-[10px]">TOTAL PRESCRIBED DOSES</span>
            <span className="text-white font-bold text-sm">{medications.length} Active Orders</span>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
            <span className="text-slate-500 block text-[10px]">ADMINISTERED TODAY</span>
            <span className="text-emerald-400 font-bold text-sm">{completedCount} Verified Doses</span>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
            <span className="text-slate-500 block text-[10px]">AWAITING PILL LINE</span>
            <span className="text-amber-400 font-bold text-sm">{pendingCount} Doses Pending</span>
          </div>
        </div>
      </div>

      {/* Pill Line Medication Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">Daily Pill Administration Queue</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Attending Nurse:</span>
            <input
              type="text"
              value={nurseName}
              onChange={(e) => setNurseName(e.target.value)}
              className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-200 text-xs font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 pl-4">Inmate & Cell</th>
                <th className="py-2.5">Medication & Dosage</th>
                <th className="py-2.5">Schedule / Frequency</th>
                <th className="py-2.5">Prescribing Doctor</th>
                <th className="py-2.5">Special Precautions</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 pr-4 text-right">Administer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {medications.map(med => (
                <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-4">
                    <div className="font-semibold text-slate-200">{med.inmateName}</div>
                    <div className="font-mono text-[11px] text-amber-400">{med.cellLocation} ({med.inmateId})</div>
                  </td>

                  <td className="py-3 font-mono">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{med.medicationName}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{med.dosage}</div>
                  </td>

                  <td className="py-3 font-mono text-[11px] text-slate-300">
                    <div>{med.frequency}</div>
                    <div className="text-slate-500">Scheduled: {med.scheduledTime}</div>
                  </td>

                  <td className="py-3 text-slate-400">
                    {med.prescribingDoctor}
                  </td>

                  <td className="py-3 text-slate-400 text-[11px] max-w-xs">
                    {med.specialInstructions || 'Standard swallow confirmation.'}
                  </td>

                  <td className="py-3">
                    {med.administered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DISPENSED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        <span>DUE</span>
                      </span>
                    )}
                    {med.administeredAt && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {med.administeredAt} by {med.administeredBy}
                      </div>
                    )}
                  </td>

                  <td className="py-3 pr-4 text-right">
                    {!med.administered ? (
                      <button
                        onClick={() => markMedicationAdministered(med.id, nurseName, "Vitals verified stable")}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded transition-colors whitespace-nowrap"
                      >
                        Sign & Dispense
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Logged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medication Modal */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-400" />
                <span>Add Institutional Medication Order</span>
              </h3>
              <button
                onClick={() => setIsAddMedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMed} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Inmate Patient</label>
                <select
                  value={selectedInmateId}
                  onChange={(e) => setSelectedInmateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {inmates.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.lastName}, {i.firstName} ({i.cellBlock} / {i.cellNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Medication Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sertraline HCl"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Dosage *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 mg Oral Tablet"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Frequency Schedule</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Prescribing Physician</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Special Clinical Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Check BP before dose; monitor swallow compliance"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded transition-colors"
                >
                  Submit Physician Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
