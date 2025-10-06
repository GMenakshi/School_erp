import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Add this import
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
  cilReload,
} from '@coreui/icons'

const StudentDetails = () => {
  const navigate = useNavigate() // Add navigation hook
  const API_URL = 'https://cosmiccharm.in/api/enquiries'
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    class: '',
    section: '',
    keyword: '',
    parent: '',
  })

  const fetchAllStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching data from:', API_URL)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched data:', data)

      const studentsArray = Array.isArray(data) ? data : []
      setAllStudents(studentsArray)
      setStudents(studentsArray)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      setError(error.message)
      setAllStudents([])
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllStudents()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    const { class: studentClass, section, keyword, parent } = filters

    const allFiltersEmpty = Object.values(filters).every((value) => value === '')

    if (allFiltersEmpty) {
      setStudents(allStudents)
      return
    }

    const filteredStudents = allStudents.filter((student) => {
      const matchesClass =
        studentClass === '' || (student.Class && student.Class.toString() === studentClass)

      const matchesSection =
        section === '' ||
        (student.Section && student.Section.toLowerCase() === section.toLowerCase())

      const matchesParent =
        parent === '' ||
        (student.Father_Name && student.Father_Name.toLowerCase() === parent.toLowerCase())

      const matchesKeyword =
        keyword === '' ||
        (student.First_Name && student.First_Name.toLowerCase().includes(keyword.toLowerCase())) ||
        (student.Last_Name && student.Last_Name.toLowerCase().includes(keyword.toLowerCase())) ||
        (student.Roll_Number && student.Roll_Number.toString().includes(keyword)) ||
        (student.Admission_Number && student.Admission_Number.toString().includes(keyword))

      return matchesClass && matchesSection && matchesParent && matchesKeyword
    })

    setStudents(filteredStudents)
  }

  const clearFilters = () => {
    setFilters({
      class: '',
      section: '',
      keyword: '',
      parent: '',
    })
    setStudents(allStudents)
  }

  // Navigation handlers
  const handleViewDetails = (student) => {
    // Navigate to dashboard with student data and view mode
    navigate('/dashboard', {
      state: {
        student: student,
        mode: 'view', // View mode for dashboard
      },
    })
  }

  const handleEditStudent = (student) => {
    // Navigate to dashboard with student data and edit mode
    navigate('/dashboard', {
      state: {
        student: student,
        mode: 'edit', // Edit mode for dashboard
      },
    })
  }

  const handleFeesManagement = (student) => {
    // Navigate to fees validation page (your existing fees flow)
    navigate('/validation', {
      state: {
        student: {
          studentName: `${student.First_Name || ''} ${student.Last_Name || ''}`.trim(),
          fatherName: student.Father_Name,
          mobile: student.Mobile_Number,
          class: student.Class,
          section: student.Section,
          admissionNo: student.Admission_Number,
          Roll_Number: student.Roll_Number,
        },
      },
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US')
    } catch (error) {
      return 'Invalid Date'
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Select Criteria</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormLabel>Class</CFormLabel>
              <CFormSelect name="class" value={filters.class} onChange={handleFilterChange}>
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect name="section" value={filters.section} onChange={handleFilterChange}>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Parent</CFormLabel>
              <CFormInput
                type="text"
                name="parent"
                placeholder="Enter parent name"
                value={filters.parent}
                onChange={handleFilterChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Search By Keyword</CFormLabel>
              <CFormInput
                type="text"
                name="keyword"
                placeholder="Name, Roll No, Admission No..."
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol className="text-end">
              <CButton color="secondary" className="me-2" onClick={clearFilters}>
                Clear Filters
              </CButton>
              <CButton color="primary" className="me-2" onClick={handleSearch}>
                <CIcon icon={cilSearch} className="me-2" /> Search
              </CButton>
              <CButton color="info" variant="outline" onClick={fetchAllStudents} disabled={loading}>
                <CIcon icon={cilReload} className="me-2" />
                {loading ? 'Loading...' : 'Refresh'}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

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
              <div className="text-muted">
                Showing {students.length} of {allStudents.length} students
              </div>
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

          {error && (
            <div className="alert alert-danger" role="alert">
              Error loading data: {error}
            </div>
          )}

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
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Loading students...</div>
                      </CTableDataCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      <CTableDataCell colSpan="10" className="text-center text-danger">
                        Failed to load students. Please try refreshing.
                      </CTableDataCell>
                    </CTableRow>
                  ) : students.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="10" className="text-center">
                        {allStudents.length === 0
                          ? 'No students found.'
                          : 'No students match your search criteria.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    students.map((item, index) => (
                      <CTableRow key={item.id || item.Admission_Number || index}>
                        <CTableDataCell>{item.Admission_Number || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {`${item.First_Name || ''} ${item.Last_Name || ''}`.trim() || 'N/A'}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{item.Roll_Number || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.Class || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.Father_Name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{formatDate(item.Date_of_Birth)}</CTableDataCell>
                        <CTableDataCell>{item.Gender || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.Category || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.Mobile_Number || 'N/A'}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButtonGroup>
                            <CButton
                              color="dark"
                              size="sm"
                              variant="outline"
                              title="View Details"
                              onClick={() => handleViewDetails(item)}
                            >
                              <CIcon icon={cilList} />
                            </CButton>
                            <CButton
                              color="warning"
                              size="sm"
                              variant="outline"
                              title="Edit"
                              onClick={() => handleEditStudent(item)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="success"
                              size="sm"
                              variant="outline"
                              title="Fees"
                              onClick={() => handleFeesManagement(item)}
                            >
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
            Records: {students.length > 0 ? `1 to ${students.length}` : '0'} of {students.length}
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
