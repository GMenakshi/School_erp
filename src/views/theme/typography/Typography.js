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
  const API_URL = `${BASE_URL}/api/complaints`

  // --- State Management ---
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null) // Use null to indicate 'not editing'

  const initialFormState = {
    Complain_Type: '',
    Source: '',
    Complain_By: '',
    Phone: '',
    Date: new Date().toISOString().slice(0, 10), // Default to today in YYYY-MM-DD format
    Description: '',
    Action_Taken: '',
    Assigned: '',
    Note: '',
    Attached_Document: null,
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
      setComplaints(data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setComplaints([])
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
      Complain_Type: complaintToEdit.complain_type || '',
      Source: complaintToEdit.source || '',
      Complain_By: complaintToEdit.complain_by || '',
      Phone: complaintToEdit.phone || '',
      Date: complaintToEdit.complaint_date
        ? new Date(complaintToEdit.complaint_date).toISOString().slice(0, 10)
        : '',
      Description: complaintToEdit.description || '',
      Action_Taken: complaintToEdit.action_taken || '',
      Assigned: complaintToEdit.assigned_to || '',
      Note: complaintToEdit.note || '',
      Attached_Document: null, // File inputs cannot be programmatically set for security reasons
    })
  }

  // Handle the 'Delete' button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete complaint.')
        fetchComplaints() // Refresh the list
      } catch (error) {
        console.error('Error deleting complaint:', error)
      }
    }
  }

  // Handle the 'Save' or 'Update' button click
  const handleSave = async () => {
    const dataToSubmit = new FormData()
    // Append all form data fields to the FormData object
    for (const key in formData) {
      dataToSubmit.append(key, formData[key])
    }

    const isEditing = editingId !== null
    // NOTE: An UPDATE (PUT) route should be added to your backend to handle editing.
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSubmit,
      })

      if (!response.ok) throw new Error('Failed to save complaint.')

      resetForm()
      fetchComplaints()
    } catch (error) {
      console.error('Error saving complaint:', error)
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
                <CFormLabel>Complaint Type</CFormLabel>
                <CFormSelect
                  name="Complain_Type"
                  value={formData.Complain_Type}
                  onChange={handleInputChange}
                >
                  <option>Select</option>
                  <option value="Fees">Fees</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Sports">Sports</option>
                  <option value="Transport">Transport</option>
                  <option value="Study">Study</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Source</CFormLabel>
                <CFormSelect name="Source" value={formData.Source} onChange={handleInputChange}>
                  <option>Select</option>
                  <option value="Call">Call</option>
                  <option value="Front Office">Front Office</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Complain By</CFormLabel>
                <CFormInput
                  type="text"
                  name="Complain_By"
                  value={formData.Complain_By}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Phone</CFormLabel>
                <CFormInput
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  rows={3}
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                ></CFormTextarea>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Action Taken</CFormLabel>
                <CFormInput
                  type="text"
                  name="Action_Taken"
                  value={formData.Action_Taken}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Assigned</CFormLabel>
                <CFormInput
                  type="text"
                  name="Assigned"
                  value={formData.Assigned}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Note</CFormLabel>
                <CFormTextarea
                  rows={3}
                  name="Note"
                  value={formData.Note}
                  onChange={handleInputChange}
                ></CFormTextarea>
              </CCol>
              <CCol xs={12}>
                <CFormLabel>Attach Document</CFormLabel>
                <CFormInput type="file" name="Attached_Document" onChange={handleInputChange} />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter className="text-end">
            <CButton color="primary" onClick={handleSave}>
              {editingId ? 'Update' : 'Save'}
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      {/* Right Column: Complaint List */}
      <CCol md={7}>
        <CCard>
          <CCardHeader>
            <strong>Complaint List</strong>
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
                      Loading...
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
                      <CTableDataCell>{item.complain_type}</CTableDataCell>
                      <CTableDataCell>{item.complain_by}</CTableDataCell>
                      <CTableDataCell>{item.phone}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(item.complaint_date).toLocaleDateString('en-US')}
                      </CTableDataCell>
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
                            onClick={() => handleDelete(item.id)}
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
            <CPagination align="end">
              <CPaginationItem disabled>Previous</CPaginationItem>
              <CPaginationItem active>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem>Next</CPaginationItem>
            </CPagination>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ComplaintsPage
