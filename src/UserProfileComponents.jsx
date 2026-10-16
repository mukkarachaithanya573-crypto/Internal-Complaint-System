import React, { useState, useEffect } from 'react';
import { 
  User, Mail, PhoneCall, GraduationCap, Clock, Building2, MapPin, 
  Edit3, Save, X, CheckCircle2, ShieldCheck, Camera, Sparkles, AlertCircle 
} from 'lucide-react';

const BRANCH_OPTIONS = [
  'CSE Dept',
  'ECE Dept',
  'EEE Dept',
  'Mechanical Dept',
  'Civil Dept',
  'Chemical Dept',
  'MME Dept',
  'PUC-1',
  'PUC-2'
];

const STUDYING_YEAR_OPTIONS = [
  'PUC 1st Year',
  'PUC 2nd Year',
  'B.Tech 1st Year',
  'B.Tech 2nd Year',
  'B.Tech 3rd Year',
  'B.Tech 4th Year'
];

const HOSTEL_BLOCK_OPTIONS = [
  'Penna BH-1 (Front Side)',
  'Penna BH-1 (Back Side)',
  'Papagni BH-2 (Front Side)',
  'Papagni BH-2 (Back Side)',
  'Old Campus > RHO',
  'Old Campus > THETA',
  'Old Campus > ALPHA',
  'Old Campus > BETA',
  'Old Campus > GAMMA',
  'Old Campus > DELTA',
  'Kundu {GH-1}',
  'Chitravati {GH-2}'
];

/**
 * Interactive Profile Modal Dialog for quick edits anywhere
 */
export function UserProfileEditModal({ isOpen, onClose, currentUser, currentRole, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.fullName || '',
    branch: currentUser?.branch || 'CSE Dept',
    studyingYear: currentUser?.studyingYear || currentUser?.className || 'B.Tech 3rd Year',
    hostelBlock: currentUser?.hostelBlock || (currentUser?.hostelRoom?.split('•')?.[0]?.trim()) || 'Penna BH-1 (Front Side)',
    roomNumber: currentUser?.roomNumber || (currentUser?.hostelRoom?.split('•')?.[1]?.trim()) || '108',
    mobileNumber: currentUser?.mobileNumber ? currentUser.mobileNumber.replace(/^\+91\s*/, '') : '',
    profilePic: currentUser?.profilePic || '',
    department: currentUser?.department || currentUser?.category || 'Electrical',
    zone: currentUser?.zone || 'Academics & Hostels'
  });

  const [validationError, setValidationError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(currentUser?.profilePic || '');

  // Synchronize form whenever currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || currentUser.fullName || '',
        branch: currentUser.branch || 'CSE Dept',
        studyingYear: currentUser.studyingYear || currentUser.className || 'B.Tech 3rd Year',
        hostelBlock: currentUser.hostelBlock || (currentUser.hostelRoom?.split('•')?.[0]?.trim()) || 'Penna BH-1 (Front Side)',
        roomNumber: currentUser.roomNumber || (currentUser.hostelRoom?.split('•')?.[1]?.trim()) || '108',
        mobileNumber: currentUser.mobileNumber ? currentUser.mobileNumber.replace(/^\+91\s*/, '') : '',
        profilePic: currentUser.profilePic || '',
        department: currentUser.department || currentUser.category || 'Electrical',
        zone: currentUser.zone || 'Academics & Hostels'
      });
      setPhotoPreview(currentUser.profilePic || '');
      setValidationError('');
    }
  }, [currentUser, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 320;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

        setPhotoPreview(compressedBase64);
        setFormData(prev => ({ ...prev, profilePic: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Full Name cannot be empty.');
      return;
    }

    const cleanMobile = formData.mobileNumber.trim().replace(/\D/g, '');
    if (cleanMobile && cleanMobile.length !== 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const compiledHostelRoom = `${formData.hostelBlock.replace(/\s*\(.*?\)/g, '')} • ${formData.roomNumber.trim() || '108'}`;

    onSave({
      name: formData.name.trim(),
      fullName: formData.name.trim(),
      branch: formData.branch,
      studyingYear: formData.studyingYear,
      className: formData.studyingYear,
      hostelBlock: formData.hostelBlock,
      roomNumber: formData.roomNumber.trim(),
      hostelRoom: compiledHostelRoom,
      mobileNumber: cleanMobile,
      profilePic: formData.profilePic,
      department: formData.department,
      zone: formData.zone
    });
  };

  const isStudent = currentRole === 'REPORTER' || (!currentRole && currentUser?.role !== 'STAFF' && currentUser?.role !== 'ADMIN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl cyber-card rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl cyber-card/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">Edit Your Profile</h2>
              <p className="text-xs text-blue-100 font-medium">Updates reflect dynamically across the campus dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full cyber-card/10 hover:cyber-card/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Photo + Identity Banner */}
          <div className="flex items-center gap-4 p-3.5 cyber-card-subtle rounded-2xl border border-slate-700/60/80">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xl">
                {photoPreview ? (
                  <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(formData.name || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label 
                htmlFor="profile-pic-modal-upload"
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
                <input 
                  id="profile-pic-modal-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white truncate">
                  ID: {currentUser?.idNo || 'R240493'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                  {currentUser?.role || currentRole || 'Student'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5" title={currentUser?.email || 'student@rguktrkv.ac.in'}>
                {currentUser?.email || 'student@rguktrkv.ac.in'}
              </p>
              <label 
                htmlFor="profile-pic-modal-upload"
                className="inline-block mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Change Profile Photo
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Full Name <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setValidationError('');
              }}
              placeholder="e.g. M.Chaithanya Yadav"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
              required
            />
          </div>

          {isStudent ? (
            <>
              {/* Branch & Studying Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>Branch / Dept <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  >
                    {BRANCH_OPTIONS.map(b => (
                      <option key={b} value={b} className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Studying Year / Class <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={formData.studyingYear}
                    onChange={(e) => setFormData({ ...formData, studyingYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  >
                    {STUDYING_YEAR_OPTIONS.map(y => (
                      <option key={y} value={y} className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hostel Block & Room Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Hostel Block</span>
                  </label>
                  <select
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  >
                    {HOSTEL_BLOCK_OPTIONS.map(h => (
                      <option key={h} value={h} className="bg-slate-900 text-white" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>Room Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. 108"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Staff / Admin Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Electrical / Estate Office"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Zone Assignment</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  placeholder="e.g. Academics & Hostels"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                />
              </div>
            </div>
          )}

          {/* Contact Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                <span>Mobile Number <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">10 Digits</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-700 bg-slate-800 text-xs font-bold text-slate-300">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobileNumber}
                onChange={(e) => {
                  setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') });
                  setValidationError('');
                }}
                placeholder="8247532907"
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-xs font-bold transition-all outline-none"
                style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                required
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Dedicated Full-Page Profile Component rendered when activeTab === 'profile'
 */
export function FullProfileView({ currentUser, currentRole, onOpenEditModal, complaints = [], onNavigateToTracker }) {
  const isStudent = currentRole === 'REPORTER' || (!currentRole && currentUser?.role !== 'STAFF' && currentUser?.role !== 'ADMIN');
  const userTickets = complaints.filter(c => {
    if (!c) return false;
    if (isStudent) {
      const matchEmail = currentUser?.email && c.reporterEmail?.toLowerCase() === currentUser.email.toLowerCase();
      const curId = (currentUser?.idNo || '').trim().toUpperCase();
      const matchId = curId && ((c.reporterId && c.reporterId.toUpperCase() === curId) || (c.studentId && c.studentId.toUpperCase() === curId));
      const curName = (currentUser?.name || currentUser?.fullName || '').trim().toLowerCase();
      const matchName = curName && curName !== 'student' && c.reporterName?.toLowerCase().trim() === curName;
      return matchEmail || matchId || matchName;
    }
    // Staff/Admin: complaints passed is already visibleComplaints
    return true;
  });
  const resolvedCount = userTickets.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const activeCount = userTickets.length - resolvedCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Header Card */}
      <div className="cyber-card rounded-3xl border border-slate-700/60 shadow-sm overflow-hidden">
        {/* Cover graphic */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full cyber-card/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              Verified Campus Resident
            </span>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl cyber-card p-1.5 shadow-xl border border-slate-700/60/80 shrink-0">
                {currentUser?.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt={currentUser?.name || 'User'}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                    {(currentUser?.name || 'M').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="pb-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                    {currentUser?.name || 'M.Chaithanya'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 shrink-0">
                    ID: {currentUser?.idNo || 'R240493'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                  {currentUser?.role || currentRole || 'Student'} • RGUKT RK Valley
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenEditModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Total Filed</span>
              <span className="text-lg font-black text-blue-900">{userTickets.length} Complaints</span>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Resolved</span>
              <span className="text-lg font-black text-emerald-900">{resolvedCount} Solved</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">In Progress</span>
              <span className="text-lg font-black text-amber-900">{activeCount} Pending</span>
            </div>
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">Campus Status</span>
              <span className="text-lg font-black text-purple-900">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Academic & Residential Information */}
        <div className="cyber-card rounded-3xl p-6 border border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Campus & Academic Details</span>
            </h3>
            <button
              type="button"
              onClick={onOpenEditModal}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <User className="w-4 h-4 text-blue-600" />
                <span>Student Name</span>
              </div>
              <span className="text-xs font-bold text-white">
                {currentUser?.fullName || currentUser?.name || 'M.Chaithanya'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Department / Branch</span>
              </div>
              <span className="text-xs font-bold text-white">
                {currentUser?.branch || 'CSE Dept'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Studying Year / Class</span>
              </div>
              <span className="text-xs font-bold text-white">
                {currentUser?.studyingYear || currentUser?.className || 'B.Tech 3rd Year'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Hostel Room</span>
              </div>
              <span className="text-xs font-bold text-white">
                {currentUser?.hostelRoom || `${currentUser?.hostelBlock || 'Penna BH-1'} • ${currentUser?.roomNumber || '108'}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Campus Location</span>
              </div>
              <span className="text-xs font-bold text-white">
                RGUKT RK Valley, Idupulapaya
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Account Information */}
        <div className="cyber-card rounded-3xl p-6 border border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Contact & Communication</span>
            </h3>
            <button
              type="button"
              onClick={onOpenEditModal}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Official Webmail</span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[200px]" title={currentUser?.email || 'r240493@rguktrkv.ac.in'}>
                {currentUser?.email || 'r240493@rguktrkv.ac.in'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl cyber-card-subtle border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>Primary Mobile</span>
              </div>
              <span className="text-xs font-bold text-white">
                {currentUser?.mobileNumber ? `+91 ${currentUser.mobileNumber}` : '+91 8247532907'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: My Complaint Status Section for the logged in person */}
      <div className="cyber-card rounded-3xl p-6 border border-slate-700/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                My Complaint Status & Redressal Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Live status tracking and history for complaints lodged by {currentUser?.name || 'you'}
              </p>
            </div>
          </div>
          {onNavigateToTracker && (
            <button
              type="button"
              onClick={onNavigateToTracker}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Open Detailed Tracker</span>
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {userTickets.length === 0 ? (
          <div className="p-8 text-center cyber-card-subtle rounded-2xl border border-slate-700/60/80">
            <div className="w-12 h-12 rounded-2xl cyber-card border border-slate-700/60 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-200">No Complaints Registered Under Your Profile</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              When you submit a hostel or campus issue, its live progress and authority stage will show right here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {userTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={onNavigateToTracker}
                className="p-4 rounded-2xl border border-slate-700/60 hover:border-blue-400 cyber-card-subtle/60 hover:cyber-card transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs hover:shadow-xs group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-white group-hover:text-blue-600 transition-colors">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-900">
                      {ticket.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' :
                      ticket.status === 'REOPENED' ? 'bg-purple-100 text-purple-800' :
                      ticket.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      ● {ticket.status}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {ticket.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ticket.location}</span>
                    <span className="mx-1">•</span>
                    <span>Assigned: {ticket.assignedStaffName || 'Pending Warden Review'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:underline">
                    Track Complaint Status →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
