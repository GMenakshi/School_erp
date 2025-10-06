import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
// Make sure this path to PaymentButton.js is correct for your project
import PaymentButton from '../../../components/PaymentButton'

const FeePaymentPage = () => {
  // In a real application, you would fetch these details from an API
  // or pass them as props based on the logged-in user.
  const feeToPay = {
    amount: 2500, // The amount in your base currency (e.g., INR)
    studentId: 'STU_007', // Example student ID
    feeType: 'Semester Fee',
  }

  return (
    <CRow>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Online Fee Payment</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Please review the details below before proceeding with the payment.
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5>Fee Details:</h5>
              <p style={{ margin: '4px 0' }}>
                <strong>Student ID:</strong> {feeToPay.studentId}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Fee Type:</strong> {feeToPay.feeType}
              </p>
              <h4 style={{ marginTop: '1rem' }}>
                <strong>Amount to Pay:</strong> ₹{feeToPay.amount}
              </h4>
            </div>
            {/* Here we use the PaymentButton component we created */}
            <PaymentButton feeDetails={feeToPay} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FeePaymentPage
