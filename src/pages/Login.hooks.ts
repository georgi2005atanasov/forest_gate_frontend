import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginHandlers = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    const goBack = () => {
        navigate(-1);
    };

    return {
        showPassword,
        setShowPassword,
        formData,
        setFormData,
        handleInputChange,
        handleSubmit,
        goBack,
    };
}
