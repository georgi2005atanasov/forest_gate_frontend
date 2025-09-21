import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Settings.styles.css';

const Dashboard = () => {
    const token = Cookies.get("auth_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>this is gonna be the dashboard</>
};

export default Dashboard;