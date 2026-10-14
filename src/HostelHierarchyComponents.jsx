import React, { useState } from 'react';
import { 
  Building, User, UserCheck, ShieldCheck, ArrowRight, CheckCircle2, 
  Clock, AlertTriangle, MessageSquare, ChevronRight, CornerDownRight, 
  Send, HelpCircle, FileText, Check, X, Sparkles, AlertCircle, RefreshCw,
  Phone, Mail, MapPin, IdCard, Star, ShieldAlert, Award, Zap, Droplet,
  Wrench, Layers
} from 'lucide-react';

// Official hierarchy tiers for Non-ICC Complaints
export const HOSTEL_HIERARCHY_LEVELS = [
  {
    key: 'WARDEN',
    title: 'Hostel Resident Warden',
    short: 'Warden',
    badge: 'Stage 1 • Local Intake',
    color: 'emerald',
    roleLabel: 'Hostel Warden Office',
    desc: 'Local hostel issues, room amenities, room fixtures, maintenance checks'
  },
  {
    key: 'DSW_DEPT',
    title: 'Dean Student Welfare (DSW) & Concerned Dept',
    short: 'DSW & Dept',
    badge: 'Stage 2 • Campus Welfare & Technical Dept',
    color: 'blue',
    roleLabel: 'DSW & Respective Departments',
    desc: 'Dean of Student Welfare along with concerned technical/maintenance department engineers'
  },
  {
    key: 'AO',
    title: 'Administrative Officer (AO)',
    short: 'AO',
    badge: 'Stage 3 • Administration & Sanctions',
    color: 'amber',
    roleLabel: 'Office of Administrative Officer',
    desc: 'High-level administrative intervention, resource approvals, and official contractor supervision'
  },
  {
    key: 'DIRECTOR',
    title: 'The Director (RGUKT AP)',
    short: 'Director',
    badge: 'Stage 4 • Apex Authority',
    color: 'purple',
    roleLabel: 'Office of The Director (Apex)',
    desc: 'Apex institutional authority for comprehensive intervention and executive orders'
  }
];

export const HOSTEL_CONCERNED_DEPARTMENTS = [
  { id: 'Plumbing & Water Supply', label: '🚰 Plumbing & Water Works Dept', code: 'PLUMB' },
  { id: 'Electrical Works', label: '⚡ Electrical & Power Works Dept', code: 'ELEC' },
  { id: 'Civil & Carpentry', label: '🚪 Civil Works, Doors & Furniture Dept', code: 'CIVIL' },
  { id: 'Housekeeping & Sanitation', label: '🧹 Housekeeping, Cleanliness & Sanitation Dept', code: 'CLEAN' },
  { id: 'Safety & Pest Control', label: '🛡️ Safety & Health Hygiene Dept', code: 'SAFE' },
  { id: 'IT & Wi-Fi Network', label: '🌐 IT Systems & Campus Network Dept', code: 'IT' }
];

// Prescribed questionnaire reasons when tagging/escalating
export const ESCALATION_QUESTIONS_BY_TARGET = {
  DSW_DEPT: {
    targetName: 'Dean Student Welfare (DSW) & Respective Department',
    prompt: 'Why are you tagging/escalating this complaint to the DSW & Concerned Department?',
    options: [
      'Warden response was insufficient / problem not resolved at hostel level',
      'Requires major technical spare parts / central department technician deployment',
      'Severity of facility failure affects entire hostel floor/wing beyond Warden scope',
      'Warden SLA response time elapsed without tangible on-site progress',
      'No response received from Warden within mandated response period',
      'Other'
    ]
  },
  AO: {
    targetName: 'Administrative Officer (AO)',
    prompt: 'Why are you escalating this complaint from DSW/Department to the Administrative Officer (AO)?',
    options: [
      'DSW / Department response did not resolve the underlying breakdown',
      'Requires administrative sanctions / emergency civil contractor intervention',
      'Repeated equipment failure despite department repair visits',
      'Administrative intervention needed for budget / procurement approvals',
      'DSW / Department response deadline elapsed with no response/compliance',
      'Other'
    ]
  },
  DIRECTOR: {
    targetName: 'The Director, RGUKT RK Valley',
    prompt: 'Why are you escalating this grievance to the Apex Authority (The Director)?',
    options: [
      'Grievance unresolved across Warden, DSW, Department, and AO stages',
      'Severe health, safety, or fundamental living hazard requiring Executive Order',
      'Administrative delay causing severe disruption to student academic welfare',
      'AO response deadline elapsed with no administrative sanction or order',
      'Institutional policy or systemic infrastructure failure requiring Director intervention',
      'Other'
    ]
  }
};

/**
 * Separate Profiles for Warden, DSW, All Departments (Separate), AO, Director, and Student
 */
export const CAMPUS_AUTHORITY_PROFILES = {
  REPORTER: {
    id: 'student-r200101',
    key: 'REPORTER',
    role: 'REPORTER',
    name: 'K. Sai Tharun',
    designation: 'Student Resident',
    idNumber: 'R200101',
    department: 'Computer Science & Engineering',
    category: 'Student',
    email: 'student@rgukt.ac.in',
    phone: '+91 98765 43210',
    location: 'PENNA Hostel, 2nd Floor, Room 214',
    badge: 'Resident Student',
    avatarBg: 'from-blue-600 to-indigo-700',
    hierarchyStage: 'REPORTER',
    tagline: 'Student Complainant & Grievance Tracking',
    duties: 'Initiates non-ICC and ICC complaints, tracks stage-by-stage SLA countdowns, reviews authority responses, and tags/escalates unresolved issues.'
  },
  WARDEN: {
    id: 'warden-01',
    key: 'WARDEN',
    role: 'WARDEN',
    name: 'Prof. K. Ramesh',
    designation: 'Hostel Resident Warden',
    idNumber: 'WARDEN-HOSTEL-01',
    department: 'Hostel Administration & Residence Care',
    category: 'Hostel Facilities',
    email: 'warden@rgukt.ac.in',
    phone: '+91 85882 83610',
    location: 'Hostel Warden Office, RHO Ground Floor',
    badge: 'Stage 1 Authority • Warden',
    avatarBg: 'from-emerald-700 to-teal-800',
    hierarchyStage: 'WARDEN',
    tagline: 'Stage 1 Local Hostel Intake & Inspection',
    duties: 'First-level inspection of hostel amenities, room fixtures, quiet hours, local maintenance, and rapid verification within the mandated SLA.'
  },
  DSW: {
    id: 'dsw-01',
    key: 'DSW',
    role: 'DSW',
    name: 'Dr. P. Sudhakar',
    designation: 'Dean of Student Welfare (DSW)',
    idNumber: 'DSW-OFFICE-01',
    department: 'Deanery of Student Welfare & Student Affairs',
    category: 'Student Welfare',
    email: 'dsw@rgukt.ac.in',
    phone: '+91 85882 83620',
    location: 'DSW Office, Administrative Block 1st Floor',
    badge: 'Stage 2 Authority • Dean Student Welfare',
    avatarBg: 'from-blue-700 to-cyan-800',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Stage 2 Campus Welfare Oversight & Joint Escalation',
    duties: 'Campus-wide student welfare oversight, coordinating with technical departments, verifying living standards, and enforcing departmental SLA compliance.'
  },
  DEPT_ELECTRICAL: {
    id: 'dept-elec-42',
    key: 'DEPT_ELECTRICAL',
    role: 'STAFF',
    departmentKey: 'Electrical Works',
    name: 'Rajesh Kumar',
    designation: 'Assistant Executive Engineer (Electrical)',
    idNumber: 'TECH-ELEC-042',
    department: 'Electrical & Power Works Department',
    category: 'Electrical',
    email: 'electrical@rgukt.ac.in',
    phone: '+91 98480 22338',
    location: 'Electrical Substation & Maintenance Yard',
    badge: 'Stage 2 Technical Dept • Electrical',
    avatarBg: 'from-amber-600 to-orange-700',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Technical Specialist: Power, Generators & Lighting',
    duties: 'Power grid stability, hostel wiring, switchboard repairs, solar panel maintenance, corridor lighting, and substation fault clearance.'
  },
  DEPT_PLUMBING: {
    id: 'dept-plumb-18',
    key: 'DEPT_PLUMBING',
    role: 'STAFF',
    departmentKey: 'Plumbing & Water Supply',
    name: 'S. Venkatesh',
    designation: 'Senior Water Works Superintendent',
    idNumber: 'TECH-PLUMB-018',
    department: 'Plumbing & Water Works Department',
    category: 'Plumbing',
    email: 'plumbing@rgukt.ac.in',
    phone: '+91 98480 22339',
    location: 'Central Water Works & Pump House',
    badge: 'Stage 2 Technical Dept • Plumbing',
    avatarBg: 'from-cyan-600 to-blue-700',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Technical Specialist: Drinking Water, Pumps & Drainage',
    duties: 'RO water plant maintenance, overhead tank supply, washroom fixture replacements, pipeline leakage resolution, and drainage flow inspection.'
  },
  DEPT_CIVIL: {
    id: 'dept-civil-25',
    key: 'DEPT_CIVIL',
    role: 'STAFF',
    departmentKey: 'Civil & Carpentry',
    name: 'M. Ramana',
    designation: 'Civil Inspector & Carpentry Overseer',
    idNumber: 'TECH-CIVIL-025',
    department: 'Civil Works & Infrastructure Department',
    category: 'Civil',
    email: 'civil@rgukt.ac.in',
    phone: '+91 98480 22340',
    location: 'Civil Works Section, Estate Office',
    badge: 'Stage 2 Technical Dept • Civil',
    avatarBg: 'from-stone-600 to-amber-800',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Technical Specialist: Doors, Windows & Structural Repairs',
    duties: 'Door locks, window mesh, plastering, hostel cot & study table repairs, masonry fixes, and infrastructure durability assessments.'
  },
  DEPT_IT: {
    id: 'dept-it-07',
    key: 'DEPT_IT',
    role: 'STAFF',
    departmentKey: 'IT & Wi-Fi Network',
    name: 'K. Srinivas',
    designation: 'Campus Network & IT Systems Incharge',
    idNumber: 'TECH-IT-007',
    department: 'IT Systems & Campus Network Department',
    category: 'IT Systems',
    email: 'itsupport@rgukt.ac.in',
    phone: '+91 98480 22341',
    location: 'Central Computer Center Server Room',
    badge: 'Stage 2 Technical Dept • IT Systems',
    avatarBg: 'from-indigo-600 to-violet-800',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Technical Specialist: Wi-Fi Access Points & LAN',
    duties: 'Hostel Wi-Fi coverage, fiber optic connectivity, student portal access, firewall configuration, and lab switchboard networking.'
  },
  DEPT_HOUSEKEEPING: {
    id: 'dept-clean-14',
    key: 'DEPT_HOUSEKEEPING',
    role: 'STAFF',
    departmentKey: 'Housekeeping & Sanitation',
    name: 'G. Lakshmi',
    designation: 'Chief Sanitation & Cleanliness Supervisor',
    idNumber: 'TECH-CLEAN-014',
    department: 'Housekeeping & Sanitation Department',
    category: 'Housekeeping',
    email: 'clean@rgukt.ac.in',
    phone: '+91 98480 22342',
    location: 'Sanitation Desk, SAC Complex',
    badge: 'Stage 2 Technical Dept • Housekeeping',
    avatarBg: 'from-teal-600 to-emerald-800',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Sanitation Specialist: Waste Segregation & Deep Cleaning',
    duties: 'Daily corridor & washroom sanitization, garbage collection schedules, bio-waste disposal, dustbins, and campus cleanliness audits.'
  },
  DEPT_SAFETY: {
    id: 'dept-safe-03',
    key: 'DEPT_SAFETY',
    role: 'STAFF',
    departmentKey: 'Safety & Pest Control',
    name: 'T. Prasad',
    designation: 'Campus Safety & Health Hygiene Officer',
    idNumber: 'TECH-SAFE-003',
    department: 'Safety & Health Hygiene Department',
    category: 'Safety',
    email: 'safety@rgukt.ac.in',
    phone: '+91 98480 22343',
    location: 'Safety Control Room, Main Gate',
    badge: 'Stage 2 Technical Dept • Safety',
    avatarBg: 'from-rose-600 to-red-800',
    hierarchyStage: 'DSW_DEPT',
    tagline: 'Safety Specialist: Pest Control, Fire Extinguishers & First Aid',
    duties: 'Insect/pest control fogging, fire equipment inspection, snake safety barriers, campus perimeter lighting, and emergency drill readiness.'
  },
  AO: {
    id: 'ao-01',
    key: 'AO',
    role: 'ADMIN',
    name: 'Sri. B. Venkat Rao',
    designation: 'Administrative Officer (AO)',
    idNumber: 'AO-ADMIN-01',
    department: 'Central Campus Administration',
    category: 'Administration',
    email: 'ao@rgukt.ac.in',
    phone: '+91 85882 83630',
    location: 'AO Secretariat, AB-1 2nd Floor',
    badge: 'Stage 3 Authority • AO',
    avatarBg: 'from-amber-700 to-orange-800',
    hierarchyStage: 'AO',
    tagline: 'Stage 3 Administrative Sanctions & Contractor Requisitions',
    duties: 'Financial sanctions, external maintenance contractor mobilization, central resource allocations, and institutional oversight.'
  },
  DIRECTOR: {
    id: 'dir-01',
    key: 'DIRECTOR',
    role: 'ADMIN',
    name: 'Prof. K. Hemachandra Reddy',
    designation: 'The Director, RGUKT RK Valley',
    idNumber: 'DIR-APEX-01',
    department: 'Office of The Director (Apex Institutional Head)',
    category: 'Directorate',
    email: 'director@rgukt.ac.in',
    phone: '+91 85882 83600',
    location: 'Directorate Executive Chamber, Administrative Building',
    badge: 'Stage 4 Apex Authority • Director',
    avatarBg: 'from-purple-900 to-slate-900',
    hierarchyStage: 'DIRECTOR',
    tagline: 'Stage 4 Apex Authority: Final Executive Orders & Policy',
    duties: 'Apex institutional authority issuing final executive directives, inquiry commissions, policy enforcement, and binding resolution orders.'
  },
  ICC_PRESIDING: {
    id: 'icc-po-01',
    key: 'ICC_PRESIDING',
    role: 'ADMIN',
    name: 'Dr. Ratnakumari Challa',
    designation: 'Presiding Officer, ICC',
    idNumber: 'ICC-PO-01',
    department: 'Internal Complaints Committee (ICC Secretariat)',
    category: 'ICC Committee',
    email: 'ratnakumari.icc@rgukt.ac.in',
    phone: '+91 85882 83640',
    location: 'ICC Chamber & Presiding Secretariat, Administrative Block',
    badge: 'ICC Statutory Head • Presiding Officer',
    avatarBg: 'from-purple-700 to-indigo-900',
    hierarchyStage: 'DIRECTOR',
    tagline: 'Statutory ICC Head: Inquiries, Hearings & Quorum Presiding',
    duties: 'Permanent statutory head presiding over all Small (Level 1), Medium (Level 2), and Full (Level 3) ICC inquiries, confidential hearings, and submits final recommendations to the Director.'
  },
  ICC_WOMAN_FACULTY_1: {
    id: 'icc-wf-01',
    key: 'ICC_WOMAN_FACULTY_1',
    role: 'ADMIN',
    name: 'Dr. Suvarna',
    designation: 'Woman Faculty Member, ICC',
    idNumber: 'ICC-WOMAN-01',
    department: 'Internal Complaints Committee & Academic Faculty',
    category: 'ICC Committee',
    email: 'suvarna.icc@rgukt.ac.in',
    phone: '+91 85882 83641',
    location: 'Faculty Chambers, Academic Block',
    badge: 'ICC Statutory Member • Woman Faculty',
    avatarBg: 'from-fuchsia-700 to-purple-900',
    hierarchyStage: 'DIRECTOR',
    tagline: 'ICC Woman Faculty Representative & Inquiries Assessor',
    duties: 'Statutory woman faculty appointee assessing POSH complaints, safeguarding student/staff welfare, evidence verification, and committee deliberations.'
  },
  ICC_WOMAN_FACULTY_2: {
    id: 'icc-wf-02',
    key: 'ICC_WOMAN_FACULTY_2',
    role: 'ADMIN',
    name: 'Dr. Vimala Persis',
    designation: 'Woman Faculty Member, ICC',
    idNumber: 'ICC-WOMAN-02',
    department: 'Internal Complaints Committee & Academic Faculty',
    category: 'ICC Committee',
    email: 'vimala.icc@rgukt.ac.in',
    phone: '+91 85882 83642',
    location: 'Faculty Chambers, Academic Block',
    badge: 'ICC Statutory Member • Woman Faculty',
    avatarBg: 'from-purple-700 to-pink-900',
    hierarchyStage: 'DIRECTOR',
    tagline: 'ICC Woman Faculty Representative & Grievance Examination',
    duties: 'Statutory woman faculty appointee for Level 3 Full ICC proceedings, conducting comprehensive inquiries, witness examination, and report drafting.'
  },
  ICC_LEGAL: {
    id: 'icc-legal-01',
    key: 'ICC_LEGAL',
    role: 'ADMIN',
    name: 'Ms. Chennamasetti Neelima',
    designation: 'Advocate, Kadapa District Bar (External Legal Member)',
    idNumber: 'ICC-LEGAL-01',
    department: 'External Statutory Legal Cell, ICC',
    category: 'ICC Committee',
    email: 'neelima.advocate@rgukt.ac.in',
    phone: '+91 94402 81122',
    location: 'District Court Chambers, Kadapa & Campus Legal Annex',
    badge: 'External Judicial Expert • Advocate',
    avatarBg: 'from-amber-700 to-amber-950',
    hierarchyStage: 'DIRECTOR',
    tagline: 'Statutory External Judicial Oversight & Legal Compliance',
    duties: 'External statutory legal counsel ensuring strict adherence to the POSH Act 2013, natural justice, legal validity of proceedings, and non-biased inquiry conduct.'
  },
  ICC_POLICE: {
    id: 'icc-police-01',
    key: 'ICC_POLICE',
    role: 'ADMIN',
    name: 'Sub-Inspector, RK Valley Police Station',
    designation: 'Sub-Inspector of Police (Law Enforcement Representative)',
    idNumber: 'ICC-POLICE-01',
    department: 'Station House Office, RK Valley Police Station',
    category: 'ICC Committee',
    email: 'si.rkvpolice@rgukt.ac.in',
    phone: '+91 85882 83699',
    location: 'RK Valley Police Station, Vempalli Mandal',
    badge: 'Law Enforcement Member • Police SI',
    avatarBg: 'from-blue-900 to-slate-950',
    hierarchyStage: 'DIRECTOR',
    tagline: 'Statutory Police Representation & Campus Security Coordination',
    duties: 'Statutory police liaison for cognizable offences, safety protocol enforcement, anti-ragging security measures, and inter-agency coordination.'
  }
};

/**
 * SLA and Mandatory Note Configuration for Non-ICC Complaints
 * - Normal Problem:
 *     Warden: 1 week (7 days)
 *     DSW & Particular Dept: 3 days
 *     AO: 1 day (24 hours)
 *     Director: 1 day (24 hours)
 *     Mandatory Note: Response is mandatory. If the response is not given, it will be considered as no response.
 * - Medium Problem:
 *     Half of the normal problem time (Warden: 3.5 days, DSW/Dept: 1.5 days, AO: 12 hours, Director: 12 hours)
 * - Emergency Problem:
 *     Immediate action is needed to be taken (2 to 4 hours real-time response across Warden, Dept, DSW with flash alert to AO and Director).
 */
export function getHierarchySlaConfig(urgency = 'NORMAL') {
  const normUrgency = String(urgency || 'NORMAL').toUpperCase();

  // 1. Emergency Level Problem
  if (normUrgency === 'EMERGENCY' || normUrgency === 'HIGH') {
    return {
      urgencyKey: 'EMERGENCY',
      urgencyLabel: 'Emergency Problem',
      slaBadgeText: '🚨 Emergency Protocol: Immediate Action Required',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      isEmergency: true,
      protocolDescription: 'Immediate action is required. Real-time emergency protocol active across Warden & Maintenance Crew with instant flash dispatch to DSW, AO, and Director.',
      stages: {
        WARDEN: {
          allottedTime: 'Immediate Action (2 Hours)',
          hours: 2,
          mandatoryNote: 'Note: Response & immediate on-site action is MANDATORY within 2 hours. If response is not recorded, it will be considered as NO RESPONSE and auto-escalated immediately to DSW & Department.'
        },
        DSW_DEPT: {
          allottedTime: 'Immediate Action (4 Hours)',
          hours: 4,
          mandatoryNote: 'Note: Departmental action & emergency response is MANDATORY within 4 hours. Non-response will be treated as non-compliance and escalated directly to the Administrative Officer (AO).'
        },
        AO: {
          allottedTime: 'Immediate Sanction (2 Hours)',
          hours: 2,
          mandatoryNote: 'Note: Administrative sanction & contractor mobilization is MANDATORY within 2 hours. Non-action will be considered an administrative failure and escalated to the Director.'
        },
        DIRECTOR: {
          allottedTime: 'Immediate Executive Order (2 Hours)',
          hours: 2,
          mandatoryNote: 'Note: Apex Campus Authority — Immediate executive directive & disposal order required within 2 hours. Decision is binding on all campus wings.'
        }
      }
    };
  }

  // 2. Medium Level Problem (Half of normal problem time)
  if (normUrgency === 'MEDIUM') {
    return {
      urgencyKey: 'MEDIUM',
      urgencyLabel: 'Medium Level Problem',
      slaBadgeText: '⚡ Medium Level: 50% Time Period (Half of Normal)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      isEmergency: false,
      protocolDescription: 'Medium severity grievance: All stage resolution timelines are strictly halved compared to normal problems (Warden: 3.5 days, DSW & Dept: 1.5 days, AO: 12h, Director: 12h).',
      stages: {
        WARDEN: {
          allottedTime: '3.5 Days (84 Hours)',
          hours: 84,
          mandatoryNote: 'Note: Response is mandatory within 3.5 days. If the response is not given, it will be considered as no response and escalated to DSW & Concerned Department.'
        },
        DSW_DEPT: {
          allottedTime: '1.5 Days (36 Hours)',
          hours: 36,
          mandatoryNote: 'Note: Action & official response is mandatory within 1.5 days (36 hours). Non-response will be considered as non-compliance and escalated directly to AO.'
        },
        AO: {
          allottedTime: '12 Hours (0.5 Day)',
          hours: 12,
          mandatoryNote: 'Note: Administrative sanction & resolution response mandatory within 12 hours. Non-action will be considered as administrative failure and escalated to Director.'
        },
        DIRECTOR: {
          allottedTime: '12 Hours (0.5 Day)',
          hours: 12,
          mandatoryNote: 'Note: Apex Campus Authority: Final executive directive & disposal order required within 12 hours.'
        }
      }
    };
  }

  // 3. Basic / Normal Problem (Default)
  return {
    urgencyKey: 'NORMAL',
    urgencyLabel: 'Basic Normal Problem',
    slaBadgeText: 'Standard SLA Protocol: Warden 1 Wk ➔ DSW/Dept 3 Days ➔ AO 1 Day ➔ Director 1 Day',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    isEmergency: false,
    protocolDescription: 'Standard non-ICC grievance flow: Warden is allotted 1 week; DSW and particular department 3 days; AO 1 day; and Director 1 day.',
    stages: {
      WARDEN: {
        allottedTime: '1 Week (7 Days / 168 Hours)',
        hours: 168,
        mandatoryNote: 'Note: Response is mandatory. If the response is not given, it will be considered as no response.'
      },
      DSW_DEPT: {
        allottedTime: '3 Days (72 Hours)',
        hours: 72,
        mandatoryNote: 'Note: Departmental action & response is mandatory within 3 days. Non-response will be considered as non-compliance and escalated directly to AO.'
      },
      AO: {
        allottedTime: '1 Day (24 Hours)',
        hours: 24,
        mandatoryNote: 'Note: Administrative sanction & resolution response mandatory within 1 day (24 hours). Non-action will be considered as administrative failure and escalated to Director.'
      },
      DIRECTOR: {
        allottedTime: '1 Day (24 Hours)',
        hours: 24,
        mandatoryNote: 'Note: Apex Campus Authority: Final executive directive & disposal order required within 1 day (24 hours).'
      }
    }
  };
}

/**
 * Visual pill to show current hierarchy stage for any non-ICC complaint
 */
export function HostelHierarchyPill({ ticket, onClick }) {
  if (!ticket) return null;
  // ICC complaints are handled by MediumCommitteeFlowPill
  if (ticket.isIcc || ticket.category === 'Internal Complaints Committee (ICC)' || ticket.categoryType === 'ICC') {
    return null;
  }

  const currentStageKey = ticket.currentHierarchyStage || 'WARDEN';
  const stageObj = HOSTEL_HIERARCHY_LEVELS.find(l => l.key === currentStageKey) || HOSTEL_HIERARCHY_LEVELS[0];
  const slaConfig = getHierarchySlaConfig(ticket.urgency || ticket.priority);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all hover:scale-102 bg-teal-50 text-teal-800 border-teal-300 shadow-2xs"
      title={`Campus Hierarchy Flow: Warden ➔ DSW & Dept ➔ AO ➔ Director | Problem: ${slaConfig.urgencyLabel}`}
    >
      <Building className="w-3 h-3 text-teal-600 shrink-0" />
      <span>Hierarchy: {stageObj.short}</span>
      <span className="bg-teal-200 text-teal-900 px-1 py-0.2 rounded text-[9px] uppercase font-mono font-bold">
        {stageObj.key}
      </span>
      {slaConfig.isEmergency && (
        <span className="bg-rose-500 text-white px-1 py-0.2 rounded text-[8px] uppercase font-bold animate-pulse">
          SOS
        </span>
      )}
    </button>
  );
}

/**
 * Interactive Hierarchy Card displayed in Ticket Tracker for Students & Authorities
 * Fully equips Students to know their complaint status, stage progress, and mandatory response countdown.
 */
export function HostelHierarchyTrackerCard({ ticket, currentUser, onOpenEscalationModal, onAddAuthorityResponse }) {
  const [responseInput, setResponseInput] = useState('');
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;
  // ICC complaints are handled by MediumCommitteeFlowModal / Studio
  if (ticket.isIcc || ticket.category === 'Internal Complaints Committee (ICC)' || ticket.categoryType === 'ICC') {
    return null;
  }

  const currentStageKey = ticket.currentHierarchyStage || 'WARDEN';
  const currentIndex = HOSTEL_HIERARCHY_LEVELS.findIndex(l => l.key === currentStageKey);
  const activeStage = HOSTEL_HIERARCHY_LEVELS[currentIndex] || HOSTEL_HIERARCHY_LEVELS[0];
  const nextStage = currentIndex < HOSTEL_HIERARCHY_LEVELS.length - 1 ? HOSTEL_HIERARCHY_LEVELS[currentIndex + 1] : null;

  const isProblemSolved = ['RESOLVED', 'CLOSED', 'SOLVED', 'COMPLETED'].includes(String(ticket.status || '').toUpperCase());

  // SLA config based on problem severity: Normal (1wk/3d/1d/1d), Medium (half time: 3.5d/1.5d/12h/12h), or Emergency (Immediate)
  const slaConfig = getHierarchySlaConfig(ticket.urgency || ticket.priority);
  const currentStageSla = slaConfig.stages[currentStageKey] || slaConfig.stages.WARDEN;

  const logs = ticket.hierarchyLogs || [];

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!responseInput.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddAuthorityResponse(ticket.id, responseInput.trim(), activeStage.short);
      setResponseInput('');
      setShowResponseBox(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50/70 via-white to-blue-50/50 rounded-2xl border-2 border-teal-300/90 p-4 sm:p-5 shadow-sm mb-4 space-y-4">
      
      {/* Header with Problem Classification & Flow */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-teal-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-teal-950 uppercase tracking-wide">
                Campus Resolution Hierarchy Flow (Non-ICC)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${slaConfig.badgeColor}`}>
                {slaConfig.urgencyLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Sequential Flow: <strong>Warden (1)</strong> ➔ <strong>DSW & Dept (2)</strong> ➔ <strong>AO (3)</strong> ➔ <strong>Director (4)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-700 text-white shadow-2xs">
            Active: Stage {currentIndex + 1} ({activeStage.short})
          </span>
        </div>
      </div>

      {/* Protocol Description Banner */}
      <div className="p-2.5 rounded-xl bg-teal-100/60 border border-teal-200 text-xs text-teal-950 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-700 shrink-0" />
          <span className="text-[11px] font-semibold">{slaConfig.protocolDescription}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded cyber-card text-teal-900 border border-teal-300">
          Target: {currentStageSla.allottedTime}
        </span>
      </div>

      {/* 4-Step Sequential Progress Stepper */}
      <div className="py-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {HOSTEL_HIERARCHY_LEVELS.map((lvl, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const stageSla = slaConfig.stages[lvl.key];

            return (
              <div
                key={lvl.key}
                className={`p-3 rounded-xl border-2 transition-all text-left relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-teal-400 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-xs'
                    : 'bg-white text-slate-950 border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="text-[9px] font-mono font-black uppercase tracking-wider"
                      style={{ color: isCurrent ? '#5eead4' : isCompleted ? '#064e3b' : '#0f172a' }}
                    >
                      Stage {idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : isCurrent ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-300">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-700" />
                    )}
                  </div>
                  <h5 
                    className="text-xs leading-tight"
                    style={{ color: isCurrent ? '#ffffff' : isCompleted ? '#022c22' : '#020617', fontWeight: 900 }}
                  >
                    {lvl.short}
                  </h5>
                  <p 
                    className="text-[10px] mt-1"
                    style={{ color: isCurrent ? '#e2e8f0' : isCompleted ? '#064e3b' : '#0f172a', fontWeight: 700 }}
                  >
                    {lvl.desc}
                  </p>
                </div>

                <div 
                  className="mt-2.5 pt-1.5 border-t text-[10px] font-black flex items-center justify-between"
                  style={{ 
                    borderColor: isCurrent ? '#334155' : isCompleted ? '#6ee7b7' : '#cbd5e1',
                    color: isCurrent ? '#5eead4' : isCompleted ? '#022c22' : '#020617' 
                  }}
                >
                  <span>{stageSla ? stageSla.allottedTime : 'Mandated SLA'}</span>
                  <span>{isCompleted ? '✓ Passed' : isCurrent ? '● Current' : 'Pending'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROMINENT MANDATORY RESPONSE NOTE ALERT */}
      <div 
        className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl shadow-xs space-y-1.5"
        style={{ color: '#451a03' }}
      >
        <div className="flex items-center gap-2 font-black text-xs" style={{ color: '#451a03' }}>
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span style={{ color: '#451a03', fontWeight: 900 }}>MANDATORY RESPONSE NOTICE FOR {activeStage.short.toUpperCase()}:</span>
        </div>
        <p 
          className="text-xs leading-relaxed pl-6 border-l-2 border-amber-600 ml-1"
          style={{ color: '#451a03', fontWeight: 900 }}
        >
          "{currentStageSla.mandatoryNote}"
        </p>
        <div className="flex items-center justify-between text-[10px] pl-6 pt-1 font-bold" style={{ color: '#451a03' }}>
          <span style={{ color: '#451a03' }}>Allotted Period: <strong style={{ color: '#290e00', fontWeight: 900 }}>{currentStageSla.allottedTime}</strong></span>
          <span className="italic font-bold" style={{ color: '#78350f' }}>If no official response is submitted, non-response is recorded & complaint is eligible for escalation.</span>
        </div>
      </div>

      {/* Authority Response & Interaction Section */}
      <div className="cyber-card rounded-xl border border-teal-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Authority Currently in Charge
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span className="text-xs sm:text-sm font-bold text-white">
                {ticket.currentHierarchyAuthority || activeStage.title}
              </span>
              {ticket.concernedDept && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                  {ticket.concernedDept}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowResponseBox(!showResponseBox)}
              className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
              <span>{showResponseBox ? 'Hide Response Form' : `Record Response as ${activeStage.short}`}</span>
            </button>

            {isProblemSolved ? (
              <div className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Problem Solved — Redressal Complete</span>
              </div>
            ) : nextStage ? (
              <button
                type="button"
                onClick={() => onOpenEscalationModal(ticket)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                title={`Transfer from ${activeStage.short} to ${nextStage.short}`}
              >
                <span>Tag & Escalate to {nextStage.short}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-100 rounded-lg border border-purple-200">
                Apex Stage Reached (The Director)
              </span>
            )}
          </div>
        </div>

        {/* Input box to record Authority Response */}
        {showResponseBox && (
          <form onSubmit={handleSendResponse} className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-100">
                Official Response from {activeStage.short}:
              </label>
              <span className="text-[10px] text-slate-400">
                (Mandatory under institutional protocol)
              </span>
            </div>
            <textarea
              rows={3}
              value={responseInput}
              onChange={(e) => setResponseInput(e.target.value)}
              placeholder={`Enter official inspection update, technical spare order, or resolution status from ${activeStage.short}...`}
              className="w-full p-2.5 text-xs border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResponseBox(false)}
                className="px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3.5 py-1 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Recording...' : 'Submit Official Response'}
              </button>
            </div>
          </form>
        )}

        {/* Latest Recorded Authority Response */}
        {ticket.lastAuthorityResponse ? (
          <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-teal-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>Recorded Response from {ticket.lastAuthorityStage || activeStage.short}:</span>
              </span>
              {ticket.lastResponseAt && (
                <span className="text-[10px] text-slate-500">
                  {new Date(ticket.lastResponseAt).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-slate-100 italic font-semibold pl-2 border-l-2 border-teal-400 my-1">
              "{ticket.lastAuthorityResponse}"
            </p>
          </div>
        ) : (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">No official response recorded yet for {activeStage.short}.</span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                The authority is within their mandated response window. If no response is submitted before deadline, it will be considered as non-response and student/officer can tag & escalate.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chain of Custody & Escalation Log */}
      {logs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-teal-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Chain of Custody & Escalation Log ({logs.length} transfers):</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Dossier Maintained</span>
          </div>
          <div className="space-y-2">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3 cyber-card rounded-xl border border-slate-700/60 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-100 mb-1">
                  <span className="flex items-center gap-1 text-teal-800">
                    <CornerDownRight className="w-3.5 h-3.5 text-teal-600" />
                    <span>Escalated: <strong>{log.fromStage}</strong> ➔ <strong className="text-teal-900">{log.toStage}</strong></span>
                  </span>
                  <span className="text-slate-400 font-normal text-[10px]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ''}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 space-y-1 pl-4 border-l border-teal-200">
                  <div>
                    <strong>Escalation Reason:</strong> <span className="text-white font-semibold">{log.reason}</span>
                    {log.customOtherReason && <span className="italic"> ("{log.customOtherReason}")</span>}
                  </div>
                  {log.taggedPriorResponse && (
                    <div className="cyber-card-subtle p-2 rounded-lg border border-slate-700/60 text-[10.5px]">
                      <strong>Attached Prior Response:</strong> "{log.taggedPriorResponse}"
                    </div>
                  )}
                  {log.studentRemarks && (
                    <div className="text-slate-600 text-[10.5px]">
                      <strong>Student / Reporter Remarks:</strong> {log.studentRemarks}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Questionnaire Modal for Tagging & Escalating to next in hierarchy
 */
export function HostelEscalationQuestionnaireModal({ isOpen, onClose, ticket, onConfirmEscalate }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [studentRemarks, setStudentRemarks] = useState('');
  const [priorResponseText, setPriorResponseText] = useState(ticket?.lastAuthorityResponse || '');
  const [selectedDept, setSelectedDept] = useState(HOSTEL_CONCERNED_DEPARTMENTS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !ticket) return null;

  const currentStageKey = ticket.currentHierarchyStage || 'WARDEN';
  const currentIndex = HOSTEL_HIERARCHY_LEVELS.findIndex(l => l.key === currentStageKey);
  const nextStage = currentIndex < HOSTEL_HIERARCHY_LEVELS.length - 1 ? HOSTEL_HIERARCHY_LEVELS[currentIndex + 1] : null;

  if (!nextStage) return null;

  const questionsConfig = ESCALATION_QUESTIONS_BY_TARGET[nextStage.key] || {
    targetName: nextStage.title,
    prompt: `Why are you escalating this complaint to ${nextStage.short}?`,
    options: [
      'Problem not solved in previous stage',
      'Requires higher-level intervention',
      'SLA deadline breached without response or repair',
      'Other'
    ]
  };

  const currentAuthority = HOSTEL_HIERARCHY_LEVELS[currentIndex];
  const slaConfig = getHierarchySlaConfig(ticket.urgency || ticket.priority);
  const nextStageSla = slaConfig.stages[nextStage.key] || slaConfig.stages.WARDEN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedReason) {
      setErrorMsg('Please select a reason for tagging/escalating this complaint.');
      return;
    }

    if (selectedReason === 'Other' && !otherReasonText.trim()) {
      setErrorMsg('Please specify the detailed reason in the "Other" text field.');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetLabel = nextStage.key === 'DSW_DEPT' 
        ? `DSW & ${selectedDept}` 
        : nextStage.short;

      await onConfirmEscalate({
        ticketId: ticket.id,
        fromStage: currentAuthority.short,
        toStage: targetLabel,
        toStageKey: nextStage.key,
        targetDepartment: nextStage.key === 'DSW_DEPT' ? selectedDept : null,
        reason: selectedReason === 'Other' ? `Other: ${otherReasonText.trim()}` : selectedReason,
        customOtherReason: selectedReason === 'Other' ? otherReasonText.trim() : null,
        taggedPriorResponse: priorResponseText.trim() || ticket.lastAuthorityResponse || 'No response recorded by authority within mandated period.',
        studentRemarks: studentRemarks.trim()
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit escalation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="cyber-card rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-teal-200 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Campus Hierarchy Escalation & Tagging
            </h3>
            <p className="text-xs text-slate-500">
              Transferring from <strong className="text-slate-200">{currentAuthority.short}</strong> ➔ <strong className="text-teal-700">{nextStage.short}</strong>
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Authority Info Card with SLA and Note */}
          <div className="p-3.5 bg-teal-50/80 rounded-xl border border-teal-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950">
                Escalating To: {nextStage.title}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-700 text-white">
                SLA: {nextStageSla.allottedTime}
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              {nextStage.desc}
            </p>
            <div className="pt-1 border-t border-teal-200/60 text-[11px] text-amber-900 font-semibold">
              ⚠️ {nextStageSla.mandatoryNote}
            </div>
          </div>

          {/* User Department Selection (For Stage 2: DSW & Respective Department) */}
          {nextStage.key === 'DSW_DEPT' && (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5 animate-in fade-in">
              <label className="block text-xs font-bold text-blue-950 flex items-center justify-between">
                <span>Select Concerned Technical Department: <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-blue-700 font-semibold">Joint Assignment</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2.5 text-xs border border-blue-300 rounded-lg cyber-card focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-100 cursor-pointer"
                required
              >
                {HOSTEL_CONCERNED_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
              <p className="text-[10.5px] text-slate-600">
                The grievance will be jointly assigned to <strong>Dean of Student Welfare</strong> and the <strong>{selectedDept}</strong> technical lead.
              </p>
            </div>
          )}

          {/* Tagged Prior Authority Response */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1">
              Response from Previous Stage ({currentAuthority.short}) to be Attached:
            </label>
            <textarea
              rows={2}
              value={priorResponseText}
              onChange={(e) => setPriorResponseText(e.target.value)}
              placeholder={`Enter the response or note from ${currentAuthority.short} (or leave default if no response was recorded)...`}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">
              Note: If {currentAuthority.short} did not respond, it will be tagged as "No response recorded within mandated period".
            </span>
          </div>

          {/* Mandatory Questionnaire Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>{questionsConfig.prompt} <span className="text-rose-500">*</span></span>
            </label>
            
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl cyber-card focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
              required
            >
              <option value="">-- Select reason from dropdown --</option>
              {questionsConfig.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* If "Other" is chosen, show required text field */}
          {selectedReason === 'Other' && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-300 space-y-1.5 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-amber-950">
                Please specify your detailed reason ("Other"): <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                value={otherReasonText}
                onChange={(e) => setOtherReasonText(e.target.value)}
                placeholder="Explain why standard options do not apply and why higher-tier intervention is required..."
                className="w-full p-2.5 text-xs border border-amber-300 rounded-lg cyber-card focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Additional remarks / evidence notes */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1">
              Additional Details / Supporting Remarks (Optional):
            </label>
            <textarea
              rows={2}
              value={studentRemarks}
              onChange={(e) => setStudentRemarks(e.target.value)}
              placeholder="Any additional context regarding on-site severity, living disruption, or urgency..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Tagging...</span>
              ) : (
                <>
                  <span>Tag to {nextStage.short}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

/**
 * Reusable Authority Profile Card (renders for Warden, DSW, individual departments, AO, Director, or Student)
 */
export function CampusAuthorityProfileCard({ profileKey = 'WARDEN', onEditClick }) {
  const profile = CAMPUS_AUTHORITY_PROFILES[profileKey] || CAMPUS_AUTHORITY_PROFILES.WARDEN;

  return (
    <div className="cyber-card rounded-2xl border border-slate-700/60 shadow-xs overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-700/60 flex items-center justify-center shrink-0">
              {profile.key === 'REPORTER' ? (
                <User className="w-6 h-6 text-slate-200" />
              ) : profile.key === 'WARDEN' ? (
                <Building className="w-6 h-6 text-slate-200" />
              ) : profile.key === 'DSW' ? (
                <ShieldCheck className="w-6 h-6 text-slate-200" />
              ) : profile.key === 'AO' ? (
                <Award className="w-6 h-6 text-slate-200" />
              ) : profile.key === 'DIRECTOR' ? (
                <ShieldAlert className="w-6 h-6 text-slate-200" />
              ) : profile.departmentKey === 'Electrical Works' ? (
                <Zap className="w-6 h-6 text-slate-200" />
              ) : profile.departmentKey === 'Plumbing & Water Supply' ? (
                <Droplet className="w-6 h-6 text-slate-200" />
              ) : (
                <Wrench className="w-6 h-6 text-slate-200" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-black text-white leading-tight truncate">
                  {profile.name}
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-600 truncate">
                {profile.designation}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {profile.department}
              </p>
            </div>
          </div>
          {onEditClick && (
            <button
              type="button"
              onClick={onEditClick}
              className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 text-[11px] font-bold border border-slate-300 transition-all flex items-center gap-1 shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
              title="Edit profile information"
            >
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="cyber-card-subtle rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-bold flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5 text-slate-600" /> ID / Code
            </span>
            <span className="font-mono font-bold text-slate-950">{profile.idNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-600" /> Office Room
            </span>
            <span className="font-bold text-slate-950 truncate max-w-[170px]" title={profile.location}>
              {profile.location}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-600" /> Email
            </span>
            <span className="font-bold text-blue-700">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-600" /> Contact
            </span>
            <span className="font-bold text-slate-950">{profile.phone}</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-snug">
          <span className="font-bold text-slate-900 block mb-0.5">Assigned Duties:</span>
          {profile.duties}
        </div>
      </div>
    </div>
  );
}
