import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CurrentBookingsPage() {
    const navigate = useNavigate();

    // CSS palette
    const paletteStyles = `:root{--primary:#38B000;--secondary:#F0EAD2;--tertiary:#EBF2FA;--dark:#141414;--accent:#6C584C}`;

    // --- Mock data ---
    const initialBookings = [
        { id: "B201", ownerType: "user", ownerName: "Rahul Singh", phone: "+91 98765 43210", address: "12, MG Road, Sector 5, Navi Mumbai", date: "2025-09-12", time: "10:30 AM", details: "Office area cleaning - 3 rooms", assignedTo: null, status: "Pending", verified: false },
        { id: "B202", ownerType: "org", ownerName: "Green School", phone: "+91 91234 56789", address: "Plot 45, Industrial Area, Thane", date: "2025-09-13", time: "02:00 PM", details: "Monthly deep cleaning", assignedTo: null, status: "Pending", verified: false },
        { id: "B203", ownerType: "user", ownerName: "Ankita Sharma", phone: "+91 90123 45678", address: "House 7, Palm Residency, Pune", date: "2025-09-11", time: "09:00 AM", details: "Sofa shampoo + carpet", assignedTo: "Ravi Kumar", status: "Completed", verified: false },
    ];

    const initialEmployees = [
        { id: 1, name: "Ravi Kumar", status: "busy" },
        { id: 2, name: "Sana Verma", status: "free" },
        { id: 3, name: "Gopal Rao", status: "free" },
    ];

    // --- State ---
    const [bookings, setBookings] = useState(initialBookings);
    const [employees, setEmployees] = useState(initialEmployees);
    const [filter, setFilter] = useState("all");

    // Modal state holds booking id (safer than whole object)
    const [assigningBookingId, setAssigningBookingId] = useState(null);
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const [verifyBookingId, setVerifyBookingId] = useState(null);

    // disable background scrolling when modal open\
    {/*@ts-ignore*/}
    useEffect(() => {
        const open = assigningBookingId !== null || verifyBookingId !== null;
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [assigningBookingId, verifyBookingId]);

    // derived lists
    const freeEmployees = useMemo(() => employees.filter((e) => e.status === "free"), [employees]);
    const bookingMap = useMemo(() => bookings.reduce((m, b) => ((m[b.id] = b), m), {}), [bookings]);

    const visibleBookings = bookings.filter((b) => (filter === "all" ? b.status !== "Verified" : b.ownerType === filter && b.status !== "Verified"));

    // --- Actions ---
    function openAssignModal(bookingId) {
        setAssigningBookingId(bookingId);
        setSelectedEmpId(freeEmployees[0]?.id ?? null);
    }

    function closeAssignModal() {
        setAssigningBookingId(null);
        setSelectedEmpId(null);
    }

    function assignTask() {
        if (!assigningBookingId || selectedEmpId == null) return;
        const emp = employees.find((e) => e.id === selectedEmpId);
        if (!emp) return;

        // assign booking
        setBookings((prev) => prev.map((b) => (b.id === assigningBookingId ? { ...b, assignedTo: emp.name, status: "Assigned" } : b)));
        // mark employee busy
        setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: "busy" } : e)));
        closeAssignModal();
    }

    function simulateMarkCompleted(bookingId) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Completed" } : b)));
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
            prev.map((b) => {
                if (b.id !== verifyBookingId) return b;
                return { ...b, verified: isVerified, status: isVerified ? "Verified" : "Needs Action" };
            })
        );

        if (isVerified) {
            // free the assigned employee
            const assignedTo = bookingMap[verifyBookingId]?.assignedTo;
            if (assignedTo) setEmployees((prev) => prev.map((e) => (e.name === assignedTo ? { ...e, status: "free" } : e)));
        }

        closeVerifyModal();
    }

    // small helpers for UI
    const statusClasses = (s) => {
        switch (s) {
            case "Pending":
                return "text-[#141414] bg-[#F0EAD2]";
            case "Assigned":
                return "text-white bg-[--primary]";
            case "Completed":
                return "text-white bg-green-600";
            case "Verified":
                return "text-white bg-teal-500";
            case "Needs Action":
                return "text-white bg-red-600";
            default:
                return "text-[#141414] bg-[#EBF2FA]";
        }
    };

    return (
        <div className="min-h-screen p-8" style={{ background: "var(--tertiary)" }}>
            <style>{paletteStyles}</style>

            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ color: "var(--dark)" }}>Current / Pending Bookings</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>Manage assignments and verify completed work. UI improved for clarity & accessibility.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--secondary)", color: "var(--dark)" }}>
                        Free employees: <strong>{freeEmployees.length}</strong>
                    </div>

                    <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg shadow" style={{ background: "var(--secondary)", color: "var(--dark)", border: "1px solid var(--dark)" }}>Back</button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium" style={{ color: "var(--dark)" }}>Show</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-md shadow-sm" style={{ border: "1px solid var(--accent)" }}>
                        <option value="all">All</option>
                        <option value="user">User</option>
                        <option value="org">Organization</option>
                    </select>
                </div>

                <div className="ml-auto text-sm text-gray-600">Total open: <strong>{bookings.filter((b) => b.status !== "Verified").length}</strong></div>
            </div>

            {/* Cards grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleBookings.map((b) => (
                    <article key={b.id} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--secondary)", color: "var(--dark)" }}>{b.ownerType === "org" ? "Organization" : "User"}</div>
                                <h3 className="text-xl font-semibold mt-3" style={{ color: "var(--dark)" }}>{b.ownerName}</h3>
                                <div className="text-sm text-gray-600 mt-1">{b.phone}</div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-gray-500">{b.date}</div>
                                <div className="text-sm font-medium">{b.time}</div>
                                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClasses(b.status)}`}>{b.status}</div>
                                {b.assignedTo && <div className="text-sm mt-2 text-gray-700">Assigned to <strong>{b.assignedTo}</strong></div>}
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-700">{b.details}</p>
                        <p className="mt-2 text-sm text-gray-500">{b.address}</p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            {!b.assignedTo && b.status === "Pending" && (
                                <button onClick={() => openAssignModal(b.id)} className="px-4 py-2 rounded-lg font-medium shadow" style={{ background: "var(--primary)", color: "white" }}>Assign Task</button>
                            )}

                            {b.assignedTo && b.status === "Assigned" && (
                                <button onClick={() => simulateMarkCompleted(b.id)} className="px-4 py-2 rounded-lg font-medium" style={{ background: "#0ea5a4", color: "white" }}>Mark Completed</button>
                            )}

                            {b.status === "Completed" && (
                                <button onClick={() => openVerifyModal(b.id)} className="px-4 py-2 rounded-lg border font-medium" style={{ borderColor: "var(--dark)", background: "var(--secondary)", color: "var(--dark)" }}>Verify</button>
                            )}

                            {b.status === "Needs Action" && <div className="text-sm text-red-600">Needs admin action</div>}

                            <button onClick={() => alert(`Open booking ${b.id} - mock`)} className="px-3 py-2 rounded-lg border" style={{ borderColor: "var(--accent)", background: "var(--secondary)", color: "var(--dark)" }}>Details</button>
                        </div>
                    </article>
                ))}

                {visibleBookings.length === 0 && <div className="col-span-full text-center text-gray-600">No bookings available.</div>}
            </section>

            {/* Assign Modal */}
            {assigningBookingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeAssignModal}></div>

                    <div role="dialog" aria-modal="true" className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-10" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--dark)" }}>Assign booking {assigningBookingId}</h3>
                        <p className="text-sm text-gray-600 mb-4">Choose an available employee to assign this job.</p>

                        <div className="space-y-3 mb-4">
                            {freeEmployees.length === 0 && <div className="text-sm text-gray-600">No free employees available right now.</div>}

                            {freeEmployees.map((fe) => (
                                <label key={fe.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "#eee" }}>
                                    <input type="radio" name="emp" checked={selectedEmpId === fe.id} onChange={() => setSelectedEmpId(fe.id)} />
                                    <div>
                                        <div className="font-medium" style={{ color: "var(--dark)" }}>{fe.name}</div>
                                        <div className="text-xs text-gray-500">{fe.status}</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={closeAssignModal} className="px-4 py-2 rounded-lg" style={{ background: "var(--secondary)", color: "var(--dark)" }}>Cancel</button>
                            <button onClick={assignTask} className="px-4 py-2 rounded-lg font-medium" style={{ background: "var(--primary)", color: "white" }} disabled={selectedEmpId == null}>Assign</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Modal */}
            {verifyBookingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeVerifyModal}></div>

                    <div role="dialog" aria-modal="true" className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--dark)" }}>Verify booking {verifyBookingId}</h3>
                        <p className="text-sm text-gray-600 mb-4">Was the work completed satisfactorily?</p>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => confirmVerify(false)} className="px-4 py-2 rounded-lg" style={{ background: "#fde68a", color: "var(--dark)" }}>Needs Action</button>
                            <button onClick={() => confirmVerify(true)} className="px-4 py-2 rounded-lg font-medium" style={{ background: "var(--primary)", color: "white" }}>Verified</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
