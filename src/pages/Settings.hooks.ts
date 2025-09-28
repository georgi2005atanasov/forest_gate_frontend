import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/appConstants';


interface ErrorProps {
    version: any;
    health: any;
    config: any
}

type FieldErrors = Partial<Record<
    'ai_model' | 'token_validity_seconds' | 'refresh_token_validity_seconds' | 'vector_similarity_threshold',
    string
>>;

export const useSettingsHandlers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        version: false,
        health: false,
        config: false,
        saving: false
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [data, setData] = useState({
        version: { name: undefined, version: undefined },
        health: {
            status: undefined,
            host: {
                host_name: undefined,
                system_name: undefined,
                cpu_usage_per_core: '',
                memory: {
                    used_kb: undefined,
                    total_kb: undefined,
                }

            },
            timestamp: undefined
        },
        config: { host: undefined, system_name: undefined }
    });

    const [configForm, setConfigForm] = useState({
        ai_model: '',
        allow_recovery_codes: true,
        allow_refresh_tokens: true,
        id: 1073741824,
        refresh_token_validity_seconds: 1073741824,
        token_validity_seconds: 1073741824,
        vector_similarity_threshold: 1073741824
    });

    const [errors, setErrors] = useState<ErrorProps>({
        version: undefined,
        health: undefined,
        config: undefined
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Version Info
    const fetchVersion = async () => {
        setLoading(prev => ({ ...prev, version: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/system/version`);
            if (!response.ok) throw new Error('Failed to fetch version');
            const versionData = await response.json();
            setData(prev => ({ ...prev, version: versionData }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, version: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, version: false }));
        }
    };

    // Fetch Health Info
    const fetchHealth = async () => {
        setLoading(prev => ({ ...prev, health: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/system/health`);
            if (!response.ok) throw new Error('Failed to fetch health');
            const healthData = await response.json();
            setData(prev => ({ ...prev, health: healthData }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, health: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, health: false }));
        }
    };

    // Fetch Config
    const fetchConfig = async () => {
        setLoading(prev => ({ ...prev, config: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/system/config`);
            if (!response.ok) throw new Error('Failed to fetch config');
            const configData = await response.json();
            setData(prev => ({ ...prev, config: configData }));
            setConfigForm(configData);
        } catch (error: any) {
            setErrors(prev => ({ ...prev, config: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, config: false }));
        }
    };

    const validateConfigForm = (form = configForm) => {
        const fe: FieldErrors = {};

        if (!form.ai_model || !String(form.ai_model).trim()) {
            fe.ai_model = 'Model is required.';
        }

        if (!Number.isFinite(form.token_validity_seconds) || form.token_validity_seconds < 60) {
            fe.token_validity_seconds = 'Must be at least 60 seconds.';
        }

        if (form.allow_refresh_tokens) {
            if (
                !Number.isFinite(form.refresh_token_validity_seconds) ||
                form.refresh_token_validity_seconds < 60
            ) {
                fe.refresh_token_validity_seconds = 'Must be at least 60 seconds.';
            }
        }

        if (
            !Number.isFinite(form.vector_similarity_threshold) ||
            form.vector_similarity_threshold < 0 ||
            form.vector_similarity_threshold > 100
        ) {
            fe.vector_similarity_threshold = 'Must be between 0 and 100.';
        }

        setFieldErrors(fe);
        return Object.keys(fe).length === 0;
    };

    // Update Config
    const updateConfig = async (e: any) => {
        e.preventDefault();

        // client-side validation
        if (!validateConfigForm()) {
            setErrors(prev => ({ ...prev, config: 'Please fix the errors below.' }));
            return; // STOP request when invalid
        }

        setLoading(prev => ({ ...prev, saving: true }));
        setErrors(prev => ({ ...prev, config: null }));
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/system/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configForm),
            });

            if (!response.ok) throw new Error('Failed to update configuration');

            const updatedConfig = await response.json();
            setData(prev => ({ ...prev, config: updatedConfig }));
            setSuccessMessage('Configuration updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            setErrors(prev => ({ ...prev, config: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, saving: false }));
        }
    };

    // Handle form input changes (better number handling + clear per-field error)
    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setConfigForm(prev => {
            if (type === 'checkbox') {
                const next = { ...prev, [name]: checked };
                // if refresh tokens disabled, clear its field error
                if (name === 'allow_refresh_tokens' && !checked) {
                    setFieldErrors(f => ({ ...f, refresh_token_validity_seconds: undefined }));
                }
                return next;
            }

            if (type === 'number') {
                // float for vector threshold, int for the others
                const num =
                    name === 'vector_similarity_threshold'
                        ? parseFloat(value)
                        : parseInt(value, 10);

                return { ...prev, [name]: Number.isNaN(num) ? ('' as any) : num };
            }

            return { ...prev, [name]: value };
        });

        // clear this field’s error as user types
        setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // Load all data on component mount
    useEffect(() => {
        fetchVersion();
        fetchHealth();
        fetchConfig();
    }, []);

    // Refresh all data
    const refreshAll = () => {
        fetchVersion();
        fetchHealth();
        fetchConfig();
    };

    const goBack = () => {
        navigate(-1);
    };

    // Format CPU usage
    const getAverageCPU = (cpuCores: any) => {
        if (!cpuCores || cpuCores.length === 0) return '0';
        const avg = cpuCores.reduce((sum: any, core: any) => sum + core, 0) / cpuCores.length;
        return avg.toFixed(1);
    };

    return {
        loading,
        data,
        configForm,
        errors,
        successMessage,
        updateConfig,
        handleInputChange,
        refreshAll,
        goBack,
        getAverageCPU,
        fieldErrors,
    };
}
