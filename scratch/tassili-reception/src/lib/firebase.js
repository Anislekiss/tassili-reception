import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDV1brpM1xNgenXDTVWzpprsIYwSB1iS28",
    authDomain: "tassili-reception.firebaseapp.com",
    projectId: "tassili-reception",
    storageBucket: "tassili-reception.firebasestorage.app",
    messagingSenderId: "556472355516",
    appId: "1:556472355516:web:dbb73e02b2d3f8c60ddeb9"
};

// Initialisation
const app = initializeApp(firebaseConfig);
// C'est cet objet "db" qui nous permettra de parler à votre base de données
export const db = getFirestore(app);