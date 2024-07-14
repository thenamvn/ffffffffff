import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBopT9eriwAs8k49DyrvcxCK6iOi2e-E-M",
  authDomain: "jptravelz.firebaseapp.com",
  databaseURL: "https://jptravelz-default-rtdb.firebaseio.com",
  projectId: "jptravelz",
  storageBucket: "jptravelz.appspot.com",
  messagingSenderId: "30414699565",
  appId: "1:30414699565:web:64bf1bb32090de9676cca4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Storage instance

export { auth, db, storage }; // Export all Firebase services
