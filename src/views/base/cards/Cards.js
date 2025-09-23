import React, { useState, useEffect } from 'react'
import {
  CButton,
  CButtonGroup,
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
  CCardFooter,
  CPagination,
  CPaginationItem,
  CBadge,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilList, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons'

const StudentList = () => {
  const API_URL = 'https://cosmiccharm.in/api/enquiries'

  // --- State Management ---
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(100) // For the dropdown that shows 10, 25, 50, 100

  // --- API Functions ---

  // Fetch student data from the server
  const fetchStudents = async () => {
    setLoading(true)
    // Build URL with search query if a search term exists
    const url = searchTerm ? `${API_URL}?keyword=${searchTerm}` : API_URL

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      setStudents([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  // Using useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchStudents()
  }, []) // Run once on initial load

  // Handle search when the user types and presses Enter or clicks a search button
  // For simplicity, we'll re-fetch on every search term change after a small delay (debouncing)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents()
    }, 500) // Delay of 500ms to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Student List</h5>
        <div className="d-flex align-items-center">
          <CFormInput
            type="search"
            placeholder="Search by name, phone..."
            className="me-2"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CFormSelect
            style={{ width: '100px' }}
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </CFormSelect>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Reference No</CTableHeaderCell>
              <CTableHeaderCell>Student Name</CTableHeaderCell>
              <CTableHeaderCell>Class</CTableHeaderCell>
              <CTableHeaderCell>Father Name</CTableHeaderCell>
              <CTableHeaderCell>Date of Birth</CTableHeaderCell>
              <CTableHeaderCell>Gender</CTableHeaderCell>
              <CTableHeaderCell>Student Mobile Number</CTableHeaderCell>
              <CTableHeaderCell>Form Status</CTableHeaderCell>
              <CTableHeaderCell>Payment Status</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Enrolled</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="12" className="text-center">
                  Loading...
                </CTableDataCell>
              </CTableRow>
            ) : students.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="12" className="text-center">
                  No students found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              students.slice(0, pageSize).map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.refNo || item.id}</CTableDataCell>
                  <CTableDataCell>
                    {`${item.First_Name || ''} ${item.Last_Name || ''}`.trim()}
                  </CTableDataCell>
                  <CTableDataCell>{item.Class}</CTableDataCell>
                  <CTableDataCell>{item.Father_Name}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(item.Date_of_Birth).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell>{item.Gender}</CTableDataCell>
                  <CTableDataCell>{item.Mobile_Number}</CTableDataCell>

                  {/* Empty cells as requested */}
                  <CTableDataCell></CTableDataCell>
                  <CTableDataCell></CTableDataCell>
                  <CTableDataCell className="text-center"></CTableDataCell>

                  <CTableDataCell>
                    {new Date(item.created_at || Date.now()).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButtonGroup>
                      <CButton color="dark" size="sm" variant="outline" title="View">
                        <CIcon icon={cilList} />
                      </CButton>
                      <CButton color="warning" size="sm" variant="outline" title="Edit">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" variant="outline" title="Delete">
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
  )
}

export default StudentList
