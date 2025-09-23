import React, { useState, useEffect } from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCardFooter,
  CPagination,
  CPaginationItem,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilList,
  cilPencil,
  cilMoney,
  cilCopy,
  cilPrint,
  cilCloudDownload,
} from '@coreui/icons'

// --- Student Details Component ---
const StudentDetails = () => {
  // --- Configuration & State Management ---
  const API_URL = 'https://cosmiccharm.in/api/enquiries'
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // State for the filter inputs
  const [filters, setFilters] = useState({
    class: '2',
    section: 'A',
    keyword: '',
  })

  // --- API Functions ---
  const fetchStudents = async () => {
    setLoading(true)
    const queryParams = new URLSearchParams()
    if (filters.class) queryParams.append('class', filters.class)
    if (filters.section) queryParams.append('section', filters.section)
    if (filters.keyword) queryParams.append('keyword', filters.keyword)

    const fullUrl = `${API_URL}?${queryParams.toString()}`

    try {
      const response = await fetch(fullUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    fetchStudents()
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US')
  }

  return (
    <>
      {/* Filter Card */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Select Criteria</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={4}>
              <CFormLabel>Class</CFormLabel>
              <CFormSelect name="class" value={filters.class} onChange={handleFilterChange}>
                <option value="">Select Class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect name="section" value={filters.section} onChange={handleFilterChange}>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Search By Keyword</CFormLabel>
              <CFormInput
                type="text"
                name="keyword"
                placeholder="Search by Student Name, Roll Number..."
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol className="text-end">
              <CButton color="primary" onClick={handleSearch}>
                <CIcon icon={cilSearch} className="me-2" /> Search
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Student List Card */}
      <CCard>
        <CCardHeader>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink href="#" active>
                <CIcon icon={cilList} className="me-2" /> List View
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">Details View</CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3 align-items-center">
            <CCol md={8}>
              <CFormInput type="text" placeholder="Search..." />
            </CCol>
            <CCol md={4} className="text-end">
              <CButtonGroup>
                <CButton variant="outline" color="secondary">
                  <CIcon icon={cilCopy} />
                </CButton>
                <CButton variant="outline" color="secondary">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
                <CButton variant="outline" color="secondary">
                  <CIcon icon={cilPrint} />
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="list-view-tab" visible>
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
                        Loading...
                      </CTableDataCell>
                    </CTableRow>
                  ) : students.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="10" className="text-center">
                        No students found.
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    students.map((item) => (
                      // FIX: Use the correct field names from your API response
                      <CTableRow key={item.id || item.Admission_Number}>
                        <CTableDataCell>{item.Admission_Number}</CTableDataCell>
                        <CTableDataCell>
                          <div>{`${item.First_Name || ''} ${item.Last_Name || ''}`.trim()}</div>
                        </CTableDataCell>
                        <CTableDataCell>{item.Roll_Number}</CTableDataCell>
                        <CTableDataCell>{item.Class}</CTableDataCell>
                        <CTableDataCell>{item.Father_Name}</CTableDataCell>
                        <CTableDataCell>{formatDate(item.Date_of_Birth)}</CTableDataCell>
                        <CTableDataCell>{item.Gender}</CTableDataCell>
                        <CTableDataCell>{item.Category}</CTableDataCell>
                        <CTableDataCell>{item.Mobile_Number}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButtonGroup>
                            <CButton color="dark" size="sm" variant="outline" title="View Details">
                              <CIcon icon={cilList} />
                            </CButton>
                            <CButton color="warning" size="sm" variant="outline" title="Edit">
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton color="success" size="sm" variant="outline" title="Fees">
                              <CIcon icon={cilMoney} />
                            </CButton>
                          </CButtonGroup>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CTabPane>
          </CTabContent>
        </CCardBody>
        <CCardFooter className="d-flex justify-content-between align-items-center">
          <span>
            Records: 1 to {students.length} of {students.length}
          </span>
          <CPagination align="end" className="mb-0">
            <CPaginationItem disabled>Previous</CPaginationItem>
            <CPaginationItem active>1</CPaginationItem>
            <CPaginationItem>Next</CPaginationItem>
          </CPagination>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default StudentDetails
