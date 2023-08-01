
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD2qm7JQQPLHFFkUahj8vEBFT-9oi7ISrA",
  authDomain: "imageandtext-crud-react.firebaseapp.com",
  projectId: "imageandtext-crud-react",
  storageBucket: "imageandtext-crud-react.appspot.com",
  messagingSenderId: "761847483317",
  appId: "1:761847483317:web:77624fa19867233955a7fc",
  measurementId: "G-K9Z95HEMKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/// configuracion de get storgare
export const db = getFirestore(app);
export const storage = getStorage (app);