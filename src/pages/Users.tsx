import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Settings.styles.css';

const Users = () => {
    const token = Cookies.get("auth_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>these are gonna be the users</>
};

export default Users;