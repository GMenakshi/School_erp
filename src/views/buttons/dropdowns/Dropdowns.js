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

const Dropdowns = () => {
  // Sample data for the fees type list
  const feesTypeData = [
    { name: 'Admission Fees', code: 'admission-fees' },
    { name: '1st Installment Fees', code: '1-installment-fees' },
    { name: '2nd Installment Fees', code: '2-installment-fees' },
    { name: '3rd Installment Fees', code: '3-installment-fees' },
    { name: '4th Installment Fees', code: '4-installment-fees' },
    { name: '5th Installment Fees', code: '5-installment-fees' },
    { name: '6th Installment Fees', code: '6-installment-fees' },
    { name: 'April Month Fees', code: 'apr-month-fees' },
    { name: 'August Month Fees', code: 'aug-month-fees' },
    { name: 'Bus-fees', code: 'bus-fees' },
    { name: 'Caution Money Fees', code: 'caution-money-fees' },
    { name: 'Certificate fee', code: 'Cert-Fee' },
  ]

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
              <CFormInput type="text" id="feesName" required />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="feesCode">
                Fees Code <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput type="text" id="feesCode" required />
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
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Fees Code</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {feesTypeData.map((item, index) => (
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
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
          <CCardFooter className="d-flex justify-content-between align-items-center">
            <span>Records: 1 to 28 of 28</span>
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
