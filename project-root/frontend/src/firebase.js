import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import{getFirestore}from"firebase/firestore";
import { getStorage } from "firebase/storage"; 


const firebaseConfig = {
  apiKey: "AIzaSyBBEkTSm7UyYjD2qk1JTVbSF0sY1wh6ufo",
  authDomain: "database-85a44.firebaseapp.com",
  projectId: "database-85a44",
  storageBucket: "database-85a44.firebasestorage.app",
  messagingSenderId: "65625538304",
  appId: "1:65625538304:web:cc899700042eaa3214fde5",
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();

export const db = getFirestore(app);
export{auth,provider};
export const storage=getStorage(app);