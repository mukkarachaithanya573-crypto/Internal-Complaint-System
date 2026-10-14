// server.js - Centralized Campus Facility Maintenance REST API Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

// In-Memory Database with RGUKT AP IIIT Campus Taxonomy
let LOCATIONS = [
  { id: 'loc-1', zone: 'Academics', building: 'AB-1', department: 'CSE', floor: '1st Floor', room: 'Computer Lab 104', qrHash: 'QR-AB1-CSE-L104' },
  { id: 'loc-2', zone: 'Academics', building: 'AB-1', department: 'ECE', floor: '2nd Floor', room: 'DSP & VLSI Lab', qrHash: 'QR-AB1-ECE-VLSI' },
  { id: 'loc-3', zone: 'Academics', building: 'AB-2', department: 'MECHANICAL', floor: 'Ground Floor', room: 'CAD/CAM Lab', qrHash: 'QR-AB2-MECH-CAD' },
  { id: 'loc-4', zone: 'Academics', building: 'Library', department: 'Central', floor: 'Ground Floor', room: 'Digital Library Section', qrHash: 'QR-LIB-GF-DIG' },
  { id: 'loc-5', zone: 'Academics', building: 'Computer Center', department: 'Central', floor: '1st Floor', room: 'Server Room', qrHash: 'QR-CC-1F-SRV' },
  { id: 'loc-6', zone: 'Hostel/Dorm', building: 'PENNA', block: 'BH-1{Front Side}', floor: '1st Floor', room: 'Room 108', qrHash: 'QR-PENNA-BH1-F-108' },
  { id: 'loc-7', zone: 'Hostel/Dorm', building: 'PAPAGNI', block: 'BH-2{Front Side}', floor: '2nd Floor', room: 'Room 214', qrHash: 'QR-PAPAGNI-BH2-F-214' },
  { id: 'loc-8', zone: 'Hostel/Dorm', building: 'KUNDU{GH-1}', block: 'Main Wing', floor: 'Ground Floor', room: 'Room 012', qrHash: 'QR-KUNDU-GH1-012' },
  { id: 'loc-9', zone: 'Hostel/Dorm', building: 'CHITRAVATI{GH-2}', block: 'East Wing', floor: '1st Floor', room: 'Room 115', qrHash: 'QR-CHITRA-GH2-115' },
  { id: 'loc-10', zone: 'Hostel/Dorm', building: 'OLD CAMPUS', block: 'RHO', floor: '1st Floor', room: 'Room 14', qrHash: 'QR-OLDCAMP-RHO-14' },
  { id: 'loc-11', zone: 'Facilities', building: 'SAC', department: 'Sports & Cultural', floor: 'Ground Floor', room: 'Indoor Badminton Court', qrHash: 'QR-SAC-GF-INDOOR' },
  { id: 'loc-12', zone: 'Facilities', building: 'HOSPITAL', department: 'Health Center', floor: 'Ground Floor', room: 'Emergency Ward', qrHash: 'QR-HOSP-EMERGENCY' },
];

let DEPARTMENTS = [
  { id: 'dept-elec', code: 'DEPT_ELECTRICAL', name: 'Electrical Works', contactEmail: 'electrical@rgukt.ac.in' },
  { id: 'dept-plumb', code: 'DEPT_PLUMBING', name: 'Plumbing & Water', contactEmail: 'plumbing@rgukt.ac.in' },
  { id: 'dept-it', code: 'DEPT_IT_SERVICES', name: 'IT & Network Support', contactEmail: 'itsupport@rgukt.ac.in' },
  { id: 'dept-house', code: 'DEPT_HOUSEKEEPING', name: 'Housekeeping & Sanitation', contactEmail: 'clean@rgukt.ac.in' },
  { id: 'dept-civil', code: 'DEPT_CIVIL_WORKS', name: 'Civil & Carpentry', contactEmail: 'civil@rgukt.ac.in' },
  { id: 'dept-safety', code: 'DEPT_ESTATE_SAFETY', name: 'Safety', contactEmail: 'safety@rgukt.ac.in' },
  { 
    id: 'dept-icc', 
    code: 'DEPT_ICC_COMMITTEE', 
    name: 'Internal Complaints Committee (ICC)', 
    contactEmail: 'icc@rgukt.ac.in',
    chairperson: 'The Director, RGUKT RK Valley',
    orderRef: 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee',
    orderDate: '11.08.2026',
    mechanism: 'Three-Level Committee Mechanism'
  },
];

let STAFF = [
  { id: 'staff-1', name: 'Rajesh Kumar', trade: 'Electrical', departmentId: 'dept-elec', isOnDuty: true, activeTickets: 2, resolvedMonth: 54, csat: 4.9, ftfr: 96, zones: ['Academics (AB-1, AB-2)', 'SAC'] },
  { id: 'staff-2', name: 'Suresh Verma', trade: 'Plumbing', departmentId: 'dept-plumb', isOnDuty: true, activeTickets: 4, resolvedMonth: 61, csat: 4.4, ftfr: 84, zones: ['PENNA', 'PAPAGNI', 'KUNDU{GH-1}', 'CHITRAVATI{GH-2}'] },
  { id: 'staff-3', name: 'Amit Sharma', trade: 'IT Systems', departmentId: 'dept-it', isOnDuty: true, activeTickets: 1, resolvedMonth: 68, csat: 4.95, ftfr: 98, zones: ['Computer Center', 'Library', 'AB-1', 'AB-2'] },
  { id: 'staff-4', name: 'Manoj Patel', trade: 'Furniture & Civil', departmentId: 'dept-civil', isOnDuty: true, activeTickets: 3, resolvedMonth: 34, csat: 4.7, ftfr: 92, zones: ['OLD CAMPUS (RHO, THETA, ALPHA)', 'HOSPITAL'] },
  { id: 'staff-5', name: 'Sunil Jadhav', trade: 'Housekeeping', departmentId: 'dept-house', isOnDuty: true, activeTickets: 2, resolvedMonth: 79, csat: 4.9, ftfr: 99, zones: ['Hostels', 'Academics'] },
  { id: 'staff-6', name: 'Vikas Singh', trade: 'Safety', departmentId: 'dept-safety', isOnDuty: true, activeTickets: 2, resolvedMonth: 44, csat: 4.6, ftfr: 90, zones: ['Lab Complex', 'AB-1', 'AB-2'] },
  { id: 'staff-7', name: 'Dr. K. Swathi (ICC Member Secretary)', trade: 'ICC Committee', departmentId: 'dept-icc', isOnDuty: true, activeTickets: 1, resolvedMonth: 18, csat: 4.95, ftfr: 100, zones: ['Campus-Wide (Chaired by Director)'] },
];

let COMPLAINTS = [];

let FEEDBACKS = [];
let NOTIFICATION_LOG = [];
let EMAIL_LOG = [];

// ==================== NODEMAILER & SMTP DISPATCH ENGINE ====================
const CONFIG_FILE = path.join(__dirname, 'smtp-config.json');

let SMTP_CONFIG = {
  enabled: process.env.SMTP_ENABLED === 'true' || false,
  service: process.env.SMTP_SERVICE || 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  senderName: process.env.SMTP_FROM_NAME || 'RGUKT AP Maintenance Dispatcher',
  testMode: true
};

// Load saved SMTP configuration if available
try {
  if (fs.existsSync(CONFIG_FILE)) {
    const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    SMTP_CONFIG = { ...SMTP_CONFIG, ...saved };
    console.log('📧 [SMTP CONFIG] Loaded persistent settings for:', SMTP_CONFIG.user || 'Test Mailer');
  }
} catch (e) {
  console.warn('Could not read smtp-config.json:', e.message);
}

function saveSmtpConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(SMTP_CONFIG, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not save smtp-config.json:', e.message);
  }
}

let etherealAccount = null;

async function getTransporter() {
  // 1. Real custom SMTP or Gmail credentials configured
  if (SMTP_CONFIG.user && SMTP_CONFIG.pass) {
    if (SMTP_CONFIG.service === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SMTP_CONFIG.user,
          pass: SMTP_CONFIG.pass
        }
      });
    }
    return nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass
      }
    });
  }

  // 2. Safe Fallback: Automatic Ethereal Test Mailer for Instant Testing
  if (!etherealAccount) {
    try {
      etherealAccount = await nodemailer.createTestAccount();
      console.log('📮 [MAILER] Initialized Ethereal Test Account:', etherealAccount.user);
    } catch (e) {
      console.warn('⚠️ [MAILER] Could not create Ethereal account:', e.message);
    }
  }

  if (etherealAccount) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass
      }
    });
  }

  return null;
}

// Generate Branded Campus HTML Email
function generateEmailHtml({ title, recipientName, senderDept, bodyText, ticketNumber, category, rejectionReason, resolutionPhoto }) {
  const isReject = !!rejectionReason;
  const isResolve = !!resolutionPhoto || (bodyText && bodyText.includes('RESOLVED'));
  const accentColor = isReject ? '#dc2626' : isResolve ? '#059669' : '#2563eb';
  const badgeText = isReject ? '❌ GRIEVANCE REJECTED' : isResolve ? '✅ RESOLVED & VERIFIED' : '📋 GRIEVANCE REGISTERED';
  const subtitle = isReject 
    ? 'Official Rejection Notice & Department Remarks' 
    : isResolve 
    ? 'Maintenance Verification & Closure Notification' 
    : 'Automated Acknowledgment & Duty Dispatch';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Campus Maintenance Notification'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; background: ${accentColor}; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
    .title { font-size: 19px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px; }
    .subtitle { font-size: 12px; color: #94a3b8; margin: 0; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 15px; font-weight: 700; margin-bottom: 16px; color: #0f172a; }
    .body-box { background: #f8fafc; border-left: 4px solid ${accentColor}; padding: 18px; border-radius: 12px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin: 20px 0; color: #334155; }
    .meta-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin: 24px 0; }
    .photo-card { margin-top: 24px; text-align: center; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 14px; }
    .photo-card img { max-width: 100%; max-height: 320px; border-radius: 10px; object-fit: cover; border: 1px solid #6ee7b7; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">${badgeText}</div>
      <h1 class="title">RGUKT AP CAMPUS MAINTENANCE</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${recipientName || 'Campus Resident'},</div>
      <p style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0;">
        This email was dispatched by the <strong>${senderDept || 'Campus Maintenance Authority'}</strong> regarding Ticket <strong>#${ticketNumber}</strong>.
      </p>

      <div class="body-box">${bodyText}</div>

      <div class="meta-card">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 12px; font-weight: 600;">Ticket Reference:</td>
            <td style="padding: 6px 0; text-align: right; color: #0f172a; font-size: 12px; font-weight: 700; font-family: monospace;">${ticketNumber}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 12px; font-weight: 600;">Department:</td>
            <td style="padding: 6px 0; text-align: right; color: #0f172a; font-size: 12px; font-weight: 700;">${category || 'Estate Maintenance'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 12px; font-weight: 600;">Sender:</td>
            <td style="padding: 6px 0; text-align: right; color: #0f172a; font-size: 12px; font-weight: 700;">${senderDept}</td>
          </tr>
        </table>
      </div>

      ${resolutionPhoto ? `
        <div class="photo-card">
          <p style="margin: 0 0 12px 0; font-weight: 800; font-size: 12px; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">
            📸 On-Site Technician Fix Verification Photo
          </p>
          <img src="${resolutionPhoto}" alt="Fix Proof" />
        </div>
      ` : ''}

      <div style="margin-top: 28px; text-align: center;">
        <a href="http://localhost:5000" style="display: inline-block; background: #0f172a; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 13px; font-weight: 700;">
          View & Track on Campus Portal →
        </a>
      </div>
    </div>
    <div class="footer">
      <strong>Rajiv Gandhi University of Knowledge Technologies • Andhra Pradesh</strong><br/>
      Centralized Facility Management & Grievance Redressal System<br/>
      Official Campus Dispatch Gateway • Auto-generated notification
    </div>
  </div>
</body>
</html>
  `;
}

// Dispatches both internal log & real network email via Nodemailer
function sendDepartmentEmail({ from, fromName, to, toName, subject, body, ticketNumber, type, category, rejectionReason, resolutionPhoto }) {
  const mail = {
    id: `mail-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    from: from || 'portal@rgukt.ac.in',
    fromName: fromName || 'RGUKT Maintenance',
    to,
    toName: toName || 'Student / Resident',
    subject,
    body,
    ticketNumber,
    type,
    category,
    rejectionReason: rejectionReason || null,
    resolutionPhoto: resolutionPhoto || null,
    deliveryStatus: 'SENDING',
    previewUrl: null,
    messageId: null,
    time: new Date().toISOString()
  };

  EMAIL_LOG.unshift(mail);

  // Background dispatch
  (async () => {
    try {
      const transporter = await getTransporter();
      if (!transporter) {
        mail.deliveryStatus = 'ARCHIVED_ONLY';
        console.log(`[MAILER] Transporter not ready. Mail saved to internal archive for ${to}`);
        return;
      }

      const html = generateEmailHtml({
        title: subject,
        recipientName: toName,
        senderDept: fromName,
        bodyText: body,
        ticketNumber,
        category,
        rejectionReason,
        resolutionPhoto
      });

      const senderEmail = (SMTP_CONFIG.user && SMTP_CONFIG.pass)
        ? `"${fromName}" <${SMTP_CONFIG.user}>`
        : `"${fromName}" <${from || 'dispatcher@rgukt.ac.in'}>`;

      const info = await transporter.sendMail({
        from: senderEmail,
        to: to,
        subject: subject,
        text: body,
        html: html
      });

      mail.deliveryStatus = 'DELIVERED';
      mail.messageId = info.messageId;

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        mail.previewUrl = previewUrl;
        console.log(`📬 [LIVE TEST EMAIL PREVIEW]: ${previewUrl}`);
      }
      console.log(`✅ [MAIL DISPATCHED] To: ${to} | Subject: ${subject} | Delivery: ${mail.deliveryStatus}`);
    } catch (err) {
      mail.deliveryStatus = 'FAILED';
      mail.error = err.message;
      console.error(`❌ [MAIL DISPATCH ERROR] Failed sending to ${to}:`, err.message);
    }
  })();

  return mail;
}

function routeTicket(category, zone) {
  const map = {
    'Electrical': 'dept-elec',
    'Plumbing': 'dept-plumb',
    'IT Systems': 'dept-it',
    'IT & AV Systems': 'dept-it',
    'Housekeeping': 'dept-house',
    'Furniture & Civil': 'dept-civil',
    'Safety': 'dept-safety',
    'Safety & HVAC': 'dept-safety',
    'Internal Complaints Committee (ICC)': 'dept-icc',
    'ICC': 'dept-icc',
    'Internal Complaints': 'dept-icc'
  };
  const deptId = map[category] || (category.includes('ICC') ? 'dept-icc' : 'dept-elec');
  const candidateStaff = STAFF.filter(s => s.departmentId === deptId && s.isOnDuty);
  if (candidateStaff.length > 0) {
    candidateStaff.sort((a, b) => a.activeTickets - b.activeTickets);
    return candidateStaff[0];
  }
  return STAFF.find(s => s.departmentId === deptId) || STAFF[0];
}

// ==================== REST ENDPOINTS ====================

app.get('/api/locations', (req, res) => {
  res.json({ success: true, locations: LOCATIONS });
});

app.get('/api/locations/qr/:hash', (req, res) => {
  const loc = LOCATIONS.find(l => l.qrHash === req.params.hash);
  if (!loc) return res.status(404).json({ success: false, message: 'QR Code not mapped' });
  res.json({ success: true, location: loc });
});

app.get('/api/staff', (req, res) => {
  res.json({ success: true, staff: STAFF });
});

app.patch('/api/staff/:id/duty', (req, res) => {
  const staff = STAFF.find(s => s.id === req.params.id);
  if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
  staff.isOnDuty = req.body.isOnDuty !== undefined ? req.body.isOnDuty : !staff.isOnDuty;
  res.json({ success: true, staff });
});

app.get('/api/complaints', (req, res) => {
  const { status, category, reporterEmail } = req.query;
  let filtered = [...COMPLAINTS];
  if (status) filtered = filtered.filter(c => c.status === status);
  if (category) filtered = filtered.filter(c => c.category === category);
  if (reporterEmail) filtered = filtered.filter(c => c.reporterEmail === reporterEmail);
  res.json({ success: true, complaints: filtered });
});

app.post('/api/complaints', (req, res) => {
  const { 
    category, title, description, location, zone, priority, photos, 
    reporterName, reporterEmail, isIcc, committeeLevel, grievanceNature, 
    isConfidential, maskIdentity,
    matterType, domainType, concernedDept, specialDomain, smallCommitteeMembers, mediumCommitteeMembers,
    level3CommitteeMembers, involvesStudents
  } = req.body;

  if (!title || !category || !location) {
    return res.status(400).json({ success: false, message: 'Category, title, and location are required.' });
  }

  const isIccTicket = category === 'Internal Complaints Committee (ICC)' || Boolean(isIcc);
  const assigned = routeTicket(category, zone);
  if (assigned) assigned.activeTickets += 1;

  const slaMap = { 'EMERGENCY': 2, 'HIGH': 6, 'MEDIUM': 24, 'LOW': 48 };
  const slaHours = isIccTicket ? (priority === 'EMERGENCY' ? 24 : 48) : (slaMap[priority] || 24);

  const isSmallCommittee = isIccTicket && (committeeLevel && (committeeLevel.includes('Small') || committeeLevel.includes('Level 1') || committeeLevel.includes('3 Members') || committeeLevel.includes('3Members')));
  const isMediumCommittee = isIccTicket && (committeeLevel && committeeLevel.includes('Medium Committee'));
  const isLevel3Committee = isIccTicket && (committeeLevel && (committeeLevel.includes('Level 3') || committeeLevel.includes('Large') || committeeLevel.includes('Full')));
  const isHostelHierarchy = req.body.categoryType === 'HOSTEL_FACILITIES' || category === 'Hostel Maintenance & Facilities' || Boolean(req.body.isHostelHierarchy);

  const newTicket = {
    id: `cmp-${Date.now()}`,
    ticketNumber: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
    reporterName: maskIdentity ? 'Confidential Student (Identity Masked)' : (reporterName || 'Campus User'),
    reporterEmail: reporterEmail || 'student@rgukt.ac.in',
    reporterId: req.body.reporterId || req.body.studentId || null,
    studentId: req.body.studentId || req.body.reporterId || null,
    locationType: req.body.locationType || (isHostelHierarchy ? 'HOSTEL_DORM' : 'ACADEMICS'),
    block: req.body.block || null,
    floor: req.body.floor || null,
    room: req.body.room || null,
    category,
    isIcc: isIccTicket,
    categoryType: isHostelHierarchy ? 'HOSTEL_FACILITIES' : (isIccTicket ? 'ICC' : 'MAINTENANCE'),
    isHostelHierarchy: Boolean(isHostelHierarchy),
    currentHierarchyStage: isHostelHierarchy ? 'WARDEN' : null,
    currentHierarchyAuthority: isHostelHierarchy ? 'Hostel Resident Warden' : null,
    hierarchyLogs: isHostelHierarchy ? [] : null,
    lastAuthorityResponse: isHostelHierarchy ? null : null,
    lastAuthorityStage: isHostelHierarchy ? null : null,
    committeeLevel: isIccTicket ? (committeeLevel || 'Level 1: Small Committee (3 Members)') : null,
    grievanceNature: isIccTicket ? (grievanceNature || 'General Institutional Grievance') : null,
    isConfidential: isIccTicket ? (isConfidential !== undefined ? isConfidential : true) : false,
    maskIdentity: Boolean(maskIdentity),
    matterType: matterType || 'STUDENT',
    domainType: domainType || 'ACADEMIC',
    concernedDept: concernedDept || 'CSE',
    specialDomain: specialDomain || 'MESS',
    involvesStudents: involvesStudents !== undefined ? involvesStudents : true,
    smallCommitteeMembers: smallCommitteeMembers || null,
    mediumCommitteeMembers: mediumCommitteeMembers || null,
    level3CommitteeMembers: level3CommitteeMembers || null,
    sentToAllCommittees: isIccTicket ? true : false,
    triCommitteeStatus: isIccTicket ? (req.body.triCommitteeStatus || (req.body.allocatedCommittee ? 'DECIDED' : 'DECIDING')) : null,
    allocatedCommittee: isIccTicket ? (req.body.allocatedCommittee || null) : null,
    committeeDecision: isIccTicket && req.body.allocatedCommittee ? {
      status: 'DECIDED',
      decidedAt: new Date().toISOString(),
      decidedBy: 'Joint Tri-Committee Bench',
      committeeChosen: req.body.allocatedCommittee,
      rationale: 'Allocated by statutory bench'
    } : null,
    orderRef: isIccTicket ? 'RGUKT/RKV/Committee/ Reconstitution/Internal Complaints Committee' : null,
    orderDate: isIccTicket ? '11.08.2026' : null,
    chairperson: isIccTicket ? 'The Director, RGUKT RK Valley' : null,
    title,
    description: description || '',
    location,
    zone: zone || 'Academics',
    priority: priority || 'MEDIUM',
    status: assigned ? 'ASSIGNED' : 'SUBMITTED',
    assignedStaffId: assigned ? assigned.id : null,
    assignedStaffName: isHostelHierarchy
      ? 'Hostel Resident Warden Office'
      : (isIccTicket
        ? (req.body.allocatedCommittee 
            ? `Dr. Ratnakumari Challa & ${req.body.allocatedCommittee}`
            : 'Joint Tri-Committee Statutory Bench (Small, Medium & Full Committees - Deciding Allocation)')
        : (assigned ? assigned.name : 'Unassigned')),
    slaHours,
    slaDeadline: new Date(Date.now() + slaHours * 3600000).toISOString(),
    escalationLevel: 0,
    photos: photos || [],
    createdAt: new Date().toISOString(),
    adminVerified: false,
    triPartyThread: isIccTicket ? [
      {
        id: `msg-${Date.now()}`,
        senderRole: 'REPORTER',
        senderName: maskIdentity ? 'Confidential Student (Identity Masked)' : (reporterName || 'Student Resident'),
        message: `Formal Grievance Registered under ICC: "${title}". Nature: ${grievanceNature || 'General Institutional Grievance'}. ${description || ''}`.trim(),
        time: 'Just now',
        timestamp: new Date().toISOString()
      },
      {
        id: `msg-${Date.now() + 1}`,
        senderRole: 'ADMIN',
        senderName: 'The Chairperson (Director) & ICC Secretariat',
        message: `Grievance taken on record under Office Order dated 11.08.2026 and simultaneously dispatched to ALL THREE statutory committees: (1) Small Committee (3 Members), (2) Medium Committee (6 Members), and (3) Full ICC Committee (11 Members). Protective anti-retaliation injunction placed.`,
        time: 'Just now',
        timestamp: new Date().toISOString()
      },
      {
        id: `msg-${Date.now() + 2}`,
        senderRole: 'STAFF',
        senderName: 'Dr. Ratnakumari Challa (Presiding Officer)',
        message: `Joint Tri-Committee Bench convened. All three committees have received this complaint simultaneously and are reviewing it together to decide which committee is needed to solve it.`,
        time: 'Just now',
        timestamp: new Date().toISOString()
      }
    ] : (isHostelHierarchy ? [
      {
        id: `msg-${Date.now()}`,
        senderRole: 'REPORTER',
        senderName: reporterName || 'Student Resident',
        message: `Hostel Facility Issue reported: "${title}". Location: ${location}. Description: ${description || 'No extra notes.'}`,
        time: 'Just now',
        timestamp: new Date().toISOString()
      },
      {
        id: `msg-${Date.now() + 1}`,
        senderRole: 'ADMIN',
        senderName: 'Hostel Resident Warden Office',
        message: `Ticket registered under Stage 1 (Hostel Resident Warden). Inspecting site and determining on-the-spot redressal vs hierarchy escalation.`,
        time: 'Just now',
        timestamp: new Date().toISOString()
      }
    ] : [
      {
        id: `msg-${Date.now()}`,
        senderRole: 'REPORTER',
        senderName: reporterName || 'Student Resident',
        message: `Issue reported: ${title}. ${description || ''}`.trim(),
        time: 'Just now',
        timestamp: new Date().toISOString()
      },
      {
        id: `msg-${Date.now() + 1}`,
        senderRole: 'ADMIN',
        senderName: 'Campus Dispatch & SLA Control',
        message: `Auto-routed to ${assigned ? assigned.name : 'Duty Dispatcher'} (${category} Dept). Target SLA: ${slaHours}h.`,
        time: 'Just now',
        timestamp: new Date().toISOString()
      }
    ]),
    timeline: isIccTicket ? [
      { status: 'SUBMITTED', title: 'Formal Dossier Registered with ICC Secretariat', actor: maskIdentity ? 'Confidential Student' : (reporterName || 'Student Resident'), time: 'Just now', done: true },
      { status: 'TRI_COMMITTEE_DISPATCH', title: 'Simultaneously Dispatched to All 3 Committees (Small 3-M, Medium 6-M, Full ICC 11-M)', actor: 'The Director & Presiding Officer', time: 'Just now', done: true },
      { status: 'COMMITTEE_ALLOCATION', title: req.body.allocatedCommittee ? `Tri-Committee Bench Designated: ${req.body.allocatedCommittee}` : 'Tri-Committee Deliberation: Deciding Which Committee Will Solve Problem', actor: 'Joint Tri-Committee Bench', time: req.body.allocatedCommittee ? 'Decided' : 'In Progress', done: Boolean(req.body.allocatedCommittee) },
      { status: 'IN_PROGRESS', title: 'Designated Committee Quasi-Judicial In-Camera Inquiry', actor: 'Designated Committee Bench', time: 'Pending', done: false },
      { status: 'RESOLVED', title: 'Inquiry Findings & Recommendation Report Promulgated', actor: 'Designated Committee', time: 'Pending', done: false },
      { status: 'CLOSED', title: 'Final Executive Disposal by Chairperson (The Director)', actor: 'The Director, RGUKT RK Valley', time: 'Pending', done: false }
    ] : (isHostelHierarchy ? [
      { status: 'SUBMITTED', title: 'Complaint Lodged in Hostel Maintenance & Facilities', actor: 'Student Resident', time: 'Just now', done: true },
      { status: 'ASSIGNED', title: 'Assigned to Hostel Resident Warden (Stop/Resolve based on severity)', actor: 'Hostel Resident Warden', time: 'Just now', done: true },
      { status: 'IN_PROGRESS', title: 'Warden On-Site Inspection & Problem Appraisal', actor: 'Warden Office', time: 'Pending', done: false },
      { status: 'RESOLVED', title: 'Resolved at Warden stage OR Tagged & Escalated up Hierarchy', actor: 'Warden / DSW / AO / Director', time: 'Pending', done: false },
      { status: 'CLOSED', title: 'Final Resolution Approved & Quality Verified', actor: 'Campus Authorities & Student', time: 'Pending', done: false }
    ] : [
      { status: 'SUBMITTED', title: 'Complaint Logged via Web/Mobile', actor: 'Reporter', time: 'Just now', done: true },
      { status: 'ASSIGNED', title: `Auto-routed to ${assigned ? assigned.name : 'Duty Dispatcher'}`, actor: 'Auto-Router', time: 'Just now', done: true },
      { status: 'IN_PROGRESS', title: 'Technician on-site inspection', actor: 'Staff', time: 'Pending', done: false },
      { status: 'RESOLVED', title: 'Fix completed & evidence uploaded', actor: 'Staff', time: 'Pending', done: false },
      { status: 'CLOSED', title: 'Closed & verified by reporter', actor: 'Reporter', time: 'Pending', done: false },
    ])
  };

  COMPLAINTS.unshift(newTicket);

  const deptMap = {
    'Electrical': 'dept-elec',
    'Plumbing': 'dept-plumb',
    'IT Systems': 'dept-it',
    'IT & AV Systems': 'dept-it',
    'Housekeeping': 'dept-house',
    'Furniture & Civil': 'dept-civil',
    'Safety': 'dept-safety',
    'Safety & HVAC': 'dept-safety',
    'Internal Complaints Committee (ICC)': 'dept-icc',
    'ICC': 'dept-icc'
  };
  const dept = DEPARTMENTS.find(d => d.id === (deptMap[newTicket.category] || (isIccTicket ? 'dept-icc' : 'dept-elec'))) || DEPARTMENTS[0];

  // 1. Dispatch Email to Respective Department
  sendDepartmentEmail({
    from: 'portal@rgukt.ac.in',
    fromName: 'RGUKT Maintenance Dispatcher',
    to: dept.contactEmail,
    toName: dept.name,
    subject: `🚨 [NEW TICKET #${newTicket.ticketNumber}] ${newTicket.priority} Priority: ${newTicket.category} at ${newTicket.location}`,
    ticketNumber: newTicket.ticketNumber,
    type: 'DISPATCH_TO_DEPT',
    category: newTicket.category,
    body: `NEW GRIEVANCE NOTIFICATION FOR ${dept.name.toUpperCase()}\n\nTicket Number: ${newTicket.ticketNumber}\nCategory: ${newTicket.category}\nLocation: ${newTicket.location}\nPriority: ${newTicket.priority} (Target SLA: ${newTicket.slaHours} hours)\nReporter: ${newTicket.reporterName} (${newTicket.reporterEmail})\n\nProblem Summary:\n"${newTicket.title}"\n\nFull Description:\n${newTicket.description}\n\nAuto-assigned Technician: ${assigned ? assigned.name : 'Duty Dispatcher'}\n\nPlease dispatch technician or inspect immediately.`
  });

  // 2. Dispatch Email from Respective Department to Reporter
  sendDepartmentEmail({
    from: dept.contactEmail,
    fromName: `${dept.name} (RGUKT AP)`,
    to: newTicket.reporterEmail,
    toName: newTicket.reporterName,
    subject: `📋 [TICKET LOGGED #${newTicket.ticketNumber}] Grievance Registered with ${dept.name}`,
    ticketNumber: newTicket.ticketNumber,
    type: 'REPORTER_ACK',
    category: newTicket.category,
    body: `Dear ${newTicket.reporterName},\n\nYour maintenance complaint regarding "${newTicket.title}" at ${newTicket.location} has been registered with the ${dept.name}.\n\nTicket Reference: ${newTicket.ticketNumber}\nAssigned Technician: ${assigned ? assigned.name : 'Duty Dispatcher'}\nTarget SLA Resolution Window: ${newTicket.slaHours} Hours.\n\nYou will receive email updates as your complaint is inspected and resolved.`
  });

  NOTIFICATION_LOG.unshift({
    id: uuidv4(),
    recipient: dept.name,
    channel: 'EMAIL + PUSH',
    title: `🛠️ New Ticket #${newTicket.ticketNumber} Dispatched to ${dept.name}`,
    body: `[${newTicket.priority}] ${newTicket.category} at ${newTicket.location}. Emailed to ${dept.contactEmail}`,
    time: new Date().toISOString()
  });

  NOTIFICATION_LOG.unshift({
    id: uuidv4(),
    recipient: newTicket.reporterName,
    channel: 'EMAIL + IN_APP',
    title: `📋 Complaint Registered #${newTicket.ticketNumber}`,
    body: `Received by ${dept.name}. Acknowledgment email sent to ${newTicket.reporterEmail}`,
    time: new Date().toISOString()
  });

  res.status(201).json({ success: true, complaint: newTicket });
});

app.delete('/api/complaints/:id', (req, res) => {
  const index = COMPLAINTS.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    const deleted = COMPLAINTS.splice(index, 1);
    return res.json({ success: true, deleted: deleted[0] });
  }
  res.status(404).json({ success: false, message: 'Complaint not found' });
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { status, resolutionNotes, resolutionPhoto, spareParts } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  complaint.status = status;

  if (status === 'IN_PROGRESS') {
    complaint.timeline[2].done = true;
    complaint.timeline[2].time = 'Just now';
  } else if (status === 'RESOLVED') {
    complaint.timeline[3].done = true;
    complaint.timeline[3].time = 'Just now';
    complaint.resolutionNotes = resolutionNotes || 'Repairs finished and functionality verified.';
    if (resolutionPhoto) complaint.resolutionPhoto = resolutionPhoto;
    if (spareParts) complaint.spareParts = spareParts;
    complaint.resolvedAt = new Date().toISOString();

    const staff = STAFF.find(s => s.id === complaint.assignedStaffId);
    if (staff && staff.activeTickets > 0) staff.activeTickets -= 1;
    if (staff) staff.resolvedMonth += 1;

    const deptMap = {
      'Electrical': 'dept-elec',
      'Plumbing': 'dept-plumb',
      'IT Systems': 'dept-it',
      'IT & AV Systems': 'dept-it',
      'Housekeeping': 'dept-house',
      'Furniture & Civil': 'dept-civil',
      'Safety': 'dept-safety',
      'Safety & HVAC': 'dept-safety'
    };
    const dept = DEPARTMENTS.find(d => d.id === (deptMap[complaint.category] || 'dept-elec')) || DEPARTMENTS[0];

    // Send resolution email from respective department to reporter
    const partsText = complaint.spareParts ? `\n\nPARTS / MATERIALS REPLACED:\n• ${complaint.spareParts}` : '';
    const proofText = complaint.resolutionPhoto ? `\n\nWORK PROOF:\nTechnician has uploaded on-site repair verification photo.` : '';
    sendDepartmentEmail({
      from: dept.contactEmail,
      fromName: `${dept.name} (RGUKT AP)`,
      to: complaint.reporterEmail,
      toName: complaint.reporterName,
      subject: `🎉 [TICKET RESOLVED #${complaint.ticketNumber}] Service Completed at ${complaint.location}`,
      ticketNumber: complaint.ticketNumber,
      type: 'RESOLVED_NOTICE',
      category: complaint.category,
      resolutionPhoto: complaint.resolutionPhoto,
      body: `Dear ${complaint.reporterName},\n\nWe are pleased to inform you that the grievance reported under #${complaint.ticketNumber} for "${complaint.title}" at ${complaint.location} has been addressed by technician ${staff ? staff.name : 'Maintenance Staff'}.\n\nTECHNICIAN RESOLUTION SUMMARY:\n"${complaint.resolutionNotes}"${partsText}${proofText}\n\nPlease visit the campus portal to inspect the site and confirm closure or submit your feedback.`
    });

    NOTIFICATION_LOG.unshift({
      id: uuidv4(),
      recipient: complaint.reporterName,
      channel: 'EMAIL + IN_APP',
      title: `✅ Ticket #${complaint.ticketNumber} Resolved by ${dept.name}`,
      body: `Technician ${staff ? staff.name : 'Staff'} completed repairs. Resolution email sent to ${complaint.reporterEmail}`,
      time: new Date().toISOString()
    });
  } else if (status === 'CLOSED') {
    complaint.timeline[4].done = true;
    complaint.timeline[4].time = 'Just now';
    complaint.closedAt = new Date().toISOString();
  }

  res.json({ success: true, complaint });
});

// Reject Complaint Endpoint with Mandatory Reason & Explanation
app.post('/api/complaints/:id/reject', (req, res) => {
  const { rejectionReason, rejectionNotes } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  if (!rejectionReason) {
    return res.status(400).json({ success: false, message: 'Rejection reason is mandatory.' });
  }

  complaint.status = 'REJECTED';
  complaint.rejectionReason = rejectionReason;
  complaint.rejectionNotes = rejectionNotes || 'No additional remarks provided.';
  complaint.rejectedAt = new Date().toISOString();

  // Free staff load
  const staff = STAFF.find(s => s.id === complaint.assignedStaffId);
  if (staff && staff.activeTickets > 0) staff.activeTickets -= 1;

  // Add rejection step to timeline
  complaint.timeline.push({
    status: 'REJECTED',
    title: `Complaint Rejected: ${rejectionReason}`,
    actor: staff ? `${staff.name} (${staff.trade})` : 'Department Head',
    time: 'Just now',
    done: true
  });

  const deptMap = {
    'Electrical': 'dept-elec',
    'Plumbing': 'dept-plumb',
    'IT Systems': 'dept-it',
    'IT & AV Systems': 'dept-it',
    'Housekeeping': 'dept-house',
    'Furniture & Civil': 'dept-civil',
    'Safety': 'dept-safety',
    'Safety & HVAC': 'dept-safety'
  };
  const dept = DEPARTMENTS.find(d => d.id === (deptMap[complaint.category] || 'dept-elec')) || DEPARTMENTS[0];

  // Send formal rejection email from respective department to reporter explaining WHY
  const mail = sendDepartmentEmail({
    from: dept.contactEmail,
    fromName: `${dept.name} (RGUKT AP)`,
    to: complaint.reporterEmail,
    toName: complaint.reporterName,
    subject: `❌ [TICKET REJECTED #${complaint.ticketNumber}] Status: Not Actionable - ${rejectionReason}`,
    ticketNumber: complaint.ticketNumber,
    type: 'REJECTION_NOTICE',
    category: complaint.category,
    rejectionReason: rejectionReason,
    body: `Dear ${complaint.reporterName},\n\nYour complaint #${complaint.ticketNumber} regarding "${complaint.title}" at ${complaint.location} has been reviewed and REJECTED by ${dept.name}.\n\nPRIMARY REASON FOR REJECTION:\n👉 ${rejectionReason}\n\nDEPARTMENT REMARKS / EXPLANATION:\n"${complaint.rejectionNotes}"\n\nIf you believe this decision was made in error or if you have additional supporting details, please reply to this email or contact ${dept.contactEmail}.`
  });

  NOTIFICATION_LOG.unshift({
    id: uuidv4(),
    recipient: complaint.reporterName,
    channel: 'EMAIL + IN_APP',
    title: `❌ Ticket #${complaint.ticketNumber} Rejected by ${dept.name}`,
    body: `Reason: ${rejectionReason}. Detailed explanation emailed to ${complaint.reporterEmail}`,
    time: new Date().toISOString()
  });

  res.json({ success: true, complaint, mail });
});

app.get('/api/emails', (req, res) => {
  const { ticketNumber, recipient } = req.query;
  let filtered = [...EMAIL_LOG];
  if (ticketNumber) filtered = filtered.filter(m => m.ticketNumber === ticketNumber);
  if (recipient) filtered = filtered.filter(m => m.to.toLowerCase().includes(recipient.toLowerCase()) || m.from.toLowerCase().includes(recipient.toLowerCase()));
  res.json({ success: true, emails: filtered });
});

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications: NOTIFICATION_LOG });
});

app.post('/api/complaints/:id/feedback', (req, res) => {
  const { rating, feedbackTags, comments } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  complaint.status = 'CLOSED';
  complaint.closedAt = new Date().toISOString();
  complaint.timeline[4].done = true;
  complaint.timeline[4].time = 'Just now';

  const record = {
    id: uuidv4(),
    complaintId: complaint.id,
    staffId: complaint.assignedStaffId,
    rating: Number(rating) || 5,
    feedbackTags: feedbackTags || [],
    comments: comments || '',
    createdAt: new Date().toISOString()
  };
  FEEDBACKS.push(record);

  const staff = STAFF.find(s => s.id === complaint.assignedStaffId);
  if (staff) {
    const staffFeedbacks = FEEDBACKS.filter(f => f.staffId === staff.id);
    const totalStars = staffFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    staff.csat = parseFloat((totalStars / staffFeedbacks.length).toFixed(2));
  }

  res.json({ success: true, message: 'Feedback recorded successfully.', feedback: record });
});

app.post('/api/complaints/:id/reopen', (req, res) => {
  const { reopenReason, reopenComment } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  complaint.status = 'REOPENED';
  complaint.priority = 'HIGH';
  complaint.escalationLevel += 1;
  
  complaint.timeline[3].done = false;
  complaint.timeline[4].done = false;
  complaint.reopenReason = reopenReason;
  complaint.reopenComment = reopenComment;

  const staff = STAFF.find(s => s.id === complaint.assignedStaffId);
  if (staff) {
    staff.activeTickets += 1;
    if (staff.ftfr > 70) staff.ftfr = Math.max(60, staff.ftfr - 5);
  }

  NOTIFICATION_LOG.push({
    id: uuidv4(),
    recipient: 'Facilities Supervisor',
    channel: 'HIGH PRIORITY PUSH & EMAIL',
    title: `🚨 TICKET REOPENED: #${complaint.ticketNumber}`,
    body: `Reporter rejected resolution. Reason: ${reopenReason}. Escalated to High Priority.`,
    time: new Date().toISOString()
  });

  res.json({ success: true, message: 'Ticket reopened and escalated.', complaint });
});

// Transparent Tri-Party Communication Thread Endpoint
app.post('/api/complaints/:id/thread', (req, res) => {
  const { senderRole, senderName, message } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
  }

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  const newMsg = {
    id: `msg-${Date.now()}`,
    senderRole: senderRole || 'REPORTER',
    senderName: senderName || 'Campus User',
    message: message.trim(),
    time: 'Just now',
    timestamp: new Date().toISOString()
  };
  complaint.triPartyThread.push(newMsg);

  // Transparently append to timeline
  complaint.timeline.push({
    status: 'COMMUNICATION',
    title: `Transparent Update from ${senderRole}`,
    actor: senderName || senderRole,
    time: 'Just now',
    done: true
  });

  res.json({ success: true, complaint, newMsg });
});

// Transparent Campus Admin Quality & Fix Proof Verification Endpoint
app.post('/api/complaints/:id/admin-verify', (req, res) => {
  const { verifiedBy, adminRemark } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  complaint.adminVerified = true;
  complaint.adminVerifiedBy = verifiedBy || 'Chief Warden & Estate Office';
  complaint.adminVerifiedAt = new Date().toISOString();
  complaint.adminRemark = adminRemark || 'Fix proof and on-site repair inspected and approved.';

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  complaint.triPartyThread.push({
    id: `msg-${Date.now()}`,
    senderRole: 'ADMIN',
    senderName: complaint.adminVerifiedBy,
    message: `✅ Fix Proof Officially Inspected & Verified: "${complaint.adminRemark}"`,
    time: 'Just now',
    timestamp: new Date().toISOString()
  });

  complaint.timeline.push({
    status: 'ADMIN_VERIFIED',
    title: 'Fix Proof Approved by Campus Admin',
    actor: complaint.adminVerifiedBy,
    time: 'Just now',
    done: true
  });

  res.json({ success: true, complaint });
});

// Chairperson Executive Disposal Order Promulgation Endpoint for Level 2 Medium Committee
app.post('/api/complaints/:id/icc-disposal', (req, res) => {
  const { decision, note, approvedBy } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  const directorName = approvedBy || 'The Director, RGUKT RK Valley';
  complaint.status = 'RESOLVED';
  complaint.adminVerified = true;
  complaint.disposalDecision = decision || 'APPROVED_WITH_RECOMMENDED_ACTION';
  complaint.disposalNote = note || 'Inquiry findings examined and approved for executive implementation under Office Order dated 11.08.2026.';
  complaint.disposedAt = new Date().toISOString();
  complaint.disposedBy = directorName;

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  complaint.triPartyThread.push({
    id: `msg-${Date.now()}`,
    senderRole: 'ADMIN',
    senderName: `${directorName} (Chairperson)`,
    message: `⚖️ Official University Disposal Order Promulgated: "${complaint.disposalNote}". Decision: ${complaint.disposalDecision}.`,
    time: 'Just now',
    timestamp: new Date().toISOString()
  });

  // Mark pending timeline items
  if (Array.isArray(complaint.timeline)) {
    complaint.timeline.forEach(step => {
      if (step.status === 'RESOLVED' || step.title.includes('Findings') || step.title.includes('Disposal')) {
        step.done = true;
      }
    });
  }

  complaint.timeline.push({
    status: 'CLOSED',
    title: 'Disposal Order Executed & Enforced',
    actor: directorName,
    time: 'Just now',
    done: true
  });

  res.json({ success: true, complaint });
});

// Tri-Committee Joint Decision: Allocates which of the 3 committees will solve the complaint
app.post('/api/complaints/:id/icc-allocate-committee', (req, res) => {
  const { chosenCommittee, rationale, decidedBy } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
  if (!chosenCommittee) {
    return res.status(400).json({ success: false, message: 'chosenCommittee is required.' });
  }

  const decisionMaker = decidedBy || 'Joint Tri-Committee Bench';
  complaint.triCommitteeStatus = 'DECIDED';
  complaint.allocatedCommittee = chosenCommittee;
  complaint.committeeLevel = chosenCommittee;
  complaint.committeeDecision = {
    status: 'DECIDED',
    decidedAt: new Date().toISOString(),
    decidedBy: decisionMaker,
    committeeChosen: chosenCommittee,
    rationale: rationale || `Tri-committee joint bench allocated problem to ${chosenCommittee}.`
  };

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  complaint.triPartyThread.push({
    id: `msg-${Date.now()}`,
    senderRole: 'ADMIN',
    senderName: decisionMaker,
    message: `⚖️ Tri-Committee Joint Bench Decision Promulgated: The three statutory committees have reviewed this grievance and designated ${chosenCommittee} to solve it. Rationale: "${complaint.committeeDecision.rationale}".`,
    time: 'Just now',
    timestamp: new Date().toISOString()
  });

  if (Array.isArray(complaint.timeline)) {
    complaint.timeline = complaint.timeline.map(t => 
      t.status === 'COMMITTEE_ALLOCATION' ? { ...t, done: true, time: 'Decided' } : t
    );
    complaint.timeline.push({
      status: 'COMMITTEE_ALLOCATED',
      title: `Tri-Committee Bench Designated: ${chosenCommittee}`,
      actor: decisionMaker,
      time: 'Just now',
      done: true
    });
  }

  // Update assigned staff according to chosen committee tier
  if (chosenCommittee.includes('Small') || chosenCommittee.includes('Level 1') || chosenCommittee.includes('3 Members')) {
    complaint.assignedStaffName = 'Dr. Ratnakumari Challa & Small Committee Bench (3 Members)';
  } else if (chosenCommittee.includes('Medium') || chosenCommittee.includes('Level 2') || chosenCommittee.includes('6 Members')) {
    complaint.assignedStaffName = 'Dr. Ratnakumari Challa & Medium Committee Bench (6 Members)';
  } else {
    complaint.assignedStaffName = 'Full ICC Committee Quorum (11 Members) & Presiding Officer';
  }

  res.json({ success: true, complaint });
});

// Hostel Facilities Hierarchy: Record Authority Response
app.post('/api/complaints/:id/hierarchy-response', (req, res) => {
  const { response, authorityStage } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
  if (!response || !response.trim()) {
    return res.status(400).json({ success: false, message: 'Response cannot be empty.' });
  }

  complaint.lastAuthorityResponse = response.trim();
  complaint.lastAuthorityStage = authorityStage || complaint.currentHierarchyStage || 'Warden';
  complaint.lastResponseAt = new Date().toISOString();

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  complaint.triPartyThread.push({
    id: `msg-${Date.now()}`,
    senderRole: 'ADMIN',
    senderName: `${complaint.lastAuthorityStage} Authority`,
    message: `📝 Official Response: "${response.trim()}"`,
    time: 'Just now',
    timestamp: new Date().toISOString()
  });

  if (!complaint.timeline) complaint.timeline = [];
  complaint.timeline.push({
    status: 'IN_PROGRESS',
    title: `Official Response from ${complaint.lastAuthorityStage}`,
    actor: complaint.lastAuthorityStage,
    time: 'Just now',
    done: true
  });

  res.json({ success: true, complaint });
});

// Hostel Facilities Hierarchy: Tag & Escalate to next hierarchy stage
app.post('/api/complaints/:id/hierarchy-escalate', (req, res) => {
  const { fromStage, toStage, toStageKey, targetDepartment, reason, customOtherReason, taggedPriorResponse, studentRemarks } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  complaint.currentHierarchyStage = toStageKey || 'DSW_DEPT';
  complaint.currentHierarchyAuthority = toStage || (targetDepartment ? `DSW & ${targetDepartment}` : 'DSW & Respective Departments');
  complaint.assignedStaffName = targetDepartment ? `Dean Student Welfare & ${targetDepartment}` : `Office of ${toStage}`;
  if (targetDepartment) {
    complaint.concernedDept = targetDepartment;
  }

  if (!complaint.hierarchyLogs) complaint.hierarchyLogs = [];
  const logEntry = {
    id: `esc-${Date.now()}`,
    fromStage: fromStage || 'Warden',
    toStage: toStage || 'DSW & Dept',
    toStageKey: toStageKey || 'DSW_DEPT',
    reason: reason || 'Not resolved in previous stage',
    customOtherReason: customOtherReason || null,
    taggedPriorResponse: taggedPriorResponse || complaint.lastAuthorityResponse || 'Awaiting effective on-site completion',
    studentRemarks: studentRemarks || null,
    timestamp: new Date().toISOString()
  };
  complaint.hierarchyLogs.push(logEntry);

  if (!complaint.triPartyThread) complaint.triPartyThread = [];
  complaint.triPartyThread.push({
    id: `msg-${Date.now()}`,
    senderRole: 'REPORTER',
    senderName: complaint.reporterName || 'Student Resident',
    message: `🚀 Tagged & Escalated to ${toStage}: Reason: "${logEntry.reason}". Attached Prior Response from ${fromStage}: "${logEntry.taggedPriorResponse}"`,
    time: 'Just now',
    timestamp: new Date().toISOString()
  });

  if (!complaint.timeline) complaint.timeline = [];
  complaint.timeline.push({
    status: 'ASSIGNED',
    title: `Tagged to ${toStage} with ${fromStage}'s Response`,
    actor: complaint.reporterName || 'Student Resident',
    time: 'Just now',
    done: true
  });

  NOTIFICATION_LOG.push({
    id: uuidv4(),
    recipient: toStage,
    channel: 'HIGH PRIORITY ESCALATION',
    title: `🚨 HIERARCHY ESCALATION: #${complaint.ticketNumber} ➔ ${toStage}`,
    body: `Tagged from ${fromStage}. Reason: ${logEntry.reason}. Tagged Response: "${logEntry.taggedPriorResponse}"`,
    time: new Date().toISOString()
  });

  res.json({ success: true, complaint, log: logEntry });
});

app.post('/api/simulate-sla-breach', (req, res) => {
  const { complaintId } = req.body;
  const complaint = COMPLAINTS.find(c => c.id === complaintId) || COMPLAINTS[0];

  if (!complaint) return res.status(404).json({ success: false, message: 'No complaint available to simulate' });

  complaint.escalationLevel += 1;
  complaint.priority = 'EMERGENCY';

  NOTIFICATION_LOG.push({
    id: uuidv4(),
    recipient: 'Campus Estate Registrar & Head of Facilities',
    channel: 'SMS + APNs/FCM + EMAIL ALERT',
    title: `🔥 CRITICAL SLA BREACH: #${complaint.ticketNumber}`,
    body: `Ticket at ${complaint.location} unresolved past 48 hours SLA! Level ${complaint.escalationLevel} escalation active.`,
    time: new Date().toISOString()
  });

  res.json({ success: true, message: 'SLA breach triggered and escalated.', complaint, notification: NOTIFICATION_LOG[NOTIFICATION_LOG.length - 1] });
});

app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    kpis: {
      totalComplaints: COMPLAINTS.length + 1420,
      averageMttr: '18.4 hrs',
      slaComplianceRate: '94.2%',
      criticalBacklog: COMPLAINTS.filter(c => c.priority === 'EMERGENCY').length + 2
    },
    heatmap: {
      locations: ['AB-1', 'AB-2', 'PENNA (BH-1)', 'PAPAGNI (BH-2)', 'KUNDU {GH-1}', 'OLD CAMPUS'],
      categories: ['Electrical', 'Plumbing', 'IT / AV', 'Civil/Furn', 'Housekeeping'],
      matrix: {
        'AB-1':            { Electrical: 48, Plumbing: 14, 'IT / AV': 72, 'Civil/Furn': 18, Housekeeping: 12 },
        'AB-2':            { Electrical: 35, Plumbing: 22, 'IT / AV': 41, 'Civil/Furn': 25, Housekeeping: 14 },
        'PENNA (BH-1)':    { Electrical: 32, Plumbing: 78, 'IT / AV': 12, 'Civil/Furn': 28, Housekeeping: 24 },
        'PAPAGNI (BH-2)':  { Electrical: 29, Plumbing: 82, 'IT / AV': 10, 'Civil/Furn': 30, Housekeeping: 26 },
        'KUNDU {GH-1}':    { Electrical: 24, Plumbing: 65, 'IT / AV': 15, 'Civil/Furn': 21, Housekeeping: 31 },
        'OLD CAMPUS':      { Electrical: 42, Plumbing: 51, 'IT / AV': 18, 'Civil/Furn': 38, Housekeeping: 28 },
      }
    },
    notifications: NOTIFICATION_LOG.slice(-6).reverse()
  });
});

// ==================== SMTP & EMAIL SETTINGS ENDPOINTS ====================
app.get('/api/smtp-config', (req, res) => {
  res.json({
    success: true,
    config: {
      enabled: SMTP_CONFIG.enabled,
      service: SMTP_CONFIG.service,
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      user: SMTP_CONFIG.user ? SMTP_CONFIG.user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '',
      rawUser: SMTP_CONFIG.user || '',
      hasPassword: !!SMTP_CONFIG.pass,
      senderName: SMTP_CONFIG.senderName,
      testMode: SMTP_CONFIG.testMode,
      activeTransporter: !!(SMTP_CONFIG.user && SMTP_CONFIG.pass) ? 'REAL_SMTP' : (etherealAccount ? 'ETHEREAL_TEST' : 'SIMULATION')
    }
  });
});

app.post('/api/smtp-config', async (req, res) => {
  try {
    const { service, host, port, secure, user, pass, senderName, enabled } = req.body;
    SMTP_CONFIG.service = service || 'gmail';
    SMTP_CONFIG.host = host || 'smtp.gmail.com';
    SMTP_CONFIG.port = parseInt(port, 10) || 587;
    SMTP_CONFIG.secure = !!secure;
    SMTP_CONFIG.user = (user || '').trim();
    if (pass !== undefined && pass !== '') {
      SMTP_CONFIG.pass = (pass || '').trim();
    }
    SMTP_CONFIG.senderName = (senderName || 'RGUKT AP Maintenance Dispatcher').trim();
    SMTP_CONFIG.enabled = enabled !== undefined ? !!enabled : true;
    SMTP_CONFIG.testMode = !(SMTP_CONFIG.user && SMTP_CONFIG.pass);

    saveSmtpConfig();

    if (SMTP_CONFIG.user && SMTP_CONFIG.pass) {
      const testTransporter = await getTransporter();
      await testTransporter.verify();
    }

    res.json({
      success: true,
      message: 'SMTP credentials verified and saved successfully! Real emails will now be delivered to student inboxes.',
      config: {
        service: SMTP_CONFIG.service,
        user: SMTP_CONFIG.user,
        enabled: SMTP_CONFIG.enabled
      }
    });
  } catch (err) {
    console.error('SMTP Verification Error:', err.message);
    res.status(400).json({
      success: false,
      message: `Failed to connect to SMTP server: ${err.message}. If using Gmail, make sure to use a 16-character Google App Password.`
    });
  }
});

app.post('/api/send-test-email', async (req, res) => {
  const { recipientEmail, recipientName } = req.body;
  const targetEmail = recipientEmail || 'student@rgukt.ac.in';
  const targetName = recipientName || 'Campus Student';

  try {
    const testMail = sendDepartmentEmail({
      from: 'portal@rgukt.ac.in',
      fromName: 'RGUKT Central Maintenance Dispatcher',
      to: targetEmail,
      toName: targetName,
      subject: `🧪 [TEST DISPATCH] Verification Email from RGUKT Campus Maintenance`,
      ticketNumber: 'TEST-VERIFY-001',
      type: 'REPORTER_ACK',
      category: 'System Diagnostics',
      body: `Hello ${targetName},\n\nThis is a verification test email confirming that the Automated Grievance Email Gateway is online and configured to deliver notifications directly to your email address (${targetEmail}).\n\nYou will receive timely alerts when your complaints are registered, assigned to technicians, inspected, and resolved!`
    });

    res.json({
      success: true,
      message: `Verification email dispatched to ${targetEmail}!`,
      mail: testMail
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/send-otp-email', async (req, res) => {
  const { recipientEmail, recipientName, otp } = req.body;
  if (!recipientEmail || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const targetEmail = recipientEmail.toLowerCase().trim();
  const targetName = recipientName || 'Campus Student';

  try {
    const otpMail = sendDepartmentEmail({
      from: 'portal@rgukt.ac.in',
      fromName: 'RGUKT RK Valley Security Desk',
      to: targetEmail,
      toName: targetName,
      subject: `🔐 [RGUKT OTP] Your One-Time Password: ${otp}`,
      ticketNumber: 'AUTH-OTP',
      type: 'REPORTER_ACK',
      category: 'Security & Auth',
      body: `Hello ${targetName},\n\nYour One-Time Password (OTP) for the RGUKT Internal Complaint System is:\n\n👉  ${otp}  👈\n\nThis OTP is confidential and expires in 10 minutes. Please enter this code on the application verification screen to verify your email address.\n\nIf you did not request this OTP, please contact campus security immediately.\n\nWarm regards,\nRGUKT RK Valley Maintenance & Security Office`
    });

    NOTIFICATION_LOG.unshift({
      id: uuidv4(),
      recipient: targetName,
      channel: 'EMAIL OTP',
      title: `🔐 OTP Sent to ${targetEmail}`,
      body: `One-Time Password code dispatched for email verification.`,
      time: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `OTP dispatched to ${targetEmail}`,
      mail: otpMail
    });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/student-emails/:email', (req, res) => {
  const studentEmail = (req.params.email || '').toLowerCase().trim();
  const matched = EMAIL_LOG.filter(m => m.to && m.to.toLowerCase().trim() === studentEmail);
  res.json({ success: true, emails: matched });
});

app.listen(PORT, () => {
  console.log(`Campus Maintenance Backend API running on port ${PORT}`);
});
