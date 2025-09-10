import React from "react";
import { useNavigate } from "react-router-dom";

// AdminDashboard - single-file React component using Tailwind for layout.
// NOTE: I used CSS variables at the top to apply your palette across the layout.

export default function AdminDashboard() {
    const navigate = useNavigate();

    // Mock data (dynamic, not static UI imports)
    const admin = { name: "Admin Samik Das", role: "Administrator" };

    const stats = [
        { id: "totalBookings", label: "Total Bookings", value: 128 },
        { id: "pendingTasks", label: "Pending Tasks", value: 5 },
        { id: "completed", label: "Completed", value: 45 },
        { id: "feedbacks", label: "Feedbacks", value: 23 },
    ];

    const recentBookings = [
        { id: "B102", user: "Rahul Singh", date: "2025-09-11", status: "Completed" },
        { id: "B103", user: "Ankita Sharma", date: "2025-09-11", status: "Pending" },
        { id: "B104", user: "Arjun Patel", date: "2025-09-10", status: "In Progress" },
        { id: "B105", user: "Meera Joshi", date: "2025-09-09", status: "Assigned" },
    ];

    const employees = [
        { id: 1, name: "Ravi Kumar", tasks: 3, status: "Active" },
        { id: 2, name: "Sana Verma", tasks: 1, status: "Active" },
        { id: 3, name: "Gopal Rao", tasks: 0, status: "Idle" },
    ];

    const feedbacks = [
        { id: 1, user: "Neha", text: "Great service, very quick response!" },
        { id: 2, user: "Vikram", text: "Need improvement in task tracking." },
        { id: 3, user: "Suman", text: "Very professional team." },
    ];

    // Helper to get status color
    const statusColor = (s) => {
        if (s === "Completed") return "text-green-700";
        if (s === "Pending") return "text-red-600";
        if (s === "In Progress") return "text-yellow-600";
        return "text-gray-700";
    };

    return (
        <div
            className="min-h-screen p-8"
            style={{
                // corrected the primary hex if it was missing a char
                // primary used: #38B000 (assumed from input '#38B00')
                background: "linear-gradient(180deg, var(--3rd) 0%, var(--secondary) 100%)",
            }}
        >
            {/* CSS variables for your palette */}
            <style>{`
        :root {
          --primary: #38B000;
          --secondary: #F0EAD2;
          --tertiary: #EBF2FA;
          --dark: #141414;
          --accent: #6C584C;
        }
      `}</style>

            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--dark)" }}>
                        Welcome, {admin.name}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>
                        {admin.role}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/current-bookings")}
                        className="px-4 py-2 rounded-xl font-medium shadow"
                        style={{ backgroundColor: "var(--primary)", color: "white" }}
                    >
                        Go to Current Bookings
                    </button>
                </div>
            </header>

            {/* Overview cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((s) => (
                    <div
                        key={s.id}
                        className="p-4 rounded-2xl shadow-sm"
                        style={{ background: "white", borderLeft: `6px solid var(--primary)` }}
                    >
                        <div className="text-sm text-gray-600">{s.label}</div>
                        <div className="text-2xl font-bold" style={{ color: "var(--dark)" }}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--dark)" }}>
                        Recent Bookings
                    </h2>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm text-gray-500">
                                <th className="pb-2">Booking ID</th>
                                <th className="pb-2">User</th>
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="py-3">{b.id}</td>
                                    <td>{b.user}</td>
                                    <td>{b.date}</td>
                                    <td className={`font-medium ${statusColor(b.status)}`}>{b.status}</td>
                                    <td>
                                        <button
                                            onClick={() => alert(`Open booking ${b.id} - mock action`)}
                                            className="px-3 py-1 rounded-full text-sm"
                                            style={{ border: `1px solid var(--accent)`, color: "var(--accent)" }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sidebar: Employees & Feedbacks */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--dark)" }}>
                            Employees
                        </h3>
                        <ul className="space-y-3">
                            {employees.map((e) => (
                                <li key={e.id} className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{e.name}</div>
                                        <div className="text-sm text-gray-500">{e.tasks} tasks</div>
                                    </div>
                                    <div className="text-sm" style={{ color: e.status === "Idle" ? "#f59e0b" : "var(--primary)" }}>
                                        {e.status}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--dark)" }}>
                            Latest Feedbacks
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {feedbacks.map((f) => (
                                <div key={f.id} className="p-3 rounded-md" style={{ background: "var(--tertiary)" }}>
                                    <div className="font-medium">{f.user}</div>
                                    <div className="mt-1">{f.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer quick actions */}
            <footer className="mt-6 flex gap-3">
                <button
                    onClick={() => alert("View all organizations - mock action")}
                    className="px-4 py-2 rounded-lg"
                    style={{ background: "var(--secondary)", color: "var(--dark)", border: `1px solid var(--dark)` }}
                >
                    View All Organizations
                </button>

                <button
                    onClick={() => alert("Open reports - mock action")}
                    className="px-4 py-2 rounded-lg"
                    style={{ background: "var(--dark)", color: "white" }}
                >
                    Reports
                </button>
            </footer>
        </div>
    );
}
