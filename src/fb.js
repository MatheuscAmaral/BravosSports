import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAnxPP8gJxaNLVKcsCinEsvJ7v_9oWQUrU",
  authDomain: "bravossports-c1207.firebaseapp.com",
  projectId: "bravossports-c1207",
  storageBucket: "bravossports-c1207.appspot.com",
  messagingSenderId: "223433365592",
  appId: "1:223433365592:web:1a828f689edc940c22d22d",
  measurementId: "G-FJZ1LLTRZ4"
});

const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default db;