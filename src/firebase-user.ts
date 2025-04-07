// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const FB_APIKEY = "AIzaSyD7JZZOOoz_KOIDO-vbcibR9x10i2C4Kbs";
const FB_AUTHDOMAIN = "gkrish-mystery-hunt.firebaseapp.com";
const FB_PROJECTID = "gkrish-mystery-hunt";
const FB_STORAGEBUCKET = "gkrish-mystery-hunt.firebasestorage.app";
const FB_MESSAGESENDERID = "526345543661";
const FB_APPID = "1:526345543661:web:03d2c65501869d03e4d1e4";
const FB_MEASUREID = "G-329FE0BLN8";

const firebaseConfig = {
    apiKey: FB_APIKEY,
    authDomain: FB_AUTHDOMAIN,
    projectId: FB_PROJECTID,
    storageBucket: FB_STORAGEBUCKET,
    messagingSenderId: FB_MESSAGESENDERID,
    appId: FB_APPID,
    measurementId: FB_MEASUREID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Export Firebase Utils
export { auth };
