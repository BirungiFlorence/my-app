import React from 'react';
import { usePrison } from '../../context/PrisonContext';
import { Printer, X, Shield, FileCheck } from 'lucide-react';

export const PrintDossierModal: React.FC = () => {
  const { selectedInmateForPrint, setSelectedInmateForPrint, facility } = usePrison();

  if (!selectedInmateForPrint) return null;

  const inmate = selectedInmateForPrint;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Top Modal Controls (Hidden when printed) */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-white">
              Official Custody Booking Jacket Print Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Document</span>
            </button>
            <button
              onClick={() => setSelectedInmateForPrint(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 overflow-y-auto bg-white text-black font-sans printable-document flex-1">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-black pb-4 mb-4 flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest font-mono text-neutral-600">
                STATE DEPARTMENT OF CORRECTIONS & REHABILITATION
              </div>
              <h1 className="text-xl font-black uppercase tracking-tight text-black">
                {facility.facilityName}
              </h1>
              <div className="text-xs font-mono text-neutral-700">
                INMATE CUSTODY RECORD & OFFICIAL BOOKING SUMMARY
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="font-bold text-sm text-black">CUSTODY # {inmate.id}</div>
              <div className="text-neutral-700">BOOKING: {inmate.bookingNumber}</div>
              <div className="text-neutral-700">SID: {inmate.stateIdNumber}</div>
              <div className="text-[10px] text-neutral-500">PRINTED: {new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Top Section: Photo + Demographics */}
          <div className="grid grid-cols-4 gap-6 pb-4 border-b border-neutral-300">
            {/* Photo / Mugshot */}
            <div className="col-span-1">
              <div className="w-full aspect-square border-2 border-neutral-800 p-1 bg-neutral-100 flex items-center justify-center">
                {inmate.photoUrl ? (
                  <img
                    src={inmate.photoUrl}
                    alt={inmate.lastName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center font-mono text-xs text-neutral-600">
                    <div>OFFICIAL INTAKE</div>
                    <div className="font-bold mt-1">{inmate.id}</div>
                  </div>
                )}
              </div>
              <div className="text-center font-mono text-[10px] text-neutral-600 mt-1 uppercase">
                ISCF Intake Photography
              </div>
            </div>

            {/* Inmate Personal Profile */}
            <div className="col-span-3 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">LEGAL SURNAME</span>
                  <span className="font-bold text-sm text-black uppercase">{inmate.lastName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">FIRST NAME</span>
                  <span className="font-bold text-sm text-black uppercase">{inmate.firstName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">MIDDLE NAME</span>
                  <span className="font-bold text-sm text-black uppercase">{inmate.middleName || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">DATE OF BIRTH</span>
                  <span className="font-bold">{inmate.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">GENDER</span>
                  <span className="font-bold">{inmate.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">SECURITY TIER</span>
                  <span className="font-bold uppercase">{inmate.securityLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">CUSTODY STATUS</span>
                  <span className="font-bold uppercase">{inmate.custodyStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">HOUSING WING</span>
                  <span className="font-bold">{inmate.cellBlock}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">CELL NUMBER</span>
                  <span className="font-bold">{inmate.cellNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">BUNK</span>
                  <span className="font-bold">{inmate.bunk}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">ADMISSION DATE</span>
                  <span className="font-bold">{inmate.admissionDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Description & Biometrics */}
          <div className="py-3 border-b border-neutral-300 text-xs">
            <div className="font-bold uppercase text-[11px] mb-2 tracking-wide text-neutral-800">
              Biometric & Identifying Characteristics
            </div>
            <div className="grid grid-cols-6 gap-2 font-mono text-[11px] pb-2">
              <div>
                <span className="text-[10px] text-neutral-500 block">HEIGHT</span>
                <span>{inmate.biometrics.height}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">WEIGHT</span>
                <span>{inmate.biometrics.weight}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">EYE COLOR</span>
                <span>{inmate.biometrics.eyeColor}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">HAIR COLOR</span>
                <span>{inmate.biometrics.hairColor}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">BLOOD TYPE</span>
                <span>{inmate.biometrics.bloodType}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">DNA RECORD</span>
                <span className="font-bold">VERIFIED</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 text-[11px]">
              <span className="font-bold text-[10px] uppercase text-neutral-500 block">
                SCARS, MARKS AND TATTOOS:
              </span>
              <p className="font-mono text-neutral-800">{inmate.biometrics.scarsAndTattoos}</p>
            </div>
          </div>

          {/* Criminal Offenses & Sentence Information */}
          <div className="py-3 border-b border-neutral-300 text-xs">
            <div className="font-bold uppercase text-[11px] mb-2 tracking-wide text-neutral-800 flex items-center justify-between">
              <span>Judicial Convictions & Active Sentence Commitment</span>
              <span className="font-mono text-[11px] text-neutral-600">
                PAROLE ELIGIBILITY: {inmate.paroleEligibilityDate} · PROJECTED RELEASE: {inmate.projectedReleaseDate}
              </span>
            </div>

            <table className="w-full text-left text-[11px] border-collapse font-mono">
              <thead>
                <tr className="border-b border-neutral-300 font-bold text-neutral-600">
                  <th className="py-1">PENAL STATUTE</th>
                  <th className="py-1">OFFENSE TITLE</th>
                  <th className="py-1">FELONY CLASS</th>
                  <th className="py-1">SENTENCE</th>
                  <th className="py-1 text-right">CONVICTION JURISDICTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {inmate.charges.map((c, i) => (
                  <tr key={i}>
                    <td className="py-1 font-bold">{c.code}</td>
                    <td className="py-1">{c.title}</td>
                    <td className="py-1">{c.felonyClass}</td>
                    <td className="py-1 font-bold">{c.sentenceYears} YRS</td>
                    <td className="py-1 text-right">{c.courtJurisdiction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medical Alerts & Emergency Contact */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-neutral-300 text-xs">
            <div>
              <span className="font-bold uppercase text-[10px] text-neutral-500 block mb-1">
                MEDICAL FLAGS & ALLERGIES
              </span>
              <div className="text-[11px] font-mono text-neutral-800">
                {inmate.medicalAlerts.length > 0 ? (
                  inmate.medicalAlerts.join('; ')
                ) : (
                  'No chronic clinical restrictions recorded.'
                )}
                {inmate.suicideWatch && (
                  <div className="text-red-700 font-bold mt-1">
                    *** ACTIVE SUICIDE WATCH DIRECTIVE ***
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase text-[10px] text-neutral-500 block mb-1">
                NEXT OF KIN / EMERGENCY CONTACT
              </span>
              <div className="text-[11px] text-neutral-800 font-mono">
                {inmate.emergencyContact.name} ({inmate.emergencyContact.relationship}) - {inmate.emergencyContact.phone}
              </div>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-xs font-mono">
            <div className="border-t border-black pt-2">
              <div className="font-bold">RECEIVING CORRECTIONS OFFICER</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Signature & Badge Number</div>
            </div>

            <div className="border-t border-black pt-2">
              <div className="font-bold">FACILITY WARDEN / WATCH COMMANDER</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Authorized Institutional Seal & Date</div>
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end no-print">
          <button
            onClick={() => setSelectedInmateForPrint(null)}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
          >
            Close Print Preview
          </button>
        </div>
      </div>
    </div>
  );
};
