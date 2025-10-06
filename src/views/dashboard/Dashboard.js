import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CBadge,
  CButtonGroup,
  CContainer,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSave, cilX, cilArrowLeft } from '@coreui/icons'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get student data and mode from navigation state
  const studentData = location.state?.student
  const mode = location.state?.mode || 'view'

  const [isEditMode, setIsEditMode] = useState(mode === 'edit')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(studentData || {})

  useEffect(() => {
    if (!studentData) {
      // If no student data passed, fetch from API (fallback)
      fetchStudentData()
    } else {
      setFormData(studentData)
    }
  }, [studentData])

  const fetchStudentData = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://cosmiccharm.in/api/enquiries')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setFormData(data[0] || {})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Add your save logic here - API call to update student
      const response = await fetch(`https://cosmiccharm.in/api/enquiries/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update student data')
      }

      alert('Student data updated successfully!')
      setIsEditMode(false)
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Error updating student data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(studentData) // Reset to original data
    setIsEditMode(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toISOString().split('T')[0] // Return YYYY-MM-DD format for input
    } catch (error) {
      return ''
    }
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  if (loading && !studentData) {
    return (
      <CContainer>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading student data...</div>
        </div>
      </CContainer>
    )
  }

  if (error && !studentData) {
    return (
      <CContainer>
        <div className="text-center text-danger p-4">
          <h5>Error: {error}</h5>
        </div>
      </CContainer>
    )
  }

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <CContainer>
        <div className="text-center p-4">
          <h5>No student data available.</h5>
          <CButton color="primary" onClick={() => navigate(-1)} className="mt-3">
            Go Back
          </CButton>
        </div>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-4">
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Student Dashboard</h2>
              <div className="text-muted">
                {isEditMode ? 'Edit Mode' : 'View Mode'} - {formData.First_Name}{' '}
                {formData.Last_Name}
              </div>
            </div>
            <div>
              {!isEditMode ? (
                <CButtonGroup>
                  <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Back
                  </CButton>
                  <CButton color="warning" onClick={() => setIsEditMode(true)}>
                    <CIcon icon={cilPencil} className="me-2" />
                    Edit
                  </CButton>
                </CButtonGroup>
              ) : (
                <CButtonGroup>
                  <CButton color="secondary" variant="outline" onClick={handleCancel}>
                    <CIcon icon={cilX} className="me-2" />
                    Cancel
                  </CButton>
                  <CButton color="success" onClick={handleSave} disabled={loading}>
                    <CIcon icon={cilSave} className="me-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </CButton>
                </CButtonGroup>
              )}
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Profile Header Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={2} className="text-center">
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: '3px solid #007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {formData.Student_Photo && formData.Student_Photo !== 'none' ? (
                  <img
                    src={formData.Student_Photo}
                    alt="Student Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                <div style={{ display: formData.Student_Photo ? 'none' : 'block' }}>No Image</div>
              </div>
            </CCol>
            <CCol md={10}>
              <h3 className="mb-1">
                {formData.First_Name} {formData.Last_Name}
              </h3>
              <div className="text-muted mb-2">
                Admission No: <strong>{formData.Admission_Number}</strong>
              </div>
              <div className="d-flex gap-2">
                <CBadge color="primary">Class {formData.Class}</CBadge>
                <CBadge color="secondary">Section {formData.Section}</CBadge>
                <CBadge color="info">{formData.Category}</CBadge>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Personal Information */}
      <CRow>
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Personal Information</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>First Name</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="First_Name"
                      value={formData.First_Name || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.First_Name || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Last Name</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="Last_Name"
                      value={formData.Last_Name || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.Last_Name || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Roll Number</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="Roll_Number"
                      value={formData.Roll_Number || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.Roll_Number || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Date of Birth</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      type="date"
                      name="Date_of_Birth"
                      value={formatDate(formData.Date_of_Birth)}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">
                      {formatDisplayDate(formData.Date_of_Birth)}
                    </div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Gender</CFormLabel>
                  {isEditMode ? (
                    <CFormSelect
                      name="Gender"
                      value={formData.Gender || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </CFormSelect>
                  ) : (
                    <div className="form-control-plaintext">{formData.Gender || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Blood Group</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="Blood_Group"
                      value={formData.Blood_Group || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.Blood_Group || 'N/A'}</div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Academic Information</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Class</CFormLabel>
                  {isEditMode ? (
                    <CFormSelect
                      name="Class"
                      value={formData.Class || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Class</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                    </CFormSelect>
                  ) : (
                    <div className="form-control-plaintext">Class {formData.Class || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Section</CFormLabel>
                  {isEditMode ? (
                    <CFormSelect
                      name="Section"
                      value={formData.Section || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </CFormSelect>
                  ) : (
                    <div className="form-control-plaintext">
                      Section {formData.Section || 'N/A'}
                    </div>
                  )}
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Category</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="Category"
                      value={formData.Category || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.Category || 'N/A'}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>House</CFormLabel>
                  {isEditMode ? (
                    <CFormInput
                      name="House"
                      value={formData.House || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{formData.House || 'N/A'}</div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Contact Information */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Contact Information</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3">
            <CCol md={4}>
              <CFormLabel>Mobile Number</CFormLabel>
              {isEditMode ? (
                <CFormInput
                  name="Mobile_Number"
                  value={formData.Mobile_Number || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-control-plaintext">{formData.Mobile_Number || 'N/A'}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel>Email</CFormLabel>
              {isEditMode ? (
                <CFormInput
                  type="email"
                  name="Email"
                  value={formData.Email || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-control-plaintext">{formData.Email || 'N/A'}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel>Father's Name</CFormLabel>
              {isEditMode ? (
                <CFormInput
                  name="Father_Name"
                  value={formData.Father_Name || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-control-plaintext">{formData.Father_Name || 'N/A'}</div>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Dashboard
