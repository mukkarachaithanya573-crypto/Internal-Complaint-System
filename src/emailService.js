import emailjs from '@emailjs/browser';

// Official EmailJS Configuration provided by user
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: '51oMyQ381CWezzwtz',
  SERVICE_ID: 'service_eobhqld',
  TEMPLATES: {
    USER_NOTIFICATION: 'template_9djhg3n',
    AUTHORITY_NOTIFICATION: 'template_rq4dnge',
    OTP_VERIFICATION: 'template_cjeu2jp'
  }
};

// Initialize EmailJS
if (typeof window !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY) {
  try {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    console.log('📧 EmailJS initialized successfully with Public Key.');
  } catch (err) {
    console.warn('EmailJS initialization note:', err);
  }
}

/**
 * Official Designated Email Contacts for Campus Authorities & Hierarchy Tiers
 */
export const HIERARCHY_OFFICERS = {
  WARDEN: {
    name: 'Hostel Resident Warden',
    email: 'warden.hostels@rguktrkv.ac.in',
    designation: 'Hostel Resident Warden Office',
    levelTitle: 'Stage 1: Hostel Resident Warden'
  },
  DSW_DEPT: {
    name: 'Dean Student Welfare (DSW) & Estate Engineers',
    email: 'dsw@rguktrkv.ac.in',
    designation: 'Office of Dean Student Welfare',
    levelTitle: 'Stage 2: DSW & Respective Maintenance Department'
  },
  AO: {
    name: 'Administrative Officer (AO)',
    email: 'ao@rguktrkv.ac.in',
    designation: 'Office of The Administrative Officer',
    levelTitle: 'Stage 3: Administrative Officer'
  },
  DIRECTOR: {
    name: 'The Director, RGUKT RK Valley',
    email: 'director@rguktrkv.ac.in',
    designation: 'Apex Executive Office of The Director',
    levelTitle: 'Stage 4: The Director (Apex Authority)'
  },
  // ICC Committee Authorities
  ICC_PRESIDING: {
    name: 'Presiding Officer, ICC Committee',
    email: 'icc.chairperson@rguktrkv.ac.in',
    designation: 'RGUKT RK Valley Internal Complaints Committee',
    levelTitle: 'ICC Committee Presiding Officer'
  },
  ICC_DIRECTOR: {
    name: 'The Director & ICC Apex Reviewer',
    email: 'director@rguktrkv.ac.in',
    designation: 'Apex Office of The Director',
    levelTitle: 'ICC Apex Supervisory Authority'
  }
};

/**
 * Department Email Contacts for Specialist Trades
 */
export const DEPARTMENT_OFFICERS = {
  'Electrical': { name: 'Electrical Engineering In-Charge', email: 'electrical.works@rguktrkv.ac.in' },
  'Plumbing': { name: 'Water Works & Plumbing In-Charge', email: 'plumbing.maintenance@rguktrkv.ac.in' },
  'Plumbing & Water Supply': { name: 'Water Works & Plumbing In-Charge', email: 'plumbing.maintenance@rguktrkv.ac.in' },
  'Civil & Carpentry': { name: 'Civil & Carpentry Supervisor', email: 'civil.estate@rguktrkv.ac.in' },
  'Furniture & Civil': { name: 'Civil & Furniture Supervisor', email: 'civil.estate@rguktrkv.ac.in' },
  'Housekeeping & Sanitation': { name: 'Chief Sanitation Inspector', email: 'sanitation.cleanliness@rguktrkv.ac.in' },
  'Housekeeping': { name: 'Chief Sanitation Inspector', email: 'sanitation.cleanliness@rguktrkv.ac.in' },
  'Safety & Pest Control': { name: 'Safety & Hygiene Officer', email: 'safety.hygiene@rguktrkv.ac.in' },
  'Safety': { name: 'Campus Safety Officer', email: 'safety.estate@rguktrkv.ac.in' },
  'IT & Wi-Fi Network': { name: 'Campus IT Systems Administrator', email: 'it.networks@rguktrkv.ac.in' },
  'IT Systems': { name: 'Campus IT Systems Administrator', email: 'it.networks@rguktrkv.ac.in' }
};

/**
 * Safe helper to send an email via EmailJS with graceful fallback
 */
async function sendEmailJsMessage(templateId, templateParams) {
  try {
    const res = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    console.log(`✅ [EmailJS Success] Template ${templateId} sent to ${templateParams.to_email || templateParams.email}:`, res.status, res.text);
    return { success: true, status: res.status, text: res.text };
  } catch (error) {
    console.warn(`⚠️ [EmailJS Fallback Note] Template ${templateId} attempt:`, error?.text || error?.message || error);
    return { success: false, error: error?.text || error?.message || 'Email delivery failed' };
  }
}

/**
 * 1. ACTION: Initial Complaint Submission / Tagging (Stage 1 Intake)
 * Sends notification email to:
 *  - The student/user raising the complaint
 *  - The stage 1 authority (Hostel Warden for Maintenance; ICC Presiding Officer / Director for ICC)
 */
export async function sendEmailOnComplaintSubmission(ticket) {
  if (!ticket) return;

  const isIcc = ticket.isIcc || ticket.categoryType === 'ICC' || ticket.category === 'Internal Complaints Committee (ICC)';
  const reporterEmail = ticket.reporterEmail || 'student@rgukt.ac.in';
  const reporterName = ticket.reporterName || 'Student Resident';

  const authority = isIcc ? HIERARCHY_OFFICERS.ICC_PRESIDING : HIERARCHY_OFFICERS.WARDEN;

  // 1. Email to the Student / User raising the complaint (Template: template_9djhg3n)
  const studentParams = {
    to_name: reporterName,
    to_email: reporterEmail,
    recipient_email: reporterEmail,
    email: reporterEmail,
    ticket_number: ticket.ticketNumber,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    action_type: isIcc ? 'ICC Grievance Lodged' : 'Complaint Lodged with Warden',
    current_authority: authority.name,
    authority_designation: authority.designation,
    system_type: isIcc ? 'Internal Complaints Committee (ICC)' : 'Hostel Maintenance & Facilities',
    status: ticket.status || 'ASSIGNED',
    message: isIcc
      ? `Your grievance has been officially registered with the RGUKT RK Valley Internal Complaints Committee under Office Order 11.08.2026. The Presiding Officer and Committee have been notified.`
      : `Your complaint has been successfully lodged and assigned to the Hostel Resident Warden (Stage 1) to inspect and resolve based on severity.`,
    next_step: isIcc
      ? 'The Committee will review and hold preliminary appraisal under the designated committee quorum.'
      : 'The Warden will review and record an official response. If unresolved, you may tag and escalate to DSW & Department.',
    date_time: new Date().toLocaleString()
  };

  // 2. Email to the Respective Authority / Officer (Template: template_rq4dnge)
  const authorityParams = {
    to_name: authority.name,
    to_email: authority.email,
    recipient_email: authority.email,
    email: authority.email,
    officer_name: authority.name,
    officer_designation: authority.designation,
    ticket_number: ticket.ticketNumber,
    reporter_name: ticket.maskIdentity ? 'Confidential Student (Identity Masked)' : reporterName,
    reporter_email: ticket.maskIdentity ? 'confidential@rguktrkv.ac.in' : reporterEmail,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    system_type: isIcc ? 'Internal Complaints Committee (ICC)' : 'Hostel Facilities Maintenance',
    action_type: isIcc ? 'New ICC Grievance Submission' : 'New Complaint Assigned for Local Intake',
    description: ticket.description || ticket.title,
    hierarchy_level: isIcc ? 'Level 1: ICC Committee' : 'Stage 1: Hostel Resident Warden',
    status: ticket.status || 'ASSIGNED',
    message: `A new ticket #${ticket.ticketNumber} requires your official attention. Please inspect the location and record an official response.`,
    date_time: new Date().toLocaleString()
  };

  await Promise.allSettled([
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION, studentParams),
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.AUTHORITY_NOTIFICATION, authorityParams)
  ]);
}

/**
 * 2. ACTION: Hierarchy Escalation & Tagging to Next Stage
 * (Warden -> DSW & Dept -> AO -> Director)
 * Sends notification email to:
 *  - The student/user who escalated
 *  - The incoming higher authority officer (DSW & Dept engineer, AO, or Director)
 */
export async function sendEmailOnHierarchyEscalation(ticket, escalationData) {
  if (!ticket || !escalationData) return;

  const reporterEmail = ticket.reporterEmail || 'student@rgukt.ac.in';
  const reporterName = ticket.reporterName || 'Student Resident';

  const { fromStage, toStage, toStageKey, targetDepartment, reason, taggedPriorResponse } = escalationData;

  // Determine target officer
  let targetOfficer = HIERARCHY_OFFICERS[toStageKey] || {
    name: toStage,
    email: 'estate.office@rguktrkv.ac.in',
    designation: `Office of ${toStage}`,
    levelTitle: toStage
  };

  if (toStageKey === 'DSW_DEPT' && targetDepartment) {
    const deptInfo = DEPARTMENT_OFFICERS[targetDepartment];
    targetOfficer = {
      name: `Dean Student Welfare (DSW) & ${deptInfo ? deptInfo.name : targetDepartment}`,
      email: deptInfo ? `${HIERARCHY_OFFICERS.DSW_DEPT.email}, ${deptInfo.email}` : HIERARCHY_OFFICERS.DSW_DEPT.email,
      designation: `DSW Office and ${targetDepartment} Maintenance Cell`,
      levelTitle: `Stage 2: DSW & ${targetDepartment}`
    };
  }

  // 1. Email to Student (Template: template_9djhg3n)
  const studentParams = {
    to_name: reporterName,
    to_email: reporterEmail,
    recipient_email: reporterEmail,
    email: reporterEmail,
    ticket_number: ticket.ticketNumber,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    action_type: `Escalated to ${toStage}`,
    current_authority: targetOfficer.name,
    authority_designation: targetOfficer.designation,
    system_type: 'Hostel Maintenance Hierarchy',
    status: 'ESCALATED',
    escalated_from: fromStage,
    escalated_to: toStage,
    escalation_reason: reason,
    tagged_response: taggedPriorResponse,
    message: `Your complaint #${ticket.ticketNumber} has been officially tagged and escalated from ${fromStage} to ${targetOfficer.name}.\nReason: "${reason}"\nAttached Response from ${fromStage}: "${taggedPriorResponse}"`,
    next_step: `${targetOfficer.name} will review the attached history and initiate departmental intervention.`,
    date_time: new Date().toLocaleString()
  };

  // 2. Email to the Incoming Respected Officer (Template: template_rq4dnge)
  const officerParams = {
    to_name: targetOfficer.name,
    to_email: targetOfficer.email,
    recipient_email: targetOfficer.email,
    email: targetOfficer.email,
    officer_name: targetOfficer.name,
    officer_designation: targetOfficer.designation,
    ticket_number: ticket.ticketNumber,
    reporter_name: reporterName,
    reporter_email: reporterEmail,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    system_type: 'Hostel Maintenance Hierarchy',
    action_type: `URGENT ESCALATION FROM ${fromStage.toUpperCase()}`,
    escalated_from: fromStage,
    escalated_to: toStage,
    escalation_reason: reason,
    tagged_response: taggedPriorResponse,
    description: ticket.description || ticket.title,
    hierarchy_level: targetOfficer.levelTitle || toStage,
    status: 'ESCALATED_PENDING_ACTION',
    message: `Ticket #${ticket.ticketNumber} has been escalated to your office because the previous level (${fromStage}) did not resolve the problem.\n\nEscalation Reason: ${reason}\nAttached Previous Response: "${taggedPriorResponse}"\n\nPlease review the docket and initiate on-site redressal.`,
    date_time: new Date().toLocaleString()
  };

  await Promise.allSettled([
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION, studentParams),
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.AUTHORITY_NOTIFICATION, officerParams)
  ]);
}

/**
 * 3. ACTION: Authority Records an Official Response
 * Sends notification email to the student with the official response note
 */
export async function sendEmailOnAuthorityResponse(ticket, responseText, authorityStage) {
  if (!ticket || !responseText) return;

  const reporterEmail = ticket.reporterEmail || 'student@rgukt.ac.in';
  const reporterName = ticket.reporterName || 'Student Resident';

  const studentParams = {
    to_name: reporterName,
    to_email: reporterEmail,
    recipient_email: reporterEmail,
    email: reporterEmail,
    ticket_number: ticket.ticketNumber,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    action_type: `Official Update from ${authorityStage}`,
    current_authority: authorityStage,
    authority_designation: `${authorityStage} In-Charge`,
    system_type: ticket.isIcc ? 'Internal Complaints Committee' : 'Hostel Maintenance Hierarchy',
    status: ticket.status || 'IN_PROGRESS',
    authority_response: responseText,
    message: `An official inspection update has been recorded by ${authorityStage}:\n\n"${responseText}"`,
    next_step: `Review the progress. If satisfactory, await completion. If unresolved, you may tag and escalate to the next authority.`,
    date_time: new Date().toLocaleString()
  };

  await sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION, studentParams);
}

/**
 * 4. ACTION: Problem Solved / Resolved
 * Sends resolution completion email to the student with verification instructions
 */
export async function sendEmailOnProblemSolved(ticket, resolutionNotes = '') {
  if (!ticket) return;

  const reporterEmail = ticket.reporterEmail || 'student@rgukt.ac.in';
  const reporterName = ticket.reporterName || 'Student Resident';
  const isIcc = ticket.isIcc || ticket.categoryType === 'ICC';

  // 1. Email to Student confirming fix & requesting review (Template: template_9djhg3n)
  const studentParams = {
    to_name: reporterName,
    to_email: reporterEmail,
    recipient_email: reporterEmail,
    email: reporterEmail,
    ticket_number: ticket.ticketNumber,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    action_type: isIcc ? 'ICC Grievance Disposal Approved' : 'Problem Marked as Solved',
    current_authority: ticket.assignedStaffName || 'Campus Maintenance Authority',
    authority_designation: 'Redressal & Verification Desk',
    system_type: isIcc ? 'Internal Complaints Committee (ICC)' : 'Campus Facility Maintenance',
    status: 'RESOLVED / SOLVED',
    resolution_notes: resolutionNotes || ticket.resolutionNotes || 'Repair completed and on-site fix verified by maintenance engineer.',
    message: isIcc
      ? `The Executive Disposal Order for ICC ticket #${ticket.ticketNumber} has been promulgated and enforced by the Chairperson / Director.`
      : `The maintenance team has completed the required physical repairs for ticket #${ticket.ticketNumber} at ${ticket.location}.\n\nResolution Notes: "${resolutionNotes || 'Works successfully completed.'}"`,
    next_step: 'Please inspect the physical location and confirm resolution on the portal. You can rate the technician or reopen if the defect persists.',
    date_time: new Date().toLocaleString()
  };

  // 2. Email to the Supervisor / Department Head for Quality Assurance (Template: template_rq4dnge)
  const supervisorOfficer = HIERARCHY_OFFICERS.AO;
  const supervisorParams = {
    to_name: supervisorOfficer.name,
    to_email: supervisorOfficer.email,
    recipient_email: supervisorOfficer.email,
    email: supervisorOfficer.email,
    officer_name: supervisorOfficer.name,
    officer_designation: supervisorOfficer.designation,
    ticket_number: ticket.ticketNumber,
    reporter_name: reporterName,
    reporter_email: reporterEmail,
    title: ticket.title,
    category: ticket.category,
    location: ticket.location,
    priority: ticket.priority,
    system_type: isIcc ? 'Internal Complaints Committee (ICC)' : 'Hostel Maintenance Redressal',
    action_type: 'WORK ORDER COMPLETED / RESOLVED',
    description: ticket.description || ticket.title,
    hierarchy_level: ticket.currentHierarchyAuthority || 'Estate Maintenance Team',
    status: 'RESOLVED',
    resolution_notes: resolutionNotes || ticket.resolutionNotes || 'Fix completed on site.',
    message: `Ticket #${ticket.ticketNumber} has been marked as RESOLVED by the attending staff (${ticket.assignedStaffName || 'Assigned Technician'}). Verification prompt dispatched to student.`,
    date_time: new Date().toLocaleString()
  };

  await Promise.allSettled([
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION, studentParams),
    sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.AUTHORITY_NOTIFICATION, supervisorParams)
  ]);
}

/**
 * 5. ACTION: Send One-Time Password (OTP) for Email Verification / Registration
 * Sends a 6-digit OTP code to the recipient's email address
 */
export async function sendOtpEmail(recipientEmail, otpCode, recipientName = 'Student') {
  if (!recipientEmail || !otpCode) {
    return { success: false, message: 'Recipient email and OTP are required.' };
  }

  const cleanEmail = recipientEmail.trim().toLowerCase();
  const formattedOtp = String(otpCode).trim();

  // Populate all common EmailJS template variables to ensure any template format receives and displays the OTP
  const otpParams = {
    to_name: recipientName,
    user_name: recipientName,
    name: recipientName,
    to_email: cleanEmail,
    recipient_email: cleanEmail,
    reply_to: cleanEmail,
    email: cleanEmail,
    user_email: cleanEmail,
    otp: formattedOtp,
    otp_code: formattedOtp,
    passcode: formattedOtp,
    code: formattedOtp,
    verification_code: formattedOtp,
    action_type: 'Email Verification OTP',
    system_type: 'RGUKT RK Valley Internal Complaint System',
    status: 'VERIFICATION REQUIRED',
    title: `Your Verification OTP is ${formattedOtp}`,
    subject: `Your RGUKT Verification Code: ${formattedOtp}`,
    message: `Hello ${recipientName},\n\nYour One-Time Password (OTP) for verification is:\n\n${formattedOtp}\n\nPlease enter this 6-digit OTP to complete your registration and access the system. This OTP is valid for 10 minutes.\n\nRegards,\nRGUKT RK Valley`,
    body: `Your One-Time Password (OTP) is: ${formattedOtp}`,
    notes: `Your OTP is: ${formattedOtp}`,
    next_step: `Enter code ${formattedOtp} to verify your account and enter the app.`,
    ticket_number: `OTP-${formattedOtp}`,
    category: 'Account Verification',
    location: 'Campus Security & Auth Portal',
    priority: 'HIGH',
    logo: 'https://iili.io/nMXW1wl.png',
    logo_url: 'https://iili.io/nMXW1wl.png',
    logo_image: 'https://iili.io/nMXW1wl.png',
    logo_src: 'https://iili.io/nMXW1wl.png',
    company_logo: 'https://iili.io/nMXW1wl.png',
    image_url: 'https://iili.io/nMXW1wl.png',
    image: 'https://iili.io/nMXW1wl.png',
    icon_url: 'https://iili.io/nMXW1wl.png',
    avatar: 'https://iili.io/nMXW1wl.png',
    img_url: 'https://iili.io/nMXW1wl.png',
    // Direct HTML image snippet in case template expects raw HTML snippet
    logo_html: '<img src="https://iili.io/nMXW1wl.png" alt="INTERNAL COMPLAINT SYSTEM" width="96" height="96" style="border-radius: 50%; display: block;" />',
    company_name: 'INTERNAL COMPLAINT SYSTEM',
    'company_name': 'INTERNAL COMPLAINT SYSTEM',
    'Company Name': 'INTERNAL COMPLAINT SYSTEM',
    Company_Name: 'INTERNAL COMPLAINT SYSTEM',
    company: 'INTERNAL COMPLAINT SYSTEM',
    app_name: 'INTERNAL COMPLAINT SYSTEM',
    date_time: new Date().toLocaleString()
  };

  console.log(`📨 [Dispatching OTP] Sending OTP code [${formattedOtp}] to ${cleanEmail} using template ${EMAILJS_CONFIG.TEMPLATES.OTP_VERIFICATION}...`);

  // 1. Send via EmailJS using dedicated OTP template: template_cjeu2jp
  let emailJsRes = await sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.OTP_VERIFICATION, otpParams);

  // If primary OTP template returns an error, fallback to USER_NOTIFICATION
  if (!emailJsRes?.success && EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION) {
    console.log(`🔄 [EmailJS Retrying] Fallback to secondary template ${EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION}...`);
    emailJsRes = await sendEmailJsMessage(EMAILJS_CONFIG.TEMPLATES.USER_NOTIFICATION, otpParams);
  }

  // 2. Also notify backend email dispatcher
  try {
    fetch('/api/send-otp-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail: cleanEmail,
        recipientName,
        otp: formattedOtp
      })
    }).catch(e => console.warn('Backend OTP sync notice:', e));
  } catch (err) {
    console.warn('Backend OTP call error:', err);
  }

  return emailJsRes;
}
