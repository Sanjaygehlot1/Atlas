import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components'; // Import keyframes and css from styled-components

// Keyframes for the ball movement and line growth
const ballMove = keyframes`
  0% {
    left: 0%;
    transform: translateX(0%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateX(calc(100% - 24px)) scale(1.1); /* Move to end, slightly larger */
    opacity: 1;
  }
  100% {
    left: 100%;
    transform: translateX(calc(-100% - 24px)) scale(1); /* Ensure it ends at the other side */
    opacity: 0;
  }
`;

const lineGrow = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

// Styled component for the animated ball and line
const AnimatedPath = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px; /* Height of the line */
  background-color: white; /* White line */
  transform: translateY(-50%);
  overflow: hidden; /* Hide overflowing ball at start/end */
  z-index: 10;
  pointer-events: none; /* Allow clicks to pass through */

  &::before { /* The moving ball */
    content: '';
    position: absolute;
    top: -11px; /* Center ball vertically on the line */
    left: 0;
    width: 24px;
    height: 24px;
    background-color: #2563eb; /* Blue color for the ball */
    border-radius: 50%;
    box-shadow: 0 0 8px #2563eb, 0 0 16px #2563eb; /* Glowing effect */
    animation: ${ballMove} 1.5s forwards ease-in-out; /* Animation for ball */
  }

  ${props => props.animating && css`
    animation: ${lineGrow} 1.5s forwards ease-in-out; /* Animation for line */
  `}
`;

// --- Security Verification Form Component ---
const SecurityVerificationForm = ({ onVerify, onBackToRegistration }) => {
  const [code, setCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeValidationStatus, setCodeValidationStatus] = useState('none'); // 'none', 'valid', 'invalid'

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setIsVerifying(true);
    setCodeValidationStatus('none'); // Reset status on new submission

    if (!code) {
      setVerificationError('Please enter the verification code.');
      setIsVerifying(false);
      setCodeValidationStatus('invalid');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      if (code === '1234') { // Simple hardcoded code for simulation
        setCodeValidationStatus('valid');
        alert('Verification successful! Proceeding to dashboard.'); // Replace with actual navigation
        // In a real app, you'd call a parent function to navigate or show success
      } else {
        setVerificationError('Invalid code. Please try again.');
        setCodeValidationStatus('invalid');
      }
    } catch (err) {
      setVerificationError('An error occurred during verification.');
      console.error('Verification error:', err);
      setCodeValidationStatus('invalid');
    } finally {
      setIsVerifying(false);
    }
  };

  // Determine border color based on validation status
  const getInputBorderColor = () => {
    if (codeValidationStatus === 'valid') {
      return '#047857'; // Green
    } else if (codeValidationStatus === 'invalid') {
      return '#b91c1c'; // Red
    }
    return '#2563eb'; // Dark blue for default/focus
  };

  return (
    <div className="verification-panel">
      <h2 className="title" style={{ fontSize: '2em', textAlign: 'center', color: '#1e40af', marginBottom: '10px' }}>
        Verification
      </h2>
      <p className="message" style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>
        Please enter the 4-digit code sent to your email.
      </p>

      {verificationError && <div className="error-message">{verificationError}</div>}

      <form onSubmit={handleVerifySubmit} className="verification-form">
        <label style={{ marginBottom: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <input
            required
            placeholder="••••"
            type="text"
            className="input"
            value={code}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 4) {
                setCode(value);
                // Reset validation status when user starts typing again
                if (codeValidationStatus !== 'none') setCodeValidationStatus('none');
              }
            }}
            maxLength="4"
            style={{
              textAlign: 'center',
              letterSpacing: '5px',
              width: '150px',
              padding: '12px',
              fontSize: '1.2em',
              borderRadius: '8px',
              border: `1px solid ${getInputBorderColor()}`, // Dynamic border color
              transition: 'border-color 0.3s ease' // Smooth transition for border color
            }}
          />
          <span style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: code ? '-10px' : '12px',
            color: code ? '#2563eb' : '#8c8c8c',
            fontSize: code ? '0.75em' : '1em',
            fontWeight: code ? '600' : 'normal',
            backgroundColor: '#fff',
            padding: '0 4px',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1
          }}>Verification Code</span>
        </label>

        <button type="submit" className="submit" disabled={isVerifying} style={{ marginTop: '10px' }}>
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
          <p className="signin">
            Didn't receive code? <a href="#" onClick={onBackToRegistration}>Resend</a>
          </p>
          <p className="signin">
            <a href="#" onClick={onBackToRegistration}>Back to Registration</a>
          </p>
        </div>
      </form>
    </div>
  );
};

// --- Registration Form Component ---
const RegistrationForm = ({ onLoginClick }) => {
  // State variables for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [rollNo, setRollNo] = useState('');

  // State variables for validation errors
  const [emailError, setEmailError] = useState('');
  const [rollNoError, setRollNoError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('details'); // 'details', 'animating', 'verification'

  // Email validation regex for @atharvacoe.ac.in domain
  const atharvaEmailRegex = /^[^\s@]+@atharvacoe\.ac\.in$/;

  // Handle email input change and validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !atharvaEmailRegex.test(value)) {
      setEmailError('Only use college email (@atharvacoe.ac.in).');
    } else {
      setEmailError('');
    }
  };

  // Handle roll number input change and validation
  const handleRollNoChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 2 characters
    if (/^\d*$/.test(value) && value.length <= 2) {
      setRollNo(value);
      setRollNoError('');
    } else if (value.length > 2) {
      setRollNoError('Roll No must be max 2 digits.');
    } else if (!/^\d*$/.test(value)) {
      setRollNoError('Roll No must be numeric.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setFormError(''); // Clear general form errors
    setSuccessMessage(''); // Clear success messages
    setEmailError(''); // Clear specific email errors
    setRollNoError(''); // Clear specific roll no errors
    setIsLoading(true); // Set loading state

    let isValid = true;

    // Basic required field validation
    if (!email || !password || !department || !year || !rollNo) {
      setFormError('Please fill in all required fields.');
      isValid = false;
    }

    // Email format validation
    if (email && !atharvaEmailRegex.test(email)) {
      setEmailError('Only use college email (@atharvacoe.ac.in).');
      isValid = false;
    }

    // Roll No validation
    if (rollNo && (!/^\d+$/.test(rollNo) || rollNo.length > 2)) {
      setRollNoError('Roll No must be a max 2-digit number.');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    // If validation passes, start animation and transition to verification step
    setCurrentStep('animating');
    setTimeout(() => {
      setIsLoading(false); // Stop loading after animation
      setCurrentStep('verification');
      setSuccessMessage(''); // Clear success message from registration, if any
      setFormError(''); // Clear form error
    }, 1500); // Animation duration
  };

  const handleBackToRegistration = (e) => {
    e.preventDefault();
    setCurrentStep('details');
    setFormError('');
    setSuccessMessage('');
  };

  return (
    <StyledWrapper>
      {currentStep === 'animating' && <AnimatedPath animating={true} />} {/* Show animation during transition */}

      {currentStep === 'details' && (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Register</p>
          <p className="message">Signup now and get full access to our app.</p>
          
          {/* General form error message */}
          {formError && <div className="error-message">{formError}</div>}
          {/* Success message */}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <label>
            <input
              required
              placeholder=""
              type="email"
              className="input"
              value={email}
              onChange={handleEmailChange}
            />
            <span>Email ID</span>
            {emailError && <p className="input-error">{emailError}</p>}
          </label>

          <label>
            <input
              required
              placeholder=""
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </label>

          <label>
            <select
              required
              className="input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled hidden>Select Department</option>
              <option value="EXTC">EXTC</option>
              <option value="ECS">ECS</option>
              <option value="INFT">INFT</option>
              <option value="CMPN">CMPN</option>
            </select>
            <span>Department</span>
          </label>

          <label>
            <select
              required
              className="input"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled hidden>Select Year</option>
              <option value="FE">FE</option>
              <option value="SE">SE</option>
              <option value="TE">TE</option>
              <option value="BE">BE</option>
            </select>
            <span>Year</span>
          </label>

          <label>
            <input
              required
              placeholder=""
              type="text" // Keep as text to control input precisely
              className="input"
              value={rollNo}
              onChange={handleRollNoChange}
              maxLength="2" // HTML attribute for max length
            />
            <span>Roll No</span>
            {rollNoError && <p className="input-error">{rollNoError}</p>}
          </label>

          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? 'Continuing...' : 'Continue'}
          </button>
          <p className="signin">Already have an account? <a href="#" onClick={onLoginClick}>Login</a> </p>
        </form>
      )}

      {currentStep === 'verification' && (
        <SecurityVerificationForm onVerify={() => { /* Handle successful verification */ }} onBackToRegistration={handleBackToRegistration} />
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures the wrapper takes full viewport height */
  background-color: #e6f7ff; /* Light blue background from login UI */
  padding: 20px; /* Add some padding for smaller screens */
  box-sizing: border-box; /* Include padding in element's total width and height */

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 380px;
    width: 100%;
    background-color: #fff; /* Explicitly white background for the form itself */
    padding: 30px;
    border-radius: 20px; /* Increased border-radius for smoother corners */
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #93c5fd; /* Added blue border, matching border-blue-200 from login UI */
    transition: opacity 0.5s ease-in-out; /* Smooth transition for form content */
    margin: 0 auto; /* Reinforce horizontal centering */
  }

  .verification-panel { /* Styles for the SecurityVerificationForm's outer div */
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 380px;
    width: 100%;
    background-color: #fff;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #93c5fd;
    margin: 0 auto; /* Centering the panel */
  }

  .verification-form { /* Styles for the form inside SecurityVerificationForm */
    display: flex;
    flex-direction: column;
    gap: 15px; /* Consistent gap */
    align-items: center; /* Center items within the form */
    box-shadow: none; /* Remove redundant shadow */
    padding: 0; /* Remove redundant padding */
    border: none; /* Remove redundant border */
  }


  .title {
    font-size: 2em;
    color: #1e40af; /* Adjusted to match text-blue-800 */
    font-weight: 700;
    letter-spacing: -0.5px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 35px;
    margin-bottom: 10px;
  }

  .title::before, .title::after {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    border-radius: 50%;
    left: 0px;
    background-color: #2563eb; /* Adjusted to match bg-blue-600 */
  }

  .title::before {
    width: 20px;
    height: 20px;
    background-color: #2563eb; /* Adjusted to match bg-blue-600 */
  }

  .title::after {
    width: 20px;
    height: 20px;
    animation: pulse 1s linear infinite;
  }

  .message, .signin {
    color: #4b5563; /* Adjusted to match text-gray-700 */
    font-size: 0.9em;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .signin {
    text-align: center;
    margin-top: 20px;
  }

  .signin a {
    color: #2563eb; /* Adjusted to match text-blue-600 */
    text-decoration: none;
    font-weight: 600;
  }

  .signin a:hover {
    text-decoration: underline;
    color: #1e40af; /* Adjusted to match hover:text-blue-800 */
  }

  .form label {
    position: relative;
    margin-bottom: 5px;
  }

  .form label .input {
    width: 100%;
    padding: 12px 12px 12px 12px;
    outline: none;
    border: 1px solid #93c5fd; /* Adjusted to match border-blue-300 */
    border-radius: 8px; /* Consistent border-radius */
    background-color: #fff;
    font-size: 1em;
    color: #333; /* Darker text color for inputs */
    box-sizing: border-box;
    transition: all 0.3s ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  /* Custom arrow for select dropdowns */
  .form label select.input {
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232563eb%22%20d%3D%22M287%2C114.7L159.1%2C242.6c-4.7%2C4.7-12.3%2C4.7-17%2C0L5.4%2C114.7c-4.7%2C4.7-4.7%2C12.3%2C0%2C17l127.9%2C127.9c4.7%2C4.7%2C12.3%2C4.7%2C17%2C0l127.9-127.9C291.7%2C127%2C291.7%2C119.4%2C287%2C114.7z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px auto;
    padding-right: 35px;
  }

  .form label .input:focus {
    border-color: #2563eb; /* Adjusted to match focus:ring-blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); /* Adjusted to match focus:ring-blue-500 opacity */
  }

  .form label .input + span {
    position: absolute;
    left: 12px;
    top: 12px;
    color: #8c8c8c;
    font-size: 1em;
    cursor: text;
    transition: 0.3s ease;
    pointer-events: none;
  }

  .form label .input:placeholder-shown + span {
    top: 12px;
    font-size: 1em;
  }

  .form label .input:focus + span,
  .form label .input:not(:placeholder-shown) + span,
  .form label select:focus + span,
  .form label select:not([value=""]) + span {
    top: -10px;
    left: 8px;
    font-size: 0.75em;
    font-weight: 600;
    color: #2563eb; /* Adjusted to match text-blue-600 */
    background-color: #fff;
    padding: 0 4px;
    z-index: 1;
  }
  
  .form label .input:valid:not(:placeholder-shown) + span {
    color: #047857; /* Adjusted to match text-green-700 */
  }

  .submit {
    border: none;
    outline: none;
    background-color: #2563eb; /* Adjusted to match bg-blue-600 */
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
  }

  .submit:hover {
    background-color: #1d4ed8; /* Adjusted to match hover:bg-blue-700 */
    transform: translateY(-2px);
  }

  .submit:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    transform: translateY(0);
  }

  .error-message {
    color: #b91c1c; /* Adjusted to match text-red-700 */
    font-size: 0.85em;
    margin-bottom: 10px;
    text-align: center;
  }

  .input-error {
    color: #b91c1c; /* Adjusted to match text-red-700 */
    font-size: 0.75em;
    margin-top: 4px;
    margin-left: 12px;
  }

  .success-message {
    color: #047857; /* Adjusted to match text-green-700 */
    font-size: 0.9em;
    margin-bottom: 10px;
    text-align: center;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;
export default RegistrationForm;
