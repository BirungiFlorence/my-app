import React from 'react';
import { usePrison } from '../../context/PrisonContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Grid3X3, 
  AlertOctagon, 
  UserCheck, 
  Stethoscope, 
  ShieldCheck,
  Building2,
  Lock,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    inmates, 
    facility,
    headcount,
    incidents,
    visitors
  } = usePrison();

  const totalInmates = inmates.filter(i => i.custodyStatus !== 'Released').length;
  const activeIncidents = incidents.filter(i => i.disciplinaryStatus !== 'Dismissed').length;
  const pendingVisits = visitors.filter(v => v.status === 'Checked In' || v.status === 'Scheduled').length;

  interface NavItem {
    id: 'dashboard' | 'inmates' | 'headcount' | 'housing' | 'incidents' | 'visitors' | 'medical' | 'staff';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: number | string | null;
    badgeAlert?: boolean;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Operations Center',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inmates',
      label: 'Inmate Master Roster',
      icon: Users,
      badge: totalInmates
    },
    {
      id: 'headcount',
      label: 'Muster & Headcount',
      icon: ClipboardCheck,
      badge: headcount.status === 'Emergency Discrepancy' ? 'ALERT' : null,
      badgeAlert: headcount.status === 'Emergency Discrepancy'
    },
    {
      id: 'housing',
      label: 'Cell & Housing Map',
      icon: Grid3X3,
      badge: null
    },
    {
      id: 'incidents',
      label: 'Incident & Sanctions',
      icon: AlertOctagon,
      badge: activeIncidents > 0 ? activeIncidents : null
    },
    {
      id: 'visitors',
      label: 'Visitor Management',
      icon: UserCheck,
      badge: pendingVisits > 0 ? pendingVisits : null
    },
    {
      id: 'medical',
      label: 'Medical & Infirmary (MAR)',
      icon: Stethoscope,
      badge: null
    },
    {
      id: 'staff',
      label: 'Guard & Post Roster',
      icon: ShieldCheck,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-57px)] sticky top-[57px] select-none">
      <div className="p-4 space-y-6">
        {/* Facility Quick Census Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">POPULATION CENSUS</span>
            <span className="font-mono text-amber-400 font-semibold">{totalInmates} / {facility.operationalCapacity}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((totalInmates / facility.operationalCapacity) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
            <span>Capacity Util: {((totalInmates / facility.operationalCapacity) * 100).toFixed(1)}%</span>
            <span>Muster: {headcount.status}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Facility Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span 
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${
                      item.badgeAlert 
                        ? 'bg-red-950 text-red-300 border-red-700 font-bold animate-pulse' 
                        : isActive
                        ? 'bg-amber-400/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Duty Supervisor Badge & System Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img 
              src="/src/assets/images/officer_portrait_warden_1793009698997.jpg" 
              alt="Warden Captain J. Miller"
              className="w-9 h-9 rounded object-cover border border-slate-700"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">Capt. J. Miller</div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>TAC-1 Command</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
