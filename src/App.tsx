/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PrisonProvider, usePrison } from './context/PrisonContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InmatesRosterView } from './components/inmates/InmatesRosterView';
import { HeadcountView } from './components/headcount/HeadcountView';
import { HousingCellMapView } from './components/housing/HousingCellMapView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { VisitorsView } from './components/visitors/VisitorsView';
import { MedicalWardView } from './components/medical/MedicalWardView';
import { StaffRosterView } from './components/staff/StaffRosterView';

// Modals
import { InmateDossierModal } from './components/inmates/InmateDossierModal';
import { BookingIntakeModal } from './components/inmates/BookingIntakeModal';
import { LockdownModal } from './components/modals/LockdownModal';
import { PrintDossierModal } from './components/print/PrintDossierModal';

const PrisonAppContent: React.FC = () => {
  const { activeTab } = usePrison();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main Workspace: Sidebar + Dynamic Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'inmates' && <InmatesRosterView />}
            {activeTab === 'headcount' && <HeadcountView />}
            {activeTab === 'housing' && <HousingCellMapView />}
            {activeTab === 'incidents' && <IncidentsView />}
            {activeTab === 'visitors' && <VisitorsView />}
            {activeTab === 'medical' && <MedicalWardView />}
            {activeTab === 'staff' && <StaffRosterView />}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <InmateDossierModal />
      <BookingIntakeModal />
      <LockdownModal />
      <PrintDossierModal />
    </div>
  );
};

export default function App() {
  return (
    <PrisonProvider>
      <PrisonAppContent />
    </PrisonProvider>
  );
}
