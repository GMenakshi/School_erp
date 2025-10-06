import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import {
  doSendPhoneOTP,
  doVerifyPhoneOTP,
  doSignInWithGoogle,
  clearRecaptcha,
} from '../../../firebase/auth'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState('phone') // 'phone', 'google', 'demo'

  useEffect(() => {
    // Check if already authenticated
    const existingAuth = sessionStorage.getItem('authToken')
    if (existingAuth) {
      navigate('/dashboard', { replace: true })
      return
    }
  }, [navigate])

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formattedPhoneNumber = `+91${phoneNumber}`
      console.log('📱 Sending OTP to:', formattedPhoneNumber)

      const confirmationResult = await doSendPhoneOTP(formattedPhoneNumber)

      setVerificationId(confirmationResult.verificationId)
      setShowOtpInput(true)
      console.log('✅ OTP sent successfully')
    } catch (error) {
      console.error('❌ SMS send error:', error)
      setError(`Failed to send OTP: ${error.message}`)

      // Reset reCAPTCHA on error
      clearRecaptcha()
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const userCredential = await doVerifyPhoneOTP(verificationId, otp)
      const user = userCredential.user

      console.log('✅ Phone verification successful:', user)

      await handleAuthenticationSuccess(user, 'firebase_phone')
    } catch (error) {
      console.error('❌ OTP verification error:', error)
      setError(`Verification failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setError('')

    try {
      const userCredential = await doSignInWithGoogle()
      const user = userCredential.user

      console.log('✅ Google sign-in successful:', user)

      await handleAuthenticationSuccess(user, 'google')
    } catch (error) {
      console.error('❌ Google sign-in error:', error)
      setError(`Google sign-in failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthenticationSuccess = async (firebaseUser, method) => {
    try {
      // Create user data for your app
      const userData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Firebase User',
        phone: firebaseUser.phoneNumber || phoneNumber ? `+91${phoneNumber}` : '',
        email: firebaseUser.email || '',
        verified: true,
        method: method,
        loginTime: new Date().toISOString(),
        photoURL: firebaseUser.photoURL,
      }

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken()

      console.log('🎯 Logging in user:', userData)

      // Login with your auth context
      login(userData, idToken)

      // Try to sync with backend
      try {
        const response = await fetch('https://cosmiccharm.in/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            firebaseUser: {
              uid: firebaseUser.uid,
              phone: firebaseUser.phoneNumber,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
            },
            userData: userData,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Backend sync successful:', result)
        }
      } catch (backendError) {
        console.log('⚠️ Backend sync failed, continuing with frontend auth:', backendError.message)
      }

      // Navigate to dashboard
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('❌ Authentication processing error:', error)
      setError('Authentication processing failed. Please try again.')
    }
  }

  const handleDemoLogin = () => {
    const demoUser = {
      id: `demo_${Date.now()}`,
      name: 'Demo User',
      phone: '9876543210',
      email: 'demo@nexaric.com',
      verified: true,
      method: 'demo',
    }

    login(demoUser, `demo_token_${Date.now()}`)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        padding: '20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          maxWidth: '450px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎓</div>
        <h2 style={{ marginBottom: '10px' }}>NeXaric Portal</h2>
        <p style={{ opacity: 0.8, marginBottom: '30px', fontSize: '14px' }}>
          Choose your preferred login method
        </p>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: 'rgba(244, 67, 54, 0.2)',
              border: '1px solid rgba(244, 67, 54, 0.5)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Auth Method Tabs */}
        <div
          style={{
            display: 'flex',
            marginBottom: '30px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          {['phone', 'google'].map((method) => (
            <button
              key={method}
              onClick={() => {
                setAuthMethod(method)
                setError('')
                setShowOtpInput(false)
                setPhoneNumber('')
                setOtp('')
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: authMethod === method ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: authMethod === method ? 'bold' : 'normal',
              }}
            >
              {method === 'phone' ? '📱 Phone' : '🔍 Google'}
            </button>
          ))}
        </div>

        {/* Phone Authentication */}
        {authMethod === 'phone' && (
          <>
            {!showOtpInput ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '15px 12px',
                      borderRadius: '8px 0 0 8px',
                      fontSize: '16px',
                      minWidth: '50px',
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhoneNumber(value)
                      setError('')
                    }}
                    style={{
                      flex: 1,
                      padding: '15px',
                      border: 'none',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={sendOTP}
                  disabled={loading || phoneNumber.length !== 10}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: loading
                      ? 'rgba(255,255,255,0.1)'
                      : 'linear-gradient(45deg, #4CAF50, #45a049)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: phoneNumber.length !== 10 ? 0.5 : 1,
                  }}
                >
                  {loading ? '📱 Sending OTP...' : '📱 Send OTP'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.8 }}>
                  OTP sent to +91{phoneNumber}
                </p>

                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(value)
                    setError('')
                  }}
                  style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  disabled={loading}
                />

                <button
                  onClick={verifyOTP}
                  disabled={loading || otp.length !== 6}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: loading
                      ? 'rgba(255,255,255,0.1)'
                      : 'linear-gradient(45deg, #4CAF50, #45a049)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    opacity: otp.length !== 6 ? 0.5 : 1,
                  }}
                >
                  {loading ? '🔐 Verifying...' : '🔐 Verify OTP'}
                </button>

                <button
                  onClick={() => {
                    setShowOtpInput(false)
                    setOtp('')
                    setError('')
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ← Change Phone Number
                </button>
              </div>
            )}
          </>
        )}

        {/* Google Authentication */}
        {authMethod === 'google' && (
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(45deg, #db4437, #c23321)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {loading ? (
              '🔄 Signing in...'
            ) : (
              <>
                <span>🔍</span>
                Continue with Google
              </>
            )}
          </button>
        )}

        {/* Demo Login */}
        <div style={{ margin: '30px 0 20px', opacity: 0.6, fontSize: '14px' }}>OR</div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.5)',
            borderRadius: '8px',
            color: '#ffc107',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🚀 Demo Login (Skip Authentication)
        </button>

        {/* Hidden reCAPTCHA */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </div>
    </div>
  )
}

export default Login
