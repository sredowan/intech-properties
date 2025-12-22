import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration - only used for Authentication
const firebaseConfig = {
    apiKey: "AIzaSyC5RvvhbAAzXLWK8f1EHl6Ztj7W_W-XF3w",
    authDomain: "intech-properties.firebaseapp.com",
    projectId: "intech-properties",
    storageBucket: "intech-properties.firebasestorage.app",
    messagingSenderId: "108129832728",
    appId: "1:108129832728:web:c02a4e1c4c3df282f2586d"
};

const app = initializeApp(firebaseConfig);

// Only export Auth - Firestore has been migrated to Neon PostgreSQL
export const auth = getAuth(app);
export default app;
