import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  SecurityLevel, 
  HousingBlockCode, 
  Inmate, 
  ChargeRecord 
} from '../../types/prison';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const BookingIntakeModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    addInmate, 
    housingBlocks,
    setSelectedInmateForDossier
  } = usePrison();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [aliases, setAliases] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1994-06-15');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [stateIdNumber, setStateIdNumber] = useState(`SID-${Math.floor(1000000 + Math.random() * 9000000)}`);

  // Charges
  const [primaryOffense, setPrimaryOffense] = useState('');
  const [chargeCode, setChargeCode] = useState('PEN-211');
  const [chargeTitle, setChargeTitle] = useState('');
  const [felonyClass, setFelonyClass] = useState<'Class A' | 'Class B' | 'Class C' | 'Misdemeanor'>('Class B');
  const [sentenceYears, setSentenceYears] = useState<number>(5);
  const [courtJurisdiction, setCourtJurisdiction] = useState('County Superior Court');
  const [bailAmount, setBailAmount] = useState<number>(100000);
  const [bailEligible, setBailEligible] = useState<boolean>(false);

  // Biometrics
  const [height, setHeight] = useState("5' 11\"");
  const [weight, setWeight] = useState("180 lbs");
  const [eyeColor, setEyeColor] = useState('Brown');
  const [hairColor, setHairColor] = useState('Black');
  const [scarsAndTattoos, setScarsAndTattoos] = useState('');
  const [bloodType, setBloodType] = useState('O+');

  // Classification & Housing
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('Medium');
  const [cellBlock, setCellBlock] = useState<HousingBlockCode>('Block B');
  const [cellNumber, setCellNumber] = useState('B-101');
  const [bunk, setBunk] = useState<'Lower' | 'Upper' | 'Single'>('Lower');
  const [suicideWatch, setSuicideWatch] = useState<boolean>(false);
  const [medicalAlerts, setMedicalAlerts] = useState('');
  const [gangAffiliation, setGangAffiliation] = useState('None');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Family');

  if (!isBookingModalOpen) return null;

  // Compute available cells for selected block
  const targetBlockObj = housingBlocks.find(b => b.code === cellBlock);
  const availableCells = targetBlockObj?.cells || [];

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        alert("Please enter both First Name and Last Name.");
        return;
      }
    } else if (step === 2) {
      if (!primaryOffense.trim()) {
        alert("Please enter the Primary Offense description.");
        return;
      }
    }
    setStep(prev => (prev < 4 ? ((prev + 1) as any) : prev));
  };

  const handleBack = () => {
    setStep(prev => (prev > 1 ? ((prev - 1) as any) : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const charges: ChargeRecord[] = [
      {
        code: chargeCode || 'PEN-GEN',
        title: chargeTitle || primaryOffense,
        felonyClass,
        sentenceYears: Number(sentenceYears) || 1,
        convictionDate: new Date().toISOString().split('T')[0],
        courtJurisdiction
      }
    ];

    const today = new Date().toISOString().split('T')[0];
    const releaseDate = new Date();
    releaseDate.setFullYear(releaseDate.getFullYear() + (Number(sentenceYears) || 3));
    const paroleDate = new Date();
    paroleDate.setFullYear(paroleDate.getFullYear() + Math.max(1, Math.floor((Number(sentenceYears) || 3) / 2)));

    const inmatePayload: Omit<Inmate, 'id'> = {
      bookingNumber: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      stateIdNumber,
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      aliases: aliases ? aliases.split(',').map(s => s.trim()) : [],
      dateOfBirth,
      gender,
      photoUrl: '',
      securityLevel,
      custodyStatus: suicideWatch ? 'Solitary Confinement' : 'In Custody',
      cellBlock,
      cellNumber,
      bunk,
      admissionDate: today,
      projectedReleaseDate: releaseDate.toISOString().split('T')[0],
      paroleEligibilityDate: paroleDate.toISOString().split('T')[0],
      primaryOffense: primaryOffense.trim(),
      charges,
      bailAmount: Number(bailAmount) || 0,
      bailEligible,
      biometrics: {
        height,
        weight,
        eyeColor,
        hairColor,
        scarsAndTattoos: scarsAndTattoos.trim() || 'None recorded at intake.',
        bloodType,
        fingerprintsOnFile: true,
        dnaSampleCollected: true
      },
      medicalAlerts: medicalAlerts ? medicalAlerts.split(',').map(s => s.trim()) : [],
      suicideWatch,
      gangAffiliation: gangAffiliation.trim() || 'None Reported',
      trustAccountBalance: 50.00, // standard intake starter deposit
      emergencyContact: {
        name: emergencyName.trim() || 'Next of Kin',
        relationship: emergencyRel,
        phone: emergencyPhone.trim() || '(555) 000-0000'
      },
      assignedOfficer: 'Intake Desk / Watch Commander',
      notes: 'Initial intake intake assessment completed without violent incident.'
    };

    const newInmateId = addInmate(inmatePayload);
    setIsBookingModalOpen(false);

    // Reset form
    setStep(1);
    setFirstName('');
    setLastName('');
    setPrimaryOffense('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                New Offender Booking & Intake
              </h3>
              <p className="text-xs text-slate-400">
                Official intake protocol · Step {step} of 4
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Demographics' },
            { num: 2, label: 'Charges & Legal' },
            { num: 3, label: 'Biometrics' },
            { num: 4, label: 'Housing & Triage' }
          ].map(s => (
            <div 
              key={s.num} 
              className={`flex items-center gap-1.5 ${step === s.num ? 'text-amber-400 font-bold' : step > s.num ? 'text-emerald-400' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                step === s.num 
                  ? 'border-amber-400 bg-amber-400/20' 
                  : step > s.num 
                  ? 'border-emerald-500 bg-emerald-500/20' 
                  : 'border-slate-700 bg-slate-800'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robert"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Middle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. James"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miller"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">State Identification # (SID)</label>
                  <input
                    type="text"
                    value={stateIdNumber}
                    onChange={(e) => setStateIdNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Aliases / Street Monikers (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Rob, Red, Bobby"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CHARGES & LEGAL */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Primary Offense Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Armed Robbery of Commercial Establishment"
                  value={primaryOffense}
                  onChange={(e) => setPrimaryOffense(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Penal Code</label>
                  <input
                    type="text"
                    value={chargeCode}
                    onChange={(e) => setChargeCode(e.target.value)}
                    placeholder="e.g. PEN-211-A"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Felony Classification</label>
                  <select
                    value={felonyClass}
                    onChange={(e) => setFelonyClass(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Class A">Class A Felony (Severe)</option>
                    <option value="Class B">Class B Felony</option>
                    <option value="Class C">Class C Felony</option>
                    <option value="Misdemeanor">Misdemeanor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Sentence (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={sentenceYears}
                    onChange={(e) => setSentenceYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Sentencing Court Jurisdiction</label>
                  <input
                    type="text"
                    value={courtJurisdiction}
                    onChange={(e) => setCourtJurisdiction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Bail Amount ($)</label>
                  <input
                    type="number"
                    value={bailAmount}
                    onChange={(e) => setBailAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BIOMETRICS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Eye Color</label>
                  <input
                    type="text"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Blood Type</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Scars, Marks & Tattoos</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 3-inch burn scar left forearm; panther tattoo chest"
                  value={scarsAndTattoos}
                  onChange={(e) => setScarsAndTattoos(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Biometric Fingerprint Scanner connected & ready for live scan.</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Buccal swab DNA kit pre-labeled.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HOUSING & CLASSIFICATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Assigned Security Tier</label>
                  <select
                    value={securityLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as SecurityLevel;
                      setSecurityLevel(lvl);
                      if (lvl === 'Minimum') setCellBlock('Block A');
                      else if (lvl === 'Medium') setCellBlock('Block B');
                      else if (lvl === 'Maximum') setCellBlock('Block C');
                      else if (lvl === 'Supermax') setCellBlock('Block D');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Minimum">Minimum Security</option>
                    <option value="Medium">Medium Security</option>
                    <option value="Maximum">Maximum Security</option>
                    <option value="Supermax">Supermax / Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Housing Block</label>
                  <select
                    value={cellBlock}
                    onChange={(e) => setCellBlock(e.target.value as HousingBlockCode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Block A">Block A (Minimum)</option>
                    <option value="Block B">Block B (Medium)</option>
                    <option value="Block C">Block C (Maximum)</option>
                    <option value="Block D">Block D (Segregation)</option>
                    <option value="Ward M">Ward M (Infirmary)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Cell Selection</label>
                  <select
                    value={cellNumber}
                    onChange={(e) => setCellNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    {availableCells.map(c => (
                      <option key={c.cellNumber} value={c.cellNumber}>
                        {c.cellNumber} ({c.occupiedBy.length}/{c.capacity} occupied)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Bunk Assignment</label>
                  <select
                    value={bunk}
                    onChange={(e) => setBunk(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lower">Lower Bunk</option>
                    <option value="Upper">Upper Bunk</option>
                    <option value="Single">Single Cell</option>
                  </select>
                </div>
              </div>

              {/* Triage Alerts */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suicideWatch}
                    onChange={(e) => setSuicideWatch(e.target.checked)}
                    className="rounded border-slate-700 text-red-500 focus:ring-red-400"
                  />
                  <span className="text-xs text-red-400 font-bold">
                    Flag for Immediate Suicide Watch (Intake Psych Triage)
                  </span>
                </label>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Known Medical Flags or Allergies (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Insulin Dependent, Penicillin Allergy, Severe Asthma"
                    value={medicalAlerts}
                    onChange={(e) => setMedicalAlerts(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mary Miller"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    placeholder="(555) 000-0000"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Modal Controls Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={handleBack}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-30 hover:text-white rounded border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Official Intake Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
