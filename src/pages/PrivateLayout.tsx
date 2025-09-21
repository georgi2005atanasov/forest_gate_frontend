import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column app-bg">
            <Outlet />
        </div>
    );
}

export default PrivateLayout;
