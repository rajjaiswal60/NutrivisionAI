// Firebase & Google Identity Configuration Service
// Reads keys safely from .env (VITE_FIREBASE_...)

export interface GoogleAuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const env = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("YOUR_")
);

export const signInWithGoogle = async (): Promise<GoogleAuthUser | null> => {
  if (!isFirebaseConfigured) {
    return null;
  }

  try {
    // Dynamic import to keep bundle light and zero-friction
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      return {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
    }
  } catch (error) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }

  return null;
};

