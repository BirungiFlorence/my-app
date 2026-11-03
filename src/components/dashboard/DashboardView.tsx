import React from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  Users, 
  ShieldAlert, 
  ClipboardCheck, 
  Grid3X3, 
  AlertOctagon, 
  UserCheck, 
  Stethoscope, 
  ArrowUpRight,
  UserPlus,
  Flame,
  Clock,
  Shield,
  FileText
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    facility, 
    inmates, 
    housingBlocks, 
    headcount, 
    incidents, 
    visitors, 
    setActiveTab, 
    setIsBookingModalOpen,
    setIsIncidentModalOpen,
    setIsVisitorModalOpen,
    setSelectedInmateForDossier
  } = usePrison();

  const totalInCustody = inmates.filter(i => i.custodyStatus !== 'Released').length;
  const inSolitary = inmates.filter(i => i.custodyStatus === 'Solitary Confinement').length;
  const inInfirmary = inmates.filter(i => i.custodyStatus === 'Medical Ward').length;
  const inTransit = inmates.filter(i => i.custodyStatus === 'Court Transit').length;
  const onWorkDetail = inmates.filter(i => i.custodyStatus === 'Work Detail').length;

  const activeIncidents = incidents.filter(i => i.disciplinaryStatus !== 'Dismissed');
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical');

  // Breakdown by security level
  const maxInmates = inmates.filter(i => i.securityLevel === 'Maximum' || i.securityLevel === 'Supermax').length;
  const medInmates = inmates.filter(i => i.securityLevel === 'Medium').length;
  const minInmates = inmates.filter(i => i.securityLevel === 'Minimum').length;

  return (
    <div className="space-y-6">
      {/* Alert Banner if Lockdown or Elevated */}
      {facility.facilityAlertLevel !== 'Normal Operations' && (
        <div className="p-4 rounded border bg-red-950/60 border-red-700/80 text-red-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                <span>SECURITY ALERT: {facility.facilityAlertLevel}</span>
                <span className="text-xs px-2 py-0.5 bg-red-900 border border-red-700 rounded text-red-200 font-mono">
                  ACTIVE PROTOCOL
                </span>
              </div>
              <p className="text-xs text-red-200/90 mt-1">
                {facility.lockdownReason || 'All cell doors locked. Inmate movement suspended. Security escort required for all staff.'}
              </p>
              <div className="text-[11px] font-mono text-red-300/80 mt-1">
                Initiated: {facility.lockdownInitiatedAt || 'Recently'} by {facility.lockdownInitiatedBy || 'Command Staff'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('housing')}
            className="text-xs font-semibold px-3 py-1 bg-red-800 hover:bg-red-700 border border-red-600 rounded text-white whitespace-nowrap"
          >
            Review Housing Blocks
          </button>
        </div>
      )}

      {/* KPI Statistic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total In Custody */}
        <div className="p-4 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">POPULATION IN CUSTODY</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalInCustody}
            <span className="text-xs font-normal text-slate-500 ml-1.5 font-sans">
              / {facility.operationalCapacity} max
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Occupancy Rate</span>
            <span className="font-mono text-slate-300 font-semibold">
              {((totalInCustody / facility.operationalCapacity) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Headcount Verification */}
        <div className="p-4 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">CURRENT MUSTER ROLL</span>
            <ClipboardCheck className={`w-4 h-4 ${headcount.status === 'Reconciled' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
            <span>{headcount.verifiedTotal} / {headcount.censusTarget}</span>
            <span className={`text-[11px] font-sans px-1.5 py-0.5 rounded border ${
              headcount.status === 'Reconciled' 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              {headcount.status}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Shift Count</span>
            <span className="font-mono text-slate-300">{headcount.shift.split(' ')[0]}</span>
          </div>
        </div>

        {/* Restrictive Housing & Segregation */}
        <div className="p-4 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">ISOLATION & SEGREGATION</span>
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {inSolitary}
            <span className="text-xs font-normal text-slate-500 ml-1.5 font-sans">
              in Block D Restrictive
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Infirmary / Transit</span>
            <span className="font-mono text-slate-300">{inInfirmary} Med · {inTransit} Transit</span>
          </div>
        </div>

        {/* Security Incidents */}
        <div className="p-4 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">DISCIPLINARY INCIDENTS</span>
            <AlertOctagon className={`w-4 h-4 ${criticalIncidents.length > 0 ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
            <span>{activeIncidents.length}</span>
            {criticalIncidents.length > 0 && (
              <span className="text-[11px] font-sans px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                {criticalIncidents.length} Critical
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Open Investigations</span>
            <span className="font-mono text-slate-300">
              {incidents.filter(i => i.disciplinaryStatus === 'Under Investigation').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Housing Block Matrix & Muster Roll Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Housing Block Status */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Housing Block Census & Capacity</h3>
                <p className="text-xs text-slate-400">Real-time bed allocation across facility security sectors</p>
              </div>
              <button
                onClick={() => setActiveTab('housing')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Interactive Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {housingBlocks.map(block => {
                const totalCells = block.cells.length;
                const occupiedCells = block.cells.filter(c => c.occupiedBy.length > 0).length;
                const totalInmatesInBlock = block.cells.reduce((acc, c) => acc + c.occupiedBy.length, 0);
                const percent = Math.round((totalInmatesInBlock / block.capacity) * 100);

                return (
                  <div key={block.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-200">{block.name}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800 border border-slate-700 text-slate-300 rounded">
                        {block.securityTier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Occupants: <strong className="text-white font-mono">{totalInmatesInBlock}</strong> / {block.capacity} beds</span>
                      <span className="font-mono text-slate-300">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                      <div 
                        className={`h-full rounded ${
                          percent > 85 ? 'bg-rose-500' : percent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                      <span>{occupiedCells} of {totalCells} cells active</span>
                      <span>Tier 1 & Tier 2</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Inmate Admissions */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Recent Inmate Custody Records</h3>
                <p className="text-xs text-slate-400">Latest intakes and custody status classifications</p>
              </div>
              <button
                onClick={() => setActiveTab('inmates')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Full Roster ({inmates.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="pb-2 pl-2">Inmate ID & Name</th>
                    <th className="pb-2">Security Class</th>
                    <th className="pb-2">Housing Location</th>
                    <th className="pb-2">Primary Offense</th>
                    <th className="pb-2">Custody Status</th>
                    <th className="pb-2 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {inmates.slice(0, 5).map(inmate => (
                    <tr key={inmate.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 pl-2">
                        <div className="flex items-center gap-2">
                          {inmate.photoUrl ? (
                            <img 
                              src={inmate.photoUrl} 
                              alt={inmate.lastName} 
                              className="w-7 h-7 rounded object-cover border border-slate-700 shrink-0" 
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300 shrink-0">
                              {inmate.firstName[0]}{inmate.lastName[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-200">
                              {inmate.lastName}, {inmate.firstName}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              {inmate.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          inmate.securityLevel === 'Supermax' || inmate.securityLevel === 'Maximum'
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : inmate.securityLevel === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}>
                          {inmate.securityLevel}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {inmate.cellBlock} / {inmate.cellNumber}
                      </td>
                      <td className="py-2.5 text-slate-300 max-w-[180px] truncate" title={inmate.primaryOffense}>
                        {inmate.primaryOffense}
                      </td>
                      <td className="py-2.5">
                        <span className="text-[11px] text-slate-300 font-medium">
                          {inmate.custodyStatus}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-right">
                        <button
                          onClick={() => setSelectedInmateForDossier(inmate)}
                          className="px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Quick Operations & Security Alerts */}
        <div className="space-y-6">
          {/* Quick Action Station */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <h3 className="text-sm font-bold text-white tracking-wide mb-3">Operational Command Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded text-left transition-colors flex flex-col justify-between"
              >
                <UserPlus className="w-4 h-4 text-amber-400 mb-2" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">New Intake</div>
                  <div className="text-[11px] text-slate-500">Book new offender</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('headcount')}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded text-left transition-colors flex flex-col justify-between"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-400 mb-2" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Run Muster</div>
                  <div className="text-[11px] text-slate-500">Scheduled roll count</div>
                </div>
              </button>

              <button
                onClick={() => setIsIncidentModalOpen(true)}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded text-left transition-colors flex flex-col justify-between"
              >
                <AlertOctagon className="w-4 h-4 text-rose-400 mb-2" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Log Incident</div>
                  <div className="text-[11px] text-slate-500">Disciplinary report</div>
                </div>
              </button>

              <button
                onClick={() => setIsVisitorModalOpen(true)}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded text-left transition-colors flex flex-col justify-between"
              >
                <UserCheck className="w-4 h-4 text-cyan-400 mb-2" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Log Visitor</div>
                  <div className="text-[11px] text-slate-500">Booth screening</div>
                </div>
              </button>
            </div>
          </div>

          {/* Active Disciplinary Incidents */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">Recent Disciplinary Reports</h3>
              <button
                onClick={() => setActiveTab('incidents')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {incidents.slice(0, 3).map(incident => (
                <div key={incident.id} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px]">{incident.incidentNumber}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      incident.severity === 'Critical' 
                        ? 'bg-red-950 text-red-300 border-red-800 font-bold' 
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200">{incident.category}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{incident.summary}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                    <span>{incident.location}</span>
                    <span>{incident.timestamp.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Classification Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4 text-xs">
            <h3 className="text-sm font-bold text-white tracking-wide mb-3">Security Tiers Breakdown</h3>
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-red-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-red-500"></span> Maximum / Supermax
                </span>
                <span className="text-slate-200 font-bold">{maxInmates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-amber-500"></span> Medium Custody
                </span>
                <span className="text-slate-200 font-bold">{medInmates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-emerald-500"></span> Minimum Security
                </span>
                <span className="text-slate-200 font-bold">{minInmates}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
