import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.styles.css';

const Register = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        verificationCode: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Mock API calls
    const mockSendVerification = async (email: any) => {
        setLoading(true);
        setError('');

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setLoading(false);
                // Mock validation - reject if email is invalid format
                if (!email.includes('@') || !email.includes('.')) {
                    reject(new Error('Please enter a valid email address'));
                    return;
                }
                // Mock server error for testing
                if (email.includes('error')) {
                    reject(new Error('Email already exists'));
                    return;
                }
                resolve({ success: true, message: 'Verification code sent' });
            }, 1500);
        });
    };

    const mockVerifyCode = async (code: any) => {
        setLoading(true);
        setError('');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setLoading(false);
                // Mock validation - accept 123456 as valid code
                if (code !== '123456') {
                    reject(new Error('Invalid verification code. Try 123456 for demo.'));
                    return;
                }
                resolve({ success: true, message: 'Code verified successfully' });
            }, 1000);
        });
    };

    const mockCreateAccount = async (userData: any) => {
        setLoading(true);
        setError('');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setLoading(false);
                // Mock validation
                if (userData.password !== userData.confirmPassword) {
                    reject(new Error('Passwords do not match'));
                    return;
                }
                if (userData.password.length < 6) {
                    reject(new Error('Password must be at least 6 characters long'));
                    return;
                }
                if (userData.username.length < 3) {
                    reject(new Error('Username must be at least 3 characters long'));
                    return;
                }
                resolve({ success: true, message: 'Account created successfully' });
            }, 1500);
        });
    };

    // Step 1: Email submission
    const handleEmailSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await mockSendVerification(formData.email);
            setCurrentStep(2);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Step 2: Verification code
    const handleVerificationSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await mockVerifyCode(formData.verificationCode);
            setCurrentStep(3);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Step 3: Account creation
    const handleAccountCreation = async (e: any) => {
        e.preventDefault();

        try {
            await mockCreateAccount(formData);
            // Redirect to login or dashboard
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Handle input changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    // Go back to previous step
    const goToPreviousStep = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Go back to home
    const goBack = () => {
        navigate(-1);
    };

    // Auto-focus and format verification code
    const handleVerificationInput = (e: any) => {
        let value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setFormData(prev => ({
                ...prev,
                verificationCode: value
            }));
        }
        if (error) setError('');
    };

    // Resend verification code
    const resendCode = async () => {
        try {
            await mockSendVerification(formData.email);
            setError('');
            // Could show success message here
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="register-main flex-grow-1 d-flex align-items-center py-5">
            <div className="register-background"></div>

            <div className="container position-relative">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                        {/* Back Button */}
                        <button
                            onClick={goBack}
                            className="back-button mb-4 btn d-flex align-items-center gap-2"
                            type="button"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            Back
                        </button>

                        {/* Progress Indicator */}
                        <div className="progress-container mb-4">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                ></div>
                            </div>
                            <div className="progress-steps">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                                    >
                                        <div className="step-number">{step}</div>
                                        <div className="step-label">
                                            {step === 1 && 'Email'}
                                            {step === 2 && 'Verify'}
                                            {step === 3 && 'Create'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="register-card">

                            {/* Step 1: Email Input */}
                            {currentStep === 1 && (
                                <div className="register-step step-email">
                                    <div className="register-card-header">
                                        <div className="register-icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <h1 className="register-title">Create Account</h1>
                                        <p className="register-subtitle">Enter your email to get started</p>
                                    </div>

                                    <div className="register-card-body">
                                        <form onSubmit={handleEmailSubmit} className="register-form">

                                            {error && (
                                                <div className="error-message mb-4">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="15" y1="9" x2="9" y2="15" />
                                                        <line x1="9" y1="9" x2="15" y2="15" />
                                                    </svg>
                                                    {error}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="email" className="form-label">
                                                    Email Address
                                                </label>
                                                <div className="input-wrapper">
                                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                    <input
                                                        type="email"
                                                        className="form-control ps-5"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="register-button" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <div className="spinner"></div>
                                                        Sending Code...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Verification Code</span>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M5 12h14" />
                                                            <path d="M12 5l7 7-7 7" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Verification Code */}
                            {currentStep === 2 && (
                                <div className="register-step step-verification">
                                    <div className="register-card-header">
                                        <div className="register-icon verification-icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 12l2 2 4-4" />
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                        </div>
                                        <h1 className="register-title">Verify Your Email</h1>
                                        <p className="register-subtitle">
                                            We sent a 6-digit code to<br />
                                            <strong>{formData.email}</strong>
                                        </p>
                                    </div>

                                    <div className="register-card-body">
                                        <form onSubmit={handleVerificationSubmit} className="register-form">

                                            {error && (
                                                <div className="error-message mb-4">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="15" y1="9" x2="9" y2="15" />
                                                        <line x1="9" y1="9" x2="15" y2="15" />
                                                    </svg>
                                                    {error}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="verificationCode" className="form-label">
                                                    Verification Code
                                                </label>
                                                <div className="verification-input-wrapper">
                                                    <input
                                                        type="text"
                                                        className="verification-input"
                                                        id="verificationCode"
                                                        name="verificationCode"
                                                        placeholder="123456"
                                                        value={formData.verificationCode}
                                                        onChange={handleVerificationInput}
                                                        maxLength={6}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="input-help">
                                                    Enter the 6-digit code from your email
                                                </div>
                                            </div>

                                            <div className="form-actions-vertical">
                                                <button type="submit" className="register-button" disabled={loading || formData.verificationCode.length !== 6}>
                                                    {loading ? (
                                                        <>
                                                            <div className="spinner"></div>
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Verify Code</span>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M5 12h14" />
                                                                <path d="M12 5l7 7-7 7" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>

                                                <div className="form-links">
                                                    <button
                                                        type="button"
                                                        onClick={goToPreviousStep}
                                                        className="link-button"
                                                    >
                                                        ← Change Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={resendCode}
                                                        className="link-button"
                                                        disabled={loading}
                                                    >
                                                        Resend Code
                                                    </button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Account Creation */}
                            {currentStep === 3 && (
                                <div className="register-step step-account">
                                    <div className="register-card-header">
                                        <div className="register-icon account-icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <h1 className="register-title">Complete Setup</h1>
                                        <p className="register-subtitle">Create your username and password</p>
                                    </div>

                                    <div className="register-card-body">
                                        <form onSubmit={handleAccountCreation} className="register-form">

                                            {error && (
                                                <div className="error-message mb-4">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="15" y1="9" x2="9" y2="15" />
                                                        <line x1="9" y1="9" x2="15" y2="15" />
                                                    </svg>
                                                    {error}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="username" className="form-label">
                                                    Username
                                                </label>
                                                <div className="input-wrapper">
                                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        name="username"
                                                        placeholder="Choose a username"
                                                        value={formData.username}
                                                        onChange={handleInputChange}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password" className="form-label">
                                                    Password
                                                </label>
                                                <div className="input-wrapper">
                                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        placeholder="Create a password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="confirmPassword" className="form-label">
                                                    Confirm Password
                                                </label>
                                                <div className="input-wrapper">
                                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="Confirm your password"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-actions-vertical">
                                                <button type="submit" className="register-button" disabled={loading}>
                                                    {loading ? (
                                                        <>
                                                            <div className="spinner"></div>
                                                            Creating Account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Create Account</span>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M9 12l2 2 4-4" />
                                                                <circle cx="12" cy="12" r="10" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>

                                                <div className="form-links">
                                                    <button
                                                        type="button"
                                                        onClick={goToPreviousStep}
                                                        className="link-button"
                                                    >
                                                        ← Back to Verification
                                                    </button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;