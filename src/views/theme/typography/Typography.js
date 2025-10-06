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
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCardFooter,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const ComplaintsPage = () => {
  // --- Configuration ---
  const BASE_URL = 'https://cosmiccharm.in'
  const API_URL = `${BASE_URL}/api/mentors` // Using mentors endpoint as per your backend

  // --- State Management ---
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [saveLoading, setSaveLoading] = useState(false)

  const initialFormState = {
    complain_type: '',
    source: '',
    complain_by: '',
    phone: '',
    complaint_date: new Date().toISOString().slice(0, 10),
    description: '',
    action_taken: '',
    assigned_to: '',
    note: '',
    name: '',
    attachment_path: null,
  }
  const [formData, setFormData] = useState(initialFormState)

  // --- API Functions ---

  // Fetch all complaints from the server
  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch complaints.')
      const data = await response.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setComplaints([])
      alert('Error fetching complaints: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when the component first loads
  useEffect(() => {
    fetchComplaints()
  }, [])

  // --- Event Handlers ---

  // Update form state as user types
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    })
  }

  // Clear the form and reset editing state
  const resetForm = () => {
    setFormData(initialFormState)
    setEditingId(null)
  }

  // Handle the 'Edit' button click
  const handleEdit = (complaintToEdit) => {
    setEditingId(complaintToEdit.id)
    setFormData({
      complain_type: complaintToEdit.complain_type || '',
      source: complaintToEdit.source || '',
      complain_by: complaintToEdit.complain_by || '',
      phone: complaintToEdit.phone || '',
      complaint_date: complaintToEdit.complaint_date
        ? new Date(complaintToEdit.complaint_date).toISOString().slice(0, 10)
        : '',
      description: complaintToEdit.description || '',
      action_taken: complaintToEdit.action_taken || '',
      assigned_to: complaintToEdit.assigned_to || '',
      note: complaintToEdit.note || '',
      name: complaintToEdit.name || '',
      attachment_path: null, // File inputs cannot be programmatically set
    })
  }

  // Handle the 'Delete' button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete complaint.')

        const result = await response.json()
        alert('Complaint deleted successfully!')
        fetchComplaints() // Refresh the list
      } catch (error) {
        console.error('Error deleting complaint:', error)
        alert('Error deleting complaint: ' + error.message)
      }
    }
  }

  // Handle the 'Save' or 'Update' button click
  const handleSave = async () => {
    // Validate required fields
    if (!formData.complain_type || !formData.source || !formData.complain_by) {
      alert('Please fill in all required fields (Complaint Type, Source, Complain By)')
      return
    }

    setSaveLoading(true)

    // Prepare data for submission (JSON format, not FormData)
    const dataToSubmit = {
      complain_type: formData.complain_type,
      source: formData.source,
      complain_by: formData.complain_by,
      phone: formData.phone,
      complaint_date: formData.complaint_date,
      description: formData.description,
      action_taken: formData.action_taken || null,
      assigned_to: formData.assigned_to || null,
      note: formData.note || null,
      name: formData.name || formData.complain_by, // Use complain_by as name if name is empty
      attachment_path: null, // Handle file upload separately if needed
    }

    const isEditing = editingId !== null
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save complaint.')
      }

      const result = await response.json()
      alert(isEditing ? 'Complaint updated successfully!' : 'Complaint added successfully!')

      resetForm()
      fetchComplaints()
    } catch (error) {
      console.error('Error saving complaint:', error)
      alert('Error saving complaint: ' + error.message)
    } finally {
      setSaveLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US')
    } catch (error) {
      return 'Invalid Date'
    }
  }

  return (
    <CRow>
      {/* Left Column: Add/Edit Form */}
      <CCol md={5}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingId ? 'Edit Complaint' : 'Add Complain'}</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="g-3">
              <CCol xs={12}>
                <CFormLabel>
                  Complaint Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="complain_type"
                  value={formData.complain_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Academic">Academic</option>
                  <option value="Facility">Facility</option>
                  <option value="Bullying">Bullying</option>
                  <option value="Transport">Transport</option>
                  <option value="Food">Food</option>
                  <option value="Discipline">Discipline</option>
                  <option value="Safety">Safety</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Cleanliness">Cleanliness</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>
                  Source <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect name="source" value={formData.source} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Call">Call</option>
                  <option value="Front Office">Front Office</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>
                  Complain By <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="complain_by"
                  value={formData.complain_by}
                  onChange={handleInputChange}
                  placeholder="Enter name of person making complaint"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Phone</CFormLabel>
                <CFormInput
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="complaint_date"
                  value={formData.complaint_date}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the complaint in detail"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Action Taken</CFormLabel>
                <CFormTextarea
                  rows={2}
                  name="action_taken"
                  value={formData.action_taken}
                  onChange={handleInputChange}
                  placeholder="What action has been taken to address this complaint"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Assigned</CFormLabel>
                <CFormInput
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  placeholder="Who is assigned to handle this complaint"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Note</CFormLabel>
                <CFormTextarea
                  rows={3}
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Additional notes or comments"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Attach Document</CFormLabel>
                <CFormInput
                  type="file"
                  name="attachment_path"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter className="text-end">
            {editingId && (
              <CButton
                color="secondary"
                className="me-2"
                onClick={resetForm}
                disabled={saveLoading}
              >
                Cancel
              </CButton>
            )}
            <CButton color="primary" onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      {/* Right Column: Complaint List */}
      <CCol md={7}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Complaint List</strong>
            <CButton color="secondary" size="sm" onClick={fetchComplaints} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Complain #</CTableHeaderCell>
                  <CTableHeaderCell>Complaint Type</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      Loading complaints...
                    </CTableDataCell>
                  </CTableRow>
                ) : complaints.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      No complaints found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  complaints.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.id}</CTableDataCell>
                      <CTableDataCell>
                        <div>{item.complain_type}</div>
                        <div className="small text-muted">Source: {item.source}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.complain_by}</div>
                        {item.name && item.name !== item.complain_by && (
                          <div className="small text-muted">{item.name}</div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{item.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{formatDate(item.complaint_date)}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButtonGroup>
                          <CButton
                            color="warning"
                            size="sm"
                            variant="outline"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                            disabled={saveLoading}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            variant="outline"
                            title="Delete"
                            onClick={() => handleDelete(item.id)}
                            disabled={saveLoading}
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
          <CCardFooter>
            <div className="d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                Showing {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
              </div>
              <CPagination align="end">
                <CPaginationItem disabled>Previous</CPaginationItem>
                <CPaginationItem active>1</CPaginationItem>
                <CPaginationItem>Next</CPaginationItem>
              </CPagination>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ComplaintsPage
