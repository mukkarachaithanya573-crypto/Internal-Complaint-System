import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { 
  getFirestore,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyCwfI8Vcl4PWckgSZoN-Hcf5jaKJWalq7k",
  authDomain: "internal-complaint-system.firebaseapp.com",
  projectId: "internal-complaint-system",
  storageBucket: "internal-complaint-system.firebasestorage.app",
  messagingSenderId: "594451897466",
  appId: "1:594451897466:web:f318ba81f3a705e399efc3",
  measurementId: "G-TQMPKYQ1V5"
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore Database singleton with automatic connection management
export const db = getFirestore(app);

// Helper to remove any undefined fields recursively because Firestore rejects undefined
export function cleanForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item)).filter(item => item !== undefined);
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = cleanForFirestore(value);
    }
  }
  return clean;
}

// Analytics is optional and non-critical; suppressed on network drops to eliminate console spam
export const analytics = null;

/**
 * Save or update a complaint in Firebase Cloud Firestore
 */
export async function saveComplaintToFirestore(complaint) {
  if (!complaint || !complaint.id) return null;
  try {
    const docRef = doc(db, "complaints", String(complaint.id));
    const sanitized = cleanForFirestore(complaint);
    const payload = {
      ...sanitized,
      updatedAtFirestore: serverTimestamp()
    };
    await setDoc(docRef, payload, { merge: true });
    console.log("✅ [Cloud Firestore] Complaint stored successfully:", complaint.id);
    return complaint.id;
  } catch (error) {
    console.error("Firestore saveComplaint error:", error);
    return null;
  }
}

/**
 * Update specific fields of a complaint in Firebase Cloud Firestore
 */
export async function updateComplaintInFirestore(complaintId, updates) {
  if (!complaintId || !updates) return false;
  try {
    const docRef = doc(db, "complaints", String(complaintId));
    const sanitized = cleanForFirestore(updates);
    await updateDoc(docRef, {
      ...sanitized,
      updatedAtFirestore: serverTimestamp()
    });
    console.log("✅ [Cloud Firestore] Complaint updated:", complaintId);
    return true;
  } catch (error) {
    console.error("Firestore updateComplaint error:", error);
    return false;
  }
}

/**
 * Fetch all complaints once from Firebase Cloud Firestore
 */
export async function fetchComplaintsFromFirestore() {
  try {
    const colRef = collection(db, "complaints");
    const snapshot = await getDocs(colRef);
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error) {
    console.warn("Firestore fetchComplaints warning:", error.message || error);
    return [];
  }
}

/**
 * Subscribe to real-time live complaint updates from Firebase Cloud Firestore
 */
export function subscribeToComplaints(onUpdate, onError) {
  try {
    const colRef = collection(db, "complaints");
    const unsub = onSnapshot(colRef, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (typeof onUpdate === "function") {
        onUpdate(list);
      }
    }, (error) => {
      // Suppress unhandled network disconnect notifications; Firestore handles auto-reconnect internally
      if (typeof onError === "function") {
        onError(error);
      }
    });
    return unsub;
  } catch (error) {
    return () => {};
  }
}



/**
 * Save user profile to Firebase Cloud Firestore for permanent cross-device persistence
 */
export async function saveUserToFirestore(user) {
  if (!user) return null;
  const idKey = (user.idNo || user.staffId || user.id || '').trim().toUpperCase();
  const emailKey = (user.collegeEmail || user.email || '').trim().toLowerCase();
  if (!idKey && !emailKey) return null;

  try {
    const docId = (idKey || emailKey).replace(/[\/\s.]/g, '_');
    const docRef = doc(db, "users", docId);
    const sanitized = cleanForFirestore(user) || {};
    
    const dataToSave = {
      ...sanitized,
      idNo: idKey || sanitized.idNo || null,
      collegeEmail: emailKey || sanitized.collegeEmail || null,
      email: emailKey || sanitized.email || null,
      fullName: user.fullName || user.name || sanitized.fullName || sanitized.name || null,
      name: user.name || user.fullName || sanitized.name || sanitized.fullName || null,
      mobileNumber: user.mobileNumber || sanitized.mobileNumber || null,
      branch: user.branch || sanitized.branch || null,
      studyingYear: user.studyingYear || user.className || sanitized.studyingYear || sanitized.className || null,
      className: user.className || user.studyingYear || sanitized.className || sanitized.studyingYear || null,
      hostelRoom: user.hostelRoom || sanitized.hostelRoom || null,
      hostelBlock: user.hostelBlock || sanitized.hostelBlock || null,
      roomNumber: user.roomNumber || sanitized.roomNumber || null,
      profilePic: user.profilePic || sanitized.profilePic || null,
      role: user.role || sanitized.role || 'REPORTER',
      department: user.department || sanitized.department || null,
      zone: user.zone || sanitized.zone || null,
      userTab: user.userTab || sanitized.userTab || (user.role === 'REPORTER' ? 'student' : 'department'),
      updatedAtFirestore: serverTimestamp(),
      updatedAtISO: new Date().toISOString()
    };

    await setDoc(docRef, dataToSave, { merge: true });
    console.log("✅ [Cloud Firestore] User profile stored permanently:", docId);
    return docId;
  } catch (error) {
    console.error("Firestore saveUser error:", error);
    return null;
  }
}

/**
 * Fetch all registered users from Firebase Cloud Firestore
 */
export async function fetchUsersFromFirestore() {
  try {
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    const list = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data) {
        list.push({ ...data, _docId: docSnap.id });
      }
    });
    console.log(`✅ [Cloud Firestore] Retrieved ${list.length} user profile(s) from cloud.`);
    return list;
  } catch (error) {
    console.warn("Firestore fetchUsers warning:", error.message || error);
    return [];
  }
}

/**
 * Sign in directly with Google using Firebase Authentication Popup
 */
export async function signInWithGooglePopup() {
  try {
    googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error) {
    console.warn("Firebase Google Auth notice/error:", error?.code || error);
    throw error;
  }
}

