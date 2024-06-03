import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSTHVjipXjNuFRhn8AvxSa8-w-rQUCnss",
  authDomain: "randomwordcard.firebaseapp.com",
  projectId: "randomwordcard",
  storageBucket: "randomwordcard.appspot.com",
  messagingSenderId: "1021435640798",
  appId: "1:1021435640798:web:0b5f883671b2b6070dbb4f",
  measurementId: "G-P5Y5XB6WQQ"
};

export function initializeFirebase(): { app: FirebaseApp, firestore: Firestore } {
    const app = initializeApp(firebaseConfig);
    initializeFirestore(app, {localCache: persistentLocalCache()});
    const firestore = getFirestore(app);
    
    return { app, firestore };
}
