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
  const API_URL = 'https://cosmiccharm.in/api/classdiary'
  const today = new Date().toISOString().slice(0, 10)

  const [homeworkList, setHomeworkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  // State for the filter inputs
  const [filters, setFilters] = useState({
    class: '1',
    section: 'A',
    subjectGroup: 'Languages',
    subject: '',
  })

  // State for the "Add Homework" form
  const [newHomework, setNewHomework] = useState({
    Class: '1',
    Section: 'A',
    Subject_Group: 'Languages',
    Subject: 'English',
    Homework_Date: today,
    Submission_Date: today,
    Evaluation_Date: '',
    Created_By: 'Admin (9001)',
    Admission_Number: null, // For general homework to all students
    Description: '', // For ReactQuill content
  })

  // --- API Functions ---
  const fetchHomework = async () => {
    setLoading(true)
    const classId = filters.class || '1'

    try {
      const response = await fetch(`${API_URL}/class/${classId}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()

      // Filter data based on section and subject if needed
      let filteredData = data
      if (filters.section && filters.section !== 'Select') {
        filteredData = filteredData.filter((item) => item.Section === filters.section)
      }
      if (filters.subject && filters.subject !== 'Select') {
        filteredData = filteredData.filter((item) => item.Subject === filters.subject)
      }

      setHomeworkList(filteredData)
    } catch (error) {
      console.error('Failed to fetch homework:', error)
      setHomeworkList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomework()
  }, [filters.class]) // Refetch when class changes

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))

    // Update newHomework state when class changes
    if (name === 'class') {
      setNewHomework((prev) => ({ ...prev, Class: value }))
    }
  }

  const handleSearch = () => {
    fetchHomework()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewHomework((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value) => {
    setNewHomework((prev) => ({ ...prev, Description: value }))
  }

  // Handle saving new homework
  const handleSaveHomework = async () => {
    // Validate required fields
    if (!newHomework.Class || !newHomework.Subject) {
      alert('Please fill in all required fields')
      return
    }

    // Prepare data for API (remove fields that don't exist in database)
    const homeworkData = {
      Class: newHomework.Class,
      Section: newHomework.Section,
      Subject_Group: newHomework.Subject_Group,
      Subject: newHomework.Subject,
      Homework_Date: newHomework.Homework_Date,
      Submission_Date: newHomework.Submission_Date || null,
      Evaluation_Date: newHomework.Evaluation_Date || null,
      Created_By: newHomework.Created_By,
      Admission_Number: null, // For general homework
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeworkData),
      })

      if (!response.ok) {
        throw new Error('Failed to add homework')
      }

      const result = await response.json()
      console.log('Homework created:', result)

      alert('Homework added successfully!')
      setModalVisible(false)

      // Reset form
      setNewHomework({
        Class: filters.class,
        Section: 'A',
        Subject_Group: 'Languages',
        Subject: 'English',
        Homework_Date: today,
        Submission_Date: today,
        Evaluation_Date: '',
        Created_By: 'Admin (9001)',
        Admission_Number: null,
        Description: '',
      })

      // Refresh the homework list
      fetchHomework()
    } catch (error) {
      console.error('Error saving homework:', error)
      alert('Error: Could not save homework. ' + error.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US')
  }

  return (
    <>
      {/* Filter Section */}
      <CCard className="mb-4">
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
                <option value="">Select</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect name="section" value={filters.section} onChange={handleFilterChange}>
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Subject Group</CFormLabel>
              <CFormSelect
                name="subjectGroup"
                value={filters.subjectGroup}
                onChange={handleFilterChange}
              >
                <option value="">All Groups</option>
                <option value="Languages">Languages</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Sciences">Sciences</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Arts">Arts</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Subject</CFormLabel>
              <CFormSelect name="subject" value={filters.subject} onChange={handleFilterChange}>
                <option value="">All Subjects</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Computer">Computer</option>
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
          <h5 className="mb-0">Homework List - Class {filters.class}</h5>
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            <CIcon icon={cilPlus} className="me-2" /> Add
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Class</CTableHeaderCell>
                <CTableHeaderCell>Section</CTableHeaderCell>
                <CTableHeaderCell>Subject Group</CTableHeaderCell>
                <CTableHeaderCell>Subject</CTableHeaderCell>
                <CTableHeaderCell>Student</CTableHeaderCell>
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
                  <CTableDataCell colSpan="11" className="text-center">
                    Loading...
                  </CTableDataCell>
                </CTableRow>
              ) : homeworkList.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center">
                    No homework found for the selected criteria.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                homeworkList.map((item, index) => (
                  <CTableRow key={item.ID || index}>
                    <CTableDataCell>{item.ID}</CTableDataCell>
                    <CTableDataCell>{item.Class}</CTableDataCell>
                    <CTableDataCell>{item.Section}</CTableDataCell>
                    <CTableDataCell>{item.Subject_Group}</CTableDataCell>
                    <CTableDataCell>{item.Subject}</CTableDataCell>
                    <CTableDataCell>
                      {item.First_Name && item.Last_Name
                        ? `${item.First_Name} ${item.Last_Name}`
                        : 'All Students'}
                      {item.Mobile_Number && (
                        <div className="small text-muted">{item.Mobile_Number}</div>
                      )}
                    </CTableDataCell>
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
                <option value="">Select</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Section <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="Section" value={newHomework.Section} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
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
                <option value="">Select</option>
                <option value="Languages">Languages</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Sciences">Sciences</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Arts">Arts</option>
                <option value="Physical Education">Physical Education</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Subject <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                name="Subject"
                value={newHomework.Subject}
                onChange={handleInputChange}
                placeholder="Enter subject name"
              />
            </CCol>
            <CCol md={4}>
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
            <CCol md={4}>
              <CFormLabel>Submission Date</CFormLabel>
              <CFormInput
                type="date"
                name="Submission_Date"
                value={newHomework.Submission_Date}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Evaluation Date</CFormLabel>
              <CFormInput
                type="date"
                name="Evaluation_Date"
                value={newHomework.Evaluation_Date}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Created By</CFormLabel>
              <CFormInput
                type="text"
                name="Created_By"
                value={newHomework.Created_By}
                onChange={handleInputChange}
                placeholder="Teacher name/ID"
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Description</CFormLabel>
              <ReactQuill
                theme="snow"
                value={newHomework.Description}
                onChange={handleDescriptionChange}
                placeholder="Enter homework description..."
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
