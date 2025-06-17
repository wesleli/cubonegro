import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getCountFromServer
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQTM3FzXla4BZVoA39Eb1TfFRK702IKb8",
  authDomain: "cubo-5e1ab.firebaseapp.com",
  projectId: "cubo-5e1ab",
  storageBucket: "cubo-5e1ab.firebasestorage.app",
  messagingSenderId: "536689579528",
  appId: "1:536689579528:web:cdc8bdfbc31570ef0fe3bd",
  measurementId: "G-WYCZMWW7XH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]!;
export const db = getFirestore(app);
export { collection, addDoc, onSnapshot, query, orderBy, getCountFromServer };