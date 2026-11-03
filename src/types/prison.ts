/**
 * Prison Information Management System (PIMS) Data Models & Types
 */

export type SecurityLevel = 'Minimum' | 'Medium' | 'Maximum' | 'Supermax';

export type CustodyStatus = 
  | 'In Custody' 
  | 'Solitary Confinement' 
  | 'Medical Ward' 
  | 'Court Transit' 
  | 'Work Detail' 
  | 'Released';

export type HousingBlockCode = 'Block A' | 'Block B' | 'Block C' | 'Block D' | 'Ward M';

export interface ChargeRecord {
  code: string;
  title: string;
  felonyClass: 'Class A' | 'Class B' | 'Class C' | 'Misdemeanor';
  sentenceYears: number;
  convictionDate: string;
  courtJurisdiction: string;
}

export interface BiometricRecord {
  height: string;       // e.g. "6' 1\""
  weight: string;       // e.g. "195 lbs"
  eyeColor: string;     // e.g. "Brown"
  hairColor: string;    // e.g. "Black"
  scarsAndTattoos: string;
  bloodType: string;
  fingerprintsOnFile: boolean;
  dnaSampleCollected: boolean;
}

export interface Inmate {
  id: string;                    // Institutional ID, e.g. "INM-84920"
  bookingNumber: string;         // e.g. "BK-2024-0491"
  stateIdNumber: string;         // SID, e.g. "SID-994182"
  firstName: string;
  middleName?: string;
  lastName: string;
  aliases: string[];
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  photoUrl: string;
  securityLevel: SecurityLevel;
  custodyStatus: CustodyStatus;
  cellBlock: HousingBlockCode;
  cellNumber: string;            // e.g. "B-104"
  bunk: 'Lower' | 'Upper' | 'Single';
  admissionDate: string;
  projectedReleaseDate: string;
  paroleEligibilityDate: string;
  primaryOffense: string;
  charges: ChargeRecord[];
  bailAmount: number;
  bailEligible: boolean;
  biometrics: BiometricRecord;
  medicalAlerts: string[];
  suicideWatch: boolean;
  gangAffiliation?: string;
  trustAccountBalance: number;
  workDetail?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  assignedOfficer: string;
  notes?: string;
}

export interface CellRecord {
  cellNumber: string;
  capacity: number;
  occupiedBy: string[]; // Inmate IDs
  tier: number;
  status: 'Operational' | 'Maintenance' | 'Sanitary Quarantine';
}

export interface HousingBlock {
  id: string;
  code: HousingBlockCode;
  name: string;
  securityTier: SecurityLevel | 'Segregation' | 'Medical';
  totalCells: number;
  capacity: number;
  cells: CellRecord[];
}

export type CountShift = 
  | 'Morning Muster (06:00)' 
  | 'Midday Count (12:00)' 
  | 'Evening Muster (18:00)' 
  | 'Night Lockup (22:00)';

export interface InmateVerification {
  inmateId: string;
  inmateName: string;
  cellBlock: HousingBlockCode;
  cellNumber: string;
  status: CustodyStatus;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  flaggedUnaccounted: boolean;
  notes?: string;
}

export interface HeadcountRoll {
  id: string;
  shift: CountShift;
  countDate: string;
  scheduledTime: string;
  status: 'Pending' | 'In Progress' | 'Reconciled' | 'Emergency Discrepancy';
  censusTarget: number;
  verifiedTotal: number;
  unaccountedCount: number;
  conductedByOfficer: string;
  certifyingSupervisor: string;
  completedAt?: string;
  inmateVerifications: InmateVerification[];
}

export type IncidentCategory = 
  | 'Physical Altercation' 
  | 'Contraband Seizure' 
  | 'Rule Violation' 
  | 'Attempted Escape' 
  | 'Medical Emergency' 
  | 'Staff Insubordination' 
  | 'Property Destruction';

export type IncidentSeverity = 'Low' | 'Medium' | 'Critical';

export interface InvolvedInmate {
  inmateId: string;
  inmateName: string;
  role: 'Aggressor' | 'Victim' | 'Participant' | 'Witness';
}

export interface IncidentReport {
  id: string;
  incidentNumber: string;
  timestamp: string;
  location: string;
  cellBlock?: HousingBlockCode;
  category: IncidentCategory;
  severity: IncidentSeverity;
  involvedInmates: InvolvedInmate[];
  reportingOfficer: string;
  badgeNumber: string;
  summary: string;
  evidenceItems: string[];
  disciplinaryStatus: 'Under Investigation' | 'Hearing Scheduled' | 'Sanctions Imposed' | 'Dismissed';
  sanctionsApplied?: string;
}

export interface VisitorRecord {
  id: string;
  visitorName: string;
  idDocumentType: 'Driver License' | 'Passport' | 'State ID' | 'Bar Association Card';
  idNumber: string;
  phone: string;
  inmateId: string;
  inmateName: string;
  relationship: 'Immediate Family' | 'Attorney / Legal Counsel' | 'Clergy' | 'Case Officer' | 'Authorized Visitor';
  scheduledDate: string;
  timeSlot: string;
  boothNumber: string;
  backgroundCheck: 'Approved' | 'Flagged' | 'Pending';
  contrabandScreeningPassed: boolean;
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'Denied Entry';
  checkInTime?: string;
  checkOutTime?: string;
  officerNotes?: string;
}

export interface MedicationAdminRecord {
  id: string;
  inmateId: string;
  inmateName: string;
  cellLocation: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribingDoctor: string;
  scheduledTime: string;
  administered: boolean;
  administeredAt?: string;
  administeredBy?: string;
  vitalSignsCheck?: string;
  specialInstructions?: string;
}

export interface StaffOfficer {
  id: string;
  name: string;
  badge: string;
  rank: 'Officer' | 'Senior Officer' | 'Sergeant' | 'Lieutenant' | 'Captain' | 'Warden';
  assignedPost: string;
  shift: 'Day Shift (06:00 - 14:00)' | 'Swing Shift (14:00 - 22:00)' | 'Night Shift (22:00 - 06:00)';
  radioChannel: string;
  status: 'On Duty' | 'On Patrol' | 'Meal Break' | 'Post Relief' | 'Off Duty';
  phoneExtension: string;
}

export type FacilityAlertLevel = 
  | 'Normal Operations' 
  | 'Elevated Precaution' 
  | 'Cellblock Lockdown' 
  | 'Facility Full Lockdown';

export interface FacilityState {
  facilityName: string;
  institutionCode: string;
  facilityAlertLevel: FacilityAlertLevel;
  operationalCapacity: number;
  lockdownReason?: string;
  lockdownInitiatedAt?: string;
  lockdownInitiatedBy?: string;
}
