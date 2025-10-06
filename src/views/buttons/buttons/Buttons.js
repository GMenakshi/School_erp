import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCardFooter,
  CPagination,
  CPaginationItem,
  CButtonGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCopy, cilPrint, cilCloudDownload } from '@coreui/icons'

const Buttons = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch API data
  const fetchStudentData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://cosmiccharm.in/api/enquiries')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()

      // Change this section
      const transformedData = data.map((item) => ({
        // Map from a proper student API endpoint
        class: item.Class || 'N/A', // Assuming API has a 'Class' field
        section: item.Section || 'N/A', // Assuming API has a 'Section' field
        admissionNo: item.Admission_Number || 'N/A', // Use the actual Admission_Number
        studentName: `${item.First_Name || ''} ${item.Last_Name || ''}`.trim() || 'Unknown', // Combine first and last name
        fatherName: item.Father_Name || 'Not Provided', // Use the correct Father_Name field
        dob: item.Date_of_Birth || 'N/A', // Use the correct Date_of_Birth field
        mobile: item.Mobile_Number || 'Not Provided', // Use the correct Mobile_Number field
      }))

      setStudentData(transformedData)
      setFilteredData(transformedData)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [])

  // Filtering logic
  useEffect(() => {
    const filtered = studentData.filter((student) => {
      const matchesSearch =
        searchTerm === '' ||
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile.includes(searchTerm)

      const matchesClass = selectedClass === '' || student.class === `Class ${selectedClass}`
      const matchesSection = selectedSection === '' || student.section === selectedSection

      return matchesSearch && matchesClass && matchesSection
    })
    setFilteredData(filtered)
  }, [searchTerm, selectedClass, selectedSection, studentData])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value)
    setCurrentPage(1)
  }

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value)
    setCurrentPage(1)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Select Criteria</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={4}>
              <CFormLabel>
                Class <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect value={selectedClass} onChange={handleClassChange}>
                <option value="">All</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect value={selectedSection} onChange={handleSectionChange}>
                <option value="">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Search By Keyword</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Search by Student Name, Roll Number..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Student List</h5>
          <div className="d-flex align-items-center">
            <CFormInput
              type="search"
              placeholder="Search..."
              className="me-2"
              style={{ width: '250px' }}
              value={searchTerm}
              onChange={handleSearch}
            />
            <CFormSelect
              className="me-2"
              style={{ width: '100px' }}
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </CFormSelect>
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
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Class</CTableHeaderCell>
                  <CTableHeaderCell>Section</CTableHeaderCell>
                  <CTableHeaderCell>Admission No</CTableHeaderCell>
                  <CTableHeaderCell>Student Name</CTableHeaderCell>
                  <CTableHeaderCell>Father Name</CTableHeaderCell>
                  <CTableHeaderCell>Date of Birth</CTableHeaderCell>
                  <CTableHeaderCell>Mobile No.</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.class}</CTableDataCell>
                      <CTableDataCell>{item.section}</CTableDataCell>
                      <CTableDataCell>{item.admissionNo}</CTableDataCell>
                      <CTableDataCell>{item.studentName}</CTableDataCell>
                      <CTableDataCell>{item.fatherName}</CTableDataCell>
                      <CTableDataCell>{item.dob}</CTableDataCell>
                      <CTableDataCell>{item.mobile}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() =>
                            navigate('/forms/validation', {
                              state: {
                                student: item,
                                fromFeesCollection: true,
                              },
                            })
                          }
                        >
                          Collect Fees
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No records found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
        <CCardFooter className="d-flex justify-content-between align-items-center">
          <span>
            Records: {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of{' '}
            {studentData.length}
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

export default Buttons
