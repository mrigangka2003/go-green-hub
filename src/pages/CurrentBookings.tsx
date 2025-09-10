import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CurrentBookingsPage() {
    const navigate = useNavigate();

    // CSS variables for palette
    const paletteStyles = `
    :root { --primary: #38B000; --secondary: #F0EAD2; --tertiary: #EBF2FA; --dark: #141414; --accent: #6C584C; }
  `;

    // Mock data
    const initialBookings = [
        {
            id: "B201",
            ownerType: "user",
            ownerName: "Rahul Singh",
            phone: "+91 98765 43210",
            address: "12, MG Road, Sector 5, Navi Mumbai",
            date: "2025-09-12",
            time: "10:30 AM",
            details: "Office area cleaning - 3 rooms",
            assignedTo: null,
            status: "Pending",
            verified: false,
        },
        {
            id: "B202",
            ownerType: "org",
            ownerName: "Green School",
            phone: "+91 91234 56789",
            address: "Plot 45, Industrial Area, Thane",
            date: "2025-09-13",
            time: "02:00 PM",
            details: "Monthly deep cleaning",
            assignedTo: null,
            status: "Pending",
            verified: false,
        },
        {
            id: "B203",
            ownerType: "user",
            ownerName: "Ankita Sharma",
            phone: "+91 90123 45678",
            address: "House 7, Palm Residency, Pune",
            date: "2025-09-11",
            time: "09:00 AM",
            details: "Sofa shampoo + carpet",
            assignedTo: "Ravi Kumar",
            status: "Completed",
            verified: false,
        },
    ];

    const initialEmployees = [
        { id: 1, name: "Ravi Kumar", status: "busy" },
        { id: 2, name: "Sana Verma", status: "free" },
        { id: 3, name: "Gopal Rao", status: "free" },
    ];

    const [bookings, setBookings] = useState(initialBookings);
    const [employees, setEmployees] = useState(initialEmployees);
    const [filter, setFilter] = useState("all"); // all | user | org

    // Modal states
    const [assigningBookingId, setAssigningBookingId] = useState(null);
    const [verifyBookingId, setVerifyBookingId] = useState(null);
    const [selectedEmpId, setSelectedEmpId] = useState(null);

    // @ts-ignore
    useEffect(() => {
        // prevent background scroll when any modal open
        const modalOpen = assigningBookingId !== null || verifyBookingId !== null;
        document.body.style.overflow = modalOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [assigningBookingId, verifyBookingId]);

    const freeEmployees = employees.filter((e) => e.status === "free");

    function openAssignModal(bookingId) {
        setAssigningBookingId(bookingId);
        // default select first free emp
        const firstFree = freeEmployees[0]?.id ?? null;
        setSelectedEmpId(firstFree);
    }

    function closeAssignModal() {
        setAssigningBookingId(null);
        setSelectedEmpId(null);
    }

    function assignTask() {
        if (!assigningBookingId || selectedEmpId == null) return;
        const emp = employees.find((e) => e.id === selectedEmpId);
        if (!emp) return;

        setBookings((prev) => prev.map((b) => (b.id === assigningBookingId ? { ...b, assignedTo: emp.name, status: "Assigned" } : b)));
        setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: "busy" } : e)));
        closeAssignModal();
    }

    function openVerifyModal(bookingId) {
        setVerifyBookingId(bookingId);
    }

    function closeVerifyModal() {
        setVerifyBookingId(null);
    }

    function confirmVerify(isVerified) {
        if (!verifyBookingId) return;
        setBookings((prev) =>
            prev.map((b) =>
                b.id === verifyBookingId
                    ? { ...b, verified: isVerified, status: isVerified ? "Verified" : "NeedsAction" }
                    : b
            )
        );

        // if verified -> free employee
        if (isVerified) {
            const assignedTo = bookings.find((b) => b.id === verifyBookingId)?.assignedTo;
            if (assignedTo) {
                setEmployees((prev) => prev.map((e) => (e.name === assignedTo ? { ...e, status: "free" } : e)));
            }
        }

        closeVerifyModal();
    }

    function simulateMarkCompleted(bookingId) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Completed" } : b)));
    }

    const visibleBookings = bookings.filter((b) => {
        if (filter === "all") return b.status !== "Verified";
        return b.ownerType === filter && b.status !== "Verified";
    });

    // Small UI helpers
    const statusBadge = (s) => {
        const base = "inline-block px-2 py-1 text-xs font-semibold rounded-full";
        switch (s) {
            case "Pending":
                return { text: "Pending", className: `${base} text-[#141414] bg-[#F0EAD2]` };
            case "Assigned":
                return { text: "Assigned", className: `${base} text-white bg-[#38B000]` };
            case "Completed":
                return { text: "Completed", className: `${base} text-white bg-[#16a34a]` };
            case "Verified":
                return { text: "Verified", className: `${base} text-white bg-[#0ea5a4]` };
            case "NeedsAction":
                return { text: "Needs action", className: `${base} text-white bg-[#dc2626]` };
            default:
                return { text: s, className: `${base} text-[#141414] bg-[#EBF2FA]` };
        }
    };

    return (
        <div className="min-h-screen p-6" style={{ background: "var(--tertiary)" }}>
            <style>{paletteStyles}</style>

            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: "var(--dark)" }}>
                        Current / Pending Bookings
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>
                        Track bookings until they are verified. Use assign & verify flows.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg shadow"
                        style={{ background: "var(--secondary)", color: "var(--dark)", border: `1px solid var(--dark)` }}
                    >
                        Back
                    </button>
                </div>
            </header>

            {/* Filters / Summary */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                        Filter:
                    </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-md"
                        style={{ border: `1px solid var(--accent)` }}
                    >
                        <option value="all">All (user + org)</option>
                        <option value="user">User Bookings</option>
                        <option value="org">Organization Bookings</option>
                    </select>
                </div>

                <div className="ml-auto flex gap-4">
                    <div className="px-4 py-2 rounded-lg bg-white shadow text-sm" style={{ border: "1px solid var(--accent)" }}>
                        Free employees: <strong>{freeEmployees.length}</strong>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-white shadow text-sm" style={{ border: "1px solid var(--accent)" }}>
                        Pending bookings: <strong>{bookings.filter((b) => b.status === "Pending").length}</strong>
                    </div>
                </div>
            </div>

            {/* Booking cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleBookings.map((b) => (
                    <article key={b.id} className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
                        <div className="flex justify-between">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-gray-500">{b.ownerType === "org" ? "Organization" : "User"}</div>
                                <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--dark)" }}>{b.ownerName}</h3>
                                <div className="text-sm text-gray-600 mt-1">{b.phone}</div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm">{b.date}</div>
                                <div className="text-sm font-medium">{b.time}</div>
                                <div className="mt-2">{(() => {
                                    const s = statusBadge(b.status);
                                    return <span className={s.className}>{s.text}</span>;
                                })()}</div>
                                {b.assignedTo && <div className="text-sm mt-1 text-gray-700">Assigned: <strong>{b.assignedTo}</strong></div>}
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-700">{b.details}</p>
                        <p className="mt-2 text-sm text-gray-600">Address: {b.address}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {/* Assign button */}
                            {!b.assignedTo && b.status === "Pending" && (
                                <button
                                    onClick={() => openAssignModal(b.id)}
                                    className="px-4 py-2 rounded-lg font-medium shadow"
                                    style={{ background: "var(--primary)", color: "white" }}
                                >
                                    Assign Task
                                </button>
                            )}

                            {/* Simulate employee marking job as completed */}
                            {b.assignedTo && b.status === "Assigned" && (
                                <button
                                    onClick={() => simulateMarkCompleted(b.id)}
                                    className="px-4 py-2 rounded-lg font-medium"
                                    style={{ background: "#0ea5a4", color: "white" }}
                                >
                                    Mark Completed
                                </button>
                            )}

                            {/* Verify action appears only when Completed */}
                            {b.status === "Completed" && (
                                <button
                                    onClick={() => openVerifyModal(b.id)}
                                    className="px-4 py-2 rounded-lg font-medium border"
                                    style={{ borderColor: "var(--dark)", color: "var(--dark)", background: "var(--secondary)" }}
                                >
                                    Verify
                                </button>
                            )}

                            {b.status === "NeedsAction" && <div className="text-sm text-red-600">Needs admin action</div>}

                            <button
                                onClick={() => alert(`Open booking ${b.id} - mock action`)}
                                className="px-3 py-2 rounded-lg border text-sm"
                                style={{ borderColor: "var(--accent)", color: "var(--dark)", background: "var(--secondary)" }}
                            >
                                View Details
                            </button>
                        </div>
                    </article>
                ))}

                {visibleBookings.length === 0 && <div className="col-span-full text-center text-gray-600">No bookings match the filter.</div>}
            </div>

            {/* Assign Modal (improved) */}
            {assigningBookingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0"
                        style={{ background: "rgba(20,20,20,0.45)" }}
                        onClick={closeAssignModal}
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6"
                        onClick={(e) => e.stopPropagation()} // prevent overlay click
                    >
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--dark)" }}>
                            Assign Task
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Select an available employee to assign this booking.</p>

                        <div className="space-y-3 mb-4">
                            {freeEmployees.length === 0 && <div className="text-sm text-gray-600">No free employees available.</div>}

                            {freeEmployees.map((fe) => (
                                <label key={fe.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "#eee" }}>
                                    <input
                                        type="radio"
                                        name="employee"
                                        checked={selectedEmpId === fe.id}
                                        onChange={() => setSelectedEmpId(fe.id)}
                                    />
                                    <div className="text-sm">
                                        <div className="font-medium" style={{ color: "var(--dark)" }}>{fe.name}</div>
                                        <div className="text-xs text-gray-500">Status: {fe.status}</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={closeAssignModal} className="px-4 py-2 rounded-lg" style={{ background: "var(--secondary)", color: "var(--dark)" }}>
                                Cancel
                            </button>
                            <button
                                onClick={assignTask}
                                className="px-4 py-2 rounded-lg font-medium"
                                style={{ background: "var(--primary)", color: "white" }}
                                disabled={selectedEmpId == null}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Modal (improved) */}
            {verifyBookingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0"
                        style={{ background: "rgba(20,20,20,0.45)" }}
                        onClick={closeVerifyModal}
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--dark)" }}>
                            Verify Booking
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Mark this booking as Verified if the work was completed satisfactorily, or mark Needs Action to request rework.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => confirmVerify(false)} className="px-4 py-2 rounded-lg" style={{ background: "#fde68a", color: "var(--dark)" }}>
                                Needs Action
                            </button>

                            <button onClick={() => confirmVerify(true)} className="px-4 py-2 rounded-lg font-medium" style={{ background: "var(--primary)", color: "white" }}>
                                Verified
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
