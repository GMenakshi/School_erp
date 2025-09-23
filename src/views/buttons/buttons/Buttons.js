import React from 'react'
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
  // Sample data for the student list
  const studentData = [
    {
      class: 'Class 1',
      section: 'B',
      admissionNo: '120028',
      studentName: 'Nishant Sindhu',
      fatherName: 'Jayant Sindhu',
      dob: '08/06/2016',
      mobile: '890678574',
    },
    {
      class: 'Class 1',
      section: 'B',
      admissionNo: '5422',
      studentName: 'Vinay Singh',
      fatherName: 'arun singh',
      dob: '12/31/2018',
      mobile: '089067784',
    },
  ]

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
              <CFormSelect>
                <option>Select</option>
                <option value="1" selected>
                  Class 1
                </option>
                <option value="2">Class 2</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Section</CFormLabel>
              <CFormSelect>
                <option>Select</option>
                <option value="A">A</option>
                <option value="B" selected>
                  B
                </option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Search By Keyword</CFormLabel>
              <CFormInput type="text" placeholder="Search by Student Name, Roll Number..." />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol className="text-end">
              <CButton color="primary">
                <CIcon icon={cilSearch} className="me-2" /> Search
              </CButton>
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
            />
            <CFormSelect className="me-2" style={{ width: '100px' }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100" selected>
                100
              </option>
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
              {studentData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.class}</CTableDataCell>
                  <CTableDataCell>{item.section}</CTableDataCell>
                  <CTableDataCell>{item.admissionNo}</CTableDataCell>
                  <CTableDataCell>
                    <div>{item.studentName}</div>
                  </CTableDataCell>
                  <CTableDataCell>{item.fatherName}</CTableDataCell>
                  <CTableDataCell>{item.dob}</CTableDataCell>
                  <CTableDataCell>{item.mobile}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" size="sm">
                      Collect Fees
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
        <CCardFooter className="d-flex justify-content-between align-items-center">
          <span>Records: 1 to 2 of 2</span>
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
