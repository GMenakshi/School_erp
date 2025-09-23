import React, { useState, useEffect  } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { auth } from '../../../firebase' // This is correctimport { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const Login = () => {
  // --- State Management ---
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // Controls the UI
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate() // For redirection after login

  // --- This useEffect hook runs only once when the component loads ---
  useEffect(() => {
    generateRecaptcha()
  }, []) // The empty array is crucial, it makes this run only once.

  // --- Firebase Logic ---
  const generateRecaptcha = () => {
    // This creates an invisible reCAPTCHA verifier required by Firebase
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    })
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (phone.length < 10) {
      return setError('Please enter a valid phone number with country code.')
    }
    try {
      
      const appVerifier = window.recaptchaVerifier
      const confirmation = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier)
      setConfirmationResult(confirmation)
      setStep('otp') // Move to the next UI step
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      return setError('Please enter a valid 6-digit OTP.')
    }
    try {
      // 1. Confirm the OTP with Firebase
      const result = await confirmationResult.confirm(otp)
      const firebaseToken = await result.user.getIdToken()

      // 2. Send the Firebase token to your backend
      const response = await fetch('https://api.cosmiccharm.in/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Backend login failed.')

      // 3. Save your app's session token and redirect
      localStorage.setItem('token', data.token)
      navigate('/dashboard') // Redirect to a protected route
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">
                      {step === 'phone'
                        ? 'Sign In with your phone number'
                        : 'Enter the code you received'}
                    </p>

                    {/* Conditionally render Phone Input */}
                    {step === 'phone' && (
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="tel"
                          placeholder="Phone Number (e.g. 91...)"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </CInputGroup>
                    )}

                    {/* Conditionally render OTP Input */}
                    {step === 'otp' && (
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="6-Digit OTP"
                          autoComplete="one-time-code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </CInputGroup>
                    )}

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          {step === 'phone' ? 'Send OTP' : 'Verify & Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                    {error && <p className="text-danger mt-3">{error}</p>}
                  </CForm>
                  <div id="recaptcha-container"></div>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
