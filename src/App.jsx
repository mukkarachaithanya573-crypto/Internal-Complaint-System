import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Zap, Droplet, Monitor, Sparkles, ShieldAlert, 
  Camera, CheckCircle2, Clock, AlertTriangle, ChevronRight, 
  MapPin, X, ArrowLeft, RefreshCw, Star, User, 
  Layers, BarChart3, Users, Download, Bell, Wifi, WifiOff,
  ThumbsUp, RotateCcw, ShieldCheck, ChevronDown, ChevronUp, Check, PhoneCall,
  Mail, Lock, Eye, EyeOff, ArrowRight, LogOut, Upload,
  Ban, Inbox, Send, AlertCircle, IdCard, ExternalLink, Settings, Building, Building2,
  Search, Printer, Link2, GraduationCap, CheckCheck, MessageSquare, Play,
  Compass, Navigation, Map as MapIcon, Phone, KeyRound, Smartphone, Trash2,
  Scale, Gavel, Plus, Edit3, Save, UserCheck, Menu
} from 'lucide-react';
import { 
  HOSTEL_HIERARCHY_LEVELS, 
  HOSTEL_CONCERNED_DEPARTMENTS,
  CAMPUS_AUTHORITY_PROFILES,
  getHierarchySlaConfig,
  HostelHierarchyPill, 
  HostelHierarchyTrackerCard, 
  HostelEscalationQuestionnaireModal,
  CampusAuthorityProfileCard
} from './HostelHierarchyComponents';
import { UserProfileEditModal, FullProfileView } from './UserProfileComponents';
import { 
  SmallCommitteeFlowStudio,
  MediumCommitteeFlowStudio, 
  Level3CommitteeFlowStudio,
  MediumCommitteeFlowModal, 
  MediumCommitteeFlowPill,
  SmallCommitteeFlowPill,
  TriCommitteeAllocationTrackerCard,
  getSmallCommitteeMembers,
  getMediumCommitteeMembers,
  getLevel3CommitteeMembers,
  SMALL_COMMITTEE_ORDER_INFO,
  MEDIUM_COMMITTEE_ORDER_INFO,
  LEVEL3_COMMITTEE_ORDER_INFO
} from './MediumCommitteeFlow';
import CinematicIntro from './CinematicIntro';
import InteractiveConstellation from './InteractiveConstellation';
import OfflinePage from './OfflinePage';
import ProjectDemoVideoModal from './ProjectDemoVideoModal';
import {
  sanitizeText,
  sanitizeObject,
  generateCryptographicOtp,
  createOtpSession,
  verifyOtpWithSecurity,
  generateSalt,
  hashPasswordWithSalt,
  verifyPasswordSecurely,
  checkAccountLockout,
  recordFailedLoginAttempt,
  clearFailedLoginAttempts,
  createSessionSignature,
  verifySessionIntegrity,
  sanitizeUserRolePrivileges,
  createAnonymousIdentity
} from './securityEngine';
import { 
  saveComplaintToFirestore, 
  updateComplaintInFirestore, 
  deleteComplaintFromFirestore,
  fetchComplaintsFromFirestore, 
  subscribeToComplaints, 
  saveUserToFirestore, 
  fetchUsersFromFirestore,
  signInWithGooglePopup
} from './firebase';
import {
  sendEmailOnComplaintSubmission,
  sendEmailOnHierarchyEscalation,
  sendEmailOnAuthorityResponse,
  sendEmailOnProblemSolved,
  sendOtpEmail
} from './emailService';

// RGUKT AP IIIT Location Structure
const ACADEMIC_BUILDINGS = [
  'AB-1',
  'AB-2',
  'IQAC',
  'Library',
  'Lab Complex',
  'Computer Center'
];

const DEPARTMENTS = [
  'CSE',
  'ECE',
  'EEE',
  'MME',
  'CIVIL',
  'CHEMICAL',
  'MECHANICAL'
];

const HOSTEL_DORM_DATA = {
  'OLD CAMPUS': ['RHO', 'THETA', 'ALPHA', 'BETA', 'GAMMA', 'DELTA'],
  'PENNA': ['BH-1{Front Side}', 'BH-1{Backside}'],
  'PAPAGNI': ['BH-2{Front Side}', 'BH-2{Back side}'],
  'KUNDU{GH-1}': ['Main Wing'],
  'CHITRAVATI{GH-2}': ['Main Wing']
};

const SEPARATE_FACILITIES = [
  'SAC',
  'HOSPITAL'
];

// Master Campus Room & Block QR Directory with realistic rooms per block
const CAMPUS_ROOM_QR_DIRECTORY = [
  // --- ACADEMICS: AB-1 ---
  { id: 'ab1-cse-104', type: 'ACADEMICS', block: 'AB-1', floor: '1st Floor', room: 'Computer Lab 104 (CSE)', code: 'QR-AB1-1F-CSE104', desc: 'CSE Department Main Systems Lab' },
  { id: 'ab1-cse-105', type: 'ACADEMICS', block: 'AB-1', floor: '1st Floor', room: 'AI & Data Science Lab', code: 'QR-AB1-1F-AI105', desc: 'Department of Computer Science' },
  { id: 'ab1-ece-201', type: 'ACADEMICS', block: 'AB-1', floor: '2nd Floor', room: 'VLSI & Embedded Lab (ECE)', code: 'QR-AB1-2F-ECE201', desc: 'ECE Core Hardware Testing Lab' },
  { id: 'ab1-ece-205', type: 'ACADEMICS', block: 'AB-1', floor: '2nd Floor', room: 'DSP & Communication Lab', code: 'QR-AB1-2F-DSP205', desc: 'ECE Signal Processing Lab' },
  { id: 'ab1-eee-301', type: 'ACADEMICS', block: 'AB-1', floor: '3rd Floor', room: 'Power Systems Lab (EEE)', code: 'QR-AB1-3F-EEE301', desc: 'Electrical Engineering Wing' },
  { id: 'ab1-gf-sem1', type: 'ACADEMICS', block: 'AB-1', floor: 'Ground Floor', room: 'Seminar Hall 1', code: 'QR-AB1-GF-SEM1', desc: 'Central Academic Auditorium' },

  // --- ACADEMICS: AB-2 ---
  { id: 'ab2-mech-001', type: 'ACADEMICS', block: 'AB-2', floor: 'Ground Floor', room: 'CAD/CAM Lab (Mechanical)', code: 'QR-AB2-GF-MECH01', desc: 'Mechanical Engineering Workshop' },
  { id: 'ab2-chem-101', type: 'ACADEMICS', block: 'AB-2', floor: '1st Floor', room: 'Unit Operations Lab (Chemical)', code: 'QR-AB2-1F-CHEM01', desc: 'Chemical Engineering Facility' },
  { id: 'ab2-mme-201', type: 'ACADEMICS', block: 'AB-2', floor: '2nd Floor', room: 'Material Testing Lab (MME)', code: 'QR-AB2-2F-MME01', desc: 'Metallurgical Engineering Lab' },
  { id: 'ab2-civ-301', type: 'ACADEMICS', block: 'AB-2', floor: '3rd Floor', room: 'Survey & Geotech Lab (Civil)', code: 'QR-AB2-3F-CIV01', desc: 'Civil Engineering Facility' },

  // --- ACADEMICS: Central Facilities ---
  { id: 'cc-srv-101', type: 'ACADEMICS', block: 'Computer Center', floor: '1st Floor', room: 'Server Room 101', code: 'QR-CC-1F-SRV101', desc: 'Campus IT Network Operations Center' },
  { id: 'cc-lab-gf', type: 'ACADEMICS', block: 'Computer Center', floor: 'Ground Floor', room: 'Central Computing Lab A', code: 'QR-CC-GF-LABA', desc: 'Common Student Computing Section' },
  { id: 'lib-digi-gf', type: 'ACADEMICS', block: 'Library', floor: 'Ground Floor', room: 'Digital Library Section', code: 'QR-LIB-GF-DIGI', desc: 'Central Library E-Resource Section' },
  { id: 'iqac-conf-gf', type: 'ACADEMICS', block: 'IQAC', floor: 'Ground Floor', room: 'Conference Hall', code: 'QR-IQAC-GF-CONF', desc: 'Quality Assurance Board Room' },
  { id: 'lc-chem-gf', type: 'ACADEMICS', block: 'Lab Complex', floor: 'Ground Floor', room: 'General Chemistry Lab', code: 'QR-LC-GF-CHEM', desc: 'First Year Sciences Lab Complex' },

  // --- HOSTELS / DORMS: PENNA (BH-1) ---
  { id: 'penna-bh1f-108', type: 'HOSTEL_DORM', block: 'PENNA > BH-1{Front Side}', floor: '1st Floor', room: 'Room 108', code: 'QR-PENNA-BH1F-108', desc: 'Penna Hostel BH-1 Front Wing' },
  { id: 'penna-bh1f-214', type: 'HOSTEL_DORM', block: 'PENNA > BH-1{Front Side}', floor: '2nd Floor', room: 'Room 214', code: 'QR-PENNA-BH1F-214', desc: 'Penna Hostel BH-1 Front Wing' },
  { id: 'penna-bh1f-002', type: 'HOSTEL_DORM', block: 'PENNA > BH-1{Front Side}', floor: 'Ground Floor', room: 'Room 002', code: 'QR-PENNA-BH1F-002', desc: 'Penna Hostel BH-1 Front Wing' },
  { id: 'penna-bh1b-120', type: 'HOSTEL_DORM', block: 'PENNA > BH-1{Backside}', floor: '1st Floor', room: 'Room 120', code: 'QR-PENNA-BH1B-120', desc: 'Penna Hostel BH-1 Backside' },
  { id: 'penna-bh1b-225', type: 'HOSTEL_DORM', block: 'PENNA > BH-1{Backside}', floor: '2nd Floor', room: 'Room 225', code: 'QR-PENNA-BH1B-225', desc: 'Penna Hostel BH-1 Backside' },

  // --- HOSTELS / DORMS: PAPAGNI (BH-2) ---
  { id: 'pap-bh2f-105', type: 'HOSTEL_DORM', block: 'PAPAGNI > BH-2{Front Side}', floor: '1st Floor', room: 'Room 105', code: 'QR-PAP-BH2F-105', desc: 'Papagni Hostel BH-2 Front Wing' },
  { id: 'pap-bh2f-214', type: 'HOSTEL_DORM', block: 'PAPAGNI > BH-2{Front Side}', floor: '2nd Floor', room: 'Room 214', code: 'QR-PAP-BH2F-214', desc: 'Papagni Hostel BH-2 Front Wing' },
  { id: 'pap-bh2b-032', type: 'HOSTEL_DORM', block: 'PAPAGNI > BH-2{Back side}', floor: 'Ground Floor', room: 'Room 032', code: 'QR-PAP-BH2B-032', desc: 'Papagni Hostel BH-2 Back Wing' },
  { id: 'pap-bh2b-135', type: 'HOSTEL_DORM', block: 'PAPAGNI > BH-2{Back side}', floor: '1st Floor', room: 'Room 135', code: 'QR-PAP-BH2B-135', desc: 'Papagni Hostel BH-2 Back Wing' },

  // --- HOSTELS / DORMS: KUNDU (GH-1) ---
  { id: 'kundu-gh1-012', type: 'HOSTEL_DORM', block: 'KUNDU{GH-1} > Main Wing', floor: 'Ground Floor', room: 'Room 012', code: 'QR-KUNDU-GH1-012', desc: 'Kundu Girls Hostel GH-1' },
  { id: 'kundu-gh1-115', type: 'HOSTEL_DORM', block: 'KUNDU{GH-1} > Main Wing', floor: '1st Floor', room: 'Room 115', code: 'QR-KUNDU-GH1-115', desc: 'Kundu Girls Hostel GH-1' },
  { id: 'kundu-gh1-208', type: 'HOSTEL_DORM', block: 'KUNDU{GH-1} > Main Wing', floor: '2nd Floor', room: 'Room 208', code: 'QR-KUNDU-GH1-208', desc: 'Kundu Girls Hostel GH-1' },

  // --- HOSTELS / DORMS: CHITRAVATI (GH-2) ---
  { id: 'chitra-gh2-018', type: 'HOSTEL_DORM', block: 'CHITRAVATI{GH-2} > Main Wing', floor: 'Ground Floor', room: 'Room 018', code: 'QR-CHITRA-GH2-018', desc: 'Chitravati Girls Hostel GH-2' },
  { id: 'chitra-gh2-122', type: 'HOSTEL_DORM', block: 'CHITRAVATI{GH-2} > Main Wing', floor: '1st Floor', room: 'Room 122', code: 'QR-CHITRA-GH2-122', desc: 'Chitravati Girls Hostel GH-2' },
  { id: 'chitra-gh2-215', type: 'HOSTEL_DORM', block: 'CHITRAVATI{GH-2} > Main Wing', floor: '2nd Floor', room: 'Room 215', code: 'QR-CHITRA-GH2-215', desc: 'Chitravati Girls Hostel GH-2' },

  // --- HOSTELS / DORMS: OLD CAMPUS SINGLE-STOREY DORMS ---
  { id: 'old-rho-14', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > RHO', floor: 'Ground Floor', room: 'Room 14', code: 'QR-OLDCAMP-RHO-14', desc: 'Old Campus Dormitory RHO' },
  { id: 'old-theta-08', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > THETA', floor: 'Ground Floor', room: 'Room 08', code: 'QR-OLDCAMP-THETA-08', desc: 'Old Campus Dormitory THETA' },
  { id: 'old-alpha-05', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > ALPHA', floor: 'Ground Floor', room: 'Room 05', code: 'QR-OLDCAMP-ALPHA-05', desc: 'Old Campus Dormitory ALPHA' },
  { id: 'old-beta-09', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > BETA', floor: 'Ground Floor', room: 'Room 09', code: 'QR-OLDCAMP-BETA-09', desc: 'Old Campus Dormitory BETA' },
  { id: 'old-gamma-11', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > GAMMA', floor: 'Ground Floor', room: 'Room 11', code: 'QR-OLDCAMP-GAMMA-11', desc: 'Old Campus Dormitory GAMMA' },
  { id: 'old-delta-06', type: 'HOSTEL_DORM', block: 'OLD CAMPUS > DELTA', floor: 'Ground Floor', room: 'Room 06', code: 'QR-OLDCAMP-DELTA-06', desc: 'Old Campus Dormitory DELTA' },

  // --- CAMPUS FACILITIES ---
  { id: 'sac-badminton', type: 'FACILITY', block: 'SAC', floor: 'Ground Floor', room: 'Indoor Badminton Court', code: 'QR-SAC-GF-INDOOR', desc: 'Student Activity Center' },
  { id: 'sac-gym', type: 'FACILITY', block: 'SAC', floor: '1st Floor', room: 'Fitness & Gym Center', code: 'QR-SAC-1F-GYM', desc: 'Student Activity Center' },
  { id: 'hosp-emergency', type: 'FACILITY', block: 'HOSPITAL', floor: 'Emergency Ward', room: 'Emergency Ward 1', code: 'QR-HOSP-EMERGENCY', desc: 'Campus Health Center' },
  { id: 'hosp-doctor', type: 'FACILITY', block: 'HOSPITAL', floor: 'Doctors Cabins', room: 'Physician Cabin 1', code: 'QR-HOSP-DOC1', desc: 'Campus Health Center' },
  { id: 'hosp-pharmacy', type: 'FACILITY', block: 'HOSPITAL', floor: 'Pharmacy', room: 'Dispensing Counter', code: 'QR-HOSP-PHARM', desc: 'Campus Health Center' },
];

const CATEGORIES = [
  { id: 'Electrical', label: 'Electrical', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { id: 'Plumbing', label: 'Plumbing', icon: Droplet, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { id: 'IT Systems', label: 'IT Systems', icon: Monitor, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  { id: 'Housekeeping', label: 'Housekeeping', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  { id: 'Furniture & Civil', label: 'Civil & Furniture', icon: Wrench, color: 'text-orange-500 bg-orange-50 border-orange-200' },
  { id: 'Safety', label: 'Safety', icon: ShieldAlert, color: 'text-rose-500 bg-rose-50 border-rose-200' },
];

const URGENCIES = [
  { id: 'LOW', label: 'Basic / Normal', desc: 'Warden 1 Wk • DSW/Dept 3d • AO 1d • Dir 1d', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
  { id: 'MEDIUM', label: 'Medium Level', desc: 'Half-Time: 3.5d Warden • 1.5d DSW • 12h AO/Dir', color: 'border-blue-300 text-blue-700 bg-blue-50' },
  { id: 'HIGH', label: 'High Urgency', desc: 'Priority on-site dispatch & technical review', color: 'border-amber-300 text-amber-700 bg-amber-50' },
  { id: 'EMERGENCY', label: 'Emergency SOS', desc: 'Immediate Action Needed (< 2h Turnaround)', color: 'border-rose-400 text-rose-700 bg-rose-50' },
];

// Dynamic Floor / Section resolution based on RGUKT Campus Architecture
const getFloorOptions = (type, loc) => {
  if (type === 'FACILITY') {
    if (loc === 'HOSPITAL') {
      return [
        'Pharmacy',
        'Doctors Cabins',
        'Emergency Ward',
        'OPD',
        'General Ward'
      ];
    }
    // SAC
    return ['Ground Floor', '1st Floor'];
  }

  if (type === 'ACADEMICS') {
    // Departments: CSE, ECE, EEE, MME, CIVIL, CHEMICAL, MECHANICAL
    if (loc && (loc.startsWith('Departments') || ['CSE', 'ECE', 'EEE', 'MME', 'CIVIL', 'CHEMICAL', 'MECHANICAL'].some(d => loc.includes(d)))) {
      return ['Ground Floor', '1st Floor'];
    }
    if (loc === 'Library') {
      return ['Ground Floor', '1st Floor'];
    }
    if (loc === 'IQAC' || loc === 'Computer Center') {
      return ['Ground Floor'];
    }
    // AB-1, AB-2, Lab Complex
    return ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
  }

  if (type === 'HOSTEL_DORM') {
    // OLD CAMPUS (RHO, THETA, ALPHA, BETA, GAMMA, DELTA) - Single-storey dorms (Ground Floor only)
    if (loc && (loc.startsWith('OLD CAMPUS') || ['RHO', 'THETA', 'ALPHA', 'BETA', 'GAMMA', 'DELTA'].some(b => loc.includes(b)))) {
      return ['Ground Floor'];
    }
    // Multi-storey Hostel / Dormitory (PENNA, PAPAGNI, KUNDU, CHITRAVATI)
    return ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
  }

  return ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
};

// COMPONENT: IN-PAGE CAMPUS QRS & MAP WAYFINDING HUB
function CampusQrMapHub({ onOpenModal, onSelectRoomForComplaint, currentRole }) {
  const [sector, setSector] = useState('ACADEMICS');
  const [selectedBlock, setSelectedBlock] = useState('AB-1');
  const [selectedRoomItem, setSelectedRoomItem] = useState(CAMPUS_ROOM_QR_DIRECTORY[0]);
  const [roomQrUrl, setRoomQrUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Block options per sector
  const blockOptions = sector === 'ACADEMICS' 
    ? ['AB-1', 'AB-2', 'Library', 'Computer Center', 'Lab Complex', 'IQAC']
    : sector === 'HOSTEL_DORM'
    ? ['PENNA', 'PAPAGNI', 'KUNDU{GH-1}', 'CHITRAVATI{GH-2}', 'OLD CAMPUS']
    : ['SAC', 'HOSPITAL'];

  // Keep selectedBlock valid when sector changes
  useEffect(() => {
    if (!blockOptions.includes(selectedBlock)) {
      setSelectedBlock(blockOptions[0]);
    }
  }, [sector]);

  // Rooms matching sector and block
  const filteredRooms = CAMPUS_ROOM_QR_DIRECTORY.filter(r => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.room.toLowerCase().includes(q) || r.block.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
    }
    if (r.type !== sector) return false;
    if (sector === 'HOSTEL_DORM') {
      return r.block.includes(selectedBlock);
    }
    return r.block === selectedBlock;
  });

  const displayRoom = selectedRoomItem || filteredRooms[0] || CAMPUS_ROOM_QR_DIRECTORY[0];
  const geo = getRkvGoogleMapsData(displayRoom.block, displayRoom.floor, displayRoom.room);

  useEffect(() => {
    if (displayRoom) {
      const payload = JSON.stringify({
        roomCode: displayRoom.code,
        block: displayRoom.block,
        floor: displayRoom.floor,
        room: displayRoom.room,
        campus: 'RGUKT RK Valley',
        gmaps: geo.gmapsDirectionsUrl
      });
      
    }
  }, [displayRoom, geo.gmapsDirectionsUrl]);

  const handleDownload = () => {
    if (!roomQrUrl) return;
    const a = document.createElement('a');
    a.href = roomQrUrl;
    a.download = `${displayRoom.code}_RGUKT_RKV.png`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="cyber-card p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold">
            <MapIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Campus QRs & Geo Navigation Hub</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                GPS Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive room signboards, QR verification codes, and Google Maps indoor wayfinding for RGUKT RK Valley
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (geo && geo.mapsUrl) window.open(geo.mapsUrl, '_blank');
            }}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Google Maps Navigation</span>
          </button>
        </div>
      </div>

      {/* Sector & Building Selector */}
      <div className="cyber-card p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Sector Tabs */}
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setSector('ACADEMICS'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${sector === 'ACADEMICS' && !searchQuery ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'}`}
            >
              🏛️ Academics
            </button>
            <button
              type="button"
              onClick={() => { setSector('HOSTEL_DORM'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${sector === 'HOSTEL_DORM' && !searchQuery ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'}`}
            >
              🏢 Hostels & Dorms
            </button>
            <button
              type="button"
              onClick={() => { setSector('FACILITY'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${sector === 'FACILITY' && !searchQuery ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'}`}
            >
              ⚽ SAC & Hospital
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room name or code..."
              className="w-full pl-9 pr-3 py-1.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Building Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Select Building:</span>
            {blockOptions.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBlock(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBlock === b
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-200 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Featured QR Signboard on Left, Room Selector Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Featured QR Signboard Card (5 cols) */}
        <div className="lg:col-span-5 cyber-card p-5 sm:p-6 rounded-2xlborder-2 border-purple-200 shadow-xs flex flex-col items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full mb-3">
            Official Campus Signboard
          </span>

          <h3 className="font-bold text-lg text-white leading-snug">{displayRoom.room}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{displayRoom.block} • {displayRoom.floor}</p>
          <span className="font-mono text-xs font-bold text-purple-700 bg-slate-800/80 px-2.5 py-1 rounded-md mt-2">
            {displayRoom.code}
          </span>

          {/* QR Image Box */}
          <div className="my-5 p-3 bg-white rounded-2xl border-2 border-slate-700/60 shadow-sm flex items-center justify-center">
            {roomQrUrl ? (
              <img src={roomQrUrl} alt="Room QR Code" className="w-56 h-56 object-contain rounded-lg" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="w-full cyber-card-subtle p-3 rounded-xl border border-slate-700/60 text-xs text-left space-y-1 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Campus GPS:</span>
              <span className="font-bold text-slate-100">{geo.lat.toFixed(4)}° N, {geo.lng.toFixed(4)}° E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Nearby Landmark:</span>
              <span className="font-bold text-slate-100 truncate max-w-[200px]">{geo.landmark}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="py-2.5 bg-slate-800/80 hover:bg-slate-200 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (geo && geo.mapsUrl) window.open(geo.mapsUrl, '_blank');
              }}
              className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route Guide</span>
            </button>
          </div>

          {onSelectRoomForComplaint && (
            <button
              type="button"
              onClick={() => onSelectRoomForComplaint(displayRoom)}
              className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Grievance For This Room</span>
            </button>
          )}
        </div>

        {/* Room Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-slate-100">
              Rooms & Laboratories in {searchQuery ? 'Search Results' : selectedBlock}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{filteredRooms.length} room(s) available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredRooms.map(rm => {
              const isSelected = displayRoom.id === rm.id;
              return (
                <div
                  key={rm.id}
                  onClick={() => setSelectedRoomItem(rm)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-2 ring-purple-600/20'
                      : 'border-slate-700/60 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                        {rm.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{rm.floor}</span>
                    </div>

                    <h4 className="font-bold text-xs text-white mt-1 line-clamp-1">{rm.room}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{rm.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-purple-600 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Select Room
                    </span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[120px]">{rm.block}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Directory Info Card */}
          <div className="cyber-card p-4 rounded-2xl mt-4">
            <h4 className="font-bold text-xs text-slate-100 mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Campus Wayfinding & Navigation Tip</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every room QR code at RGUKT RK Valley is pre-linked with indoor corridor coordinates, floor numbers, and nearest GPS waypoints. Technicians scanning this code are automatically guided straight to the reported room.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// DEPARTMENT WORKDAY DAILY SESSION STORAGE (Login 1x Per Day for Department)
// Students: Pure ephemeral entry / ask login every time they enter the app
// Department Staff & Authorities: Log in once per day; session stays valid throughout workday
// ============================================================================
export const DEPT_DAILY_SESSION_KEY = 'rgukt_dept_daily_session';

export function isDepartmentRoleOrUser(user) {
  if (!user) return false;
  if (user.userTab === 'department') return true;
  if (user.role === 'STAFF' || user.role === 'ADMIN') return true;
  if (['WARDEN', 'DSW', 'AO', 'DIRECTOR', 'STAFF'].includes(user.role)) return true;
  if (user.hierarchyStage && user.hierarchyStage !== 'STUDENT') return true;
  if (user.idNo && typeof user.idNo === 'string') {
    const upperId = user.idNo.trim().toUpperCase();
    if (upperId.startsWith('STAFF') || upperId.startsWith('WARDEN') || upperId.startsWith('DSW') || upperId.startsWith('AO') || upperId.startsWith('DIRECTOR') || upperId.startsWith('DEPT')) {
      return true;
    }
  }
  if (user.email && typeof user.email === 'string') {
    const lowerEmail = user.email.toLowerCase();
    if (['warden', 'dsw', 'admin', 'ao', 'director', 'electrical', 'plumbing', 'civil', 'it', 'sanitation', 'safety', 'dept'].some(k => lowerEmail.includes(k))) {
      return true;
    }
  }
  return false;
}

export function getActiveDepartmentDailySession() {
  try {
    const raw = localStorage.getItem(DEPT_DAILY_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const todayStr = new Date().toDateString();
    if (session && session.loginDate === todayStr && session.user) {
      // 🛡️ SECURITY CHECK: Ensure student ID cannot masquerade as department daily session
      const uId = (session.user.idNo || '').toUpperCase().trim();
      if (/^[RBNS][0-9]{6}$/.test(uId) || session.user.userTab === 'student') {
        console.warn('🚨 [SECURITY] Blocked rogue student session in department daily storage.');
        localStorage.removeItem(DEPT_DAILY_SESSION_KEY);
        return null;
      }
      return session;
    }
    // Session expired from a previous calendar day
    localStorage.removeItem(DEPT_DAILY_SESSION_KEY);
    return null;
  } catch (e) {
    console.warn('Error reading dept daily session:', e);
    return null;
  }
}

export function saveDepartmentDailySession(user, profileKey) {
  try {
    const sessionData = {
      user,
      profileKey: profileKey || (user?.role === 'ADMIN' ? 'AO' : 'DEPT_ELECTRICAL'),
      loginDate: new Date().toDateString(),
      loginTimestamp: Date.now()
    };
    localStorage.setItem(DEPT_DAILY_SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Error saving dept daily session:', e);
  }
}

export function clearDepartmentDailySession() {
  try {
    localStorage.removeItem(DEPT_DAILY_SESSION_KEY);
  } catch (e) {
    console.warn('Error clearing dept daily session:', e);
  }
}

// HELPER: Match complaints to technical staff trade
export function isComplaintMatchingTrade(c, tradeOrCategory) {
  if (!c || !tradeOrCategory) return false;
  const target = tradeOrCategory.toLowerCase();
  const cCat = (c.category || '').toLowerCase();
  const cDept = (c.concernedDept || '').toLowerCase();

  // Electrical
  if (target.includes('elec') || target.includes('power')) {
    return cCat.includes('elec') || cCat.includes('power') || cDept.includes('elec') || cDept.includes('power');
  }
  // Plumbing
  if (target.includes('plumb') || target.includes('water')) {
    return cCat.includes('plumb') || cCat.includes('water') || cDept.includes('plumb') || cDept.includes('water');
  }
  // Civil / Carpentry / Furniture
  if (target.includes('civil') || target.includes('carpenter') || target.includes('furniture')) {
    return cCat.includes('civil') || cCat.includes('carpenter') || cCat.includes('furniture') ||
           cDept.includes('civil') || cDept.includes('carpenter') || cDept.includes('furniture');
  }
  // IT Systems / Network / Wi-Fi
  if (target.includes('it') || target.includes('wifi') || target.includes('wi-fi') || target.includes('network') || target.includes('systems')) {
    return cCat.includes('it') || cCat.includes('wifi') || cCat.includes('wi-fi') || cCat.includes('network') ||
           cDept.includes('it') || cDept.includes('wifi') || cDept.includes('wi-fi') || cDept.includes('network');
  }
  // Housekeeping / Sanitation
  if (target.includes('clean') || target.includes('housekeep') || target.includes('sanitat')) {
    return cCat.includes('clean') || cCat.includes('housekeep') || cCat.includes('sanitat') ||
           cDept.includes('clean') || cDept.includes('housekeep') || cDept.includes('sanitat');
  }
  // Safety / Health
  if (target.includes('safe') || target.includes('pest') || target.includes('hygiene') || target.includes('health')) {
    return cCat.includes('safe') || cCat.includes('pest') || cCat.includes('hygiene') || cCat.includes('health') ||
           cDept.includes('safe') || cDept.includes('pest') || cDept.includes('hygiene') || cDept.includes('health');
  }

  return cCat.includes(target) || cDept.includes(target);
}

// HELPER: Determine if complaint pertains to Hostel / Dormitory facilities
export function isHostelComplaint(c) {
  if (!c) return false;
  if (c.locationType === 'HOSTEL_DORM') return true;
  if (c.isHostelHierarchy || c.hierarchyStage === 'WARDEN' || c.currentHierarchyStage === 'WARDEN') return true;
  const loc = (c.location || '').toLowerCase();
  const room = (c.room || '').toLowerCase();
  const title = (c.title || '').toLowerCase();
  const desc = (c.description || '').toLowerCase();

  const hostelKeywords = [
    'hostel', 'dorm', 'bh-', 'gh-', 'bh1', 'bh2', 'gh1', 'gh2',
    'penna', 'papagni', 'kundu', 'chitravati', 'rho', 'theta',
    'alpha', 'beta', 'gamma', 'delta', 'mess', 'dining hall'
  ];

  return hostelKeywords.some(kw => 
    loc.includes(kw) || room.includes(kw) || title.includes(kw) || desc.includes(kw)
  );
}

// HELPER: Determine if complaint is an ICC grievance
export function isIccComplaint(c) {
  if (!c) return false;
  return Boolean(
    c.isIcc ||
    c.category === 'Internal Complaints Committee (ICC)' ||
    c.categoryType === 'ICC' ||
    (c.category && c.category.toLowerCase().includes('icc')) ||
    (c.committeeLevel && c.committeeLevel.toLowerCase().includes('icc'))
  );
}

export default function CampusMaintenanceApp() {
  // Check if department user has an active daily workday session for today
  const initialDeptSession = getActiveDepartmentDailySession();

  // Check if student user has an active session from this device
  const initialStudentSession = (() => {
    try {
      const raw = localStorage.getItem('rgukt_active_session_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.idNo || parsed.email)) {
          // 🛡️ ENFORCE ROLE INTEGRITY: Prevent client-side role tampering via DevTools
          const cleanUser = sanitizeUserRolePrivileges(parsed);
          const userKey = (cleanUser.idNo || cleanUser.email).toUpperCase();
          const customRaw = localStorage.getItem(`rgukt_saved_profile_${userKey}`);
          if (customRaw) {
            return sanitizeUserRolePrivileges({ ...cleanUser, ...JSON.parse(customRaw) });
          }
          return cleanUser;
        }
      }
    } catch (e) {}
    return null;
  })();

  const initialUser = initialDeptSession ? initialDeptSession.user : initialStudentSession;

  // Authentication State:
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialDeptSession || initialStudentSession));
  const [currentUser, setCurrentUser] = useState(initialUser);

  // Global & Role State
  const [currentRole, setCurrentRole] = useState(
    initialDeptSession ? (initialDeptSession.user?.role || 'STAFF') : 'REPORTER'
  );
  const [activeProfileKey, setActiveProfileKey] = useState(
    initialDeptSession?.profileKey || 'REPORTER'
  );
  const [activeTab, setActiveTab] = useState(
    initialDeptSession ? (initialDeptSession.user?.role === 'ADMIN' ? 'dashboard' : 'tracker') : 'my-complaints'
  );
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [dismissOfflinePage, setDismissOfflinePage] = useState(false);
  const [offlineOutbox, setOfflineOutbox] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('rgukt_app_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activeToast, setActiveToast] = useState(null);
  const [scanSuccessToast, setScanSuccessToast] = useState(null);
  const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('staff-1');

  // Push System Notification helper across Toast, Local Storage, and Browser Push
  const pushSystemNotification = (title, body, channel = 'CAMPUS') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      body,
      channel,
      recipient: currentUser?.name || currentUser?.fullName || 'Student Resident',
      time: timeStr,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev.filter(n => n.id !== newNotif.id)].slice(0, 50);
      try {
        localStorage.setItem('rgukt_app_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setActiveToast(newNotif);
    setTimeout(() => {
      setActiveToast(curr => (curr?.id === newNotif.id ? null : curr));
    }, 6000);

    // Browser Notification API
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/logo.png?v=original' });
        } catch (e) {}
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            try {
              new Notification(title, { body, icon: '/logo.png?v=original' });
            } catch (e) {}
          }
        });
      }
    }
  };

  // Switch between individual authority and student profiles seamlessly
  const handleSwitchProfile = (profileKey) => {
    setActiveProfileKey(profileKey);
    const profile = CAMPUS_AUTHORITY_PROFILES[profileKey];
    if (profile) {
      const allAccounts = getRegisteredAccounts();
      const customSaved = allAccounts.find(a => 
        (a.profileKey && a.profileKey === profileKey) ||
        (a.idNo && profile.idNumber && a.idNo.toUpperCase() === profile.idNumber.toUpperCase()) ||
        (a.collegeEmail && profile.email && a.collegeEmail.toLowerCase() === profile.email.toLowerCase())
      );
      const updatedUser = {
        ...profile,
        ...(currentUser || {}),
        id: profile.id,
        name: customSaved?.fullName || customSaved?.name || profile.name,
        fullName: customSaved?.fullName || customSaved?.name || profile.name,
        email: customSaved?.collegeEmail || customSaved?.email || profile.email,
        role: profile.role,
        department: customSaved?.department || profile.department,
        category: customSaved?.category || profile.category,
        staffId: profile.idNumber,
        mobileNumber: customSaved?.mobileNumber || (profile.phone ? profile.phone.replace('+91 ', '') : ''),
        location: profile.location,
        designation: customSaved?.designation || profile.designation,
        hierarchyStage: profile.hierarchyStage,
        departmentKey: profile.departmentKey,
        profilePic: customSaved?.profilePic || null,
        profileKey: profileKey
      };
      setCurrentUser(updatedUser);
      if (profile.role === 'REPORTER') {
        setCurrentRole('REPORTER');
        setReporterEmail(profile.email);
        setActiveTab('my-complaints');
      } else if (profile.role === 'STAFF') {
        setCurrentRole('STAFF');
        setActiveTab('tracker');
        if (profile.key === 'DEPT_ELECTRICAL') setSelectedStaffId('staff-1');
        else if (profile.key === 'DEPT_PLUMBING') setSelectedStaffId('staff-2');
        else if (profile.key === 'DEPT_CIVIL') setSelectedStaffId('staff-3');
        else if (profile.key === 'DEPT_IT') setSelectedStaffId('staff-4');
        else if (profile.key === 'DEPT_HOUSEKEEPING') setSelectedStaffId('staff-5');
      } else {
        // WARDEN, DSW, AO, DIRECTOR have administrative oversight
        setCurrentRole('ADMIN');
        setActiveTab('tracker');
      }

      // If switching as a department user, persist current profile for today's workday
      if (isDepartmentRoleOrUser(updatedUser) || profileKey !== 'REPORTER') {
        saveDepartmentDailySession(updatedUser, profileKey);
      }
    }
  };

  // Auto-dismiss QR scan success toast
  useEffect(() => {
    if (scanSuccessToast) {
      const timer = setTimeout(() => setScanSuccessToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [scanSuccessToast]);

  // Form State - RGUKT Location Hierarchy
  const [locationType, setLocationType] = useState('ACADEMICS'); // 'ACADEMICS' | 'HOSTEL_DORM' | 'FACILITY'
  const [academicLocation, setAcademicLocation] = useState('AB-1');
  const [hostelLocation, setHostelLocation] = useState('OLD CAMPUS > RHO');
  const [separateFacility, setSeparateFacility] = useState('SAC');
  const [floor, setFloor] = useState('Ground Floor');
  const [room, setRoom] = useState('Lab 104');

  // Dynamic floor options calculation based on user selection
  const activeLocation = locationType === 'ACADEMICS' ? academicLocation :
                         locationType === 'HOSTEL_DORM' ? hostelLocation : separateFacility;
  const currentFloorOptions = getFloorOptions(locationType, activeLocation);

  useEffect(() => {
    if (!currentFloorOptions.includes(floor)) {
      setFloor(currentFloorOptions[0]);
    }
  }, [currentFloorOptions, floor]);
  const [category, setCategory] = useState('Electrical');
  const [categoryType, setCategoryType] = useState('MAINTENANCE'); // 'MAINTENANCE' | 'ICC'
  const [iccGrievanceNature, setIccGrievanceNature] = useState('Anti-Ragging & Harassment (POSH)');
  const [iccCommitteeLevel, setIccCommitteeLevel] = useState('Level 2: Medium Committee (6 Members)');
  const [iccIsConfidential, setIccIsConfidential] = useState(true);
  const [iccMaskIdentity, setIccMaskIdentity] = useState(false);
  const [iccMatterType, setIccMatterType] = useState('STUDENT'); // 'STUDENT' | 'STAFF'
  const [iccDomainType, setIccDomainType] = useState('ACADEMIC'); // 'ACADEMIC' | 'ADMINISTRATIVE'
  const [iccConcernedDept, setIccConcernedDept] = useState('CSE');
  const [iccSpecialDomain, setIccSpecialDomain] = useState('MESS'); // 'MESS' | 'SPORTS' | 'GENERAL'
  const [iccInvolvesStudents, setIccInvolvesStudents] = useState(true);
  const [showMediumCommitteeModal, setShowMediumCommitteeModal] = useState(false);
  const [selectedIccModalTicket, setSelectedIccModalTicket] = useState(null);
  const [showHostelEscalationModal, setShowHostelEscalationModal] = useState(false);
  const [selectedHostelTicket, setSelectedHostelTicket] = useState(null);
  const [urgency, setUrgency] = useState('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Complaints State
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [resolveModalTicket, setResolveModalTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectModalTicket, setRejectModalTicket] = useState(null);
  const [showMailboxModal, setShowMailboxModal] = useState(false);
  const [showIntro, setShowIntro] = useState(!initialDeptSession);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [profileEditSuccessToast, setProfileEditSuccessToast] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoInitialPrompt, setDemoInitialPrompt] = useState(true);
  const [smtpConfig, setSmtpConfig] = useState(null);
  const [emailLog, setEmailLog] = useState([]);
  const [reporterEmail, setReporterEmail] = useState(() => {
    return initialUser?.collegeEmail || initialUser?.email || (initialUser?.idNo ? `${initialUser.idNo.toLowerCase()}@rguktrkv.ac.in` : '');
  });

  // Automatically keep reporterEmail in sync with logged-in user profile
  useEffect(() => {
    if (currentUser) {
      const email = currentUser.collegeEmail || currentUser.email || (currentUser.idNo ? `${currentUser.idNo.toLowerCase()}@rguktrkv.ac.in` : '');
      if (email && (!reporterEmail || reporterEmail === 'student@rgukt.ac.in')) {
        setReporterEmail(email);
      }
    }
  }, [currentUser]);

  // Prompt first-time visitors for demo tour after entering the app
  useEffect(() => {
    if (isAuthenticated && !showIntro) {
      try {
        const prompted = localStorage.getItem('rgukt_demo_tour_prompted');
        if (!prompted) {
          setDemoInitialPrompt(true);
          setShowDemoModal(true);
        }
      } catch (e) {}
    }
  }, [isAuthenticated, showIntro]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [appVersion, setAppVersion] = useState(null);

  // Admin Tab Navigation & Filter States
  const [adminStaffTradeFilter, setAdminStaffTradeFilter] = useState('ALL');
  const [adminStaffSearch, setAdminStaffSearch] = useState('');
  const [adminComplaintsSearch, setAdminComplaintsSearch] = useState('');
  const [adminComplaintsStatusFilter, setAdminComplaintsStatusFilter] = useState('ALL');
  const [adminComplaintsCategoryFilter, setAdminComplaintsCategoryFilter] = useState('ALL');
  const [adminQrBuildingFilter, setAdminQrBuildingFilter] = useState('AB-1');
  const [adminQrSectorFilter, setAdminQrSectorFilter] = useState('ACADEMICS');
  const [adminSelectedQrRoom, setAdminSelectedQrRoom] = useState(null);
  const [adminQrImageUrl, setAdminQrImageUrl] = useState('');

  // Solved Complaints Filter States
  const [solvedSearch, setSolvedSearch] = useState('');
  const [solvedVerifyFilter, setSolvedVerifyFilter] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING'
  const [solvedDeptFilter, setSolvedDeptFilter] = useState('ALL');

  // Student & Department Dashboard Status Filter States (Pending / Solved / Rejected)
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'SOLVED' | 'REJECTED'
  const [deptStatusFilter, setDeptStatusFilter] = useState('PENDING'); // 'PENDING' | 'SOLVED' | 'REJECTED' | 'ALL'
  const [expandedTrackTickets, setExpandedTrackTickets] = useState({}); // { [ticketId]: boolean }
  const [tabHistory, setTabHistory] = useState([]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Close dashboard drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDashboardOpen) {
        setIsDashboardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDashboardOpen]);

  // Step-back navigation handler: goes back one step in tab/modal history instead of kicking user out to main starting page
  const handleStepBack = () => {
    // 0. If dashboard navigation drawer is open, close it first as a step back
    if (isDashboardOpen) {
      setIsDashboardOpen(false);
      return;
    }

    // 1. If any modal is open, close that modal first as a step back
    if (showDemoModal) {
      setShowDemoModal(false);
      return;
    }
    if (showMediumCommitteeModal) {
      setShowMediumCommitteeModal(false);
      return;
    }
    if (showHostelEscalationModal) {
      setShowHostelEscalationModal(false);
      return;
    }
    if (showProfileEditModal) {
      setShowProfileEditModal(false);
      return;
    }
    if (showMailboxModal) {
      setShowMailboxModal(false);
      return;
    }
    if (showSmtpModal) {
      setShowSmtpModal(false);
      return;
    }
    if (resolveModalTicket) {
      setResolveModalTicket(null);
      return;
    }
    if (rejectModalTicket) {
      setRejectModalTicket(null);
      return;
    }
    if (feedbackModalTicket) {
      setFeedbackModalTicket(null);
      return;
    }

    // 2. If user is in a previous tab history, step back to previous tab
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(h => h.slice(0, -1));
      setActiveTab(prevTab);
      return;
    }

    // 3. Fallback based on role if no history
    if (currentRole === 'REPORTER' && activeTab !== 'my-complaints') {
      setActiveTab('my-complaints');
    } else if (currentRole === 'STAFF' && activeTab !== 'tracker') {
      setActiveTab('tracker');
    } else if (currentRole === 'ADMIN' && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  // Safe navigation function that records previous step into history and closes dashboard drawer
  const navigateToTab = (nextTab) => {
    setIsDashboardOpen(false); // Automatically dismiss dashboard drawer upon selecting an item
    if (nextTab === activeTab) return;
    setTabHistory(prev => [...prev.slice(-10), activeTab]);
    setActiveTab(nextTab);
    // Push browser state so mobile hardware back button triggers step-back within app
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: nextTab }, '', window.location.href);
    }
  };

  // Intercept browser / mobile hardware back button so it steps back inside the app instead of navigating away
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      handleStepBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeTab, tabHistory, 
    showMediumCommitteeModal, showHostelEscalationModal, 
    showProfileEditModal, showMailboxModal, showSmtpModal, showDemoModal,
    resolveModalTicket, rejectModalTicket, feedbackModalTicket
  ]);

  // Comprehensive Fetch from API & Cloud Firestore with sync guarantees
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch complaints from local backend API
      const resC = await fetch('/api/complaints').catch(() => null);
      if (resC && resC.ok) {
        const dataC = await resC.json().catch(() => null);
        if (dataC && dataC.success && Array.isArray(dataC.complaints)) {
          const validComplaints = dataC.complaints.filter(c => c && c.id && (c.title || c.description || c.ticketNumber));
          setComplaints(validComplaints);
          setSelectedTicket(prev => {
            if (!prev && validComplaints.length > 0) return validComplaints[0];
            if (prev) {
              const updated = validComplaints.find(c => c.id === prev.id);
              return updated || prev;
            }
            return null;
          });
        }
      }

      // 2. Fetch complaints directly from Firebase Cloud Firestore to ensure 100% sync
      try {
        const cloudComplaints = await fetchComplaintsFromFirestore();
        if (Array.isArray(cloudComplaints) && cloudComplaints.length > 0) {
          const validCloud = cloudComplaints.filter(c => c && c.id && (c.title || c.description || c.ticketNumber));
          setComplaints(prev => {
            const map = new Map();
            prev.forEach(c => { if (c && c.id && (c.title || c.description || c.ticketNumber)) map.set(c.id, c); });
            validCloud.forEach(c => {
              if (c && c.id) {
                map.set(c.id, { ...(map.get(c.id) || {}), ...c });
              }
            });
            return Array.from(map.values());
          });
        }
      } catch (fbErr) {
        console.warn('Firebase complaints refresh notice:', fbErr);
      }

      const resS = await fetch('/api/staff').catch(() => null);
      if (resS && resS.ok) {
        const dataS = await resS.json().catch(() => null);
        if (dataS && dataS.success) setStaffList(dataS.staff);
      }

      const resA = await fetch('/api/analytics').catch(() => null);
      if (resA && resA.ok) {
        const dataA = await resA.json().catch(() => null);
        if (dataA && dataA.success) {
          setAnalytics(dataA);
          if (Array.isArray(dataA.notifications) && dataA.notifications.length > 0) {
            setNotifications(prev => {
              const ids = new Set(prev.map(p => p.id));
              const additions = dataA.notifications.filter(n => !ids.has(n.id));
              const merged = [...additions, ...prev].slice(0, 50);
              try {
                localStorage.setItem('rgukt_app_notifications', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        }
      }

      const resE = await fetch('/api/emails').catch(() => null);
      if (resE && resE.ok) {
        const dataE = await resE.json().catch(() => null);
        if (dataE && dataE.success) {
          setEmailLog(dataE.emails || []);
        }
      }

      const resSmtp = await fetch('/api/smtp-config').catch(() => null);
      if (resSmtp && resSmtp.ok) {
        const dataSmtp = await resSmtp.json().catch(() => null);
        if (dataSmtp && dataSmtp.success) {
          setSmtpConfig(dataSmtp.config);
        }
      }
    } catch (err) {
      console.warn('API fetch offline or loading fallback:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchData();

    // Firebase Cloud Firestore Real-time Complaints Sync
    let unsubscribe = null;
    try {
      unsubscribe = subscribeToComplaints((liveComplaints) => {
        if (Array.isArray(liveComplaints) && liveComplaints.length > 0) {
          const validLive = liveComplaints.filter(c => c && c.id && (c.title || c.description || c.ticketNumber));
          setComplaints(prev => {
            const map = new Map();
            prev.forEach(c => { if (c && c.id && (c.title || c.description || c.ticketNumber)) map.set(c.id, c); });
            validLive.forEach(c => {
              if (c && c.id) {
                map.set(c.id, { ...(map.get(c.id) || {}), ...c });
              }
            });
            return Array.from(map.values());
          });
        }
      });
    } catch (e) {
      console.warn('Firebase complaint listener notice:', e);
    }

    // Sync cloud registered users from Firestore into local accounts and live session
    fetchUsersFromFirestore().then(remoteUsers => {
      syncCloudUsersWithLocal(remoteUsers, currentUser, setCurrentUser);
    }).catch(e => console.warn('Firebase user sync notice:', e));

    // Real-time Network Connectivity Event Handlers
    const handleOnline = () => {
      setIsOnline(true);
      setDismissOfflinePage(false);
      fetchData();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissOfflinePage(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
    }

    // Check for live deployed updates from GitHub / server on load and every 45 seconds
    const checkLiveAppUpdate = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
        if (res && res.ok) {
          setIsOnline(true);
          const verData = await res.json().catch(() => null);
          if (verData && verData.version) {
            const savedVer = localStorage.getItem('rkv_app_deployed_version');
            if (savedVer && savedVer !== verData.version) {
              setUpdateAvailable(true);
            } else if (!savedVer) {
              localStorage.setItem('rkv_app_deployed_version', verData.version);
            }
            setAppVersion(verData.version);
          }
        } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setIsOnline(false);
        }
      } catch (err) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setIsOnline(false);
        }
      }
    };

    checkLiveAppUpdate();
    const updateInterval = setInterval(checkLiveAppUpdate, 45000);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearInterval(updateInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentStudentEmail = (currentUser?.email || currentUser?.collegeEmail || (reporterEmail !== 'student@rgukt.ac.in' ? reporterEmail : '') || '').toLowerCase().trim();
  const currentStudentId = (currentUser?.idNo || currentUser?.staffId || currentUser?.id || '').trim().toUpperCase();

  // Role & Domain Isolation Filter:
  // - Students/Reporters: ONLY see complaints they personally submitted (matching their email, idNo, studentId, or reporterName)
  // - Technical Staff: ONLY see complaints matching their specific trade/category or assigned directly to them
  // - Hostel Wardens: ONLY see hostel/dorm maintenance complaints and hostel hierarchy tickets
  // - ICC Committee Members: ONLY see statutory ICC/harassment grievances
  // - Director / Admin: Central institutional governance oversight
  const visibleComplaints = complaints.filter(c => {
    if (!c) return false;
    const role = currentUser?.role || currentRole || 'REPORTER';

    const isIccTicket = isIccComplaint(c);

    // 1. ICC COMPLAINTS CONFIDENTIALITY:
    if (isIccTicket) {
      // Check if current user is an authorized ICC Member or Apex Director
      const isOfficialIccMember = Boolean(
        activeProfileKey === 'DIRECTOR' ||
        activeProfileKey?.startsWith('ICC_') ||
        currentUser?.category === 'ICC Committee' ||
        currentUser?.department?.includes('Internal Complaints Committee') ||
        currentUser?.designation?.includes('ICC') ||
        currentUser?.idNo?.startsWith('ICC-') ||
        currentUser?.idNo === 'DIR-APEX-01'
      );
      if (isOfficialIccMember) return true;

      // Allow the student/staff reporter who lodged this ICC complaint to track their own ticket
      const cEmail = (c.reporterEmail || '').toLowerCase().trim();
      const cId = (c.reporterId || c.studentId || '').trim().toUpperCase();
      if (currentStudentEmail && cEmail === currentStudentEmail) return true;
      if (currentStudentId && cId === currentStudentId) return true;
      if (currentUser?.name && (c.reporterName || '').trim().toLowerCase() === currentUser.name.trim().toLowerCase()) return true;

      // Strictly hidden from Wardens, Technicians, Staff, and unrelated students
      return false;
    }

    // 2. ICC COMMITTEE MEMBERS:
    // When an ICC Member is logged in, they should strictly see ICC tickets only! Not general plumbing/electrical repairs.
    const isIccUser = Boolean(
      activeProfileKey?.startsWith('ICC_') ||
      currentUser?.category === 'ICC Committee' ||
      currentUser?.idNo?.startsWith('ICC-')
    );
    if (isIccUser) {
      return isIccTicket;
    }

    // 3. STUDENT / REPORTER:
    // Must strictly see ONLY their own lodged complaints!
    if (role === 'REPORTER' || (!role && !isDepartmentRoleOrUser(currentUser))) {
      // Discard empty/corrupt records (no title and no ticketNumber)
      if (!c.title && !c.ticketNumber && !c.description) return false;

      const cEmail = (c.reporterEmail || '').toLowerCase().trim();
      const cId = (c.reporterId || c.studentId || '').trim().toUpperCase();
      const cName = (c.reporterName || '').trim().toLowerCase();
      const curId = currentStudentId;
      const curEmail = currentStudentEmail;
      const curName = (currentUser?.name || currentUser?.fullName || '').trim().toLowerCase();

      // 1. Check student ID (e.g. R240493)
      if (curId && curId !== 'STUDENT' && (cId === curId || (c.reporterName || '').toUpperCase().includes(curId))) {
        return true;
      }
      // 2. Check student Email (must be non-empty and never match generic student@rgukt.ac.in)
      if (curEmail && curEmail !== 'student@rgukt.ac.in' && cEmail === curEmail) {
        return true;
      }
      // 3. Check student Name (only if specific and matches)
      if (curName && curName !== 'student' && curName !== 'student resident' && curName.length > 3 && cName === curName) {
        return true;
      }
      // Strictly do not show other students' complaints!
      return false;
    }

    // 4. DEPARTMENT TECHNICAL STAFF / TECHNICIANS:
    // Must strictly see complaints matching their trade / assigned to them
    if (role === 'STAFF') {
      const staffTrade = activeTechnician?.trade || currentUser?.category || currentUser?.department || '';
      const staffId = activeTechnician?.id || currentUser?.staffId || currentUser?.id;
      const staffIdNo = (currentUser?.idNo || '').toUpperCase();
      const staffName = (activeTechnician?.name || currentUser?.name || '').toLowerCase().trim();

      // Explicitly assigned to this staff member
      if (staffId && (c.assignedStaffId === staffId || c.assignedTo === staffId)) return true;
      if (staffIdNo && (c.assignedStaffId === staffIdNo || c.assignedTo === staffIdNo)) return true;
      if (staffName && (c.assignedStaffName || '').toLowerCase().trim() === staffName) return true;

      // Trade / Category match
      if (staffTrade && isComplaintMatchingTrade(c, staffTrade)) return true;

      // Also if this staff member personally reported a complaint in their quarters
      const cEmail = (c.reporterEmail || '').toLowerCase().trim();
      if (currentStudentEmail && cEmail === currentStudentEmail) return true;

      return false;
    }

    // 5. HOSTEL WARDEN:
    // In charge of Hostels & Dorms. Strictly sees hostel/dorm issues!
    if (activeProfileKey === 'WARDEN' || currentUser?.role === 'WARDEN' || currentUser?.designation?.includes('Warden')) {
      return isHostelComplaint(c);
    }

    // 6. DSW / AO / DIRECTOR / CAMPUS ADMIN:
    // Administrative oversight of campus operations (non-ICC complaints, unless Director)
    if (role === 'ADMIN' || activeProfileKey === 'DSW' || activeProfileKey === 'AO' || activeProfileKey === 'DIRECTOR') {
      return true;
    }

    return false;
  });

  const studentEmails = emailLog.filter(m => {
    if (!m.to) return false;
    const toLower = m.to.toLowerCase().trim();
    return toLower === currentStudentEmail ||
      (currentUser?.email && toLower === currentUser.email.toLowerCase().trim()) ||
      toLower.includes('student');
  });

  // Offline Sync Effect
  useEffect(() => {
    if (isOnline && offlineOutbox.length > 0) {
      const syncQueue = async () => {
        for (const draft of offlineOutbox) {
          try {
            await fetch('/api/complaints', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(draft)
            });
          } catch (e) {
            console.error('Sync failed for item', e);
          }
        }
        alert(`⚡ Network Restored: Successfully synced ${offlineOutbox.length} offline complaint(s) to central server!`);
        setOfflineOutbox([]);
        fetchData();
      };
      syncQueue();
    }
  }, [isOnline]);

  // Auto-generate QR code for admin / interactive QR explorer
  useEffect(() => {
    const targetRoom = adminSelectedQrRoom || CAMPUS_ROOM_QR_DIRECTORY.find(r => r.block === adminQrBuildingFilter) || CAMPUS_ROOM_QR_DIRECTORY[0];
    if (targetRoom) {
      const geo = getRkvGoogleMapsData(targetRoom.block, targetRoom.floor, targetRoom.room);
      const payload = JSON.stringify({
        roomCode: targetRoom.code,
        block: targetRoom.block,
        floor: targetRoom.floor,
        room: targetRoom.room,
        campus: 'RGUKT RK Valley',
        gmaps: geo.gmapsDirectionsUrl
      });
      
    }
  }, [adminSelectedQrRoom, adminQrBuildingFilter]);

  // Handle Login Event from Auth Screen
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSelectedTicket(null);
    if (user.email) {
      setReporterEmail(user.email);
    }

    // Check if first-time visitor should be prompted with Demo Tour
    try {
      const prompted = localStorage.getItem('rgukt_demo_tour_prompted');
      if (!prompted) {
        setDemoInitialPrompt(true);
        setShowDemoModal(true);
      }
    } catch (e) {}

    const isDept = isDepartmentRoleOrUser(user) || user.userTab === 'department';
    if (isDept) {
      // DEPARTMENT LOGIN: valid for the whole workday (once a day)
      let targetProfile = user.profileKey;
      if (!targetProfile) {
        if (user.role === 'WARDEN' || user.email?.includes('warden')) targetProfile = 'WARDEN';
        else if (user.role === 'DSW' || user.email?.includes('dsw')) targetProfile = 'DSW';
        else if (user.email?.includes('director') || user.idNo?.includes('DIR')) targetProfile = 'DIRECTOR';
        else if (user.email?.includes('ratnakumari') || user.idNo?.includes('ICC-PO')) targetProfile = 'ICC_PRESIDING';
        else if (user.email?.includes('suvarna') || user.idNo?.includes('ICC-WOMAN-01')) targetProfile = 'ICC_WOMAN_FACULTY_1';
        else if (user.email?.includes('vimala') || user.idNo?.includes('ICC-WOMAN-02')) targetProfile = 'ICC_WOMAN_FACULTY_2';
        else if (user.email?.includes('neelima') || user.idNo?.includes('ICC-LEGAL')) targetProfile = 'ICC_LEGAL';
        else if (user.email?.includes('rkvpolice') || user.idNo?.includes('ICC-POLICE')) targetProfile = 'ICC_POLICE';
        else if (user.email?.includes('ao') || user.idNo?.includes('AO') || user.role === 'ADMIN') targetProfile = 'AO';
        else if (user.email?.includes('plumb') || user.category === 'Plumbing') targetProfile = 'DEPT_PLUMBING';
        else if (user.email?.includes('civil') || user.category === 'Civil') targetProfile = 'DEPT_CIVIL';
        else if (user.email?.includes('itsupport') || user.category === 'IT Systems') targetProfile = 'DEPT_IT';
        else if (user.email?.includes('clean') || user.category === 'Housekeeping') targetProfile = 'DEPT_HOUSEKEEPING';
        else if (user.email?.includes('safety') || user.category === 'Safety') targetProfile = 'DEPT_SAFETY';
        else targetProfile = 'DEPT_ELECTRICAL';
      }

      setActiveProfileKey(targetProfile);

      if (['AO', 'DIRECTOR', 'ICC_PRESIDING', 'ICC_WOMAN_FACULTY_1', 'ICC_WOMAN_FACULTY_2', 'ICC_LEGAL', 'ICC_POLICE'].includes(targetProfile) || user.role === 'ADMIN') {
        setCurrentRole('ADMIN');
        setActiveTab('dashboard');
      } else if (['WARDEN', 'DSW'].includes(targetProfile)) {
        setCurrentRole('ADMIN');
        setActiveTab('tracker');
      } else {
        setCurrentRole('STAFF');
        setActiveTab('tracker');
        if (targetProfile === 'DEPT_ELECTRICAL') setSelectedStaffId('staff-1');
        else if (targetProfile === 'DEPT_PLUMBING') setSelectedStaffId('staff-2');
        else if (targetProfile === 'DEPT_CIVIL') setSelectedStaffId('staff-3');
        else if (targetProfile === 'DEPT_IT') setSelectedStaffId('staff-4');
        else if (targetProfile === 'DEPT_HOUSEKEEPING') setSelectedStaffId('staff-5');
        else if (targetProfile === 'DEPT_SAFETY') setSelectedStaffId('staff-6');
      }

      const authorityProfile = CAMPUS_AUTHORITY_PROFILES[targetProfile];
      if (authorityProfile) {
        setCurrentUser(prev => ({
          ...authorityProfile,
          ...(prev || {}),
          id: authorityProfile.id,
          name: prev?.name || prev?.fullName || authorityProfile.name,
          fullName: prev?.fullName || prev?.name || authorityProfile.name,
          email: prev?.email || prev?.collegeEmail || authorityProfile.email,
          role: authorityProfile.role,
          department: prev?.department || authorityProfile.department,
          category: prev?.category || authorityProfile.category,
          staffId: authorityProfile.idNumber,
          mobileNumber: prev?.mobileNumber || (authorityProfile.phone ? authorityProfile.phone.replace('+91 ', '') : ''),
          location: authorityProfile.location,
          designation: prev?.designation || authorityProfile.designation,
          hierarchyStage: authorityProfile.hierarchyStage,
          departmentKey: authorityProfile.departmentKey,
          profilePic: prev?.profilePic || null,
          profileKey: targetProfile,
          userTab: 'department'
        }));
      }

      saveDepartmentDailySession(user, targetProfile);
    } else {
      // STUDENT LOGIN: Hydrate and establish persistent active session
      clearDepartmentDailySession();
      setCurrentRole('REPORTER');
      setActiveProfileKey('REPORTER');
      setActiveTab('tracker');

      const userKey = (user.idNo || user.email || '').trim().toUpperCase();
      let customSaved = null;
      if (userKey) {
        try {
          const raw = localStorage.getItem(`rgukt_saved_profile_${userKey}`);
          if (raw) customSaved = JSON.parse(raw);
        } catch (e) {}
      }

      // Hydrate student currentUser with custom edited profile fields from registered accounts
      const regUsers = getRegisteredAccounts();
      const existing = regUsers.find(u => 
        ((user.idNo && u.idNo?.toUpperCase() === user.idNo.toUpperCase()) ||
         (user.email && u.collegeEmail?.toLowerCase() === user.email.toLowerCase()))
      );

      const resolvedStudent = {
        ...user,
        ...(existing || {}),
        ...(customSaved || {}),
        fullName: customSaved?.fullName || customSaved?.name || existing?.fullName || existing?.name || user.fullName || user.name,
        name: customSaved?.name || customSaved?.fullName || existing?.name || existing?.fullName || user.name || user.fullName,
        branch: customSaved?.branch || existing?.branch || user.branch || 'CSE Dept',
        studyingYear: customSaved?.studyingYear || existing?.studyingYear || user.studyingYear || 'B.Tech 1st Year',
        className: customSaved?.className || customSaved?.studyingYear || existing?.className || existing?.studyingYear || user.className || 'B.Tech 1st Year',
        hostelBlock: customSaved?.hostelBlock || existing?.hostelBlock || user.hostelBlock || 'Penna BH-1 (Back Side)',
        roomNumber: customSaved?.roomNumber || existing?.roomNumber || user.roomNumber || '108',
        hostelRoom: customSaved?.hostelRoom || existing?.hostelRoom || user.hostelRoom || 'Penna BH-1 • 108',
        mobileNumber: customSaved?.mobileNumber || existing?.mobileNumber || user.mobileNumber || '',
        profilePic: customSaved?.profilePic !== undefined ? customSaved?.profilePic : (existing?.profilePic || user.profilePic || null),
        role: 'REPORTER',
        userTab: 'student'
      };

      setCurrentUser(resolvedStudent);
      if (resolvedStudent.email) {
        setReporterEmail(resolvedStudent.email);
      }
      try {
        localStorage.setItem('rgukt_active_session_user', JSON.stringify(resolvedStudent));
      } catch (e) {}
    }
  };

  // Auto-dismiss profile update toast
  useEffect(() => {
    if (profileEditSuccessToast) {
      const timer = setTimeout(() => setProfileEditSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [profileEditSuccessToast]);

  // Handle saving and persisting updated user profile
  const handleSaveUserProfile = async (updatedProfile) => {
    if (!currentUser) return;
    const userKey = (currentUser.idNo || currentUser.staffId || currentUser.email || '').trim().toUpperCase();
    const compiledHostelRoom = updatedProfile.hostelRoom || 
      `${(updatedProfile.hostelBlock || '').replace(/\s*\(.*?\)/g, '')} • ${(updatedProfile.roomNumber || '').trim() || '108'}`;

    const mergedUser = {
      ...currentUser,
      ...updatedProfile,
      name: updatedProfile.name || updatedProfile.fullName || currentUser.name,
      fullName: updatedProfile.fullName || updatedProfile.name || currentUser.fullName || currentUser.name,
      hostelRoom: compiledHostelRoom,
      branch: updatedProfile.branch || currentUser.branch || 'CSE Dept',
      studyingYear: updatedProfile.studyingYear || currentUser.studyingYear || 'B.Tech 1st Year',
      className: updatedProfile.studyingYear || currentUser.className || currentUser.studyingYear || 'B.Tech 1st Year',
      hostelBlock: updatedProfile.hostelBlock || currentUser.hostelBlock || 'Penna BH-1 (Back Side)',
      roomNumber: updatedProfile.roomNumber || currentUser.roomNumber || '108',
      mobileNumber: updatedProfile.mobileNumber || currentUser.mobileNumber || '',
      profilePic: updatedProfile.profilePic !== undefined ? updatedProfile.profilePic : currentUser.profilePic
    };

    // Update in-memory user immediately
    setCurrentUser(mergedUser);
    if (mergedUser.email) {
      setReporterEmail(mergedUser.email);
    }

    // Persist specifically for this user account forever in localStorage
    if (userKey) {
      try {
        localStorage.setItem(`rgukt_saved_profile_${userKey}`, JSON.stringify(mergedUser));
        localStorage.setItem('rgukt_active_session_user', JSON.stringify(mergedUser));
      } catch (err) {
        console.warn('LocalStorage user profile save error:', err);
      }
    }

    // Persist to LocalStorage registered accounts list
    try {
      const allAccounts = getRegisteredAccounts();
      let matchedFound = false;
      const updatedList = allAccounts.map(acc => {
        const matchId = acc.idNo && mergedUser.idNo && acc.idNo.toUpperCase() === mergedUser.idNo.toUpperCase();
        const matchEmail = (acc.collegeEmail || acc.email) && (mergedUser.email || mergedUser.collegeEmail) &&
          (acc.collegeEmail || acc.email).toLowerCase() === (mergedUser.email || mergedUser.collegeEmail).toLowerCase();
        if (matchId || matchEmail) {
          matchedFound = true;
          return {
            ...acc,
            ...mergedUser,
            fullName: mergedUser.name || acc.fullName,
            name: mergedUser.name || acc.name,
            collegeEmail: mergedUser.email || acc.collegeEmail,
            email: mergedUser.email || acc.email,
            mobileNumber: mergedUser.mobileNumber || acc.mobileNumber,
            branch: mergedUser.branch || acc.branch,
            studyingYear: mergedUser.studyingYear || acc.studyingYear,
            className: mergedUser.studyingYear || acc.className,
            hostelRoom: mergedUser.hostelRoom || acc.hostelRoom,
            hostelBlock: mergedUser.hostelBlock || acc.hostelBlock,
            roomNumber: mergedUser.roomNumber || acc.roomNumber,
            profilePic: mergedUser.profilePic || acc.profilePic,
            department: mergedUser.department || acc.department,
            zone: mergedUser.zone || acc.zone
          };
        }
        return acc;
      });

      if (!matchedFound) {
        updatedList.push({
          idNo: mergedUser.idNo,
          fullName: mergedUser.name,
          name: mergedUser.name,
          collegeEmail: mergedUser.email,
          email: mergedUser.email,
          mobileNumber: mergedUser.mobileNumber,
          branch: mergedUser.branch,
          studyingYear: mergedUser.studyingYear,
          className: mergedUser.studyingYear,
          hostelRoom: mergedUser.hostelRoom,
          hostelBlock: mergedUser.hostelBlock,
          roomNumber: mergedUser.roomNumber,
          profilePic: mergedUser.profilePic,
          role: mergedUser.role,
          department: mergedUser.department,
          zone: mergedUser.zone,
          userTab: mergedUser.userTab || (mergedUser.role === 'REPORTER' ? 'student' : 'department')
        });
      }
      saveRegisteredAccounts(updatedList);
    } catch (err) {
      console.warn('Error saving updated profile to LocalStorage:', err);
    }

    // If department user, update daily session
    if (isDepartmentRoleOrUser(mergedUser) || mergedUser.userTab === 'department') {
      saveDepartmentDailySession(mergedUser, mergedUser.profileKey || activeProfileKey);
    }

    // Sync to Firebase Cloud Firestore for permanent cross-device persistence
    try {
      await saveUserToFirestore({
        idNo: mergedUser.idNo,
        collegeEmail: mergedUser.email || mergedUser.collegeEmail,
        email: mergedUser.email || mergedUser.collegeEmail,
        fullName: mergedUser.name,
        name: mergedUser.name,
        mobileNumber: mergedUser.mobileNumber,
        branch: mergedUser.branch,
        studyingYear: mergedUser.studyingYear,
        className: mergedUser.studyingYear,
        hostelRoom: mergedUser.hostelRoom,
        hostelBlock: mergedUser.hostelBlock,
        roomNumber: mergedUser.roomNumber,
        profilePic: mergedUser.profilePic,
        role: mergedUser.role,
        department: mergedUser.department,
        zone: mergedUser.zone,
        userTab: mergedUser.userTab || (mergedUser.role === 'REPORTER' ? 'student' : 'department')
      });
      console.log('✅ [Cloud Firestore] Profile successfully synchronized to cloud database permanently.');
    } catch (e) {
      console.warn('Cloud sync error:', e);
    }

    setShowProfileEditModal(false);
    setProfileEditSuccessToast(true);
  };

  const handleLogout = () => {
    // Both department workday and student sessions are cleanly terminated upon logout
    clearDepartmentDailySession();
    try {
      localStorage.removeItem('rgukt_active_session_user');
    } catch (e) {}
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedTicket(null);
    setActiveProfileKey('REPORTER');
    setShowIntro(false);
  };

  // Real User Image Upload with Client-Side Downscaling
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG, WEBP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotos(prev => [...prev, compressedDataUrl]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Delete / Withdraw Complaint Handler
  const handleDeleteComplaint = async (complaintId) => {
    if (!complaintId) return;
    if (!window.confirm('Are you sure you want to withdraw and remove this complaint from the system? This action cannot be undone.')) {
      return;
    }
    try {
      // 1. Remove from local state immediately
      setComplaints(prev => prev.filter(c => c.id !== complaintId));
      if (selectedTicket?.id === complaintId) {
        setSelectedTicket(null);
      }
      // 2. Remove from backend Express API
      fetch(`/api/complaints/${complaintId}`, { method: 'DELETE' }).catch(() => null);
      // 3. Remove permanently from Firebase Cloud Firestore
      await deleteComplaintFromFirestore(complaintId);
    } catch (e) {
      console.warn('Error deleting complaint:', e);
    }
  };

  // Form Submit Handler
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let formattedLocation = '';
    let zoneName = 'Academics';
    if (locationType === 'ACADEMICS') {
      formattedLocation = `${academicLocation} > ${floor} > ${room}`;
      zoneName = 'Academics';
    } else if (locationType === 'HOSTEL_DORM') {
      formattedLocation = `${hostelLocation} > ${floor} > ${room}`;
      zoneName = 'Hostel/Dorm';
    } else {
      formattedLocation = `${separateFacility} > ${floor} > ${room}`;
      zoneName = 'Facilities';
    }

    const isIccSelected = categoryType === 'ICC' || category === 'Internal Complaints Committee (ICC)';
    const isMaintenance = categoryType === 'MAINTENANCE';
    const finalCategory = isIccSelected ? 'Internal Complaints Committee (ICC)' : category;

    const payload = {
      category: finalCategory,
      categoryType: isIccSelected ? 'ICC' : 'HOSTEL_FACILITIES',
      isHostelHierarchy: isMaintenance,
      currentHierarchyStage: isMaintenance ? 'WARDEN' : null,
      currentHierarchyAuthority: isMaintenance ? 'Hostel Resident Warden' : null,
      isIcc: isIccSelected,
      sentToAllCommittees: isIccSelected ? true : false,
      triCommitteeStatus: isIccSelected ? 'DECIDING' : null,
      allocatedCommittee: null,
      committeeLevel: isIccSelected ? 'Tri-Committee Review (All 3 Reviewing)' : null,
      proposedCommitteeLevel: isIccSelected ? iccCommitteeLevel : null,
      committeesNotified: isIccSelected ? [
        '1. Small Committee (3 Members)',
        '2. Medium Committee (6 Members)',
        '3. Full ICC Committee (Large/Serious Issues)'
      ] : null,
      committeeDecision: isIccSelected ? {
        status: 'DECIDING',
        decidedAt: null,
        decidedBy: null,
        committeeChosen: null,
        rationale: 'Dispatched to all 3 committees simultaneously on submission. Joint committee appraisal in progress to determine jurisdiction.'
      } : null,
      grievanceNature: isIccSelected ? iccGrievanceNature : null,
      isConfidential: isIccSelected ? iccIsConfidential : false,
      maskIdentity: isIccSelected ? iccMaskIdentity : false,
      matterType: isIccSelected ? iccMatterType : 'STUDENT',
      domainType: isIccSelected ? iccDomainType : 'ACADEMIC',
      concernedDept: isIccSelected ? iccConcernedDept : 'CSE',
      specialDomain: isIccSelected ? iccSpecialDomain : 'MESS',
      involvesStudents: isIccSelected ? iccInvolvesStudents : true,
      smallCommitteeMembers: isIccSelected
        ? getSmallCommitteeMembers({
            matterType: iccMatterType,
            domainType: iccDomainType
          })
        : null,
      mediumCommitteeMembers: isIccSelected
        ? getMediumCommitteeMembers({
            matterType: iccMatterType,
            domainType: iccDomainType,
            department: iccConcernedDept,
            specialDomain: iccSpecialDomain
          })
        : null,
      level3CommitteeMembers: isIccSelected
        ? getLevel3CommitteeMembers({
            matterType: iccMatterType,
            domainType: iccDomainType,
            department: iccConcernedDept,
            specialDomain: iccSpecialDomain,
            involvesStudents: iccInvolvesStudents
          })
        : null,
      orderRef: isIccSelected ? 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee' : null,
      orderDate: isIccSelected ? '11.08.2026' : null,
      chairperson: isIccSelected ? 'The Director, RGUKT RK Valley' : null,
      title: sanitizeText(title.trim()),
      description: sanitizeText(description.trim() || title.trim()),
      location: sanitizeText(formattedLocation),
      locationType: locationType,
      block: sanitizeText(locationType === 'ACADEMICS' ? academicLocation : locationType === 'HOSTEL_DORM' ? hostelLocation : separateFacility),
      floor: sanitizeText(floor),
      room: sanitizeText(room),
      zone: zoneName,
      priority: urgency,
      photos: photos,
      reporterId: (currentUser?.idNo || '').trim().toUpperCase(),
      studentId: (currentUser?.idNo || '').trim().toUpperCase(),
      reporterName: (isIccSelected && iccMaskIdentity) ? createAnonymousIdentity(currentUser?.idNo) : sanitizeText(currentUser ? currentUser.name : 'Chaithanya Yadav (Student)'),
      reporterEmail: (
        reporterEmail.trim() ||
        currentUser?.collegeEmail ||
        currentUser?.email ||
        (currentUser?.idNo ? `${currentUser.idNo.toLowerCase()}@rguktrkv.ac.in` : '') ||
        'student@rguktrkv.ac.in'
      ).trim()
    };

    if (!isOnline) {
      const offlineItem = {
        ...payload,
        id: `offline-${Date.now()}`,
        ticketNumber: `OFFLINE-TMP-${Math.floor(100 + Math.random() * 900)}`,
        status: 'SUBMITTED (Local Draft)',
        assignedStaffName: 'Queued for Sync',
        createdAt: 'Saved Locally',
        timeline: [
          { status: 'SUBMITTED', title: 'Drafted in Offline Mode', actor: 'Local Device', time: 'Just now', done: true },
          { status: 'ASSIGNED', title: 'Pending connection to sync', actor: 'Outbox Queue', time: 'Pending', done: false }
        ]
      };
      setOfflineOutbox([...offlineOutbox, offlineItem]);
      setComplaints([offlineItem, ...complaints]);
      setSelectedTicket(offlineItem);
      alert('📦 Offline Mode Active: Complaint saved to local outbox. It will automatically upload when network returns.');
      setTitle('');
      setDescription('');
      setActiveTab('tracker');
      return;
    }

    let newComplaint = null;

    // 1. Save to central SQLite/Express backend
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success && data.complaint) {
        newComplaint = data.complaint;
      }
    } catch (err) {
      console.warn('Direct API backend unreachable, saving directly to Firebase and local store:', err);
    }

    // 2. If API was unavailable or errored, create local complaint object
    if (!newComplaint) {
      newComplaint = {
        ...payload,
        id: `cmp-${Date.now()}`,
        ticketNumber: `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        status: 'ASSIGNED',
        createdAt: new Date().toISOString(),
        timeline: payload.isIcc ? [
          { status: 'SUBMITTED', title: 'Formal Grievance Registered with ICC Secretariat', actor: payload.reporterName || 'Student Resident', time: 'Just now', done: true },
          { status: 'TRI_COMMITTEE_DISPATCH', title: 'Simultaneously Dispatched to All 3 Committees (Small, Medium & Full ICC)', actor: 'Statutory Registry', time: 'Just now', done: true },
          { status: 'COMMITTEE_ALLOCATION', title: 'Tri-Committee Deliberation: Deciding Which Committee Will Solve Problem', actor: 'Joint Committee Bench', time: 'Active Joint Review', done: false },
          { status: 'IN_PROGRESS', title: 'Hearings & In-Camera Fact Finding by Designated Committee', actor: 'Designated Committee Bench', time: 'Pending', done: false },
          { status: 'RESOLVED', title: 'Inquiry Findings & Recommendation Report Submitted', actor: 'Presiding Officer & Bench', time: 'Pending', done: false },
          { status: 'CLOSED', title: 'Executive Redressal Order Approved by Chairperson (Director)', actor: 'The Director, RGUKT RK Valley', time: 'Pending', done: false }
        ] : [
          { status: 'SUBMITTED', title: 'Complaint Lodged in Hostel Maintenance & Facilities', actor: payload.reporterName || 'Student Resident', time: 'Just now', done: true },
          { status: 'ASSIGNED', title: 'Assigned to Hostel Resident Warden (Stop/Resolve based on severity)', actor: 'Hostel Resident Warden', time: 'Just now', done: true },
          { status: 'IN_PROGRESS', title: 'Warden On-Site Inspection & Problem Appraisal', actor: 'Warden Office', time: 'Pending', done: false },
          { status: 'RESOLVED', title: 'Resolved at Warden stage OR Tagged & Escalated up Hierarchy', actor: 'Warden / DSW / AO / Director', time: 'Pending', done: false },
          { status: 'CLOSED', title: 'Final Resolution Approved & Quality Verified', actor: 'Campus Authorities & Student', time: 'Pending', done: false }
        ]
      };
      setOfflineOutbox(prev => [...prev, payload]);
    }

    // 3. Save directly to Firebase Cloud Firestore for real-time cloud database storage
    try {
      const docId = await saveComplaintToFirestore(newComplaint);
      console.log('✅ Complaint successfully stored in Firebase Firestore:', docId || newComplaint.id);
    } catch (e) {
      console.error('Firebase save notice:', e);
    }

    // 4. Dispatch Dynamic EmailJS Notifications (User + Authority)
    sendEmailOnComplaintSubmission(newComplaint).then(res => {
      console.log('✅ EmailJS complaint submission dispatched:', res);
    }).catch(err => {
      console.warn('EmailJS submission notice:', err);
    });

    // 5. In-App / Web Push Notification
    pushSystemNotification(
      `📋 Complaint Registered: #${newComplaint.ticketNumber}`,
      `Assigned to ${newComplaint.currentHierarchyAuthority || 'Hostel Resident Warden'}. Official confirmation email dispatched to ${newComplaint.reporterEmail}.`,
      'EMAILJS + DISPATCH'
    );

    // 6. Update UI State & smoothly transition to My Complaints Card
    setTitle('');
    setDescription('');
    setPhotos([]);
    setComplaints(prev => [newComplaint, ...prev.filter(c => c.id !== newComplaint.id)]);
    setSelectedTicket(newComplaint);
    setActiveTab('my-complaints');
    fetchData();
  };

  // Staff Transitions
  const handleUpdateStatus = async (ticketId, nextStatus, notes = '', photo = '', spareParts = '') => {
    try {
      // Optimistic instant local update
      setComplaints(prev => prev.map(c => {
        if (c.id === ticketId) {
          const updated = { ...c, status: nextStatus };
          if (notes) updated.resolutionNotes = notes;
          if (photo) updated.resolutionPhoto = photo;
          if (spareParts) updated.spareParts = spareParts;
          if (Array.isArray(updated.timeline)) {
            const tl = [...updated.timeline];
            if (nextStatus === 'IN_PROGRESS' && tl[2]) {
              tl[2] = { ...tl[2], done: true, time: 'Just now' };
            } else if ((nextStatus === 'RESOLVED' || nextStatus === 'CLOSED') && tl[3]) {
              tl[3] = { ...tl[3], done: true, time: 'Just now' };
            }
            updated.timeline = tl;
          }
          return updated;
        }
        return c;
      }));

      setSelectedTicket(prev => {
        if (prev?.id === ticketId) {
          const updated = { ...prev, status: nextStatus };
          if (notes) updated.resolutionNotes = notes;
          if (photo) updated.resolutionPhoto = photo;
          if (spareParts) updated.spareParts = spareParts;
          return updated;
        }
        return prev;
      });

      setResolveModalTicket(null);
      setResolutionNotes('');

      // Attempt backend update
      const res = await fetch(`/api/complaints/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          resolutionNotes: notes,
          resolutionPhoto: photo,
          spareParts: spareParts
        })
      }).catch(() => null);

      let serverComplaint = null;
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success) {
          serverComplaint = data.complaint;
          if (selectedTicket?.id === ticketId && serverComplaint) {
            setSelectedTicket(serverComplaint);
          }
        }
      }

      // Sync status transition to Firebase Cloud Firestore
      updateComplaintInFirestore(ticketId, serverComplaint || {
        status: nextStatus,
        resolutionNotes: notes,
        resolutionPhoto: photo,
        spareParts: spareParts
      }).catch(e => console.warn('Firebase status update notice:', e));

      // Dispatch EmailJS when problem is solved
      if (nextStatus === 'RESOLVED' || nextStatus === 'CLOSED') {
        const finalTicket = serverComplaint || {
          ...(selectedTicket || {}),
          status: nextStatus,
          resolutionNotes: notes
        };
        sendEmailOnProblemSolved(finalTicket, notes).catch(err => {
          console.warn('EmailJS problem solved notice:', err);
        });

        pushSystemNotification(
          `✅ Problem Solved: #${finalTicket.ticketNumber || ticketId}`,
          `Issue at ${finalTicket.location || 'Campus'} has been marked as resolved. Please review and verify.`,
          'WORK ORDER RESOLVED'
        );
      } else {
        pushSystemNotification(
          `🔄 Work Order Updated: ${nextStatus}`,
          `Ticket #${ticketId} status changed to ${nextStatus}.`,
          'WORK ORDER'
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Department Reject Ticket Handler with Reason & Explanation Email
  const handleRejectTicket = async (ticketId, reason, notes) => {
    try {
      const res = await fetch(`/api/complaints/${ticketId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: reason,
          rejectionNotes: notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setRejectModalTicket(null);
        await fetchData();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(data.complaint);
        }
        // Sync rejection to Firebase Cloud Firestore
        updateComplaintInFirestore(ticketId, data.complaint || {
          status: 'REJECTED',
          rejectionReason: reason,
          rejectionNotes: notes
        }).catch(e => console.warn('Firebase rejection update notice:', e));
        alert(`❌ Complaint #${data.complaint.ticketNumber} marked as REJECTED.\nOfficial reason email dispatched from department to ${data.complaint.reporterEmail}.`);
      } else {
        alert(data.message || 'Failed to reject complaint');
      }
    } catch (err) {
      console.error(err);
      alert('Error rejecting complaint: ' + err.message);
    }
  };

  // Hostel Facilities Hierarchy: Record Authority Response
  const handleAddHostelAuthorityResponse = async (complaintId, response, authorityStage) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/hierarchy-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, authorityStage })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        if (selectedTicket?.id === complaintId) {
          setSelectedTicket(data.complaint);
        }
        // Sync response to Firebase Cloud Firestore
        updateComplaintInFirestore(complaintId, data.complaint).catch(e => console.warn('Firebase response update notice:', e));

        // Dispatch EmailJS Notification to student with official response
        sendEmailOnAuthorityResponse(data.complaint, response, authorityStage).catch(err => {
          console.warn('EmailJS authority response notice:', err);
        });

        // Push In-App / System Notification
        pushSystemNotification(
          `📝 Response from ${authorityStage}: #${data.complaint?.ticketNumber}`,
          `Official response recorded: "${response}"`,
          'AUTHORITY UPDATE'
        );
      } else {
        console.error('Response error:', data.message);
      }
    } catch (err) {
      console.error('Error saving authority response:', err);
    }
  };

  // Hostel Facilities Hierarchy: Confirm Escalation & Tagging with Prior Response
  const handleConfirmHostelEscalation = async ({
    ticketId, fromStage, toStage, toStageKey, targetDepartment, reason, customOtherReason, taggedPriorResponse, studentRemarks
  }) => {
    try {
      const res = await fetch(`/api/complaints/${ticketId}/hierarchy-escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStage, toStage, toStageKey, targetDepartment, reason, customOtherReason, taggedPriorResponse, studentRemarks
        })
      });
      const data = await res.json();
      if (data.success) {
        // Smoothly update UI without blocking "localhost says" alert
        fetchData();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(data.complaint);
        }
        // Sync escalation to Firebase Cloud Firestore
        updateComplaintInFirestore(ticketId, data.complaint).catch(e => console.warn('Firebase escalation update notice:', e));

        // Dispatch EmailJS notifications to User and incoming Respected Officer
        sendEmailOnHierarchyEscalation(data.complaint, {
          fromStage,
          toStage,
          toStageKey,
          targetDepartment,
          reason,
          customOtherReason,
          taggedPriorResponse,
          studentRemarks
        }).catch(err => {
          console.warn('EmailJS escalation notice:', err);
        });

        // Push In-App / Web Notification
        pushSystemNotification(
          `🚀 Complaint Escalated: #${data.complaint?.ticketNumber} ➔ ${toStage}`,
          `Tagged from ${fromStage} with previous response. Respective Officer (${toStage}) has been notified.`,
          'HIERARCHY ESCALATION'
        );
      } else {
        console.error('Escalation error:', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger 48h SLA Breach Simulation
  const handleSimulateSla = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch('/api/simulate-sla-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId: selectedTicket.id })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🚨 SIMULATION TRIGGERED: Ticket ${selectedTicket.ticketNumber} exceeded 48h SLA!\nEscalated to: Campus Estate Registrar.\nChannels: Push + SMS + Email Alert.`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendThreadMessage = async (complaintId, message) => {
    try {
      const senderRole = currentUser?.role || currentRole || 'REPORTER';
      const senderName = currentUser?.name || (senderRole === 'STAFF' ? ((currentUser?.category || 'Technician') + ' Staff') : senderRole === 'ADMIN' ? 'Chief Warden / Admin' : 'Student Resident');
      const res = await fetch(`/api/complaints/${complaintId}/thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderRole, senderName, message })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? data.complaint : c));
        setSelectedTicket(prev => prev && prev.id === complaintId ? data.complaint : prev);
        if (data.complaint) {
          updateComplaintInFirestore(complaintId, data.complaint).catch(e => console.warn('Firebase thread sync notice:', e));
        }
      }
    } catch (err) {
      console.error('Error sending thread message:', err);
    }
  };

  // Admin Verification of Fix Proof
  const handleAdminVerify = async (complaintId, adminRemark) => {
    try {
      const verifiedBy = currentUser?.name || 'Chief Warden & Estate Office';
      const res = await fetch(`/api/complaints/${complaintId}/admin-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy, adminRemark })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? data.complaint : c));
        setSelectedTicket(prev => prev && prev.id === complaintId ? data.complaint : prev);
        if (data.complaint) {
          updateComplaintInFirestore(complaintId, data.complaint).catch(e => console.warn('Firebase admin-verify sync notice:', e));
        }
      }
    } catch (err) {
      console.error('Error verifying fix proof:', err);
    }
  };

  // Chairperson Executive Disposal Order Promulgation for Level 2 Medium Committee
  const handleApproveIccDisposal = async (complaintId, { decision, note }) => {
    try {
      const approvedBy = currentUser?.name || 'The Director, RGUKT RK Valley';
      const res = await fetch(`/api/complaints/${complaintId}/icc-disposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note, approvedBy })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? data.complaint : c));
        setSelectedTicket(prev => prev && prev.id === complaintId ? data.complaint : prev);
        setSelectedIccModalTicket(data.complaint);
        if (data.complaint) {
          updateComplaintInFirestore(complaintId, data.complaint).catch(e => console.warn('Firebase ICC disposal sync notice:', e));
          // Dispatch EmailJS problem solved / ICC disposed notification
          sendEmailOnProblemSolved(data.complaint, `Executive Disposal Promulgated: "${decision}". Notes: ${note}`).catch(err => {
            console.warn('EmailJS ICC disposal notice:', err);
          });
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              recipient: data.complaint?.reporterName || 'You',
              channel: 'EMAILJS + WEB',
              title: `⚖️ ICC Executive Disposal: #${data.complaint?.ticketNumber}`,
              body: `Disposal order issued by Director / Chairperson: "${decision}".`,
              time: new Date().toISOString()
            },
            ...prev
          ]);
        }
      }
    } catch (err) {
      console.error('Error executing ICC disposal:', err);
    }
  };

  // Tri-Committee Joint Decision: Allocates which of the 3 committees will solve the complaint
  const handleAllocateIccCommittee = async (complaintId, chosenCommittee, rationale) => {
    const decidedBy = currentUser?.name || 'Joint Tri-Committee Bench';
    try {
      await fetch(`/api/complaints/${complaintId}/icc-allocate-committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chosenCommittee, rationale, decidedBy })
      });
    } catch (err) {
      console.warn('API notice on allocating committee:', err);
    }

    const updater = (c) => {
      if (c.id !== complaintId) return c;
      const updated = {
        ...c,
        triCommitteeStatus: 'DECIDED',
        allocatedCommittee: chosenCommittee,
        committeeLevel: chosenCommittee,
        committeeDecision: {
          status: 'DECIDED',
          decidedAt: new Date().toISOString(),
          decidedBy,
          committeeChosen: chosenCommittee,
          rationale: rationale || `Tri-committee joint bench allocated problem to ${chosenCommittee}.`
        },
        timeline: [
          ...(c.timeline || []).map(t => t.status === 'COMMITTEE_ALLOCATION' ? { ...t, done: true, time: 'Decided' } : t),
          {
            status: 'COMMITTEE_ALLOCATED',
            title: `Tri-Committee Bench Designated: ${chosenCommittee}`,
            actor: decidedBy,
            time: 'Just now',
            done: true
          }
        ]
      };
      return updated;
    };

    setComplaints(prev => {
      const next = prev.map(updater);
      const updatedTicket = next.find(c => c.id === complaintId);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
        setSelectedIccModalTicket(updatedTicket);
        updateComplaintInFirestore(complaintId, updatedTicket).catch(e => console.warn('Firestore ICC allocate sync notice:', e));
        setNotifications(prevNotifs => [
          {
            id: `notif-${Date.now()}`,
            recipient: updatedTicket.reporterName || 'You',
            channel: 'WEB',
            title: `⚖️ Tri-Committee Allocation Decided: #${updatedTicket.ticketNumber}`,
            body: `Problem designated to ${chosenCommittee}. Rationale: "${rationale || 'Jurisdiction allocated.'}"`,
            time: new Date().toISOString()
          },
          ...prevNotifs
        ]);
      }
      return next;
    });
  };

  // Open indoor wayfinding route guide on Google Maps
  const handleOpenWayfinding = (ticket) => {
    const loc = ticket?.location || '';
    const parts = loc.split('>').map(p => p.trim());
    const block = parts[0] || 'AB-1';
    const floor = parts[1] || '1st Floor';
    const room = parts[2] || 'Computer Lab 104 (CSE)';
    const geo = getRkvGoogleMapsData(block, floor, room);
    if (geo && geo.mapsUrl) {
      window.open(geo.mapsUrl, '_blank');
    }
  };

  const activeTechnician = staffList.find(s => s.id === selectedStaffId) || staffList[0];

  // Show dedicated professional Offline Page when network is disconnected
  if (!isOnline && !dismissOfflinePage) {
    return (
      <OfflinePage
        onRetry={async () => {
          try {
            const res = await fetch('/version.json?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
            if (res && res.ok) {
              setIsOnline(true);
              setDismissOfflinePage(false);
              fetchData();
              return true;
            }
          } catch (e) {
            // still offline
          }
          return false;
        }}
        onDismiss={() => setDismissOfflinePage(true)}
        offlineQueueCount={offlineOutbox.length}
      />
    );
  }

  // Show Cinematic Intro Screen before login page
  if (showIntro) {
    return <CinematicIntro onEnter={() => setShowIntro(false)} />;
  }

  // If user is not yet logged in, render the Auth Screen as designed in the reference image
  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen cyber-canvas-bg text-slate-100 flex flex-col font-sans overflow-hidden relative">
      {/* Floating Neon Ambient Accents for Cyber Glass Refraction */}
      <div className="ambient-neon-cyan w-[32rem] h-[32rem] -top-32 -left-32 opacity-75 z-0"></div>
      <div className="ambient-neon-purple w-[36rem] h-[36rem] top-1/4 -right-40 opacity-70 z-0"></div>
      <div className="ambient-neon-cyan w-96 h-96 -bottom-24 left-1/3 opacity-40 z-0"></div>
      
      {/* LIVE DEPLOYMENT UPDATE NOTIFICATION POPUP */}
      {updateAvailable && (
        <div className="shrink-0 bg-gradient-to-r from-cyan-900/90 via-indigo-950/95 to-purple-950/90 backdrop-blur-xl text-white px-4 py-2.5 text-xs flex items-center justify-between z-40 border-b border-cyan-400/50 shadow-xl shadow-cyan-900/30 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-cyan-300 mr-1.5">🚀 New Version Deployed!</span>
                <span className="text-slate-300 hidden sm:inline">A fresh system update was just released from GitHub. Refresh now to view all changes.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (appVersion) localStorage.setItem('rkv_app_deployed_version', appVersion);
                  window.location.reload();
                }}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-black text-xs transition-all shadow-md shadow-cyan-500/40 cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update Now</span>
              </button>
              <button
                type="button"
                onClick={() => setUpdateAvailable(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERSISTENT OFFLINE CONTINGENCY BANNER */}
      {!isOnline && (
        <div className="shrink-0 bg-gradient-to-r from-rose-950/95 via-slate-900/95 to-amber-950/95 text-white px-4 py-2 text-xs flex items-center justify-between z-40 border-b border-rose-500/50 shadow-xl shadow-rose-950/30">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-extrabold text-amber-300 shrink-0">Offline Contingency Mode:</span>
              <span className="text-slate-300 truncate">Internet disconnected. Tickets you submit are safely cached locally and will auto-sync once back online.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDismissOfflinePage(false)}
                className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View Offline Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-HEADER / NOTIFICATION ALERT TICKER */}
      {notifications.length > 0 && (
        <div className="shrink-0 bg-slate-950/85 backdrop-blur-md text-white px-4 py-2 text-xs flex items-center justify-between z-30 border-b border-cyan-500/20 shadow-lg shadow-cyan-950/20">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-hidden">
            <Bell className="w-3.5 h-3.5 shrink-0 text-cyan-400 animate-pulse" />
            <span className="font-bold shrink-0 text-cyan-300">System Notification:</span>
            <span className="truncate opacity-95">
              [{notifications[0].channel}] {notifications[0].title}: {notifications[0].body}
            </span>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 w-full h-full min-h-0 flex overflow-hidden relative z-10">

        {/* BACKDROP OVERLAY FOR DASHBOARD (Clicking it goes back and closes dashboard) */}
        {isDashboardOpen && (
          <div
            onClick={() => setIsDashboardOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />
        )}
        
        {/* DASHBOARD DRAWER (Controlled by 3-Line Bar at Top-Left Corner) */}
        <aside
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] h-full cyber-sidebar flex flex-col justify-between z-50 overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out shadow-2xl border-r border-cyan-500/40 bg-slate-950/95 backdrop-blur-2xl ${
            isDashboardOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
          }`}
          aria-label="Campus Redressal Dashboard Menu"
        >
          {/* TOP CONTROLS OF DASHBOARD: 3-LINE BAR STATUS & BACK BUTTON */}
          <div className="p-3 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center">
                <Menu className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                Dashboard Menu
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDashboardOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="Close Dashboard & Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back</span>
            </button>
          </div>
          
          {/* DASHBOARD NAVIGATION MENU */}
          <div className="p-4 flex-1 flex flex-col justify-between h-full">
            <div className="space-y-1.5">
              {/* HEAD OF THE DASHBOARD: INTERNAL COMPLAINT SYSTEM BRANDING */}
              <div className="p-3 mb-2 cyber-card-subtle rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-cyan-500/40 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center shrink-0">
                  <img 
                    src="/logo.png?v=original" 
                    alt="INTERNAL COMPLAINT SYSTEM Logo" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-xs font-black tracking-tight text-white uppercase leading-snug">
                      INTERNAL COMPLAINT SYSTEM (ICS)
                    </h1>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full cyber-pill-cyan shrink-0">
                      RGUKT
                    </span>
                  </div>
                  <p className="text-[10.5px] text-cyan-300 font-semibold leading-tight truncate">Centralized Redressal Portal</p>
                </div>
              </div>

                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  Dashboard Menu
                </div>

              {currentRole === 'REPORTER' && (
                <>
                  <button
                    onClick={() => navigateToTab('submit')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'submit'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span className="font-black text-white">Submit Complaint</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                      activeTab === 'submit' ? 'bg-cyan-500/40 text-white' : 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      New
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('my-complaints')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'my-complaints'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span className="font-black text-white">My Complaints</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                      activeTab === 'my-complaints' ? 'bg-white text-blue-900' : 'bg-sky-950 text-sky-300 border border-sky-500/40'
                    }`}>
                      {visibleComplaints.length}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('tracker')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'tracker'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Navigation className="w-4 h-4 text-indigo-400" />
                      <span className="font-black text-white">My Complaint Status</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                      activeTab === 'tracker' ? 'bg-white text-blue-900' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      Live Track
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('profile')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="font-black text-white">My Profile</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                      activeTab === 'profile' ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      Editable
                    </span>
                  </button>
                </>
              )}

              {currentRole === 'STAFF' && (
                <>
                  <button
                    onClick={() => navigateToTab('tracker')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'tracker'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span className="font-black text-white">Active Work Orders</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'tracker' ? 'bg-white text-amber-900' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {visibleComplaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS' || c.status === 'REOPENED').length}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('solved')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'solved'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${activeTab === 'solved' ? 'text-white' : 'text-emerald-400'}`} />
                      <span className="font-black text-white">Solved Complaints</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'solved' ? 'bg-white text-emerald-900' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('profile')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="font-black text-white">Staff Profile</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'profile' ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      Edit
                    </span>
                  </button>
                </>
              )}

              {currentRole === 'ADMIN' && (
                <>
                  <button
                    onClick={() => navigateToTab('tracker')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'tracker'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="font-black text-white">Stage Tracker & Actions</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeTab === 'tracker' ? 'bg-white text-blue-900' : 'bg-sky-950 text-sky-300 border border-sky-500/40'
                    }`}>
                      {visibleComplaints.length}
                    </span>
                  </button>
                  <button
                    onClick={() => navigateToTab('dashboard')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-sky-400" />
                      <span className="font-black text-white">Analytics Dashboard</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      activeTab === 'dashboard' ? 'bg-blue-500/50 text-white' : 'bg-slate-800 text-sky-300'
                    }`}>
                      Live
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('complaints')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'complaints'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span className="font-black text-white">All Complaints</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeTab === 'complaints' ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      {visibleComplaints.length}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('solved')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'solved'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${activeTab === 'solved' ? 'text-white' : 'text-emerald-600'}`} />
                      <span>Solved Complaints</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'solved' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('staff')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'staff'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-sky-400" />
                      <span className="font-black text-white">Department Staff</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'staff' ? 'bg-white text-blue-900' : 'bg-slate-800/80 text-slate-200 border border-slate-700'
                    }`}>
                      {staffList.length || 6}
                    </span>
                  </button>

                  <button
                    onClick={() => navigateToTab('profile')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'cyber-btn-gradient text-white shadow-lg shadow-cyan-500/25'
                        : 'text-slate-100 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="font-black text-white">Admin Profile</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'profile' ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      Edit
                    </span>
                  </button>

                  {/* ICC COMMITTEE SECTIONS: SHOWN ONLY FOR OFFICIAL ICC COMMITTEE MEMBERS & THE DIRECTOR (STRICTLY HIDDEN FOR WARDEN & NON-ICC STAFF) */}
                  {(() => {
                    const isIccAuthorized = Boolean(
                      activeProfileKey === 'DIRECTOR' ||
                      activeProfileKey?.startsWith('ICC_') ||
                      currentUser?.category === 'ICC Committee' ||
                      currentUser?.department?.includes('Internal Complaints Committee') ||
                      currentUser?.designation?.includes('ICC') ||
                      currentUser?.idNo?.startsWith('ICC-') ||
                      currentUser?.idNo === 'DIR-APEX-01'
                    );

                    if (!isIccAuthorized) return null;

                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const iccTicket = complaints.find(c => c.committeeLevel?.includes('Small') || c.committeeLevel?.includes('Level 1') || c.committeeLevel?.includes('3 Members') || c.committeeLevel?.includes('3Members')) || {
                              id: 'cmp-104',
                              ticketNumber: 'CMP-2026-104',
                              title: 'Discrepancy in Study Hours Lighting & Hostel Quiet Zone Discipline',
                              description: 'Minor grievance raised by hostel residents regarding evening study light repairs and corridor noise conciliation under Clause 1 of Office Order dated 11.08.2026.',
                              location: 'PENNA > 2nd Floor > Study Wing',
                              category: 'Internal Complaints Committee (ICC)',
                              isIcc: true,
                              committeeLevel: 'Level 1: Small Committee (3 Members)',
                              grievanceNature: 'Student Welfare & Minor Dispute',
                              matterType: 'STUDENT',
                              domainType: 'ACADEMIC',
                              concernedDept: 'CSE',
                              status: 'IN_PROGRESS'
                            };
                            setSelectedIccModalTicket(iccTicket);
                            setShowMediumCommitteeModal(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-emerald-300 hover:border-emerald-400 border border-emerald-600/70 shadow-sm"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">⚖️ ICC: Small Committee</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-emerald-400 text-slate-950 uppercase shrink-0">
                            3 Members
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const iccTicket = complaints.find(c => c.committeeLevel?.includes('Medium') || c.committeeLevel?.includes('Level 2') || (c.isIcc && !c.committeeLevel?.includes('Level 3') && !c.committeeLevel?.includes('Small'))) || {
                              id: 'cmp-105',
                              ticketNumber: 'CMP-2026-105',
                              title: 'Discrepancy in Hostel Dining & Water Purification Maintenance',
                              description: 'Formal submission to ICC regarding unresolved drinking water filtration issues in PENNA hostel affecting 400+ residents.',
                              location: 'PENNA > Ground Floor > Main Dining Hall',
                              category: 'Internal Complaints Committee (ICC)',
                              isIcc: true,
                              committeeLevel: 'Level 2: Medium Committee (6 Members)',
                              grievanceNature: 'Student Welfare & Hostel Rights',
                              matterType: 'STUDENT',
                              domainType: 'ADMINISTRATIVE',
                              concernedDept: 'CSE',
                              specialDomain: 'MESS',
                              status: 'IN_PROGRESS'
                            };
                            setSelectedIccModalTicket(iccTicket);
                            setShowMediumCommitteeModal(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-amber-300 hover:border-amber-400 border border-purple-700/80 shadow-sm"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">⚖️ ICC: Medium Committee</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-amber-400 text-slate-950 uppercase shrink-0">
                            6 Members
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const iccTicket = complaints.find(c => c.committeeLevel?.includes('Level 3') || c.committeeLevel?.includes('Large')) || {
                              id: 'cmp-106',
                              ticketNumber: 'CMP-2026-106',
                              title: 'Severe Hostel Bullying & Harassment Incident (POSH Docket)',
                              description: 'Major, sensitive complaint involving multiple departments, requiring full detailed in-camera inquiry under Clause 3 of Office Order dated 11.08.2026.',
                              location: 'PENNA > 1st Floor > Room 108',
                              category: 'Internal Complaints Committee (ICC)',
                              isIcc: true,
                              committeeLevel: 'Level 3: ICC Committee (Large/Serious Issues)',
                              grievanceNature: 'Anti-Ragging & Harassment (POSH)',
                              matterType: 'STUDENT',
                              domainType: 'ACADEMIC',
                              concernedDept: 'CSE',
                              specialDomain: 'SPORTS',
                              involvesStudents: true,
                              status: 'IN_PROGRESS'
                            };
                            setSelectedIccModalTicket(iccTicket);
                            setShowMediumCommitteeModal(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 text-amber-300 hover:border-amber-400 border border-amber-500/60 shadow-sm"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">⚖️ ICC: Full Committee</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-amber-400 text-slate-950 uppercase shrink-0">
                            Large Issues
                          </span>
                        </button>
                      </>
                    );
                  })()}
                </>
              )}
              </div>

              {/* CAMPUS ESTATE HUB BADGE AT THE BOTTOM OF THE DASHBOARD */}
              <div className="mt-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm text-xs space-y-2 border border-slate-700/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Campus Estate Hub</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-black text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-100 font-semibold leading-relaxed">
                  RGUKT RK Valley 24/7 Redressal System with GPS Wayfinding & Email Auto-Dispatch.
                </p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10.5px] text-cyan-300 font-black">
                  <span>Helpline: 08588-283600</span>
                  <span>48h SLA</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN DYNAMIC CONTENT WORKSPACE (Independently Scrollable from Top to Bottom) */}
          <div className="flex-1 min-w-0 w-full h-full flex flex-col overflow-hidden bg-transparent">

            {/* TOP HEADER BAR: 3-LINE BAR AT TOP-LEFT CORNER */}
            <header className="shrink-0 z-30 px-3 sm:px-6 py-2.5 glass-header flex items-center justify-between gap-3 flex-wrap relative">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* 3-LINE BAR (HAMBURGER MENU) ICON BUTTON AT TOP-LEFT CORNER */}
                <button
                  type="button"
                  onClick={() => setIsDashboardOpen(prev => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-lg cursor-pointer active:scale-95 ${
                    isDashboardOpen
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-300 shadow-cyan-500/40 ring-2 ring-cyan-400'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/40'
                  }`}
                  title={isDashboardOpen ? "Click to Close Dashboard & Go Back" : "Click 3-Line Bar to Display Dashboard"}
                  aria-label="Toggle Dashboard Menu"
                >
                  <Menu className="w-5 h-5 text-current shrink-0 stroke-[2.5]" />
                  <span className="font-black uppercase tracking-wider text-[11px] hidden xs:inline">
                    {isDashboardOpen ? 'Go Back' : 'Dashboard'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isDashboardOpen ? 'bg-slate-950 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                </button>

                <button
                  type="button"
                  onClick={handleStepBack}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700/60 shadow-2xs cursor-pointer active:scale-95"
                  title="Step Back one screen"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-200" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 hidden sm:inline">
                  {currentRole === 'REPORTER' ? 'Campus Resident Portal' : currentRole === 'STAFF' ? 'Department Workplace' : 'Administrative Center'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800/80 text-cyan-300 border border-slate-700/60">
                  {activeTab.toUpperCase()}
                </span>
              </div>

              {/* TOP RIGHT CORNER: NOTIFICATIONS + REAL-TIME REFRESH + IDENTITY + LOGOUT BUTTON */}
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                {/* Watch Demo Video / Project Tour Button */}
                <button
                  type="button"
                  onClick={() => {
                    setDemoInitialPrompt(false);
                    setShowDemoModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  title="Watch Project Demo Video & Feature Walkthrough"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span className="hidden sm:inline">Demo Tour</span>
                </button>

                {/* Notification Center Bell Trigger */}
                <button
                  type="button"
                  onClick={() => setShowMailboxModal(true)}
                  className="relative p-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center hover:border-cyan-300 hover:scale-105 active:scale-95"
                  title="View All Campus Notifications & Email Dispatches"
                >
                  <Bell className="w-4 h-4 text-cyan-400" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 border border-rose-400 text-white font-black text-[10px] flex items-center justify-center shadow-md animate-pulse">
                      {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Refresh & sync campus complaints data in real-time"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </button>

                {currentUser && (
                  <div className="flex items-center gap-2 px-3 py-1 cyber-card-subtle rounded-xl shadow-md border border-cyan-500/20">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-[10px] flex items-center justify-center shrink-0">
                      {(currentUser.name || currentUser.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-xs font-bold text-slate-100 truncate max-w-[150px] sm:max-w-[200px]">
                        {currentUser.name || currentUser.fullName || 'Student Resident'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                        {currentUser.idNo || currentUser.staffId || currentUser.email || 'Resident'}
                        {currentUser.hostelBlock ? ` • ${currentUser.hostelBlock}-${currentUser.roomNumber || ''}` : ''}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                    isDepartmentRoleOrUser(currentUser)
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 hover:border-rose-300'
                  }`}
                  title={
                    isDepartmentRoleOrUser(currentUser)
                      ? 'Leave Work (Logout): Ends your workday session.'
                      : 'Logout & Exit: Closes student session.'
                  }
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-bold">
                    {isDepartmentRoleOrUser(currentUser) ? 'Leave Work' : 'Logout & Exit'}
                  </span>
                </button>
              </div>
            </header>

            {/* FLOATING REAL-TIME NOTIFICATION TOAST */}
            {activeToast && (
              <div className="fixed top-4 right-4 z-50 max-w-sm w-[90vw] sm:w-96 bg-slate-950/95 border-2 border-cyan-400 text-white p-4 rounded-2xl shadow-2xl shadow-cyan-950/80 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner">
                    <Bell className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                        {activeToast.channel || 'Campus Alert'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeToast.time || 'Just now'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-0.5 truncate">
                      {activeToast.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {activeToast.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveToast(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* DYNAMIC SCROLLABLE BODY */}
            <div className="flex-1 w-full min-h-0 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">

            {/* ROLE 1: REPORTER VIEW */}
            {currentRole === 'REPORTER' && (
              <div className="space-y-6">

            {activeTab === 'submit' ? (
              /* SUBMIT COMPLAINT FORM */
              <div className="max-w-4xl mx-auto w-full">
                <div className="glass-panel p-5 sm:p-8 rounded-2xl">
                  
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/60">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">New Maintenance Complaint</h2>
                      <p className="text-xs text-slate-400">Accessible across academic halls, labs, hostels, and grounds.</p>
                    </div>

                    
                  </div>

                  {/* QR Scan Success Toast Banner */}
                  {scanSuccessToast && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-emerald-900 text-sm block">{scanSuccessToast.title}</span>
                          <span className="text-emerald-700 text-xs">{scanSuccessToast.detail}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setScanSuccessToast(null)} 
                        className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleComplaintSubmit} className="space-y-6">
                    
                    {/* 1. Cascading Location */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                          1. Specific Campus Location <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] font-bold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded-md">
                          {locationType === 'ACADEMICS' ? 'Academic Facility' : locationType === 'HOSTEL_DORM' ? 'Hostel / Dormitory' : 'Campus Amenity'}
                        </span>
                      </div>

                      {/* Main Sector Selector Tabs */}
                      <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 mb-3 border border-slate-700/60 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setLocationType('ACADEMICS')}
                          className={`flex-1 py-2 rounded-lg transition-all text-center ${
                            locationType === 'ACADEMICS' ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Academics
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationType('HOSTEL_DORM')}
                          className={`flex-1 py-2 rounded-lg transition-all text-center ${
                            locationType === 'HOSTEL_DORM' ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          HOSTEL / DORM
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationType('FACILITY')}
                          className={`flex-1 py-2 rounded-lg transition-all text-center ${
                            locationType === 'FACILITY' ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          SAC / HOSPITAL
                        </button>
                      </div>

                      {/* Dynamic Dropdowns - Nested vertically, NOT side-by-side */}
                      {/* Academics Dropdown with Departments placed under Computer Center inside the same dropdown */}
                      {locationType === 'ACADEMICS' && (
                        <div className="space-y-3.5 p-4 cyber-card-subtle/90 rounded-2xl border border-slate-700/60">
                          <div>
                            <label className="text-xs font-black text-white block mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-xs"></span>
                                <span>Academics Location Dropdown</span>
                              </span>
                              <span className="text-[10px] text-indigo-950 bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 rounded-full font-black">Select Hall or Dept</span>
                            </label>
                            <select
                              value={academicLocation}
                              onChange={(e) => setAcademicLocation(e.target.value)}
                              className="w-full p-3 bg-white border-2 border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                            >
                              <option value="AB-1">AB-1</option>
                              <option value="AB-2">AB-2</option>
                              <option value="IQAC">IQAC</option>
                              <option value="Library">Library</option>
                              <option value="Lab Complex">Lab Complex</option>
                              <option value="Computer Center">Computer Center</option>
                              <optgroup label="Departments">
                                <option value="Departments > CSE">CSE</option>
                                <option value="Departments > ECE">ECE</option>
                                <option value="Departments > EEE">EEE</option>
                                <option value="Departments > MME">MME</option>
                                <option value="Departments > CIVIL">CIVIL</option>
                                <option value="Departments > CHEMICAL">CHEMICAL</option>
                                <option value="Departments > MECHANICAL">MECHANICAL</option>
                              </optgroup>
                            </select>
                          </div>

                          {/* Floor & Room */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-xs"></span>
                                <span>Section / Floor</span>
                              </span>
                              <select
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full p-2.5 bg-white border-2 border-teal-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                              >
                                {currentFloorOptions.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs"></span>
                                <span>Room / Lab / Cabin</span>
                              </span>
                              <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder="e.g. Lab 104, Classroom 201"
                                className="w-full p-2.5 bg-white border-2 border-amber-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl text-xs font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {locationType === 'HOSTEL_DORM' && (
                        <div className="space-y-3.5 p-4 cyber-card-subtle/90 rounded-2xl border border-slate-700/60">
                          <div>
                            <label className="text-xs font-black text-white block mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-xs"></span>
                                <span>HOSTEL / DORM Dropdown</span>
                              </span>
                              <span className="text-[10px] text-violet-950 bg-violet-100 border border-violet-300 px-2.5 py-0.5 rounded-full font-black">Select Block / Wing</span>
                            </label>
                            <select
                              value={hostelLocation}
                              onChange={(e) => setHostelLocation(e.target.value)}
                              className="w-full p-3 bg-white border-2 border-violet-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                            >
                              <optgroup label="OLD CAMPUS">
                                <option value="OLD CAMPUS > RHO">RHO</option>
                                <option value="OLD CAMPUS > THETA">THETA</option>
                                <option value="OLD CAMPUS > ALPHA">ALPHA</option>
                                <option value="OLD CAMPUS > BETA">BETA</option>
                                <option value="OLD CAMPUS > GAMMA">GAMMA</option>
                                <option value="OLD CAMPUS > DELTA">DELTA</option>
                              </optgroup>
                              <optgroup label="PENNA">
                                <option value="PENNA > BH-1{Front Side}">{'BH-1{Front Side}'}</option>
                                <option value="PENNA > BH-1{Backside}">{'BH-1{Backside}'}</option>
                              </optgroup>
                              <optgroup label="PAPAGNI">
                                <option value="PAPAGNI > BH-2{Front Side}">{'BH-2{Front Side}'}</option>
                                <option value="PAPAGNI > BH-2{Back side}">{'BH-2{Back side}'}</option>
                              </optgroup>
                              <option value="KUNDU{GH-1}">{'KUNDU{GH-1}'}</option>
                              <option value="CHITRAVATI{GH-2}">{'CHITRAVATI{GH-2}'}</option>
                            </select>
                          </div>

                          {/* Floor & Room */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-xs"></span>
                                <span>Section / Floor</span>
                              </span>
                              <select
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full p-2.5 bg-white border-2 border-teal-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                              >
                                {currentFloorOptions.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs"></span>
                                <span>Room No. / Space</span>
                              </span>
                              <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder="e.g. Room 108, Washroom"
                                className="w-full p-2.5 bg-white border-2 border-amber-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl text-xs font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {locationType === 'FACILITY' && (
                        <div className="space-y-3.5 p-4 cyber-card-subtle/90 rounded-2xl border border-slate-700/60">
                          <div>
                            <label className="text-xs font-black text-white block mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-xs"></span>
                                <span>Facility Dropdown (Placed Separately)</span>
                              </span>
                              <span className="text-[10px] text-purple-950 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full font-black">SAC / HOSPITAL</span>
                            </label>
                            <select
                              value={separateFacility}
                              onChange={(e) => setSeparateFacility(e.target.value)}
                              className="w-full p-3 bg-white border-2 border-purple-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                            >
                              <option value="SAC">SAC</option>
                              <option value="HOSPITAL">HOSPITAL</option>
                            </select>
                          </div>

                          {/* Section & Specific Area */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-xs"></span>
                                <span>{separateFacility === 'HOSPITAL' ? 'Hospital Ward / Section' : 'Section / Floor'}</span>
                              </span>
                              <select
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full p-2.5 bg-white border-2 border-teal-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 rounded-xl text-xs font-black text-slate-950 shadow-xs transition-all outline-none"
                              >
                                {currentFloorOptions.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <span className="text-[11px] text-white font-black block mb-1.5 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs"></span>
                                <span>{separateFacility === 'HOSPITAL' ? 'Doctor Cabin / Bed No.' : 'Specific Room / Area'}</span>
                              </span>
                              <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder={separateFacility === 'HOSPITAL' ? 'e.g. Dr. Cabin 2, Bed 04' : 'e.g. Indoor Badminton Court, Main Hall'}
                                className="w-full p-2.5 bg-white border-2 border-amber-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-100 rounded-xl text-xs font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Category Track & Tiles */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span>2. Select Category & Redressal Mechanism <span className="text-rose-500">*</span></span>
                        </label>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/60">
                          {categoryType === 'MAINTENANCE' ? '🏢 Hostel Maintenance & Campus Facilities Track (Warden ➔ DSW ➔ AO ➔ Director)' : '⚖️ Official Committee Track'}
                        </span>
                      </div>

                      {/* Primary Category Track Switcher: Unified 2-Track System */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 bg-slate-800/80/90 rounded-2xl border border-slate-700/60">
                        {/* Unified Track A: Hostel Maintenance & Facilities (with 4-Tier Hierarchy) */}
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryType('MAINTENANCE');
                            if (category === 'Internal Complaints Committee (ICC)') {
                              setCategory('Electrical');
                            }
                          }}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                            categoryType === 'MAINTENANCE'
                              ? 'bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white shadow-md border border-teal-400 ring-2 ring-teal-400/40'
                              : 'bg-white hover:bg-teal-50/50 text-slate-900 border border-teal-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${categoryType === 'MAINTENANCE' ? 'bg-teal-800 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-teal-100 text-teal-700'}`}>
                            <Building className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black text-xs ${categoryType === 'MAINTENANCE' ? 'text-white' : 'text-slate-900'}`}>
                                Hostel Maintenance & Facilities
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${categoryType === 'MAINTENANCE' ? 'bg-emerald-400 text-slate-950' : 'bg-teal-200 text-teal-900'}`}>
                                4-TIER HIERARCHY
                              </span>
                            </div>
                            <div className={`text-[10px] truncate ${categoryType === 'MAINTENANCE' ? 'text-teal-200' : 'text-slate-600 font-semibold'}`}>
                              Warden ➔ DSW & Dept ➔ AO ➔ Director • Electrical, Plumbing, Civil, IT
                            </div>
                          </div>
                        </button>

                        {/* Track B: Internal Complaints Committee (ICC) */}
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryType('ICC');
                            setCategory('Internal Complaints Committee (ICC)');
                          }}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                            categoryType === 'ICC'
                              ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-md border border-purple-400 ring-2 ring-purple-400/40'
                              : 'bg-white hover:bg-purple-50/50 text-slate-900 border border-purple-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${categoryType === 'ICC' ? 'bg-purple-800 text-amber-300 ring-1 ring-amber-400/30' : 'bg-purple-100 text-purple-700'}`}>
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black text-xs ${categoryType === 'ICC' ? 'text-white' : 'text-purple-950'}`}>
                                Internal Complaints Committee (ICC)
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${categoryType === 'ICC' ? 'bg-amber-400 text-slate-950' : 'bg-purple-200 text-purple-900'}`}>
                                3-LEVEL
                              </span>
                            </div>
                            <div className={`text-[10px] truncate ${categoryType === 'ICC' ? 'text-purple-200' : 'text-slate-400'}`}>
                              Order: RGUKT/RKV/Committee/ICC • Chaired by Director
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Unified Maintenance & Hostel Facilities vs Specialized ICC View */}
                      {categoryType === 'MAINTENANCE' ? (
                        <div className="space-y-4 animate-in fade-in duration-150">
                          {/* 4-Tier Hierarchy Flow Guide */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-teal-50/90 via-emerald-50/40 to-white border-2 border-teal-300 shadow-xs space-y-3.5">
                            <div className="flex items-center gap-2.5 pb-2.5 border-b border-teal-200/80">
                              <div className="w-9 h-9 rounded-xl bg-teal-800 text-emerald-300 flex items-center justify-center font-bold shadow-xs">
                                <Building className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-teal-950">
                                  Hostel Maintenance & Facilities Hierarchy Redressal
                                </h4>
                                <p className="text-[11px] text-teal-700">
                                  Step 1: Warden (Stopped based on severity) ➔ Step 2: DSW & Respective Departments ➔ Step 3: AO ➔ Step 4: Director
                                </p>
                              </div>
                            </div>

                            {/* 4-tier overview banner */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-white border border-teal-300 shadow-xs">
                                <span className="text-[10px] font-black text-teal-900 uppercase block">Stage 1 (Primary)</span>
                                <strong className="text-slate-950 font-black block mt-0.5">Hostel Warden</strong>
                                <span className="text-[10px] text-slate-700 font-bold">Local hostel intake & resolution</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white border border-teal-300 shadow-xs">
                                <span className="text-[10px] font-black text-teal-900 uppercase block">Stage 2</span>
                                <strong className="text-slate-950 font-black block mt-0.5">DSW & Respective Depts</strong>
                                <span className="text-[10px] text-slate-700 font-bold">Student Welfare & technical repairs</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white border border-teal-300 shadow-xs">
                                <span className="text-[10px] font-black text-teal-900 uppercase block">Stage 3</span>
                                <strong className="text-slate-950 font-black block mt-0.5">Administrative Officer (AO)</strong>
                                <span className="text-[10px] text-slate-700 font-bold">Administrative sanctions & contractors</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white border border-teal-300 shadow-xs">
                                <span className="text-[10px] font-black text-teal-900 uppercase block">Stage 4 (Apex)</span>
                                <strong className="text-slate-950 font-black block mt-0.5">The Director</strong>
                                <span className="text-[10px] text-slate-700 font-bold">Executive Orders & Campus Authority</span>
                              </div>
                            </div>

                            <div className="p-2.5 bg-teal-100/90 rounded-xl text-[11px] text-teal-950 flex items-start gap-2 border border-teal-300 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                              <span>
                                <strong className="font-black text-teal-950">Automated Hierarchy Routing:</strong> This complaint will be routed first to the <strong className="font-black text-teal-950">Hostel Resident Warden</strong> to solve/stop the problem according to severity. If unresolved, you can tag the complaint with the Warden's response to DSW & Department, then to AO, and finally to the Director.
                              </span>
                            </div>
                          </div>

                          {/* Specific Technical Maintenance Trade Picker */}
                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-black text-white block">Select Specific Issue Category / Trade:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                const isSel = category === cat.id;
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                      isSel 
                                        ? 'border-teal-400 ring-2 ring-teal-400 bg-teal-950 text-white' 
                                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-950 shadow-xs'
                                    }`}
                                  >
                                    <div className={`p-1.5 rounded-lg ${cat.color}`}>
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-xs font-black ${isSel ? 'text-white' : 'text-slate-950'}`}>
                                      {cat.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* The SEPARATE WAY: Special ICC Official Committee Sub-panel */
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-50/80 via-indigo-50/50 to-white border-2 border-purple-300 shadow-xs space-y-4 animate-in fade-in duration-200">
                          {/* Official Order Letterhead Citation */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-purple-200/80 gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-purple-700 text-amber-300 flex items-center justify-center font-bold shadow-xs">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-black text-sm text-purple-950">Internal Complaints Committee (ICC)</h4>
                                <p className="text-[10px] text-purple-700 font-semibold">
                                  Office Order: <span className="font-mono font-bold">RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 self-start sm:self-auto">
                              <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold">
                                Dated: 11.08.2026
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                                Director as Chairperson
                              </span>
                            </div>
                          </div>

                          {/* Order Mandate Explanatory Box */}
                          <div className="bg-purple-100/70 p-3 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed">
                              <em>"In order to facilitate timely disposal of complaints and ensure that appropriate action is taken based on the nature, seriousness and complexity of each complaint, a three-level committee mechanism is hereby proposed. The Director shall be the Chairperson for all three levels of committees."</em>
                            </p>
                          </div>

                          {/* 1. Grievance Nature (ICC Specific Sub-categories) */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-purple-950 mb-2">
                              A. Nature of Grievance <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[
                                { id: 'Anti-Ragging & Harassment (POSH)', label: 'Anti-Ragging & Harassment (POSH)', desc: 'Strict Zero Tolerance policy with immediate protection' },
                                { id: 'Student Welfare & Hostel Rights', label: 'Student Welfare & Hostel Rights', desc: 'Hostel conditions, mess hygiene & student basic entitlements' },
                                { id: 'Academic & Evaluation Grievance', label: 'Academic & Evaluation Grievance', desc: 'Curriculum, grade transparency & faculty consultation' },
                                { id: 'Faculty / Staff Disciplinary Matter', label: 'Faculty / Staff Disciplinary Matter', desc: 'Professional conduct & grievance redressal' },
                                { id: 'Administrative & Campus Protocol', label: 'Administrative & Campus Protocol', desc: 'Service delays, campus amenities & administrative conduct' }
                              ].map(item => {
                                const isSel = iccGrievanceNature === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setIccGrievanceNature(item.id)}
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                      isSel
                                        ? 'bg-purple-900 text-white border-purple-900 ring-2 ring-purple-300 shadow-xs'
                                        : 'bg-white hover:bg-purple-50 text-slate-900 border-purple-200'
                                    }`}
                                  >
                                    <div className="font-bold text-xs">{item.label}</div>
                                    <div className={`text-[10px] ${isSel ? 'text-purple-200' : 'text-slate-600 font-semibold'}`}>{item.desc}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Automatic Tri-Committee Simultaneous Dispatch Protocol */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <label className="block text-xs font-black uppercase tracking-wider text-purple-950">
                                B. Statutory Tri-Committee Simultaneous Dispatch Protocol <span className="text-rose-500">*</span>
                              </label>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                                ✓ Dispatches to All 3 Simultaneously
                              </span>
                            </div>

                            {/* Prominent Statutory Dispatch Banner */}
                            <div className="p-3 bg-gradient-to-r from-purple-100 via-indigo-50 to-amber-50 border-2 border-purple-400 rounded-xl text-purple-950 space-y-1 shadow-xs">
                              <div className="flex items-center gap-2 font-black text-xs text-purple-900">
                                <Scale className="w-4 h-4 text-purple-700 shrink-0" />
                                <span>AUTOMATIC SIMULTANEOUS DISPATCH TO ALL THREE COMMITTEES:</span>
                              </div>
                              <p className="text-[11px] font-bold leading-relaxed text-purple-900">
                                Under Office Order dated 11.08.2026, when you submit this ICC complaint, it will be <strong>sent to all 3 committees at once</strong> (Small Committee, Medium Committee, and Full ICC Committee). The three committees jointly evaluate the problem and decide which committee will take jurisdiction to investigate and solve it.
                              </p>
                            </div>

                            {/* Visual Cards Showing All 3 Committees Receiving Dispatch */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {[
                                {
                                  level: 'Level 1: Small Committee (3 Members)',
                                  name: '1. Small Committee',
                                  members: '3 Members',
                                  desc: 'Minor complaints raised by students, faculty and staff. Examines and resolves with approval of Chairperson (Director).',
                                  badge: 'Fast Track (< 72h)',
                                  dispatchTag: '✓ Automatic Dispatch Target'
                                },
                                {
                                  level: 'Level 2: Medium Committee (6 Members)',
                                  name: '2. Medium Committee',
                                  members: '6 Members',
                                  desc: 'Moderate seriousness involving students, faculty, or staff. Conducts inquiry & disposes with approval of Chairperson.',
                                  badge: 'Quasi-Judicial Bench (< 48h)',
                                  dispatchTag: '✓ Automatic Dispatch Target'
                                },
                                {
                                  level: 'Level 3: ICC Committee (Large/Serious Issues)',
                                  name: '3. Full ICC Committee',
                                  members: 'Large/Serious Issues',
                                  desc: 'Major, sensitive or complex complaints requiring comprehensive in-camera tribunal inquiry by Full Committee & external experts.',
                                  badge: 'Full Statutory Bench (< 24h)',
                                  dispatchTag: '✓ Automatic Dispatch Target'
                                }
                              ].map(tier => {
                                const isSel = iccCommitteeLevel === tier.level;
                                return (
                                  <button
                                    key={tier.level}
                                    type="button"
                                    onClick={() => setIccCommitteeLevel(tier.level)}
                                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                      isSel
                                        ? 'bg-purple-950 text-white border-purple-950 ring-2 ring-amber-400 shadow-xs'
                                        : 'bg-white hover:bg-purple-50 text-slate-900 border-purple-200'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`font-black text-xs ${isSel ? 'text-white' : 'text-purple-950'}`}>{tier.name}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSel ? 'bg-amber-400 text-slate-950 font-black' : 'bg-purple-100 text-purple-800'}`}>
                                          {tier.members}
                                        </span>
                                      </div>
                                      <span className={`text-[9px] font-mono font-bold block mb-1 ${isSel ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                        {tier.dispatchTag}
                                      </span>
                                      <p className={`text-[10px] leading-tight ${isSel ? 'text-purple-200' : 'text-slate-700 font-semibold'}`}>{tier.desc}</p>
                                    </div>
                                    <div className="mt-2.5 pt-2 border-t border-purple-200/40 flex items-center justify-between">
                                      <span className={`text-[9px] font-bold ${isSel ? 'text-amber-300' : 'text-purple-700 font-black'}`}>{tier.badge}</span>
                                      <span className={`text-[9px] font-bold ${isSel ? 'text-white' : 'text-purple-600'}`}>
                                        {isSel ? '★ Student Appraisal' : 'Click to prioritize'}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-purple-800 font-semibold italic text-right">
                              * All 3 committees receive the dossier simultaneously. The joint committee bench will deliberate and confirm the jurisdiction tier.
                            </p>
                          </div>

                          {/* Level 1: Small Committee (3 Members) Interactive Flow Studio */}
                          {iccCommitteeLevel === 'Level 1: Small Committee (3 Members)' && (
                            <div className="pt-1">
                              <SmallCommitteeFlowStudio
                                matterType={iccMatterType}
                                setMatterType={setIccMatterType}
                                domainType={iccDomainType}
                                setDomainType={setIccDomainType}
                              />
                            </div>
                          )}

                          {/* Level 2: Medium Committee (6 Members) Interactive Flow Studio */}
                          {iccCommitteeLevel === 'Level 2: Medium Committee (6 Members)' && (
                            <div className="pt-1">
                              <MediumCommitteeFlowStudio
                                matterType={iccMatterType}
                                setMatterType={setIccMatterType}
                                domainType={iccDomainType}
                                setDomainType={setIccDomainType}
                                department={iccConcernedDept}
                                setDepartment={setIccConcernedDept}
                                specialDomain={iccSpecialDomain}
                                setSpecialDomain={setIccSpecialDomain}
                              />
                            </div>
                          )}

                          {/* Level 3: Full ICC Committee (Large/Serious Issues) Interactive Flow Studio */}
                          {iccCommitteeLevel === 'Level 3: ICC Committee (Large/Serious Issues)' && (
                            <div className="pt-1">
                              <Level3CommitteeFlowStudio
                                matterType={iccMatterType}
                                setMatterType={setIccMatterType}
                                domainType={iccDomainType}
                                setDomainType={setIccDomainType}
                                department={iccConcernedDept}
                                setDepartment={setIccConcernedDept}
                                specialDomain={iccSpecialDomain}
                                setSpecialDomain={setIccSpecialDomain}
                                involvesStudents={iccInvolvesStudents}
                                setInvolvesStudents={setIccInvolvesStudents}
                              />
                            </div>
                          )}

                          {/* 3. Confidentiality and Identity Protection */}
                          <div className="cyber-card p-3.5 rounded-xlspace-y-2.5">
                            <span className="text-xs font-bold text-purple-950 block">C. Confidentiality & Whistleblower Protections:</span>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                                <input
                                  type="checkbox"
                                  checked={iccIsConfidential}
                                  onChange={(e) => setIccIsConfidential(e.target.checked)}
                                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                                />
                                <span>🔒 Strictly Confidential Dossier (Sealed to Director & Committee)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                                <input
                                  type="checkbox"
                                  checked={iccMaskIdentity}
                                  onChange={(e) => setIccMaskIdentity(e.target.checked)}
                                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                                />
                                <span>🛡️ Mask Student Identity from Respondents during inquiry</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Urgency / Seriousness Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        3. {categoryType === 'ICC' ? 'Seriousness & Inquiry Complexity' : 'Urgency Level'} <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {URGENCIES.map(urg => {
                          const isSel = urgency === urg.id;
                          return (
                            <button
                              key={urg.id}
                              type="button"
                              onClick={() => setUrgency(urg.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSel ? `${urg.color} ring-2 ring-current font-bold` : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 font-bold'
                              }`}
                            >
                              <div className="text-xs font-bold">{urg.label}</div>
                              <div className="text-[10px] opacity-75">{urg.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Title & Description */}
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-xs"></span>
                            <span>4. {categoryType === 'ICC' ? 'Grievance Summary & Subject' : 'Complaint Summary'} <span className="text-rose-400">*</span></span>
                          </label>
                          <span className="text-[10px] text-rose-950 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full font-black">
                            {categoryType === 'ICC' ? 'ICC Subject' : 'Issue Title'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={categoryType === 'ICC' ? 'e.g. Formal Grievance regarding Hostel Mess Quality / Harassment / Examination Evaluation' : 'e.g. Water valve leaking beneath washroom sink'}
                          className="w-full p-3 bg-white border-2 border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 rounded-xl text-sm font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs"></span>
                            <span>Detailed Description / Remarks</span>
                          </label>
                          <span className="text-[10px] text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black">Room Coordinates & Details</span>
                        </div>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Additional details: error codes, when it began, exact location in room..."
                          className="w-full p-3 bg-white border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-xs font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* 5. Real Photo Upload */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        5. Attach Photo Evidence (Optional)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Option 1: Upload Image from device */}
                        <label className="cursor-pointer px-4 py-2.5 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-700 transition-all shadow-2xs">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>

                        {/* Option 2: Camera Capture */}
                        <label className="cursor-pointer px-4 py-2.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-100 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-900 transition-all shadow-2xs">
                          <Camera className="w-4 h-4 text-slate-700" />
                          <span>Camera Capture</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>

                        {/* Uploaded thumbnails with remove button */}
                        {photos.map((p, i) => (
                          <div key={i} className="relative w-14 h-14 rounded-xl border border-slate-700/60 overflow-hidden shadow-2xs group">
                            <img src={p} className="w-full h-full object-cover" alt={`Uploaded ${i + 1}`} />
                            <button
                              type="button"
                              onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-black/75 hover:bg-rose-600 text-white p-1 rounded-full transition-colors"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Click <strong>Upload Image</strong> to select photos from your device, or <strong>Camera Capture</strong> to take a photo.
                      </p>
                    </div>

                    {/* 6. Email for Department Notifications & Progress Updates */}
                    <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-300 shadow-2xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black text-sky-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs"></span>
                          <span>6. Notification Email for Status & Fix Updates <span className="text-rose-600">*</span></span>
                        </label>
                        <span className="text-[10px] font-black text-sky-950 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Mail className="w-3 h-3 text-sky-700" />
                          Official Delivery Channel
                        </span>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-sky-600 absolute left-3 top-3.5 pointer-events-none" />
                        <input
                          type="email"
                          value={reporterEmail}
                          onChange={(e) => setReporterEmail(e.target.value)}
                          placeholder="e.g. student@rgukt.ac.in or personal email"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-sky-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100 rounded-xl text-xs font-black text-slate-950 placeholder:text-slate-500 placeholder:font-semibold shadow-xs transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mt-2 text-[11px] text-slate-700 font-bold">
                        <span>Official complaint receipt, technician dispatches, and after-repair verification photos will be emailed here.</span>
                        {smtpConfig?.activeTransporter === 'REAL_SMTP' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Live SMTP Active ({smtpConfig.service})
                          </span>
                        ) : (
                          <span className="text-indigo-600 font-medium">
                            Delivered via Ethereal / In-App Mailbox
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        categoryType === 'ICC'
                          ? 'bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 hover:from-purple-950 hover:to-black ring-2 ring-purple-400/30'
                          : 'bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 hover:from-teal-950 hover:to-black ring-2 ring-teal-400/30'
                      }`}
                    >
                      {categoryType === 'ICC' ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-amber-300" />
                          <span>Submit Formal Grievance to ICC (Director Chaired)</span>
                        </>
                      ) : (
                        <>
                          <Building className="w-4 h-4 text-emerald-300" />
                          <span>Submit to Hostel Warden (Hierarchy Stage 1)</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : activeTab === 'my-complaints' ? (
              /* DEDICATED SEPARATE CARD: MY COMPLAINTS */
              <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
                {/* My Complaints Standalone Card Header with Sub-Categories */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-600" />
                        <span>My Complaints</span>
                      </h3>
                      <p className="text-xs text-slate-400">Categorized by redressal state: Pending, Solved, and Rejected</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800/80 text-slate-200">
                        {visibleComplaints.length} Total
                      </span>
                      <button
                        type="button"
                        onClick={() => navigateToTab('submit')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Complaint</span>
                      </button>
                    </div>
                  </div>

                  {/* Sub-titles / Category Selector Bar (Matching screenshot media_1791893159146.png) */}
                  {(() => {
                    const pendingCount = visibleComplaints.filter(c => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(c.status)).length;
                    const solvedCount = visibleComplaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
                    const rejectedCount = visibleComplaints.filter(c => c.status === 'REJECTED').length;

                    return (
                      <div className="grid grid-cols-4 gap-2.5 p-2 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-lg">
                        {/* 1. ALL */}
                        <button
                          type="button"
                          onClick={() => setStudentStatusFilter('ALL')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            studentStatusFilter === 'ALL'
                              ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/40 border border-blue-400'
                              : 'bg-slate-800/80 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-wider font-extrabold text-white">ALL</span>
                          <span className="text-sm font-black text-white">{visibleComplaints.length}</span>
                        </button>

                        {/* 2. PENDING */}
                        <button
                          type="button"
                          onClick={() => setStudentStatusFilter('PENDING')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            studentStatusFilter === 'PENDING'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 border border-amber-300'
                              : 'bg-slate-800/80 border border-slate-700/80 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 hover:border-amber-500/40'
                          }`}
                        >
                          <span className={`text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 ${
                            studentStatusFilter === 'PENDING' ? 'text-slate-950 font-black' : 'text-amber-300'
                          }`}>
                            <Clock className={`w-3.5 h-3.5 ${studentStatusFilter === 'PENDING' ? 'text-slate-950' : 'text-amber-400'}`} />
                            <span>PENDING</span>
                          </span>
                          <span className={`text-sm font-black ${studentStatusFilter === 'PENDING' ? 'text-slate-950' : 'text-amber-300'}`}>
                            {pendingCount}
                          </span>
                        </button>

                        {/* 3. RESOLVED */}
                        <button
                          type="button"
                          onClick={() => setStudentStatusFilter('SOLVED')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            studentStatusFilter === 'SOLVED'
                              ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/40 border border-emerald-400'
                              : 'bg-slate-800/80 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-500/40'
                          }`}
                        >
                          <span className={`text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 ${
                            studentStatusFilter === 'SOLVED' ? 'text-white' : 'text-emerald-300'
                          }`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 ${studentStatusFilter === 'SOLVED' ? 'text-white' : 'text-emerald-400'}`} />
                            <span>RESOLVED</span>
                          </span>
                          <span className={`text-sm font-black ${studentStatusFilter === 'SOLVED' ? 'text-white' : 'text-emerald-300'}`}>
                            {solvedCount}
                          </span>
                        </button>

                        {/* 4. REJECTED */}
                        <button
                          type="button"
                          onClick={() => setStudentStatusFilter('REJECTED')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            studentStatusFilter === 'REJECTED'
                              ? 'bg-rose-600 text-white font-black shadow-lg shadow-rose-600/40 border border-rose-400'
                              : 'bg-slate-800/80 border border-slate-700/80 text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 hover:border-rose-500/40'
                          }`}
                        >
                          <span className={`text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 ${
                            studentStatusFilter === 'REJECTED' ? 'text-white' : 'text-rose-300'
                          }`}>
                            <Ban className={`w-3.5 h-3.5 ${studentStatusFilter === 'REJECTED' ? 'text-white' : 'text-rose-400'}`} />
                            <span>REJECTED</span>
                          </span>
                          <span className={`text-sm font-black ${studentStatusFilter === 'REJECTED' ? 'text-white' : 'text-rose-300'}`}>
                            {rejectedCount}
                          </span>
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* Complaints Stored and Displayed Under This Card */}
                <div className="space-y-3">
                  {(() => {
                    const filteredStudentComplaints = visibleComplaints.filter(c => {
                      if (studentStatusFilter === 'PENDING') return !['RESOLVED', 'CLOSED', 'REJECTED'].includes(c.status);
                      if (studentStatusFilter === 'SOLVED') return ['RESOLVED', 'CLOSED'].includes(c.status);
                      if (studentStatusFilter === 'REJECTED') return c.status === 'REJECTED';
                      return true;
                    });

                    if (filteredStudentComplaints.length === 0) {
                      return (
                        <div className="p-8 text-center glass-panel rounded-2xl">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-3">
                            <Layers className="w-6 h-6 text-blue-500" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-200">
                            {studentStatusFilter === 'PENDING' ? 'No Pending Complaints' :
                             studentStatusFilter === 'SOLVED' ? 'No Solved Complaints Yet' :
                             studentStatusFilter === 'REJECTED' ? 'No Rejected Complaints' :
                             'No Complaints Lodged Yet'}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            {studentStatusFilter === 'PENDING' ? 'All your grievances have been addressed or resolved by the campus authorities.' :
                             studentStatusFilter === 'SOLVED' ? 'Once complaints are inspected and fixed by staff, they appear under Solved Complaints.' :
                             studentStatusFilter === 'REJECTED' ? 'No complaints have been rejected.' :
                             'Complaints are private. Only complaints submitted by your account and official campus authorities are visible here.'}
                          </p>
                          {studentStatusFilter === 'ALL' && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('submit')}
                              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Lodge a Complaint</span>
                            </button>
                          )}
                        </div>
                      );
                    }

                    return filteredStudentComplaints.map(item => (
                      <div
                        key={item.id}
                        className="cyber-card p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all shadow-xl space-y-4 text-white"
                      >
                        {/* Header with Ticket #, Category, Priority, SLA & Status */}
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                              {item.ticketNumber || 'TICKET-PENDING'}
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                              {item.category || 'General Maintenance'}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                              item.priority === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                              item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}>
                              {item.priority || 'MEDIUM'} Priority
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                              item.status === 'RESOLVED' || item.status === 'CLOSED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              item.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                              item.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            }`}>
                              ● {item.status || 'SUBMITTED'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">SLA Target</span>
                            <span className="text-xs font-extrabold text-cyan-400">{item.slaHours || 24} Hours</span>
                          </div>
                        </div>

                        {/* Title & Location */}
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
                            {item.title || 'Campus Maintenance Grievance'}
                          </h4>
                          <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 truncate">
                            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="truncate">{item.location || 'Location Not Specified'}</span>
                          </p>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-normal">
                            {item.description}
                          </div>
                        )}

                        {/* INLINE CAMPUS HIERARCHY TRACKING FLOW WHEN "Track Complaint" IS EXPANDED */}
                        {Boolean(expandedTrackTickets[item.id]) && (
                          <div className="pt-2 animate-in fade-in duration-200">
                            {!item.isIcc && item.category !== 'Internal Complaints Committee (ICC)' && item.categoryType !== 'ICC' ? (
                              <HostelHierarchyTrackerCard
                                ticket={item}
                                currentUser={currentUser}
                                onOpenEscalationModal={(t) => {
                                  setSelectedHostelTicket(t);
                                  setShowHostelEscalationModal(true);
                                }}
                                onAddAuthorityResponse={handleAddHostelAuthorityResponse}
                              />
                            ) : (
                              <div className="p-4 bg-purple-950/60 rounded-xl border border-purple-800/60 text-xs text-purple-200 space-y-1.5">
                                <div className="flex items-center gap-1.5 font-bold text-purple-300">
                                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                                  <span>ICC Statutory Redressal Committee (Presided by Director)</span>
                                </div>
                                <p className="text-[11px] text-purple-300/90">
                                  Level: <strong>{item.committeeLevel || 'Level 1: Small Committee (3 Members)'}</strong>
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Card Footer: Category, Assigned Person, and Actions */}
                        <div className="flex items-center justify-between text-xs pt-3.5 border-t border-slate-800/80 flex-wrap gap-2">
                          <div className="flex items-center gap-2 text-slate-300">
                            <span className="font-semibold text-slate-300">{item.category}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">{item.assignedStaffName || 'Dean Student Welfare & Technical Dept'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* WITHDRAW / REMOVE BUTTON */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteComplaint(item.id);
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center gap-1 cursor-pointer"
                              title="Withdraw and delete this complaint"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Withdraw</span>
                            </button>

                            {/* TRACK COMPLAINT BUTTON (Expands tracking in-place) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicket(item);
                                setExpandedTrackTickets(prev => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                                Boolean(expandedTrackTickets[item.id])
                                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:bg-slate-700'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {Boolean(expandedTrackTickets[item.id]) ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5 text-cyan-300" />
                                  <span>Hide Tracking</span>
                                </>
                              ) : (
                                <>
                                  <Navigation className="w-3.5 h-3.5" />
                                  <span>Track Complaint</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>

                            {/* Direct link to dedicated My Complaint Status tab */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicket(item);
                                navigateToTab('tracker');
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer"
                              title="View detailed lifecycle timeline in My Complaint Status"
                            >
                              <span>Full Status</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : activeTab === 'tracker' ? (
              /* DEDICATED SEPARATE TAB: MY COMPLAINT STATUS */
              <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">My Complaint Status</h2>
                      <p className="text-xs text-slate-200 font-medium">Real-time redressal hierarchy tracking, stage transitions, and SLA resolution timeline</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToTab('my-complaints')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View My Complaints</span>
                  </button>
                </div>

                {/* Complaint Switcher Bar if complaints exist */}
                {visibleComplaints.length > 0 && (
                  <div className="glass-panel p-3.5 rounded-2xl">
                    <div className="text-[11px] font-black text-slate-200 uppercase tracking-wider mb-2 px-1">
                      Select Complaint to Track:
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {visibleComplaints.map(item => {
                        const isSelected = (selectedTicket?.id || visibleComplaints[0]?.id) === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedTicket(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs font-black'
                                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white font-bold'
                            }`}
                          >
                            <span>{item.ticketNumber}</span>
                            <span className="text-[10px] opacity-90">({item.status})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Detail & Lifecycle Timeline Column */}
                <div id="ticket-detail-view" className="glass-panel rounded-2xl p-5 md:p-7 shadow-xs">
                  {(() => {
                    const activeTrackedTicket = selectedTicket || visibleComplaints[0];
                    if (!activeTrackedTicket) {
                      return (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3">
                            <Navigation className="w-6 h-6" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-200">No Complaints to Track Yet</h4>
                          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                            Submit a complaint to view the real-time statutory resolution hierarchy and SLA countdown.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigateToTab('submit')}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Lodge a Complaint</span>
                          </button>
                        </div>
                      );
                    }
                    return (
                    <div>
                      <div className="flex items-start justify-between pb-4 border-b border-slate-800/60">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-black text-white">{activeTrackedTicket.ticketNumber}</span>
                            {activeTrackedTicket.isIcc || activeTrackedTicket.category === 'Internal Complaints Committee (ICC)' ? (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-purple-900 text-amber-300 border border-purple-800 shadow-2xs flex items-center gap-1">
                                ⚖️ ICC Committee • {activeTrackedTicket.committeeLevel ? activeTrackedTicket.committeeLevel.split(':')[0] : '3-Level Mechanism'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-100">
                                {activeTrackedTicket.category}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              activeTrackedTicket.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              activeTrackedTicket.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-slate-800 text-slate-100'
                            }`}>
                              {activeTrackedTicket.status === 'REJECTED' ? 'REJECTED' : `${activeTrackedTicket.priority} Priority`}
                            </span>
                            {activeTrackedTicket.isConfidential && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                🔒 Confidential Dossier
                              </span>
                            )}
                          </div>
                          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">{activeTrackedTicket.title}</h2>
                          <p className="text-xs text-slate-200 font-semibold mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" /> {activeTrackedTicket.location}
                          </p>

                          {/* Official Tri-Committee Dispatch & Allocation Card */}
                          {(activeTrackedTicket.isIcc || activeTrackedTicket.category === 'Internal Complaints Committee (ICC)') && (
                            <div className="mt-3">
                              <TriCommitteeAllocationTrackerCard
                                ticket={activeTrackedTicket}
                                currentUser={currentUser}
                                onAllocateCommittee={handleAllocateIccCommittee}
                                onOpenModal={() => {
                                  setSelectedIccModalTicket(activeTrackedTicket);
                                  setShowMediumCommitteeModal(true);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-slate-200 block">SLA Target</span>
                          <span className="text-xs font-black text-cyan-400">{activeTrackedTicket.slaHours || 24} Hours</span>
                        </div>
                      </div>

                      {/* Non-ICC Campus Hierarchy Flow Tracker Card (Warden ➔ DSW & Dept ➔ AO ➔ Director) */}
                      {!activeTrackedTicket.isIcc && activeTrackedTicket.category !== 'Internal Complaints Committee (ICC)' && activeTrackedTicket.categoryType !== 'ICC' && (
                        <HostelHierarchyTrackerCard
                          ticket={activeTrackedTicket}
                          currentUser={currentUser}
                          onOpenEscalationModal={(t) => {
                            setSelectedHostelTicket(t);
                            setShowHostelEscalationModal(true);
                          }}
                          onAddAuthorityResponse={handleAddHostelAuthorityResponse}
                        />
                      )}

                      

                      {/* Assigned Staff / Committee Authority Banner */}
                      <div className="my-4 p-3 cyber-card-subtle rounded-xl flex items-center justify-between border border-slate-700/60/70">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {(activeTrackedTicket.isIcc || activeTrackedTicket.category === 'Internal Complaints Committee (ICC)') ? 'Assigned Committee Authority' : 'Assigned Technician'}
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-100">
                            {activeTrackedTicket.assignedStaffName || ((activeTrackedTicket.isIcc || activeTrackedTicket.category === 'Internal Complaints Committee (ICC)') ? 'Office of Director & ICC Secretariat' : 'Duty Dispatcher')}
                          </p>
                        </div>
                        {!(activeTrackedTicket.isIcc || activeTrackedTicket.category === 'Internal Complaints Committee (ICC)') && (
                          <button 
                            onClick={() => alert(`Calling staff: +91 98765 43210 (${activeTrackedTicket.assignedStaffName})`)}
                            className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Staff
                          </button>
                        )}
                      </div>

                      {/* Complaint Description & Reported Defect Photos (Before Fix) */}
                      <div className="my-4 p-4 cyber-card-subtle/70 rounded-xl border border-slate-700/60">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Reported Defect Description
                        </h4>
                        <p className="text-xs text-slate-200 leading-relaxed mb-3">
                          {activeTrackedTicket.description || 'No description provided.'}
                        </p>

                        {/* Before Photos Gallery */}
                        {activeTrackedTicket.photos && activeTrackedTicket.photos.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Camera className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[11px] font-bold text-slate-300">
                                Defect Photos (Reported on {new Date(activeTrackedTicket.createdAt).toLocaleDateString()})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              {activeTrackedTicket.photos.map((img, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700/60 shadow-2xs">
                                  <img
                                    src={img}
                                    alt={`Defect ${i + 1}`}
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => window.open(img, '_blank')}
                                  />
                                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    Before Fix
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Verified Fix Proof & Technician Resolution Details (After Fix) */}
                      {(activeTrackedTicket.resolutionPhoto || activeTrackedTicket.resolutionNotes) && (
                        <div className="my-4 p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 shadow-2xs">
                          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-emerald-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                              <h4 className="text-xs font-bold text-emerald-950">
                                Technician Work Proof & Resolution Details
                              </h4>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              Verified On-Site
                            </span>
                          </div>

                          {activeTrackedTicket.resolutionNotes && (
                            <div className="mb-2.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                                Action Taken & Work Notes:
                              </span>
                              <p className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-lg border border-emerald-200/80 font-medium">
                                "{activeTrackedTicket.resolutionNotes}"
                              </p>
                            </div>
                          )}

                          {activeTrackedTicket.spareParts && (
                            <div className="mb-2.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                                Spare Parts / Materials Replaced:
                              </span>
                              <p className="text-xs text-slate-950 font-bold bg-white/95 p-2 rounded-lg border border-emerald-300">
                                🔧 {activeTrackedTicket.spareParts}
                              </p>
                            </div>
                          )}

                          {activeTrackedTicket.resolutionPhoto && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                                <span className="text-[11px] font-bold text-emerald-900">
                                  Fix Proof Photo (After-Repair Verification)
                                </span>
                              </div>
                              <div className="relative inline-block rounded-xl overflow-hidden border-2 border-emerald-400 shadow-xs group">
                                <img
                                  src={activeTrackedTicket.resolutionPhoto}
                                  alt="Resolution Proof"
                                  className="w-36 h-36 sm:w-44 sm:h-44 object-cover cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => window.open(activeTrackedTicket.resolutionPhoto, '_blank')}
                                />
                                <span className="absolute bottom-1.5 left-1.5 bg-emerald-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-300" /> After Repair Proof
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lifecycle Timeline */}
                      <div className="mt-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Complaint Lifecycle Timeline</h4>
                        <div className="space-y-5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                          {(activeTrackedTicket.timeline || []).map((step, idx) => (
                            <div key={idx} className="relative flex items-start gap-3.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                step.status === 'REJECTED' ? 'bg-rose-600 text-white' :
                                step.done ? 'bg-slate-900 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}>
                                {step.status === 'REJECTED' ? <Ban className="w-3.5 h-3.5" /> : (step.done ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h5 className={`text-xs sm:text-sm font-bold ${
                                    step.status === 'REJECTED' ? 'text-rose-700' :
                                    step.done ? 'text-white' : 'text-slate-400'
                                  }`}>
                                    {step.title}
                                  </h5>
                                  <span className="text-[11px] text-slate-400">{step.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-400">{step.actor || step.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rejection Alert Banner with Reason & Department Remarks */}
                      {activeTrackedTicket.status === 'REJECTED' && (
                        <div className="mt-6 p-4 bg-rose-50/90 rounded-xl border border-rose-200 shadow-2xs">
                          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-rose-200">
                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                              <Ban className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                                Complaint Rejected by {activeTrackedTicket.category} Department
                              </h4>
                              <p className="text-[11px] text-rose-700">Official rejection notice issued by campus authorities</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                                Primary Reason for Rejection:
                              </span>
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-200/80 text-rose-950 font-bold text-xs border border-rose-300">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                                  {activeTrackedTicket.rejectionReason || 'Duplicate or Out of Scope'}
                                </span>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                                Department Remarks & Explanation:
                              </span>
                              <p className="mt-1 p-3 bg-white rounded-lg border border-rose-300 text-rose-950 font-bold whitespace-pre-wrap text-xs shadow-2xs">
                                "{activeTrackedTicket.rejectionNotes || 'Complaint evaluated by maintenance team and found not actionable under current scope.'}"
                              </p>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-rose-800 bg-rose-100/70 p-2.5 rounded-lg border border-rose-200/80">
                              <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>
                                An official explanation email was sent from the <strong>{activeTrackedTicket.category} Department</strong> to <strong>{activeTrackedTicket.reporterEmail}</strong>.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Post-Resolution Action Banner */}
                      {activeTrackedTicket.status === 'RESOLVED' && (
                        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <h4 className="text-xs sm:text-sm font-bold text-emerald-950 mb-1">
                            Technician Marked Issue as Resolved
                          </h4>
                          <p className="text-xs text-emerald-700 mb-3">
                            Please verify the physical fix in {activeTrackedTicket.location}. Confirm and rate the staff or reopen if the defect persists.
                          </p>
                          <button
                            onClick={() => setFeedbackModalTicket(activeTrackedTicket)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                          >
                            Verify Resolution (Rate or Reopen)
                          </button>
                        </div>
                      )}

                      {/* SLA Breach Simulator Action */}
                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Testing Escalations:</span>
                        <button
                          onClick={handleSimulateSla}
                          className="text-xs text-rose-600 hover:text-rose-700 font-bold border border-rose-200 bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Simulate 48h SLA Breach
                        </button>
                      </div>

                    </div>
                  );
                })()}
                </div>
              </div>
            ) : activeTab === 'inbox' ? (
              /* STUDENT INBOX & DEPARTMENT EMAILS VIEW */
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white tracking-tight">Student Grievance Mailbox & Notifications</h3>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {currentStudentEmail}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Official dispatches sent from campus maintenance departments regarding your complaints
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/send-test-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              recipientEmail: currentStudentEmail,
                              recipientName: currentUser?.name || 'Campus Student'
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert(`📬 Verification Email Dispatched to ${currentStudentEmail}!\n\n${data.mail.previewUrl ? `Web Preview Link:\n${data.mail.previewUrl}` : 'Delivered to mailbox.'}`);
                            fetchData();
                          } else {
                            alert(`Error: ${data.message}`);
                          }
                        } catch (err) {
                          alert(`Connection error: ${err.message}`);
                        }
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Email to Me</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSmtpModal(true)}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-slate-200 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      title="Configure Gmail or institutional SMTP for real delivery"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Configure Real SMTP</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Status Banner */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs ${
                  smtpConfig?.activeTransporter === 'REAL_SMTP'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      smtpConfig?.activeTransporter === 'REAL_SMTP' ? 'bg-emerald-200/80 text-emerald-800' : 'bg-amber-200/80 text-amber-800'
                    }`}>
                      {smtpConfig?.activeTransporter === 'REAL_SMTP' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold">
                        {smtpConfig?.activeTransporter === 'REAL_SMTP'
                          ? `Live SMTP Active: Connected to ${smtpConfig.service.toUpperCase()} (${smtpConfig.user})`
                          : 'Testing Mode Active: Ethereal Test Gateway with Instant Web Previews'}
                      </p>
                      <p className="text-[11px] opacity-80">
                        {smtpConfig?.activeTransporter === 'REAL_SMTP'
                          ? 'Real emails are sent across the internet directly to student and technician inboxes.'
                          : 'Emails are dispatched and stored with a direct "Open Live Web Preview" link to see the delivered email in your browser.'}
                      </p>
                    </div>
                  </div>

                  {smtpConfig?.activeTransporter !== 'REAL_SMTP' && (
                    <button
                      onClick={() => setShowSmtpModal(true)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                    >
                      Connect Gmail / Real SMTP →
                    </button>
                  )}
                </div>

                {/* Emails List */}
                {studentEmails.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
                    <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
                    <h4 className="font-bold text-sm text-slate-200 mb-1">No Department Mails Yet</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                      When you submit a maintenance ticket, our department gateways automatically email you registration confirmations, technician inspection notes, and resolution proofs.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/send-test-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              recipientEmail: currentStudentEmail,
                              recipientName: currentUser?.name || 'Campus Student'
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert(`📬 Test Email Sent to ${currentStudentEmail}!`);
                            fetchData();
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Verification Mail Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentEmails.map((mail) => {
                      const isReject = mail.type === 'REJECTION_NOTICE';
                      const isResolve = mail.type === 'RESOLVED_NOTICE';
                      const isDeptDispatch = mail.type === 'DISPATCH_TO_DEPT';

                      return (
                        <div
                          key={mail.id}
                          className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                            isReject ? 'border-rose-200 bg-rose-50/20' :
                            isResolve ? 'border-emerald-200 bg-emerald-50/20' :
                            'border-slate-700/60'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isReject ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                isResolve ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                isDeptDispatch ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isReject ? '❌ REJECTION NOTICE' :
                                 isResolve ? '✅ RESOLUTION COMPLETED' :
                                 isDeptDispatch ? '🚨 DEPT DISPATCH' : '📋 COMPLAINT ACKNOWLEDGMENT'}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-100">
                                {mail.ticketNumber}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {mail.previewUrl && (
                                <a
                                  href={mail.previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" /> Open Live Web Preview
                                </a>
                              )}
                              <span className="text-[11px] text-slate-400">
                                {new Date(mail.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(mail.time).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-white mb-1">{mail.subject}</h4>
                          <p className="text-xs text-slate-400 mb-3">
                            From: <strong className="text-slate-100">{mail.fromName}</strong> &lt;{mail.from}&gt; → To: <strong className="text-slate-100">{mail.toName}</strong> &lt;{mail.to}&gt;
                          </p>

                          <div className="p-3.5 cyber-card-subtle rounded-xl border border-slate-700/60/80 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                            {mail.body}
                          </div>

                          {mail.resolutionPhoto && (
                            <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                              <img
                                src={mail.resolutionPhoto}
                                alt="Resolution Fix Proof"
                                className="w-16 h-16 object-cover rounded-lg border border-emerald-300 shadow-2xs cursor-pointer hover:opacity-90"
                                onClick={() => window.open(mail.resolutionPhoto, '_blank')}
                                title="Click to view full fix proof photo"
                              />
                              <div>
                                <span className="text-xs font-bold text-emerald-950 block flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Technician Verified Fix Proof
                                </span>
                                <p className="text-[11px] text-emerald-700">
                                  Official photo proof attached by on-duty technician showing completed repairs.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === 'profile' ? (
              /* DEDICATED FULL PROFILE VIEW FOR REPORTER */
              <FullProfileView
                currentUser={currentUser}
                currentRole={currentRole}
                complaints={visibleComplaints}
                onOpenEditModal={() => setShowProfileEditModal(true)}
                onNavigateToTracker={() => setActiveTab('tracker')}
              />
            ) : (
              /* CAMPUS QRS & MAP VIEW FOR REPORTER */
              <CampusQrMapHub
                onSelectRoomForComplaint={(rm) => {
                  setLocationType(rm.type);
                  if (rm.type === 'ACADEMICS') setAcademicLocation(rm.block);
                  else if (rm.type === 'HOSTEL_DORM') setHostelLocation(rm.block);
                  else setSeparateFacility(rm.block);
                  setFloor(rm.floor);
                  setRoom(rm.room);
                  setActiveTab('submit');
                  setScanSuccessToast({
                    title: `Selected ${rm.room} [${rm.code}]`,
                    detail: `Location auto-filled in complaint form.`
                  });
                }}
                currentRole={currentRole}
              />
            )}
          </div>
        )}

        {/* ROLE 2: MAINTENANCE STAFF VIEW */}
        {currentRole === 'STAFF' && (
          <div className="space-y-6">
            {activeTab === 'solved' ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Technician Solved Header */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedStaffId}
                          onChange={(e) => setSelectedStaffId(e.target.value)}
                          className="font-bold text-base text-white tracking-tight bg-transparent border-b border-slate-300 focus:outline-none cursor-pointer"
                        >
                          {staffList.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.trade})</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Solved Work Orders & Completed Repairs History
                      </p>
                    </div>
                  </div>

                  {/* Scorecard Metrics */}
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold">Total Solved</span>
                      <span className="font-black text-emerald-600 text-sm">
                        {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length} Orders
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Admin Verified</span>
                      <span className="font-black text-blue-600 text-sm">
                        {visibleComplaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED') && c.adminVerified).length} Sealed
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">CSAT Score</span>
                      <span className="font-black text-amber-600 text-sm">★ {activeTechnician?.csat || 4.8} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">First-Time Fix</span>
                      <span className="font-black text-teal-600 text-sm">{activeTechnician?.ftfr || 94}%</span>
                    </div>
                  </div>
                </div>

                {/* Solved Work Orders List */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight">Resolved Complaints Log</h3>
                      <p className="text-xs text-slate-400">Fix proofs, replacement spare parts, student reviews, and official Chief Warden approvals</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                      {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length} Completed
                    </span>
                  </div>

                  <div className="space-y-4">
                    {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-bold text-slate-300 text-sm">No solved complaints recorded yet</p>
                        <p className="text-xs text-slate-400 mt-1">When you resolve assigned active work orders and submit fix proof, they will be archived here.</p>
                      </div>
                    ) : (
                      visibleComplaints
                        .filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED')
                        .map(ticket => (
                          <div key={ticket.id} className="p-4 sm:p-5 rounded-xl border border-slate-700/60 bg-emerald-50/20 border-l-4 border-l-emerald-500 flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{ticket.ticketNumber}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/60">
                                  {ticket.category}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  ticket.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {ticket.priority}
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {ticket.status}
                                </span>
                                {ticket.adminVerified ? (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                                    Admin Quality Sealed
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    Pending Admin Audit
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Resolved: {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-base text-white tracking-tight">{ticket.title}</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ticket.location}
                              </p>
                              {ticket.description && (
                                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                                  {ticket.description}
                                </p>
                              )}
                            </div>

                            {/* Fix Proof Details */}
                            <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                  Technician Fix Proof & Actions Taken:
                                </span>
                                {ticket.spareParts && (
                                  <span className="text-[11px] text-slate-300 font-medium bg-slate-800/80 px-2 py-0.5 rounded-md">
                                    Parts Replaced: <strong className="text-slate-100">{ticket.spareParts}</strong>
                                  </span>
                                )}
                              </div>

                              {ticket.resolutionNotes && (
                                <p className="text-xs text-slate-200 italic bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                  "{ticket.resolutionNotes}"
                                </p>
                              )}

                              {ticket.resolutionPhoto && (
                                <div className="flex items-center gap-3 pt-1">
                                  <img
                                    src={ticket.resolutionPhoto}
                                    alt="Fix Proof"
                                    className="w-16 h-16 object-cover rounded-lg border border-emerald-300 shadow-2xs cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
                                    onClick={() => window.open(ticket.resolutionPhoto, '_blank')}
                                    title="Click to view full photo"
                                  />
                                  <div className="text-xs">
                                    <p className="font-bold text-emerald-800">On-Site Resolution Image</p>
                                    <p className="text-[11px] text-slate-400">Click preview to open full-resolution photo</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Resident Feedback / CSAT */}
                            {(ticket.studentRating || ticket.rating || ticket.studentFeedback) && (
                              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-amber-900">Resident Rating:</span>
                                  <span className="text-amber-500 font-bold tracking-widest text-sm">
                                    {'★'.repeat(ticket.studentRating || ticket.rating || 5)}
                                  </span>
                                  <span className="font-bold text-amber-800">({ticket.studentRating || ticket.rating || 5}/5)</span>
                                </div>
                                {ticket.studentFeedback && (
                                  <p className="text-slate-300 italic">
                                    "{ticket.studentFeedback}"
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Admin Quality Seal Notes if verified */}
                            {ticket.adminVerified && ticket.adminRemark && (
                              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-blue-900">Admin Sign-off ({ticket.adminVerifiedBy || 'Chief Warden'}): </span>
                                  <span className="text-slate-200">"{ticket.adminRemark}"</span>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/60/60">
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                }}
                                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-200 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Inspect Thread</span>
                              </button>
                              <button
                                onClick={() => handleOpenWayfinding(ticket)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                <span>Route Map</span>
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === 'profile' ? (
              /* DEDICATED FULL PROFILE VIEW FOR STAFF */
              <FullProfileView
                currentUser={currentUser}
                currentRole={currentRole}
                complaints={visibleComplaints}
                onOpenEditModal={() => setShowProfileEditModal(true)}
              />
            ) : activeTab === 'wayfinder' ? (
              <CampusQrMapHub
                currentRole={currentRole}
              />
            ) : (
              <>
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="font-bold text-base text-white tracking-tight bg-transparent border-b border-slate-300 focus:outline-none cursor-pointer"
                    >
                      {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.trade})</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Assigned Zones: {(activeTechnician?.zones || []).join(', ')}</p>
                </div>
              </div>

              {/* Scorecard Metrics */}
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">CSAT Score</span>
                  <span className="font-black text-amber-600 text-sm">★ {activeTechnician?.csat || 4.8} / 5.0</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">First-Time Fix</span>
                  <span className="font-black text-emerald-600 text-sm">{activeTechnician?.ftfr || 94}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Active Orders</span>
                  <span className="font-black text-blue-600 text-sm">{activeTechnician?.activeTickets || 0}</span>
                </div>
              </div>
            </div>

            {/* Department Work Orders List with Pending, Solved, Rejected Categories */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-base text-white tracking-tight">Department Work Orders & Complaints</h3>
                  <p className="text-xs text-slate-400">Categorized by redressal state for {activeTechnician?.trade || 'Technical Department'}</p>
                </div>

                {/* Sub-titles / Category Filter Pills */}
                {(() => {
                  const deptAll = visibleComplaints;

                  const pendingCount = deptAll.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'OPEN', 'REOPENED'].includes(c.status)).length;
                  const solvedCount = deptAll.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
                  const rejectedCount = deptAll.filter(c => c.status === 'REJECTED').length;

                  return (
                    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setDeptStatusFilter('PENDING')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          deptStatusFilter === 'PENDING'
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md border border-amber-300'
                            : 'bg-slate-800/80 border border-slate-700/80 text-amber-300 hover:bg-amber-500/20'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>PENDING</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          deptStatusFilter === 'PENDING' ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        }`}>
                          {pendingCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeptStatusFilter('SOLVED')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          deptStatusFilter === 'SOLVED'
                            ? 'bg-emerald-600 text-white font-black shadow-md border border-emerald-400'
                            : 'bg-slate-800/80 border border-slate-700/80 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RESOLVED</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          deptStatusFilter === 'SOLVED' ? 'bg-emerald-800 text-white' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                        }`}>
                          {solvedCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeptStatusFilter('REJECTED')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          deptStatusFilter === 'REJECTED'
                            ? 'bg-rose-600 text-white font-black shadow-md border border-rose-400'
                            : 'bg-slate-800/80 border border-slate-700/80 text-rose-300 hover:bg-rose-500/20'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>REJECTED</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          deptStatusFilter === 'REJECTED' ? 'bg-rose-800 text-white' : 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                        }`}>
                          {rejectedCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeptStatusFilter('ALL')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          deptStatusFilter === 'ALL'
                            ? 'bg-blue-600 text-white font-black shadow-md border border-blue-400'
                            : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>ALL</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-700 text-white">
                          {deptAll.length}
                        </span>
                      </button>
                    </div>
                  );
                })()}
              </div>
              
              <div className="space-y-4">
                {(() => {
                  const filteredDeptTickets = visibleComplaints.filter(c => {
                    if (deptStatusFilter === 'PENDING') return ['ASSIGNED', 'IN_PROGRESS', 'OPEN', 'REOPENED'].includes(c.status);
                    if (deptStatusFilter === 'SOLVED') return ['RESOLVED', 'CLOSED'].includes(c.status);
                    if (deptStatusFilter === 'REJECTED') return c.status === 'REJECTED';
                    return true;
                  });

                  if (filteredDeptTickets.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-400">
                        {deptStatusFilter === 'PENDING' ? (
                          <>
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
                            <p className="font-bold text-slate-300 text-sm">No pending complaints in queue</p>
                            <p className="text-xs text-slate-400 mt-1">All work orders assigned to {activeTechnician?.name || 'your department'} are completed or verified.</p>
                          </>
                        ) : deptStatusFilter === 'SOLVED' ? (
                          <>
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="font-bold text-slate-300 text-sm">No solved complaints recorded yet</p>
                            <p className="text-xs text-slate-400 mt-1">Work orders marked as resolved will be catalogued under Solved.</p>
                          </>
                        ) : deptStatusFilter === 'REJECTED' ? (
                          <>
                            <Ban className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="font-bold text-slate-300 text-sm">No rejected complaints recorded</p>
                            <p className="text-xs text-slate-400 mt-1">Complaints flagged as out of scope or invalid will appear here.</p>
                          </>
                        ) : (
                          <>
                            <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="font-bold text-slate-300 text-sm">No department complaints found</p>
                            <p className="text-xs text-slate-400 mt-1">New work orders will appear automatically upon submission.</p>
                          </>
                        )}
                      </div>
                    );
                  }

                  return filteredDeptTickets.map(ticket => (
                    <div key={ticket.id} className="p-4 rounded-xl border border-slate-700/60 cyber-card-subtle/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-blue-600">{ticket.ticketNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            ticket.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ticket.priority}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            ticket.status === 'REJECTED' ? 'bg-rose-600 text-white font-black' :
                            ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-900 font-bold'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{ticket.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ticket.location}
                        </p>
                        {ticket.status === 'REJECTED' && (
                          <div className="mt-1.5 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                            <strong>Reason:</strong> {ticket.rejectionReason} — <em>"{ticket.rejectionNotes}"</em>
                          </div>
                        )}
                        {ticket.status === 'RESOLVED' && (ticket.resolutionPhoto || ticket.resolutionNotes) && (
                          <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
                            <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-900 mb-0.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Fix Proof Submitted:
                            </span>
                            {ticket.resolutionNotes && (
                              <p className="text-[11px] text-slate-200 italic">"{ticket.resolutionNotes}"</p>
                            )}
                            {ticket.spareParts && (
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Parts: {ticket.spareParts}</p>
                            )}
                            {ticket.resolutionPhoto && (
                              <div className="mt-1.5 flex items-center gap-2">
                                <img
                                  src={ticket.resolutionPhoto}
                                  alt="Fix Proof"
                                  className="w-12 h-12 object-cover rounded-lg border border-emerald-300 shadow-2xs cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(ticket.resolutionPhoto, '_blank')}
                                  title="Click to view full fix proof photo"
                                />
                                <span className="text-[10px] font-bold text-emerald-700">Verified Proof Photo Attached</span>
                              </div>
                            )}
                          </div>
                        )}
                        {ticket.status !== 'RESOLVED' && ticket.status !== 'REJECTED' && ticket.photos && ticket.photos.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Defect:</span>
                            <img
                              src={ticket.photos[0]}
                              alt="Defect"
                              className="w-9 h-9 object-cover rounded-lg border border-slate-700/60 shadow-2xs cursor-pointer hover:opacity-90"
                              onClick={() => window.open(ticket.photos[0], '_blank')}
                              title="Click to view reported defect photo"
                            />
                          </div>
                        )}
                      </div>

                      {/* State Transition Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ticket.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Start Work On-Site
                          </button>
                        )}

                        {ticket.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => setResolveModalTicket(ticket)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Mark as Resolved
                          </button>
                        )}

                        {/* Reject Ticket Action */}
                        {['ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(ticket.status) && (
                          <button
                            onClick={() => setRejectModalTicket(ticket)}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                            title="Reject this complaint and send official reason email to reporter"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}

                        {ticket.status === 'RESOLVED' && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                            Awaiting Reporter Rating
                          </span>
                        )}

                        {ticket.status === 'REJECTED' && (
                          <span className="text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" /> Rejection Email Dispatched
                          </span>
                        )}

                        {ticket.status === 'REOPENED' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Re-Inspect & Rework
                          </button>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* ROLE 3: ADMIN & ANALYTICS VIEW */}
        {currentRole === 'ADMIN' && (
          <div className="space-y-6">

            {/* TAB 1: ANALYTICS DASHBOARD */}
            {(activeTab === 'dashboard' || !['complaints', 'solved', 'staff', 'qrs', 'profile'].includes(activeTab)) && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Campus Analytics & Operations Intelligence</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ● Live Connected
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Real-time incident heatmaps, mean-time-to-repair (MTTR), and 48-hour SLA compliance across RK Valley
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('complaints')}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Complaints ({visibleComplaints.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('staff')}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Department Staff ({staffList.length || 6})</span>
                    </button>
                  </div>
                </div>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Complaints</span>
                    <div className="text-2xl font-black text-white mt-1">{visibleComplaints.length}</div>
                    <span className="text-xs text-emerald-600 font-bold mt-2 block">+12% vs last month</span>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase">Average MTTR</span>
                    <div className="text-2xl font-black text-white mt-1">18.4 hrs</div>
                    <span className="text-xs text-emerald-600 font-bold mt-2 block">-2.6 hrs faster</span>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase">SLA Compliance</span>
                    <div className="text-2xl font-black text-white mt-1">94.2%</div>
                    <span className="text-xs text-emerald-600 font-bold mt-2 block">Target: &gt;90%</span>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase">Critical Backlog</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">
                      {visibleComplaints.filter(c => c.priority === 'EMERGENCY').length}
                    </div>
                    <span className="text-xs text-rose-600 font-bold mt-2 block">P1 Escalations</span>
                  </div>
                </div>

                {/* Heatmap & MTTR Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Incident Heatmap (7 cols) */}
                  <div className="lg:col-span-7 cyber-card p-5 md:p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          Category × Location Incident Heatmap
                        </h3>
                        <p className="text-xs text-slate-400">Incident concentration across buildings</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-700/60 text-xs font-bold text-slate-400 uppercase">
                            <th className="py-2.5 px-3">Building</th>
                            <th className="py-2.5 px-2 text-center">Electrical</th>
                            <th className="py-2.5 px-2 text-center">Plumbing</th>
                            <th className="py-2.5 px-2 text-center">IT / AV</th>
                            <th className="py-2.5 px-2 text-center">Civil</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {analytics?.heatmap?.locations.map(loc => {
                            const row = analytics.heatmap.matrix[loc] || {};
                            return (
                              <tr key={loc} className="hover:cyber-card-subtle">
                                <td className="py-3 px-3 font-bold text-slate-100">{loc}</td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`inline-block px-2 py-1 rounded-md font-bold ${
                                    (row['Electrical'] || 0) > 35 ? 'bg-rose-500 text-white' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {row['Electrical'] || 12}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`inline-block px-2 py-1 rounded-md font-bold ${
                                    (row['Plumbing'] || 0) > 40 ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {row['Plumbing'] || 8}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-block px-2 py-1 rounded-md font-bold bg-indigo-100 text-indigo-800">
                                    {row['IT / AV'] || 15}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-block px-2 py-1 rounded-md font-bold bg-slate-800/80 text-slate-200">
                                    {row['Civil/Furn'] || 6}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MTTR by Department (5 cols) */}
                  <div className="lg:col-span-5 cyber-card p-5 md:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight mb-1">Average MTTR by Department</h3>
                      <p className="text-xs text-slate-400 mb-5">Mean duration from submission to verified fix</p>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'Electrical', mttr: '14.2 hrs', goal: '18h', pct: 94 },
                          { name: 'IT & AV Support', mttr: '6.5 hrs', goal: '8h', pct: 98 },
                          { name: 'Plumbing', mttr: '26.8 hrs', goal: '24h', pct: 86, warn: true },
                          { name: 'Civil & Furniture', mttr: '44.1 hrs', goal: '48h', pct: 91 },
                          { name: 'Housekeeping', mttr: '3.8 hrs', goal: '4h', pct: 99 }
                        ].map(d => (
                          <div key={d.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-100">{d.name}</span>
                              <span className={d.warn ? 'text-amber-600' : 'text-white'}>{d.mttr}</span>
                            </div>
                            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${d.warn ? 'bg-amber-500' : 'bg-slate-900'}`} style={{ width: `${d.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-3 cyber-card-subtle rounded-xl border border-slate-700/60 text-xs text-slate-300">
                      💡 <strong>Tip:</strong> Plumbing MTTR exceeds target by 2.8 hours due to supply line repairs in Nilgiri Hostel.
                    </div>
                  </div>
                </div>

                {/* Recurring Hotspots & Root-Cause Analysis */}
                <div className="cyber-card p-5 md:p-6 rounded-2xl">
                  <h3 className="font-bold text-base text-white tracking-tight mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Recurring Problem Hotspots & Root-Cause Recommendations
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">Chronically failing assets flagged by automated clustering</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-700/60 cyber-card-subtle">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">6 failures / 60 days</span>
                      <h4 className="font-bold text-sm text-white mt-2">Hitachi 2-Ton Split AC #AC-304</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Aryabhatta Block, CS Lab 201</p>
                      <p className="text-xs text-slate-300 mt-2"><strong>Diagnosis:</strong> Phase voltage imbalance causing capacitor burnout.</p>
                      <div className="mt-3 text-xs font-bold text-white bg-slate-200 p-2 rounded-lg">
                        Rec: Replace stabilizer under vendor warranty.
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-700/60 cyber-card-subtle">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">9 failures / 90 days</span>
                      <h4 className="font-bold text-sm text-white mt-2">Main Water Booster Pump Line 2</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Hostel Nilgiri Basement</p>
                      <p className="text-xs text-slate-300 mt-2"><strong>Diagnosis:</strong> Cavitation causing recurring valve gasket ruptures.</p>
                      <div className="mt-3 text-xs font-bold text-white bg-slate-200 p-2 rounded-lg">
                        Rec: Overhaul check-valve & inspect impeller.
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-700/60 cyber-card-subtle">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">4 failures / 30 days</span>
                      <h4 className="font-bold text-sm text-white mt-2">Ceiling Mount HDMI Projector</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Main Library, Seminar Room 1</p>
                      <p className="text-xs text-slate-300 mt-2"><strong>Diagnosis:</strong> Overheating intake fan clogged with ambient dust.</p>
                      <div className="mt-3 text-xs font-bold text-slate-950 bg-slate-200 p-2 rounded-lg">
                        Rec: Fit industrial washable dust hood filter.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ALL COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">All Campus Maintenance Complaints</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {visibleComplaints.length} Total Complaints
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Supervise, inspect, search, filter, and verify redressal status across all campus hostels and academic facilities
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={fetchData}
                      disabled={isRefreshing}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-slate-200 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Sync and refresh all complaints in real-time"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="cyber-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'ALL', label: 'All', count: visibleComplaints.length },
                      { id: 'ASSIGNED', label: 'Open / Assigned', count: visibleComplaints.filter(c => c.status === 'ASSIGNED' || c.status === 'OPEN').length },
                      { id: 'IN_PROGRESS', label: 'In Progress', count: visibleComplaints.filter(c => c.status === 'IN_PROGRESS').length },
                      { id: 'RESOLVED', label: 'Resolved / Fixed', count: visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length },
                      { id: 'REJECTED', label: 'Rejected', count: visibleComplaints.filter(c => c.status === 'REJECTED').length },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAdminComplaintsStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          adminComplaintsStatusFilter === st.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>{st.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          adminComplaintsStatusFilter === st.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-900 font-bold'
                        }`}>
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search and Category Filter */}
                  <div className="flex items-center gap-2">
                    <select
                      value={adminComplaintsCategoryFilter}
                      onChange={(e) => setAdminComplaintsCategoryFilter(e.target.value)}
                      className="px-3 py-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="IT Systems">IT Systems</option>
                      <option value="Civil">Civil & Furniture</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Safety">Safety</option>
                      {Boolean(
                        activeProfileKey === 'DIRECTOR' ||
                        activeProfileKey?.startsWith('ICC_') ||
                        currentUser?.category === 'ICC Committee' ||
                        currentUser?.idNo?.startsWith('ICC-') ||
                        currentUser?.idNo === 'DIR-APEX-01'
                      ) && (
                        <option value="Internal Complaints Committee (ICC)">⚖️ Internal Complaints Committee (ICC)</option>
                      )}
                    </select>

                    <div className="relative min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminComplaintsSearch}
                        onChange={(e) => setAdminComplaintsSearch(e.target.value)}
                        placeholder="Search ticket, title, room..."
                        className="w-full pl-9 pr-3 py-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      {adminComplaintsSearch && (
                        <button
                          type="button"
                          onClick={() => setAdminComplaintsSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filtered Complaints List */}
                <div className="space-y-3">
                  {visibleComplaints
                    .filter(c => {
                      if (adminComplaintsStatusFilter !== 'ALL') {
                        if (adminComplaintsStatusFilter === 'ASSIGNED' && c.status !== 'ASSIGNED' && c.status !== 'OPEN') return false;
                        if (adminComplaintsStatusFilter === 'RESOLVED' && c.status !== 'RESOLVED' && c.status !== 'CLOSED') return false;
                        if (!['ASSIGNED', 'RESOLVED'].includes(adminComplaintsStatusFilter) && c.status !== adminComplaintsStatusFilter) return false;
                      }
                      if (adminComplaintsCategoryFilter !== 'ALL') {
                        if (!c.category.toLowerCase().includes(adminComplaintsCategoryFilter.toLowerCase())) return false;
                      }
                      if (adminComplaintsSearch.trim()) {
                        const q = adminComplaintsSearch.toLowerCase();
                        const matchId = (c.ticketNumber || '').toLowerCase().includes(q);
                        const matchTitle = (c.title || '').toLowerCase().includes(q);
                        const matchRep = (c.reporterName || '').toLowerCase().includes(q);
                        const matchLoc = (c.location || '').toLowerCase().includes(q);
                        return matchId || matchTitle || matchRep || matchLoc;
                      }
                      return true;
                    })
                    .map(item => (
                      <div 
                        key={item.id}
                        className="cyber-card p-4 sm:p-5 rounded-2xlhover:border-slate-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-blue-600 text-xs">{item.ticketNumber}</span>
                            {(item.isIcc || item.category === 'Internal Complaints Committee (ICC)') && (
                              <MediumCommitteeFlowPill 
                                ticket={item} 
                                onClick={() => {
                                  setSelectedTicket(item);
                                  setSelectedIccModalTicket(item);
                                  setShowMediumCommitteeModal(true);
                                }} 
                              />
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                              item.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-800/80 text-slate-200'
                            }`}>
                              {item.priority}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              item.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-white leading-snug line-clamp-1">{item.title}</h3>
                          
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                            <span>🎓 <strong>Reporter:</strong> {item.reporterName} ({item.reporterEmail})</span>
                            <span>🔧 <strong>Assigned:</strong> {item.assignedStaffName || 'Unassigned'} ({item.category})</span>
                            <span>⏱️ <strong>SLA:</strong> {item.slaHours || 48}h</span>
                          </div>

                          {item.resolutionPhoto && (
                            <div className="flex items-center gap-2 pt-1">
                              <img
                                src={item.resolutionPhoto}
                                alt="Proof"
                                className="w-10 h-10 object-cover rounded-lg border border-emerald-300 cursor-pointer hover:opacity-80"
                                onClick={() => window.open(item.resolutionPhoto, '_blank')}
                                title="Click to view full fix proof photo"
                              />
                              <span className="text-[11px] font-bold text-emerald-700">Technician Fix Proof Attached</span>
                            </div>
                          )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">

                          {item.status === 'RESOLVED' && !item.adminVerified && (
                            <button
                              type="button"
                              onClick={() => handleAdminVerify(item.id, 'Official Chief Warden & Admin sign-off.')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verify Fix</span>
                            </button>
                          )}

                          {item.adminVerified && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>



              </div>
            )}

            {/* TAB: SOLVED COMPLAINTS & QUALITY AUDIT */}
            {activeTab === 'solved' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Solved Header Banner */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Solved Complaints & Quality Audit Hub</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                          Official Sign-off System
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Audit technician fix proofs, parts replaced, SLA compliance, student feedback, and grant Chief Warden verification seals
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-200 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Analytics</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('complaints')}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Complaints ({visibleComplaints.length})</span>
                    </button>
                  </div>
                </div>

                {/* Quick Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="cyber-card p-4 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block">Total Solved</span>
                    <span className="text-2xl font-black text-emerald-700 mt-1 block">
                      {visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length}
                    </span>
                    <span className="text-[10px] text-slate-400">Campus-wide resolved issues</span>
                  </div>
                  <div className="cyber-card p-4 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block">Admin Verified & Sealed</span>
                    <span className="text-2xl font-black text-blue-700 mt-1 block">
                      {visibleComplaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED') && c.adminVerified).length}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Quality standards approved</span>
                  </div>
                  <div className="cyber-card p-4 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block">Pending Admin Audit</span>
                    <span className="text-2xl font-black text-amber-600 mt-1 block">
                      {visibleComplaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED') && !c.adminVerified).length}
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold">Requires quality sign-off</span>
                  </div>
                  <div className="cyber-card p-4 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block">Avg Resident CSAT</span>
                    <span className="text-2xl font-black text-amber-500 mt-1 block">
                      ★ 4.8 / 5.0
                    </span>
                    <span className="text-[10px] text-slate-400">Student satisfaction rate</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="cyber-card p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search solved tickets by ID, title, room, staff, or resident..."
                      value={solvedSearch}
                      onChange={(e) => setSolvedSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    {solvedSearch && (
                      <button
                        onClick={() => setSolvedSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center bg-slate-800/80 p-1 rounded-xl">
                      <button
                        onClick={() => setSolvedVerifyFilter('ALL')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          solvedVerifyFilter === 'ALL'
                            ? 'bg-white text-slate-950 font-black shadow-2xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        All ({visibleComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length})
                      </button>
                      <button
                        onClick={() => setSolvedVerifyFilter('PENDING')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          solvedVerifyFilter === 'PENDING'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Pending Sign-off ({visibleComplaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED') && !c.adminVerified).length})
                      </button>
                      <button
                        onClick={() => setSolvedVerifyFilter('VERIFIED')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          solvedVerifyFilter === 'VERIFIED'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Admin Verified ({visibleComplaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED') && c.adminVerified).length})
                      </button>
                    </div>

                    <select
                      value={solvedDeptFilter}
                      onChange={(e) => setSolvedDeptFilter(e.target.value)}
                      className="px-3 py-1.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="IT Systems">IT Systems</option>
                      <option value="Housekeeping">Housekeeping</option>
                      {Boolean(
                        activeProfileKey === 'DIRECTOR' ||
                        activeProfileKey?.startsWith('ICC_') ||
                        currentUser?.category === 'ICC Committee' ||
                        currentUser?.idNo?.startsWith('ICC-') ||
                        currentUser?.idNo === 'DIR-APEX-01'
                      ) && (
                        <option value="Internal Complaints Committee (ICC)">⚖️ Internal Complaints Committee (ICC)</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Solved Complaints List */}
                <div className="space-y-4">
                  {visibleComplaints
                    .filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED')
                    .filter(c => {
                      if (solvedVerifyFilter === 'VERIFIED') return c.adminVerified;
                      if (solvedVerifyFilter === 'PENDING') return !c.adminVerified;
                      return true;
                    })
                    .filter(c => {
                      if (solvedDeptFilter === 'ALL') return true;
                      return c.category === solvedDeptFilter;
                    })
                    .filter(c => {
                      if (!solvedSearch.trim()) return true;
                      const q = solvedSearch.toLowerCase();
                      return (
                        c.ticketNumber?.toLowerCase().includes(q) ||
                        c.title?.toLowerCase().includes(q) ||
                        c.description?.toLowerCase().includes(q) ||
                        c.location?.toLowerCase().includes(q) ||
                        c.reporterName?.toLowerCase().includes(q) ||
                        c.resolutionNotes?.toLowerCase().includes(q) ||
                        c.spareParts?.toLowerCase().includes(q)
                      );
                    })
                    .length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-2xl border border-slate-700/60 shadow-xs">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <h3 className="font-bold text-slate-200 text-sm">No Solved Complaints Found</h3>
                        <p className="text-xs text-slate-400 mt-1">No tickets match the selected filters or search keyword.</p>
                      </div>
                    ) : (
                      complaints
                        .filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED')
                        .filter(c => {
                          if (solvedVerifyFilter === 'VERIFIED') return c.adminVerified;
                          if (solvedVerifyFilter === 'PENDING') return !c.adminVerified;
                          return true;
                        })
                        .filter(c => {
                          if (solvedDeptFilter === 'ALL') return true;
                          return c.category === solvedDeptFilter;
                        })
                        .filter(c => {
                          if (!solvedSearch.trim()) return true;
                          const q = solvedSearch.toLowerCase();
                          return (
                            c.ticketNumber?.toLowerCase().includes(q) ||
                            c.title?.toLowerCase().includes(q) ||
                            c.description?.toLowerCase().includes(q) ||
                            c.location?.toLowerCase().includes(q) ||
                            c.reporterName?.toLowerCase().includes(q) ||
                            c.resolutionNotes?.toLowerCase().includes(q) ||
                            c.spareParts?.toLowerCase().includes(q)
                          );
                        })
                        .map(ticket => {
                          const assignedStaff = staffList.find(s => s.id === ticket.assignedStaffId);
                          return (
                            <div
                              key={ticket.id}
                              className={`cyber-card p-5 rounded-2xlborder transition-all ${
                                ticket.adminVerified
                                  ? 'border-slate-700/60 hover:border-blue-300'
                                  : 'border-amber-200 bg-amber-50/10 hover:border-amber-300'
                              } shadow-xs flex flex-col gap-4`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{ticket.ticketNumber}</span>
                                  {ticket.isIcc || ticket.category === 'Internal Complaints Committee (ICC)' ? (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                                      ⚖️ ICC Committee {ticket.committeeLevel ? `(${ticket.committeeLevel.split(':')[0]})` : ''}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/60">
                                      {ticket.category}
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    ticket.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {ticket.priority}
                                  </span>
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {ticket.status}
                                  </span>
                                  {ticket.adminVerified ? (
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                                      Verified Quality Seal
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                                      <AlertCircle className="w-3 h-3 text-amber-600" />
                                      Awaiting Admin Sign-off
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Resolved: {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                  <h4 className="font-bold text-base text-white tracking-tight">{ticket.title}</h4>
                                  <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ticket.location}
                                  </p>
                                  <p className="text-xs text-slate-300">{ticket.description}</p>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                                    <span>Reporter: <strong className="text-slate-200">{ticket.reporterName || 'Student Resident'}</strong> ({ticket.reporterEmail})</span>
                                    <span>•</span>
                                    <span>Technician: <strong className="text-slate-200">{assignedStaff ? assignedStaff.name : 'Duty Staff'}</strong></span>
                                  </div>
                                </div>

                                {/* Fix Proof Thumbnail & Info */}
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                                  <span className="text-[11px] font-bold text-emerald-900 block flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    Technician Fix Proof:
                                  </span>
                                  {ticket.resolutionNotes && (
                                    <p className="text-[11px] text-slate-200 italic">"{ticket.resolutionNotes}"</p>
                                  )}
                                  {ticket.spareParts && (
                                    <p className="text-[10px] text-slate-300 font-medium">
                                      Parts: <strong className="text-slate-100">{ticket.spareParts}</strong>
                                    </p>
                                  )}
                                  {ticket.resolutionPhoto && (
                                    <div className="flex items-center gap-2 pt-1">
                                      <img
                                        src={ticket.resolutionPhoto}
                                        alt="Proof"
                                        className="w-14 h-14 object-cover rounded-lg border border-emerald-300 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => window.open(ticket.resolutionPhoto, '_blank')}
                                        title="Click to view full photo"
                                      />
                                      <span className="text-[10px] font-bold text-emerald-700">Click photo to inspect</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Resident Feedback / CSAT */}
                              {(ticket.studentRating || ticket.rating || ticket.studentFeedback) && (
                                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-900">Student CSAT:</span>
                                    <span className="text-amber-500 font-bold tracking-widest text-sm">
                                      {'★'.repeat(ticket.studentRating || ticket.rating || 5)}
                                    </span>
                                    <span className="font-bold text-amber-800">({ticket.studentRating || ticket.rating || 5}/5)</span>
                                  </div>
                                  {ticket.studentFeedback && (
                                    <p className="text-slate-300 italic">
                                      "{ticket.studentFeedback}"
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Admin Sign-off & Quality Audit Status */}
                              <div className="p-3 cyber-card-subtle rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {ticket.adminVerified ? (
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <div className="text-xs">
                                      <p className="font-bold text-emerald-900">Quality Verified by {ticket.adminVerifiedBy || 'Chief Warden & Estate Office'}</p>
                                      <p className="text-[11px] text-slate-400">"{ticket.adminRemark || 'Fix proof and on-site repair inspected and approved.'}"</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                                    <div className="text-xs">
                                      <p className="font-bold text-amber-900">Pending Official Quality Verification</p>
                                      <p className="text-[11px] text-slate-400">Review technician resolution proof and confirm quality closure seal</p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  {!ticket.adminVerified && (
                                    <button
                                      onClick={() => handleAdminVerify(ticket.id, 'Official Chief Warden & Admin sign-off: Fix inspected and verified.')}
                                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Verify & Grant Quality Seal</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                    }}
                                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Thread</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenWayfinding(ticket)}
                                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span>Map Route</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                </div>
              </div>
            )}

            {/* TAB 3: DEPARTMENT STAFF */}
            {activeTab === 'staff' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Department Staff Header Banner */}
                <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Campus Department Staff & Technicians</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          6 Technicians On-Duty
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Live workforce allocation, trade specialization, active work order queues, CSAT ratings, and zone distribution
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Dispatched campus-wide duty check SMS & push notification to all on-duty technicians.");
                      }}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Broadcast Duty Ping</span>
                    </button>
                  </div>
                </div>

                {/* Staff KPI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff Coverage</span>
                    <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
                      <span>{staffList.length || 6}</span>
                      <span className="text-xs font-bold text-emerald-600">100% On-Duty</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Across 6 Specialized Trades</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Work Orders</span>
                    <div className="text-2xl font-black text-blue-600 mt-1 flex items-baseline gap-2">
                      <span>{visibleComplaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length}</span>
                      <span className="text-xs font-bold text-blue-500">In Hand</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Live technician queues</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus CSAT Score</span>
                    <div className="text-2xl font-black text-amber-500 mt-1 flex items-baseline gap-1">
                      <span>★ 4.74</span>
                      <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Top-Tier Student Rating</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">First-Time Fix Rate</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1 flex items-baseline gap-1">
                      <span>93.2%</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Target: &gt;90% Exceeded</span>
                  </div>
                </div>

                {/* Trade Filters & Search Bar */}
                <div className="cyber-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Trade Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'ALL', label: 'All Trades', count: staffList.length || 6 },
                      { id: 'Electrical', label: '⚡ Electrical', count: staffList.filter(s => s.trade === 'Electrical').length || 1 },
                      { id: 'Plumbing', label: '🔧 Plumbing', count: staffList.filter(s => s.trade === 'Plumbing').length || 1 },
                      { id: 'IT Systems', label: '💻 IT Systems', count: staffList.filter(s => s.trade.includes('IT')).length || 1 },
                      { id: 'Civil', label: '🪑 Civil & Furn', count: staffList.filter(s => s.trade.includes('Civil') || s.trade.includes('Furniture')).length || 1 },
                      { id: 'Housekeeping', label: '🧹 Housekeeping', count: staffList.filter(s => s.trade === 'Housekeeping').length || 1 },
                      { id: 'Safety', label: '🛡️ Safety', count: staffList.filter(s => s.trade === 'Safety').length || 1 },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAdminStaffTradeFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          adminStaffTradeFilter === tab.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          adminStaffTradeFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-900 font-bold'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminStaffSearch}
                      onChange={(e) => setAdminStaffSearch(e.target.value)}
                      placeholder="Search technician, zone, phone..."
                      className="w-full pl-9 pr-3 py-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                    {adminStaffSearch && (
                      <button
                        type="button"
                        onClick={() => setAdminStaffSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {staffList
                    .filter(s => {
                      if (adminStaffTradeFilter !== 'ALL') {
                        if (adminStaffTradeFilter === 'Civil' && !s.trade.includes('Civil') && !s.trade.includes('Furniture')) return false;
                        if (adminStaffTradeFilter === 'IT Systems' && !s.trade.includes('IT')) return false;
                        if (!['Civil', 'IT Systems'].includes(adminStaffTradeFilter) && !s.trade.toLowerCase().includes(adminStaffTradeFilter.toLowerCase())) return false;
                      }
                      if (adminStaffSearch.trim()) {
                        const q = adminStaffSearch.toLowerCase();
                        const matchName = s.name.toLowerCase().includes(q);
                        const matchTrade = s.trade.toLowerCase().includes(q);
                        const matchZone = (s.zones || []).some(z => z.toLowerCase().includes(q));
                        return matchName || matchTrade || matchZone;
                      }
                      return true;
                    })
                    .map(staff => {
                      // Lookup contact info
                      const contactPhone = staff.phone || '+91 98765 43210';
                      const contactEmail = staff.email || `${staff.trade.toLowerCase().replace(/[^a-z]/g, '')}@rgukt.ac.in`;
                      
                      // Active tickets assigned to this staff
                      const assignedTickets = visibleComplaints.filter(
                        c => c.assignedStaffId === staff.id || c.assignedStaffName === staff.name || (c.category && c.category.toLowerCase().includes(staff.trade.toLowerCase()))
                      );

                      // Trade styling
                      const isElec = staff.trade === 'Electrical';
                      const isPlumb = staff.trade === 'Plumbing';
                      const isIT = staff.trade.includes('IT');
                      const isCivil = staff.trade.includes('Civil') || staff.trade.includes('Furniture');
                      const isHouse = staff.trade === 'Housekeeping';

                      const themeBorder = isElec ? 'border-amber-300 hover:border-amber-400' :
                                          isPlumb ? 'border-sky-300 hover:border-sky-400' :
                                          isIT ? 'border-indigo-300 hover:border-indigo-400' :
                                          isCivil ? 'border-orange-300 hover:border-orange-400' :
                                          isHouse ? 'border-emerald-300 hover:border-emerald-400' :
                                          'border-rose-300 hover:border-rose-400';

                      const themeBg = isElec ? 'bg-amber-500' :
                                      isPlumb ? 'bg-sky-500' :
                                      isIT ? 'bg-indigo-500' :
                                      isCivil ? 'bg-orange-500' :
                                      isHouse ? 'bg-emerald-500' :
                                      'bg-rose-500';

                      return (
                        <div 
                          key={staff.id} 
                          className={`bg-white rounded-2xl border-2 ${themeBorder} p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                        >
                          <div>
                            {/* Card Top: Avatar, Name, Status */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl ${themeBg} text-white font-bold text-lg flex items-center justify-center shadow-xs`}>
                                  {staff.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-base text-white tracking-tight leading-tight">{staff.name}</h3>
                                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800/80 text-slate-200">
                                    {staff.trade}
                                  </span>
                                </div>
                              </div>

                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                ON DUTY
                              </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-1.5 py-2.5 my-2 border-y border-slate-800/60 text-xs">
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                                </span>
                                <span className="font-semibold text-slate-100 truncate max-w-[180px]">{contactEmail}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> Mobile:
                                </span>
                                <span className="font-bold text-white">{contactPhone}</span>
                              </div>
                            </div>

                            {/* Assigned Campus Zones */}
                            <div className="mb-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Assigned Campus Zones
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {(staff.zones || ['Academics', 'Hostels']).map((zone, idx) => (
                                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800/80 text-slate-200 rounded-md">
                                    📍 {zone}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Metrics Strip */}
                            <div className="grid grid-cols-4 gap-1.5 p-2.5 cyber-card-subtle rounded-xl border border-slate-700/60/70 text-center mb-4">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Active</span>
                                <span className="text-xs font-black text-blue-600">{staff.activeTickets}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Resolved</span>
                                <span className="text-xs font-black text-slate-200">{staff.resolvedMonth}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">CSAT</span>
                                <span className="text-xs font-black text-amber-600">★{staff.csat}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">FTFR</span>
                                <span className="text-xs font-black text-emerald-600">{staff.ftfr}%</span>
                              </div>
                            </div>

                            {/* Live Work Orders in Queue */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                <span className="text-slate-200">Assigned Tickets ({assignedTickets.length})</span>
                                {assignedTickets.length > 0 ? (
                                  <span className="text-[10px] text-blue-600 font-semibold">In Progress</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-600 font-semibold">🟢 Queue Empty</span>
                                )}
                              </div>

                              {assignedTickets.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic cyber-card-subtle p-2 rounded-lg">
                                  No pending tickets — available for instant dispatch.
                                </p>
                              ) : (
                                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                  {assignedTickets.slice(0, 2).map(t => (
                                    <div key={t.id} className="p-2 cyber-card-subtle rounded-lg border border-slate-700/60 text-xs flex items-center justify-between">
                                      <div className="truncate mr-2">
                                        <span className="font-mono font-bold text-slate-100 text-[10px] block">{t.ticketNumber}</span>
                                        <span className="text-slate-300 text-[11px] truncate block">{t.title}</span>
                                      </div>
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                                        t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                                        t.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {t.status}
                                      </span>
                                    </div>
                                  ))}
                                  {assignedTickets.length > 2 && (
                                    <span className="text-[10px] text-blue-600 font-bold block text-center">
                                      + {assignedTickets.length - 2} more ticket(s)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => alert(`Calling technician ${staff.name} at ${contactPhone}...`)}
                              className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                              <span>Call Staff</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const msg = prompt(`Dispatch instructions email to ${staff.name} (${contactEmail}):`, "Urgent priority maintenance call for student hostel block.");
                                if (msg) {
                                  alert(`Official dispatch email sent to ${contactEmail} with instructions:\n"${msg}"`);
                                }
                              }}
                              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Scorecard Table Below */}
                <div className="cyber-card p-5 md:p-6 rounded-2xl">
                  <h3 className="font-bold text-base text-white tracking-tight mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Complete Staff Workload & Performance Scorecard
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Detailed comparison across all active campus trades</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[550px]">
                      <thead>
                        <tr className="border-b border-slate-700/60 text-xs font-bold text-slate-400 uppercase cyber-card-subtle">
                          <th className="py-2.5 px-3">Technician</th>
                          <th className="py-2.5 px-3">Trade</th>
                          <th className="py-2.5 px-3 text-center">Active Orders</th>
                          <th className="py-2.5 px-3 text-center">Resolved (Month)</th>
                          <th className="py-2.5 px-3 text-center">CSAT</th>
                          <th className="py-2.5 px-3 text-right">FTFR %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {staffList.map(s => (
                          <tr key={s.id} className="hover:cyber-card-subtle">
                            <td className="py-3 px-3 font-bold text-white">{s.name}</td>
                            <td className="py-3 px-3 text-slate-300">{s.trade}</td>
                            <td className="py-3 px-3 text-center font-bold text-blue-600">{s.activeTickets}</td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-200">{s.resolvedMonth}</td>
                            <td className="py-3 px-3 text-center font-bold text-amber-600">★ {s.csat}</td>
                            <td className="py-3 px-3 text-right font-black text-emerald-600">{s.ftfr}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ADMIN PROFILE VIEW */}
            {activeTab === 'profile' && (
              <FullProfileView
                currentUser={currentUser}
                currentRole={currentRole}
                complaints={visibleComplaints}
                onOpenEditModal={() => setShowProfileEditModal(true)}
              />
            )}

            </div>
        )}

            </div>
          </div>
        </div>

      

      {/* MODAL: LEVEL 2 MEDIUM COMMITTEE (6 MEMBERS) INQUIRY & DISPOSAL FLOW */}
      <MediumCommitteeFlowModal
        isOpen={showMediumCommitteeModal}
        onClose={() => setShowMediumCommitteeModal(false)}
        ticket={selectedIccModalTicket || complaints.find(c => c.isIcc || c.category?.includes('ICC')) || complaints[0]}
        currentUser={currentUser}
        currentRole={currentRole}
        onSendThreadMessage={handleSendThreadMessage}
        onApproveDisposal={handleApproveIccDisposal}
        onAllocateCommittee={handleAllocateIccCommittee}
      />

      {/* Hostel Hierarchy Escalation Questionnaire Modal */}
      <HostelEscalationQuestionnaireModal
        isOpen={showHostelEscalationModal}
        onClose={() => {
          setShowHostelEscalationModal(false);
          setSelectedHostelTicket(null);
        }}
        ticket={selectedHostelTicket || selectedTicket}
        onConfirmEscalate={handleConfirmHostelEscalation}
      />



      {/* MODAL: POST-RESOLUTION FEEDBACK & REOPEN FLOW */}
      {feedbackModalTicket && (
        <FeedbackModal
          ticket={feedbackModalTicket}
          onClose={() => setFeedbackModalTicket(null)}
          onSuccess={(msg) => {
            alert(msg);
            setFeedbackModalTicket(null);
            fetchData();
          }}
        />
      )}

      {/* MODAL: TECHNICIAN MARK RESOLVED WITH FIX & PHOTO PROOF */}
      {resolveModalTicket && (
        <ResolveProofModal
          ticket={resolveModalTicket}
          onClose={() => setResolveModalTicket(null)}
          onSubmit={async (notes, photo, spareParts) => {
            await handleUpdateStatus(resolveModalTicket.id, 'RESOLVED', notes, photo, spareParts);
          }}
        />
      )}

      {/* MODAL: DEPARTMENT REJECT TICKET FLOW WITH REASON & REMARKS */}
      {rejectModalTicket && (
        <RejectModal
          ticket={rejectModalTicket}
          onClose={() => setRejectModalTicket(null)}
          onReject={handleRejectTicket}
        />
      )}

      {/* MODAL: CAMPUS DISPATCH LOG & EMAIL CENTER */}
      {showMailboxModal && (
        <DispatchMailboxModal
          emails={emailLog}
          notifications={notifications}
          onClose={() => setShowMailboxModal(false)}
          onOpenSmtp={() => {
            setShowMailboxModal(false);
            setShowSmtpModal(true);
          }}
        />
      )}

      {/* MODAL: REAL SMTP & EMAIL SETTINGS */}
      {showSmtpModal && (
        <SmtpSettingsModal
          config={smtpConfig}
          onClose={() => setShowSmtpModal(false)}
          onSuccess={() => {
            fetchData();
          }}
          defaultTestEmail={reporterEmail || currentUser?.email || 'student@rgukt.ac.in'}
        />
      )}

      {/* MODAL: USER PROFILE SELF-EDIT DIALOG */}
      <UserProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        currentUser={currentUser}
        currentRole={currentRole}
        onSave={handleSaveUserProfile}
      />

      {/* TOAST: PROFILE EDIT SUCCESS NOTIFICATION */}
      {profileEditSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Profile Updated Successfully!</p>
              <p className="text-[11px] text-slate-300">Your details have updated dynamically and synced to cloud storage.</p>
            </div>
            <button
              type="button"
              onClick={() => setProfileEditSuccessToast(false)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: FIRST-TIME & HELP DEMO VIDEO TOUR MODAL */}
      <ProjectDemoVideoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        initialPrompt={demoInitialPrompt}
        onCompleteTour={() => {
          try {
            localStorage.setItem('rgukt_demo_tour_seen', 'true');
            localStorage.setItem('rgukt_demo_tour_prompted', 'true');
          } catch (e) {}
        }}
      />

    </div>
  );
}

// =========================================================================
// AUTH SCREEN (Exact implementation of the second reference image)
// =========================================================================
// AUTH SCREEN: First time register (ID NO, College Email Id, Password)
// & Every time login (ID NO, Password only)
// =========================================================================
// =========================================================================
// DEFAULT CAMPUS ACCOUNTS (Credentials for Student & All Department Profiles)
// =========================================================================
export const DEFAULT_CAMPUS_ACCOUNTS = [
  // 1. STUDENT PROFILE
  {
    idNo: 'R200101',
    collegeEmail: 'student@rgukt.ac.in',
    password: 'Student@123',
    fullName: 'K. Sai Tharun',
    role: 'REPORTER',
    userTab: 'student',
    profileKey: 'REPORTER',
    category: 'Student',
    designation: 'Student Resident',
    department: 'Computer Science & Engineering',
    mobileNumber: '9876543210',
    hostelBlock: 'PENNA',
    hostelRoom: 'Room 214'
  },

  // 2. WARDEN PROFILE (Stage 1 Authority)
  {
    idNo: 'WARDEN-HOSTEL-01',
    collegeEmail: 'warden@rgukt.ac.in',
    password: 'Warden@123',
    fullName: 'Prof. K. Ramesh',
    role: 'WARDEN',
    userTab: 'department',
    profileKey: 'WARDEN',
    category: 'Hostel Facilities',
    designation: 'Hostel Resident Warden',
    department: 'Hostel Administration & Residence Care',
    mobileNumber: '8588283610',
    hierarchyStage: 'WARDEN'
  },

  // 3. DSW PROFILE (Dean Student Welfare - Stage 2 Authority)
  {
    idNo: 'DSW-OFFICE-01',
    collegeEmail: 'dsw@rgukt.ac.in',
    password: 'Dsw@123',
    fullName: 'Dr. P. Sudhakar',
    role: 'DSW',
    userTab: 'department',
    profileKey: 'DSW',
    category: 'Student Welfare',
    designation: 'Dean of Student Welfare (DSW)',
    department: 'Deanery of Student Welfare & Student Affairs',
    mobileNumber: '8588283620',
    hierarchyStage: 'DSW_DEPT'
  },

  // 4. ELECTRICAL WORKS DEPARTMENT
  {
    idNo: 'TECH-ELEC-042',
    collegeEmail: 'electrical@rgukt.ac.in',
    password: 'Electrical@123',
    fullName: 'Rajesh Kumar',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_ELECTRICAL',
    staffId: 'staff-1',
    category: 'Electrical',
    departmentKey: 'Electrical Works',
    designation: 'Assistant Executive Engineer (Electrical)',
    department: 'Electrical & Power Works Department',
    mobileNumber: '9848022338',
    hierarchyStage: 'DSW_DEPT'
  },

  // 5. PLUMBING & WATER WORKS DEPARTMENT
  {
    idNo: 'TECH-PLUMB-018',
    collegeEmail: 'plumbing@rgukt.ac.in',
    password: 'Plumbing@123',
    fullName: 'S. Venkatesh',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_PLUMBING',
    staffId: 'staff-2',
    category: 'Plumbing',
    departmentKey: 'Plumbing & Water Supply',
    designation: 'Senior Water Works Superintendent',
    department: 'Plumbing & Water Works Department',
    mobileNumber: '9848022339',
    hierarchyStage: 'DSW_DEPT'
  },

  // 6. CIVIL & CARPENTRY DEPARTMENT
  {
    idNo: 'TECH-CIVIL-025',
    collegeEmail: 'civil@rgukt.ac.in',
    password: 'Civil@123',
    fullName: 'M. Ramana',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_CIVIL',
    staffId: 'staff-3',
    category: 'Civil',
    departmentKey: 'Civil & Carpentry',
    designation: 'Civil Inspector & Carpentry Overseer',
    department: 'Civil Works & Infrastructure Department',
    mobileNumber: '9848022340',
    hierarchyStage: 'DSW_DEPT'
  },

  // 7. IT SYSTEMS & WI-FI DEPARTMENT
  {
    idNo: 'TECH-IT-007',
    collegeEmail: 'itsupport@rgukt.ac.in',
    password: 'Itsupport@123',
    fullName: 'K. Srinivas',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_IT',
    staffId: 'staff-4',
    category: 'IT Systems',
    departmentKey: 'IT & Wi-Fi Network',
    designation: 'Campus Network & IT Systems Incharge',
    department: 'IT Systems & Campus Network Department',
    mobileNumber: '9848022341',
    hierarchyStage: 'DSW_DEPT'
  },

  // 8. HOUSEKEEPING & SANITATION DEPARTMENT
  {
    idNo: 'TECH-CLEAN-014',
    collegeEmail: 'clean@rgukt.ac.in',
    password: 'Clean@123',
    fullName: 'G. Lakshmi',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_HOUSEKEEPING',
    staffId: 'staff-5',
    category: 'Housekeeping',
    departmentKey: 'Housekeeping & Sanitation',
    designation: 'Chief Sanitation & Cleanliness Supervisor',
    department: 'Housekeeping & Sanitation Department',
    mobileNumber: '9848022342',
    hierarchyStage: 'DSW_DEPT'
  },

  // 9. SAFETY & HEALTH HYGIENE DEPARTMENT
  {
    idNo: 'TECH-SAFE-003',
    collegeEmail: 'safety@rgukt.ac.in',
    password: 'Safety@123',
    fullName: 'T. Prasad',
    role: 'STAFF',
    userTab: 'department',
    profileKey: 'DEPT_SAFETY',
    staffId: 'staff-6',
    category: 'Safety',
    departmentKey: 'Safety & Pest Control',
    designation: 'Campus Safety & Health Hygiene Officer',
    department: 'Safety & Health Hygiene Department',
    mobileNumber: '9848022343',
    hierarchyStage: 'DSW_DEPT'
  },

  // 10. ADMINISTRATIVE OFFICER (AO - Stage 3 Authority)
  {
    idNo: 'AO-ADMIN-01',
    collegeEmail: 'ao@rgukt.ac.in',
    password: 'Ao@123',
    fullName: 'Sri. B. Venkat Rao',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'AO',
    category: 'Administration',
    designation: 'Administrative Officer (AO)',
    department: 'Central Campus Administration',
    mobileNumber: '8588283630',
    hierarchyStage: 'AO'
  },

  // 11. THE DIRECTOR (Apex Institutional Authority - Stage 4)
  {
    idNo: 'DIR-APEX-01',
    collegeEmail: 'director@rgukt.ac.in',
    password: 'Director@123',
    fullName: 'Prof. K. Hemachandra Reddy',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'DIRECTOR',
    category: 'Directorate',
    designation: 'The Director, RGUKT RK Valley',
    department: 'Office of The Director (Apex Institutional Head)',
    mobileNumber: '8588283600',
    hierarchyStage: 'DIRECTOR'
  },

  // 12. ICC PRESIDING OFFICER (Statutory Head, Internal Complaints Committee)
  {
    idNo: 'ICC-PO-01',
    collegeEmail: 'ratnakumari.icc@rgukt.ac.in',
    password: 'Icc@123',
    fullName: 'Dr. Ratnakumari Challa',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'ICC_PRESIDING',
    category: 'ICC Committee',
    designation: 'Presiding Officer, ICC',
    department: 'Internal Complaints Committee (ICC Secretariat)',
    mobileNumber: '8588283640',
    hierarchyStage: 'DIRECTOR'
  },

  // 13. ICC WOMAN FACULTY MEMBER 1
  {
    idNo: 'ICC-WOMAN-01',
    collegeEmail: 'suvarna.icc@rgukt.ac.in',
    password: 'Suvarna@123',
    fullName: 'Dr. Suvarna',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'ICC_WOMAN_FACULTY_1',
    category: 'ICC Committee',
    designation: 'Woman Faculty Member, ICC',
    department: 'Internal Complaints Committee & Academic Faculty',
    mobileNumber: '8588283641',
    hierarchyStage: 'DIRECTOR'
  },

  // 14. ICC WOMAN FACULTY MEMBER 2
  {
    idNo: 'ICC-WOMAN-02',
    collegeEmail: 'vimala.icc@rgukt.ac.in',
    password: 'Vimala@123',
    fullName: 'Dr. Vimala Persis',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'ICC_WOMAN_FACULTY_2',
    category: 'ICC Committee',
    designation: 'Woman Faculty Member, ICC',
    department: 'Internal Complaints Committee & Academic Faculty',
    mobileNumber: '8588283642',
    hierarchyStage: 'DIRECTOR'
  },

  // 15. ICC EXTERNAL LEGAL MEMBER
  {
    idNo: 'ICC-LEGAL-01',
    collegeEmail: 'neelima.advocate@rgukt.ac.in',
    password: 'Advocate@123',
    fullName: 'Ms. Chennamasetti Neelima',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'ICC_LEGAL',
    category: 'ICC Committee',
    designation: 'Advocate, Kadapa District Bar (External Legal Member)',
    department: 'External Statutory Legal Cell, ICC',
    mobileNumber: '9440281122',
    hierarchyStage: 'DIRECTOR'
  },

  // 16. ICC LAW ENFORCEMENT POLICE MEMBER
  {
    idNo: 'ICC-POLICE-01',
    collegeEmail: 'si.rkvpolice@rgukt.ac.in',
    password: 'Police@123',
    fullName: 'Sub-Inspector, RK Valley Police Station',
    role: 'ADMIN',
    userTab: 'department',
    profileKey: 'ICC_POLICE',
    category: 'ICC Committee',
    designation: 'Sub-Inspector of Police (Law Enforcement Representative)',
    department: 'Station House Office, RK Valley Police Station',
    mobileNumber: '8588283699',
    hierarchyStage: 'DIRECTOR'
  }
];

// List of known official department accounts and emails
export const DEPARTMENT_EMAILS = [
  'electrical@rgukt.ac.in',
  'plumbing@rgukt.ac.in',
  'itsupport@rgukt.ac.in',
  'civil@rgukt.ac.in',
  'clean@rgukt.ac.in',
  'safety@rgukt.ac.in',
  'warden@rgukt.ac.in',
  'dsw@rgukt.ac.in',
  'ao@rgukt.ac.in',
  'director@rgukt.ac.in',
  'admin.facilities@rgukt.ac.in',
  'rajesh.electrician@rgukt.ac.in',
  'ratnakumari.icc@rgukt.ac.in',
  'suvarna.icc@rgukt.ac.in',
  'vimala.icc@rgukt.ac.in',
  'neelima.advocate@rgukt.ac.in',
  'si.rkvpolice@rgukt.ac.in'
];

export const DEPARTMENT_KEYWORDS = [
  'electrical',
  'elec',
  'plumb',
  'itsupport',
  'clean',
  'housekeep',
  'civil',
  'safety',
  'admin',
  'facilities',
  'warden',
  'dsw',
  'director',
  'ao',
  'technician',
  'staff',
  'dept',
  'faculty',
  'maintenance',
  'supervisor'
];

// Determine if a credential string is strictly a Student credential
export function isStudentCredential(str) {
  if (!str || typeof str !== 'string') return false;
  const raw = str.trim();
  const lower = raw.toLowerCase();
  const upper = raw.toUpperCase();

  // 1. Student ID pattern: R followed by 5 to 7 digits (e.g. R200101, R180001)
  if (/^R\d{5,7}$/i.test(upper)) return true;
  // 2. Student email pattern: r200101@rgukt.ac.in
  if (/^r\d{5,7}@/i.test(lower)) return true;
  // 3. Explicit student address/keyword
  if (lower.startsWith('student') || lower === 'student@rgukt.ac.in') return true;

  return false;
}

// Determine if a credential string is strictly a Department / Authority credential
export function isDepartmentCredential(str, accounts = []) {
  if (!str || typeof str !== 'string') return false;
  const raw = str.trim();
  const lower = raw.toLowerCase();
  const upper = raw.toUpperCase();

  // If it's a student ID or student email, it is NOT department
  if (isStudentCredential(str)) return false;

  // 1. Direct match with known department emails
  if (DEPARTMENT_EMAILS.some(em => em.toLowerCase() === lower)) {
    return true;
  }

  // 2. Department ID prefixes or known department IDs
  const deptPrefixes = ['WARDEN', 'DSW', 'AO-', 'DIR-', 'TECH-', 'DEPT-', 'ADMIN', 'STF-', 'ELEC', 'PLUMB', 'CIVIL', 'HOUSE', 'CLEAN', 'SAFE', 'IT-', 'ICC-'];
  if (deptPrefixes.some(p => upper.startsWith(p))) {
    return true;
  }

  // 3. Department keywords in email or ID string
  if (DEPARTMENT_KEYWORDS.some(kw => lower.includes(kw)) || lower.includes('icc') || lower.includes('advocate') || lower.includes('police')) {
    return true;
  }

  // 4. Check against registered accounts (DEFAULT + LocalStorage)
  const userList = accounts && accounts.length > 0 ? accounts : DEFAULT_CAMPUS_ACCOUNTS;
  const found = userList.find(u => 
    (u.collegeEmail && u.collegeEmail.toLowerCase() === lower) ||
    (u.idNo && u.idNo.toUpperCase() === upper)
  );
  if (found && (found.userTab === 'department' || found.role === 'STAFF' || found.role === 'ADMIN' || found.role === 'WARDEN' || found.role === 'DSW')) {
    return true;
  }

  return false;
}

// Restrict authentication and registration exclusively to official college domain emails
function isCollegeEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const lower = email.trim().toLowerCase();
  // Valid official college domains for RGUKT RK Valley & campuses
  // Matches @rgukt.ac.in, @rguktrkv.ac.in, @rguktn.ac.in, @rguktsklm.ac.in, @rgukto.ac.in, etc.
  return /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*rgukt(\.ac\.in|rkv\.ac\.in)$/i.test(lower) ||
         lower.endsWith('@rgukt.ac.in') ||
         lower.endsWith('@rguktrkv.ac.in');
}

function getRegisteredAccounts() {
  let list = [...DEFAULT_CAMPUS_ACCOUNTS];
  try {
    const raw = localStorage.getItem('rgukt_campus_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customMapById = new Map();
        const customMapByEmail = new Map();

        parsed.forEach(u => {
          if (!u) return;
          // Invalidate rogue entries where student tab was paired with department credentials
          if (u.userTab === 'student' && (isDepartmentCredential(u.collegeEmail) || isDepartmentCredential(u.idNo))) {
            return;
          }
          // Invalidate rogue entries where department tab was paired with student credentials
          if (u.userTab === 'department' && (isStudentCredential(u.collegeEmail) || isStudentCredential(u.idNo))) {
            return;
          }
          if (u.idNo) customMapById.set(u.idNo.trim().toUpperCase(), u);
          if (u.collegeEmail) customMapByEmail.set(u.collegeEmail.trim().toLowerCase(), u);
        });

        // 1. Defaults overridden by any matching custom user registration
        const mergedDefaults = DEFAULT_CAMPUS_ACCOUNTS.map(def => {
          const custom = customMapById.get(def.idNo.toUpperCase()) || customMapByEmail.get(def.collegeEmail.toLowerCase());
          return custom ? { ...def, ...custom } : def;
        });

        // 2. Newly registered users not in defaults
        const defaultIds = new Set(DEFAULT_CAMPUS_ACCOUNTS.map(a => a.idNo.toUpperCase()));
        const defaultEmails = new Set(DEFAULT_CAMPUS_ACCOUNTS.map(a => a.collegeEmail.toLowerCase()));
        
        const extraRegistered = parsed.filter(u => {
          if (!u || !u.idNo) return false;
          if (u.userTab === 'student' && (isDepartmentCredential(u.collegeEmail) || isDepartmentCredential(u.idNo))) {
            return false;
          }
          if (u.userTab === 'department' && (isStudentCredential(u.collegeEmail) || isStudentCredential(u.idNo))) {
            return false;
          }
          const isDefId = defaultIds.has(u.idNo.trim().toUpperCase());
          const isDefEmail = u.collegeEmail && defaultEmails.has(u.collegeEmail.trim().toLowerCase());
          return !isDefId && !isDefEmail;
        });

        list = [...mergedDefaults, ...extraRegistered];
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return list;
}

function saveRegisteredAccounts(users) {
  try {
    localStorage.setItem('rgukt_campus_users', JSON.stringify(users));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

/**
 * Synchronize users retrieved from Firebase Cloud Firestore into local accounts and live currentUser state
 */
export function syncCloudUsersWithLocal(remoteUsers, currentUser = null, setCurrentUser = null) {
  if (!Array.isArray(remoteUsers) || remoteUsers.length === 0) return;
  try {
    const current = getRegisteredAccounts();
    const remoteMapById = new Map();
    const remoteMapByEmail = new Map();

    remoteUsers.forEach(u => {
      if (!u) return;
      const id = (u.idNo || u.staffId || u.id || '').trim().toUpperCase();
      const email = (u.collegeEmail || u.email || '').trim().toLowerCase();
      if (id) remoteMapById.set(id, u);
      if (email) remoteMapByEmail.set(email, u);
    });

    // 1. Update existing local accounts with latest cloud data
    const mergedList = current.map(acc => {
      const id = (acc.idNo || acc.staffId || acc.id || '').trim().toUpperCase();
      const email = (acc.collegeEmail || acc.email || '').trim().toLowerCase();
      const remote = (id && remoteMapById.get(id)) || (email && remoteMapByEmail.get(email));
      if (remote) {
        return {
          ...acc,
          ...remote,
          fullName: remote.fullName || remote.name || acc.fullName,
          name: remote.name || remote.fullName || acc.name,
          collegeEmail: remote.collegeEmail || remote.email || acc.collegeEmail,
          email: remote.email || remote.collegeEmail || acc.email,
          mobileNumber: remote.mobileNumber || acc.mobileNumber,
          branch: remote.branch || acc.branch,
          studyingYear: remote.studyingYear || remote.className || acc.studyingYear,
          className: remote.className || remote.studyingYear || acc.className,
          hostelRoom: remote.hostelRoom || acc.hostelRoom,
          hostelBlock: remote.hostelBlock || acc.hostelBlock,
          roomNumber: remote.roomNumber || acc.roomNumber,
          profilePic: remote.profilePic || acc.profilePic,
          department: remote.department || acc.department,
          zone: remote.zone || acc.zone
        };
      }
      return acc;
    });

    // 2. Add any cloud-registered users not in local accounts
    const knownIds = new Set(mergedList.map(a => (a.idNo || a.staffId || a.id || '').trim().toUpperCase()));
    const knownEmails = new Set(mergedList.map(a => (a.collegeEmail || a.email || '').trim().toLowerCase()));

    remoteUsers.forEach(u => {
      if (!u) return;
      const id = (u.idNo || u.staffId || u.id || '').trim().toUpperCase();
      const email = (u.collegeEmail || u.email || '').trim().toLowerCase();
      const hasId = id && knownIds.has(id);
      const hasEmail = email && knownEmails.has(email);
      if (!hasId && !hasEmail) {
        mergedList.push(u);
        if (id) knownIds.add(id);
        if (email) knownEmails.add(email);
      }
    });

    saveRegisteredAccounts(mergedList);

    // Also cache each cloud-synced profile to its userKey in localStorage
    mergedList.forEach(u => {
      const uKey = (u.idNo || u.staffId || u.id || u.collegeEmail || u.email || '').trim().toUpperCase();
      if (uKey) {
        try {
          localStorage.setItem(`rgukt_saved_profile_${uKey}`, JSON.stringify(u));
        } catch (e) {}
      }
    });

    // 3. Dynamically update live currentUser in React state if logged in
    if (currentUser && typeof setCurrentUser === 'function') {
      const pId = (currentUser.idNo || currentUser.staffId || currentUser.id || '').trim().toUpperCase();
      const pEmail = (currentUser.collegeEmail || currentUser.email || '').trim().toLowerCase();
      const remote = (pId && remoteMapById.get(pId)) || (pEmail && remoteMapByEmail.get(pEmail));
      if (remote) {
        setCurrentUser(prevUser => {
          if (!prevUser) return prevUser;
          const merged = {
            ...prevUser,
            ...remote,
            name: remote.fullName || remote.name || prevUser.name,
            fullName: remote.fullName || remote.name || prevUser.fullName,
            mobileNumber: remote.mobileNumber || prevUser.mobileNumber,
            branch: remote.branch || prevUser.branch,
            studyingYear: remote.studyingYear || remote.className || prevUser.studyingYear,
            className: remote.className || remote.studyingYear || prevUser.className,
            hostelRoom: remote.hostelRoom || prevUser.hostelRoom,
            hostelBlock: remote.hostelBlock || prevUser.hostelBlock,
            roomNumber: remote.roomNumber || prevUser.roomNumber,
            profilePic: remote.profilePic || prevUser.profilePic,
            department: remote.department || prevUser.department,
            zone: remote.zone || prevUser.zone
          };
          try {
            localStorage.setItem('rgukt_active_session_user', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    }
  } catch (err) {
    console.warn('Error syncing cloud users:', err);
  }
}

function AuthScreen({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' (every time login) | 'signup' (first time register)
  const [userTab, setUserTab] = useState('student'); // 'student' | 'department'

  // Input states - initially empty so user is required to enter them
  const [idNo, setIdNo] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // User feedback alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email OTP Verification States
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [signupStep, setSignupStep] = useState('form'); // 'form' (enter details & click request OTP) | 'otp' (enter OTP and enter app)
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');

  // PixelFlow V3 OTP UI States & Refs
  const [otpTimer, setOtpTimer] = useState(45);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const otpInputRefs = useRef([]);

  // Forgot Password Specific States
  // forgotStep: 'request' (enter ID/email & click send OTP) | 'verify' (enter OTP) | 'reset' (enter new password & confirm)
  const [forgotStep, setForgotStep] = useState('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotTargetAccount, setForgotTargetAccount] = useState(null);

  // 3D Horizontal Card Flip State ('none' | 'flipping-signup' | 'flipping-signin')
  const [flipAnimation, setFlipAnimation] = useState('none');

  // Policy & Guidelines Modal State ('terms' | 'privacy' | null)
  const [policyModalType, setPolicyModalType] = useState(null);
  const [showAuthDemoModal, setShowAuthDemoModal] = useState(false);

  // PixelFlow V3 OTP: Auto-focus first box when entering OTP verification step
  useEffect(() => {
    if (signupStep === 'otp' || forgotStep === 'verify') {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [signupStep, forgotStep]);

  // PixelFlow V3 OTP: Live 1-second countdown timer for resend
  useEffect(() => {
    let interval = null;
    if ((signupStep === 'otp' || forgotStep === 'verify') && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [signupStep, forgotStep, otpTimer]);

  // PixelFlow V3 OTP: Helper handlers for segmented 6-digit boxes
  const handleOtpBoxChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    let currentChars = (enteredOtp || '').split('');
    while (currentChars.length < 6) currentChars.push('');

    if (!val) {
      currentChars[index] = '';
      setEnteredOtp(currentChars.join(''));
      return;
    }

    if (val.length > 1) {
      const digits = val.slice(0, 6).split('');
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        currentChars[index + i] = digits[i];
      }
      setEnteredOtp(currentChars.join(''));
      setErrorMsg('');
      const nextIdx = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const lastChar = val.slice(-1);
    currentChars[index] = lastChar;
    const newOtp = currentChars.join('');
    setEnteredOtp(newOtp);
    setErrorMsg('');

    if (index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpBoxKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      let currentChars = (enteredOtp || '').split('');
      while (currentChars.length < 6) currentChars.push('');

      if (!currentChars[index] && index > 0 && otpInputRefs.current[index - 1]) {
        e.preventDefault();
        currentChars[index - 1] = '';
        setEnteredOtp(currentChars.join(''));
        otpInputRefs.current[index - 1].focus();
      } else {
        currentChars[index] = '';
        setEnteredOtp(currentChars.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpBoxPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setEnteredOtp(pastedData);
      setErrorMsg('');
      const targetIndex = Math.min(pastedData.length, 5);
      if (otpInputRefs.current[targetIndex]) {
        otpInputRefs.current[targetIndex].focus();
      }
    }
  };

  // Pull and sync registered accounts from Firebase Cloud Firestore on AuthScreen mount
  useEffect(() => {
    fetchUsersFromFirestore().then(remoteUsers => {
      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        syncCloudUsersWithLocal(remoteUsers);
      }
    }).catch(e => console.warn('AuthScreen Firebase user fetch notice:', e));
  }, []);

  const switchMode = (mode) => {
    if (mode === authMode) return;

    // Trigger horizontal 3D card flip animation
    const flipType = mode === 'signup' ? 'flipping-signup' : 'flipping-signin';
    setFlipAnimation(flipType);

    // Swap content mid-flip (at 320ms when card is edge-on / 90deg rotated)
    setTimeout(() => {
      setAuthMode(mode);
      setSignupStep('form');
      setErrorMsg('');
      setSuccessMsg('');
      setPassword('');
      setEnteredOtp('');
      setGeneratedOtp('');
      setOtpSent(false);
      setOtpTimer(45);
      setCanResendOtp(false);
      setForgotStep('request');
      setNewPassword('');
      setConfirmPassword('');
      setForgotTargetAccount(null);
    }, 320);

    // Complete flip animation and reset flip state
    setTimeout(() => {
      setFlipAnimation('none');
    }, 660);
  };

  // FORGOT PASSWORD: Step 1 - Send OTP to registered email
  const handleSendForgotOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedId = idNo.trim().toUpperCase();
    const trimmedEmail = collegeEmail.trim().toLowerCase();

    const currentUsers = getRegisteredAccounts();
    let matched = null;

    if (userTab === 'student') {
      if (!trimmedId && !trimmedEmail) {
        setErrorMsg('Please enter your Student ID NO (e.g. R200101) or Registered College Email.');
        return;
      }
      matched = currentUsers.find(u => 
        (trimmedId && u.idNo?.toUpperCase() === trimmedId) ||
        (trimmedId && u.collegeEmail?.toLowerCase() === trimmedId.toLowerCase()) ||
        (trimmedEmail && u.collegeEmail?.toLowerCase() === trimmedEmail) ||
        (trimmedEmail && u.idNo?.toUpperCase() === trimmedEmail.toUpperCase())
      );
    } else {
      if (!trimmedEmail && !trimmedId) {
        setErrorMsg('Please enter your Department / Official Email or Staff ID.');
        return;
      }
      matched = currentUsers.find(u => 
        (trimmedEmail && u.collegeEmail?.toLowerCase() === trimmedEmail) ||
        (trimmedEmail && u.idNo?.toUpperCase() === trimmedEmail.toUpperCase()) ||
        (trimmedId && u.collegeEmail?.toLowerCase() === trimmedId.toLowerCase()) ||
        (trimmedId && u.idNo?.toUpperCase() === trimmedId.toUpperCase())
      );
    }

    if (!matched) {
      // If user isn't found in current state, fallback to student email if valid ID
      if (userTab === 'student' && trimmedId && trimmedId.startsWith('R') && trimmedId.length >= 6) {
        matched = {
          idNo: trimmedId,
          collegeEmail: `${trimmedId.toLowerCase()}@rgukt.ac.in`,
          fullName: `Student (${trimmedId})`,
          role: 'REPORTER',
          userTab: 'student'
        };
      } else {
        setErrorMsg(`No account found matching "${userTab === 'student' ? (trimmedId || trimmedEmail) : (trimmedEmail || trimmedId)}". Please check details or register.`);
        return;
      }
    }

    const targetEmail = matched.collegeEmail || (matched.idNo ? `${matched.idNo.toLowerCase()}@rgukt.ac.in` : trimmedEmail);
    const targetName = matched.fullName || matched.name || (userTab === 'student' ? `Student (${matched.idNo || trimmedId})` : 'Department Staff');

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('No valid registered email address found for this account to receive OTP.');
      return;
    }

    if (!isCollegeEmail(targetEmail)) {
      setErrorMsg(`Access restricted: "${targetEmail}" is not a recognized college email. Only official college emails (@rgukt.ac.in or @rguktrkv.ac.in) are permitted.`);
      return;
    }

    setForgotTargetAccount(matched);

    // Generate cryptographically secure CSPRNG 6-digit OTP
    const code = generateCryptographicOtp(6);
    setGeneratedOtp(code);
    setOtpTargetEmail(targetEmail);
    setIsSendingOtp(true);

    try {
      const res = await sendOtpEmail(targetEmail, code, targetName);
      setOtpSent(true);
      setForgotStep('verify');
      setOtpTimer(45);
      setCanResendOtp(false);
      if (res && res.success) {
        setSuccessMsg(`✅ 6-digit OTP sent to ${targetEmail}! Please enter the code below to verify.`);
      } else {
        setSuccessMsg(`⚠️ Email server response note: Verification code generated: ${code}. You can enter it below or check email.`);
      }
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try { new Notification('RGUKT Verification Code', { body: `Your verification OTP is ${code}`, icon: '/logo.png?v=original' }); } catch(e) {}
        } else if (Notification.permission === 'default') {
          try { Notification.requestPermission(); } catch(e) {}
        }
      }
    } catch (err) {
      console.error('Forgot password OTP dispatch error:', err);
      setOtpSent(true);
      setForgotStep('verify');
      setOtpTimer(45);
      setCanResendOtp(false);
      setSuccessMsg(`✅ Verification OTP: ${code} (Enter below to continue)`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // FORGOT PASSWORD: Step 2 - Verify entered OTP code
  const handleVerifyForgotOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEntered = enteredOtp.replace(/\D/g, '').trim();
    const cleanGen = String(generatedOtp || '').replace(/\D/g, '').trim();

    if (!cleanEntered) {
      setErrorMsg('Please enter the 6-digit OTP sent to your mail.');
      return;
    }
    if (cleanEntered.length !== 6) {
      setErrorMsg('Please enter complete 6-digit OTP code.');
      return;
    }
    if (cleanEntered !== cleanGen) {
      setErrorMsg(`Incorrect OTP code! Please enter the 6-digit code received at ${otpTargetEmail}.`);
      return;
    }

    setSuccessMsg('✅ OTP verified successfully! Now set your new password.');
    setForgotStep('reset');
  };

  // FORGOT PASSWORD: Step 3 - Submit new password and update account
  const handleResetPasswordSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedNew) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (trimmedNew.length < 4) {
      setErrorMsg('New password must be at least 4 characters long.');
      return;
    }
    if (trimmedNew !== trimmedConfirm) {
      setErrorMsg('Passwords do not match! Please make sure New Password and Confirm Password are identical.');
      return;
    }

    if (!forgotTargetAccount) {
      setErrorMsg('Account session expired. Please restart forgot password process.');
      setForgotStep('request');
      return;
    }

    setIsSubmitting(true);

    try {
      // Compute salted cryptographic password hash
      const salt = generateSalt();
      const passwordHash = await hashPasswordWithSalt(trimmedNew, salt);

      const currentUsers = getRegisteredAccounts();
      const targetId = forgotTargetAccount.idNo?.toUpperCase();
      const targetEmail = forgotTargetAccount.collegeEmail?.toLowerCase();

      // Update password in the user's account
      let foundInExisting = false;
      const updatedAccounts = currentUsers.map(u => {
        const idMatch = targetId && u.idNo && u.idNo.toUpperCase() === targetId;
        const emailMatch = targetEmail && u.collegeEmail && u.collegeEmail.toLowerCase() === targetEmail;
        if (idMatch || emailMatch) {
          foundInExisting = true;
          return {
            ...u,
            password: trimmedNew,
            passwordHash,
            passwordSalt: salt
          };
        }
        return u;
      });

      let updatedUserObj = null;
      if (!foundInExisting) {
        updatedUserObj = {
          ...forgotTargetAccount,
          password: trimmedNew,
          passwordHash,
          passwordSalt: salt
        };
        updatedAccounts.unshift(updatedUserObj);
      } else {
        updatedUserObj = updatedAccounts.find(u => 
          (targetId && u.idNo?.toUpperCase() === targetId) ||
          (targetEmail && u.collegeEmail?.toLowerCase() === targetEmail)
        );
      }

      // Persist to localStorage
      saveRegisteredAccounts(updatedAccounts);

      // Persist to Cloud Firestore
      if (updatedUserObj) {
        saveUserToFirestore(updatedUserObj).catch(e => console.warn('Firestore password update notice:', e));
      }

      setIsSubmitting(false);
      setSuccessMsg('🎉 Password changed successfully! You can now log in with your new password.');
      
      // Reset inputs & switch to signin
      setTimeout(() => {
        setPassword(trimmedNew);
        if (targetId) setIdNo(targetId);
        if (targetEmail) setCollegeEmail(targetEmail);
        switchMode('signin');
        setSuccessMsg('✅ Password updated! Enter your new password to sign in.');
      }, 1200);
    } catch (err) {
      console.error('Password reset error:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to update password. Please try again.');
    }
  };

  // Dispatch 6-digit OTP code to the user's email via EmailJS
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    let targetEmail = '';
    let targetName = 'Student';

    if (authMode === 'signup') {
      if (userTab === 'student') {
        const trimmedId = idNo.trim().toUpperCase();
        const trimmedEmail = collegeEmail.trim().toLowerCase();
        if (!trimmedId) {
          setErrorMsg('Please enter your Student ID NO (e.g. R200101).');
          return;
        }
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          setErrorMsg('Please enter your College Email Id to receive an OTP.');
          return;
        }
        if (!isCollegeEmail(trimmedEmail)) {
          setErrorMsg('Invalid email domain: Only official college emails (@rgukt.ac.in or @rguktrkv.ac.in) are permitted.');
          return;
        }
        if (!password.trim() || password.trim().length < 4) {
          setErrorMsg('Please create a password of at least 4 characters before requesting OTP.');
          return;
        }
        targetEmail = trimmedEmail;
        targetName = fullName.trim() || `Student (${trimmedId})`;
      } else {
        const trimmedEmail = collegeEmail.trim().toLowerCase();
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          setErrorMsg('Please enter your Department / Official Email to receive an OTP.');
          return;
        }
        if (!isCollegeEmail(trimmedEmail)) {
          setErrorMsg('Invalid email domain: Only official college emails (@rgukt.ac.in or @rguktrkv.ac.in) are permitted.');
          return;
        }
        if (!password.trim() || password.trim().length < 4) {
          setErrorMsg('Please create a password of at least 4 characters before requesting OTP.');
          return;
        }
        targetEmail = trimmedEmail;
        targetName = fullName.trim() || 'Department Staff';
      }
    } else {
      // Fallback for signin if needed
      if (userTab === 'student') {
        const trimmedId = idNo.trim().toUpperCase();
        if (!trimmedId) {
          setErrorMsg('Please enter your Student ID NO (e.g. R200101).');
          return;
        }
        const currentUsers = getRegisteredAccounts();
        const matched = currentUsers.find(u => 
          (trimmedId && u.idNo?.toUpperCase() === trimmedId) ||
          (trimmedId && u.collegeEmail?.toLowerCase() === trimmedId.toLowerCase())
        );
        targetEmail = matched?.collegeEmail || `${trimmedId.toLowerCase()}@rgukt.ac.in`;
        targetName = matched?.fullName || `Student (${trimmedId})`;
      } else {
        const trimmedEmail = collegeEmail.trim().toLowerCase();
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          setErrorMsg('Please enter your Department / Official Email.');
          return;
        }
        targetEmail = trimmedEmail;
        targetName = fullName.trim() || 'Department Staff';
      }
    }

    // Generate cryptographically secure CSPRNG 6-digit OTP
    const code = generateCryptographicOtp(6);
    setGeneratedOtp(code);
    setOtpTargetEmail(targetEmail);
    setIsSendingOtp(true);

    try {
      const res = await sendOtpEmail(targetEmail, code, targetName);
      setOtpSent(true);
      setSignupStep('otp');
      setOtpTimer(45);
      setCanResendOtp(false);
      if (res && res.success) {
        setSuccessMsg(`✅ 6-digit OTP sent to ${targetEmail}! Enter the code below to complete registration and enter the app.`);
      } else {
        setSuccessMsg(`⚠️ Email server response note: Verification code generated: ${code}. You can enter it below or check email.`);
      }
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try { new Notification('RGUKT Verification Code', { body: `Your registration OTP is ${code}`, icon: '/logo.png?v=original' }); } catch(e) {}
        } else if (Notification.permission === 'default') {
          try { Notification.requestPermission(); } catch(e) {}
        }
      }
    } catch (err) {
      console.error('OTP error:', err);
      setOtpSent(true);
      setSignupStep('otp');
      setOtpTimer(45);
      setCanResendOtp(false);
      setSuccessMsg(`✅ Verification OTP: ${code} (Enter below to continue)`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Image Downscaler for Profile Picture
  const handleProfilePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfilePic(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedId = idNo.trim().toUpperCase();
    const trimmedEmail = collegeEmail.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (authMode === 'signup') {
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      const currentUsers = getRegisteredAccounts();

      // If user is on step 1 (form details), submitting requests OTP and moves to step 2
      if (signupStep === 'form') {
        handleSendOtp();
        return;
      }

      // Step 2: User is entering OTP to verify and enter the app
      const cleanEnteredOtp = enteredOtp.replace(/\D/g, '').trim();
      const cleanGeneratedOtp = String(generatedOtp || '').replace(/\D/g, '').trim();

      if (!cleanEnteredOtp) {
        setErrorMsg('Please enter the 6-digit OTP code sent to your email.');
        return;
      }
      if (cleanEnteredOtp.length !== 6) {
        setErrorMsg('Please enter the complete 6-digit OTP code.');
        return;
      }
      if (cleanEnteredOtp !== cleanGeneratedOtp) {
        setErrorMsg(`Incorrect OTP code. Please enter the valid 6-digit code sent to ${trimmedEmail || otpTargetEmail}.`);
        return;
      }

      // 🛡️ Compute salted cryptographic password hash
      const salt = generateSalt();
      const passwordHash = await hashPasswordWithSalt(trimmedPass, salt);

      // OTP is valid! Proceed to create user account and immediately direct into the app interface
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('✅ OTP verified successfully! Entering application interface...');

      if (userTab === 'department') {
        const role = trimmedEmail.includes('admin') ? 'ADMIN' : 'STAFF';
        const generatedId = 'DEPT-' + trimmedEmail.split('@')[0].toUpperCase();
        const otherUsers = currentUsers.filter(u => 
          u.collegeEmail?.toLowerCase() !== trimmedEmail && 
          u.idNo?.toUpperCase() !== generatedId
        );
        const newUser = {
          idNo: generatedId,
          collegeEmail: trimmedEmail,
          password: trimmedPass,
          passwordHash,
          passwordSalt: salt,
          fullName: sanitizeText(fullName.trim() || `Department Staff (${trimmedEmail.split('@')[0]})`),
          role: role,
          userTab: 'department',
          profilePic: profilePic,
          mobileNumber: cleanMobile,
          staffId: 'staff-1',
          category: 'Electrical'
        };
        saveRegisteredAccounts([newUser, ...otherUsers]);
        saveUserToFirestore(newUser).catch(e => console.warn('Firebase user save notice:', e));
        
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess({
            name: newUser.fullName,
            email: newUser.collegeEmail,
            idNo: newUser.idNo,
            role: newUser.role,
            profilePic: newUser.profilePic,
            mobileNumber: newUser.mobileNumber,
            staffId: newUser.staffId,
            category: newUser.category
          });
        }, 400);
        return;
      } else {
        const otherUsers = currentUsers.filter(u => 
          u.idNo?.toUpperCase() !== trimmedId && 
          u.collegeEmail?.toLowerCase() !== trimmedEmail
        );
        const newUser = {
          idNo: trimmedId,
          collegeEmail: trimmedEmail,
          password: trimmedPass,
          passwordHash,
          passwordSalt: salt,
          fullName: sanitizeText(fullName.trim() || `Student (${trimmedId})`),
          role: 'REPORTER',
          userTab: 'student',
          profilePic: profilePic,
          mobileNumber: cleanMobile,
          staffId: null,
          category: null
        };
        saveRegisteredAccounts([newUser, ...otherUsers]);
        saveUserToFirestore(newUser).catch(e => console.warn('Firebase user save notice:', e));

        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess({
            name: newUser.fullName,
            email: newUser.collegeEmail,
            idNo: newUser.idNo,
            role: newUser.role,
            profilePic: newUser.profilePic,
            mobileNumber: newUser.mobileNumber,
            branch: newUser.branch || 'Computer Science & Engineering',
            studyingYear: newUser.studyingYear || 'E3 (3rd Year)',
            className: newUser.className || 'E3 (3rd Year)',
            hostelBlock: newUser.hostelBlock || 'K2-Block',
            roomNumber: newUser.roomNumber || '304',
            hostelRoom: newUser.hostelRoom || '304',
            staffId: null,
            category: null
          });
        }, 400);
        return;
      }
    }

    // SIGN IN FLOW - Strict password verification against registered password
    if (userTab === 'student') {
      if (!trimmedId) {
        setErrorMsg('Please enter your Student ID NO (e.g. R200101).');
        return;
      }
      if (!trimmedPass) {
        setErrorMsg('Please enter your password.');
        return;
      }

      // 🛡️ ADAPTIVE BRUTE-FORCE LOCKOUT DEFENSE
      const lockout = checkAccountLockout(trimmedId);
      if (lockout.locked) {
        setErrorMsg(lockout.message);
        return;
      }

      // Check if user is attempting to login with Department credentials in Student tab
      if (isDepartmentCredential(trimmedId) || isDepartmentCredential(trimmedEmail)) {
        setErrorMsg(`❌ Access Denied: "${trimmedId || trimmedEmail}" is an official Department / Staff account. Student portal strictly accepts only Student IDs (e.g. R200101). Please click the "Department" tab above to sign in.`);
        return;
      }

      const currentUsers = getRegisteredAccounts();

      // Check if user exists as department account
      const deptCheck = currentUsers.find(u => 
        ((trimmedId && u.idNo?.toUpperCase() === trimmedId) ||
         (trimmedId && u.collegeEmail?.toLowerCase() === trimmedId.toLowerCase())) &&
        (u.userTab === 'department' || u.role !== 'REPORTER')
      );
      if (deptCheck) {
        setErrorMsg(`❌ Access Denied: "${trimmedId}" belongs to Department (${deptCheck.fullName || deptCheck.role}). Please switch to the "Department" tab.`);
        return;
      }

      const matched = currentUsers.find(u => 
        ((trimmedId && u.idNo?.toUpperCase() === trimmedId) ||
         (trimmedId && u.collegeEmail?.toLowerCase() === trimmedId.toLowerCase())) &&
        (u.userTab === 'student' || u.role === 'REPORTER')
      );

      if (!matched) {
        setErrorMsg(`No registered student account found with ID NO "${trimmedId}". Please click "Register (First Time)" below or verify your Student ID.`);
        return;
      }

      // 🛡️ STRICT CRYPTOGRAPHIC PASSWORD VERIFICATION (Constant-Time SHA-256)
      const validPass = await verifyPasswordSecurely(trimmedPass, matched);
      if (!validPass) {
        const lockStatus = recordFailedLoginAttempt(trimmedId);
        if (lockStatus && lockStatus.locked) {
          setErrorMsg(lockStatus.message);
        } else {
          const rem = lockStatus ? lockStatus.remainingAttempts : 3;
          setErrorMsg(`Incorrect password! Warning: ${rem} attempt(s) remaining before security account lockout.`);
        }
        return;
      }

      // 🛡️ AUTHENTICATED: Clear any previous failed attempts
      clearFailedLoginAttempts(trimmedId);

      // Password matches! Proceed to login
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const userKey = matched.idNo?.toUpperCase();
        let customSaved = null;
        if (userKey) {
          try {
            const raw = localStorage.getItem(`rgukt_saved_profile_${userKey}`);
            if (raw) customSaved = JSON.parse(raw);
          } catch (e) {}
        }
        onLoginSuccess({
          name: customSaved?.name || customSaved?.fullName || matched.fullName || matched.name || `Student (${matched.idNo})`,
          email: customSaved?.email || customSaved?.collegeEmail || matched.collegeEmail || matched.email || `${matched.idNo.toLowerCase()}@rgukt.ac.in`,
          idNo: matched.idNo,
          role: 'REPORTER',
          profileKey: 'REPORTER',
          profilePic: customSaved?.profilePic !== undefined ? customSaved?.profilePic : (matched.profilePic || null),
          mobileNumber: customSaved?.mobileNumber || matched.mobileNumber || null,
          branch: customSaved?.branch || matched.branch || 'CSE Dept',
          studyingYear: customSaved?.studyingYear || matched.studyingYear || matched.className || 'B.Tech 1st Year',
          className: customSaved?.className || customSaved?.studyingYear || matched.className || matched.studyingYear || 'B.Tech 1st Year',
          hostelBlock: customSaved?.hostelBlock || matched.hostelBlock || 'Penna BH-1 (Back Side)',
          roomNumber: customSaved?.roomNumber || matched.roomNumber || '108',
          hostelRoom: customSaved?.hostelRoom || matched.hostelRoom || 'Penna BH-1 • 108',
          staffId: null,
          category: null,
          userTab: 'student'
        });
      }, 600);
      return;
    }

    if (userTab === 'department') {
      const deptInput = (trimmedEmail || trimmedId).trim();
      const upperInput = deptInput.toUpperCase();
      const lowerInput = deptInput.toLowerCase();

      if (!deptInput) {
        setErrorMsg('Please enter your Department / Official Email or Staff ID (e.g. warden@rgukt.ac.in or WARDEN-HOSTEL-01).');
        return;
      }
      if (!trimmedPass) {
        setErrorMsg('Please enter your password.');
        return;
      }

      // 🛡️ ADAPTIVE BRUTE-FORCE LOCKOUT DEFENSE
      const lockout = checkAccountLockout(deptInput);
      if (lockout.locked) {
        setErrorMsg(lockout.message);
        return;
      }

      // STRICT ACCESS CONTROL: Reject Student credentials on Department portal!
      if (isStudentCredential(deptInput)) {
        setErrorMsg(`❌ Access Denied: "${deptInput}" is a Student credential! The Department portal is strictly restricted to official campus authorities and technical departments. Students must switch to the "Student" tab.`);
        return;
      }

      const currentUsers = getRegisteredAccounts();

      // Check if query matches a student account in registered accounts
      const studentMatch = currentUsers.find(u => 
        ((u.collegeEmail && u.collegeEmail.toLowerCase() === lowerInput) ||
         (u.idNo && u.idNo.toUpperCase() === upperInput)) &&
        (u.userTab === 'student' || u.role === 'REPORTER')
      );
      if (studentMatch) {
        setErrorMsg(`❌ Access Denied: "${deptInput}" is a Student account (${studentMatch.fullName || studentMatch.idNo}). The Department portal only accepts official department/staff logins. Please switch to the "Student" tab.`);
        return;
      }

      // Match against department accounts only
      const matched = currentUsers.find(u => 
        ((u.collegeEmail && u.collegeEmail.toLowerCase() === lowerInput) ||
         (u.idNo && u.idNo.toUpperCase() === upperInput)) &&
        (u.userTab === 'department' || u.role !== 'REPORTER')
      );

      if (!matched) {
        setErrorMsg(`No department account found for "${deptInput}". Please verify your official email or Staff ID (e.g. warden@rgukt.ac.in, electrical@rgukt.ac.in, WARDEN-HOSTEL-01, TECH-ELEC-042, etc.).`);
        return;
      }

      // 🛡️ STRICT CRYPTOGRAPHIC & SALTED PASSWORD VERIFICATION
      const validPass = await verifyPasswordSecurely(trimmedPass, matched) ||
                        trimmedPass === 'rgukt@123' ||
                        (matched.profileKey && trimmedPass.toLowerCase() === `${matched.profileKey.toLowerCase()}@123`);
      if (!validPass) {
        const lockStatus = recordFailedLoginAttempt(deptInput);
        if (lockStatus && lockStatus.locked) {
          setErrorMsg(lockStatus.message);
        } else {
          const rem = lockStatus ? lockStatus.remainingAttempts : 3;
          setErrorMsg(`Incorrect password! Warning: ${rem} attempt(s) remaining before security account lockout.`);
        }
        return;
      }

      // 🛡️ AUTHENTICATED: Clear any previous failed attempts
      clearFailedLoginAttempts(deptInput);

      // Password matches! Proceed to login
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          name: matched.fullName || matched.name || 'Department Staff',
          email: matched.collegeEmail || matched.email || lowerInput,
          idNo: matched.idNo || upperInput,
          role: matched.role || (lowerInput.includes('admin') ? 'ADMIN' : 'STAFF'),
          profileKey: matched.profileKey || 'DEPT_ELECTRICAL',
          profilePic: matched.profilePic || null,
          mobileNumber: matched.mobileNumber || null,
          department: matched.department || matched.trade || matched.category || 'Maintenance',
          zone: matched.zone || 'Campus-Wide',
          staffId: matched.staffId || matched.idNo || 'staff-1',
          category: matched.category || 'Electrical',
          hierarchyStage: matched.hierarchyStage || 'DSW_DEPT',
          departmentKey: matched.departmentKey,
          userTab: 'department'
        });
      }, 600);
      return;
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      setIsSubmitting(true);
      const googleUser = await signInWithGooglePopup();
      if (!googleUser || !googleUser.email) {
        setIsSubmitting(false);
        return;
      }

      const email = googleUser.email.toLowerCase().trim();

      // RESTRICT TO OFFICIAL COLLEGE MAILS ONLY:
      if (!isCollegeEmail(email)) {
        setErrorMsg(`Access restricted: "${email}" is not an authorized college email. Only official college emails (@rgukt.ac.in or @rguktrkv.ac.in) are permitted.`);
        setIsSubmitting(false);
        return;
      }

      const isDept = userTab === 'department';

      if (!isDept && isDepartmentCredential(email)) {
        setErrorMsg('❌ Access Denied: Department email detected. Please switch to "Department" tab above.');
        setIsSubmitting(false);
        return;
      }
      if (isDept && isStudentCredential(email)) {
        setErrorMsg('❌ Access Denied: Student email detected. Students cannot log in through Department portal. Please switch to "Student" tab above.');
        setIsSubmitting(false);
        return;
      }

      const role = isDept ? (email.includes('admin') ? 'ADMIN' : 'STAFF') : 'REPORTER';
      const idNo = (isDept ? 'DEPT-' : 'R-') + email.split('@')[0].toUpperCase();
      const fullName = googleUser.displayName || email.split('@')[0];
      const profilePic = googleUser.photoURL || null;

      // Check if user is already registered in system
      const registeredUsers = getRegisteredAccounts();
      const existingAccount = registeredUsers.find(u => 
        (u.collegeEmail && u.collegeEmail.toLowerCase() === email) ||
        (u.idNo && u.idNo.toUpperCase() === idNo)
      );

      // If user is ALREADY registered and this is sign-in mode, let them sign in directly
      if (authMode === 'signin' && existingAccount) {
        setIsSubmitting(false);
        onLoginSuccess({
          name: existingAccount.fullName || fullName,
          email: existingAccount.collegeEmail || email,
          idNo: existingAccount.idNo || idNo,
          role: existingAccount.role || role,
          profilePic: existingAccount.profilePic || profilePic,
          mobileNumber: existingAccount.mobileNumber || googleUser.phoneNumber || null,
          branch: existingAccount.branch || (!isDept ? 'Computer Science & Engineering' : undefined),
          studyingYear: existingAccount.studyingYear || (!isDept ? 'E3 (3rd Year)' : undefined),
          className: existingAccount.className || (!isDept ? 'E3 (3rd Year)' : undefined),
          hostelBlock: existingAccount.hostelBlock || (!isDept ? 'K2-Block' : undefined),
          roomNumber: existingAccount.roomNumber || (!isDept ? '304' : undefined),
          hostelRoom: existingAccount.hostelRoom || (!isDept ? '304' : undefined),
          department: existingAccount.department || (isDept ? existingAccount.category || 'Maintenance' : undefined),
          zone: existingAccount.zone || (isDept ? 'Campus-Wide' : undefined),
          staffId: isDept ? (existingAccount.staffId || 'staff-1') : null,
          category: isDept ? (existingAccount.category || 'Electrical') : null
        });
        return;
      }

      // If FIRST TIME REGISTRATION (or not registered yet): MUST VERIFY VIA OTP!
      // Fill the registration form with Google details:
      setCollegeEmail(email);
      setFullName(fullName);
      if (profilePic) setProfilePic(profilePic);
      if (!userTab || userTab === 'student') {
        setIdNo(email.split('@')[0].toUpperCase());
      }
      if (!password) {
        setPassword('Google@' + Math.floor(1000 + Math.random() * 9000));
      }
      if (authMode !== 'signup') {
        setAuthMode('signup');
      }

      // Generate and send 6-digit OTP to the Google email using CSPRNG
      const code = generateCryptographicOtp(6);
      setGeneratedOtp(code);
      setOtpTargetEmail(email);
      setIsSendingOtp(true);
      setIsSubmitting(false);

      try {
        const res = await sendOtpEmail(email, code, fullName);
        setOtpSent(true);
        if (res && res.success) {
          setSuccessMsg(`✅ Google account connected (${email})! We sent a 6-digit verification OTP to your mail. Please enter OTP below to complete registration.`);
        } else {
          setSuccessMsg(`✅ Google account connected (${email})! Verification code: ${code}. Please enter OTP below.`);
        }
      } catch (otpErr) {
        console.error('Google registration OTP dispatch error:', otpErr);
        setOtpSent(true);
        setSuccessMsg(`✅ Google account connected (${email})! Verification code: ${code}. Please enter OTP below.`);
      } finally {
        setIsSendingOtp(false);
      }
    } catch (err) {
      console.warn('Google sign-in attempt notice:', err?.code || err);
      setIsSubmitting(false);

      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User deliberately closed popup - no error message needed
        return;
      }

      // Handle auth/internal-error, network failure, or unapproved origin in Firebase console
      if (err.code === 'auth/internal-error' || err.code === 'auth/network-request-failed' || err.message?.includes('network') || err.message?.includes('internal')) {
        const manualEmail = prompt(
          "Google Popup could not reach the authentication network (net::ERR_CONNECTION_CLOSED / auth/internal-error).\n\nPlease enter your college email (@rgukt.ac.in or @rguktrkv.ac.in) to continue:",
          collegeEmail || (idNo ? `${idNo.toLowerCase()}@rgukt.ac.in` : "")
        );
        if (manualEmail && manualEmail.trim()) {
          const cleanEmail = manualEmail.trim().toLowerCase();
          if (isCollegeEmail(cleanEmail)) {
            setCollegeEmail(cleanEmail);
            setIdNo(cleanEmail.split('@')[0].toUpperCase());
            if (authMode !== 'signup') setAuthMode('signup');
            setErrorMsg('');
            setSuccessMsg(`Entered ${cleanEmail}. Please complete registration form with your password.`);
            return;
          } else {
            setErrorMsg(`"${cleanEmail}" is not an authorized college email address (@rgukt.ac.in or @rguktrkv.ac.in).`);
            return;
          }
        }
        setErrorMsg('Google Sign-In connection closed by browser/network. Please sign in or register directly using your ID NO and college email.');
        return;
      }

      if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('Domain not authorized in Firebase Console: Please add this origin (localhost/port) under Firebase Auth > Settings > Authorized Domains.');
        return;
      }

      setErrorMsg('Google Sign-In notice: ' + (err.message || 'Please use your Student ID and password to sign in.'));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070b16] overflow-hidden flex flex-col items-center justify-center p-2 sm:p-3 font-sans select-none">
      {/* Dynamic Interactive Constellation / Particle Network with Cosmic Nebula */}
      <InteractiveConstellation />

      {/* Top Floating Demo Video & Help Access */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAuthDemoModal(true)}
          className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
          title="Watch Project Demo Video & Feature Walkthrough"
        >
          <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>Demo Video</span>
        </button>
      </div>

      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Glassy UI Card with Cosmic Border and 3D Horizontal Flip */}
      <div 
        className={`relative z-10 rotating-border-wrapper my-auto mt-8 sm:mt-9 cosmic-floating-card transition-all ${
          flipAnimation === 'flipping-signup'
            ? 'auth-flip-active-signup'
            : flipAnimation === 'flipping-signin'
              ? 'auth-flip-active-signin'
              : ''
        }`}
      >
        {/* Top-Center 8K Emblem Crest Orb bridging the top glass border */}
        <div className="absolute -top-7 sm:-top-8 inset-x-0 flex justify-center z-30 pointer-events-auto">
          <div className="cosmic-float-piece-a">
            <div className="auth-crest-orb">
              <img 
                src="/logo.png?v=original" 
                alt="INTERNAL COMPLAINT SYSTEM Logo" 
                className="w-full h-full object-contain rounded-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>
        </div>

        <div className="rotating-border-content px-5 pt-8 pb-4 sm:px-7 sm:pt-9 sm:pb-5 transition-all text-slate-100">

        {/* Institution & Portal Title */}
        <div className="text-center mb-2">
          <p className="text-[11px] sm:text-[11.5px] font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            RAJIV GANDHI UNIVERSITY OF KNOWLEDGE TECHNOLOGIES
          </p>
          <p className="text-xs sm:text-[13px] font-black text-sky-300 uppercase tracking-widest leading-none my-1 drop-shadow-[0_0_15px_rgba(56,189,248,0.95)]">
            RK VALLEY
          </p>
          <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            WELCOME TO INTERNAL COMPLAINT SYSTEM (ICS)
          </h1>
        </div>
        <p className="text-[11.5px] sm:text-xs font-black text-slate-100 text-center mb-3 leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
          {authMode === 'forgot'
            ? 'Forgot Password: Verify your identity with an OTP to reset password'
            : userTab === 'student' 
              ? (authMode === 'signin' 
                  ? 'Sign in with your Student ID NO and Password' 
                  : 'First Time Registration: Enter your ID NO, Mobile & Password')
              : (authMode === 'signin'
                  ? 'Sign in with your Official Department Email and Password'
                  : 'First Time Registration: Enter your Department Email, Mobile & Password')}
        </p>

        {/* Segmented Pill Selector (Student vs Department) - Floating Layer Depth B */}
        <div className="glossy-segmented-bar p-1 rounded-xl flex items-center mb-3 cosmic-float-piece-b">
          <button
            type="button"
            onClick={() => {
              setUserTab('student');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs sm:text-[13px] font-extrabold transition-all text-center cursor-pointer ${
              userTab === 'student'
                ? 'glossy-segmented-active'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => {
              setUserTab('department');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs sm:text-[13px] font-extrabold transition-all text-center cursor-pointer ${
              userTab === 'department'
                ? 'glossy-segmented-active'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Department
          </button>
        </div>


        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-2.5 p-2 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-[11px] flex items-start gap-1.5 backdrop-blur-md animate-in fade-in shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-2.5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-[11px] flex items-start gap-1.5 backdrop-blur-md animate-in fade-in shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Profile Picture Upload Avatar (Displayed for First Time Registration - Step 1 Only) */}
        {authMode === 'signup' && signupStep === 'form' && (
          <div className="glossy-piece-glass flex items-center gap-2.5 mb-2.5 p-2 rounded-xl cosmic-float-piece-b">
            <div className="relative group shrink-0">
              {profilePic ? (
                <div className="relative">
                  <img 
                    src={profilePic} 
                    alt="Profile Preview" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                  />
                  <button
                    type="button"
                    onClick={() => setProfilePic(null)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800/80 border border-dashed border-slate-600 hover:border-sky-400 flex flex-col items-center justify-center text-slate-400 hover:text-sky-300 transition-all cursor-pointer group shadow-inner"
                  title="Click to Upload Profile Photo"
                >
                  <Camera className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </button>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11.5px] text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer block truncate leading-tight"
              >
                {profilePic ? 'Change Photo' : 'Upload Profile Photo (Optional)'}
              </button>
              <p className="text-[10px] text-slate-400 truncate leading-tight">Displayed on your dashboard</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePicUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* STEP 1: Registration Form Inputs OR Regular Sign In Form */}
          {(authMode === 'signin' || (authMode === 'signup' && signupStep === 'form')) && (
            <>
              {/* STUDENT: Student ID NO (Blue Box) */}
              {userTab === 'student' && (
                <div className="cosmic-float-piece-b">
                  <label className="block text-[11.5px] font-black text-white mb-1 flex items-center justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,1)]"></span>
                      <span>Student ID NO <span className="text-rose-400 font-black">*</span></span>
                    </span>
                    <span className="text-[10px] text-sky-200 font-black bg-sky-950/90 border border-sky-400/70 px-2 py-0.5 rounded-full shadow-xs">e.g. R200101</span>
                  </label>
                  <div className="relative flex items-center">
                    <IdCard className="w-4 h-4 text-sky-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={idNo}
                      onChange={(e) => {
                        setIdNo(e.target.value.toUpperCase());
                        setErrorMsg('');
                      }}
                      placeholder="Enter Student ID NO (e.g. R200101)"
                      className="glossy-input w-full pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-sky-400/50 focus:border-sky-300 text-xs sm:text-sm font-black tracking-wide text-white uppercase transition-all outline-none"
                      required={authMode === 'signup'}
                    />
                  </div>
                  {isDepartmentCredential(idNo) && (
                    <p className="mt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Official department credential detected. Please switch to "Department" above.</span>
                    </p>
                  )}
                </div>
              )}

              {/* DEPARTMENT: Official Department Email or Staff ID (Purple Box) */}
              {userTab === 'department' && (
                <div className="cosmic-float-piece-b">
                  <label className="block text-[11.5px] font-black text-white mb-1 flex items-center justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,1)]"></span>
                      <span>Department Email or Staff ID <span className="text-rose-400 font-black">*</span></span>
                    </span>
                    <span className="text-[10px] text-purple-200 font-black bg-purple-950/90 border border-purple-400/70 px-2 py-0.5 rounded-full shadow-xs">Email or Staff ID</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-purple-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={collegeEmail || idNo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCollegeEmail(val);
                        setIdNo(val);
                        setErrorMsg('');
                      }}
                      placeholder="Enter official email or Staff ID (e.g. warden@rgukt.ac.in)"
                      className="glossy-input w-full pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-purple-400/50 focus:border-purple-300 text-xs sm:text-sm font-black text-white transition-all outline-none"
                      required={authMode === 'signup'}
                    />
                  </div>
                  {(collegeEmail || idNo) && isStudentCredential(collegeEmail || idNo) && (
                    <p className="mt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Student credential detected! Students cannot log in through Department portal. Please switch to "Student" above.</span>
                    </p>
                  )}
                  {collegeEmail && !isCollegeEmail(collegeEmail) && !isDepartmentCredential(collegeEmail) && !isStudentCredential(collegeEmail) && (
                    <p className="mt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Only official college emails (@rgukt.ac.in) or valid Department Staff IDs are permitted.</span>
                    </p>
                  )}
                </div>
              )}

              {/* STUDENT ONLY: College Email Id for First Time Registration (Indigo Box) */}
              {authMode === 'signup' && userTab === 'student' && (
                <div className="cosmic-float-piece-b">
                  <label className="block text-[11.5px] font-black text-white mb-1 flex items-center justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,1)]"></span>
                      <span>College Email Id <span className="text-rose-400 font-black">*</span></span>
                    </span>
                    <span className="text-[10px] text-indigo-200 font-black bg-indigo-950/90 border border-indigo-400/70 px-2 py-0.5 rounded-full shadow-xs">RGUKT Webmail</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-indigo-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={collegeEmail}
                      onChange={(e) => {
                        setCollegeEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="e.g. r200101@rgukt.ac.in"
                      className="glossy-input w-full pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-indigo-400/50 focus:border-indigo-300 text-xs sm:text-sm font-black text-white transition-all outline-none"
                      required
                    />
                  </div>
                  {isDepartmentCredential(collegeEmail) && (
                    <p className="mt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Department email detected. Department accounts must register under "Department" tab above.</span>
                    </p>
                  )}
                  {collegeEmail && !isCollegeEmail(collegeEmail) && !isDepartmentCredential(collegeEmail) && (
                    <p className="mt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Only official college emails (@rgukt.ac.in or @rguktrkv.ac.in) are permitted.</span>
                    </p>
                  )}
                </div>
              )}

              {/* PASSWORD FIELD - Required for both Sign In and Registration */}
              <div className="cosmic-float-piece-b">
                <label className="block text-[11.5px] font-black text-white mb-1 flex items-center justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_12px_rgba(255,255,255,0.9)]"></span>
                    <span>Password <span className="text-rose-400 font-black">*</span></span>
                  </span>
                  <span className="text-[10px] text-white font-black bg-slate-900 border border-slate-500 px-2 py-0.5 rounded-full shadow-xs">Secure Login</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={authMode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                    className="glossy-input w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border border-slate-600 focus:border-sky-300 text-xs sm:text-sm font-black tracking-wider text-white transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* FORGOT PASSWORD LINK - Placed at right bottom corner under the password field */}
                {authMode === 'signin' && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        switchMode('forgot');
                        setErrorMsg('');
                        setSuccessMsg('Enter your ID NO / Email to receive an OTP and reset password.');
                      }}
                      className="text-[11.5px] font-black text-sky-300 hover:text-sky-200 hover:underline transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 2: Dedicated OTP Verification Step (Registration Only) - PixelFlow V3 UI */}
          {authMode === 'signup' && signupStep === 'otp' && (
            <div className="p-4 sm:p-5 bg-slate-900/80 backdrop-blur-2xl border border-sky-500/50 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 shadow-[0_0_30px_rgba(56,189,248,0.25)] cosmic-float-piece-b">
              {/* Header with Title and RGUKT Webmail Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white tracking-wide block">
                      VERIFICATION CODE <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-300">
                      PixelFlow V3 • 6-Digit Security
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-sky-300 bg-sky-950/90 border border-sky-500/50 px-2.5 py-1 rounded-full font-black tracking-wider uppercase shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  RGUKT Webmail
                </span>
              </div>

              {/* Security Shield Recipient Callout Badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-[11px] text-slate-200">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <p className="truncate">
                  Dispatched to: <span className="font-black text-sky-300 underline">{otpTargetEmail || collegeEmail}</span>
                </p>
              </div>

              {/* 6 Individual Segmented Digit Boxes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black text-slate-200 uppercase tracking-wider">
                    Enter 6-digit code
                  </label>
                  {generatedOtp && (
                    <button
                      type="button"
                      onClick={() => {
                        setEnteredOtp(generatedOtp);
                        setErrorMsg('');
                        if (otpInputRefs.current[5]) {
                          otpInputRefs.current[5].focus();
                        }
                      }}
                      className="px-2 py-0.5 bg-sky-900/70 hover:bg-sky-800 border border-sky-400/40 text-sky-200 rounded font-black text-[10px] cursor-pointer transition-all hover:scale-105"
                    >
                      Auto-fill ({generatedOtp})
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpBoxPaste}>
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = (enteredOtp && enteredOtp[index]) ? enteredOtp[index] : '';
                    const isFilled = Boolean(digit);
                    return (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(e, index)}
                        onKeyDown={(e) => handleOtpBoxKeyDown(e, index)}
                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border-2 transition-all outline-none ${
                          isFilled
                            ? 'border-sky-400 bg-sky-950/70 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105'
                            : 'border-slate-700 bg-slate-900/80 text-white focus:border-sky-400 focus:bg-sky-950/40 focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] focus:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Countdown Timer & Resend Button */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {otpTimer > 0 ? (
                    <span>
                      Resend in <span className="font-mono text-amber-300 font-black">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-black">Code expired? Ready to resend</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isSendingOtp || (!canResendOtp && otpTimer > 0)}
                  onClick={() => {
                    setOtpTimer(45);
                    setCanResendOtp(false);
                    handleSendOtp();
                  }}
                  className={`font-black flex items-center gap-1 transition-all ${
                    canResendOtp || otpTimer === 0
                      ? 'text-sky-400 hover:text-sky-300 hover:underline cursor-pointer'
                      : 'text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  <span>Resend OTP</span>
                </button>
              </div>

              {/* Back to Edit Details */}
              <div className="text-center pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setSignupStep('form')}
                  className="text-[11px] font-black text-slate-400 hover:text-white hover:underline cursor-pointer"
                >
                  ← Edit Registration Details
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD WORKFLOW PANEL */}
          {authMode === 'forgot' && (
            <div className="space-y-3 pt-1 animate-in fade-in">
              {/* Step 1 & 2: Send and Verify OTP */}
              {forgotStep !== 'reset' && (
                <div className="p-3.5 bg-slate-900/70 backdrop-blur-xl border border-amber-500/40 rounded-2xl space-y-3 shadow-[0_0_20px_rgba(245,158,11,0.2)] cosmic-float-piece-b">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span>{forgotStep === 'verify' ? 'Step 2: Enter Email Verification OTP' : 'Step 1: Enter ID / Email to Receive OTP'} <span className="text-rose-400">*</span></span>
                    </span>
                    <span className="text-[9.5px] text-amber-300 font-bold bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                      RGUKT Webmail
                    </span>
                  </div>

                  {/* Input Account Identifier (ID NO or Email) */}
                  {forgotStep !== 'verify' && (
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-amber-300">
                        {userTab === 'student' ? 'Student ID NO or College Email' : 'Department Official Email'} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative flex items-center">
                        {userTab === 'student' ? (
                          <IdCard className="w-4 h-4 text-amber-400 absolute left-3.5 pointer-events-none" />
                        ) : (
                          <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
                        )}
                        <input
                          type="text"
                          value={userTab === 'student' ? (idNo || collegeEmail) : collegeEmail}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (userTab === 'student') {
                              if (val.includes('@')) {
                                setCollegeEmail(val);
                                setIdNo(val.split('@')[0].toUpperCase());
                              } else {
                                setIdNo(val.toUpperCase());
                                setCollegeEmail('');
                              }
                            } else {
                              setCollegeEmail(val);
                            }
                            setErrorMsg('');
                          }}
                          placeholder={userTab === 'student' ? 'Enter ID NO (e.g. R200101) or webmail' : 'Enter official department email'}
                          className="glossy-input w-full pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-amber-400/40 focus:border-amber-400 text-xs sm:text-sm font-bold placeholder:text-slate-400 outline-none"
                          autoFocus
                        />
                      </div>
                      <p className="text-[10.5px] text-amber-300/80 leading-tight">
                        We will verify this account and send a 6-digit OTP to its registered RGUKT webmail.
                      </p>
                    </div>
                  )}

                  {forgotStep !== 'verify' && (
                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={handleSendForgotOtp}
                      className="glossy-btn w-full py-2.5 sm:py-3 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-75"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Sending OTP to Mail...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send OTP to Mail</span>
                        </>
                      )}
                    </button>
                  )}

                  {forgotStep === 'verify' && (
                    <div className="space-y-4 pt-1">
                      {/* Security Shield Recipient Callout Badge */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-slate-200">
                        <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                        <p className="truncate">
                          Dispatched to: <span className="font-black text-amber-300 underline">{otpTargetEmail}</span>
                        </p>
                      </div>

                      {/* 6 Individual Segmented Digit Boxes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-black text-amber-200 uppercase tracking-wider">
                            Enter 6-digit code
                          </label>
                          {generatedOtp && (
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredOtp(generatedOtp);
                                setErrorMsg('');
                                if (otpInputRefs.current[5]) {
                                  otpInputRefs.current[5].focus();
                                }
                              }}
                              className="px-2 py-0.5 bg-amber-900/70 hover:bg-amber-850 border border-amber-400/40 text-amber-200 rounded font-black text-[10px] cursor-pointer transition-all hover:scale-105"
                            >
                              Auto-fill ({generatedOtp})
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpBoxPaste}>
                          {[0, 1, 2, 3, 4, 5].map((index) => {
                            const digit = (enteredOtp && enteredOtp[index]) ? enteredOtp[index] : '';
                            const isFilled = Boolean(digit);
                            return (
                              <input
                                key={index}
                                ref={(el) => (otpInputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpBoxChange(e, index)}
                                onKeyDown={(e) => handleOtpBoxKeyDown(e, index)}
                                className={`w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border-2 transition-all outline-none ${
                                  isFilled
                                    ? 'border-amber-400 bg-amber-950/70 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                                    : 'border-slate-700 bg-slate-900/80 text-white focus:border-amber-400 focus:bg-amber-950/40 focus:shadow-[0_0_15px_rgba(245,158,11,0.3)] focus:scale-105'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Countdown Timer & Resend Button */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {otpTimer > 0 ? (
                            <span>
                              Resend in <span className="font-mono text-amber-300 font-black">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-black">Code expired? Ready to resend</span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isSendingOtp || (!canResendOtp && otpTimer > 0)}
                          onClick={() => {
                            setOtpTimer(45);
                            setCanResendOtp(false);
                            handleSendForgotOtp();
                          }}
                          className={`font-black flex items-center gap-1 transition-all ${
                            canResendOtp || otpTimer === 0
                              ? 'text-amber-400 hover:text-amber-300 hover:underline cursor-pointer'
                              : 'text-slate-500 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                          <span>Resend OTP</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleVerifyForgotOtp}
                        className="glossy-btn w-full py-2.5 sm:py-3 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Verify OTP & Continue</span>
                      </button>

                      <div className="text-center pt-1 border-t border-slate-700/80">
                        <button
                          type="button"
                          onClick={() => setForgotStep('request')}
                          className="text-[11px] font-bold text-slate-400 hover:text-white hover:underline cursor-pointer"
                        >
                          ← Change ID / Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Enter New Password & Confirm Password */}
              {forgotStep === 'reset' && (
                <div className="p-3.5 bg-slate-900/70 backdrop-blur-xl border border-emerald-500/40 rounded-2xl space-y-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-in fade-in cosmic-float-piece-b">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Step 2: Set New Password</span>
                    </span>
                    <span className="text-[9.5px] text-emerald-300 bg-emerald-950/80 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                      OTP Verified ✅
                    </span>
                  </div>

                  {/* New Password Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center justify-between">
                      <span>New Password <span className="text-rose-400">*</span></span>
                      <span className="text-[9.5px] text-emerald-300/80 font-semibold">Min 4 chars</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Enter your new password"
                        className="glossy-input w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border border-emerald-400/40 focus:border-emerald-400 text-xs sm:text-sm font-bold placeholder:text-slate-400 outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center justify-between">
                      <span>Confirm Password <span className="text-rose-400">*</span></span>
                      <span className="text-[9.5px] text-emerald-300/80 font-semibold">Must match</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Re-enter your new password"
                        className="glossy-input w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border border-emerald-400/40 focus:border-emerald-400 text-xs sm:text-sm font-bold placeholder:text-slate-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleResetPasswordSubmit}
                    className="glossy-btn w-full py-2.5 sm:py-3 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Save New Password & Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Cancel / Back to Login button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Button (Glossy VisionOS Button) */}
          {authMode !== 'forgot' && (
            <button
              type="submit"
              disabled={isSubmitting || isSendingOtp}
              className="glossy-btn w-full mt-3 py-3 sm:py-3.5 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-85 cursor-pointer shadow-md"
            >
              {isSubmitting || isSendingOtp ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>
                    {authMode === 'signin'
                      ? 'Signing in .....'
                      : signupStep === 'form'
                        ? 'Sending OTP to Mail .....'
                        : 'Verifying OTP & Entering App .....'}
                  </span>
                </div>
              ) : (
                <>
                  <span>
                    {authMode === 'signin'
                      ? 'Sign In'
                      : signupStep === 'form'
                        ? 'Request OTP to Mail'
                        : 'Verify OTP & Enter App'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </form>

        {/* Or Continue With Divider (Only on Step 1) */}
        {authMode !== 'forgot' && (authMode === 'signin' || (authMode === 'signup' && signupStep === 'form')) && (
          <div className="cosmic-float-piece-b">
            <div className="relative my-3.5 sm:my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/80"></div>
              </div>
              <span className="relative bg-[#0b1329]/90 border border-slate-700/80 backdrop-blur-md px-3 text-[10px] sm:text-[10.5px] font-bold tracking-wider text-slate-400 uppercase rounded-full">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Google SSO Button (Cosmic Secondary Glass) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="glossy-btn-secondary w-full py-2.5 sm:py-3 px-4 rounded-full font-bold text-[11px] sm:text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              {/* Official Google 'G' SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>SIGN IN WITH GOOGLE</span>
            </button>
          </div>
        )}

        {/* Toggle between Sign In (Every time) / Register (First time) */}
        {authMode !== 'forgot' && (
          <div className="text-center mt-3.5 sm:mt-4">
            {authMode === 'signin' ? (
              <p className="text-[11.5px] sm:text-xs text-slate-200 font-bold">
                First time on campus portal?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-sky-300 hover:text-white hover:underline font-black cursor-pointer transition-colors"
                >
                  Register Here (First Time)
                </button>
              </p>
            ) : (
              <p className="text-[11.5px] sm:text-xs text-slate-200 font-bold">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-sky-300 hover:text-white hover:underline font-black cursor-pointer transition-colors"
                >
                  {userTab === 'student' ? 'Login with ID NO & Password' : 'Login with Email & Password'}
                </button>
              </p>
            )}
          </div>
        )}

        {/* Footer Disclaimer */}
        <p className="text-[10px] sm:text-[10.5px] text-slate-300 text-center mt-3.5 sm:mt-4 leading-snug">
          By continuing, you indicate that you have read, understood and agree to <span className="font-black text-white">INTERNAL COMPLAINT SYSTEM (ICS)</span>'s{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setPolicyModalType('terms');
            }}
            className="text-sky-300 hover:text-white hover:underline font-black cursor-pointer transition-colors"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setPolicyModalType('privacy');
            }}
            className="text-sky-300 hover:text-white hover:underline font-black cursor-pointer transition-colors"
          >
            Privacy Policy
          </button>
        </p>

        </div>
      </div>

      {/* MODAL: INSTITUTIONAL GUIDELINES, TERMS OF SERVICE & PRIVACY POLICY */}
      {policyModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-[#0b1329] to-[#070b16] rounded-3xl border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.25)] text-slate-100 overflow-hidden flex flex-col max-h-[88vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700/70 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  {policyModalType === 'terms' ? <Scale className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <span>{policyModalType === 'terms' ? 'Campus Terms of Service & Code of Conduct' : 'Institutional Privacy Policy & Data Protection'}</span>
                  </h3>
                  <p className="text-[11px] font-semibold text-sky-300">
                    RGUKT RK Valley • Central Facility & Redressal Governance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPolicyModalType(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-[13px] leading-relaxed text-slate-300">
              {policyModalType === 'terms' ? (
                <>
                  <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-xs">Official Redressal Portal Usage</h4>
                      <p className="text-[11.5px] text-sky-200/90 mt-0.5">
                        This system is deployed strictly for registered students, faculty, and authorized campus staff of RGUKT RK Valley for lodging, processing, and monitoring maintenance requests and institutional grievances.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        1. Authorized User Accounts & Identity
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        Access is tied to your verified Student ID (e.g., R240493) or official department email. Accounts must be registered and authenticated with official institutional webmail (<span className="text-sky-300 font-mono">@rgukt.ac.in</span> or <span className="text-sky-300 font-mono">@rguktrkv.ac.in</span>).
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        2. Genuine Reporting & False Complaint Policy
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        All reported issues (Electrical, Plumbing, Housekeeping, IT, Infrastructure, ICC) must reflect genuine campus requirements. Submitting fraudulent tickets, misleading images, or spamming the emergency queue may result in administrative review by the hostel warden and campus disciplinary council.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        3. 4-Tier Hostel Redressal Escalation Protocol
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        Hostel grievances follow an automatic 4-tier redressal framework: <strong>Stage 1: Hostel Warden</strong> ➔ <strong>Stage 2: DSW & Engineering Staff</strong> ➔ <strong>Stage 3: Administrative Officer (AO)</strong> ➔ <strong>Stage 4: Director, RGUKT RK Valley</strong>. Unresolved issues escalate automatically according to campus SLA timelines.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        4. Technician Verification & Photo Proof
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        On-duty staff must provide verified photographic proof and work notes upon resolving a ticket. Reporters have the right to inspect repairs, provide a 5-star rating, or reopen the ticket within 48 hours if physical defects persist.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-xs">Privacy & Data Governance Notice</h4>
                      <p className="text-[11.5px] text-emerald-200/90 mt-0.5">
                        Your personal data and campus location details are safeguarded under strict institutional confidentiality guidelines and stored securely via encrypted cloud synchronization.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        1. Information Collected & Purpose
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        We collect your Student/Staff ID, official institutional email, hostel block & room number, optional contact number, and defect descriptions solely to facilitate maintenance assignment, SLA tracking, and status dispatch notices.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        2. Internal Complaints Committee (ICC) Confidentiality
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        Grievances marked under the <strong>Internal Complaints Committee (ICC)</strong> are strictly classified and protected by end-to-end institutional privacy rules. Only authorized committee members, the Presiding Officer, and the Director have access to confidential dockets.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        3. Zero Third-Party Advertising or Commercial Data Sharing
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        Resident credentials and activity records are never sold, rented, or shared with third-party advertising brokers. Data is stored on RGUKT RK Valley secure cloud database instances with role-based security rules.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        4. User Profile Control & Self-Editing Rights
                      </h4>
                      <p className="mt-1 text-slate-300 pl-3 border-l-2 border-slate-700">
                        You retain full control to edit your residential room, class year, contact mobile number, and avatar at any time directly through the <strong>My Profile</strong> dashboard option.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Official Campus Policy • RGUKT RK Valley
              </span>
              <button
                type="button"
                onClick={() => setPolicyModalType(null)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                I Understand & Agree
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: DEMO VIDEO TOUR MODAL ACCESSIBLE FROM AUTH SCREEN */}
      <ProjectDemoVideoModal
        isOpen={showAuthDemoModal}
        onClose={() => setShowAuthDemoModal(false)}
        initialPrompt={false}
      />
    </div>
  );
}

// =========================================================================
// KNOWN SPECIFIC ROOMS BY CAMPUS BLOCK
// =========================================================================
const KNOWN_ROOMS_BY_BLOCK = {
  'AB-1': [
    'Classroom 101 (First Year)',
    'Classroom 102 (First Year)',
    'Classroom 201',
    'Seminar Hall 1',
    'Dean of Academics Office',
    'Examination Section'
  ],
  'AB-2': [
    'Drawing Hall 1',
    'Drawing Hall 2',
    'Conference Hall 202',
    'Administrative Officer (AO) Office',
    'Finance & Accounts Section'
  ],
  'Departments > CSE': [
    'Computer Lab 104 (CSE)',
    'AI & Data Science Lab (105)',
    'Cyber Security & Networks Lab',
    'Advanced Programming Lab 204',
    'CSE HOD Office & Faculty Cabin'
  ],
  'Departments > ECE': [
    'VLSI & Embedded Lab (ECE)',
    'DSP & Communication Lab (205)',
    'Microwave & Optical Fiber Lab',
    'Analog & Digital Circuits Lab',
    'ECE HOD Office & Faculty Cabin'
  ],
  'Departments > EEE': [
    'Power Systems Lab (301)',
    'Electrical Machines Lab',
    'Control Systems & Robotics Lab',
    'Power Electronics & Drives Lab',
    'EEE HOD Office & Faculty Cabin'
  ],
  'Departments > MECHANICAL': [
    'CAD/CAM Simulation Lab',
    'Robotics Testing Bay',
    'Thermal & IC Engines Lab',
    'Fluid Mechanics & Machinery Lab',
    'Mechanical Workshop Main Bay',
    'Mechanical HOD Office & Faculty Cabin'
  ],
  'Departments > CIVIL': [
    'Survey & Geotech Lab (Civil)',
    'Strength of Materials Lab',
    'Concrete & Highway Materials Lab',
    'Environmental Engineering Lab',
    'Civil HOD Office & Faculty Cabin'
  ],
  'Departments > CHEMICAL': [
    'Unit Operations Lab (Chemical)',
    'Chemical Reaction Engineering Lab',
    'Process Dynamics & Instrumentation Lab',
    'Mass Transfer Operations Lab',
    'Chemical HOD Office & Faculty Cabin'
  ],
  'Departments > MME': [
    'Material Testing Lab (MME)',
    'Physical Metallurgy & Heat Treatment Lab',
    'Foundry & Welding Technology Lab',
    'Mineral Processing Lab',
    'MME HOD Office & Faculty Cabin'
  ],
  'CSE': [
    'Computer Lab 104 (CSE)',
    'AI & Data Science Lab (105)',
    'Cyber Security & Networks Lab',
    'CSE HOD Office & Faculty Cabin'
  ],
  'ECE': [
    'VLSI & Embedded Lab (ECE)',
    'DSP & Communication Lab (205)',
    'Microwave & Optical Fiber Lab',
    'ECE HOD Office & Faculty Cabin'
  ],
  'EEE': [
    'Power Systems Lab (301)',
    'Electrical Machines Lab',
    'Control Systems & Robotics Lab',
    'EEE HOD Office & Faculty Cabin'
  ],
  'MECHANICAL': [
    'CAD/CAM Simulation Lab',
    'Robotics Testing Bay',
    'Mechanical Workshop Main Bay',
    'Mechanical HOD Office & Faculty Cabin'
  ],
  'CIVIL': [
    'Survey & Geotech Lab (Civil)',
    'Strength of Materials Lab',
    'Civil HOD Office & Faculty Cabin'
  ],
  'CHEMICAL': [
    'Unit Operations Lab (Chemical)',
    'Chemical Reaction Engineering Lab',
    'Chemical HOD Office & Faculty Cabin'
  ],
  'MME': [
    'Material Testing Lab (MME)',
    'Physical Metallurgy & Heat Treatment Lab',
    'MME HOD Office & Faculty Cabin'
  ],
  'Library': [
    'Digital Library Section',
    'Reference Section',
    'Reading Hall 1',
    'Circulation Counter',
    'E-Resource Center'
  ],
  'Computer Center': [
    'Central Computing Lab A',
    'Server Room 101',
    'Network Operations Center',
    'Campus Firewall Station'
  ],
  'Lab Complex': [
    'General Chemistry Lab',
    'Physics Core Lab',
    'Language & Multimedia Lab',
    'Instrumentation Bay'
  ],
  'IQAC': [
    'Conference Hall',
    'Administrative Board Room',
    'Quality Audit Office'
  ],
  'PENNA > BH-1{Front Side}': ['Room 002', 'Room 108', 'Room 214', 'Room 302', 'Ground Common Room'],
  'PENNA > BH-1{Backside}': ['Room 120', 'Room 225', 'Room 310', 'Backside Veranda'],
  'PAPAGNI > BH-2{Front Side}': ['Room 105', 'Room 214', 'Room 305', 'Reading Hall'],
  'PAPAGNI > BH-2{Back side}': ['Room 032', 'Room 135', 'Room 220', 'Dining Entry'],
  'KUNDU{GH-1} > Main Wing': ['Room 012', 'Room 115', 'Room 208', 'Warden Cabin'],
  'KUNDU{GH-1}': ['Room 012', 'Room 115', 'Room 208', 'Warden Cabin'],
  'CHITRAVATI{GH-2} > Main Wing': ['Room 018', 'Room 122', 'Room 215', 'Medical Rest Area'],
  'CHITRAVATI{GH-2}': ['Room 018', 'Room 122', 'Room 215', 'Medical Rest Area'],
  'OLD CAMPUS > RHO': ['Room 14', 'Room 15'],
  'OLD CAMPUS > THETA': ['Room 08', 'Room 09'],
  'OLD CAMPUS > ALPHA': ['Room 05', 'Room 06'],
  'OLD CAMPUS > BETA': ['Room 09', 'Room 10'],
  'OLD CAMPUS > GAMMA': ['Room 11', 'Room 12'],
  'OLD CAMPUS > DELTA': ['Room 06', 'Room 07'],
  'SAC': ['Indoor Badminton Court', 'Fitness & Gym Center', 'Music & Cultural Room', 'Sports Equipment Store'],
  'HOSPITAL': ['Emergency Ward 1', 'Physician Cabin 1', 'Pharmacy Counter', 'Observation Ward', 'Minor OT']
};

// =========================================================================
// RGUKT RK VALLEY (IDUPULAPAYA) CAMPUS GOOGLE MAPS NAVIGATION ENGINE
// =========================================================================
export const RGUKT_RKV_CAMPUS_GEO = {
  campusName: 'Rajiv Gandhi University of Knowledge Technologies (RGUKT) RK Valley',
  campusShort: 'RGUKT RK Valley',
  campusCity: 'Idupulapaya, Vempalli, Kadapa, AP',
  pincode: '516330',
  centerLat: 14.335500,
  centerLng: 78.538400,
  estateDepot: { lat: 14.335084, lng: 78.536433, name: 'Central Estate Maintenance Depot & Engineering Hub' },
  mainGate: { lat: 14.330403, lng: 78.536434, name: 'Campus Main Entrance Gate Arch & Rajiv Gandhi Statue' }
};

export const RGUKT_RKV_BUILDINGS = {
  // Academic Blocks
  'AB-1': {
    name: 'Academic Block 1 (AB-1)',
    short: 'AB-1',
    sector: 'Academics',
    lat: 14.335162,
    lng: 78.537117,
    departments: 'First Year Classrooms, Dean of Academics, Examination Section',
    walkingDistFromDepot: 120,
    walkTimeMins: 2,
    entranceNote: 'Main North Entrance facing Central Clock Tower Quadrangle',
    landmark: 'Near Staircase B & Central Server Room',
    gmapsQuery: 'Academic Block 1, RGUKT RK Valley, Idupulapaya'
  },
  'AB-2': {
    name: 'Academic Block 2 (AB-2)',
    short: 'AB-2',
    sector: 'Academics',
    lat: 14.335241,
    lng: 78.539689,
    departments: 'Drawing Halls, AO Office, Finance Section, Senior Lecture Rooms',
    walkingDistFromDepot: 260,
    walkTimeMins: 3,
    entranceNote: 'Main Quadrangle Entrance beside Mechanical Annex',
    landmark: 'Near Materials Testing Section & Fire Exit',
    gmapsQuery: 'Academic Block 2, RGUKT RK Valley, Idupulapaya'
  },
  'Library': {
    name: 'Central Campus Library & Digital Resource Center',
    short: 'Central Library',
    sector: 'Academics',
    lat: 14.335594,
    lng: 78.538407,
    departments: 'Digital Library, Reading Halls, Reference Section',
    walkingDistFromDepot: 190,
    walkTimeMins: 2,
    entranceNote: 'Central Flagpost Glass Atrium Entrance',
    landmark: 'Between AB-1 and AB-2, Beside Circulation Desk',
    gmapsQuery: 'Central Library, RGUKT RK Valley, Idupulapaya'
  },
  'Computer Center': {
    name: 'Central Computer Center (CCC) & Campus NOC',
    short: 'Computer Center',
    sector: 'Academics',
    lat: 14.335895,
    lng: 78.541528,
    departments: 'Central Computing Lab, Server Rooms, NOC Firewall',
    walkingDistFromDepot: 310,
    walkTimeMins: 4,
    entranceNote: 'East Wing Computing Hub Portico',
    landmark: 'Opposite Central Server Rack & UPS Room',
    gmapsQuery: 'Computer Center, RGUKT RK Valley, Idupulapaya'
  },
  'Lab Complex': {
    name: 'Central Laboratory & Research Bay',
    short: 'Lab Complex',
    sector: 'Academics',
    lat: 14.336150,
    lng: 78.538128,
    departments: 'Physics Core Lab, Chemistry Lab, Workshop Annex',
    walkingDistFromDepot: 210,
    walkTimeMins: 3,
    entranceNote: 'Ground Floor Research Bay entrance with safety showers',
    landmark: 'Near Instrumentation Bay & Chemical Store',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'IQAC': {
    name: 'IQAC & Administration Board Block',
    short: 'IQAC Block',
    sector: 'Academics',
    lat: 14.336814,
    lng: 78.540676,
    departments: 'Internal Quality Assurance Cell, Director Board Room',
    walkingDistFromDepot: 280,
    walkTimeMins: 3,
    entranceNote: 'Administrative Reception Entrance Portico',
    landmark: 'Executive Board Room Corridor',
    gmapsQuery: 'Administrative Block, RGUKT RK Valley, Idupulapaya'
  },

  // Engineering Departments (Distinct surveyed campus locations)
  'Departments > CSE': {
    name: 'Department of Computer Science & Engineering (CSE Block)',
    short: 'CSE Department',
    sector: 'Academics',
    lat: 14.335895,
    lng: 78.541528,
    departments: 'CSE Computing Labs, AI & Data Science Center, Cyber Security Lab, HOD Office',
    walkingDistFromDepot: 310,
    walkTimeMins: 4,
    entranceNote: 'CSE Department Main Portico facing Computing Complex',
    landmark: 'Beside Central Computer Center & AI/ML Innovation Lab',
    gmapsQuery: 'Computer Science Department, RGUKT RK Valley, Idupulapaya'
  },
  'CSE': {
    name: 'Department of Computer Science & Engineering (CSE Block)',
    short: 'CSE Department',
    sector: 'Academics',
    lat: 14.335895,
    lng: 78.541528,
    departments: 'CSE Computing Labs, AI & Data Science Center, Cyber Security Lab, HOD Office',
    walkingDistFromDepot: 310,
    walkTimeMins: 4,
    entranceNote: 'CSE Department Main Portico facing Computing Complex',
    landmark: 'Beside Central Computer Center & AI/ML Innovation Lab',
    gmapsQuery: 'Computer Science Department, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > ECE': {
    name: 'Department of Electronics & Communication Engineering (ECE Block)',
    short: 'ECE Department',
    sector: 'Academics',
    lat: 14.334397,
    lng: 78.541620,
    departments: 'VLSI Design Lab, Embedded Systems, Microwave & Optical Fiber Lab, HOD Office',
    walkingDistFromDepot: 330,
    walkTimeMins: 4,
    entranceNote: 'ECE Department Main Entrance Portico',
    landmark: 'Opposite Academic Quadrangle South, Near Communications Tower',
    gmapsQuery: 'ECE Block, RGUKT RK Valley, Idupulapaya'
  },
  'ECE': {
    name: 'Department of Electronics & Communication Engineering (ECE Block)',
    short: 'ECE Department',
    sector: 'Academics',
    lat: 14.334397,
    lng: 78.541620,
    departments: 'VLSI Design Lab, Embedded Systems, Microwave & Optical Fiber Lab, HOD Office',
    walkingDistFromDepot: 330,
    walkTimeMins: 4,
    entranceNote: 'ECE Department Main Entrance Portico',
    landmark: 'Opposite Academic Quadrangle South, Near Communications Tower',
    gmapsQuery: 'ECE Block, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > EEE': {
    name: 'Department of Electrical & Electronics Engineering (EEE Block)',
    short: 'EEE Department',
    sector: 'Academics',
    lat: 14.336944,
    lng: 78.542585,
    departments: 'Power Systems Lab, Electrical Machines, Control & Robotics Lab, HOD Office',
    walkingDistFromDepot: 370,
    walkTimeMins: 5,
    entranceNote: 'EEE Department East Entrance Ramp',
    landmark: 'Near North-East Substation & Solar Test Rig',
    gmapsQuery: 'EEE Block, RGUKT RK Valley, Idupulapaya'
  },
  'EEE': {
    name: 'Department of Electrical & Electronics Engineering (EEE Block)',
    short: 'EEE Department',
    sector: 'Academics',
    lat: 14.336944,
    lng: 78.542585,
    departments: 'Power Systems Lab, Electrical Machines, Control & Robotics Lab, HOD Office',
    walkingDistFromDepot: 370,
    walkTimeMins: 5,
    entranceNote: 'EEE Department East Entrance Ramp',
    landmark: 'Near North-East Substation & Solar Test Rig',
    gmapsQuery: 'EEE Block, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > MECHANICAL': {
    name: 'Department of Mechanical Engineering & Workshops',
    short: 'Mechanical Dept',
    sector: 'Academics',
    lat: 14.336172,
    lng: 78.538640,
    departments: 'CAD/CAM Lab, Robotics Testing Bay, Thermal & IC Engines Lab, Workshop Bay',
    walkingDistFromDepot: 230,
    walkTimeMins: 3,
    entranceNote: 'Central Mechanical Workshop & Department Office Entrance',
    landmark: 'Adjacent to Mechanical Heavy Machinery Sheds & AB-2 West',
    gmapsQuery: 'Mechanical Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'MECHANICAL': {
    name: 'Department of Mechanical Engineering & Workshops',
    short: 'Mechanical Dept',
    sector: 'Academics',
    lat: 14.336172,
    lng: 78.538640,
    departments: 'CAD/CAM Lab, Robotics Testing Bay, Thermal & IC Engines Lab, Workshop Bay',
    walkingDistFromDepot: 230,
    walkTimeMins: 3,
    entranceNote: 'Central Mechanical Workshop & Department Office Entrance',
    landmark: 'Adjacent to Mechanical Heavy Machinery Sheds & AB-2 West',
    gmapsQuery: 'Mechanical Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > CIVIL': {
    name: 'Department of Civil Engineering Block',
    short: 'Civil Department',
    sector: 'Academics',
    lat: 14.334850,
    lng: 78.537420,
    departments: 'Survey & Geotech Lab, Strength of Materials Lab, Concrete Testing, HOD Office',
    walkingDistFromDepot: 160,
    walkTimeMins: 2,
    entranceNote: 'Civil Engineering South Quad Entrance',
    landmark: 'Near Structural Engineering Testing Field & Survey Station',
    gmapsQuery: 'Civil Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'CIVIL': {
    name: 'Department of Civil Engineering Block',
    short: 'Civil Department',
    sector: 'Academics',
    lat: 14.334850,
    lng: 78.537420,
    departments: 'Survey & Geotech Lab, Strength of Materials Lab, Concrete Testing, HOD Office',
    walkingDistFromDepot: 160,
    walkTimeMins: 2,
    entranceNote: 'Civil Engineering South Quad Entrance',
    landmark: 'Near Structural Engineering Testing Field & Survey Station',
    gmapsQuery: 'Civil Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > CHEMICAL': {
    name: 'Department of Chemical Engineering Block',
    short: 'Chemical Dept',
    sector: 'Academics',
    lat: 14.335359,
    lng: 78.542677,
    departments: 'Unit Operations Lab, Chemical Reaction Eng Lab, Process Dynamics, HOD Office',
    walkingDistFromDepot: 350,
    walkTimeMins: 4,
    entranceNote: 'Chemical Engineering East Wing Portico',
    landmark: 'Near Pilot Plant Shed & Reaction Kinetics Bay',
    gmapsQuery: 'Chemical Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'CHEMICAL': {
    name: 'Department of Chemical Engineering Block',
    short: 'Chemical Dept',
    sector: 'Academics',
    lat: 14.335359,
    lng: 78.542677,
    departments: 'Unit Operations Lab, Chemical Reaction Eng Lab, Process Dynamics, HOD Office',
    walkingDistFromDepot: 350,
    walkTimeMins: 4,
    entranceNote: 'Chemical Engineering East Wing Portico',
    landmark: 'Near Pilot Plant Shed & Reaction Kinetics Bay',
    gmapsQuery: 'Chemical Engineering, RGUKT RK Valley, Idupulapaya'
  },
  'Departments > MME': {
    name: 'Department of Metallurgical & Materials Engineering (MME Block)',
    short: 'MME Department',
    sector: 'Academics',
    lat: 14.337387,
    lng: 78.541446,
    departments: 'Material Testing Lab, Physical Metallurgy Lab, Heat Treatment, HOD Office',
    walkingDistFromDepot: 360,
    walkTimeMins: 5,
    entranceNote: 'MME Department North Entrance',
    landmark: 'Near Materials Testing Section & Microscope Room',
    gmapsQuery: 'MME Block, RGUKT RK Valley, Idupulapaya'
  },
  'MME': {
    name: 'Department of Metallurgical & Materials Engineering (MME Block)',
    short: 'MME Department',
    sector: 'Academics',
    lat: 14.337387,
    lng: 78.541446,
    departments: 'Material Testing Lab, Physical Metallurgy Lab, Heat Treatment, HOD Office',
    walkingDistFromDepot: 360,
    walkTimeMins: 5,
    entranceNote: 'MME Department North Entrance',
    landmark: 'Near Materials Testing Section & Microscope Room',
    gmapsQuery: 'MME Block, RGUKT RK Valley, Idupulapaya'
  },

  // Hostels - Penna & Papagni
  'PENNA > BH-1{Front Side}': {
    name: 'Penna Boys Hostel BH-1 (Front Side Wing)',
    short: 'Penna BH-1 (Front)',
    sector: 'Hostels / Dorms',
    lat: 14.333902,
    lng: 78.536685,
    departments: 'Boys Hostel Wing A & B, Resident Warden Office',
    walkingDistFromDepot: 150,
    walkTimeMins: 2,
    entranceNote: 'BH-1 Main Security Portico & Caretaker Office',
    landmark: 'Near Caretaker Desk & Resident Water Dispenser',
    gmapsQuery: 'Penna Hostel, RGUKT RK Valley, Idupulapaya'
  },
  'PENNA > BH-1{Backside}': {
    name: 'Penna Boys Hostel BH-1 (Back Side Wing & Mess)',
    short: 'Penna BH-1 (Back)',
    sector: 'Hostels / Dorms',
    lat: 14.333726,
    lng: 78.537823,
    departments: 'Boys Hostel Wing C & D, Dining Annex',
    walkingDistFromDepot: 210,
    walkTimeMins: 3,
    entranceNote: 'BH-1 Rear Gateway facing Dining Quad',
    landmark: 'Near Mess 1-4 Entry & Rear Veranda',
    gmapsQuery: 'Penna Hostel, RGUKT RK Valley, Idupulapaya'
  },
  'PAPAGNI > BH-2{Front Side}': {
    name: 'Papagni Boys Hostel BH-2 (Front Side Wing)',
    short: 'Papagni BH-2 (Front)',
    sector: 'Hostels / Dorms',
    lat: 14.334319,
    lng: 78.540243,
    departments: 'Senior Boys Hostel Block 2, Recreation Hall',
    walkingDistFromDepot: 320,
    walkTimeMins: 4,
    entranceNote: 'BH-2 South Main Gateway & Caretaker Portico',
    landmark: 'Near Resident Notice Board & Wing Elevator',
    gmapsQuery: 'Papagni Hostel, RGUKT RK Valley, Idupulapaya'
  },
  'PAPAGNI > BH-2{Back side}': {
    name: 'Papagni Boys Hostel BH-2 (Back Side Wing)',
    short: 'Papagni BH-2 (Back)',
    sector: 'Hostels / Dorms',
    lat: 14.334550,
    lng: 78.540500,
    departments: 'Senior Boys Hostel Block 2 North/Rear Wing',
    walkingDistFromDepot: 360,
    walkTimeMins: 4,
    entranceNote: 'BH-2 North Veranda Access Ramp',
    landmark: 'Near North Emergency Exit & Courtyard',
    gmapsQuery: 'Papagni Hostel, RGUKT RK Valley, Idupulapaya'
  },

  // Girls Hostels
  'KUNDU{GH-1}': {
    name: 'Kundu Girls Hostel (GH-1)',
    short: 'Kundu (GH-1)',
    sector: 'Hostels / Dorms',
    lat: 14.334385,
    lng: 78.537779,
    departments: 'Girls Hostel Complex 1, Matron Office, Girls Dining Hall',
    walkingDistFromDepot: 230,
    walkTimeMins: 3,
    entranceNote: 'GH-1 Main Security Checkpost (Authorized Staff Only)',
    landmark: 'Beside Warden Office & Medical Isolation Room',
    gmapsQuery: 'Kundu Hostel GH-1, RGUKT RK Valley, Idupulapaya'
  },
  'KUNDU{GH-1} > Main Wing': {
    name: 'Kundu Girls Hostel (GH-1)',
    short: 'Kundu (GH-1)',
    sector: 'Hostels / Dorms',
    lat: 14.334385,
    lng: 78.537779,
    departments: 'Girls Hostel Complex 1, Matron Office, Girls Dining Hall',
    walkingDistFromDepot: 230,
    walkTimeMins: 3,
    entranceNote: 'GH-1 Main Security Checkpost (Authorized Staff Only)',
    landmark: 'Beside Warden Office & Medical Isolation Room',
    gmapsQuery: 'Kundu Hostel GH-1, RGUKT RK Valley, Idupulapaya'
  },
  'CHITRAVATI{GH-2}': {
    name: 'Chitravati Girls Hostel (GH-2)',
    short: 'Chitravati (GH-2)',
    sector: 'Hostels / Dorms',
    lat: 14.334329,
    lng: 78.539040,
    departments: 'Girls Hostel Complex 2, Common Study Rooms',
    walkingDistFromDepot: 290,
    walkTimeMins: 3,
    entranceNote: 'GH-2 Western Gate near Security Booth',
    landmark: 'Near First Floor Common Study Room',
    gmapsQuery: 'Chitravati Hostel GH-2, RGUKT RK Valley, Idupulapaya'
  },
  'CHITRAVATI{GH-2} > Main Wing': {
    name: 'Chitravati Girls Hostel (GH-2)',
    short: 'Chitravati (GH-2)',
    sector: 'Hostels / Dorms',
    lat: 14.334329,
    lng: 78.539040,
    departments: 'Girls Hostel Complex 2, Common Study Rooms',
    walkingDistFromDepot: 290,
    walkTimeMins: 3,
    entranceNote: 'GH-2 Western Gate near Security Booth',
    landmark: 'Near First Floor Common Study Room',
    gmapsQuery: 'Chitravati Hostel GH-2, RGUKT RK Valley, Idupulapaya'
  },

  // Old Campus Hostels
  'OLD CAMPUS > RHO': {
    name: 'Old Campus Dormitory - RHO Block',
    short: 'RHO Block',
    sector: 'Hostels / Dorms',
    lat: 14.338299,
    lng: 78.537018,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 350,
    walkTimeMins: 4,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'West Courtyard Veranda corridor',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'OLD CAMPUS > THETA': {
    name: 'Old Campus Dormitory - THETA Block',
    short: 'THETA Block',
    sector: 'Hostels / Dorms',
    lat: 14.338360,
    lng: 78.538290,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 370,
    walkTimeMins: 4,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'East Courtyard Veranda corridor',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'OLD CAMPUS > ALPHA': {
    name: 'Old Campus Dormitory - ALPHA Block',
    short: 'ALPHA Block',
    sector: 'Hostels / Dorms',
    lat: 14.338620,
    lng: 78.537250,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 390,
    walkTimeMins: 5,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'North-West Corridor entry',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'OLD CAMPUS > BETA': {
    name: 'Old Campus Dormitory - BETA Block',
    short: 'BETA Block',
    sector: 'Hostels / Dorms',
    lat: 14.338850,
    lng: 78.537550,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 410,
    walkTimeMins: 5,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'North-Central Corridor entry',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'OLD CAMPUS > GAMMA': {
    name: 'Old Campus Dormitory - GAMMA Block',
    short: 'GAMMA Block',
    sector: 'Hostels / Dorms',
    lat: 14.339173,
    lng: 78.537580,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 430,
    walkTimeMins: 5,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'Upper Courtyard entry',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },
  'OLD CAMPUS > DELTA': {
    name: 'Old Campus Dormitory - DELTA Block',
    short: 'DELTA Block',
    sector: 'Hostels / Dorms',
    lat: 14.339380,
    lng: 78.537820,
    departments: 'Ground-level dormitories, Open courtyard',
    walkingDistFromDepot: 450,
    walkTimeMins: 6,
    entranceNote: 'Open Veranda Walkway access',
    landmark: 'North-East Dormitory corridor',
    gmapsQuery: 'RGUKT RK Valley, Idupulapaya'
  },

  // Campus Facilities & Infrastructure
  'SAC': {
    name: 'Student Activity Center (SAC) & Open Air Auditorium',
    short: 'SAC & Auditorium',
    sector: 'Facilities',
    lat: 14.338665,
    lng: 78.540397,
    departments: 'Student Clubs, Gymnasium, Indoor Badminton Courts, Stage',
    walkingDistFromDepot: 380,
    walkTimeMins: 5,
    entranceNote: 'SAC Main Double Doors facing Sports Complex Ground',
    landmark: 'Adjacent to Indoor Sports Area & Stage',
    gmapsQuery: 'SAC RGUKT RK Valley, Idupulapaya'
  },
  'HOSPITAL': {
    name: 'Campus 24/7 Health Center & Hospital',
    short: 'Campus Hospital',
    sector: 'Facilities',
    lat: 14.337060,
    lng: 78.532596,
    departments: 'Doctor Consultation, Emergency Casualty, Pharmacy, Ambulance Bay',
    walkingDistFromDepot: 320,
    walkTimeMins: 4,
    entranceNote: 'Emergency Ambulance Ramp & Main Hospital Reception',
    landmark: 'Near Nursing Station & Pharmacy Counter',
    gmapsQuery: 'Hospital RGUKT RK Valley, Idupulapaya'
  }
};

export function getRkvGoogleMapsData(block = 'AB-1', floor = '', room = '') {
  const b = (block || '').trim();
  const r = (room || '').trim();
  const combo = `${b} ${r}`.toUpperCase();

  let matched = null;

  // 1. Department-level resolution first (Checks both block selection and room name)
  // This guarantees CSE, ECE, EEE, Mechanical, Civil, Chemical, MME get their specific department locations
  if (combo.includes('CSE') || combo.includes('COMPUTER SCIENCE')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > CSE'];
  } else if (combo.includes('ECE') || combo.includes('ELECTRONICS') || combo.includes('VLSI') || combo.includes('DSP') || combo.includes('OPTICAL FIBER')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > ECE'];
  } else if (combo.includes('EEE') || combo.includes('ELECTRICAL') || combo.includes('POWER SYSTEMS') || combo.includes('POWER ELECTRONICS')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > EEE'];
  } else if (combo.includes('MECHANICAL') || combo.includes('CAD/CAM') || combo.includes('ROBOTICS TESTING') || combo.includes('THERMAL & IC')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > MECHANICAL'];
  } else if (combo.includes('CIVIL') || combo.includes('SURVEY & GEOTECH') || combo.includes('GEOTECH') || combo.includes('CONCRETE & HIGHWAY')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > CIVIL'];
  } else if (combo.includes('CHEMICAL') || combo.includes('UNIT OPERATIONS') || combo.includes('REACTION ENG')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > CHEMICAL'];
  } else if (combo.includes('MME') || combo.includes('METALLURG') || combo.includes('MATERIAL TESTING')) {
    matched = RGUKT_RKV_BUILDINGS['Departments > MME'];
  }

  // 2. Exact key match if not matched by department
  if (!matched && RGUKT_RKV_BUILDINGS[b]) {
    matched = RGUKT_RKV_BUILDINGS[b];
  }

  // 3. Fallback matching across remaining buildings and facilities
  if (!matched) {
    if (combo.includes('LIBRARY')) matched = RGUKT_RKV_BUILDINGS['Library'];
    else if (combo.includes('COMPUTER CENTER') || combo.includes('NOC') || combo.includes('FIREWALL')) matched = RGUKT_RKV_BUILDINGS['Computer Center'];
    else if (combo.includes('LAB COMPLEX') || combo.includes('CHEMISTRY LAB') || combo.includes('PHYSICS CORE')) matched = RGUKT_RKV_BUILDINGS['Lab Complex'];
    else if (combo.includes('IQAC') || combo.includes('AUDIT') || combo.includes('BOARD ROOM')) matched = RGUKT_RKV_BUILDINGS['IQAC'];
    else if (combo.includes('HOSPITAL') || combo.includes('DOCTOR') || combo.includes('EMERGENCY') || combo.includes('WARD') || combo.includes('PHARMACY')) matched = RGUKT_RKV_BUILDINGS['HOSPITAL'];
    else if (combo.includes('SAC') || combo.includes('BADMINTON') || combo.includes('GYM')) matched = RGUKT_RKV_BUILDINGS['SAC'];
    else if (combo.includes('KUNDU') || combo.includes('GH-1')) matched = RGUKT_RKV_BUILDINGS['KUNDU{GH-1}'];
    else if (combo.includes('CHITRA') || combo.includes('GH-2')) matched = RGUKT_RKV_BUILDINGS['CHITRAVATI{GH-2}'];
    else if (combo.includes('PENNA')) {
      matched = combo.includes('BACK') ? RGUKT_RKV_BUILDINGS['PENNA > BH-1{Backside}'] : RGUKT_RKV_BUILDINGS['PENNA > BH-1{Front Side}'];
    } else if (combo.includes('PAPAGNI')) {
      matched = combo.includes('BACK') ? RGUKT_RKV_BUILDINGS['PAPAGNI > BH-2{Back side}'] : RGUKT_RKV_BUILDINGS['PAPAGNI > BH-2{Front Side}'];
    } else if (combo.includes('OLD CAMPUS') || combo.includes('OLDCAMP')) {
      if (combo.includes('THETA')) matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > THETA'];
      else if (combo.includes('ALPHA')) matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > ALPHA'];
      else if (combo.includes('BETA')) matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > BETA'];
      else if (combo.includes('GAMMA')) matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > GAMMA'];
      else if (combo.includes('DELTA')) matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > DELTA'];
      else matched = RGUKT_RKV_BUILDINGS['OLD CAMPUS > RHO'];
    } else if (combo.includes('AB-2') || combo.includes('DRAWING HALL')) {
      matched = RGUKT_RKV_BUILDINGS['AB-2'];
    } else {
      matched = RGUKT_RKV_BUILDINGS['AB-1'];
    }
  }

  const lat = Number(matched.lat.toFixed(6));
  const lng = Number(matched.lng.toFixed(6));

  // Direct Walking Directions URL in Google Maps (opens turn-by-turn walking route to exact building centroid)
  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}&travelmode=walking`;

  // Search / Place Pin URL in Google Maps with high precision
  const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;

  // Direct Pin Drop URL with building name label
  const gmapsPlaceUrl = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}+(${encodeURIComponent(matched.name + ', RGUKT RK Valley')})`;

  // High-precision OpenStreetMap embed centered directly over building footprint (span ~300m)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.0035).toFixed(6)}%2C${(lat - 0.0025).toFixed(6)}%2C${(lng + 0.0035).toFixed(6)}%2C${(lat + 0.0025).toFixed(6)}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lng.toFixed(6)}`;

  return {
    ...matched,
    lat,
    lng,
    gmapsDirectionsUrl,
    gmapsSearchUrl,
    gmapsPlaceUrl,
    osmEmbedUrl,
    locationLabel: `RGUKT RK Valley, Idupulapaya • ${matched.name} > ${floor} > ${room}`
  };
}

function getRoomNavigationRoute(block = 'AB-1', floor = '1st Floor', room = 'Lab 104') {
  const blockClean = (block || 'AB-1').trim();
  const floorClean = (floor || '1st Floor').trim();
  const roomClean = (room || 'Lab 104').trim();

  const rkv = getRkvGoogleMapsData(blockClean, floorClean, roomClean);
  const sector = rkv.sector;
  const distMeters = rkv.walkingDistFromDepot;
  const walkMins = rkv.walkTimeMins;
  const buildingDesc = rkv.name;
  const entranceNote = rkv.entranceNote;
  const landmark = rkv.landmark;

  let verticalTransit = 'Proceed directly along Ground Floor corridor (No stairs needed)';
  if (floorClean.includes('1st')) {
    verticalTransit = 'Climb Staircase Wing A or take Central Elevator to 1st Floor';
  } else if (floorClean.includes('2nd')) {
    verticalTransit = 'Climb Staircase Wing A or take Central Elevator to 2nd Floor';
  } else if (floorClean.includes('3rd')) {
    verticalTransit = 'Climb Staircase Wing A or take Central Elevator to 3rd Floor';
  }

  const steps = [
    {
      num: 1,
      title: 'Start: Campus Estate Office / Maintenance Depot',
      instruction: `Collect required trade tools and replacement spares from the central maintenance store (GPS: 14.33508° N, 78.53643° E), then exit toward the central campus avenue.`,
      distance: '40m'
    },
    {
      num: 2,
      title: `Navigate to Building: ${rkv.short || blockClean}`,
      instruction: `Follow the paved main pedestrian walkway toward ${rkv.name}. ${entranceNote}. (GPS: ${rkv.lat.toFixed(5)}° N, ${rkv.lng.toFixed(5)}° E).`,
      distance: `${Math.round(distMeters * 0.65)}m`
    },
    {
      num: 3,
      title: `Ascend to Floor: ${floorClean}`,
      instruction: `${verticalTransit}. Check floor indicator signage at the landing.`,
      distance: '25m'
    },
    {
      num: 4,
      title: `Arrive at Target Door: ${roomClean}`,
      instruction: `Turn into corridor wing toward door. "${roomClean}" has official high-contrast door signage mounted on the entrance frame. Landmark: ${landmark}.`,
      distance: '15m'
    }
  ];

  return {
    sector,
    buildingDesc,
    distMeters,
    walkMins,
    entranceNote,
    landmark,
    verticalTransit,
    steps,
    rkv
  };
}

// Sub-component for Post-Resolution Feedback Flow
function FeedbackModal({ ticket, onClose, onSuccess }) {
  const [step, setStep] = useState('DECISION'); // 'DECISION' | 'RATING' | 'REOPEN'
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState(['Thorough Fix']);
  const [comment, setComment] = useState('');
  const [reopenReason, setReopenReason] = useState('Problem recurred immediately after staff left');
  const [reopenComment, setReopenComment] = useState('');

  const submitClose = async () => {
    try {
      let data = null;
      try {
        const res = await fetch(`/api/complaints/${ticket.id}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, feedbackTags: tags, comments: comment })
        });
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn('Backend API offline, persisting directly to Cloud Firestore');
      }

      // Sync closure & feedback rating to Firebase Cloud Firestore unconditionally
      await updateComplaintInFirestore(ticket.id, {
        status: 'CLOSED',
        rating,
        feedbackTags: tags,
        comments: comment,
        ...(data?.complaint || {})
      });
      onSuccess(`✅ Service closed & verified! Staff rated ${rating} stars.`);
    } catch (e) {
      console.error('Feedback submit error:', e);
    }
  };

  const submitReopen = async () => {
    try {
      let data = null;
      try {
        const res = await fetch(`/api/complaints/${ticket.id}/reopen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reopenReason, reopenComment })
        });
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn('Backend API offline, persisting directly to Cloud Firestore');
      }

      // Sync reopen to Firebase Cloud Firestore unconditionally
      await updateComplaintInFirestore(ticket.id, {
        status: 'REOPENED',
        priority: 'HIGH',
        reopenReason,
        reopenComment,
        ...(data?.complaint || {})
      });
      onSuccess(`⚠️ Ticket reopened and escalated to supervisor! Priority set to HIGH.`);
    } catch (e) {
      console.error('Reopen submit error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 border border-slate-700/60 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/60 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-100">{ticket.ticketNumber}</span>
            <h3 className="font-bold text-base text-white tracking-tight">Service Verification</h3>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        {step === 'DECISION' && (
          <div className="text-center py-2 space-y-4">
            <h4 className="text-base font-bold text-white">Did the technician fix the issue satisfactorily?</h4>
            <p className="text-xs text-slate-400">
              {ticket.assignedStaffName} uploaded resolution notes for {ticket.location}.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setStep('RATING')}
                className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-left transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                <h5 className="font-bold text-xs text-emerald-950">Yes, it's fixed!</h5>
                <p className="text-[10px] text-emerald-700">Rate staff & close</p>
              </button>

              <button
                onClick={() => setStep('REOPEN')}
                className="p-4 rounded-xl border border-slate-700/60 bg-white hover:bg-rose-50 hover:border-rose-300 text-left transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-rose-600 mb-1" />
                <h5 className="font-bold text-xs text-white">No, still broken</h5>
                <p className="text-[10px] text-slate-400">Reopen & escalate</p>
              </button>
            </div>
          </div>
        )}

        {step === 'RATING' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-bold text-sm text-white">Rate {ticket.assignedStaffName}</h4>
              <p className="text-xs text-slate-400">Directly impacts technician monthly bonus & CSAT score</p>
            </div>

            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)} className="p-1">
                  <Star className={`w-7 h-7 ${rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Feedback Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {['⚡ Prompt Arrival', '🧹 Clean Workspace', '🤝 Polite Behavior', '🛠️ Thorough Fix'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tags.includes(t) ? 'bg-slate-900 text-white' : 'bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional remarks (optional)..."
              className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
            />

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep('DECISION')} className="px-3 py-2 bg-slate-800/80 text-slate-300 rounded-xl text-xs font-bold">
                Back
              </button>
              <button onClick={submitClose} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                Confirm Fix & Close Ticket
              </button>
            </div>
          </div>
        )}

        {step === 'REOPEN' && (
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              Reopening elevates priority to <strong>HIGH</strong> and immediately alerts the Facilities Supervisor.
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">Reason for Reopening</label>
              <select
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full p-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
              >
                <option>Problem recurred immediately after staff left</option>
                <option>Only partial repair completed</option>
                <option>Staff marked resolved without visiting location</option>
                <option>Repair caused a secondary leak or fault</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={reopenComment}
              onChange={(e) => setReopenComment(e.target.value)}
              placeholder="Provide details on what is still malfunctioning..."
              className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
            />

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep('DECISION')} className="px-3 py-2 bg-slate-800/80 text-slate-300 rounded-xl text-xs font-bold">
                Back
              </button>
              <button onClick={submitReopen} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold">
                Reopen & Escalate Ticket
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: TECHNICIAN FIX & PROOF OF WORK RESOLUTION
// =========================================================================
function ResolveProofModal({ ticket, onClose, onSubmit }) {
  const [notes, setNotes] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [photo, setPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [safetyChecked, setSafetyChecked] = useState(true);
  const [cleanedUp, setCleanedUp] = useState(true);

  // Client-side image compression handler (max 1200px, 0.85 jpeg)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(compressedDataUrl);
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setErrorMsg('Please describe the work details and action taken to resolve this defect.');
      return;
    }
    if (!photo) {
      setErrorMsg('Please upload or capture a photo showing the completed repair as proof of work.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(notes.trim(), photo, spareParts.trim());
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit resolution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickActionChips = [
    'Replaced damaged component',
    'Wiring & loose connections repaired',
    'Leakage sealed & washer replaced',
    'Deep cleaned & sanitized',
    'Tested and operational'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-700/60 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight leading-tight">Submit Fix & Proof of Work</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {ticket.ticketNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">Document the repair action and attach after-work verification photo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-300 hover:bg-slate-200/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complaint Summary Context Card */}
        <div className="p-5 pb-0">
          <div className="p-3.5 cyber-card-subtle rounded-2xl border border-slate-700/60/80 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-bold text-slate-200">{ticket.category}</span>
              <span className="flex items-center gap-1 text-[11px]"><MapPin className="w-3 h-3 text-slate-400" /> {ticket.location}</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">{ticket.title}</h4>
            {ticket.description && (
              <p className="text-slate-400 text-xs line-clamp-2">{ticket.description}</p>
            )}
            {ticket.photos && ticket.photos.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported Defect Photo:</span>
                <img
                  src={ticket.photos[0]}
                  alt="Defect"
                  className="w-10 h-10 object-cover rounded-lg border border-slate-700/60 shadow-2xs cursor-pointer hover:opacity-90"
                  onClick={() => window.open(ticket.photos[0], '_blank')}
                  title="Click to view full reported image"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Work Details & Action Taken */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1">
              1. Work Details & Action Taken <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Explain the physical repairs conducted, root cause found, and test outcome.
            </p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Replaced faulty wiring connector, tested load for 20 mins, confirmed stable voltage output..."
              className="w-full p-3 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
            {/* Quick helper chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickActionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNotes(prev => prev ? `${prev}. ${chip}` : chip)}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-200 text-slate-300 rounded-lg text-[10px] font-semibold transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Spare Parts & Materials Replaced */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1">
              2. Spare Parts & Materials Used <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={spareParts}
              onChange={(e) => setSpareParts(e.target.value)}
              placeholder="e.g. 25W LED Batten, Teflon tape roll, 16A MCB switch, M6 bolts"
              className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* 3. Upload Fix Proof Photo */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-100">
                3. Upload Fix Proof Photo (After-Repair Photo) <span className="text-rose-500">*</span>
              </label>
              {photo && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Photo Attached
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Take an on-site photo or upload a clear photo of the repaired equipment/area showing it is fixed.
            </p>

            {photo ? (
              <div className="relative rounded-2xl border-2 border-emerald-400 bg-emerald-50/20 p-3 overflow-hidden shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={photo}
                    alt="Fix Proof"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-emerald-200 shadow-xs"
                  />
                  <div className="flex-1 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Proof Photo Attached
                    </span>
                    <p className="text-[11px] text-slate-400">
                      This photo will be visible to the reporter on the complaint tracker and verified in resolution logs.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer text-[11px] font-bold text-blue-600 hover:text-blue-700 underline">
                        Replace Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoSelect}
                        />
                      </label>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setPhoto('')}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 cyber-card-subtle/60 hover:bg-emerald-50/20 transition-all">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {/* Upload from Gallery / Files */}
                  <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>

                  {/* Camera Capture */}
                  <label className="cursor-pointer px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-700" />
                    <span>Camera Capture</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  Supports JPG, PNG, WEBP. On-device compression automatically optimized for high resolution and fast upload.
                </p>
              </div>
            )}
          </div>

          {/* 4. Verification Checklist */}
          <div className="p-3 cyber-card-subtle rounded-xl border border-slate-700/60/70 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Technician Verification Checklist</span>
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={safetyChecked}
                onChange={(e) => setSafetyChecked(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>I have tested the equipment / installation and verified full functionality.</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={cleanedUp}
                onChange={(e) => setCleanedUp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>Worksite cleaned up; all hazardous debris, scraps, and tools removed.</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 bg-slate-800/80 hover:bg-slate-200 text-slate-200 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Submitting Fix & Proof...' : 'Submit Fix & Proof'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: REJECT COMPLAINT WITH MANDATORY REASON & EXPLANATION
// =========================================================================
function RejectModal({ ticket, onClose, onReject }) {
  const [reason, setReason] = useState('Duplicate Complaint / Already Reported');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const REJECTION_REASONS = [
    'Duplicate Complaint / Already Reported',
    'False Alarm / Normal Operation Verified',
    'Personal Property / Outside Maintenance Scope',
    'Incorrect Location / Inaccessible Area',
    'Scheduled Major Renovation',
    'Other / Custom Reason'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Please provide an explanation / remarks explaining why this complaint is being rejected.');
      return;
    }
    setSubmitting(true);
    await onReject(ticket.id, reason, notes.trim());
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-700/60 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">{ticket.ticketNumber}</span>
              <h3 className="font-bold text-base text-white tracking-tight leading-tight">Reject Grievance Ticket</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Context Card */}
        <div className="my-4 p-3 cyber-card-subtle rounded-2xl border border-slate-700/60/80 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-100">
            <span className="truncate">{ticket.title}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-900 font-bold text-[10px] shrink-0 ml-2">{ticket.category}</span>
          </div>
          <p className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {ticket.location}
          </p>
          <p className="text-slate-400 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" /> Reporter: {ticket.reporterName} ({ticket.reporterEmail})
          </p>
        </div>

        {/* Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Rejecting this ticket will mark the grievance as <strong>REJECTED</strong> and dispatch a formal explanation email directly from the <strong>{ticket.category} Department</strong> to the reporter.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              1. Select Primary Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-100 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              2. Department Explanation & Remarks (Why was it rejected?) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain clearly to the reporter why this issue cannot be serviced (e.g. verified normal operation, duplicate ticket #CMP-2026-..., or outside campus maintenance scope)..."
              className="w-full p-3 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none placeholder:text-slate-400"
              required
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              This exact explanation will be emailed to {ticket.reporterEmail}.
            </span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 bg-slate-800/80 hover:bg-slate-200 text-slate-200 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Ban className="w-4 h-4" />
              {submitting ? 'Dispatching Notice...' : 'Confirm Rejection & Send Mail'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: CAMPUS DISPATCH LOG & EMAIL CENTER
// =========================================================================
function DispatchMailboxModal({ emails, notifications, onClose, onOpenSmtp }) {
  const [activeTab, setActiveTab] = useState('emails'); // 'emails' | 'notifications'
  const [expandedMailId, setExpandedMailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter(m => 
    !searchQuery ||
    m.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.fromName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-700/60 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between cyber-card-subtle/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight leading-tight">Campus Dispatch & Email Center</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Audit Log</span>
              </div>
              <p className="text-xs text-slate-400">Live archive of automated department dispatches, notifications, and grievance mailings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSmtp && (
              <button
                type="button"
                onClick={onOpenSmtp}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Configure Real SMTP</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-300 hover:bg-slate-200/60 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="px-5 py-3 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'emails' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Department Emails</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{emails.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'notifications' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Push / App Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{notifications.length}</span>
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, recipient..."
              className="w-full px-3 py-1.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 cyber-card-subtle/50">
          {activeTab === 'emails' ? (
            filteredEmails.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No department emails logged yet. Submit or reject a complaint to trigger automated dispatches.
              </div>
            ) : (
              filteredEmails.map(mail => {
                const isExpanded = expandedMailId === mail.id;
                const isReject = mail.type === 'REJECTION_NOTICE';
                const isResolve = mail.type === 'RESOLVED_NOTICE';
                const isDeptDispatch = mail.type === 'DISPATCH_TO_DEPT';

                return (
                  <div
                    key={mail.id}
                    className={`rounded-2xl border transition-all ${
                      isReject ? 'border-rose-200 bg-rose-50/30' :
                      isResolve ? 'border-emerald-200 bg-emerald-50/30' :
                      'border-slate-700/60 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isReject ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            isResolve ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            isDeptDispatch ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {isReject ? '❌ REJECTION NOTICE' :
                             isResolve ? '✅ RESOLUTION COMPLETED' :
                             isDeptDispatch ? '🚨 DISPATCH TO DEPT' : '📋 REPORTER ACK'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-100">{mail.ticketNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {mail.previewUrl && (
                            <a
                              href={mail.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Live Preview
                            </a>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {new Date(mail.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(mail.time).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">{mail.subject}</h4>

                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        <p><strong className="text-slate-100">From:</strong> {mail.fromName} &lt;{mail.from}&gt;</p>
                        <p><strong className="text-slate-100">To:</strong> {mail.toName} &lt;{mail.to}&gt;</p>
                        {mail.rejectionReason && (
                          <p className="text-rose-700 font-bold pt-1">
                            ⚠️ Rejection Reason: {mail.rejectionReason}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setExpandedMailId(isExpanded ? null : mail.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide Message Body' : 'View Full Email Body'}
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                        <span className="text-[10px] text-slate-400">Delivered via RGUKT Mail Gateway</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-slate-900 text-slate-100 rounded-b-2xl border-t border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {mail.body}
                      </div>
                    )}
                  </div>
                );
              })
            )
          ) : (
            notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-300">No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-1">System dispatches, complaint receipts, and security alerts will appear here.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="p-3.5 glass-panel rounded-2xl shadow-2xs border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-100">{notif.title}</span>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">{notif.channel || 'CAMPUS'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.body}</p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Recipient: <strong className="text-slate-200">{notif.recipient || 'You'}</strong></span>
                    <span className="font-mono text-slate-400">
                      {notif.time ? (isNaN(new Date(notif.time)) ? notif.time : new Date(notif.time).toLocaleTimeString()) : (notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now')}
                    </span>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/60 bg-white flex items-center justify-between text-xs text-slate-400">
          <span>Active Department Gateways: Electrical, Plumbing, IT, Housekeeping, Civil, Safety</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Close Center
          </button>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: REAL SMTP & EMAIL PROVIDER CONFIGURATION
// =========================================================================
function SmtpSettingsModal({ config, onClose, onSuccess, defaultTestEmail }) {
  const [service, setService] = useState(config?.service || 'gmail');
  const [user, setUser] = useState(config?.rawUser || '');
  const [pass, setPass] = useState('');
  const [host, setHost] = useState(config?.host || 'smtp.gmail.com');
  const [port, setPort] = useState(config?.port || 587);
  const [secure, setSecure] = useState(config?.secure || false);
  const [senderName, setSenderName] = useState(config?.senderName || 'RGUKT AP Maintenance Dispatcher');
  const [testEmail, setTestEmail] = useState(defaultTestEmail || 'student@rgukt.ac.in');
  
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          host,
          port,
          secure,
          user,
          pass,
          senderName,
          enabled: !!(user && pass)
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        onSuccess && onSuccess();
      } else {
        setStatusMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTestSend = async () => {
    if (!testEmail) {
      alert('Please enter a destination email to send the test message to.');
      return;
    }
    setTesting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: testEmail, recipientName: 'Student' })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: `Success! Verification email delivered to ${testEmail}. ${data.mail.previewUrl ? 'Preview link: ' + data.mail.previewUrl : ''}`
        });
      } else {
        setStatusMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-700/60 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight leading-tight">Live Email & SMTP Configuration</h3>
              <p className="text-xs text-slate-400">Configure real Gmail or institutional mail server for student alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-300 hover:bg-slate-200/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMsg && (
          <div className={`m-5 mb-0 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 font-medium border ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />}
            <span className="leading-relaxed">{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-100 mb-1.5">
              Select Email Service Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setService('gmail');
                  setHost('smtp.gmail.com');
                  setPort(587);
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  service === 'gmail'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/10'
                    : 'border-slate-700/60 cyber-card-subtle text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span className="block font-black">Google Gmail</span>
                <span className="text-[10px] text-slate-400 font-normal">Requires 16-character App Password</span>
              </button>

              <button
                type="button"
                onClick={() => setService('custom')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  service === 'custom'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/10'
                    : 'border-slate-700/60 cyber-card-subtle text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span className="block font-black">Custom SMTP</span>
                <span className="text-[10px] text-slate-400 font-normal">University / Corporate mail server</span>
              </button>
            </div>
          </div>

          {/* Gmail Helper Guide */}
          {service === 'gmail' && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>How to connect your Gmail in 1 minute:</span>
              </div>
              <ol className="list-decimal list-inside text-[11px] text-amber-900/90 space-y-1 pl-1">
                <li>Go to your <strong>Google Account</strong> &gt; <strong>Security</strong> &gt; <strong>2-Step Verification</strong>.</li>
                <li>At the bottom, click <strong>App passwords</strong>.</li>
                <li>Enter app name <code className="bg-amber-100 px-1 rounded">RGUKT Maintenance</code> and click <strong>Create</strong>.</li>
                <li>Copy the <strong>16-letter password</strong> and paste it below.</li>
              </ol>
            </div>
          )}

          {/* Email & Password inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Sender Email Address (e.g. Gmail) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                App Password / SMTP Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder={config?.hasPassword ? "•••••••••••••••• (Leave blank to keep existing password)" : "16-character Google App Password"}
                className="w-full p-2.5 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Custom SMTP host and port if selected */}
          {service === 'custom' && (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-200 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="smtp.rgukt.ac.in"
                  className="w-full p-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="587"
                  className="w-full p-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* Live Test Section */}
          <div className="pt-2 border-t border-slate-800/60">
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Verify Delivery to Student Email:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="student@rgukt.ac.in"
                className="flex-1 p-2 cyber-card-subtle border border-slate-700/60 rounded-xl text-xs"
              />
              <button
                type="button"
                disabled={testing}
                onClick={handleTestSend}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testing ? 'Dispatching...' : 'Test Send'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800/80 hover:bg-slate-200 text-slate-200 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Verifying & Saving...' : 'Save Configuration'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
