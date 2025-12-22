import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5RvvhbAAzXLWK8f1EHl6Ztj7W_W-XF3w",
    authDomain: "intech-properties.firebaseapp.com",
    projectId: "intech-properties",
    storageBucket: "intech-properties.firebasestorage.app",
    messagingSenderId: "108129832728",
    appId: "1:108129832728:web:c02a4e1c4c3df282f2586d"
};

const app = initializeApp(firebaseConfig);

// Export Auth for admin login
export const auth = getAuth(app);

// Export Firestore for data migration (read-only, will be removed after migration)
export const db = getFirestore(app);

export default app;
