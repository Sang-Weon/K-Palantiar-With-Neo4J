import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    projectId: "k-palantir-ontology-99",
    appId: "1:635193470371:web:3ca271dc11bc2453fa7e16",
    storageBucket: "k-palantir-ontology-99.firebasestorage.app",
    apiKey: "AIzaSyAfa5CT4kerLZBoXMusC1aLiS58Gsm7Y7M",
    authDomain: "k-palantir-ontology-99.firebaseapp.com",
    messagingSenderId: "635193470371"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
