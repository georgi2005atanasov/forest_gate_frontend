import './Register.styles.css';
import { useRegisterHandlers } from './Register.hooks';

const Register = () => {
    const {
        loading,
        formData,
        currentStep,
        error,
        handleEmailSubmit,
        handleVerificationSubmit,
        handleAccountCreation,
        handleInputChange,
        goToPreviousStep,
        goBack,
        handleVerificationInput,
        resendCode,
    } = useRegisterHandlers();

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