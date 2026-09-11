// Firebase Client Configuration & Service Layer for LexiScan Legal Metrology Suite
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';

// Default / fallback Firebase client config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForLegalMetrologyPCR2011",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lexiscan-metrology.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lexiscan-metrology-prod",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lexiscan-metrology.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "373947506839",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:373947506839:web:a1b2c3d4e5f6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/**
 * Save an inspection audit record to Firebase Firestore
 * @param {Object} inspectionData 
 */
export async function saveInspectionToFirestore(inspectionData) {
  if (!inspectionData || inspectionData.isConsumerScan) {
    // Consumer scans follow strict Zero Data Retention
    return { success: true, zeroRetention: true };
  }

  try {
    const id = inspectionData.id || `INS-${Date.now()}`;
    const docRef = doc(db, 'inspections', id);
    await setDoc(docRef, {
      ...inspectionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, id, persisted: 'firebase' };
  } catch (error) {
    console.warn('[Firebase Firestore Warning] Falling back to local state:', error?.message);
    return { success: false, error: error?.message, fallback: true };
  }
}

/**
 * Fetch latest inspections from Firebase Firestore
 * @param {number} maxRecords 
 */
export async function fetchInspectionsFromFirestore(maxRecords = 25) {
  try {
    const q = query(
      collection(db, 'inspections'),
      orderBy('createdAt', 'desc'),
      limit(maxRecords)
    );
    const snapshot = await getDocs(q);
    const records = [];
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    return records;
  } catch (error) {
    console.warn('[Firebase Firestore Fetch Warning]:', error?.message);
    return [];
  }
}

export default app;
