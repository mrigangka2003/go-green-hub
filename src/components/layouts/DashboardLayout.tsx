// DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const DashboardLayout = () => {

    const userRoles = "emp"

    return (

        <div className="flex">
            <Sidebar UserRoles={userRoles}/>
            <main className="flex-1 md:ml-64 bg-[#EBF2FA] min-h-screen p-4 pb-16 md:pb-4">
                <Outlet />
            </main>
        </div>
    )
};

export default DashboardLayout;
