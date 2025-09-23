import React, { useState, useEffect } from 'react'
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilPlus,
  cilPencil,
  cilTrash,
  cilCopy,
  cilPrint,
  cilCloudDownload,
} from '@coreui/icons'
// Import React Quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import styles

const Homework = () => {
  // --- Configuration & State Management ---
  const API_URL = 'https://cosmiccharm.in/api/homework'
  const today = new Date().toISOString().slice(0, 10)

  const [homeworkList, setHomeworkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  // State for the filter inputs
  const [filters, setFilters] = useState({
    class: '1',
    section: 'A',
    subjectGroup: '1',
    subject: '',
  })

  // State for the "Add Homework" form
  const [newHomework, setNewHomework] = useState({
    Class: '',
    Section: '',
    Subject_Group: '',
    Subject: '',
    Homework_Date: today,
    Submission_Date: today,
    Max_Marks: '',
    Attach_Document: null,
    Description: '',
    Created_By: 'Admin (9001)', // Example: replace with actual logged-in user
  })

  // --- API Functions ---
  const fetchHomework = async () => {
    setLoading(true)
    const queryParams = new URLSearchParams()
    if (filters.class) queryParams.append('class', filters.class)
    if (filters.section) queryParams.append('section', filters.section)
    if (filters.subjectGroup) queryParams.append('subject_group', filters.subjectGroup)
    if (filters.subject) queryParams.append('subject', filters.subject)

    const fullUrl = `${API_URL}?${queryParams.toString()}`

    try {
      const response = await fetch(fullUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setHomeworkList(data)
    } catch (error) {
      console.error('Failed to fetch homework:', error)
      setHomeworkList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomework()
  }, [])

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    fetchHomework()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewHomework((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setNewHomework((prev) => ({ ...prev, Attach_Document: e.target.files[0] }))
  }

  const handleDescriptionChange = (value) => {
    setNewHomework((prev) => ({ ...prev, Description: value }))
  }

  // Handle saving new homework
  const handleSaveHomework = async () => {
    const formData = new FormData()
    // Append all fields from the newHomework state to formData
    for (const key in newHomework) {
      formData.append(key, newHomework[key])
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData, // FormData sets the correct headers automatically
      })

      if (!response.ok) {
        throw new Error('Failed to add homework')
      }

      alert('Homework added successfully!')
      setModalVisible(false) // Close the modal
      fetchHomework() // Refresh the homework list
    } catch (error) {
      console.error('Error saving homework:', error)
      alert('Error: Could not save homework.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US')
  }

  return (
    <>
      {/* Filter Section */}
      <CCard className="mb-4">
        {/* ... (Your existing filter JSX) ... */}
        <CCardHeader>
          <strong>Select Criteria</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormLabel>
                Class <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="class" value={filters.class} onChange={handleFilterChange}>
                <option>Select</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect name="section" value={filters.section} onChange={handleFilterChange}>
                <option>Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Subject Group</CFormLabel>
              <CFormSelect
                name="subjectGroup"
                value={filters.subjectGroup}
                onChange={handleFilterChange}
              >
                <option>Select</option>
                <option value="1">Class 1st Subject Group</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Subject</CFormLabel>
              <CFormSelect name="subject" value={filters.subject} onChange={handleFilterChange}>
                <option value="">Select</option>
                <option value="Computer (00220)">Computer (00220)</option>
                <option value="Mathematics (110)">Mathematics (110)</option>
              </CFormSelect>
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

      {/* Homework List Section */}
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Homework List</h5>
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            <CIcon icon={cilPlus} className="me-2" /> Add
          </CButton>
        </CCardHeader>
        <CCardBody>
          {/* ... (Your existing homework list table JSX) ... */}
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Class</CTableHeaderCell>
                <CTableHeaderCell>Section</CTableHeaderCell>
                <CTableHeaderCell>Subject Group</CTableHeaderCell>
                <CTableHeaderCell>Subject</CTableHeaderCell>
                <CTableHeaderCell>Homework Date</CTableHeaderCell>
                <CTableHeaderCell>Submission Date</CTableHeaderCell>
                <CTableHeaderCell>Evaluation Date</CTableHeaderCell>
                <CTableHeaderCell>Created By</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    Loading...
                  </CTableDataCell>
                </CTableRow>
              ) : homeworkList.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    No homework found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                homeworkList.map((item, index) => (
                  <CTableRow key={item.ID || index}>
                    <CTableDataCell>{item.Class}</CTableDataCell>
                    <CTableDataCell>{item.Section}</CTableDataCell>
                    <CTableDataCell>{item.Subject_Group}</CTableDataCell>
                    <CTableDataCell>{item.Subject}</CTableDataCell>
                    <CTableDataCell>{formatDate(item.Homework_Date)}</CTableDataCell>
                    <CTableDataCell>{formatDate(item.Submission_Date)}</CTableDataCell>
                    <CTableDataCell>{formatDate(item.Evaluation_Date)}</CTableDataCell>
                    <CTableDataCell>{item.Created_By}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButtonGroup>
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
      </CCard>

      {/* "Add Homework" Modal */}
      <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Homework</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={3}>
              <CFormLabel>
                Class <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="Class" value={newHomework.Class} onChange={handleInputChange}>
                <option>Select</option>
                <option value="1">Class 1</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Section <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="Section" value={newHomework.Section} onChange={handleInputChange}>
                <option>Select</option>
                <option value="A">A</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Subject Group <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                name="Subject_Group"
                value={newHomework.Subject_Group}
                onChange={handleInputChange}
              >
                <option>Select</option>
                <option value="1">Class 1st Subject Group</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Subject <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="Subject" value={newHomework.Subject} onChange={handleInputChange}>
                <option>Select</option>
                <option value="Computer (00220)">Computer (00220)</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Homework Date <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                name="Homework_Date"
                value={newHomework.Homework_Date}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Submission Date <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                name="Submission_Date"
                value={newHomework.Submission_Date}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Max Marks</CFormLabel>
              <CFormInput
                type="number"
                name="Max_Marks"
                value={newHomework.Max_Marks}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Attach Document</CFormLabel>
              <CFormInput type="file" name="Attach_Document" onChange={handleFileChange} />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>
                Description <span className="text-danger">*</span>
              </CFormLabel>
              <ReactQuill
                theme="snow"
                value={newHomework.Description}
                onChange={handleDescriptionChange}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveHomework}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Homework
