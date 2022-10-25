import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import "firebase/compat/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBclW7w06V0e10wmJhSEiOZMJLbQ4DmyH0",
  authDomain: "waren-aa4ff.firebaseapp.com",
  projectId: "waren-aa4ff",
  storageBucket: "waren-aa4ff.appspot.com",
  messagingSenderId: "596933931098",
  appId: "1:596933931098:web:d4c9c4452b3724e9b76863"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;