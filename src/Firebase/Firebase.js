import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';  // import

const firebaseConfig = {
  apiKey: "AIzaSyBhfIPnCc5rYYVRA597ua0sa-YgEzNGCXo",
  authDomain: "turbine-8daf7.firebaseapp.com",
  databaseURL: "https://turbine-8daf7-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "turbine-8daf7",
  storageBucket: "turbine-8daf7.appspot.com",
  messagingSenderId: "229385859320",
  appId: "1:229385859320:web:33b97709bcdfa4b2f30b0d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export { auth, db, database, signInWithGoogle, ref, onValue };  
