import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Home,
    CalendarCheck,
    ClipboardList,
    Star,
    User,
    Users,
    ClipboardPlus,
    Settings,
    Menu,
    X,
    Upload,
    History
} from "lucide-react";

interface SideBar {
    title: string;
    path: string;
    icon: React.ReactNode;
}

const userSidebarContent: Array<SideBar> = [
    { title: "Book Now", path: "book-now", icon: <Home size={20} /> },
    { title: "My Bookings", path: "my-bookings", icon: <CalendarCheck size={20} /> },
    { title: "Reviews", path: "my-reviews", icon: <Star size={20} /> },
    { title: "Profile", path: "profile/:id", icon: <User size={20} /> },
];

const adminSidebarContent: Array<SideBar> = [
    { title: "Bookings", path: "current-bookings", icon: <Users size={20} /> },
    { title: "All Users", path: "all-users", icon: <Users size={20} /> },
    { title: "Past Bookings", path: "past-bookings", icon: <ClipboardPlus size={20} /> },
    { title: "Add Management", path: "add-management", icon: <Settings size={20} /> },
    { title: "Profile", path: "profile/:id", icon: <User size={20} /> },
];

const orgSidebarContent: Array<SideBar> = [
    { title: "Book Now", path: "book-now", icon: <Home size={20} /> },
    { title: "My Bookings", path: "my-bookings", icon: <CalendarCheck size={20} /> },
    { title: "Reviews", path: "my-reviews", icon: <Star size={20} /> },
    { title: "Profile", path: "profile/:id", icon: <User size={20} /> },
];


export const empSidebarContent: Array<SideBar> = [
    { title: "My Tasks", path: "tasks/assigned", icon: <ClipboardList size={20} /> },
    { title: "Past Works", path: "tasks/in-progress", icon: <ClipboardList size={20} /> },
    { title: "Profile", path: "profile/:id", icon: <User size={20} /> },
];

type UserRole = "user" | "admin" | "org" | "emp";

const sidebarMap: Record<UserRole, SideBar[]> = {
    user: userSidebarContent,
    admin: adminSidebarContent,
    org: orgSidebarContent,
    emp: empSidebarContent,
};

const Sidebar = ({ UserRoles }: { UserRoles: UserRole }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const items = sidebarMap[UserRoles];

    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    return (
        <div>
            {/* Mobile Menu Toggle Button */}
            <button
                onClick={toggleMobileSidebar}
                className="fixed top-4 left-4 z-50 md:hidden bg-[#F0EAD2] p-2 rounded-xl shadow-lg border border-[#6C584C]/20 hover:shadow-xl transition-all duration-300"
            >
                {isMobileOpen ? <X size={24} className="text-[#6C584C]" /> : <Menu size={24} className="text-[#6C584C]" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-72 h-screen fixed top-0 left-0 bg-[#F0EAD2] shadow-2xl border-r border-[#6C584C]/10 backdrop-blur-sm">
                {/* Header */}
                <div className="p-8 border-b border-[#6C584C]/10 bg-gradient-to-r from-[#F0EAD2] to-[#F0EAD2]/90">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-xl flex items-center justify-center shadow-lg">
                            <Home size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#141414] tracking-tight">Dashboard</h2>
                            <p className="text-sm text-[#6C584C] capitalize">{UserRoles} Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-6 overflow-y-auto">
                    {items.map((item, index) => (
                        <NavLink
                            key={`${item.path}-${index}`}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-4 px-5 py-4 rounded-2xl relative transition-all duration-300
                ${isActive
                                    ? "bg-gradient-to-r from-[#38B000] to-[#2E8B00] text-white shadow-lg scale-[1.02]"
                                    : "text-[#6C584C] hover:bg-white/60 hover:text-[#141414]"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="mt-auto p-6 border-t border-[#6C584C]/10">
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-[#6C584C]/10">
                        <p className="text-xs text-[#6C584C] font-medium">Need help?</p>
                        <p className="text-sm text-[#141414] font-semibold">Contact Support</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#F0EAD2] shadow-2xl z-40 transform transition-transform duration-300 md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 pt-16 border-b border-[#6C584C]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-xl flex items-center justify-center shadow-lg">
                            <Home size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#141414]">Dashboard</h2>
                            <p className="text-sm text-[#6C584C] capitalize">{UserRoles} Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
                    {items.map((item, index) => (
                        <NavLink
                            key={`mobile-${item.path}-${index}`}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
                ${isActive
                                    ? "bg-gradient-to-r from-[#38B000] to-[#2E8B00] text-white shadow-lg"
                                    : "text-[#6C584C] hover:bg-white/60 hover:text-[#141414]"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-[#F0EAD2]/95 backdrop-blur-md border-t border-[#6C584C]/10 md:hidden shadow-2xl">
                <div className="flex justify-around items-center py-2 px-2">
                    {items.slice(0, 4).map((item, index) => (
                        <NavLink
                            key={`bottom-${item.path}-${index}`}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center text-xs px-3 py-3 rounded-xl transition-all duration-300 min-w-0 flex-1 mx-1
                ${isActive
                                    ? "text-[#38B000] font-bold bg-white/60 shadow-md scale-105"
                                    : "text-[#6C584C] hover:text-[#141414] hover:bg-white/30"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="mt-1 truncate w-full text-center leading-tight">{item.title}</span>
                        </NavLink>
                    ))}

                    {/* More button if there are extra items */}
                    {items.length > 4 && (
                        <button
                            onClick={toggleMobileSidebar}
                            className="flex flex-col items-center text-xs px-3 py-3 rounded-xl transition-all duration-300 text-[#6C584C] hover:text-[#141414] hover:bg-white/30 min-w-0 flex-1 mx-1"
                        >
                            <Menu size={20} />
                            <span className="mt-1 truncate w-full text-center leading-tight">More</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
