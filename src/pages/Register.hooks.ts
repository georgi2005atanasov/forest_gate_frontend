import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStableFingerprint } from "../utils/common";
import { prepareOnboarding } from "../api/onboarding/api";

export const useRegisterHandlers = () => {
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

    useEffect(() => {
        const prepareRegister = async () => {
            try {
                const resp = await prepareOnboarding('1.2.3');
                console.log('Visitor ID:', resp.visitorId);
            } catch (e) {
                console.error(e);
            }
        }

        prepareRegister();
    }, []);

    return {
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
    };
}
