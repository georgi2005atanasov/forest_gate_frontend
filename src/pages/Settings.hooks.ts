import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/appConstants';


interface ErrorProps {
    version: any;
    health: any;
    config: any
}


export const useSettingsHandlers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        version: false,
        health: false,
        config: false,
        saving: false
    });

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

    // Update Config
    const updateConfig = async (e: any) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, saving: true }));
        setErrors(prev => ({ ...prev, config: null }));
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/system/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configForm)
            });

            if (!response.ok) {
                throw new Error('Failed to update configuration');
            }

            const updatedConfig = await response.json();
            setData(prev => ({ ...prev, config: updatedConfig }));
            setSuccessMessage('Configuration updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error: any) {
            setErrors(prev => ({ ...prev, config: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, saving: false }));
        }
    };

    // Handle form input changes
    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setConfigForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
        }));
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
    };
}
