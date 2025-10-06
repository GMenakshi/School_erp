import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButtonGroup,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint, cilMoney, cilPlus, cilBackspace } from '@coreui/icons'
import useRazorpay from 'src/hooks/useRazorpay' // Make sure this path is correct
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CProgress 
} from '@coreui/react'
const Validation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [studentData, setStudentData] = useState(null)
  const [feesData, setFeesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFees, setSelectedFees] = useState([])

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Razorpay Hook
  const isRazorpayLoaded = useRazorpay()

  // Modal form state
  const [modalForm, setModalForm] = useState({
    fees: '',
    date: new Date().toISOString().split('T')[0],
    payingAmount: '',
    discount: '0',
    fine: '',
    paymentMode: 'Cash',
    note: '',
  })

  const fetchStudentFees = async (admissionNumber) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://cosmiccharm.in/api/feestructures/${admissionNumber}`)
      if (!response.ok) {
        throw new Error('Failed to fetch fees data')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setFeesData(data)
      } else {
        setFeesData([])
        console.error('API did not return an array:', data)
      }
    } catch (err) {
      setError(err.message)
      setFeesData([])
    } finally {
      setLoading(false)
    }
  }

  const safeNumber = (value) => {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }

  const safeFeesData = Array.isArray(feesData) ? feesData : []
  const totalAmount = safeFeesData.reduce((acc, fee) => acc + safeNumber(fee.amount), 0)
  const totalFine = safeFeesData.reduce((acc, fee) => acc + safeNumber(fee.fine), 0)
  const totalDiscount = safeFeesData.reduce((acc, fee) => acc + safeNumber(fee.discount), 0)
  const totalPaid = safeFeesData.reduce((acc, fee) => acc + safeNumber(fee.paid), 0)
  const totalBalance = safeFeesData.reduce((acc, fee) => acc + safeNumber(fee.balance), 0)

  useEffect(() => {
    if (location.state?.student) {
      const student = location.state.student
      setStudentData(student)
      if (student.admissionNo) {
        fetchStudentFees(student.admissionNo)
      } else {
        setLoading(false)
        setError('No Admission Number found for fetching fees.')
      }
    } else {
      setLoading(false)
      setError('No student data available. Please select a student.')
    }
  }, [location.state])

  const handleFeeSelection = (feeId) => {
    setSelectedFees((prev) => {
      if (prev.includes(feeId)) {
        return prev.filter((id) => id !== feeId)
      } else {
        return [...prev, feeId]
      }
    })
  }

  const handleOpenModal = (fee) => {
    setSelectedFee(fee)
    setModalForm({
      fees: safeNumber(fee.amount).toFixed(2),
      date: new Date().toISOString().split('T')[0],
      payingAmount: safeNumber(fee.balance).toFixed(2),
      discount: '0',
      fine: safeNumber(fee.fine).toFixed(2),
      paymentMode: 'Cash',
      note: '',
    })
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedFee(null)
    setModalForm({
      fees: '',
      date: new Date().toISOString().split('T')[0],
      payingAmount: '',
      discount: '0',
      fine: '',
      paymentMode: 'Cash',
      note: '',
    })
  }

  const handleModalInputChange = (field, value) => {
    setModalForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCollectFees = async () => {
    if (!selectedFee) return

    const paymentMode = modalForm.paymentMode
    const isOnlinePayment = ['UPI', 'Card', 'Bank Transfer'].includes(paymentMode)

    setModalLoading(true)

    // --- ONLINE PAYMENT LOGIC (RAZORPAY) ---
    if (isOnlinePayment) {
      if (!isRazorpayLoaded) {
        alert('Payment gateway is loading. Please wait a moment and try again.')
        setModalLoading(false)
        return
      }

      try {
        // Step 1: Create a payment order on your backend
        const orderResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: modalForm.payingAmount,
            currency: 'INR',
            studentId: studentData.admissionNo,
            feeType: selectedFee.name,
            notes: {
              discount: modalForm.discount,
              fine: modalForm.fine,
            },
          }),
        })

        if (!orderResponse.ok) {
          throw new Error('Failed to create payment order on the server.')
        }
        const orderData = await orderResponse.json()

        // Step 2: Configure and open the Razorpay modal
        const options = {
          key: orderData.key_id, // Your Razorpay Key from the backend
          amount: orderData.amount, // Amount in paise from the backend
          currency: orderData.currency,
          name: 'NeXaric School Fees',
          description: `Payment for ${selectedFee.name}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            // Step 3: Verify the payment on your backend
            const verificationBody = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentId: studentData.admissionNo,
              feeType: selectedFee.name,
              amount: modalForm.payingAmount,
            }

            const verificationResponse = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verificationBody),
            })

            const result = await verificationResponse.json()
            if (result.success) {
              alert('Payment successful and verified!')
              handleCloseModal()
              fetchStudentFees(studentData.admissionNo) // Refresh the fees list
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: studentData.studentName,
            contact: studentData.mobile,
          },
          theme: {
            color: '#3C4B64', // Matches your CoreUI theme
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()

        rzp.on('payment.failed', function (response) {
          console.error('Razorpay Payment Failed:', response.error)
          alert(`Payment Failed: ${response.error.description}`)
        })
      } catch (error) {
        console.error('Error during payment process:', error)
        alert('An error occurred: ' + error.message)
      } finally {
        // We set loading to false here because Razorpay's own modal takes over.
        setModalLoading(false)
      }
    } else {
      // --- OFFLINE PAYMENT LOGIC (Cash, Cheque, DD) ---
      try {
        console.log('Collecting OFFLINE fees for:', selectedFee.name, modalForm)
        // IMPORTANT: Replace this with your actual API call to save offline payment data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert('Fees collected successfully!')
        handleCloseModal()
        if (studentData?.admissionNo) {
          fetchStudentFees(studentData.admissionNo)
        }
      } catch (error) {
        console.error('Error collecting offline fees:', error)
        alert('Error collecting fees: ' + error.message)
      } finally {
        setModalLoading(false)
      }
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Fees</h2>
        <CButton color="dark" variant="outline" onClick={() => navigate(-1)}>
          <CIcon icon={cilBackspace} className="me-2" />
          Back
        </CButton>
      </div>

      <CCard className="mb-4">
        <CCardBody>
          {studentData ? (
            <CRow className="g-3">
              <CCol md={2} className="d-flex flex-column align-items-center">
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                  }}
                >
                  No Image
                </div>
              </CCol>
              <CCol md={5}>
                <div className="mb-2">
                  <strong>Name:</strong> {studentData.studentName}
                </div>
                <div className="mb-2">
                  <strong>Father Name:</strong> {studentData.fatherName}
                </div>
                <div className="mb-2">
                  <strong>Mobile Number:</strong> {studentData.mobile}
                </div>
                <div className="mb-2">
                  <strong>Category:</strong> General
                </div>
              </CCol>
              <CCol md={5}>
                <div className="mb-2">
                  <strong>Class (Section):</strong> {studentData.class} ({studentData.section})
                </div>
                <div className="mb-2">
                  <strong>Admission No:</strong> {studentData.admissionNo}
                </div>
                <div className="mb-2">
                  <strong>Roll Number:</strong> {studentData.Roll_Number || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>RTE:</strong> <span className="text-danger">No</span>
                </div>
              </CCol>
            </CRow>
          ) : (
            <div className="text-center p-3">
              <p>No student data available. Please select a student from the list.</p>
              <CButton color="primary" onClick={() => navigate('/buttons/buttons')}>
                Go to Student List
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      <div className="d-flex justify-content-between mb-3 align-items-center">
        <div>
          <CButton color="primary" className="me-2">
            <CIcon icon={cilPrint} className="me-2" />
            Print Selected
          </CButton>
          <CButton color="success">
            <CIcon icon={cilMoney} className="me-2" />
            Collect Selected
          </CButton>
        </div>
        <div className="text-end">Date: {new Date().toLocaleDateString('en-US')}</div>
      </div>

      <CTable striped responsive className="mb-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" style={{ width: '40px' }} className="text-center">
              <CFormCheck disabled />
            </CTableHeaderCell>
            <CTableHeaderCell>Fees</CTableHeaderCell>
            <CTableHeaderCell>Due Date</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Amount (₹)</CTableHeaderCell>
            <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
            <CTableHeaderCell>Fine (₹)</CTableHeaderCell>
            <CTableHeaderCell>Paid (₹)</CTableHeaderCell>
            <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center">
                Loading fees data...
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-danger">
                Error fetching data: {error}
              </CTableDataCell>
            </CTableRow>
          ) : feesData.length > 0 ? (
            feesData.map((fee) => (
              <React.Fragment key={fee.id}>
                <CTableRow>
                  <CTableDataCell className="text-center">
                    <CFormCheck
                      checked={selectedFees.includes(fee.id)}
                      onChange={() => handleFeeSelection(fee.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{fee.name}</CTableDataCell>
                  <CTableDataCell>{fee.dueDate}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={fee.status === 'Paid' ? 'success' : 'danger'}>
                      {fee.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    ₹{safeNumber(fee.amount).toFixed(2)}{' '}
                    {safeNumber(fee.fine) > 0 && (
                      <span className="text-danger ms-2">+₹{safeNumber(fee.fine).toFixed(2)}</span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>₹{safeNumber(fee.discount).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>₹{safeNumber(fee.fine).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>₹{safeNumber(fee.paid).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>₹{safeNumber(fee.balance).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup>
                      <CButton color="primary" variant="outline" size="sm">
                        <CIcon icon={cilPrint} />
                      </CButton>
                      <CButton
                        color="success"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(fee)}
                      >
                        <CIcon icon={cilPlus} />
                      </CButton>
                    </CButtonGroup>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center">
                No fees data found.
              </CTableDataCell>
            </CTableRow>
          )}
          <CTableRow className="fw-bold">
            <CTableDataCell colSpan="4" className="text-end">
              Grand Total
            </CTableDataCell>
            <CTableDataCell>₹{totalAmount.toFixed(2)}</CTableDataCell>
            <CTableDataCell>₹{totalDiscount.toFixed(2)}</CTableDataCell>
            <CTableDataCell>₹{totalFine.toFixed(2)}</CTableDataCell>
            <CTableDataCell>₹{totalPaid.toFixed(2)}</CTableDataCell>
            <CTableDataCell>₹{totalBalance.toFixed(2)}</CTableDataCell>
            <CTableDataCell></CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg" scrollable>
        <CModalHeader onClose={handleCloseModal}>
          <CModalTitle>
            {selectedFee ? `Fee Collection: ${selectedFee.name}` : 'Collect Fees'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="fees">
                  Fees (₹) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="fees"
                  value={modalForm.fees}
                  onChange={(e) => handleModalInputChange('fees', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="date">
                  Date <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="date"
                  id="date"
                  value={modalForm.date}
                  onChange={(e) => handleModalInputChange('date', e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="payingAmount">
                  Paying Amount (₹) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="payingAmount"
                  value={modalForm.payingAmount}
                  onChange={(e) => handleModalInputChange('payingAmount', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Discount Group</CFormLabel>
                <div className="text-danger">No Discount Available</div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="discount">
                  Discount (₹) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="discount"
                  value={modalForm.discount}
                  onChange={(e) => handleModalInputChange('discount', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="fine">
                  Fine (₹) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="fine"
                  value={modalForm.fine}
                  onChange={(e) => handleModalInputChange('fine', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Payment Mode</CFormLabel>
                <div className="d-flex gap-3 mt-2">
                  {['Cash', 'Cheque', 'DD', 'Bank Transfer', 'UPI', 'Card'].map((mode) => (
                    <CFormCheck
                      key={mode}
                      type="radio"
                      name="paymentMode"
                      id={mode}
                      label={mode}
                      checked={modalForm.paymentMode === mode}
                      onChange={() => handleModalInputChange('paymentMode', mode)}
                    />
                  ))}
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="note">Note</CFormLabel>
                <CFormTextarea
                  id="note"
                  rows={3}
                  value={modalForm.note}
                  onChange={(e) => handleModalInputChange('note', e.target.value)}
                  placeholder="Enter any additional notes..."
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancel
          </CButton>
          <CButton color="success" onClick={handleCollectFees} disabled={modalLoading}>
            {modalLoading ? 'Processing...' : '₹ Collect Fees'}
          </CButton>
          <CButton color="success" variant="outline" disabled={modalLoading}>
            ₹ Collect & Print
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Validation
