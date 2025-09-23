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
  CFormCheck,
  CLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilPlus } from '@coreui/icons'

const StudentAdmission = () => {
  const API_URL = 'https://cosmiccharm.in/api/enquiries'
  const today = new Date().toISOString().slice(0, 10) // Get today's date dynamically

  // A single state object to hold all form data
  const [studentData, setStudentData] = useState({
    // Student Details
    admissionNo: '',
    rollNo: '',
    class: '',
    section: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    category: '',
    religion: '',
    caste: '',
    mobileNo: '',
    email: '',
    admissionDate: today,
    studentPhoto: null,
    bloodGroup: '',
    house: '',
    height: '',
    weight: '',
    measurementDate: today,
    medicalHistory: '',
    // Transport & Hostel
    route: '',
    pickupPoint: '',
    feesMonth: '',
    hostel: '',
    roomNo: '',
    // Fees Discounts
    siblingDiscount: false,
    handicapDiscount: false,
    classTopperDiscount: false,
    // Parent Details
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    fatherPhoto: null,
    motherName: '',
    motherPhone: '',
    motherOccupation: '',
    motherPhoto: null,
    // Guardian Details
    guardianIs: 'father', // 'father', 'mother', or 'other'
    guardianName: '',
    guardianRelation: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianOccupation: '',
    guardianPhoto: null,
    guardianAddress: '',
  })

  // Handler to update state for any input change
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    let finalValue

    if (type === 'checkbox') {
      finalValue = checked
    } else if (type === 'file') {
      finalValue = files[0]
    } else {
      finalValue = value
    }

    setStudentData((prevData) => ({
      ...prevData,
      [name]: finalValue,
    }))
  }

  // Function to handle the form submission
  const handleSave = async () => {
    // Use FormData for multipart/form-data, necessary for file uploads
    const formData = new FormData()

    // Map frontend state to backend database column names
    const dataMapping = {
      admission_no: studentData.admissionNo,
      roll_no: studentData.rollNo,
      class_id: studentData.class, // Assuming you send class ID
      section_id: studentData.section, // Assuming you send section ID
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      gender: studentData.gender,
      dob: studentData.dob,
      category: studentData.category,
      religion: studentData.religion,
      caste: studentData.caste,
      mobile_no: studentData.mobileNo,
      email: studentData.email,
      admission_date: studentData.admissionDate,
      student_photo: studentData.studentPhoto,
      blood_group: studentData.bloodGroup,
      house: studentData.house,
      height: studentData.height,
      weight: studentData.weight,
      measurement_date: studentData.measurementDate,
      medical_history: studentData.medicalHistory,
      father_name: studentData.fatherName,
      father_phone: studentData.fatherPhone,
      father_occupation: studentData.fatherOccupation,
      father_photo: studentData.fatherPhoto,
      mother_name: studentData.motherName,
      mother_phone: studentData.motherPhone,
      mother_occupation: studentData.motherOccupation,
      mother_photo: studentData.motherPhoto,
      guardian_is: studentData.guardianIs,
      guardian_name: studentData.guardianName,
      guardian_relation: studentData.guardianRelation,
      guardian_email: studentData.guardianEmail,
      guardian_phone: studentData.guardianPhone,
      guardian_occupation: studentData.guardianOccupation,
      guardian_photo: studentData.guardianPhoto,
      guardian_address: studentData.guardianAddress,
    }

    // Append data to the FormData object
    for (const key in dataMapping) {
      if (dataMapping[key] !== null && dataMapping[key] !== undefined) {
        formData.append(key, dataMapping[key])
      }
    }

    console.log('Submitting data...', Object.fromEntries(formData)) // For debugging

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData, // Let the browser set the 'Content-Type' header automatically for FormData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save student data: ${errorData.message || response.statusText}`)
      }

      const result = await response.json()
      alert('Student admitted successfully!')
      console.log('Success:', result)
      // Optionally, you can reset the form here
      // setStudentData(initialState);
    } catch (error) {
      console.error('Error during submission:', error)
      alert(`An error occurred: ${error.message}`)
    }
  }

  return (
    <>
      {/* Page Header */}
      <CRow className="mb-4 align-items-center">
        <CCol xs={10}>
          <h2>Student Admission</h2>
        </CCol>
        <CCol xs={2} className="text-end">
          <CButton color="primary">
            <CIcon icon={cilCloudUpload} className="me-2" />
            Import Student
          </CButton>
        </CCol>
      </CRow>

      {/* Main Student Details Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={3}>
              <CFormLabel>
                Admission No <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                name="admissionNo"
                value={studentData.admissionNo}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Roll Number</CFormLabel>
              <CFormInput name="rollNo" value={studentData.rollNo} onChange={handleInputChange} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Class <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="class" value={studentData.class} onChange={handleInputChange}>
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Section <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="section" value={studentData.section} onChange={handleInputChange}>
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                First Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                name="firstName"
                value={studentData.firstName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Last Name</CFormLabel>
              <CFormInput
                name="lastName"
                value={studentData.lastName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Gender <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect name="gender" value={studentData.gender} onChange={handleInputChange}>
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>
                Date of Birth <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                name="dob"
                value={studentData.dob}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Category</CFormLabel>
              <CFormSelect
                name="category"
                value={studentData.category}
                onChange={handleInputChange}
              >
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Religion</CFormLabel>
              <CFormInput
                name="religion"
                value={studentData.religion}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Caste</CFormLabel>
              <CFormInput name="caste" value={studentData.caste} onChange={handleInputChange} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Mobile Number</CFormLabel>
              <CFormInput
                type="tel"
                name="mobileNo"
                value={studentData.mobileNo}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Admission Date</CFormLabel>
              <CFormInput
                type="date"
                name="admissionDate"
                value={studentData.admissionDate}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Student Photo (100px X 100px)</CFormLabel>
              <CFormInput type="file" name="studentPhoto" onChange={handleInputChange} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Blood Group</CFormLabel>
              <CFormSelect
                name="bloodGroup"
                value={studentData.bloodGroup}
                onChange={handleInputChange}
              >
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>House</CFormLabel>
              <CFormSelect name="house" value={studentData.house} onChange={handleInputChange}>
                <option>Select</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Height</CFormLabel>
              <CFormInput name="height" value={studentData.height} onChange={handleInputChange} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Weight</CFormLabel>
              <CFormInput name="weight" value={studentData.weight} onChange={handleInputChange} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Measurement Date</CFormLabel>
              <CFormInput
                type="date"
                name="measurementDate"
                value={studentData.measurementDate}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Medical History</CFormLabel>
              <CFormTextarea
                rows={3}
                name="medicalHistory"
                value={studentData.medicalHistory}
                onChange={handleInputChange}
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Other Cards ... */}

      {/* Parent Guardian Details Card */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Parent Guardian Detail</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 mb-3">
            <CCol md={3}>
              <CFormLabel>Father Name</CFormLabel>
              <CFormInput
                name="fatherName"
                value={studentData.fatherName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Father Phone</CFormLabel>
              <CFormInput
                name="fatherPhone"
                value={studentData.fatherPhone}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Father Occupation</CFormLabel>
              <CFormInput
                name="fatherOccupation"
                value={studentData.fatherOccupation}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Father Photo (100px X 100px)</CFormLabel>
              <CFormInput type="file" name="fatherPhoto" onChange={handleInputChange} />
            </CCol>
          </CRow>
          <CRow className="g-3 mb-4">
            <CCol md={3}>
              <CFormLabel>Mother Name</CFormLabel>
              <CFormInput
                name="motherName"
                value={studentData.motherName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Mother Phone</CFormLabel>
              <CFormInput
                name="motherPhone"
                value={studentData.motherPhone}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Mother Occupation</CFormLabel>
              <CFormInput
                name="motherOccupation"
                value={studentData.motherOccupation}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Mother Photo (100px X 100px)</CFormLabel>
              <CFormInput type="file" name="motherPhoto" onChange={handleInputChange} />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel>
                If Guardian Is <span className="text-danger">*</span>
              </CFormLabel>
              <div>
                <CFormCheck
                  inline
                  type="radio"
                  name="guardianIs"
                  id="gFather"
                  label="Father"
                  value="father"
                  checked={studentData.guardianIs === 'father'}
                  onChange={handleInputChange}
                />
                <CFormCheck
                  inline
                  type="radio"
                  name="guardianIs"
                  id="gMother"
                  label="Mother"
                  value="mother"
                  checked={studentData.guardianIs === 'mother'}
                  onChange={handleInputChange}
                />
                <CFormCheck
                  inline
                  type="radio"
                  name="guardianIs"
                  id="gOther"
                  label="Other"
                  value="other"
                  checked={studentData.guardianIs === 'other'}
                  onChange={handleInputChange}
                />
              </div>
            </CCol>
          </CRow>
          {studentData.guardianIs === 'other' && (
            <CRow className="g-3 mt-3">
              <CCol md={4}>
                <CFormLabel>
                  Guardian Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="guardianName"
                  value={studentData.guardianName}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Guardian Relation</CFormLabel>
                <CFormInput
                  name="guardianRelation"
                  value={studentData.guardianRelation}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Guardian Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="guardianEmail"
                  value={studentData.guardianEmail}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>
                  Guardian Phone <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="guardianPhone"
                  value={studentData.guardianPhone}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Guardian Occupation</CFormLabel>
                <CFormInput
                  name="guardianOccupation"
                  value={studentData.guardianOccupation}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Guardian Photo (100px X 100px)</CFormLabel>
                <CFormInput type="file" name="guardianPhoto" onChange={handleInputChange} />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Guardian Address</CFormLabel>
                <CFormTextarea
                  rows={2}
                  name="guardianAddress"
                  value={studentData.guardianAddress}
                  onChange={handleInputChange}
                ></CFormTextarea>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      {/* Save Button */}
      <CRow>
        <CCol className="text-end">
          <CButton color="success" size="lg" onClick={handleSave}>
            Save
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default StudentAdmission
