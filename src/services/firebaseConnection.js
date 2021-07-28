import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyALD7GcblNqmUxwwjuC8Wer46vBKBMO4Ro",
    authDomain: "sistema-7b004.firebaseapp.com",
    projectId: "sistema-7b004",
    storageBucket: "sistema-7b004.appspot.com",
    messagingSenderId: "791621272015",
    appId: "1:791621272015:web:b0579aa2f0c5bb086f92ba",
    measurementId: "G-N17GRBVNW8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

//firebase.analytics();

export default firebase;