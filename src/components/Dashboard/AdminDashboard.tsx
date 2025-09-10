import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, Building2, PlusCircle } from "lucide-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// --- Types ---
type BookingStatus = "Requested" | "Assigned" | "In Progress" | "Completed";
type BookingSource = { kind: "User"; name: string } | { kind: "Organization"; name: string };
type Booking = {
    id: number;
    service: string;
    source: BookingSource; // User or Organization
    status: BookingStatus;
    employeeId: number | null;
};
type Employee = { id: number; name: string; role: string; available: boolean };

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("bookings");

    // --- Mock Data ---
    const [employees, setEmployees] = useState<Employee[]>([
        { id: 1, name: "John Abraham", role: "Technician", available: true },
        { id: 2, name: "Priya Desai", role: "AC Specialist", available: true },
        { id: 3, name: "Arun Kumar", role: "Plumber", available: false },
    ]);

    const [bookings, setBookings] = useState<Booking[]>([
        { id: 1, service: "AC Repair", source: { kind: "User", name: "Rahul Sharma" }, status: "Requested", employeeId: null },
        { id: 2, service: "Office Cleaning", source: { kind: "Organization", name: "TechCorp" }, status: "In Progress", employeeId: 1 },
        { id: 3, service: "Carpet Shampoo", source: { kind: "Organization", name: "FinServe" }, status: "Assigned", employeeId: 2 },
        { id: 4, service: "Washing Machine Fix", source: { kind: "User", name: "Sneha Patel" }, status: "Completed", employeeId: 3 },
    ]);

    const [filter, setFilter] = useState<"All" | "Users" | "Organizations">("All");

    const filteredBookings = useMemo(() => {
        if (filter === "All") return bookings;
        if (filter === "Users") return bookings.filter(b => b.source.kind === "User");
        return bookings.filter(b => b.source.kind === "Organization");
    }, [bookings, filter]);

    const menuItems = [
        { key: "bookings", label: "All Bookings", icon: <ClipboardList /> },
        { key: "users", label: "Manage Users", icon: <Users /> },
        { key: "organizations", label: "Manage Orgs", icon: <Building2 /> },
        { key: "add", label: "Add Org/Employee", icon: <PlusCircle /> },
    ];

    const statusOptions: BookingStatus[] = ["Requested", "Assigned", "In Progress", "Completed"];

    // --- Helpers ---
    const employeeName = (id: number | null) => (id ? employees.find(e => e.id === id)?.name ?? "Unknown" : "Not Assigned");

    // Keep employee availability in sync with booking status
    const setEmployeeAvailability = (employeeId: number | null, available: boolean) => {
        if (!employeeId) return;
        setEmployees(prev => prev.map(e => (e.id === employeeId ? { ...e, available } : e)));
    };

    const handleAssign = (bookingId: number, newEmployeeId: number | null) => {
        setBookings(prev => {
            const copy = prev.map(b => ({ ...b }));
            const idx = copy.findIndex(b => b.id === bookingId);
            if (idx === -1) return prev;

            const oldEmployeeId = copy[idx].employeeId;
            // free old employee if changing
            if (oldEmployeeId && oldEmployeeId !== newEmployeeId) {
                setEmployeeAvailability(oldEmployeeId, true);
            }

            copy[idx].employeeId = newEmployeeId;
            // If assigned an employee while status is Requested, move to Assigned
            if (newEmployeeId && copy[idx].status === "Requested") copy[idx].status = "Assigned";

            // mark new assignee unavailable
            if (newEmployeeId) setEmployeeAvailability(newEmployeeId, false);

            return copy;
        });
    };

    const handleStatusChange = (bookingId: number, next: BookingStatus) => {
        setBookings(prev => {
            const copy = prev.map(b => ({ ...b }));
            const idx = copy.findIndex(b => b.id === bookingId);
            if (idx === -1) return prev;
            const b = copy[idx];

            // basic rules for availability
            if (next === "Completed") {
                // free employee on completion
                setEmployeeAvailability(b.employeeId, true);
            }
            if (next === "Requested") {
                // unassign on revert to requested
                setEmployeeAvailability(b.employeeId, true);
                b.employeeId = null;
            }

            b.status = next;
            return copy;
        });
    };

    // Only show available + currently assigned (to keep showing selection) in dropdown
    const selectableEmployees = (currentEmployeeId: number | null) =>
        employees.filter(e => e.available || e.id === currentEmployeeId);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#EBF2FA] text-[#141414]">
            {/* Sidebar / Bottom Nav */}
            <nav className="bg-[#F0EAD2] md:w-64 w-full md:h-auto fixed bottom-0 md:relative flex md:flex-col justify-around md:justify-start shadow-md z-50">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex items-center md:justify-start justify-center gap-2 px-4 py-3 text-sm font-medium transition rounded-lg m-1 md:m-2 ${activeTab === item.key
                                ? "bg-[#38B000] text-white"
                                : "text-[#6C584C] hover:bg-[#38B000]/20"
                            }`}
                    >
                        {item.icon}
                        <span className="hidden md:block">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Main */}
            <main className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
                {activeTab === "bookings" && (
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <h1 className="text-2xl font-bold">All Bookings</h1>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-[#6C584C]">Filter:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as any)}
                                    className="border border-[#6C584C]/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#38B000] bg-white"
                                >
                                    <option>All</option>
                                    <option>Users</option>
                                    <option>Organizations</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[#6C584C]/20 shadow-sm bg-white">
                            <table className="w-full text-sm">
                                <thead className="bg-[#38B000] text-white">
                                    <tr>
                                        <th className="p-3 text-left">#</th>
                                        <th className="p-3 text-left">Service</th>
                                        <th className="p-3 text-left">Source</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-left">Employee</th>
                                        <th className="p-3 text-left">Assign</th>
                                        <th className="p-3 text-left">Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((b) => (
                                        <tr key={b.id} className="border-b border-[#6C584C]/10">
                                            <td className="p-3">{b.id}</td>
                                            <td className="p-3 whitespace-nowrap">{b.service}</td>
                                            <td className="p-3">
                                                <div className="inline-flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold border" style={{
                                                        background: b.source.kind === "User" ? "#EBF2FA" : "#F0EAD2",
                                                        borderColor: "#6C584C33",
                                                        color: "#6C584C",
                                                    }}>{b.source.kind}</span>
                                                    <span className="text-[#6C584C]">{b.source.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 font-medium">
                                                <span className={`px-2 py-1 rounded-md text-xs ${b.status === "Completed" ? "bg-green-100 text-green-700" :
                                                        b.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                                                            b.status === "Assigned" ? "bg-blue-100 text-blue-800" :
                                                                "bg-gray-100 text-gray-700"
                                                    }`}>{b.status}</span>
                                            </td>
                                            <td className="p-3 whitespace-nowrap">{employeeName(b.employeeId)}</td>
                                            <td className="p-3">
                                                <select
                                                    value={b.employeeId ?? ""}
                                                    onChange={(e) => handleAssign(b.id, e.target.value ? Number(e.target.value) : null)}
                                                    className="w-full md:w-48 border border-[#6C584C]/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#38B000]"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {selectableEmployees(b.employeeId).map(emp => (
                                                        <option key={emp.id} value={emp.id}>
                                                            {emp.name} {emp.available ? "(Available)" : "(Busy)"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                                                    className="w-full md:w-48 border border-[#6C584C]/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#38B000]"
                                                >
                                                    {statusOptions.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 text-xs text-[#6C584C]">
                            Tip: assigning an employee will automatically mark them busy; completing a booking frees them.
                        </div>
                    </div>
                )}

                {/* Placeholder sections to keep parity with previous admin UI */}
                {activeTab === "users" && (
                    <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
                        <p className="text-[#6C584C]">Connect your user API to populate this list.</p>
                    </Card>
                )}

                {activeTab === "organizations" && (
                    <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">Manage Organizations</h2>
                        <p className="text-[#6C584C]">Hook up your organizations API here.</p>
                    </Card>
                )}

                {activeTab === "add" && (
                    <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Add Organization / Employee</h2>
                        <input type="text" placeholder="Name" className="w-full border border-[#6C584C]/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#38B000]" />
                        <input type="email" placeholder="Email" className="w-full border border-[#6C584C]/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#38B000]" />
                        <select className="w-full border border-[#6C584C]/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#38B000]">
                            <option value="org">Organization</option>
                            <option value="employee">Employee</option>
                        </select>
                        <Button className="bg-[#38B000] text-white hover:opacity-90 rounded-lg">Create Account</Button>
                    </Card>
                )}
            </main>
        </div>
    );
}