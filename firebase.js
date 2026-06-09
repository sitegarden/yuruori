import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKXkN33lf_Fv4haTsartMtFfnUo5nQLZg",
  authDomain: "yuruori-lane.firebaseapp.com",
  projectId: "yuruori-lane",
  storageBucket: "yuruori-lane.firebasestorage.app",
  messagingSenderId: "935807368483",
  appId: "1:935807368483:web:f9e9d95e5b803ac4aca096"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
