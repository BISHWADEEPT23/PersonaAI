import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// 1. Google Sign-In
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// 2. Email + Password
export const signUpWithEmail = (email: string, pass: string) => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

export const loginWithEmail = (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

// 3. Guest / Instant Sanctuary Access
export const loginAsGuest = () => {
  return signInAnonymously(auth);
};

// 4. Phone Number (SMS OTP) Setup
export const setupRecaptcha = (containerId: string) => {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    });
  }
  return (window as any).recaptchaVerifier;
};

export const sendPhoneOtp = async (phoneNumber: string, appVerifier: any) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
