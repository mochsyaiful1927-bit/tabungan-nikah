import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Menggunakan data asli dari Firebase Console kamu
const firebaseConfig = {
  apiKey: "AIzaSyCN8RfoCZ4ll4wKgkegsUex60IvkoABHw0",
  authDomain: "seryu-cargo.firebaseapp.com",
  projectId: "seryu-cargo",
  storageBucket: "seryu-cargo.firebasestorage.app",
  messagingSenderId: "762635421641",
  appId: "1:762635421641:web:117bbd8060406cd3034a18",
  measurementId: "G-E301H2DFEK"
};

const app = initializeApp(firebaseConfig);

// Export db agar bisa dipakai di App.jsx
export const db = getFirestore(app);