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
  const API_URL = 'https://cosmiccharm.in/api/mentors' // Your settings endpoint

  const [activeKey, setActiveKey] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  // State to hold settings from the backend
  const [settings, setSettings] = useState({
    school_name: '',
    school_address: '',
    school_logo_url: '',
    school_contact: '',
  })

  // --- API Functions ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Failed to fetch settings.')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [API_URL])

  // --- Event Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'file' ? files[0] : value,
    }))
  }

  const handleSaveGeneralSettings = async () => {
    try {
      // NOTE: File upload requires FormData, this example sends JSON for simplicity.
      // Your backend will need to handle FormData for the logo.
      const dataToUpdate = {
        school_name: settings.school_name,
        school_address: settings.school_address,
        school_contact: settings.school_contact,
      }

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      })

      if (!response.ok) throw new Error('Failed to save settings.')

      const result = await response.json()
      alert(result.message)
    } catch (error) {
      console.error('Save Error:', error)
      alert('An error occurred while saving.')
    }
  }

  // --- Sample data (can be replaced with API data later) ---
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
              {loading ? (
                <p>Loading settings...</p>
              ) : (
                <CRow className="g-3">
                  <CCol md={6}>
                    <CFormLabel style={darkModeStyles.label}>School Name</CFormLabel>
                    <CFormInput
                      style={darkModeStyles.input}
                      type="text"
                      name="school_name"
                      value={settings.school_name}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel style={darkModeStyles.label}>Contact Details</CFormLabel>
                    <CFormInput
                      style={darkModeStyles.input}
                      type="text"
                      name="school_contact"
                      value={settings.school_contact}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol xs={12}>
                    <CFormLabel style={darkModeStyles.label}>Address</CFormLabel>
                    <CFormTextarea
                      style={darkModeStyles.input}
                      rows={3}
                      name="school_address"
                      value={settings.school_address}
                      onChange={handleInputChange}
                    ></CFormTextarea>
                  </CCol>
                  <CCol xs={12}>
                    <CFormLabel style={darkModeStyles.label}>School Logo</CFormLabel>
                    <CFormInput
                      style={darkModeStyles.input}
                      type="file"
                      name="school_logo_url"
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol xs={12} className="text-end">
                    <CButton color="primary" onClick={handleSaveGeneralSettings}>
                      Save General Settings
                    </CButton>
                  </CCol>
                </CRow>
              )}
            </CTabPane>

            {/* Other Tabs remain the same for now */}
            <CTabPane role="tabpanel" aria-labelledby="academic-year-tab" visible={activeKey === 2}>
              <div className="d-flex justify-content-end mb-3">
                <CButton color="success" onClick={() => setModalVisible(true)}>
                  <CIcon icon={cilPlus} className="me-2" /> Add Academic Year
                </CButton>
              </div>
              <CTable striped hover style={darkModeStyles.table}>
                {/* ... Academic Year table JSX ... */}
              </CTable>
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="roles-tab" visible={activeKey === 3}>
              <CRow>
                <CCol md={4}>{/* ... Create User Role JSX ... */}</CCol>
                <CCol md={8}>{/* ... Module Access Management JSX ... */}</CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* ... (Modal JSX remains the same) ... */}
    </>
  )
}

export default SettingsPage
