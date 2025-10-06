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
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'

const SettingsPage = () => {
  const API_URL = 'https://cosmiccharm.in/api/mentors'

  const [activeKey, setActiveKey] = useState(1)
  const [loading, setLoading] = useState(true)

  // State for General Settings
  const [settings, setSettings] = useState({
    school_name: '',
    school_address: '',
    school_logo_url: '',
    school_contact: '',
  })

  // State for Academic Year
  const [academicYears, setAcademicYears] = useState([
    {
      id: 1,
      year: '2025-2026',
      start_date: '2025-04-01',
      end_date: '2026-03-31',
      is_current: true,
    },
    {
      id: 2,
      year: '2024-2025',
      start_date: '2024-04-01',
      end_date: '2025-03-31',
      is_current: false,
    },
  ])
  const [yearModalVisible, setYearModalVisible] = useState(false)
  const [isEditingYear, setIsEditingYear] = useState(false)
  const [yearForm, setYearForm] = useState({ id: null, year: '', start_date: '', end_date: '' })

  // State for Classes & Sections
  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 10' },
    { id: 2, name: 'Class 9' },
  ])
  const [sections, setSections] = useState([
    { id: 1, name: 'Section A', classId: 1 },
    { id: 2, name: 'Section B', classId: 1 },
    { id: 3, name: 'Section A', classId: 2 },
  ])
  const [newClassName, setNewClassName] = useState('')
  const [newSectionName, setNewSectionName] = useState('')
  const [selectedClassForSection, setSelectedClassForSection] = useState(classes[0]?.id || '')

  // State for User Roles & Permissions
  const userRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Teacher' },
    { id: 3, name: 'Student' },
    { id: 4, name: 'Parent' },
  ]
  const [selectedRoleId, setSelectedRoleId] = useState(userRoles[0]?.id || null)
  const [permissions, setPermissions] = useState({
    1: {
      'Student Admission': {
        view: true,
        create: true,
        update: true,
        delete: true,
        sections: 'all',
      },
      'Student Details': { view: true, create: true, update: true, delete: true, sections: 'all' },
      'Fees Collection': { view: true, create: true, update: true, delete: true, sections: 'all' },
      Homework: { view: true, create: true, update: true, delete: true, sections: 'all' },
      Complaints: { view: true, create: true, update: true, delete: true, sections: 'all' },
      'User Management': { view: true, create: true, update: true, delete: true, sections: 'all' },
    },
    2: {
      'Student Details': {
        view: true,
        create: false,
        update: false,
        delete: false,
        sections: [1, 2],
      },
      Homework: { view: true, create: true, update: true, delete: false, sections: [1] },
      Complaints: { view: true, create: true, update: false, delete: false, sections: [1, 2, 3] },
      'User Management': { view: false, create: false, update: false, delete: false, sections: [] },
    },
  })
  const modules = [
    'Student Admission',
    'Student Details',
    'Fees Collection',
    'Homework',
    'Complaints',
    'User Management',
  ]

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
    setSettings((prev) => ({ ...prev, [name]: type === 'file' ? files[0] : value }))
  }

  const handleSaveGeneralSettings = async () => {
    alert('Saving General Settings...')
  }

  const handleYearFormChange = (e) => {
    const { name, value } = e.target
    setYearForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOpenAddYearModal = () => {
    setIsEditingYear(false)
    setYearForm({ id: null, year: '', start_date: '', end_date: '' })
    setYearModalVisible(true)
  }

  const handleOpenEditYearModal = (year) => {
    setIsEditingYear(true)
    setYearForm(year)
    setYearModalVisible(true)
  }

  const handleSaveYear = () => {
    if (!yearForm.year || !yearForm.start_date || !yearForm.end_date) {
      return alert('All fields are required.')
    }
    if (isEditingYear) {
      setAcademicYears(academicYears.map((y) => (y.id === yearForm.id ? yearForm : y)))
      alert('Academic Year updated!')
    } else {
      setAcademicYears([...academicYears, { ...yearForm, id: Date.now(), is_current: false }])
      alert('Academic Year added!')
    }
    setYearModalVisible(false)
  }

  const handleDeleteYear = (id) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      setAcademicYears(academicYears.filter((y) => y.id !== id))
      alert('Academic Year deleted!')
    }
  }

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
    navPills: { '--cui-nav-pills-link-active-bg': '#3399ff' },
    modal: {
      content: { backgroundColor: '#2a2b36', color: '#e9ecef' },
      header: { borderBottom: '1px solid #4f5d73' },
      footer: { borderTop: '1px solid #4f5d73' },
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
            <CNavItem>
              <CNavLink active={activeKey === 4} onClick={() => setActiveKey(4)}>
                Classes & Sections
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent className="pt-4">
            {/* Tab 1: General Settings */}
            <CTabPane role="tabpanel" visible={activeKey === 1}>
              {loading ? (
                <p>Loading settings...</p>
              ) : (
                <CRow className="g-3">
                  <CCol md={6}>
                    <CFormLabel style={darkModeStyles.label}>School Name</CFormLabel>
                    <CFormInput
                      style={darkModeStyles.input}
                      name="school_name"
                      value={settings.school_name}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel style={darkModeStyles.label}>Contact Details</CFormLabel>
                    <CFormInput
                      style={darkModeStyles.input}
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

            {/* Tab 2: Academic Year */}
            <CTabPane role="tabpanel" visible={activeKey === 2}>
              <div className="d-flex justify-content-end mb-3">
                <CButton color="success" onClick={handleOpenAddYearModal}>
                  <CIcon icon={cilPlus} className="me-2" /> Add Academic Year
                </CButton>
              </div>
              <CTable striped hover responsive style={darkModeStyles.table}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Academic Year</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {academicYears.map((year) => (
                    <CTableRow key={year.id}>
                      <CTableDataCell>{year.year}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(year.start_date).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(year.end_date).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {year.is_current ? (
                          <CBadge color="success">Current</CBadge>
                        ) : (
                          <CBadge color="secondary">Previous</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="info"
                          variant="outline"
                          className="me-2"
                          onClick={() => handleOpenEditYearModal(year)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          variant="outline"
                          onClick={() => handleDeleteYear(year.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Tab 3: User Roles & Permissions */}
            <CTabPane role="tabpanel" visible={activeKey === 3}>
              <CRow>
                <CCol md={4}>
                  <h5 className="mb-3">User Roles</h5>
                  <CNav variant="pills" vertical style={darkModeStyles.navPills}>
                    {userRoles.map((role) => (
                      <CNavItem key={role.id}>
                        <CNavLink
                          href="#"
                          active={selectedRoleId === role.id}
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedRoleId(role.id)
                          }}
                        >
                          {role.name}
                        </CNavLink>
                      </CNavItem>
                    ))}
                  </CNav>
                </CCol>
                <CCol md={8}>
                  <h5 className="mb-3">
                    Permissions for: {userRoles.find((r) => r.id === selectedRoleId)?.name || ''}
                  </h5>
                  <CTable bordered hover responsive style={darkModeStyles.table}>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Module</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">View</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Create</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Update</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Delete</CTableHeaderCell>
                        <CTableHeaderCell>Applicable Sections</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {modules.map((moduleName) => {
                        const p = permissions[selectedRoleId]?.[moduleName] || {}
                        return (
                          <CTableRow key={moduleName}>
                            <CTableDataCell>{moduleName}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CFormCheck checked={!!p.view} onChange={() => {}} />
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CFormCheck checked={!!p.create} onChange={() => {}} />
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CFormCheck checked={!!p.update} onChange={() => {}} />
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CFormCheck checked={!!p.delete} onChange={() => {}} />
                            </CTableDataCell>
                            <CTableDataCell>
                              {p.sections === 'all' ? (
                                'All Sections'
                              ) : (
                                <CFormSelect
                                  style={darkModeStyles.input}
                                  multiple
                                  value={p.sections || []}
                                  onChange={() => {}}
                                >
                                  {sections.map((sec) => (
                                    <option key={sec.id} value={sec.id}>
                                      {classes.find((c) => c.id === sec.classId)?.name} - {sec.name}
                                    </option>
                                  ))}
                                </CFormSelect>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                    </CTableBody>
                  </CTable>
                  <div className="text-end mt-3">
                    <CButton color="primary">Save Permissions</CButton>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Tab 4: Classes & Sections */}
            <CTabPane role="tabpanel" visible={activeKey === 4}>
              <CRow>
                <CCol md={6}>
                  <CCard style={darkModeStyles.card}>
                    <CCardHeader style={darkModeStyles.header}>Manage Classes</CCardHeader>
                    <CCardBody>
                      <div className="d-flex mb-3">
                        <CFormInput
                          style={darkModeStyles.input}
                          placeholder="New Class Name"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                        />
                        <CButton className="ms-2" onClick={() => alert('Add Class logic here')}>
                          Add
                        </CButton>
                      </div>
                      <CTable hover responsive style={darkModeStyles.table}>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Class Name</CTableHeaderCell>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {classes.map((cls) => (
                            <CTableRow key={cls.id}>
                              <CTableDataCell>{cls.name}</CTableDataCell>
                              <CTableDataCell>
                                <CButton size="sm" color="danger" variant="outline">
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={6}>
                  <CCard style={darkModeStyles.card}>
                    <CCardHeader style={darkModeStyles.header}>Manage Sections</CCardHeader>
                    <CCardBody>
                      <div className="d-flex mb-3">
                        <CFormSelect
                          style={darkModeStyles.input}
                          value={selectedClassForSection}
                          onChange={(e) => setSelectedClassForSection(parseInt(e.target.value))}
                        >
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </CFormSelect>
                        <CFormInput
                          style={darkModeStyles.input}
                          className="mx-2"
                          placeholder="New Section Name"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                        />
                        <CButton onClick={() => alert('Add Section logic here')}>Add</CButton>
                      </div>
                      <CTable hover responsive style={darkModeStyles.table}>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Section Name</CTableHeaderCell>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {sections
                            .filter((sec) => sec.classId === selectedClassForSection)
                            .map((sec) => (
                              <CTableRow key={sec.id}>
                                <CTableDataCell>{sec.name}</CTableDataCell>
                                <CTableDataCell>
                                  <CButton size="sm" color="danger" variant="outline">
                                    <CIcon icon={cilTrash} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Modal for adding/editing Academic Year */}
      <CModal
        alignment="center"
        visible={yearModalVisible}
        onClose={() => setYearModalVisible(false)}
      >
        <CModalHeader style={darkModeStyles.modal.header}>
          <CModalTitle>
            {isEditingYear ? 'Edit Academic Year' : 'Add New Academic Year'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={darkModeStyles.modal.content}>
          <CRow className="g-3">
            <CCol xs={12}>
              <CFormLabel style={darkModeStyles.label}>Academic Year (e.g., 2025-2026)</CFormLabel>
              <CFormInput
                style={darkModeStyles.input}
                name="year"
                value={yearForm.year}
                onChange={handleYearFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel style={darkModeStyles.label}>Start Date</CFormLabel>
              <CFormInput
                style={darkModeStyles.input}
                type="date"
                name="start_date"
                value={yearForm.start_date}
                onChange={handleYearFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel style={darkModeStyles.label}>End Date</CFormLabel>
              <CFormInput
                style={darkModeStyles.input}
                type="date"
                name="end_date"
                value={yearForm.end_date}
                onChange={handleYearFormChange}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={darkModeStyles.modal.footer}>
          <CButton color="secondary" onClick={() => setYearModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveYear}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SettingsPage
