import React, { useState } from 'react';
import { 
  Scale, Shield, ShieldCheck, CheckCircle2, Clock, AlertTriangle, 
  FileText, UserCheck, Users, Gavel, ArrowRight, Check, X, 
  ExternalLink, Building2, GraduationCap, ChevronRight, Lock, 
  EyeOff, Award, Sparkles, Send, MessageSquare, AlertCircle, 
  Download, Printer, Info, ShieldAlert, BadgeCheck
} from 'lucide-react';

/**
 * Statutory Three-Level Committee Mechanism Grounded in RGUKT RK Valley Office Order:
 * "Constitution of Committee for Reconstitution of Internal Complaints Committee (ICC), RGUKT RK Valley"
 * Ref: Note approved by Director dated 03.08.2026, dated 11.08.2026.
 *
 * Page 1: Three-level mechanism chaired by Director
 * Page 2: 2. Medium Committee (6 Members)
 * Page 3: 3. ICC Committee (Large/Serious Issues)
 */

export const SMALL_COMMITTEE_ORDER_INFO = {
  refNo: 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee',
  date: '11.08.2026',
  noteApprovedDate: '03.08.2026',
  institution: 'RGUKT RK Valley (Idupulapaya)',
  chairperson: 'The Director, RGUKT RK Valley',
  tierName: '1. Small Committee ( 3Members)',
  mandate: 'The Small Committee shall deal with minor complaints raised by students, faculty and staff. The committee shall examine the complaint and resolve the matter with the approval of the Chairperson (Director).'
};

export const MEDIUM_COMMITTEE_ORDER_INFO = {
  refNo: 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee',
  date: '11.08.2026',
  noteApprovedDate: '03.08.2026',
  institution: 'RGUKT RK Valley (Idupulapaya)',
  chairperson: 'The Director, RGUKT RK Valley',
  tierName: '2. Medium Committee (6 Members)',
  mandate: 'Complaints of moderate seriousness involving students, faculty, or staff. This committee shall conduct an inquiry, recommend suitable action, and dispose of the complaint with the approval of the Chairperson.'
};

export const LEVEL3_COMMITTEE_ORDER_INFO = {
  refNo: 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee',
  date: '11.08.2026',
  noteApprovedDate: '03.08.2026',
  institution: 'RGUKT RK Valley (Idupulapaya)',
  chairperson: 'The Director, RGUKT RK Valley',
  tierName: '3. ICC Committee (Large/Serious Issues)',
  mandate: 'The Full ICC Committee shall deal with major, sensitive or complex complaints requiring detailed inquiry. The Committee shall conduct a comprehensive inquiry and submit findings and recommendations to the Chairperson (Director) for appropriate action.'
};

export const DEPARTMENTS_LIST = [
  { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. K. Venkatesh' },
  { code: 'ECE', name: 'Electronics & Communication Engg.', hod: 'Dr. P. Suresh' },
  { code: 'EEE', name: 'Electrical & Electronics Engg.', hod: 'Dr. M. Ramesh' },
  { code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. S. Naresh' },
  { code: 'CIVIL', name: 'Civil Engineering', hod: 'Dr. A. Kiran' },
  { code: 'CHEMICAL', name: 'Chemical Engineering', hod: 'Dr. V. Prasad' },
  { code: 'MME', name: 'Metallurgical & Materials Engg.', hod: 'Dr. T. Satish' }
];

// Helper for Level 1: Small Committee (3 Members) - Clause 1 of Office Order
export function getSmallCommitteeMembers({
  matterType = 'STUDENT',
  domainType = 'ACADEMIC'
}) {
  return [
    {
      idx: 'i',
      slot: 'Presiding Officer, ICC',
      name: 'Dr. Ratnakumari Challa',
      designation: 'Presiding Officer, ICC',
      type: 'Permanent Statutory Member',
      avatarEmoji: '👩‍🏫',
      bgGradient: 'from-purple-700 to-indigo-900',
      badge: 'Presiding Officer',
      statutoryRule: 'Clause 1(i) of Office Order'
    },
    {
      idx: 'ii',
      slot: matterType === 'STUDENT' ? 'Dean, Student Welfare' : 'EBS Coordinator',
      name: matterType === 'STUDENT' ? 'Prof. B. Ravi' : 'Dr. M. Sridhar',
      designation: matterType === 'STUDENT' ? 'Dean, Student Welfare (DSW)' : 'EBS Coordinator',
      type: matterType === 'STUDENT' ? 'For Student Matters' : 'For Staff Matters',
      avatarEmoji: matterType === 'STUDENT' ? '🎓' : '💼',
      bgGradient: 'from-blue-600 to-cyan-800',
      badge: matterType === 'STUDENT' ? 'Student Welfare' : 'Staff Welfare',
      statutoryRule: 'Clause 1(ii) of Office Order'
    },
    {
      idx: 'iii',
      slot: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer',
      name: domainType === 'ACADEMIC' ? 'Prof. N. Srinivas' : 'Sri. K. Ramesh',
      designation: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer (AO)',
      type: domainType === 'ACADEMIC' ? 'For Academic Matters' : 'For Administrative/Staff Matters',
      avatarEmoji: domainType === 'ACADEMIC' ? '📚' : '🏢',
      bgGradient: 'from-emerald-600 to-teal-800',
      badge: domainType === 'ACADEMIC' ? 'Academic Affairs' : 'Campus Admin',
      statutoryRule: 'Clause 1(iii) of Office Order'
    }
  ];
}

// Helper for Level 2: Medium Committee (6 Members)
export function getMediumCommitteeMembers({
  matterType = 'STUDENT',
  domainType = 'ACADEMIC',
  department = 'CSE',
  specialDomain = 'MESS'
}) {
  const deptObj = DEPARTMENTS_LIST.find(d => d.code === department) || DEPARTMENTS_LIST[0];

  return [
    {
      idx: 'i',
      slot: 'Presiding Officer, ICC',
      name: 'Dr. Ratnakumari Challa',
      designation: 'Presiding Officer, ICC',
      type: 'Permanent Statutory Member',
      avatarEmoji: '👩‍🏫',
      bgGradient: 'from-purple-700 to-indigo-900',
      badge: 'Presiding Officer',
      statutoryRule: 'Clause 2(i) of Office Order'
    },
    {
      idx: 'ii',
      slot: matterType === 'STUDENT' ? 'Dean, Student Welfare' : 'EBS Coordinator',
      name: matterType === 'STUDENT' ? 'Prof. B. Ravi' : 'Dr. M. Sridhar',
      designation: matterType === 'STUDENT' ? 'Dean, Student Welfare (DSW)' : 'EBS Coordinator',
      type: matterType === 'STUDENT' ? 'For Student Matters' : 'For Staff Matters',
      avatarEmoji: matterType === 'STUDENT' ? '🎓' : '💼',
      bgGradient: 'from-blue-600 to-cyan-800',
      badge: matterType === 'STUDENT' ? 'Student Welfare' : 'Staff Welfare',
      statutoryRule: 'Clause 2(ii) of Office Order'
    },
    {
      idx: 'iii',
      slot: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer',
      name: domainType === 'ACADEMIC' ? 'Prof. N. Srinivas' : 'Sri. K. Ramesh',
      designation: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer (AO)',
      type: domainType === 'ACADEMIC' ? 'For Academic Matters' : 'For Administrative / Staff Matters',
      avatarEmoji: domainType === 'ACADEMIC' ? '📚' : '🏢',
      bgGradient: 'from-emerald-600 to-teal-800',
      badge: domainType === 'ACADEMIC' ? 'Academic Affairs' : 'Campus Admin',
      statutoryRule: 'Clause 2(iii) of Office Order'
    },
    {
      idx: 'iv',
      slot: `HoD of Respective Department (${deptObj.code})`,
      name: `${deptObj.hod} (${deptObj.code})`,
      designation: `Head of Department - ${deptObj.name}`,
      type: 'HoD of Concerned Student / Faculty Dept',
      avatarEmoji: '🔬',
      bgGradient: 'from-amber-600 to-orange-800',
      badge: `HoD ${deptObj.code}`,
      statutoryRule: 'Clause 2(iv) of Office Order'
    },
    {
      idx: 'v',
      slot: specialDomain === 'SPORTS' 
        ? 'Sports-Related Representative' 
        : specialDomain === 'MESS' 
          ? 'Chief Mess Coordinator and Additional CMC'
          : 'Campus Hostels & Discipline Proctor',
      name: specialDomain === 'SPORTS'
        ? 'Mr. P.V. Ramana Reddy'
        : specialDomain === 'MESS'
          ? 'Sri. S. V. Krishna & Additional CMC'
          : 'Dr. Y. V. Subbarao (Chief Warden)',
      designation: specialDomain === 'SPORTS'
        ? 'Sports & Physical Education Officer'
        : specialDomain === 'MESS'
          ? 'Chief Mess Coordinator & Additional CMC'
          : 'Chief Hostel Warden & Campus Proctor',
      type: specialDomain === 'SPORTS'
        ? 'For Sports-Related Matters'
        : specialDomain === 'MESS'
          ? 'For Mess-Related Matters'
          : 'Campus Facilities Purview',
      avatarEmoji: specialDomain === 'SPORTS' ? '⚽' : specialDomain === 'MESS' ? '🍲' : '🛡️',
      bgGradient: 'from-rose-600 to-pink-800',
      badge: specialDomain === 'SPORTS' ? 'Sports Matters' : specialDomain === 'MESS' ? 'Mess & Dining' : 'Hostel Proctor',
      statutoryRule: 'Clause 2(v) of Office Order'
    },
    {
      idx: 'vi',
      slot: 'Woman Faculty Member',
      name: 'Dr. Suvarna',
      designation: 'Woman Faculty Representative',
      type: 'Permanent Statutory Member',
      avatarEmoji: '👩‍🔬',
      bgGradient: 'from-fuchsia-700 to-purple-900',
      badge: 'Woman Faculty',
      statutoryRule: 'Clause 2(vi) of Office Order'
    }
  ];
}

// Helper for Level 3: Full ICC Committee (Large/Serious Issues) - Page 3 of Order
export function getLevel3CommitteeMembers({
  matterType = 'STUDENT',
  domainType = 'ACADEMIC',
  department = 'CSE',
  specialDomain = 'SPORTS',
  involvesStudents = true
}) {
  const deptObj = DEPARTMENTS_LIST.find(d => d.code === department) || DEPARTMENTS_LIST[0];

  const members = [
    {
      idx: 'i',
      slot: 'Presiding Officer, ICC',
      name: 'Dr. Ratnakumari Challa',
      designation: 'Presiding Officer, ICC',
      type: 'Permanent Statutory Presiding Officer',
      avatarEmoji: '👩‍🏫',
      bgGradient: 'from-purple-700 to-indigo-950',
      badge: 'Presiding Officer',
      statutoryRule: 'Clause 3(i) of Office Order'
    },
    {
      idx: 'ii',
      slot: matterType === 'STUDENT' ? 'Dean, Student Welfare' : 'EBS Coordinator',
      name: matterType === 'STUDENT' ? 'Prof. B. Ravi' : 'Dr. M. Sridhar',
      designation: matterType === 'STUDENT' ? 'Dean, Student Welfare (DSW)' : 'EBS Coordinator',
      type: matterType === 'STUDENT' ? 'For Student Matters' : 'For Staff Matters',
      avatarEmoji: matterType === 'STUDENT' ? '🎓' : '💼',
      bgGradient: 'from-blue-600 to-cyan-900',
      badge: matterType === 'STUDENT' ? 'Student Welfare' : 'Staff Welfare',
      statutoryRule: 'Clause 3(ii) of Office Order'
    },
    {
      idx: 'iii',
      slot: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer',
      name: domainType === 'ACADEMIC' ? 'Prof. N. Srinivas' : 'Sri. K. Ramesh',
      designation: domainType === 'ACADEMIC' ? 'Dean Academics' : 'Administrative Officer (AO)',
      type: domainType === 'ACADEMIC' ? 'For Academic Matters' : 'For Administrative / Staff Matters',
      avatarEmoji: domainType === 'ACADEMIC' ? '📚' : '🏢',
      bgGradient: 'from-emerald-600 to-teal-900',
      badge: domainType === 'ACADEMIC' ? 'Academic Affairs' : 'Campus Admin',
      statutoryRule: 'Clause 3(iii) of Office Order'
    },
    {
      idx: 'iv',
      slot: `HoD of Respective Department (${deptObj.code})`,
      name: `${deptObj.hod} (${deptObj.code})`,
      designation: `Head of Department - ${deptObj.name}`,
      type: 'HoD of Concerned Student / Faculty Dept',
      avatarEmoji: '🔬',
      bgGradient: 'from-amber-600 to-orange-900',
      badge: `HoD ${deptObj.code}`,
      statutoryRule: 'Clause 3(iv) of Office Order'
    },
    {
      idx: 'v',
      slot: specialDomain === 'SPORTS' 
        ? 'Dr. Ramana Reddy (for sports-related matters)' 
        : 'Chief Mess Coordinator (for mess-related matters)',
      name: specialDomain === 'SPORTS'
        ? 'Dr. Ramana Reddy'
        : 'Sri. S. V. Krishna (Chief Mess Coordinator)',
      designation: specialDomain === 'SPORTS'
        ? 'In-Charge / Officer of Sports & Physical Education'
        : 'Chief Mess Coordinator & Additional CMC',
      type: specialDomain === 'SPORTS' ? 'For Sports-Related Matters' : 'For Mess-Related Matters',
      avatarEmoji: specialDomain === 'SPORTS' ? '⚽' : '🍲',
      bgGradient: 'from-rose-600 to-pink-900',
      badge: specialDomain === 'SPORTS' ? 'Sports Purview' : 'Mess Purview',
      statutoryRule: 'Clause 3(v) of Office Order'
    },
    {
      idx: 'vi',
      slot: 'Woman Faculty Members (Two Appointees)',
      name: 'Dr. Suvarna and Dr. Vimala Persis',
      designation: 'Woman Faculty Representatives (Dual Appointees)',
      type: 'Statutory Woman Faculty Representation',
      avatarEmoji: '👩‍🔬',
      bgGradient: 'from-fuchsia-700 to-purple-950',
      badge: '2 Women Faculty',
      statutoryRule: 'Clause 3(vi) of Office Order'
    },
    {
      idx: 'vii',
      slot: 'Sub-Inspector, RK Valley Police Station',
      name: 'Sub-Inspector, RK Valley Police Station',
      designation: 'Law Enforcement / Station House Officer',
      type: 'Statutory Police Representation',
      avatarEmoji: '👮‍♂️',
      bgGradient: 'from-blue-900 to-slate-950',
      badge: 'Police Sub-Inspector',
      statutoryRule: 'Clause 3(vii) of Office Order'
    },
    {
      idx: 'viii',
      slot: 'Ms. Chennamasetti Neelima, Advocate, Kadapa',
      name: 'Ms. Chennamasetti Neelima',
      designation: 'Advocate, Kadapa District Bar',
      type: 'Statutory External Legal & Judicial Expert',
      avatarEmoji: '⚖️',
      bgGradient: 'from-amber-700 to-amber-950',
      badge: 'External Advocate',
      statutoryRule: 'Clause 3(viii) of Office Order'
    }
  ];

  if (involvesStudents) {
    members.push({
      idx: 'ix',
      slot: 'Three Student Representatives',
      name: 'Student GS, Girl Student Rep & Class Rep',
      designation: '3 Nominated Student Representatives',
      type: 'Only if the compliant involves students',
      avatarEmoji: '🎓',
      bgGradient: 'from-sky-600 to-indigo-900',
      badge: '3 Student Reps',
      statutoryRule: 'Clause 3(ix) of Office Order'
    });
  }

  return members;
}

export const SMALL_COMMITTEE_FLOW_STAGES = [
  {
    step: 1,
    title: 'Minor Complaint Registered',
    subtitle: 'Confidential Filing by Student / Faculty / Staff',
    leadActor: 'Complainant (Student, Faculty or Staff)',
    sla: 'Immediate (< 6 Hours)',
    desc: 'Minor complaint filed under Clause 1 of Office Order dated 11.08.2026. Routed directly to 3-Member Small Committee for examination.',
    statutoryNote: 'Office Order Ref: RGUKT/RKV/Committee/ Reconstitution/ICC',
    badge: 'Stage 1: Registered'
  },
  {
    step: 2,
    title: 'Small Committee (3 Members) Convened',
    subtitle: 'Presiding Officer, Dean/EBS & Dean Academics/AO',
    leadActor: 'Dr. Ratnakumari Challa (Presiding Officer)',
    sla: 'Within 18 Hours',
    desc: '3-member bench constituted under Clauses i, ii, iii of Office Order. Preliminary dossier examined by Presiding Officer.',
    statutoryNote: '3 Statutory Members Formally Convened',
    badge: 'Stage 2: Bench Convened'
  },
  {
    step: 3,
    title: 'Examination & Informal Fact-Finding',
    subtitle: 'Parties Discussion & Conciliation',
    leadActor: '3-Member Small Committee Bench',
    sla: 'Within 36 Hours',
    desc: 'The committee examines the complaint, speaks to concerned parties, and reviews ground conditions to establish facts and formulate an amicable resolution.',
    statutoryNote: 'Fact-Finding & Conciliation Review',
    badge: 'Stage 3: Examination'
  },
  {
    step: 4,
    title: 'Resolution Formulated by Committee',
    subtitle: 'Draft Settlement & Redressal Terms',
    leadActor: 'Small Committee Bench',
    sla: 'Within 48 Hours',
    desc: 'Formal resolution report prepared specifying corrective actions, departmental repairs, or behavioral conciliation terms.',
    statutoryNote: 'Resolution Draft Formulated',
    badge: 'Stage 4: Resolution Drafted'
  },
  {
    step: 5,
    title: 'Approval of Chairperson (Director)',
    subtitle: 'Director Sanction & Directorial Approval',
    leadActor: 'The Chairperson (Director), RGUKT RK Valley',
    sla: 'Within 60 Hours',
    desc: 'As mandated by Clause 1 ("resolve the matter with the approval of the Chairperson (Director)"), the resolution is placed before the Director for statutory assent.',
    statutoryNote: 'Submitted for Approval of Chairperson (Director)',
    badge: 'Stage 5: Director Approval'
  },
  {
    step: 6,
    title: 'Matter Resolved & Officially Disposed',
    subtitle: 'Resolution Notice Dispatched & Documented',
    leadActor: 'Presiding Officer & ICC Secretariat',
    sla: '< 72 Hours Total',
    desc: 'Upon Director approval, redressal actions are executed and the complaint is formally marked as resolved and entered into ICC compliance register.',
    statutoryNote: 'Matter Resolved with Director Approval',
    badge: 'Stage 6: Resolved & Closed'
  }
];

export const MEDIUM_COMMITTEE_FLOW_STAGES = [
  {
    step: 1,
    title: 'Grievance Dossier Lodged',
    subtitle: 'Confidential Registration & Referral',
    leadActor: 'Complainant & ICC Secretariat',
    sla: 'Within 12 Hours',
    desc: 'Formal grievance filed with sealed confidentiality and optional identity masking under Office Order dated 11.08.2026.',
    statutoryNote: 'Order Ref: RGUKT/RKV/Committee/ Reconstitution/ICC',
    badge: 'Stage 1: Initiation'
  },
  {
    step: 2,
    title: '6-Member Bench Constitution',
    subtitle: 'Dynamic Statutory Assignment',
    leadActor: 'Presiding Officer Dr. Ratnakumari Challa',
    sla: 'Within 24 Hours',
    desc: 'Dynamic 6-member bench constituted tailored to student/staff, academic/admin, department HoD, and mess/sports purview.',
    statutoryNote: 'Statutory 6-Member Quorum verified',
    badge: 'Stage 2: Bench Formed'
  },
  {
    step: 3,
    title: 'Formal Summons & Hearing Notices',
    subtitle: 'Interim Protective Safeguards',
    leadActor: 'Presiding Officer & Bench Members',
    sla: 'Within 48 Hours',
    desc: 'Summons served to respondent(s); in-camera hearing scheduled; immediate anti-retaliation orders issued.',
    statutoryNote: 'Confidential Summons issued',
    badge: 'Stage 3: Notice Issued'
  },
  {
    step: 4,
    title: 'Quasi-Judicial In-Camera Inquiry',
    subtitle: 'Depositions & Evidence Review',
    leadActor: '6-Member Medium Committee Bench',
    sla: 'Within 3 - 5 Days',
    desc: 'Detailed examination of witness depositions, hostel/lab inspections, surveillance logs, and respondent cross-statements.',
    statutoryNote: 'In-camera evidentiary proceedings recorded',
    badge: 'Stage 4: Active Inquiry'
  },
  {
    step: 5,
    title: 'Findings & Action Recommendations',
    subtitle: 'Comprehensive Inquiry Report',
    leadActor: 'Presiding Officer & 6 Committee Members',
    sla: 'Within 5 - 7 Days',
    desc: 'The 6 members formulate conclusive findings and draft recommended corrective, administrative, or disciplinary sanctions.',
    statutoryNote: 'Unanimous / Majority report prepared',
    badge: 'Stage 5: Report Drafted'
  },
  {
    step: 6,
    title: 'Disposal with Approval of Chairperson',
    subtitle: 'Director Executive Order Promulgated',
    leadActor: 'The Director, RGUKT RK Valley',
    sla: 'Final Disposal Order',
    desc: 'Submitted to Chairperson (The Director) for statutory approval. Upon executive assent, final enforceable order is promulgated.',
    statutoryNote: 'Final University Disposal Order Executed',
    badge: 'Stage 6: Disposed'
  }
];

export const LEVEL3_COMMITTEE_FLOW_STAGES = [
  {
    step: 1,
    title: 'Major / Sensitive Dossier Lodged',
    subtitle: 'High Gravity Sealed Docketing',
    leadActor: 'Complainant & Office of Director',
    sla: 'Within 6 Hours',
    desc: 'Major, sensitive or complex complaint logged requiring full detailed inquiry under Clause 3 of Office Order dated 11.08.2026.',
    statutoryNote: 'Sealed & Escalated Directly to Full ICC',
    badge: 'Stage 1: Major Lodging'
  },
  {
    step: 2,
    title: 'Full ICC Bench Quorum Convened',
    subtitle: 'Presiding Officer, Police SI, Advocate & Student Reps',
    leadActor: 'Presiding Officer Dr. Ratnakumari Challa',
    sla: 'Within 18 Hours',
    desc: 'Comprehensive quorum formed: Dr. Suvarna & Dr. Vimala Persis, Sub-Inspector (RK Valley Police Station), Ms. Chennamasetti Neelima (Advocate Kadapa) & 3 Student Reps.',
    statutoryNote: 'Full 11-Member Statutory Quorum Formed',
    badge: 'Stage 2: Full Quorum'
  },
  {
    step: 3,
    title: 'Immediate Protective Injunction & Police Liaison',
    subtitle: 'Statutory Summons & Anti-Retaliation Injunction',
    leadActor: 'Presiding Officer & SI RK Valley PS',
    sla: 'Within 24 Hours',
    desc: 'Formal summons served; legal protection injunction issued; campus/hostel isolation enforced; local police liaison on standby.',
    statutoryNote: 'Enforceable Anti-Retaliation Injunction',
    badge: 'Stage 3: Protective Notice'
  },
  {
    step: 4,
    title: 'Comprehensive In-Camera Quasi-Judicial Tribunal',
    subtitle: 'Sworn Cross-Examinations & External Legal Scrutiny',
    leadActor: 'Full ICC Committee Bench & Advocate Neelima',
    sla: 'Within 3 - 5 Days',
    desc: 'Exhaustive tribunal hearing with sworn testimonies, forensic audits, and strict legal verification guided by Advocate Ms. Neelima.',
    statutoryNote: 'In-Camera Multi-Disciplinary Inquiry',
    badge: 'Stage 4: Full Inquiry'
  },
  {
    step: 5,
    title: 'Comprehensive Findings & Recommendations Report',
    subtitle: 'Culpability Synthesis & Institutional Sanctions',
    leadActor: 'Full ICC Committee & Presiding Officer',
    sla: 'Within 5 - 7 Days',
    desc: 'Comprehensive report submitted to Chairperson (Director) detailing factual findings and recommending proportionate statutory actions.',
    statutoryNote: 'Submitted to Chairperson (Director)',
    badge: 'Stage 5: Comprehensive Report'
  },
  {
    step: 6,
    title: 'Appropriate Orders Promulgated by Chairperson',
    subtitle: 'Director Executive Order & Final Redressal',
    leadActor: 'The Chairperson (Director), RGUKT RK Valley',
    sla: 'Executive Assent Order',
    desc: 'Recommendations placed before Chairperson (Director) for consideration and appropriate orders under the closing mandate of the Order.',
    statutoryNote: 'Final University Executive Sanction Enforced',
    badge: 'Stage 6: Appropriate Orders Promulgated'
  }
];

/**
 * Interactive Form Studio for Level 1: Small Committee (3 Members)
 * Grounded in RGUKT RK Valley Office Order:
 * "1. Small Committee ( 3Members)
 * The Small Committee shall deal with minor complaints raised by students, faculty and staff.
 * The committee shall examine the complaint and resolve the matter with the approval of the Chairperson (Director)."
 */
export function SmallCommitteeFlowStudio({
  matterType,
  setMatterType,
  domainType,
  setDomainType
}) {
  const [activeStagePreview, setActiveStagePreview] = useState(1);
  const members = getSmallCommitteeMembers({ matterType, domainType });

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-4 sm:p-6 border-2 border-emerald-500/50 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Official Order Citation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-inner">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Official Office Order • Clause 1
              </span>
              <span className="text-[11px] font-mono text-emerald-200">
                Small Committee Mechanism (Dated 11.08.2026)
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              1. Small Committee (3 Members) Flow Studio
            </h4>
            <p className="text-xs text-emerald-200/80">
              Deals with minor complaints raised by students, faculty and staff with approval of the Chairperson (Director)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/60">
          <Gavel className="w-4 h-4 text-emerald-300" />
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">Appointing & Approving</span>
            <span className="text-[11px] font-black text-emerald-300">Chairperson (Director)</span>
          </div>
        </div>
      </div>

      {/* Official Order Mandate Excerpt from Page 1 */}
      <div className="bg-emerald-900/40 border border-emerald-700/50 p-3.5 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-100 leading-relaxed">
          <strong className="text-emerald-300 block mb-0.5 font-bold">Official Mandate (Clause 1 of Office Order):</strong>
          <em>"The Small Committee shall deal with minor complaints raised by students, faculty and staff. The committee shall examine the complaint and resolve the matter with the approval of the Chairperson (Director)."</em>
        </div>
      </div>

      {/* Dynamic 2-Parameter Configurator Grid */}
      <div className="bg-slate-900/80 border border-emerald-700/50 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Dynamic 3-Member Bench Parametric Selector (Clauses i to iii)
          </span>
          <span className="text-[11px] text-emerald-300 font-bold">
            Total Members: 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* 1. Student Matter vs Staff Matter (Clause ii) */}
          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 space-y-2">
            <label className="text-[11px] font-bold text-emerald-200 block">
              ii. Target Category:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setMatterType('STUDENT')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STUDENT'
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs ring-1 ring-emerald-300'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                🎓 Student Matters
              </button>
              <button
                type="button"
                onClick={() => setMatterType('STAFF')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STAFF'
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs ring-1 ring-emerald-300'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                💼 Staff Matters
              </button>
            </div>
            <p className="text-[10px] text-emerald-300 truncate">
              {matterType === 'STUDENT' ? '➔ Dean, Student Welfare (Prof. B. Ravi)' : '➔ EBS Coordinator (Dr. M. Sridhar)'}
            </p>
          </div>

          {/* 2. Academic Matter vs Administrative Matter (Clause iii) */}
          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 space-y-2">
            <label className="text-[11px] font-bold text-emerald-200 block">
              iii. Domain Purview:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setDomainType('ACADEMIC')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ACADEMIC'
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs ring-1 ring-emerald-300'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                📚 Academic Matters
              </button>
              <button
                type="button"
                onClick={() => setDomainType('ADMINISTRATIVE')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ADMINISTRATIVE'
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs ring-1 ring-emerald-300'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                🏢 Admin/Staff Matters
              </button>
            </div>
            <p className="text-[10px] text-emerald-300 truncate">
              {domainType === 'ACADEMIC' ? '➔ Dean Academics (Prof. N. Srinivas)' : '➔ Administrative Officer (Sri. K. Ramesh)'}
            </p>
          </div>

        </div>
      </div>

      {/* 3 Members Roster Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Statutory 3-Member Bench (Active Composition)
          </h5>
          <span className="text-[10px] bg-emerald-950 border border-emerald-600/50 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
            Clauses i, ii, iii of Office Order
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {members.map((m) => (
            <div 
              key={m.idx}
              className="bg-slate-900/90 border border-emerald-700/60 rounded-2xl p-3.5 space-y-2 relative overflow-hidden group hover:border-emerald-400 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.bgGradient} flex items-center justify-center text-lg shadow-sm shrink-0`}>
                    {m.avatarEmoji}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-300 block font-bold">
                      Clause 1({m.idx})
                    </span>
                    <h6 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                      {m.name}
                    </h6>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-600 text-emerald-300">
                  {m.badge}
                </span>
              </div>

              <div className="text-[11px] text-emerald-200/90 font-medium">
                {m.designation}
              </div>

              <div className="pt-1.5 border-t border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-300/80">
                <span className="italic">{m.type}</span>
                <span className="font-mono text-[9px] text-emerald-400">{m.statutoryRule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Stage Small Committee Flow Timeline */}
      <div className="bg-slate-900/90 border border-emerald-700/50 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-300" />
            <h5 className="text-xs font-black uppercase tracking-wider text-emerald-300">
              6-Stage Minor Redressal & Disposal Flow
            </h5>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700">
            SLA: Target Resolution &lt; 72 Hours
          </span>
        </div>

        {/* Stages Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SMALL_COMMITTEE_FLOW_STAGES.map((stg) => {
            const isActive = activeStagePreview === stg.step;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStagePreview(stg.step)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md ring-1 ring-emerald-300'
                    : 'bg-emerald-950/50 text-emerald-200 border-emerald-800/60 hover:bg-emerald-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isActive ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-900 text-emerald-200'}`}>
                      Step {stg.step}
                    </span>
                    <span className="text-xs">{stg.badge.split(':')[0]}</span>
                  </div>
                  <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${isActive ? 'text-slate-950' : 'text-white'}`}>
                    {stg.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        {(() => {
          const cur = SMALL_COMMITTEE_FLOW_STAGES.find(s => s.step === activeStagePreview) || SMALL_COMMITTEE_FLOW_STAGES[0];
          return (
            <div className="bg-slate-900/95 border border-emerald-400/60 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-800/50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    {cur.step}
                  </span>
                  <div>
                    <h6 className="text-xs font-black text-white">{cur.title} — {cur.subtitle}</h6>
                    <span className="text-[10px] text-emerald-300">Lead Responsible: {cur.leadActor}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">
                  {cur.statutoryNote}
                </span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {cur.desc}
              </p>
            </div>
          );
        })()}

      </div>

    </div>
  );
}

/**
 * Interactive Form Studio for Level 2 (Medium Committee - 6 Members)
 */
export function MediumCommitteeFlowStudio({
  matterType,
  setMatterType,
  domainType,
  setDomainType,
  department,
  setDepartment,
  specialDomain,
  setSpecialDomain
}) {
  const [activeStagePreview, setActiveStagePreview] = useState(1);
  const members = getMediumCommitteeMembers({ matterType, domainType, department, specialDomain });

  return (
    <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-6 border-2 border-purple-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Official Order Citation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-800/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Official Office Order
              </span>
              <span className="text-[11px] font-mono text-purple-200">
                Dated: 11.08.2026 (Director Approved 03.08.2026)
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              Level 2: Medium Committee (6 Members) Flow Studio
            </h4>
            <p className="text-xs text-purple-200/80">
              Statutory 6-Member Bench & 6-Stage Quasi-Judicial Redressal Mechanism Chaired by The Director
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-700/60">
          <Gavel className="w-4 h-4 text-amber-300" />
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">Chairperson</span>
            <span className="text-[11px] font-black text-amber-300">The Director, RGUKT RK Valley</span>
          </div>
        </div>
      </div>

      {/* Official Order Mandate Excerpt */}
      <div className="bg-purple-900/40 border border-purple-700/50 p-3.5 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-100 leading-relaxed">
          <strong className="text-amber-300 block mb-0.5 font-bold">Official Mandate (Clause 2 of Office Order):</strong>
          <em>"Complaints of moderate seriousness involving students, faculty, or staff. This committee shall conduct an inquiry, recommend suitable action, and dispose of the complaint with the approval of the Chairperson."</em>
        </div>
      </div>

      {/* Dynamic 4-Parameter Configurator Grid */}
      <div className="bg-slate-900/80 border border-purple-700/50 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Dynamic 6-Member Bench Parametric Selector
          </span>
          <span className="text-[11px] text-purple-300">
            Configures statutory roles dynamically
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Student Matter vs Staff Matter */}
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/80 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              ii. Target Category:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setMatterType('STUDENT')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STUDENT'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setMatterType('STAFF')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STAFF'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                💼 Faculty/Staff
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {matterType === 'STUDENT' ? '➔ Dean, Student Welfare' : '➔ EBS Coordinator'}
            </p>
          </div>

          {/* 2. Academic Matter vs Administrative Matter */}
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/80 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              iii. Domain Sphere:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setDomainType('ACADEMIC')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ACADEMIC'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                📚 Academic
              </button>
              <button
                type="button"
                onClick={() => setDomainType('ADMINISTRATIVE')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ADMINISTRATIVE'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                🏢 Admin/Staff
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {domainType === 'ACADEMIC' ? '➔ Dean Academics' : '➔ Administrative Officer'}
            </p>
          </div>

          {/* 3. Respective Department HoD */}
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/80 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              iv. Concerned Dept HoD:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-purple-900 text-white border border-purple-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {DEPARTMENTS_LIST.map(d => (
                <option key={d.code} value={d.code}>
                  {d.code} - {d.hod}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-purple-300 truncate">
              ➔ HoD of {department} Dept
            </p>
          </div>

          {/* 4. Special Domain: Mess vs Sports vs General */}
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/80 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              v. Facility / Purview:
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setSpecialDomain('MESS')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                  specialDomain === 'MESS'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
                title="Mess & Dining matters"
              >
                🍲 Mess
              </button>
              <button
                type="button"
                onClick={() => setSpecialDomain('SPORTS')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                  specialDomain === 'SPORTS'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
                title="Sports-related matters"
              >
                ⚽ Sports
              </button>
              <button
                type="button"
                onClick={() => setSpecialDomain('GENERAL')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                  specialDomain === 'GENERAL'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
                title="General campus discipline"
              >
                🛡️ General
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {specialDomain === 'MESS' ? '➔ Chief Mess Coord. & Addl CMC' : specialDomain === 'SPORTS' ? '➔ Mr. P.V. Ramana Reddy' : '➔ Campus Proctor/Warden'}
            </p>
          </div>

        </div>
      </div>

      {/* Live 6-Member Bench Visualizer Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-300" />
            <h5 className="text-xs font-black uppercase tracking-wider text-white">
              Official 6-Member Bench Roster (Under Order 11.08.2026)
            </h5>
          </div>
          <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700 font-bold">
            All 6 Members Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map((m) => (
            <div 
              key={m.idx}
              className="bg-slate-900/90 rounded-2xl p-3.5 border border-purple-700/60 hover:border-amber-400/80 transition-all shadow-md flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.bgGradient} flex items-center justify-center text-lg shrink-0 shadow-inner border border-white/20`}>
                {m.avatarEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950 text-amber-300 border border-purple-800">
                    Member ({m.idx})
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-800/80 text-purple-200">
                    {m.badge}
                  </span>
                </div>
                <div className="text-xs font-black text-white truncate" title={m.name}>
                  {m.name}
                </div>
                <div className="text-[10px] text-amber-200/90 font-semibold truncate" title={m.slot}>
                  {m.slot}
                </div>
                <div className="text-[9px] text-purple-300 truncate mt-0.5">
                  {m.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Stage Inquiry & Disposal Process Flow Pipeline */}
      <div className="space-y-3 pt-2 border-t border-purple-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <h5 className="text-xs font-black uppercase tracking-wider text-white">
              6-Stage Inquiry & Disposal Pipeline (Click a step to view procedure)
            </h5>
          </div>
          <span className="text-[10px] text-amber-300 font-bold">
            Target SLA: 7 Days Total
          </span>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {MEDIUM_COMMITTEE_FLOW_STAGES.map((stg) => {
            const isActive = activeStagePreview === stg.step;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStagePreview(stg.step)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg ring-2 ring-white/50'
                    : 'bg-purple-950/80 text-purple-200 border-purple-800/80 hover:bg-purple-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-mono font-bold ${isActive ? 'text-slate-950' : 'text-amber-300'}`}>
                      Stage {stg.step}
                    </span>
                    <span className={`text-[8px] font-bold px-1 rounded ${isActive ? 'bg-slate-950 text-white' : 'bg-purple-900 text-purple-300'}`}>
                      {stg.sla}
                    </span>
                  </div>
                  <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${isActive ? 'text-slate-950' : 'text-white'}`}>
                    {stg.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        {(() => {
          const cur = MEDIUM_COMMITTEE_FLOW_STAGES.find(s => s.step === activeStagePreview) || MEDIUM_COMMITTEE_FLOW_STAGES[0];
          return (
            <div className="bg-slate-900/90 border border-purple-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-800/50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    {cur.step}
                  </span>
                  <div>
                    <h6 className="text-xs font-black text-white">{cur.title} — {cur.subtitle}</h6>
                    <span className="text-[10px] text-purple-300">Lead Responsible: {cur.leadActor}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-amber-300">
                  {cur.statutoryNote}
                </span>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                {cur.desc}
              </p>
            </div>
          );
        })()}

      </div>

    </div>
  );
}

/**
 * Interactive Form Studio for Level 3: Full ICC Committee (Large / Serious Issues) - Page 3 of Order
 */
export function Level3CommitteeFlowStudio({
  matterType,
  setMatterType,
  domainType,
  setDomainType,
  department,
  setDepartment,
  specialDomain,
  setSpecialDomain,
  involvesStudents,
  setInvolvesStudents
}) {
  const [activeStagePreview, setActiveStagePreview] = useState(1);
  const members = getLevel3CommitteeMembers({ 
    matterType, 
    domainType, 
    department, 
    specialDomain, 
    involvesStudents 
  });

  return (
    <div className="bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 text-white rounded-3xl p-4 sm:p-6 border-2 border-amber-400/70 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Official Order Citation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400/70 flex items-center justify-center text-amber-300 shadow-inner">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                Official Office Order • Clause 3
              </span>
              <span className="text-[11px] font-mono text-purple-200">
                Full Committee Mechanism (Dated 11.08.2026)
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              3. ICC Committee (Large/Serious Issues) Flow Studio
            </h4>
            <p className="text-xs text-purple-200/90">
              Major, sensitive, or complex complaints requiring comprehensive in-camera tribunal inquiry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-purple-900/80 px-3.5 py-2 rounded-xl border border-amber-400/50">
          <Gavel className="w-4 h-4 text-amber-300" />
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">Appointing & Approving</span>
            <span className="text-[11px] font-black text-amber-300">Chairperson (Director)</span>
          </div>
        </div>
      </div>

      {/* Official Order Mandate Excerpt from Page 3 */}
      <div className="bg-purple-900/50 border border-amber-400/40 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-100 leading-relaxed">
          <strong className="text-amber-300 block mb-0.5 font-bold">Official Mandate (Clause 3 of Office Order):</strong>
          <em>"The Full ICC Committee shall deal with major, sensitive or complex complaints requiring detailed inquiry. The Committee shall conduct a comprehensive inquiry and submit findings and recommendations to the Chairperson (Director) for appropriate action."</em>
        </div>
      </div>

      {/* Dynamic 5-Parameter Configurator Grid */}
      <div className="bg-slate-900/90 border border-purple-700/60 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Parametric Constitution for Full ICC Quorum (Clauses i to ix)
          </span>
          <span className="text-[11px] text-purple-300 font-bold">
            Total Members: {members.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* 1. Student Matter vs Staff Matter (Clause ii) */}
          <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              ii. Target Category:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setMatterType('STUDENT')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STUDENT'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setMatterType('STAFF')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matterType === 'STAFF'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                💼 Staff
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {matterType === 'STUDENT' ? '➔ Dean, Student Welfare' : '➔ EBS Coordinator'}
            </p>
          </div>

          {/* 2. Academic Matter vs Administrative Matter (Clause iii) */}
          <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              iii. Domain Sphere:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setDomainType('ACADEMIC')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ACADEMIC'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                📚 Academic
              </button>
              <button
                type="button"
                onClick={() => setDomainType('ADMINISTRATIVE')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  domainType === 'ADMINISTRATIVE'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                🏢 Admin/Staff
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {domainType === 'ACADEMIC' ? '➔ Dean Academics' : '➔ Administrative Officer'}
            </p>
          </div>

          {/* 3. Respective Department HoD (Clause iv) */}
          <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              iv. Respective Dept HoD:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-purple-900 text-white border border-purple-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {DEPARTMENTS_LIST.map(d => (
                <option key={d.code} value={d.code}>
                  {d.code} - {d.hod}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-purple-300 truncate">
              ➔ HoD of {department} Dept
            </p>
          </div>

          {/* 4. Special Domain: Sports vs Mess (Clause v) */}
          <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              v. Sports / Mess Matters:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSpecialDomain('SPORTS')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  specialDomain === 'SPORTS'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                ⚽ Sports
              </button>
              <button
                type="button"
                onClick={() => setSpecialDomain('MESS')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  specialDomain === 'MESS'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                🍲 Mess
              </button>
            </div>
            <p className="text-[10px] text-purple-300 truncate">
              {specialDomain === 'SPORTS' ? '➔ Dr. Ramana Reddy' : '➔ Chief Mess Coordinator'}
            </p>
          </div>

          {/* 5. Involves Students Toggle (Clause ix) */}
          <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800 space-y-2">
            <label className="text-[11px] font-bold text-purple-200 block">
              ix. Student Purview:
            </label>
            <button
              type="button"
              onClick={() => setInvolvesStudents(!involvesStudents)}
              className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                involvesStudents
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-purple-900/60 text-purple-300'
              }`}
            >
              {involvesStudents ? '🎓 Involves Students (Active)' : '🚫 Faculty/Staff Only'}
            </button>
            <p className="text-[10px] text-purple-300 truncate">
              {involvesStudents ? '➔ 3 Student Reps Appointed' : '➔ Student Reps Excluded'}
            </p>
          </div>

        </div>
      </div>

      {/* Full ICC Statutory Bench Roster Grid (Clauses i to ix) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-300" />
            <h5 className="text-xs font-black uppercase tracking-wider text-white">
              Full ICC Committee Bench Composition (Clauses i to ix)
            </h5>
          </div>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black">
            {members.length} Statutory Quorum Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map((m) => (
            <div 
              key={m.idx}
              className="bg-slate-900/90 rounded-2xl p-3.5 border border-purple-700/60 hover:border-amber-400/80 transition-all shadow-md flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.bgGradient} flex items-center justify-center text-lg shrink-0 shadow-inner border border-white/20`}>
                {m.avatarEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950 text-amber-300 border border-purple-800">
                    Clause 3({m.idx})
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-800 text-purple-200">
                    {m.badge}
                  </span>
                </div>
                <div className="text-xs font-black text-white truncate" title={m.name}>
                  {m.name}
                </div>
                <div className="text-[10px] text-amber-200/90 font-semibold truncate" title={m.slot}>
                  {m.slot}
                </div>
                <div className="text-[9px] text-purple-300 truncate mt-0.5">
                  {m.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Stage Comprehensive Serious Inquiry Pipeline */}
      <div className="space-y-3 pt-2 border-t border-purple-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <h5 className="text-xs font-black uppercase tracking-wider text-white">
              Comprehensive Inquiry & Appropriate Orders Pipeline (Clause 3 Mandate)
            </h5>
          </div>
          <span className="text-[10px] text-amber-300 font-bold">
            Target SLA: 7 Days Comprehensive
          </span>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {LEVEL3_COMMITTEE_FLOW_STAGES.map((stg) => {
            const isActive = activeStagePreview === stg.step;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStagePreview(stg.step)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg ring-2 ring-white/50'
                    : 'bg-purple-950/80 text-purple-200 border-purple-800/80 hover:bg-purple-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-mono font-bold ${isActive ? 'text-slate-950' : 'text-amber-300'}`}>
                      Stage {stg.step}
                    </span>
                    <span className={`text-[8px] font-bold px-1 rounded ${isActive ? 'bg-slate-950 text-white' : 'bg-purple-900 text-purple-300'}`}>
                      {stg.sla}
                    </span>
                  </div>
                  <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${isActive ? 'text-slate-950' : 'text-white'}`}>
                    {stg.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        {(() => {
          const cur = LEVEL3_COMMITTEE_FLOW_STAGES.find(s => s.step === activeStagePreview) || LEVEL3_COMMITTEE_FLOW_STAGES[0];
          return (
            <div className="bg-slate-900/95 border border-amber-400/60 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-800/50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    {cur.step}
                  </span>
                  <div>
                    <h6 className="text-xs font-black text-white">{cur.title} — {cur.subtitle}</h6>
                    <span className="text-[10px] text-purple-300">Lead Responsible: {cur.leadActor}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-amber-300">
                  {cur.statutoryNote}
                </span>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                {cur.desc}
              </p>
            </div>
          );
        })()}

      </div>

    </div>
  );
}

/**
 * Detailed Modal to inspect the ICC Committee Flow & Live Docket on an active ticket (Supports Level 2 and Level 3!)
 */
export function MediumCommitteeFlowModal({
  isOpen,
  onClose,
  ticket,
  currentUser,
  currentRole,
  onSendThreadMessage,
  onApproveDisposal,
  onAllocateCommittee
}) {
  const isDecidingInitial = ticket && (!ticket.allocatedCommittee || ticket.triCommitteeStatus === 'DECIDING');
  const [activeTab, setActiveTab] = useState(isDecidingInitial ? 'TRI_COMMITTEE' : 'FLOW'); // 'TRI_COMMITTEE' | 'FLOW' | 'BENCH' | 'EVIDENCE' | 'DISPOSAL' | 'THREAD'
  const [statementText, setStatementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disposalDecision, setDisposalDecision] = useState('APPROVED_WITH_RECOMMENDED_ACTION');
  const [directorDisposalNote, setDirectorDisposalNote] = useState('');
  
  // Tri-Committee Deliberation & Jurisdiction Allocation state
  const [selectedCommitteeTier, setSelectedCommitteeTier] = useState(
    (ticket && (ticket.allocatedCommittee || ticket.committeeLevel)) || 'Level 2: Medium Committee (6 Members)'
  );
  const [allocationRationale, setAllocationRationale] = useState(
    (ticket && ticket.committeeDecision && ticket.committeeDecision.rationale) || ''
  );
  const [isAllocating, setIsAllocating] = useState(false);
  const [showReallocationForm, setShowReallocationForm] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleConfirmAllocation = async (e) => {
    if (e) e.preventDefault();
    if (!onAllocateCommittee) return;
    setIsAllocating(true);
    try {
      await onAllocateCommittee(
        ticket.id, 
        selectedCommitteeTier, 
        allocationRationale.trim() || `Deliberated and allocated to ${selectedCommitteeTier} by Joint Tri-Committee Bench.`
      );
      setShowReallocationForm(false);
      setActiveTab('FLOW');
    } finally {
      setIsAllocating(false);
    }
  };

  const isLevel1 = ticket.committeeLevel && (
    ticket.committeeLevel.includes('Level 1') || 
    ticket.committeeLevel.includes('Small') || 
    ticket.committeeLevel.includes('3 Members') ||
    ticket.committeeLevel.includes('3Members')
  );

  const isLevel3 = ticket.committeeLevel && (
    ticket.committeeLevel.includes('Level 3') || 
    ticket.committeeLevel.includes('Large') || 
    ticket.committeeLevel.includes('Full')
  );

  const committeeTitle = isLevel1
    ? '1. Small Committee (3 Members)'
    : isLevel3 
      ? '3. ICC Committee (Large/Serious Issues)' 
      : '2. Medium Committee (6 Members)';

  // Resolve members if attached or compute dynamically
  const members = ticket.smallCommitteeMembers || ticket.mediumCommitteeMembers || ticket.level3CommitteeMembers || (
    isLevel1 ? getSmallCommitteeMembers({
      matterType: ticket.matterType || 'STUDENT',
      domainType: ticket.domainType || 'ACADEMIC'
    }) : isLevel3 ? getLevel3CommitteeMembers({
      matterType: ticket.matterType || 'STUDENT',
      domainType: ticket.domainType || 'ACADEMIC',
      department: ticket.concernedDept || 'CSE',
      specialDomain: ticket.specialDomain || 'SPORTS',
      involvesStudents: ticket.involvesStudents !== false
    }) : getMediumCommitteeMembers({
      matterType: ticket.matterType || 'STUDENT',
      domainType: ticket.domainType || 'ADMINISTRATIVE',
      department: ticket.concernedDept || 'CSE',
      specialDomain: ticket.specialDomain || 'MESS'
    })
  );

  const flowStages = isLevel1 ? SMALL_COMMITTEE_FLOW_STAGES : (isLevel3 ? LEVEL3_COMMITTEE_FLOW_STAGES : MEDIUM_COMMITTEE_FLOW_STAGES);

  const handleSendStatement = async (e) => {
    if (e) e.preventDefault();
    if (!statementText.trim()) return;
    setIsSubmitting(true);
    try {
      await onSendThreadMessage(ticket.id, statementText.trim());
      setStatementText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteDisposal = async () => {
    if (!onApproveDisposal) return;
    setIsSubmitting(true);
    try {
      await onApproveDisposal(ticket.id, {
        decision: disposalDecision,
        note: directorDisposalNote.trim() || 'Inquiry findings examined and approved for executive implementation under Office Order dated 11.08.2026.'
      });
      setDirectorDisposalNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portal-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="portal-modal-drawer bg-[#111319] text-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-white/[0.08] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Mobile Swipe Indicator Pill */}
        <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto my-2.5 md:hidden shrink-0 cursor-grab" />
        
        {/* Official Header with RGUKT RK Valley Seal */}
        <div className="p-4 sm:p-5 bg-[#0D2821] border-b border-[#0F382E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  RGUKT RK Valley • Office Order
                </span>
                <span className="text-[10px] font-mono text-purple-200">
                  Ref: Note approved by Director dated 03.08.2026, dated 11.08.2026
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Internal Complaints Committee — {committeeTitle}
              </h3>
              <p className="text-xs text-purple-300">
                Ticket: <span className="font-mono font-bold text-amber-300">{ticket.ticketNumber}</span> • Chairperson: <strong className="text-white">The Director, RGUKT RK Valley</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-purple-300 hover:text-white hover:cyber-card/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-purple-950/60 px-4 border-b border-purple-800/60 flex items-center gap-2 overflow-x-auto text-xs shrink-0 py-2">
          {[
            { id: 'TRI_COMMITTEE', label: '0. Tri-Committee Dispatch & Allocation Bench', icon: Scale },
            { id: 'FLOW', label: '1. Chronological Inquiry Flow', icon: Clock },
            { id: 'BENCH', label: `2. Statutory Quorum (${members.length} Members)`, icon: Users },
            { id: 'EVIDENCE', label: '3. Evidentiary & Hearing Record', icon: FileText },
            { id: 'DISPOSAL', label: '4. Chairperson Executive Sign-Off', icon: Gavel },
            { id: 'THREAD', label: '5. Confidential Statement Stream', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSel
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-purple-200 hover:bg-purple-900/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Ticket Summary Quick Strip */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-900 text-amber-300 border border-purple-700">
                  {ticket.grievanceNature || 'Anti-Ragging & Harassment (POSH)'}
                </span>
                <span className="text-xs text-purple-300">📍 {ticket.location}</span>
                {ticket.isConfidential && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Confidential Docket
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {ticket.allocatedCommittee ? `Solved by: ${ticket.allocatedCommittee.split(':')[0]}` : (ticket.triCommitteeStatus === 'DECIDING' ? '⚡ Tri-Committee Review Active' : committeeTitle)}
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{ticket.title}</h4>
              <p className="text-xs text-purple-200/80 mt-0.5">{ticket.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-purple-300 block">Status</span>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">{ticket.status}</span>
              </div>
              <div className="w-px h-8 bg-purple-800/60" />
              <div className="text-right">
                <span className="text-[10px] text-purple-300 block">Presiding Officer</span>
                <span className="text-xs font-black text-white">Dr. Ratnakumari Challa</span>
              </div>
            </div>
          </div>

          {/* TAB 0: TRI-COMMITTEE SIMULTANEOUS DISPATCH & ALLOCATION BENCH */}
          {activeTab === 'TRI_COMMITTEE' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Order Citation Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-700/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                      Statutory Tri-Committee Simultaneous Dispatch Protocol
                    </span>
                    <h4 className="text-sm font-black text-white">
                      Office Order: RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee
                    </h4>
                    <p className="text-[11px] text-purple-200">
                      Dated 11.08.2026 • Ref: Note approved by Director dated 03.08.2026
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/40 text-right self-start sm:self-auto">
                  <span className="text-[10px] text-amber-300 font-bold block">Chairperson for All 3 Tiers</span>
                  <span className="text-xs font-black text-white">The Director, RGUKT RK Valley</span>
                </div>
              </div>

              {/* Explanatory Notice */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-black text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>MANDATORY PROTOCOL: SIMULTANEOUS DISPATCH TO ALL THREE COMMITTEES</span>
                </div>
                <p className="text-xs font-bold leading-relaxed pl-6">
                  "When this complaint was lodged, it was simultaneously dispatched to all three statutory committees at once (Small Committee, Medium Committee, and Full ICC Committee). The three committees jointly evaluate the problem and decide which committee will take jurisdiction to investigate and solve it."
                </p>
              </div>

              {/* Three Committees Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Small Committee */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  (ticket.allocatedCommittee && ticket.allocatedCommittee.includes('Small'))
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                    : 'bg-slate-950/80 border-purple-800/60'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        Clause 1 of Order
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ Dispatched
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-white">1. Small Committee</h5>
                    <span className="text-[11px] font-bold text-emerald-300 block">3 Members Bench</span>
                    <p className="text-[11px] text-purple-200/90 leading-tight">
                      Deals with minor complaints raised by students, faculty and staff. Examines complaint and resolves with approval of Chairperson (Director).
                    </p>
                    <div className="pt-2 border-t border-purple-800/40 space-y-1 text-[10px] text-purple-200">
                      <div className="font-semibold text-white">• Dr. Ratnakumari Challa (Presiding Officer)</div>
                      <div className="font-semibold text-white">• Dean Student Welfare (Prof. B. Ravi) / EBS</div>
                      <div className="font-semibold text-white">• Dean Academics (Prof. N. Srinivas) / AO</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-800/40 flex items-center justify-between text-[10px]">
                    <span className="text-purple-300 font-bold">Fast-Track Redressal</span>
                    <span className="font-bold text-amber-300">Target: &lt; 72 Hours</span>
                  </div>
                </div>

                {/* 2. Medium Committee */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  (ticket.allocatedCommittee && ticket.allocatedCommittee.includes('Medium'))
                    ? 'bg-purple-950/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-950/80 border-purple-800/60'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-700">
                        Clause 2 of Order
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ Dispatched
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-white">2. Medium Committee</h5>
                    <span className="text-[11px] font-bold text-amber-300 block">6 Members Bench</span>
                    <p className="text-[11px] text-purple-200/90 leading-tight">
                      Complaints of moderate seriousness involving students, faculty or staff. Conducts inquiry, recommends action, and disposes with Chairperson approval.
                    </p>
                    <div className="pt-2 border-t border-purple-800/40 space-y-1 text-[10px] text-purple-200">
                      <div className="font-semibold text-white">• Presiding Officer & DSW / EBS</div>
                      <div className="font-semibold text-white">• Dean Academics / AO & HoD of Dept</div>
                      <div className="font-semibold text-white">• Special Domain (Mess/Sports/Proctor) & Dr. Suvarna</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-800/40 flex items-center justify-between text-[10px]">
                    <span className="text-purple-300 font-bold">Quasi-Judicial Bench</span>
                    <span className="font-bold text-amber-300">Target: &lt; 48 Hours</span>
                  </div>
                </div>

                {/* 3. Full ICC Committee */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  (ticket.allocatedCommittee && (ticket.allocatedCommittee.includes('Level 3') || ticket.allocatedCommittee.includes('Full') || ticket.allocatedCommittee.includes('Large')))
                    ? 'bg-indigo-950/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-950/80 border-purple-800/60'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                        Clause 3 of Order
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ Dispatched
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-white">3. Full ICC Committee</h5>
                    <span className="text-[11px] font-bold text-rose-300 block">Large / Serious Issues</span>
                    <p className="text-[11px] text-purple-200/90 leading-tight">
                      Major, sensitive or complex complaints requiring comprehensive in-camera tribunal inquiry and recommendations to Chairperson (Director).
                    </p>
                    <div className="pt-2 border-t border-purple-800/40 space-y-1 text-[10px] text-purple-200">
                      <div className="font-semibold text-white">• Presiding Officer & Statutory Faculty</div>
                      <div className="font-semibold text-white">• SI RK Valley Police Station (Clause vii)</div>
                      <div className="font-semibold text-white">• Advocate Neelima (Legal Specialist) & Students</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-800/40 flex items-center justify-between text-[10px]">
                    <span className="text-purple-300 font-bold">Full Statutory Bench</span>
                    <span className="font-bold text-amber-300">Target: &lt; 24h Emergency</span>
                  </div>
                </div>
              </div>

              {/* Deliberation & Jurisdiction Decision Control */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border-2 border-purple-700/80 space-y-4">
                {ticket.allocatedCommittee && !showReallocationForm ? (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                            Tri-Committee Jurisdiction Decision Promulgated
                          </span>
                          <h5 className="text-sm font-black text-white">
                            Assigned to: {ticket.allocatedCommittee}
                          </h5>
                          <p className="text-xs text-emerald-200 mt-0.5">
                            Decided by: <strong>{ticket.committeeDecision?.decidedBy || 'Joint Tri-Committee Bench'}</strong> • {ticket.committeeDecision?.decidedAt ? new Date(ticket.committeeDecision.decidedAt).toLocaleString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setShowReallocationForm(true)}
                          className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600 text-xs font-bold transition-all cursor-pointer"
                        >
                          Re-deliberate / Re-allocate
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('FLOW')}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Open Assigned Inquiry Flow</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {ticket.committeeDecision?.rationale && (
                      <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/60 text-xs text-purple-200">
                        <span className="font-bold text-amber-300 block mb-0.5">Bench Deliberation Rationale:</span>
                        "{ticket.committeeDecision.rationale}"
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleConfirmAllocation} className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-amber-400" />
                        <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
                          {ticket.allocatedCommittee ? 'Re-Deliberate & Re-Allocate Committee' : 'Tri-Committee Deliberation: Decide Which Committee Will Solve It'}
                        </h5>
                      </div>
                      <span className="text-[10px] text-purple-300 font-semibold">
                        Empowered under Office Order dated 11.08.2026
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-2">
                        Select Committee to Take Jurisdiction & Solve Problem:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'Level 1: Small Committee (3 Members)',
                            name: '1. Small Committee',
                            members: '3 Members',
                            desc: 'Minor grievance / informal examination & conciliation.'
                          },
                          {
                            id: 'Level 2: Medium Committee (6 Members)',
                            name: '2. Medium Committee',
                            members: '6 Members',
                            desc: 'Moderate seriousness / quasi-judicial inquiry bench.'
                          },
                          {
                            id: 'Level 3: ICC Committee (Large/Serious Issues)',
                            name: '3. Full ICC Committee',
                            members: 'Large/Serious Issues',
                            desc: 'Major / sensitive grievance / in-camera tribunal.'
                          }
                        ].map(opt => {
                          const isSel = selectedCommitteeTier === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedCommitteeTier(opt.id)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSel
                                  ? 'bg-purple-950 border-amber-400 ring-2 ring-amber-400/50 text-white shadow-md'
                                  : 'bg-slate-900 border-purple-800/60 text-purple-200 hover:border-purple-600'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs font-black ${isSel ? 'text-amber-300' : 'text-white'}`}>{opt.name}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSel ? 'bg-amber-400 text-slate-950 font-black' : 'bg-purple-900 text-purple-300'}`}>
                                    {opt.members}
                                  </span>
                                </div>
                                <p className="text-[10px] leading-tight text-purple-200">{opt.desc}</p>
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-purple-800/40 text-[9px] font-bold text-amber-300">
                                {isSel ? '● Selected for Jurisdiction' : 'Click to select'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Deliberation Note & Allocation Rationale:
                      </label>
                      <textarea
                        rows={2}
                        value={allocationRationale}
                        onChange={(e) => setAllocationRationale(e.target.value)}
                        placeholder="Enter the joint bench decision rationale explaining why this committee is designated to solve this case..."
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-purple-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      {showReallocationForm && (
                        <button
                          type="button"
                          onClick={() => setShowReallocationForm(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isAllocating || !selectedCommitteeTier}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 ml-auto"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>{isAllocating ? 'Promulgating Decision...' : 'Promulgate Tri-Committee Decision & Assign Committee'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: INQUIRY FLOW */}
          {activeTab === 'FLOW' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Chronological Progression of {committeeTitle} Inquiry
                </h5>
                <span className="text-xs text-purple-300 font-bold">
                  Statutory Resolution SLA: 7 Days
                </span>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-purple-800/60">
                {flowStages.map((stg, i) => {
                  const isPast = ticket.status === 'CLOSED' || (ticket.status === 'RESOLVED' && stg.step <= 5) || (ticket.status === 'IN_PROGRESS' && stg.step <= 4) || (stg.step <= 2);
                  const isCurrent = (ticket.status === 'IN_PROGRESS' && stg.step === 4) || (ticket.status === 'SUBMITTED' && stg.step === 1) || (ticket.status === 'RESOLVED' && stg.step === 5);

                  return (
                    <div 
                      key={stg.step}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'bg-purple-950/80 border-amber-400 ring-1 ring-amber-400/50 shadow-lg' 
                          : isPast 
                            ? 'bg-slate-950/60 border-purple-800/60' 
                            : 'bg-slate-950/30 border-purple-900/40 opacity-70'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 z-10 ${
                        isCurrent 
                          ? 'bg-amber-400 text-slate-950 shadow-md ring-4 ring-amber-400/20' 
                          : isPast 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-purple-950 text-purple-400 border border-purple-800'
                      }`}>
                        {isPast && !isCurrent ? <Check className="w-5 h-5" /> : stg.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{stg.title}</span>
                            <span className="text-[10px] text-purple-300 font-semibold">• {stg.subtitle}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCurrent ? 'bg-amber-400 text-slate-950 font-black' : isPast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-900/40 text-purple-400'
                          }`}>
                            {isCurrent ? '⚡ Active In-Progress' : isPast ? '✓ Completed' : 'Pending Step'}
                          </span>
                        </div>
                        <p className="text-xs text-purple-100/90 leading-relaxed mb-1.5">{stg.desc}</p>
                        <div className="flex items-center gap-4 text-[10px] text-purple-300">
                          <span>Responsible: <strong className="text-white">{stg.leadActor}</strong></span>
                          <span>Timeline: <strong className="text-amber-300">{stg.sla}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY BENCH */}
          {activeTab === 'BENCH' && (
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-800/80 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Statutory Bench for {committeeTitle} ({members.length} Members)
                  </h5>
                  <p className="text-xs text-purple-200">
                    Appointed pursuant to Office Order Ref: RGUKT/RKV/Committee/ Reconstitution/ICC dated 11.08.2026.
                  </p>
                </div>
                <span className="text-xs font-black text-amber-300 bg-purple-900 px-3 py-1 rounded-xl border border-purple-700">
                  Approved by Director
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {members.map((m) => (
                  <div 
                    key={m.idx}
                    className="bg-slate-950/90 p-4 rounded-2xl border border-purple-800/80 hover:border-amber-400 transition-all shadow-md flex items-start gap-3.5"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.bgGradient} flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/20`}>
                      {m.avatarEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-xs font-black text-amber-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                          Clause ({m.idx})
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-200">
                          {m.badge}
                        </span>
                      </div>
                      <div className="text-sm font-black text-white truncate" title={m.name}>
                        {m.name}
                      </div>
                      <div className="text-xs text-amber-200 font-semibold truncate" title={m.slot}>
                        {m.slot}
                      </div>
                      <div className="text-[11px] text-purple-300 truncate mt-1">
                        Role: {m.type}
                      </div>
                      <div className="mt-2 pt-2 border-t border-purple-900/60 flex items-center justify-between text-[10px] text-purple-400">
                        <span>Attendance: Verified</span>
                        <span className="text-emerald-400 font-bold">● Quorum Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chairperson Box */}
              <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-4 rounded-2xl border-2 border-amber-400/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      Chairperson For All Three Levels
                    </span>
                    <h5 className="text-sm font-black text-white">The Director, RGUKT RK Valley</h5>
                    <p className="text-xs text-purple-200">Sole Appointing & Final Executive Disposal Approving Authority</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-purple-300 block">Statutory Role</span>
                  <span className="text-xs font-black text-amber-300">Executive Assent</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENTIARY & HEARING RECORD */}
          {activeTab === 'EVIDENCE' && (
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-800/80">
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Confidential Quasi-Judicial Proceedings Record
                </h5>
                <p className="text-xs text-purple-200">
                  In-camera hearing transcripts, summons acknowledgments, and physical exhibits cataloged by the Presiding Officer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Summons Status</span>
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Served to All Parties
                  </div>
                  <p className="text-[10px] text-purple-300">Delivered via official university email and physical summons.</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Witness Depositions</span>
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {isLevel3 ? '5 Depositions Recorded' : '3 Statements Recorded'}
                  </div>
                  <p className="text-[10px] text-purple-300">Deposition transcripts sealed in ICC vault under Office Order rules.</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Protective Orders</span>
                  <div className="text-xs font-black text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Protective Injunction Active
                  </div>
                  <p className="text-[10px] text-purple-300">Anti-retaliation injunction enforced across campus & hostels.</p>
                </div>
              </div>

              {/* Initial Photo / Defect Evidence */}
              {ticket.photos && ticket.photos.length > 0 && (
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-purple-800/60 space-y-2">
                  <h6 className="text-xs font-black text-white">Photographic / Material Evidence Catalog:</h6>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {ticket.photos.map((p, idx) => (
                      <img 
                        key={idx} 
                        src={p} 
                        alt="Evidence" 
                        className="w-24 h-24 object-cover rounded-xl border-2 border-purple-700 cursor-pointer hover:opacity-80"
                        onClick={() => window.open(p, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CHAIRPERSON EXECUTIVE SIGN-OFF */}
          {activeTab === 'DISPOSAL' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-4 rounded-2xl border-2 border-amber-400/80 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/80">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-amber-300" />
                    <div>
                      <h5 className="text-sm font-black text-white">
                        Chairperson Executive Review & Appropriate Orders
                      </h5>
                      <p className="text-xs text-purple-200">
                        Order Mandate: <em>"The recommendations of the respective Committee shall be placed before the Chairperson (Director) for consideration and appropriate orders."</em>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    Statutory Assent
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                      Statutory Disposal Decision:
                    </label>
                    <select
                      value={disposalDecision}
                      onChange={(e) => setDisposalDecision(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-purple-900/90 text-white border border-purple-700 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {isLevel1 ? (
                        <>
                          <option value="APPROVED_CONCILIATION_RESOLUTION">
                            ✓ Approved: Sanction Small Committee Amicable Settlement & Actions
                          </option>
                          <option value="APPROVED_WITH_ADMIN_REMEDY">
                            ⚖️ Approved: Authorize Administrative / Departmental Remediation
                          </option>
                          <option value="ESCALATE_TO_MEDIUM_COMMITTEE">
                            🔄 Escalate: Re-route to Level 2: Medium Committee (6 Members)
                          </option>
                          <option value="DISMISSED_UNFOUNDED">
                            ✓ Disposed: Informally Settled & Documented
                          </option>
                        </>
                      ) : isLevel3 ? (
                        <>
                          <option value="APPROVED_WITH_RECOMMENDED_ACTION">
                            ✓ Approved: Implement Full ICC Committee Recommendations & Sanctions
                          </option>
                          <option value="APPROVED_WITH_ADDITIONAL_DIRECTIVES">
                            ⚖️ Approved with Additional Director Directives & Disciplinary Action
                          </option>
                          <option value="REFERRED_FOR_LEGAL_ENFORCEMENT">
                            👮 Refer to Law Enforcement & Advocate for External Legal Action
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="APPROVED_WITH_RECOMMENDED_ACTION">
                            ✓ Approved: Implement 6-Member Medium Committee Recommended Action
                          </option>
                          <option value="APPROVED_WITH_ADMIN_REMEDY">
                            ⚖️ Approved with Additional Departmental Directives
                          </option>
                          <option value="ESCALATE_TO_FULL_ICC">
                            🏛️ Escalate to Level 3: Full ICC Committee (Large Issues)
                          </option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                      Director Executive Disposal Minute / Directive Note:
                    </label>
                    <textarea
                      rows={3}
                      value={directorDisposalNote}
                      onChange={(e) => setDirectorDisposalNote(e.target.value)}
                      placeholder="Enter formal minute of approval or executive directive for university enforcement..."
                      className="w-full p-3 rounded-xl bg-slate-950 text-white border border-purple-800 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-purple-300">
                      Sign-off seals the docket and notifies Complainant, Presiding Officer & Bench Members.
                    </span>
                    <button
                      type="button"
                      onClick={handleExecuteDisposal}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Promulgate Appropriate Orders</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONFIDENTIAL STATEMENT STREAM */}
          {activeTab === 'THREAD' && (
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/80 flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold">🔒 Encrypted Confidential Committee Hearing Stream</span>
                <span className="text-purple-300">Visible to: Complainant, Statutory Bench & Director</span>
              </div>

              {/* Thread Messages */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(ticket.hearingThread || ticket.triPartyThread || []).map((msg) => {
                  const isDirector = msg.senderRole === 'ADMIN';
                  const isCommittee = msg.senderRole === 'STAFF';

                  return (
                    <div 
                      key={msg.id}
                      className={`p-3 rounded-2xl border text-xs ${
                        isDirector 
                          ? 'bg-purple-950/80 border-amber-400/80 text-white ml-6' 
                          : isCommittee 
                            ? 'bg-indigo-950/80 border-indigo-700 text-white ml-3' 
                            : 'bg-slate-950 border-purple-900 text-purple-100 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-amber-300">{msg.senderName}</span>
                        <span className="text-purple-300">{msg.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Statement Input Form */}
              <form onSubmit={handleSendStatement} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Enter official statement, inquiry finding, or response..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 text-white border border-purple-800 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !statementText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-purple-800/80 flex items-center justify-between text-xs text-purple-300">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Statutory Internal Complaints Committee • RGUKT RK Valley</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Docket
          </button>
        </div>

      </div>
    </div>
  );
}

/**
 * Interactive Tri-Committee Allocation Tracker Card
 * Rendered on any ICC complaint ticket.
 * Displays that the complaint was dispatched simultaneously to all three committees,
 * and allows the joint committee bench to decide which committee solves the problem.
 */
export function TriCommitteeAllocationTrackerCard({ 
  ticket, 
  currentUser, 
  onAllocateCommittee, 
  onOpenModal 
}) {
  const [selectedCommittee, setSelectedCommittee] = useState(
    ticket?.allocatedCommittee || ticket?.committeeLevel || 'Level 2: Medium Committee (6 Members)'
  );
  const [rationale, setRationale] = useState(
    ticket?.committeeDecision?.rationale || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReallocate, setShowReallocate] = useState(false);

  if (!ticket) return null;
  const isIcc = ticket.isIcc || ticket.category === 'Internal Complaints Committee (ICC)' || ticket.categoryType === 'ICC';
  if (!isIcc) return null;

  const isDecided = Boolean(ticket.allocatedCommittee) && ticket.triCommitteeStatus === 'DECIDED' && !showReallocate;

  const handleAllocate = async (e) => {
    if (e) e.preventDefault();
    if (!onAllocateCommittee) return;
    setIsSubmitting(true);
    try {
      await onAllocateCommittee(
        ticket.id, 
        selectedCommittee, 
        rationale.trim() || `Allocated to ${selectedCommittee} by Joint Tri-Committee Bench.`
      );
      setShowReallocate(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 rounded-2xl border-2 border-purple-500/80 p-4 sm:p-5 shadow-lg mb-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-700 text-amber-300 flex items-center justify-center font-bold shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                Campus ICC Statutory Tri-Committee Protocol
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-900 text-purple-200 border border-purple-700">
                All 3 Committees Notified
              </span>
            </div>
            <p className="text-[11px] text-purple-200 font-medium">
              Office Order: <strong>RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee</strong> (11.08.2026)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-2xs ${
            isDecided ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-950 animate-pulse'
          }`}>
            {isDecided ? `Assigned: ${ticket.allocatedCommittee.split(':')[0]}` : '⚡ Tri-Committee Deliberation Active'}
          </span>
        </div>
      </div>

      {/* Explanatory Notice */}
      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl text-amber-950 space-y-1">
        <div className="flex items-center gap-2 font-black text-xs">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>SIMULTANEOUS TRI-COMMITTEE DISPATCH NOTICE</span>
        </div>
        <p className="text-xs font-bold leading-relaxed pl-6">
          "This complaint was automatically dispatched to all three statutory committees at once upon lodging. The three committees jointly evaluate the problem and decide which committee will take jurisdiction to investigate and solve it."
        </p>
      </div>

      {/* 3 Committees Dispatched Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Small Committee */}
        <div className={`p-3 rounded-xl border transition-all ${
          (ticket.allocatedCommittee && ticket.allocatedCommittee.includes('Small'))
            ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
            : 'bg-slate-950/60 border-purple-800/60'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-emerald-400">1. Small Committee</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Dispatched
            </span>
          </div>
          <span className="text-[11px] font-bold text-white block">3 Members Bench</span>
          <p className="text-[10px] text-purple-200 mt-0.5 leading-tight">
            Presiding Officer (Dr. Ratnakumari Challa), DSW (Prof. B. Ravi) / EBS, Dean Academics (Prof. N. Srinivas) / AO.
          </p>
          <div className="mt-2 pt-1 border-t border-purple-800/40 text-[9px] font-bold text-purple-300">
            Minor Complaints & Fast Track
          </div>
        </div>

        {/* 2. Medium Committee */}
        <div className={`p-3 rounded-xl border transition-all ${
          (ticket.allocatedCommittee && ticket.allocatedCommittee.includes('Medium'))
            ? 'bg-purple-950/90 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
            : 'bg-slate-950/60 border-purple-800/60'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-amber-400">2. Medium Committee</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Dispatched
            </span>
          </div>
          <span className="text-[11px] font-bold text-white block">6 Members Bench</span>
          <p className="text-[10px] text-purple-200 mt-0.5 leading-tight">
            Presiding Officer, DSW / EBS, Dean Academics / AO, HoD of Dept, Special Domain (Mess/Sports/Proctor), Dr. Suvarna.
          </p>
          <div className="mt-2 pt-1 border-t border-purple-800/40 text-[9px] font-bold text-amber-300">
            Moderate Seriousness & Quasi-Judicial
          </div>
        </div>

        {/* 3. Full ICC Committee */}
        <div className={`p-3 rounded-xl border transition-all ${
          (ticket.allocatedCommittee && (ticket.allocatedCommittee.includes('Level 3') || ticket.allocatedCommittee.includes('Full') || ticket.allocatedCommittee.includes('Large')))
            ? 'bg-indigo-950/90 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
            : 'bg-slate-950/60 border-purple-800/60'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-rose-400">3. Full ICC Committee</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Dispatched
            </span>
          </div>
          <span className="text-[11px] font-bold text-white block">11 Members Full Bench</span>
          <p className="text-[10px] text-purple-200 mt-0.5 leading-tight">
            Presiding Officer & Statutory Faculty, SI RK Valley Police Station, Legal Advocate Neelima & Student Reps.
          </p>
          <div className="mt-2 pt-1 border-t border-purple-800/40 text-[9px] font-bold text-rose-300">
            Major / Sensitive Grievances
          </div>
        </div>
      </div>

      {/* Decision Section */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-800/80 space-y-3">
        {isDecided ? (
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500 rounded-xl flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                    Tri-Committee Jurisdiction Decision Promulgated
                  </span>
                  <h5 className="text-sm font-black text-white">
                    Designated to Solve Problem: <strong className="text-amber-300">{ticket.allocatedCommittee}</strong>
                  </h5>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Decided by: <strong>{ticket.committeeDecision?.decidedBy || 'Joint Tri-Committee Bench'}</strong> • {ticket.committeeDecision?.decidedAt ? new Date(ticket.committeeDecision.decidedAt).toLocaleString() : 'Recent'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowReallocate(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Re-deliberate / Re-allocate
                </button>
                {onOpenModal && (
                  <button
                    type="button"
                    onClick={onOpenModal}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Inspect Allocated Committee Flow & Docket</span>
                  </button>
                )}
              </div>
            </div>
            {ticket.committeeDecision?.rationale && (
              <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/60 text-xs text-purple-200">
                <span className="font-bold text-amber-300 block mb-0.5">Bench Deliberation Rationale:</span>
                "{ticket.committeeDecision.rationale}"
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleAllocate} className="space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                <Gavel className="w-4 h-4 text-amber-400" />
                <span>TRI-COMMITTEE DELIBERATION: DECIDE WHICH COMMITTEE WILL SOLVE IT</span>
              </div>
              <span className="text-[10px] text-purple-300">
                (Joint bench quorum under Office Order dated 11.08.2026)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'Level 1: Small Committee (3 Members)',
                  name: '1. Small Committee',
                  members: '3 Members',
                  desc: 'Minor grievances & fast informal conciliation'
                },
                {
                  id: 'Level 2: Medium Committee (6 Members)',
                  name: '2. Medium Committee',
                  members: '6 Members',
                  desc: 'Moderate seriousness & formal quasi-judicial inquiry'
                },
                {
                  id: 'Level 3: ICC Committee (Large/Serious Issues)',
                  name: '3. Full ICC Committee',
                  members: 'Large/Serious Issues',
                  desc: 'Major / sensitive complaints & in-camera tribunal'
                }
              ].map(opt => {
                const isSel = selectedCommittee === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCommittee(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSel
                        ? 'bg-purple-950 border-amber-400 ring-2 ring-amber-400/50 text-white shadow-md'
                        : 'bg-slate-900 border-purple-800/60 text-purple-200 hover:border-purple-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-black ${isSel ? 'text-amber-300' : 'text-white'}`}>{opt.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isSel ? 'bg-amber-400 text-slate-950 font-black' : 'bg-purple-900 text-purple-300'}`}>
                          {opt.members}
                        </span>
                      </div>
                      <p className="text-[10px] leading-tight text-purple-200">{opt.desc}</p>
                    </div>
                    <div className="mt-2 pt-1 border-t border-purple-800/40 text-[9px] font-bold text-amber-300">
                      {isSel ? '● Selected to Solve' : 'Click to select'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Deliberation Rationale / Justification:
              </label>
              <input
                type="text"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Enter justification explaining why this specific committee is designated to investigate and solve this complaint..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-purple-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              {showReallocate && (
                <button
                  type="button"
                  onClick={() => setShowReallocate(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !selectedCommittee}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 ml-auto"
              >
                <Gavel className="w-4 h-4" />
                <span>{isSubmitting ? 'Promulgating Decision...' : 'Promulgate Tri-Committee Decision & Assign Committee'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Compact Pill Button for ICC Committees (Supports Tri-Committee Allocation status)
 */
export function MediumCommitteeFlowPill({ ticket, onClick }) {
  if (!ticket) return null;

  const isDeciding = !ticket.allocatedCommittee && (!ticket.committeeLevel || ticket.triCommitteeStatus === 'DECIDING' || ticket.sentToAllCommittees);

  const isLevel1 = ticket.committeeLevel && (
    ticket.committeeLevel.includes('Level 1') || 
    ticket.committeeLevel.includes('Small') || 
    ticket.committeeLevel.includes('3 Members') ||
    ticket.committeeLevel.includes('3Members')
  );

  const isLevel3 = ticket.committeeLevel && (
    ticket.committeeLevel.includes('Level 3') || 
    ticket.committeeLevel.includes('Large') || 
    ticket.committeeLevel.includes('Full')
  );

  if (isDeciding) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border shadow-xs hover:scale-102 transition-all cursor-pointer bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 text-amber-300 border-amber-400 hover:border-amber-300 ring-1 ring-amber-400/50"
        title="Dispatched to all 3 committees simultaneously. The committees are deciding which committee solves it."
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <Scale className="w-3 h-3 text-amber-400 shrink-0" />
        <span>⚖️ Tri-Committee: Deciding Allocation</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border shadow-xs hover:scale-102 transition-all cursor-pointer ${
        isLevel3
          ? 'bg-gradient-to-r from-amber-950 via-purple-950 to-indigo-950 text-amber-300 border-amber-400 hover:border-amber-300 ring-1 ring-amber-400/50'
          : isLevel1
            ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-emerald-300 border-emerald-400 hover:border-emerald-300 ring-1 ring-emerald-400/40'
            : 'bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 border-purple-600 hover:border-amber-400'
      }`}
      title={`Solved by ${ticket.allocatedCommittee || ticket.committeeLevel}`}
    >
      <Scale className="w-3 h-3 text-amber-400 shrink-0" />
      <span>
        {isLevel3 
          ? '⚖️ Solved by: Full ICC Bench' 
          : isLevel1 
            ? '⚖️ Solved by: Small Comm (3)' 
            : '⚖️ Solved by: Medium Comm (6)'}
      </span>
    </button>
  );
}

export const IccCommitteeFlowModal = MediumCommitteeFlowModal;
export const Level3CommitteeFlowPill = MediumCommitteeFlowPill;
export const SmallCommitteeFlowPill = MediumCommitteeFlowPill;
export const Level1CommitteeFlowPill = MediumCommitteeFlowPill;
export const IccCommitteeFlowPill = MediumCommitteeFlowPill;

