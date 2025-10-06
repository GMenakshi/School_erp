import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth'

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  // add user to firestore
}

export const doSignOut = () => {
  return auth.signOut()
}

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email)
}

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password)
}

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  })
}

// ✅ Add phone authentication functions
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response)
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired')
      },
    })
  }
  return window.recaptchaVerifier
}

export const doSendPhoneOTP = async (phoneNumber) => {
  const appVerifier = setupRecaptcha()
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier)
}

export const doVerifyPhoneOTP = async (verificationId, otp) => {
  const credential = PhoneAuthProvider.credential(verificationId, otp)
  return signInWithCredential(auth, credential)
}

export const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear()
    window.recaptchaVerifier = null
  }
}
