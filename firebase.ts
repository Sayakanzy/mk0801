// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDl5MWuK9fKC22YXI8woC6LavoRB_zZQyI",
  authDomain: "kenshin0731-66cd9.firebaseapp.com",
  projectId: "kenshin0731-66cd9",
  storageBucket: "kenshin0731-66cd9.firebasestorage.app",
  messagingSenderId: "529311224966",
  appId: "1:529311224966:web:b6d0786694aee6f5efad07"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
