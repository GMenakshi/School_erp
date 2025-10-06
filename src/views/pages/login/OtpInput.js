import React from 'react'

const OtpInput = ({ length = 6, onOtpChange }) => {
  const [otp, setOtp] = React.useState(new Array(length).fill(''))
  const inputRefs = React.useRef([])

  React.useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, e) => {
    const value = e.target.value
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    const combinedOtp = newOtp.join('')
    if (combinedOtp.length === length) {
      onOtpChange(combinedOtp)
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1)

    if (index > 0 && !otp[index - 1]) {
      const emptyIndex = otp.indexOf('')
      if (emptyIndex !== -1) {
        inputRefs.current[emptyIndex].focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(input) => (inputRefs.current[index] = input)}
          type="text"
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          style={{
            width: '40px',
            height: '40px',
            textAlign: 'center',
            fontSize: '18px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
          maxLength="1"
        />
      ))}
    </div>
  )
}

export default OtpInput
