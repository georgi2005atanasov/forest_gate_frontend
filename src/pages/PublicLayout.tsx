import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column app-bg">
            <Outlet />
        </div>
    );
}

export default PublicLayout;
