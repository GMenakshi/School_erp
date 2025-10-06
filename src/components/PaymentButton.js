import React, { useState } from 'react'
import useRazorpay from '../hooks/useRazorpay' // Adjust the import path as needed
import './PaymentButton.css' // Add this import

// Fix for Vite/browser environment - API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cosmiccharm.in/api'

/**
 * A button component to initiate a Razorpay payment.
 * @param {object} props - The component props.
 * @param {object} props.feeDetails - An object containing payment details.
 * @param {number} props.feeDetails.amount - The amount to be paid.
 * @param {string} props.feeDetails.studentId - The ID of the student.
 * @param {string} props.feeDetails.feeType - The type of fee being paid.
 * @param {number} props.feeDetails.feeId - The fee ID from database.
 * @param {object} props.studentDetails - Student information for prefill.
 * @param {function} props.onPaymentSuccess - Success callback.
 * @param {function} props.onPaymentFailure - Failure callback.
 */
const PaymentButton = ({ feeDetails, studentDetails, onPaymentSuccess, onPaymentFailure }) => {
  const isRazorpayLoaded = useRazorpay()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      const errorMsg = 'Razorpay is not loaded yet. Please wait a moment and try again.'
      setError(errorMsg)
      alert(errorMsg)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('Initiating payment for:', feeDetails) // Debug log

      // 1. Create a payment order on your server with CORRECT API URL
      const orderResponse = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          amount: feeDetails.amount,
          currency: 'INR',
          studentId: feeDetails.studentId,
          feeType: feeDetails.feeType,
          feeId: feeDetails.feeId || null,
          discount: feeDetails.discount || 0,
          fine: feeDetails.fine || 0,
        }),
      })

      console.log('Order response status:', orderResponse.status) // Debug log

      // Enhanced error handling for non-JSON responses
      const contentType = orderResponse.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await orderResponse.text()
        console.error('Non-JSON response:', errorText)
        throw new Error(`Server returned non-JSON response: ${orderResponse.status}`)
      }

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error('Order creation failed:', errorData)
        throw new Error(
          errorData.message || `Failed to create payment order (${orderResponse.status})`,
        )
      }

      const orderData = await orderResponse.json()
      console.log('Order created successfully:', orderData) // Debug log

      // Validate response structure
      if (!orderData.success) {
        throw new Error(orderData.message || 'Payment order creation failed')
      }

      if (!orderData.orderId || !orderData.key_id) {
        throw new Error('Invalid payment order response - missing required fields')
      }

      // 2. Configure Razorpay options
      const options = {
        key: orderData.key_id, // Your Razorpay Key ID from the backend
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || 'INR',
        name: 'NeXaric Portal',
        description: `Payment for ${feeDetails.feeType}`,
        order_id: orderData.orderId,

        // 3. Define the handler function for payment success
        handler: async function (response) {
          try {
            console.log('Payment completed, verifying...', response) // Debug log

            const verificationBody = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentId: feeDetails.studentId,
              feeType: feeDetails.feeType,
              amount: feeDetails.amount,
              feeId: feeDetails.feeId || orderData.feeId,
              discount: feeDetails.discount || 0,
              fine: feeDetails.fine || 0,
            }

            const verificationResponse = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: JSON.stringify(verificationBody),
            })

            console.log('Verification response status:', verificationResponse.status) // Debug log

            const verificationContentType = verificationResponse.headers.get('content-type')
            if (!verificationContentType || !verificationContentType.includes('application/json')) {
              const errorText = await verificationResponse.text()
              console.error('Verification non-JSON response:', errorText)
              throw new Error('Invalid verification response from server')
            }

            const result = await verificationResponse.json()
            console.log('Verification result:', result) // Debug log

            if (result.success) {
              console.log('Payment verified successfully!') // Debug log
              onPaymentSuccess?.(result, response)
              alert(
                `Payment Successful! 🎉\nPayment ID: ${response.razorpay_payment_id}\nAmount: ₹${feeDetails.amount}`,
              )
            } else {
              throw new Error(result.message || 'Payment verification failed')
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError)
            onPaymentFailure?.(verifyError)
            alert(
              `Payment verification failed: ${verifyError.message}\nPayment ID: ${response.razorpay_payment_id}\nPlease contact support with this payment ID.`,
            )
          }
        },

        prefill: {
          name: studentDetails?.name || studentDetails?.studentName || 'Student',
          email: studentDetails?.email || studentDetails?.parentEmail || '',
          contact: studentDetails?.phone || studentDetails?.mobile || '',
        },

        notes: {
          student_id: feeDetails.studentId,
          fee_type: feeDetails.feeType,
          fee_id: feeDetails.feeId,
        },

        theme: {
          color: '#321fdb', // Your brand color
        },

        modal: {
          ondismiss: function () {
            setIsLoading(false)
            console.log('Payment modal dismissed')
          },
        },
      }

      // 4. Open the Razorpay payment modal
      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failed:', response.error)
        const errorMsg = `Payment Failed: ${response.error.description}`
        setError(errorMsg)
        onPaymentFailure?.(response.error)
        alert(
          `${errorMsg}\n\nError Code: ${response.error.code}\nPlease try again or contact support.`,
        )
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Payment initiation error:', error)
      const errorMsg = `Could not initiate payment: ${error.message}`
      setError(errorMsg)
      onPaymentFailure?.(error)
      alert(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="payment-button-container">
      {error && (
        <div style={errorStyle}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={closeButtonStyle}>
            ×
          </button>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || !isRazorpayLoaded}
        style={{
          ...buttonStyle,
          opacity: isLoading || !isRazorpayLoaded ? 0.6 : 1,
          cursor: isLoading || !isRazorpayLoaded ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? (
          <>
            <span style={spinnerStyle}>⟳</span>
            Processing...
          </>
        ) : !isRazorpayLoaded ? (
          'Loading Payment Gateway...'
        ) : (
          `Pay ₹${feeDetails.amount} Now`
        )}
      </button>

      <div style={infoStyle}>
        <small>🔒 Secure payment powered by Razorpay | PCI DSS Compliant</small>
      </div>
    </div>
  )
}

// Styles - Fixed to not use dynamic style injection
const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '600',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '48px',
  width: '100%',
}

const errorStyle = {
  backgroundColor: '#f8d7da',
  border: '1px solid #f5c6cb',
  color: '#721c24',
  padding: '12px',
  borderRadius: '4px',
  marginBottom: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
}

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#721c24',
  padding: '0',
  marginLeft: '10px',
}

const infoStyle = {
  textAlign: 'center',
  marginTop: '8px',
  color: '#6c757d',
  fontSize: '12px',
}

const spinnerStyle = {
  animation: 'spin 1s linear infinite',
  display: 'inline-block',
}

export default PaymentButton
