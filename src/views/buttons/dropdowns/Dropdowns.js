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
import { cilPencil, cilTrash, cilCopy, cilPrint, cilCloudDownload } from '@coreui/icons'

const Dropdowns = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  })

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [feesTypeData, setFeesTypeData] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch fees types from API on component load
  useEffect(() => {
    fetchFeesTypes()
  }, [])

  // Fetch all fees types from API
  const fetchFeesTypes = async () => {
    setFetchLoading(true)
    try {
      const response = await fetch('https://cosmiccharm.in/api/feestructures')
      if (!response.ok) {
        throw new Error('Failed to fetch fees types')
      }
      const data = await response.json()

      // Extract unique fee names from the API response
      const uniqueFees = data.reduce((acc, item) => {
        // Extract the name without the parentheses part
        const nameMatch = item.name.match(/^(.+?)\s*\(/)
        const cleanName = nameMatch ? nameMatch[1].trim() : item.name

        // Create a simple code from the name
        const code = cleanName.toLowerCase().replace(/\s+/g, '-')

        // Check if this fee type already exists
        if (!acc.find((fee) => fee.name === cleanName)) {
          acc.push({
            name: cleanName,
            code: code,
          })
        }
        return acc
      }, [])

      setFeesTypeData(uniqueFees)
    } catch (error) {
      console.error('Error fetching fees types:', error)
      // Fallback to sample data if API fails
      setFeesTypeData([
        { name: 'Admission Fees', code: 'admission-fees' },
        { name: '1st Installment Fees', code: '1-installment-fees' },
        { name: '2nd Installment Fees', code: '2-installment-fees' },
      ])
    } finally {
      setFetchLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id.replace('fees', '').toLowerCase()]: value,
    }))
  }

  // API call to post data
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a fees name')
      return
    }

    setLoading(true)

    try {
      // Prepare data according to your API format
      const postData = {
        admission_number: null,
        name: `${formData.name} (${formData.code || formData.name.toLowerCase().replace(/\s+/g, '-')})`,
        dueDate: null,
        status: 'Unpaid',
        amount: '0.00',
        fine: '0.00',
        discount: '0.00',
        paid: '0.00',
        balance: '0.00',
        student_id: null,
      }

      const response = await fetch('https://cosmiccharm.in/api/feestructures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to save fees type')
      }

      const result = await response.json()
      console.log('Fees type saved:', result)

      // Clear form
      setFormData({ name: '', code: '', description: '' })

      // Refresh the fees list
      await fetchFeesTypes()

      alert('Fees type saved successfully!')
    } catch (error) {
      console.error('Error saving fees type:', error)
      alert('Error saving fees type: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol md={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Fees Type</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormLabel htmlFor="feesName">
                Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                id="feesName"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter fees name"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="feesCode">
                Fees Code <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                id="feesCode"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter fees code"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="feesDescription">Description</CFormLabel>
              <CFormTextarea
                id="feesDescription"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
              />
            </div>
          </CCardBody>
          <CCardFooter className="text-end">
            <CButton color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Fees Type List</h5>
            <div className="d-flex align-items-center">
              <CFormInput
                type="search"
                placeholder="Search..."
                className="me-2"
                style={{ width: '250px' }}
              />
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
            {fetchLoading ? (
              <div className="text-center p-4">Loading fees types...</div>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Fees Code</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {feesTypeData.length > 0 ? (
                    feesTypeData.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{item.name}</CTableDataCell>
                        <CTableDataCell>{item.code}</CTableDataCell>
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
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        No fees types found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
          <CCardFooter className="d-flex justify-content-between align-items-center">
            <span>
              Records: 1 to {feesTypeData.length} of {feesTypeData.length}
            </span>
            <CPagination align="end" className="mb-0">
              <CPaginationItem disabled>Previous</CPaginationItem>
              <CPaginationItem active>1</CPaginationItem>
              <CPaginationItem>Next</CPaginationItem>
            </CPagination>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dropdowns
