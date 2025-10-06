import React, { useState, useEffect } from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilSearch } from '@coreui/icons'

// Define options for the dropdown menus
const classOptions = [
  'Nursery',
  'LKG',
  'UKG',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
]

const sourceOptions = ['Walk-in', 'Online Enquiry', 'Referral', 'Advertisement']

const AdmissionEnquiry = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentEnquiry, setCurrentEnquiry] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // State for the filter inputs
  const [filters, setFilters] = useState({
    class: '',
    source: '',
    fromDate: '',
    toDate: '',
    status: 'Active',
  })

  // Define the base API URL
  const API_URL = 'https://cosmiccharm.in/api/enquiries'

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchEnquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to fetch data, now with filtering capabilities
  const fetchEnquiries = async () => {
    setLoading(true)
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}?${queryString}`, {
        headers: {
          'x-auth-token': token,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      setEnquiries(data)
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handler to update the filters state
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleAdd = () => {
    setCurrentEnquiry({
      First_Name: '',
      Mobile_Number: '',
      Email: '',
      Postal_Details: '',
      Class: '',
      Admission_Date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      Date_of_Birth: '',
      Father_Name: '',
    })
    setIsEditing(false)
    setModalVisible(true)
  }

  const handleEdit = (enquiry) => {
    const formattedEnquiry = {
      ...enquiry,
      // Take the first 10 characters (the 'YYYY-MM-DD' part) of the date string
      Admission_Date: enquiry.Admission_Date ? enquiry.Admission_Date.substring(0, 10) : '',
      Date_of_Birth: enquiry.Date_of_Birth ? enquiry.Date_of_Birth.substring(0, 10) : '',
    }
    setCurrentEnquiry(formattedEnquiry)
    setIsEditing(true)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to delete enquiry')
        }
        fetchEnquiries() // Refresh the list
      } catch (error) {
        console.error('Error deleting enquiry:', error)
      }
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    // Correct - each declaration on its own line
    const url = isEditing ? `${API_URL}/${currentEnquiry.Admission_Number}` : API_URL
    // Correct
    const method = isEditing ? 'PUT' : 'POST'
    try {
      // Conditionally create the payload: an object for editing, an array for adding.
      const bodyPayload = isEditing ? currentEnquiry : [currentEnquiry]

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(bodyPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to save enquiry')
      }

      setModalVisible(false)
      fetchEnquiries() // Refresh the list
    } catch (error) {
      console.error('Error saving enquiry:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEnquiry({ ...currentEnquiry, [name]: value })
  }

  return (
    <>
      {/* Search/Filter Card */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Select Criteria</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={2}>
              <CFormLabel>Class</CFormLabel>
              <CFormSelect name="class" value={filters.class} onChange={handleFilterChange}>
                <option value="">Select</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormLabel>Source</CFormLabel>
              <CFormSelect name="source" value={filters.source} onChange={handleFilterChange}>
                <option value="">Select</option>
                {sourceOptions.map((sourceName) => (
                  <option key={sourceName} value={sourceName}>
                    {sourceName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormLabel>Enquiry From Date</CFormLabel>
              <CFormInput
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </CCol>
            <CCol md={2}>
              <CFormLabel>Enquiry To Date</CFormLabel>
              <CFormInput
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </CCol>
            <CCol md={2}>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" className="w-100" onClick={fetchEnquiries}>
                <CIcon icon={cilSearch} className="me-2" /> Search
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Enquiry List Card */}
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Admission Enquiry</strong>
          <CButton color="success" onClick={handleAdd}>
            <CIcon icon={cilPlus} className="me-2" /> Add
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Admission No</CTableHeaderCell>
                <CTableHeaderCell>Student Name</CTableHeaderCell>
                <CTableHeaderCell>Roll No.</CTableHeaderCell>
                <CTableHeaderCell>Class</CTableHeaderCell>
                <CTableHeaderCell>Father Name</CTableHeaderCell>
                <CTableHeaderCell>Date of Birth</CTableHeaderCell>
                <CTableHeaderCell>Gender</CTableHeaderCell>
                <CTableHeaderCell>Category</CTableHeaderCell>
                <CTableHeaderCell>Mobile Number</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center">
                    Loading data from the database...
                  </CTableDataCell>
                </CTableRow>
              ) : enquiries.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center">
                    No admission records found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                enquiries.map((item) => (
                  <CTableRow key={item.id || item.Admission_Number}>
                    <CTableDataCell>{item.Admission_Number}</CTableDataCell>
                    <CTableDataCell>
                      {`${item.First_Name || ''} ${item.Last_Name || ''}`.trim()}
                    </CTableDataCell>
                    <CTableDataCell>{item.Roll_Number}</CTableDataCell>
                    <CTableDataCell>{item.Class}</CTableDataCell>
                    <CTableDataCell>{item.Father_Name}</CTableDataCell>
                    <CTableDataCell>
                      {item.Date_of_Birth
                        ? new Date(item.Date_of_Birth).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>{item.Gender}</CTableDataCell>
                    <CTableDataCell>{item.Category}</CTableDataCell>
                    <CTableDataCell>{item.Mobile_Number}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          variant="outline"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          title="Delete"
                          onClick={() => handleDelete(item.Admission_Number)} // Use the correct property
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Add/Edit Modal */}
      {currentEnquiry && (
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader>
            <CModalTitle>{isEditing ? 'Edit' : 'Add'} Admission Record</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleFormSubmit}>
            <CModalBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>First Name *</CFormLabel>
                  <CFormInput
                    name="First_Name"
                    value={currentEnquiry.First_Name}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Mobile Number *</CFormLabel>
                  <CFormInput
                    name="Mobile_Number"
                    value={currentEnquiry.Mobile_Number}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    name="Email"
                    value={currentEnquiry.Email}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Class</CFormLabel>
                  <CFormInput
                    name="Class"
                    value={currentEnquiry.Class}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Father's Name</CFormLabel>
                  <CFormInput
                    name="Father_Name"
                    value={currentEnquiry.Father_Name}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Date of Birth</CFormLabel>
                  <CFormInput
                    type="date"
                    name="Date_of_Birth"
                    value={currentEnquiry.Date_of_Birth}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Postal Details (Address)</CFormLabel>
                  <CFormInput
                    name="Postal_Details"
                    value={currentEnquiry.Postal_Details}
                    onChange={handleInputChange}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Save
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      )}
    </>
  )
}

export default AdmissionEnquiry
