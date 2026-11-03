import { 
  Inmate, 
  HousingBlock, 
  HeadcountRoll, 
  IncidentReport, 
  VisitorRecord, 
  MedicationAdminRecord, 
  StaffOfficer, 
  FacilityState 
} from '../types/prison';

export const INITIAL_FACILITY_STATE: FacilityState = {
  facilityName: "Ironwood State Correctional Facility",
  institutionCode: "ISCF-NORTH",
  facilityAlertLevel: "Normal Operations",
  operationalCapacity: 1200
};

export const INITIAL_INMATES: Inmate[] = [
  {
    id: "INM-84920",
    bookingNumber: "BK-2023-0492",
    stateIdNumber: "SID-8839102",
    firstName: "Marcus",
    middleName: "Dean",
    lastName: "Vance",
    aliases: ["Vance", "D-Vance"],
    dateOfBirth: "1988-04-12",
    gender: "Male",
    photoUrl: "/src/assets/images/inmate_portrait_male_one_1793009697066.jpg",
    securityLevel: "Maximum",
    custodyStatus: "In Custody",
    cellBlock: "Block C",
    cellNumber: "C-102",
    bunk: "Lower",
    admissionDate: "2023-10-26",
    projectedReleaseDate: "2035-08-14",
    paroleEligibilityDate: "2031-11-01",
    primaryOffense: "Armed Robbery & Aggravated Assault (Repeat Offense)",
    charges: [
      {
        code: "PEN-211-AR",
        title: "Armed Robbery with Firearm",
        felonyClass: "Class A",
        sentenceYears: 10,
        convictionDate: "2023-11-15",
        courtJurisdiction: "1st Circuit Superior Court"
      },
      {
        code: "PEN-245-AA",
        title: "Assault with a Deadly Weapon",
        felonyClass: "Class B",
        sentenceYears: 5,
        convictionDate: "2023-11-15",
        courtJurisdiction: "1st Circuit Superior Court"
      }
    ],
    bailAmount: 500000,
    bailEligible: false,
    biometrics: {
      height: "6' 1\"",
      weight: "195 lbs",
      eyeColor: "Brown",
      hairColor: "Brown",
      scarsAndTattoos: "2-inch scar across left eyebrow; barbed wire tattoo on right forearm",
      bloodType: "O+",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Chronic Asthma (Inhaler kept on person)"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 245.50,
    workDetail: "Industrial Laundry Detail (Mon/Wed/Fri)",
    emergencyContact: {
      name: "Evelyn Vance",
      relationship: "Mother",
      phone: "(555) 234-8901"
    },
    assignedOfficer: "Sgt. D. Kowalski (#408)",
    notes: "Requires standard maximum security escort during inter-facility transit."
  },
  {
    id: "INM-72104",
    bookingNumber: "BK-2023-0118",
    stateIdNumber: "SID-4410294",
    firstName: "Thomas",
    middleName: "Ray",
    lastName: "Callahan",
    aliases: ["Tommy Guns"],
    dateOfBirth: "1974-09-03",
    gender: "Male",
    photoUrl: "/src/assets/images/inmate_portrait_male_two_1793009697647.jpg",
    securityLevel: "Medium",
    custodyStatus: "In Custody",
    cellBlock: "Block B",
    cellNumber: "B-204",
    bunk: "Lower",
    admissionDate: "2023-10-24",
    projectedReleaseDate: "2028-05-20",
    paroleEligibilityDate: "2026-12-10",
    primaryOffense: "Grand Larceny & Racketeering",
    charges: [
      {
        code: "PEN-487-GL",
        title: "Grand Theft Exceeding $100,000",
        felonyClass: "Class B",
        sentenceYears: 5,
        convictionDate: "2023-12-02",
        courtJurisdiction: "Central District Federal Court"
      }
    ],
    bailAmount: 150000,
    bailEligible: false,
    biometrics: {
      height: "5' 11\"",
      weight: "205 lbs",
      eyeColor: "Hazel",
      hairColor: "Graying Brown",
      scarsAndTattoos: "Surgical appendectomy scar; anchor tattoo on upper left chest",
      bloodType: "A+",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Type 2 Diabetes (Finger stick twice daily, Metformin 500mg)"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 1210.00,
    workDetail: "Facility Library Clerk",
    emergencyContact: {
      name: "Karen Callahan",
      relationship: "Sister",
      phone: "(555) 345-6712"
    },
    assignedOfficer: "Off. R. Henderson (#512)",
    notes: "Demonstrates consistent good behavior; designated trusty eligible."
  },
  {
    id: "INM-93041",
    bookingNumber: "BK-2023-0941",
    stateIdNumber: "SID-7193021",
    firstName: "Jessica",
    middleName: "Marie",
    lastName: "Alvarez",
    aliases: ["Jessie"],
    dateOfBirth: "1991-05-12",
    gender: "Female",
    photoUrl: "/src/assets/images/inmate_portrait_female_one_1793009699802.jpg",
    securityLevel: "Medium",
    custodyStatus: "In Custody",
    cellBlock: "Ward M",
    cellNumber: "M-101",
    bunk: "Single",
    admissionDate: "2023-10-26",
    projectedReleaseDate: "2029-03-30",
    paroleEligibilityDate: "2027-04-15",
    primaryOffense: "Distribution of Controlled Substances (Schedule II)",
    charges: [
      {
        code: "HSC-11352-CS",
        title: "Transport / Sale of Controlled Narcotics",
        felonyClass: "Class A",
        sentenceYears: 6,
        convictionDate: "2024-01-10",
        courtJurisdiction: "Municipal District Court"
      }
    ],
    bailAmount: 250000,
    bailEligible: false,
    biometrics: {
      height: "5' 6\"",
      weight: "135 lbs",
      eyeColor: "Brown",
      hairColor: "Dark Blonde",
      scarsAndTattoos: "Small bird tattoo on left collarbone",
      bloodType: "B+",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Severe Penicillin Allergy", "Post-Surgical Monitoring (Right Knee)"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 430.75,
    workDetail: "Medical Ward Sanitation Assistant",
    emergencyContact: {
      name: "Carlos Alvarez",
      relationship: "Father",
      phone: "(555) 789-1234"
    },
    assignedOfficer: "Off. S. Rodriguez (#334)",
    notes: "Temporarily housed in Ward M for physical therapy rehabilitation."
  },
  {
    id: "INM-61209",
    bookingNumber: "BK-2022-0761",
    stateIdNumber: "SID-1102948",
    firstName: "Derrick",
    middleName: "James",
    lastName: "Holt",
    aliases: ["D-Rock"],
    dateOfBirth: "1984-11-20",
    gender: "Male",
    photoUrl: "",
    securityLevel: "Supermax",
    custodyStatus: "Solitary Confinement",
    cellBlock: "Block D",
    cellNumber: "D-004",
    bunk: "Single",
    admissionDate: "2022-08-14",
    projectedReleaseDate: "2044-10-01",
    paroleEligibilityDate: "2038-06-01",
    primaryOffense: "Second Degree Murder & Inmate Assault",
    charges: [
      {
        code: "PEN-187-M2",
        title: "Murder in the Second Degree",
        felonyClass: "Class A",
        sentenceYears: 20,
        convictionDate: "2022-09-19",
        courtJurisdiction: "State Supreme Criminal Division"
      },
      {
        code: "PEN-4501-AB",
        title: "Battery on Correctional Staff",
        felonyClass: "Class B",
        sentenceYears: 3,
        convictionDate: "2024-03-04",
        courtJurisdiction: "Disciplinary Adjudication Board"
      }
    ],
    bailAmount: 0,
    bailEligible: false,
    biometrics: {
      height: "6' 3\"",
      weight: "220 lbs",
      eyeColor: "Brown",
      hairColor: "Black",
      scarsAndTattoos: "Tribal sleeve right arm; teardrop tattoo near left eye",
      bloodType: "AB-",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Hypertension (Lisinopril 20mg)", "High Violence Risk"],
    suicideWatch: false,
    gangAffiliation: "Northside Brotherhood",
    trustAccountBalance: 52.00,
    workDetail: "Disqualified - Segregated Custody",
    emergencyContact: {
      name: "Tanya Holt",
      relationship: "Spouse",
      phone: "(555) 432-8765"
    },
    assignedOfficer: "Lt. M. Briggs (#109)",
    notes: "Requires two-officer escort and mechanical restraints whenever outside cell D-004."
  },
  {
    id: "INM-55319",
    bookingNumber: "BK-2024-0102",
    stateIdNumber: "SID-5091834",
    firstName: "Samuel",
    middleName: "Arthur",
    lastName: "Glover",
    aliases: ["Sammy"],
    dateOfBirth: "1995-02-14",
    gender: "Male",
    photoUrl: "",
    securityLevel: "Minimum",
    custodyStatus: "Work Detail",
    cellBlock: "Block A",
    cellNumber: "A-108",
    bunk: "Upper",
    admissionDate: "2024-01-15",
    projectedReleaseDate: "2026-08-30",
    paroleEligibilityDate: "2025-11-20",
    primaryOffense: "Commercial Burglary & Trespass",
    charges: [
      {
        code: "PEN-459-B2",
        title: "Commercial Burglary Second Degree",
        felonyClass: "Class C",
        sentenceYears: 2.5,
        convictionDate: "2024-02-10",
        courtJurisdiction: "County Circuit Court"
      }
    ],
    bailAmount: 25000,
    bailEligible: true,
    biometrics: {
      height: "5' 9\"",
      weight: "165 lbs",
      eyeColor: "Blue",
      hairColor: "Sandy Blonde",
      scarsAndTattoos: "Forearm script tattoo 'Fortitude'",
      bloodType: "O-",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Seasonal Pollen Allergies"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 610.40,
    workDetail: "Perimeter Grounds & Culinary Kitchen Crew",
    emergencyContact: {
      name: "Linda Glover",
      relationship: "Mother",
      phone: "(555) 678-9012"
    },
    assignedOfficer: "Off. T. Baker (#602)",
    notes: "Trusty grade clearance; approved for unescorted kitchen assignment."
  },
  {
    id: "INM-41982",
    bookingNumber: "BK-2024-0288",
    stateIdNumber: "SID-3391820",
    firstName: "Victor",
    middleName: "Manuel",
    lastName: "Salazar",
    aliases: ["Vic"],
    dateOfBirth: "1980-07-29",
    gender: "Male",
    photoUrl: "",
    securityLevel: "Maximum",
    custodyStatus: "Court Transit",
    cellBlock: "Block C",
    cellNumber: "C-201",
    bunk: "Lower",
    admissionDate: "2024-03-01",
    projectedReleaseDate: "2038-12-31",
    paroleEligibilityDate: "2033-05-18",
    primaryOffense: "Conspiracy to Distribute Class A Narcotics & Firearm Offenses",
    charges: [
      {
        code: "FED-21-USC-846",
        title: "Conspiracy to Distribute Heroin / Fentanyl",
        felonyClass: "Class A",
        sentenceYears: 15,
        convictionDate: "2024-04-12",
        courtJurisdiction: "United States District Court"
      }
    ],
    bailAmount: 1000000,
    bailEligible: false,
    biometrics: {
      height: "6' 0\"",
      weight: "210 lbs",
      eyeColor: "Brown",
      hairColor: "Black",
      scarsAndTattoos: "Large dragon tattoo across back; scar on chin",
      bloodType: "A-",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["None Reported"],
    suicideWatch: false,
    gangAffiliation: "Subject of Intel Monitoring",
    trustAccountBalance: 3200.00,
    workDetail: "None - High Security Restraint",
    emergencyContact: {
      name: "Elena Salazar",
      relationship: "Wife",
      phone: "(555) 890-1234"
    },
    assignedOfficer: "Sgt. D. Kowalski (#408)",
    notes: "Presently out of facility for federal court hearing. Expected return 17:30."
  },
  {
    id: "INM-39821",
    bookingNumber: "BK-2024-0402",
    stateIdNumber: "SID-9018472",
    firstName: "Ethan",
    middleName: "Cole",
    lastName: "Brooks",
    aliases: ["E-Cole"],
    dateOfBirth: "1999-10-05",
    gender: "Male",
    photoUrl: "",
    securityLevel: "Medium",
    custodyStatus: "In Custody",
    cellBlock: "Block B",
    cellNumber: "B-106",
    bunk: "Upper",
    admissionDate: "2024-04-10",
    projectedReleaseDate: "2027-09-15",
    paroleEligibilityDate: "2026-03-01",
    primaryOffense: "Motor Vehicle Theft & Reckless Evading",
    charges: [
      {
        code: "VEH-10851-A",
        title: "Unlawful Driving / Taking of a Vehicle",
        felonyClass: "Class C",
        sentenceYears: 3,
        convictionDate: "2024-05-02",
        courtJurisdiction: "Municipal Court"
      }
    ],
    bailAmount: 50000,
    bailEligible: true,
    biometrics: {
      height: "5' 10\"",
      weight: "170 lbs",
      eyeColor: "Hazel",
      hairColor: "Brown",
      scarsAndTattoos: "Eagle tattoo on chest",
      bloodType: "B-",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Mild Depression (Counseling every 2 weeks)"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 180.20,
    workDetail: "Auto Repair Vocational Workshop",
    emergencyContact: {
      name: "Sarah Brooks",
      relationship: "Mother",
      phone: "(555) 901-2345"
    },
    assignedOfficer: "Off. R. Henderson (#512)",
    notes: "Enrolled in automotive vocational certificate program."
  },
  {
    id: "INM-19402",
    bookingNumber: "BK-2024-0511",
    stateIdNumber: "SID-6610928",
    firstName: "Kenneth",
    middleName: "Paul",
    lastName: "Davenport",
    aliases: ["Kenny"],
    dateOfBirth: "1970-06-18",
    gender: "Male",
    photoUrl: "",
    securityLevel: "Minimum",
    custodyStatus: "In Custody",
    cellBlock: "Block A",
    cellNumber: "A-102",
    bunk: "Lower",
    admissionDate: "2024-05-18",
    projectedReleaseDate: "2026-01-10",
    paroleEligibilityDate: "2025-09-01",
    primaryOffense: "Securities Fraud & Embezzlement",
    charges: [
      {
        code: "CORP-25541-SF",
        title: "Securities Fraud & False Financial Filings",
        felonyClass: "Class C",
        sentenceYears: 2,
        convictionDate: "2024-06-01",
        courtJurisdiction: "Federal District Court"
      }
    ],
    bailAmount: 500000,
    bailEligible: true,
    biometrics: {
      height: "5' 8\"",
      weight: "180 lbs",
      eyeColor: "Blue",
      hairColor: "Silver",
      scarsAndTattoos: "None reported",
      bloodType: "O+",
      fingerprintsOnFile: true,
      dnaSampleCollected: true
    },
    medicalAlerts: ["Atrial Fibrillation (Blood thinner Rx: Apixaban 5mg BID)"],
    suicideWatch: false,
    gangAffiliation: "None Reported",
    trustAccountBalance: 4890.00,
    workDetail: "Facility Records Archive Assistant",
    emergencyContact: {
      name: "Eleanor Davenport",
      relationship: "Wife",
      phone: "(555) 345-9876"
    },
    assignedOfficer: "Off. T. Baker (#602)",
    notes: "Elderly housing accommodation request on file; designated lower bunk."
  }
];

export const INITIAL_HOUSING_BLOCKS: HousingBlock[] = [
  {
    id: "block-a",
    code: "Block A",
    name: "Block A - Minimum Security Wing",
    securityTier: "Minimum",
    totalCells: 16,
    capacity: 32,
    cells: [
      { cellNumber: "A-101", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-102", capacity: 2, occupiedBy: ["INM-19402"], tier: 1, status: "Operational" },
      { cellNumber: "A-103", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-104", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-105", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-106", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-107", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "A-108", capacity: 2, occupiedBy: ["INM-55319"], tier: 1, status: "Operational" },
      { cellNumber: "A-201", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" },
      { cellNumber: "A-202", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" },
      { cellNumber: "A-203", capacity: 2, occupiedBy: [], tier: 2, status: "Maintenance" },
      { cellNumber: "A-204", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" }
    ]
  },
  {
    id: "block-b",
    code: "Block B",
    name: "Block B - Medium Security Tier",
    securityTier: "Medium",
    totalCells: 16,
    capacity: 32,
    cells: [
      { cellNumber: "B-101", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "B-102", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "B-104", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "B-106", capacity: 2, occupiedBy: ["INM-39821"], tier: 1, status: "Operational" },
      { cellNumber: "B-201", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" },
      { cellNumber: "B-202", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" },
      { cellNumber: "B-204", capacity: 2, occupiedBy: ["INM-72104"], tier: 2, status: "Operational" },
      { cellNumber: "B-206", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" }
    ]
  },
  {
    id: "block-c",
    code: "Block C",
    name: "Block C - High / Maximum Custody",
    securityTier: "Maximum",
    totalCells: 12,
    capacity: 24,
    cells: [
      { cellNumber: "C-101", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "C-102", capacity: 2, occupiedBy: ["INM-84920"], tier: 1, status: "Operational" },
      { cellNumber: "C-103", capacity: 2, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "C-201", capacity: 2, occupiedBy: ["INM-41982"], tier: 2, status: "Operational" },
      { cellNumber: "C-202", capacity: 2, occupiedBy: [], tier: 2, status: "Operational" },
      { cellNumber: "C-203", capacity: 2, occupiedBy: [], tier: 2, status: "Sanitary Quarantine" }
    ]
  },
  {
    id: "block-d",
    code: "Block D",
    name: "Block D - Restrictive Housing & Segregation",
    securityTier: "Segregation",
    totalCells: 8,
    capacity: 8,
    cells: [
      { cellNumber: "D-001", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "D-002", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "D-003", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "D-004", capacity: 1, occupiedBy: ["INM-61209"], tier: 1, status: "Operational" },
      { cellNumber: "D-005", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" }
    ]
  },
  {
    id: "ward-m",
    code: "Ward M",
    name: "Ward M - Medical & Infirmary Wing",
    securityTier: "Medical",
    totalCells: 6,
    capacity: 6,
    cells: [
      { cellNumber: "M-101", capacity: 1, occupiedBy: ["INM-93041"], tier: 1, status: "Operational" },
      { cellNumber: "M-102", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" },
      { cellNumber: "M-103", capacity: 1, occupiedBy: [], tier: 1, status: "Operational" }
    ]
  }
];

export const INITIAL_HEADCOUNT: HeadcountRoll = {
  id: "COUNT-2026-1026-01",
  shift: "Morning Muster (06:00)",
  countDate: "2026-10-26",
  scheduledTime: "06:00",
  status: "Reconciled",
  censusTarget: 8,
  verifiedTotal: 8,
  unaccountedCount: 0,
  conductedByOfficer: "Sgt. D. Kowalski (#408)",
  certifyingSupervisor: "Captain J. Miller (#101)",
  completedAt: "2026-10-26 06:22",
  inmateVerifications: [
    { inmateId: "INM-84920", inmateName: "Marcus Vance", cellBlock: "Block C", cellNumber: "C-102", status: "In Custody", verified: true, verifiedAt: "06:08", verifiedBy: "Sgt. Kowalski", flaggedUnaccounted: false },
    { inmateId: "INM-72104", inmateName: "Thomas Callahan", cellBlock: "Block B", cellNumber: "B-204", status: "In Custody", verified: true, verifiedAt: "06:11", verifiedBy: "Off. Henderson", flaggedUnaccounted: false },
    { inmateId: "INM-93041", inmateName: "Jessica Alvarez", cellBlock: "Ward M", cellNumber: "M-101", status: "Medical Ward", verified: true, verifiedAt: "06:14", verifiedBy: "Nurse Garcia / Off. Rodriguez", flaggedUnaccounted: false },
    { inmateId: "INM-61209", inmateName: "Derrick Holt", cellBlock: "Block D", cellNumber: "D-004", status: "Solitary Confinement", verified: true, verifiedAt: "06:05", verifiedBy: "Lt. Briggs", flaggedUnaccounted: false },
    { inmateId: "INM-55319", inmateName: "Samuel Glover", cellBlock: "Block A", cellNumber: "A-108", status: "Work Detail", verified: true, verifiedAt: "06:16", verifiedBy: "Off. Baker (Kitchen post)", flaggedUnaccounted: false },
    { inmateId: "INM-41982", inmateName: "Victor Salazar", cellBlock: "Block C", cellNumber: "C-201", status: "Court Transit", verified: true, verifiedAt: "06:19", verifiedBy: "Transport Deputy Morris", flaggedUnaccounted: false, notes: "Accounted for on Court Docket Transport Slip #992" },
    { inmateId: "INM-39821", inmateName: "Ethan Brooks", cellBlock: "Block B", cellNumber: "B-106", status: "In Custody", verified: true, verifiedAt: "06:12", verifiedBy: "Off. Henderson", flaggedUnaccounted: false },
    { inmateId: "INM-19402", inmateName: "Kenneth Davenport", cellBlock: "Block A", cellNumber: "A-102", status: "In Custody", verified: true, verifiedAt: "06:17", verifiedBy: "Off. Baker", flaggedUnaccounted: false }
  ]
};

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: "INC-2026-0881",
    incidentNumber: "IR-2026-0881",
    timestamp: "2026-10-25 15:45",
    location: "Block C Rec Yard - North Basketball Court",
    cellBlock: "Block C",
    category: "Contraband Seizure",
    severity: "Medium",
    involvedInmates: [
      { inmateId: "INM-84920", inmateName: "Marcus Vance", role: "Participant" }
    ],
    reportingOfficer: "Off. J. Martinez",
    badgeNumber: "518",
    summary: "During routine random canine perimeter sweep of Yard Zone 2, K9 alerted to hollow cinder block bench. Recovered one improvised ceramic cutting tool wrapped in electrical tape.",
    evidenceItems: [
      "Item 1: 4.5-inch sharpened ceramic edge shank",
      "Item 2: Black electrical tape wrap with partial fingerprint smudges"
    ],
    disciplinaryStatus: "Under Investigation",
    sanctionsApplied: "Temporary yard privileges suspended pending forensic fingerprint lab matching."
  },
  {
    id: "INC-2026-0842",
    incidentNumber: "IR-2026-0842",
    timestamp: "2026-10-22 19:10",
    location: "Block B Dayroom / Dining Sallyport",
    cellBlock: "Block B",
    category: "Physical Altercation",
    severity: "Medium",
    involvedInmates: [
      { inmateId: "INM-72104", inmateName: "Thomas Callahan", role: "Victim" }
    ],
    reportingOfficer: "Off. R. Henderson",
    badgeNumber: "512",
    summary: "Verbal dispute escalated during evening commissary distribution. Non-injury shoving match de-escalated promptly with officer verbal commands.",
    evidenceItems: [
      "CCTV footage Camera B-09 recorded to Evidence Server"
    ],
    disciplinaryStatus: "Sanctions Imposed",
    sanctionsApplied: "Commissary restriction 14 days, verbal reprimand logged to institutional file."
  },
  {
    id: "INC-2026-0790",
    incidentNumber: "IR-2026-0790",
    timestamp: "2026-10-14 11:20",
    location: "Block D Segregation Tier Lower Walkway",
    cellBlock: "Block D",
    category: "Staff Insubordination",
    severity: "Critical",
    involvedInmates: [
      { inmateId: "INM-61209", inmateName: "Derrick Holt", role: "Aggressor" }
    ],
    reportingOfficer: "Lt. M. Briggs",
    badgeNumber: "109",
    summary: "Inmate Holt refused to cuff up for mandatory cell inspection; attempted to jam feeding hatch mechanism and issued direct verbal threats toward tier correctional staff.",
    evidenceItems: [
      "Damaged food tray hatch bolt lock #D-004"
    ],
    disciplinaryStatus: "Sanctions Imposed",
    sanctionsApplied: "30 days loss of privileges; full-restraint escort protocol instituted for all movements."
  }
];

export const INITIAL_VISITORS: VisitorRecord[] = [
  {
    id: "VIS-2026-101",
    visitorName: "Eleanor Davenport",
    idDocumentType: "Driver License",
    idNumber: "DL-W48920194",
    phone: "(555) 345-9876",
    inmateId: "INM-19402",
    inmateName: "Kenneth Davenport",
    relationship: "Immediate Family",
    scheduledDate: "2026-10-26",
    timeSlot: "10:00 - 11:00",
    boothNumber: "Booth 04",
    backgroundCheck: "Approved",
    contrabandScreeningPassed: true,
    status: "Checked In",
    checkInTime: "09:50",
    officerNotes: "Driver license verified. Personal belongings placed in Lockbox #14."
  },
  {
    id: "VIS-2026-102",
    visitorName: "Arthur Sterling, Esq.",
    idDocumentType: "Bar Association Card",
    idNumber: "BAR-994102",
    phone: "(555) 441-2299",
    inmateId: "INM-84920",
    inmateName: "Marcus Vance",
    relationship: "Attorney / Legal Counsel",
    scheduledDate: "2026-10-26",
    timeSlot: "13:30 - 14:30",
    boothNumber: "Legal Conference Room A",
    backgroundCheck: "Approved",
    contrabandScreeningPassed: false,
    status: "Scheduled",
    officerNotes: "Confidential attorney-client privileged consultation."
  },
  {
    id: "VIS-2026-103",
    visitorName: "Carlos Alvarez",
    idDocumentType: "State ID",
    idNumber: "ST-8812490",
    phone: "(555) 789-1234",
    inmateId: "INM-93041",
    inmateName: "Jessica Alvarez",
    relationship: "Immediate Family",
    scheduledDate: "2026-10-26",
    timeSlot: "15:00 - 16:00",
    boothNumber: "Infirmary Non-Contact Booth 01",
    backgroundCheck: "Approved",
    contrabandScreeningPassed: false,
    status: "Scheduled",
    officerNotes: "Infirmary approved visit; non-contact partition required."
  }
];

export const INITIAL_MEDICATIONS: MedicationAdminRecord[] = [
  {
    id: "MED-01",
    inmateId: "INM-72104",
    inmateName: "Thomas Callahan",
    cellLocation: "B-204",
    medicationName: "Metformin HCl",
    dosage: "500 mg Tablet",
    frequency: "Twice daily with meals (08:00 & 17:00)",
    prescribingDoctor: "Dr. Rachel Kim, MD",
    scheduledTime: "08:00",
    administered: true,
    administeredAt: "2026-10-26 08:12",
    administeredBy: "Nurse E. Garcia, RN",
    vitalSignsCheck: "Blood Glucose: 124 mg/dL",
    specialInstructions: "Confirm swallow before inmate departs pill line."
  },
  {
    id: "MED-02",
    inmateId: "INM-61209",
    inmateName: "Derrick Holt",
    cellLocation: "D-004",
    medicationName: "Lisinopril",
    dosage: "20 mg Tablet",
    frequency: "Once daily morning (08:00)",
    prescribingDoctor: "Dr. Rachel Kim, MD",
    scheduledTime: "08:00",
    administered: true,
    administeredAt: "2026-10-26 08:25",
    administeredBy: "Nurse E. Garcia, RN (Tier escort: Lt. Briggs)",
    vitalSignsCheck: "BP: 138/88 mmHg",
    specialInstructions: "Cellside delivery with security slot hatch only."
  },
  {
    id: "MED-03",
    inmateId: "INM-19402",
    inmateName: "Kenneth Davenport",
    cellLocation: "A-102",
    medicationName: "Apixaban (Eliquis)",
    dosage: "5 mg Oral Tablet",
    frequency: "Twice daily (08:00 & 20:00)",
    prescribingDoctor: "Dr. Steven Patel, MD (Cardiology)",
    scheduledTime: "20:00",
    administered: false,
    specialInstructions: "Critical anticoagulant. Monitor for unprovoked bruising or bleeding."
  },
  {
    id: "MED-04",
    inmateId: "INM-84920",
    inmateName: "Marcus Vance",
    cellLocation: "C-102",
    medicationName: "Albuterol Sulfate Inhaler",
    dosage: "90 mcg/actuation",
    frequency: "PRN (As needed for acute bronchospasm)",
    prescribingDoctor: "Dr. Rachel Kim, MD",
    scheduledTime: "PRN Active",
    administered: false,
    specialInstructions: "Inmate maintains custody of inhaler under institutional medical waiver."
  }
];

export const INITIAL_STAFF: StaffOfficer[] = [
  {
    id: "STF-101",
    name: "Captain James Miller",
    badge: "101",
    rank: "Captain",
    assignedPost: "Central Security Control & Watch Commander",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-1 (Command)",
    status: "On Duty",
    phoneExtension: "x1001"
  },
  {
    id: "STF-408",
    name: "Sgt. David Kowalski",
    badge: "408",
    rank: "Sergeant",
    assignedPost: "Block C High Security Sector Supervisor",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-3 (Block C/D)",
    status: "On Duty",
    phoneExtension: "x1048"
  },
  {
    id: "STF-109",
    name: "Lt. Marcus Briggs",
    badge: "109",
    rank: "Lieutenant",
    assignedPost: "Block D Restrictive Housing OIC",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-3 (Block C/D)",
    status: "On Duty",
    phoneExtension: "x1029"
  },
  {
    id: "STF-512",
    name: "Off. Robert Henderson",
    badge: "512",
    rank: "Senior Officer",
    assignedPost: "Block B Dayroom & Tiers",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-2 (Block A/B)",
    status: "On Duty",
    phoneExtension: "x1052"
  },
  {
    id: "STF-602",
    name: "Off. Travis Baker",
    badge: "602",
    rank: "Officer",
    assignedPost: "Block A Minimum Custody & Kitchen Escort",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-2 (Block A/B)",
    status: "On Duty",
    phoneExtension: "x1062"
  },
  {
    id: "STF-334",
    name: "Off. Sandra Rodriguez",
    badge: "334",
    rank: "Officer",
    assignedPost: "Infirmary Ward M & Medical Clinic Sallyport",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-4 (Medical/Visits)",
    status: "On Duty",
    phoneExtension: "x1034"
  },
  {
    id: "STF-219",
    name: "Off. Kevin Vance",
    badge: "219",
    rank: "Officer",
    assignedPost: "Tower 1 Perimeter Watch",
    shift: "Day Shift (06:00 - 14:00)",
    radioChannel: "TAC-5 (Perimeter)",
    status: "On Duty",
    phoneExtension: "x1019"
  }
];
