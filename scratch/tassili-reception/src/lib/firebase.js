import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ------------------------------------------------------------------
// IMPORTANT : REMPLACEZ CECI PAR VOS CLES FIREBASE
// ------------------------------------------------------------------
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un projet "Tassili"
// 3. Cliquez sur l'icône Web (</>) pour ajouter une app
// 4. Copiez la "firebaseConfig" et collez-la ci-dessous :

const firebaseConfig = {
    apiKey: "REMPLACER_PAR_VOTRE_API_KEY",
    authDomain: "tassili-reception.firebaseapp.com",
    projectId: "tassili-reception",
    storageBucket: "tassili-reception.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
