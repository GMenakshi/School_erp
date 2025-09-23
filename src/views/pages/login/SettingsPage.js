import React, { useState } from 'react'
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
  CFormTextarea,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'

const SettingsPage = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)

  // Sample data - in a real app, this would come from your API
  const academicYears = [
    { id: 1, year: '2025-2026', startDate: '04/01/2025', endDate: '03/31/2026', isCurrent: true },
    { id: 2, year: '2024-2025', startDate: '04/01/2024', endDate: '03/31/2025', isCurrent: false },
  ]

  const userRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Teacher' },
    { id: 3, name: 'Student' },
    { id: 4, name: 'Parent' },
  ]

  const modules = [
    'Student Admission',
    'Student Details',
    'Fees Collection',
    'Homework',
    'Complaints',
    'User Management',
  ]

  // --- Styles for Dark Mode ---
  const darkModeStyles = {
    card: { backgroundColor: '#2a2b36', color: '#e9ecef', border: '1px solid #4f5d73' },
    header: { backgroundColor: '#323a48', borderBottom: '1px solid #4f5d73' },
    input: { backgroundColor: '#212631', color: '#e9ecef', border: '1px solid #4f5d73' },
    label: { color: '#adb5bd' },
    table: {
      '--cui-table-color': '#e9ecef',
      '--cui-table-bg': '#2a2b36',
      '--cui-table-border-color': '#4f5d73',
      '--cui-table-striped-bg': '#323a48',
    },
    navTabs: {
      '--cui-nav-tabs-border-color': '#4f5d73',
      '--cui-nav-tabs-link-active-bg': '#323a48',
      '--cui-nav-tabs-link-active-border-color': '#4f5d73',
    },
  }

  return (
    <>
      <CCard className="mb-4" style={darkModeStyles.card}>
        <CCardHeader style={darkModeStyles.header}>
          <h4>Settings</h4>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs" role="tablist" style={darkModeStyles.navTabs}>
            <CNavItem>
              <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                General Settings
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                Academic Year
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>
                User Roles & Permissions
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent className="pt-4">
            {/* Tab 1: General School Settings */}
            <CTabPane role="tabpanel" aria-labelledby="general-tab" visible={activeKey === 1}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel style={darkModeStyles.label}>School Name</CFormLabel>
                  <CFormInput
                    style={darkModeStyles.input}
                    type="text"
                    defaultValue="Cosmic Charm School"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel style={darkModeStyles.label}>Contact Details</CFormLabel>
                  <CFormInput
                    style={darkModeStyles.input}
                    type="text"
                    defaultValue="+91 12345 67890"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel style={darkModeStyles.label}>Address</CFormLabel>
                  <CFormTextarea
                    style={darkModeStyles.input}
                    rows={3}
                    defaultValue="123 Education Lane, Knowledge City, India"
                  ></CFormTextarea>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel style={darkModeStyles.label}>School Logo</CFormLabel>
                  <CFormInput style={darkModeStyles.input} type="file" />
                </CCol>
                <CCol xs={12} className="text-end">
                  <CButton color="primary">Save General Settings</CButton>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Tab 2: Academic Year Management */}
            <CTabPane role="tabpanel" aria-labelledby="academic-year-tab" visible={activeKey === 2}>
              <div className="d-flex justify-content-end mb-3">
                <CButton color="success" onClick={() => setModalVisible(true)}>
                  <CIcon icon={cilPlus} className="me-2" /> Add Academic Year
                </CButton>
              </div>
              <CTable striped hover style={darkModeStyles.table}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Year</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Current</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {academicYears.map((year) => (
                    <CTableRow key={year.id}>
                      <CTableDataCell>{year.year}</CTableDataCell>
                      <CTableDataCell>{year.startDate}</CTableDataCell>
                      <CTableDataCell>{year.endDate}</CTableDataCell>
                      <CTableDataCell>{year.isCurrent ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton size="sm" color="warning" variant="outline" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton size="sm" color="danger" variant="outline">
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Tab 3: User Roles and Module Access */}
            <CTabPane role="tabpanel" aria-labelledby="roles-tab" visible={activeKey === 3}>
              <CRow>
                <CCol md={4}>
                  <h5>Create User Role</h5>
                  <CFormLabel style={darkModeStyles.label}>Role Name</CFormLabel>
                  <CFormInput style={darkModeStyles.input} type="text" className="mb-2" />
                  <CButton color="success">Add Role</CButton>
                </CCol>
                <CCol md={8}>
                  <h5>Module Access Management</h5>
                  <CTable bordered style={darkModeStyles.table}>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Module</CTableHeaderCell>
                        {userRoles.map((role) => (
                          <CTableHeaderCell className="text-center" key={role.id}>
                            {role.name}
                          </CTableHeaderCell>
                        ))}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {modules.map((module) => (
                        <CTableRow key={module}>
                          <CTableDataCell>{module}</CTableDataCell>
                          {userRoles.map((role) => (
                            <CTableDataCell className="text-center" key={`${module}-${role.id}`}>
                              <CFormCheck />
                            </CTableDataCell>
                          ))}
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <div className="text-end mt-3">
                    <CButton color="primary">Save Permissions</CButton>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Modal for Adding Academic Year */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader style={darkModeStyles.card} onClose={() => setModalVisible(false)}>
          <CModalTitle>Add New Academic Year</CModalTitle>
        </CModalHeader>
        <CModalBody style={darkModeStyles.card}>
          <CFormLabel style={darkModeStyles.label}>Year Name (e.g., 2026-2027)</CFormLabel>
          <CFormInput style={darkModeStyles.input} type="text" className="mb-3" />
          <CRow>
            <CCol xs={6}>
              <CFormLabel style={darkModeStyles.label}>Start Date</CFormLabel>
              <CFormInput style={darkModeStyles.input} type="date" />
            </CCol>
            <CCol xs={6}>
              <CFormLabel style={darkModeStyles.label}>End Date</CFormLabel>
              <CFormInput style={darkModeStyles.input} type="date" />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={darkModeStyles.card}>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save Year</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SettingsPage
