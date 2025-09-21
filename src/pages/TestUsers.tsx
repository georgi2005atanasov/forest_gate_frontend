import { useNavigate } from 'react-router-dom';
import { getStableFingerprint } from '../utils/common';
import { useEffect, useState } from 'react';

const TestUsers = () => {
    const navigate = useNavigate();

    const [fingerprint, setFingerprint] = useState('');

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    useEffect(() => {
        const getFingerprint = async () => {
            const fgprt = await getStableFingerprint();
            setFingerprint(fgprt.fingerprint);
        }

        getFingerprint();
    }, []);

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <h1 className="mb-4">Welcome</h1>
                <p className="mb-4 text-muted">Choose an option to continue</p>

                <div className="d-grid gap-3" style={{ width: '200px' }}>
                    <button
                        onClick={goToLogin}
                        className="btn btn-primary btn-lg"
                        type="button"
                    >
                        Login
                    </button>

                    <button
                        onClick={goToRegister}
                        className="btn btn-outline-primary btn-lg"
                        type="button"
                    >
                        Register
                    </button>
                    <p>{fingerprint}</p>
                </div>
            </div>
        </div>
    );
};

export default TestUsers;