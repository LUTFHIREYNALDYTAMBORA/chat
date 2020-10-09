import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyAozs-dVMczuu4f0VGKrYF995cHxNv6HWw",
    authDomain: "react-slack-e1e76.firebaseapp.com",
    databaseURL: "https://react-slack-e1e76.firebaseio.com",
    projectId: "react-slack-e1e76",
    storageBucket: "react-slack-e1e76.appspot.com",
    messagingSenderId: "687412631450",
    appId: "1:687412631450:web:bca45050fb1d840b3e0c23",
    measurementId: "G-QDXR8HE08Q"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;