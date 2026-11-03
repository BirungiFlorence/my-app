import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Inmate, 
  HousingBlock, 
  HeadcountRoll, 
  IncidentReport, 
  VisitorRecord, 
  MedicationAdminRecord, 
  StaffOfficer, 
  FacilityState,
  FacilityAlertLevel,
  CustodyStatus,
  HousingBlockCode,
  CountShift
} from '../types/prison';
import { 
  INITIAL_FACILITY_STATE, 
  INITIAL_INMATES, 
  INITIAL_HOUSING_BLOCKS, 
  INITIAL_HEADCOUNT, 
  INITIAL_INCIDENTS, 
  INITIAL_VISITORS, 
  INITIAL_MEDICATIONS, 
  INITIAL_STAFF 
} from '../data/mockData';

interface PrisonContextType {
  facility: FacilityState;
  inmates: Inmate[];
  housingBlocks: HousingBlock[];
  headcount: HeadcountRoll;
  incidents: IncidentReport[];
  visitors: VisitorRecord[];
  medications: MedicationAdminRecord[];
  staff: StaffOfficer[];
  
  // UI states
  activeTab: 'dashboard' | 'inmates' | 'headcount' | 'housing' | 'incidents' | 'visitors' | 'medical' | 'staff';
  setActiveTab: (tab: 'dashboard' | 'inmates' | 'headcount' | 'housing' | 'incidents' | 'visitors' | 'medical' | 'staff') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedInmateForDossier: Inmate | null;
  setSelectedInmateForDossier: (inmate: Inmate | null) => void;
  selectedInmateForPrint: Inmate | null;
  setSelectedInmateForPrint: (inmate: Inmate | null) => void;
  
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isIncidentModalOpen: boolean;
  setIsIncidentModalOpen: (open: boolean) => void;
  isVisitorModalOpen: boolean;
  setIsVisitorModalOpen: (open: boolean) => void;
  isLockdownModalOpen: boolean;
  setIsLockdownModalOpen: (open: boolean) => void;

  // Actions
  addInmate: (inmate: Omit<Inmate, 'id'>) => string;
  updateInmate: (inmateId: string, updates: Partial<Inmate>) => void;
  reassignCell: (inmateId: string, targetBlock: HousingBlockCode, targetCell: string, targetBunk: 'Lower' | 'Upper' | 'Single') => boolean;
  updateInmateStatus: (inmateId: string, newStatus: CustodyStatus) => void;
  
  setFacilityAlertLevel: (level: FacilityAlertLevel, reason?: string) => void;
  verifyInmateInCount: (inmateId: string, verified: boolean, notes?: string) => void;
  flagInmateUnaccounted: (inmateId: string, flagged: boolean, notes?: string) => void;
  reconcileHeadcount: (supervisorName: string) => void;
  startNewHeadcount: (shift: CountShift) => void;

  addIncident: (incident: Omit<IncidentReport, 'id' | 'incidentNumber'>) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentReport['disciplinaryStatus'], sanctions?: string) => void;

  addVisitor: (visitor: Omit<VisitorRecord, 'id'>) => void;
  updateVisitorStatus: (visitorId: string, status: VisitorRecord['status'], screeningPassed?: boolean) => void;

  markMedicationAdministered: (medId: string, officerName: string, vitals?: string) => void;
  addMedication: (med: Omit<MedicationAdminRecord, 'id'>) => void;
  
  updateStaffStatus: (staffId: string, status: StaffOfficer['status']) => void;
  resetToDefaults: () => void;
}

const PrisonContext = createContext<PrisonContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'ironwood_pims_';

export const PrisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Facility state
  const [facility, setFacility] = useState<FacilityState>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}facility`);
    return saved ? JSON.parse(saved) : INITIAL_FACILITY_STATE;
  });

  // Inmates
  const [inmates, setInmates] = useState<Inmate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}inmates`);
    return saved ? JSON.parse(saved) : INITIAL_INMATES;
  });

  // Housing blocks
  const [housingBlocks, setHousingBlocks] = useState<HousingBlock[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}housing`);
    return saved ? JSON.parse(saved) : INITIAL_HOUSING_BLOCKS;
  });

  // Headcount
  const [headcount, setHeadcount] = useState<HeadcountRoll>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}headcount`);
    return saved ? JSON.parse(saved) : INITIAL_HEADCOUNT;
  });

  // Incidents
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}incidents`);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  // Visitors
  const [visitors, setVisitors] = useState<VisitorRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}visitors`);
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  // Medications
  const [medications, setMedications] = useState<MedicationAdminRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}medications`);
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  // Staff
  const [staff, setStaff] = useState<StaffOfficer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inmates' | 'headcount' | 'housing' | 'incidents' | 'visitors' | 'medical' | 'staff'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Selected items
  const [selectedInmateForDossier, setSelectedInmateForDossier] = useState<Inmate | null>(null);
  const [selectedInmateForPrint, setSelectedInmateForPrint] = useState<Inmate | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isLockdownModalOpen, setIsLockdownModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}facility`, JSON.stringify(facility));
  }, [facility]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}inmates`, JSON.stringify(inmates));
  }, [inmates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}housing`, JSON.stringify(housingBlocks));
  }, [housingBlocks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}headcount`, JSON.stringify(headcount));
  }, [headcount]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}incidents`, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}visitors`, JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}medications`, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}staff`, JSON.stringify(staff));
  }, [staff]);

  // Keep cell occupant references synchronized with inmates
  const syncHousingBlockOccupancy = (allInmates: Inmate[], currentBlocks: HousingBlock[]): HousingBlock[] => {
    return currentBlocks.map(block => ({
      ...block,
      cells: block.cells.map(cell => {
        const matchingInmates = allInmates
          .filter(inm => inm.cellBlock === block.code && inm.cellNumber === cell.cellNumber && inm.custodyStatus !== 'Released')
          .map(inm => inm.id);
        return {
          ...cell,
          occupiedBy: matchingInmates
        };
      })
    }));
  };

  // Add Inmate
  const addInmate = (inmateData: Omit<Inmate, 'id'>): string => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newId = `INM-${randomDigits}`;
    const newInmate: Inmate = {
      ...inmateData,
      id: newId
    };

    const updatedInmates = [newInmate, ...inmates];
    setInmates(updatedInmates);

    // Update housing occupancy
    setHousingBlocks(prev => syncHousingBlockOccupancy(updatedInmates, prev));

    // Also add to current active headcount verification list
    setHeadcount(prev => ({
      ...prev,
      censusTarget: prev.censusTarget + 1,
      inmateVerifications: [
        ...prev.inmateVerifications,
        {
          inmateId: newId,
          inmateName: `${newInmate.firstName} ${newInmate.lastName}`,
          cellBlock: newInmate.cellBlock,
          cellNumber: newInmate.cellNumber,
          status: newInmate.custodyStatus,
          verified: true,
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedBy: "Intake Booking Officer",
          flaggedUnaccounted: false,
          notes: "Admitted during active census cycle"
        }
      ]
    }));

    return newId;
  };

  // Update Inmate
  const updateInmate = (inmateId: string, updates: Partial<Inmate>) => {
    setInmates(prev => {
      const updated = prev.map(inm => inm.id === inmateId ? { ...inm, ...updates } : inm);
      setHousingBlocks(blocks => syncHousingBlockOccupancy(updated, blocks));
      return updated;
    });

    if (selectedInmateForDossier?.id === inmateId) {
      setSelectedInmateForDossier(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Reassign Cell
  const reassignCell = (
    inmateId: string, 
    targetBlock: HousingBlockCode, 
    targetCell: string, 
    targetBunk: 'Lower' | 'Upper' | 'Single'
  ): boolean => {
    const inmate = inmates.find(i => i.id === inmateId);
    if (!inmate) return false;

    const updatedInmates = inmates.map(i => {
      if (i.id === inmateId) {
        return {
          ...i,
          cellBlock: targetBlock,
          cellNumber: targetCell,
          bunk: targetBunk
        };
      }
      return i;
    });

    setInmates(updatedInmates);
    setHousingBlocks(prev => syncHousingBlockOccupancy(updatedInmates, prev));

    // Update headcount entry
    setHeadcount(prev => ({
      ...prev,
      inmateVerifications: prev.inmateVerifications.map(v => 
        v.inmateId === inmateId ? { ...v, cellBlock: targetBlock, cellNumber: targetCell } : v
      )
    }));

    if (selectedInmateForDossier?.id === inmateId) {
      setSelectedInmateForDossier(prev => prev ? { 
        ...prev, 
        cellBlock: targetBlock, 
        cellNumber: targetCell, 
        bunk: targetBunk 
      } : null);
    }

    return true;
  };

  // Update Inmate Custody Status
  const updateInmateStatus = (inmateId: string, newStatus: CustodyStatus) => {
    updateInmate(inmateId, { custodyStatus: newStatus });

    setHeadcount(prev => ({
      ...prev,
      inmateVerifications: prev.inmateVerifications.map(v => 
        v.inmateId === inmateId ? { ...v, status: newStatus } : v
      )
    }));
  };

  // Facility Alert Level / Lockdown
  const setFacilityAlertLevel = (level: FacilityAlertLevel, reason?: string) => {
    const timestamp = new Date().toLocaleString();
    setFacility(prev => ({
      ...prev,
      facilityAlertLevel: level,
      lockdownReason: level !== 'Normal Operations' ? (reason || 'Security protocol initiated by Command Staff') : undefined,
      lockdownInitiatedAt: level !== 'Normal Operations' ? timestamp : undefined,
      lockdownInitiatedBy: level !== 'Normal Operations' ? 'Captain J. Miller (#101)' : undefined
    }));
  };

  // Headcount Verification
  const verifyInmateInCount = (inmateId: string, verified: boolean, notes?: string) => {
    setHeadcount(prev => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedVerifications = prev.inmateVerifications.map(v => {
        if (v.inmateId === inmateId) {
          return {
            ...v,
            verified,
            verifiedAt: verified ? now : undefined,
            verifiedBy: verified ? "Watch Officer" : undefined,
            flaggedUnaccounted: verified ? false : v.flaggedUnaccounted,
            notes: notes !== undefined ? notes : v.notes
          };
        }
        return v;
      });

      const verifiedCount = updatedVerifications.filter(v => v.verified).length;
      const unaccounted = updatedVerifications.filter(v => v.flaggedUnaccounted).length;
      const allVerified = verifiedCount === prev.censusTarget && unaccounted === 0;

      return {
        ...prev,
        inmateVerifications: updatedVerifications,
        verifiedTotal: verifiedCount,
        unaccountedCount: unaccounted,
        status: unaccounted > 0 ? 'Emergency Discrepancy' : (allVerified ? 'Reconciled' : 'In Progress')
      };
    });
  };

  const flagInmateUnaccounted = (inmateId: string, flagged: boolean, notes?: string) => {
    setHeadcount(prev => {
      const updatedVerifications = prev.inmateVerifications.map(v => {
        if (v.inmateId === inmateId) {
          return {
            ...v,
            flaggedUnaccounted: flagged,
            verified: flagged ? false : v.verified,
            notes: notes || (flagged ? "FLAGGED: Unaccounted during physical cell check!" : v.notes)
          };
        }
        return v;
      });

      const verifiedCount = updatedVerifications.filter(v => v.verified).length;
      const unaccounted = updatedVerifications.filter(v => v.flaggedUnaccounted).length;

      return {
        ...prev,
        inmateVerifications: updatedVerifications,
        verifiedTotal: verifiedCount,
        unaccountedCount: unaccounted,
        status: unaccounted > 0 ? 'Emergency Discrepancy' : (verifiedCount === prev.censusTarget ? 'Reconciled' : 'In Progress')
      };
    });
  };

  const reconcileHeadcount = (supervisorName: string) => {
    setHeadcount(prev => {
      const allVerified = prev.verifiedTotal === prev.censusTarget && prev.unaccountedCount === 0;
      return {
        ...prev,
        status: allVerified ? 'Reconciled' : (prev.unaccountedCount > 0 ? 'Emergency Discrepancy' : 'In Progress'),
        certifyingSupervisor: supervisorName,
        completedAt: new Date().toLocaleString()
      };
    });
  };

  const startNewHeadcount = (shift: CountShift) => {
    const activeInmates = inmates.filter(i => i.custodyStatus !== 'Released');
    const newCount: HeadcountRoll = {
      id: `COUNT-${Date.now()}`,
      shift,
      countDate: new Date().toISOString().split('T')[0],
      scheduledTime: shift.includes('06:00') ? '06:00' : shift.includes('12:00') ? '12:00' : shift.includes('18:00') ? '18:00' : '22:00',
      status: 'In Progress',
      censusTarget: activeInmates.length,
      verifiedTotal: 0,
      unaccountedCount: 0,
      conductedByOfficer: 'Watch Officer Team',
      certifyingSupervisor: 'Captain J. Miller (#101)',
      inmateVerifications: activeInmates.map(inm => ({
        inmateId: inm.id,
        inmateName: `${inm.firstName} ${inm.lastName}`,
        cellBlock: inm.cellBlock,
        cellNumber: inm.cellNumber,
        status: inm.custodyStatus,
        verified: false,
        flaggedUnaccounted: false
      }))
    };
    setHeadcount(newCount);
  };

  // Incidents
  const addIncident = (incidentData: Omit<IncidentReport, 'id' | 'incidentNumber'>) => {
    const seq = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const incNumber = `IR-${year}-${seq}`;
    const newIncident: IncidentReport = {
      ...incidentData,
      id: `INC-${year}-${seq}`,
      incidentNumber: incNumber
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const updateIncidentStatus = (
    incidentId: string, 
    status: IncidentReport['disciplinaryStatus'], 
    sanctions?: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          disciplinaryStatus: status,
          sanctionsApplied: sanctions !== undefined ? sanctions : inc.sanctionsApplied
        };
      }
      return inc;
    }));
  };

  // Visitors
  const addVisitor = (visitorData: Omit<VisitorRecord, 'id'>) => {
    const newVisitor: VisitorRecord = {
      ...visitorData,
      id: `VIS-${Date.now().toString().slice(-6)}`
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const updateVisitorStatus = (
    visitorId: string, 
    status: VisitorRecord['status'], 
    screeningPassed?: boolean
  ) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(vis => {
      if (vis.id === visitorId) {
        return {
          ...vis,
          status,
          contrabandScreeningPassed: screeningPassed !== undefined ? screeningPassed : vis.contrabandScreeningPassed,
          checkInTime: status === 'Checked In' ? now : vis.checkInTime,
          checkOutTime: status === 'Completed' ? now : vis.checkOutTime
        };
      }
      return vis;
    }));
  };

  // Medications
  const markMedicationAdministered = (medId: string, officerName: string, vitals?: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        return {
          ...med,
          administered: true,
          administeredAt: now,
          administeredBy: officerName,
          vitalSignsCheck: vitals || med.vitalSignsCheck
        };
      }
      return med;
    }));
  };

  const addMedication = (medData: Omit<MedicationAdminRecord, 'id'>) => {
    const newMed: MedicationAdminRecord = {
      ...medData,
      id: `MED-${Date.now().toString().slice(-4)}`
    };
    setMedications(prev => [...prev, newMed]);
  };

  // Staff
  const updateStaffStatus = (staffId: string, status: StaffOfficer['status']) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status } : s));
  };

  // Reset to initial defaults
  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}facility`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}inmates`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}housing`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}headcount`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}incidents`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}visitors`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}medications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}staff`);

    setFacility(INITIAL_FACILITY_STATE);
    setInmates(INITIAL_INMATES);
    setHousingBlocks(INITIAL_HOUSING_BLOCKS);
    setHeadcount(INITIAL_HEADCOUNT);
    setIncidents(INITIAL_INCIDENTS);
    setVisitors(INITIAL_VISITORS);
    setMedications(INITIAL_MEDICATIONS);
    setStaff(INITIAL_STAFF);
    setSelectedInmateForDossier(null);
    setSelectedInmateForPrint(null);
  };

  return (
    <PrisonContext.Provider
      value={{
        facility,
        inmates,
        housingBlocks,
        headcount,
        incidents,
        visitors,
        medications,
        staff,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedInmateForDossier,
        setSelectedInmateForDossier,
        selectedInmateForPrint,
        setSelectedInmateForPrint,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isIncidentModalOpen,
        setIsIncidentModalOpen,
        isVisitorModalOpen,
        setIsVisitorModalOpen,
        isLockdownModalOpen,
        setIsLockdownModalOpen,
        addInmate,
        updateInmate,
        reassignCell,
        updateInmateStatus,
        setFacilityAlertLevel,
        verifyInmateInCount,
        flagInmateUnaccounted,
        reconcileHeadcount,
        startNewHeadcount,
        addIncident,
        updateIncidentStatus,
        addVisitor,
        updateVisitorStatus,
        markMedicationAdministered,
        addMedication,
        updateStaffStatus,
        resetToDefaults
      }}
    >
      {children}
    </PrisonContext.Provider>
  );
};

export const usePrison = () => {
  const context = useContext(PrisonContext);
  if (!context) {
    throw new Error('usePrison must be used within a PrisonProvider');
  }
  return context;
};
