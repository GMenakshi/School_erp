import React from 'react'
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

const ButtonGroups = () => {
  // Sample data for the fees group list
  const feesData = [
    { name: 'Class 1 General', description: '' },
    { name: 'Class 1 Lump Sum', description: '' },
    { name: 'Class 1-II Installment', description: '' },
    { name: 'Class 2 General', description: '' },
    { name: 'Class 2 Lump Sum', description: '' },
    { name: 'Class 2 - I Installment', description: '' },
    { name: 'Class 2 - II Installment', description: '' },
    { name: 'Class 3 General', description: '' },
    { name: 'Discount', description: '' },
    { name: 'Exam', description: '' },
    { name: 'Fees', description: '' },
  ]

  return (
    <CRow>
      <CCol md={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Fees Group</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormLabel htmlFor="feesName">
                Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput type="text" id="feesName" required />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="feesDescription">Description</CFormLabel>
              <CFormTextarea id="feesDescription" rows={4}></CFormTextarea>
            </div>
          </CCardBody>
          <CCardFooter className="text-end">
            <CButton color="primary">Save</CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Fees Group List</h5>
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
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {feesData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>{item.description}</CTableDataCell>
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
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
          <CCardFooter className="d-flex justify-content-between align-items-center">
            <span>Records: 1 to 18 of 18</span>
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

export default ButtonGroups
