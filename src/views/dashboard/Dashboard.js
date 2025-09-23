import React, { useState, useEffect } from 'react'

const Profile = () => {
  const [loggedInStudent, setLoggedInStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('https://cosmiccharm.in/api/enquiries')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLoggedInStudent(data[0]) // Displaying the first student from the API response
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  // Helper function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-grid">
            <h3 className="info-title">Loading...</h3>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-grid">
            <h3 className="info-title">Error: {error}</h3>
          </div>
        </div>
      </div>
    )
  }

  if (!loggedInStudent) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-grid">
            <h3 className="info-title">No student data available.</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        .profile-container{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:3rem;background-color:#121212;color:#E0E0E0;font-family:'Inter',sans-serif}.profile-card{width:100%;max-width:1000px;background-color:#1E1E1E;border-radius:1.5rem;box-shadow:0 10px 30px rgba(0,0,0,.5),0 5px 15px rgba(0,0,0,.3);border:1px solid #333;overflow:hidden;transition:all .3s ease-in-out}.profile-card:hover{box-shadow:0 15px 40px rgba(0,0,0,.7),0 8px 20px rgba(0,0,0,.5);transform:translateY(-5px)}.profile-header{display:flex;flex-direction:column;align-items:center;padding:2.5rem;background:linear-gradient(135deg,#2A2A2A,#1A1A1A);position:relative}@media (min-width:768px){.profile-header{flex-direction:row;justify-content:space-between;align-items:center}}.profile-info{display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:2rem}@media (min-width:768px){.profile-info{flex-direction:row;text-align:left;margin-bottom:0}}.profile-photo-wrapper{position:relative;width:10rem;height:10rem;margin-bottom:1.5rem;flex-shrink:0}@media (min-width:768px){.profile-photo-wrapper{margin-right:2.5rem;margin-bottom:0}}.profile-photo{width:100%;height:100%;border-radius:50%;border:5px solid #FFD700;object-fit:cover;box-shadow:0 0 15px rgba(255,215,0,.4);transition:all .3s ease}.profile-photo:hover{transform:scale(1.05);box-shadow:0 0 25px rgba(255,215,0,.6)}.profile-details-text{display:flex;flex-direction:column}.profile-name{font-size:2.5rem;font-weight:800;line-height:1.2;color:#F5F5F5;letter-spacing:-1px}.profile-admission-no{font-size:1.1rem;color:#B0B0B0;font-weight:400;margin-top:.25rem}.edit-button{display:inline-flex;align-items:center;padding:.75rem 2rem;border:1px solid #FFD700;font-size:.9rem;font-weight:600;border-radius:9999px;color:#FFD700;background:0 0;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px rgba(255,215,0,.2)}.edit-button:hover{background-color:#FFD700;color:#121212;transform:translateY(-2px);box-shadow:0 6px 20px rgba(255,215,0,.4)}.edit-button svg{margin-right:.5rem;width:1rem;height:1rem}.profile-grid{padding:2.5rem;display:grid;grid-template-columns:1fr;gap:2rem}@media (min-width:768px){.profile-grid{grid-template-columns:repeat(2,1fr)}}.info-section{background-color:#252525;padding:2rem;border-radius:1rem;box-shadow:inset 0 2px 8px rgba(0,0,0,.4);border:1px solid #333;transition:all .3s ease}.info-section:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,.6)}.info-title{font-size:1.25rem;font-weight:700;color:#FFD700;margin-bottom:1.5rem;border-bottom:2px solid #383838;padding-bottom:.75rem;letter-spacing:.5px}.info-list{list-style:none;padding:0;margin:0}.info-list-item{display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid #333}.info-list-item:last-child{border-bottom:none}.info-label{font-weight:600;color:#B0B0B0}.info-value{color:#F5F5F5;font-weight:400;text-align:right}.medical-details-grid{display:grid;grid-template-columns:1fr;gap:1rem}@media (min-width:640px){.medical-details-grid{grid-template-columns:repeat(2,1fr)}}.medical-details-grid .info-list-item{border-bottom:none}.full-width{grid-column:span 1}@media (min-width:768px){.full-width{grid-column:span 2}}
        `}
      </style>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-photo-wrapper">
                <img
                  src={
                    loggedInStudent.Student_Photo && loggedInStudent.Student_Photo !== 'none'
                      ? loggedInStudent.Student_Photo
                      : 'https://placehold.co/150x150/2c3e50/ecf0f1?text=No+Image'
                  }
                  alt="Student Profile"
                  className="profile-photo"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/150x150/2c3e50/ecf0f1?text=No+Image'
                  }}
                />
              </div>
              <div className="profile-details-text">
                <h1 className="profile-name">{`${loggedInStudent.First_Name} ${loggedInStudent.Last_Name}`}</h1>
                <p className="profile-admission-no">
                  Admission No: {loggedInStudent.Admission_Number}
                </p>
              </div>
            </div>
            <button className="edit-button" title="Edit Profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Profile
            </button>
          </div>

          <div className="profile-grid">
            <div className="info-section">
              <h3 className="info-title">Personal Information</h3>
              <ul className="info-list">
                <li className="info-list-item">
                  <span className="info-label">Roll No:</span>
                  <span className="info-value">{loggedInStudent.Roll_Number}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Class:</span>
                  <span className="info-value">{loggedInStudent.Class}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">{formatDate(loggedInStudent.Date_of_Birth)}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{loggedInStudent.Gender}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{loggedInStudent.Category}</span>
                </li>
              </ul>
            </div>

            <div className="info-section">
              <h3 className="info-title">Contact Details</h3>
              <ul className="info-list">
                <li className="info-list-item">
                  <span className="info-label">Mobile Number:</span>
                  <span className="info-value">{loggedInStudent.Mobile_Number}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{loggedInStudent.Email}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Father's Name:</span>
                  <span className="info-value">{loggedInStudent.Father_Name}</span>
                </li>
              </ul>
            </div>

            <div className="info-section full-width">
              <h3 className="info-title">Medical & Other Details</h3>
              <ul className="info-list medical-details-grid">
                <li className="info-list-item">
                  <span className="info-label">House:</span>
                  <span className="info-value">{loggedInStudent.House}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Blood Group:</span>
                  <span className="info-value">{loggedInStudent.Blood_Group}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Height:</span>
                  <span className="info-value">{loggedInStudent.Height}</span>
                </li>
                <li className="info-list-item">
                  <span className="info-label">Weight:</span>
                  <span className="info-value">{loggedInStudent.Weight}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
