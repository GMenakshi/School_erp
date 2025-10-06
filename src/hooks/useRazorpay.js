import { useState, useEffect } from 'react'

/**
 * A custom hook to dynamically load the Razorpay SDK script.
 * @returns {boolean} - Returns true if the script is loaded, false otherwise.
 */
const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if the script is already present
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      console.error('Razorpay SDK could not be loaded.')
      setIsLoaded(false)
    }

    document.body.appendChild(script)

    return () => {
      // Clean up the script when the component unmounts
      const existingScript = document.querySelector(`script[src="${script.src}"]`)
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  return isLoaded
}

export default useRazorpay
