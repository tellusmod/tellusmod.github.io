// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAwcudujtr6G5KSv_lbwQAEMzvDnXMb8yA",
  authDomain: "the-tellus-mod.firebaseapp.com",
  projectId: "the-tellus-mod",
  storageBucket: "the-tellus-mod.firebasestorage.app",
  messagingSenderId: "305268662370",
  appId: "1:305268662370:web:89745d6a927177de98b13b",
  measurementId: "G-0K10QYP525"
};

// Initialize Firebase (compat style)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// 🔴 IMPORTANT — your admin email
const ADMIN_EMAIL = "sanjeevbangalore@gmail.com";