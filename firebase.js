import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";  
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyAFpW3I3RDxjE-1Zg0eL_-vXKqYaHaE2D4",
  authDomain: "banter-21e55.firebaseapp.com",
  projectId: "banter-21e55",
  storageBucket: "banter-21e55.firebasestorage.app",
  messagingSenderId: "969819772285",
  appId: "1:969819772285:web:18983833a6d049b26de814",
  measurementId: "G-8C3PH7JYJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export{auth,db,storage};