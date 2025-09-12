import React, { useMemo, useState } from "react";

// PastBookings.react.tsx
// Admin view for past bookings (user & org) with feedback, filters, search and details modal.
// ENHANCED for mobile responsiveness and modern UI.

type OwnerType = "user" | "org";

type PastBooking = {
    id: string;
    ownerType: OwnerType;
    ownerName: string;
    phone?: string;
    address: string;
    date: string; // ISO or human-friendly
    time: string;
    serviceSummary: string;
    assignedTo?: string;
    rating?: number; // 1-5
    feedback?: string;
};

// SVG icon component for reusability
const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);


export default function PastBookings(): JSX.Element {
    // color palette via CSS variables (tailwind-friendly inline style kept minimal)
    const palette = `:root{--primary:#38B000;--secondary:#F0EAD2;--tertiary:#EBF2FA;--dark:#141414;--accent:#6C584C}`;

    // --- Mock data ---
    const mockPastBookings: PastBooking[] = [
        { id: "PB1001", ownerType: "user", ownerName: "Rahul Singh", phone: "+91 98765 43210", address: "12, MG Road, Sector 5, Navi Mumbai", date: "2025-08-25", time: "10:30 AM", serviceSummary: "Office area cleaning - 3 rooms", assignedTo: "Ravi Kumar", rating: 5, feedback: "Great service — very professional and quick." },
        { id: "PB1002", ownerType: "org", ownerName: "Green School", phone: "+91 91234 56789", address: "Plot 45, Industrial Area, Thane", date: "2025-08-20", time: "02:00 PM", serviceSummary: "Monthly deep cleaning", assignedTo: "Sana Verma", rating: 4, feedback: "Good job, but missed one classroom corner." },
        { id: "PB1003", ownerType: "user", ownerName: "Ankita Sharma", phone: "+91 90123 45678", address: "House 7, Palm Residency, Pune", date: "2025-07-30", time: "09:00 AM", serviceSummary: "Sofa shampoo + carpet", assignedTo: "Gopal Rao", rating: 3, feedback: "Sofa looks better but carpet still damp after 24 hrs." },
    ];

    // --- State ---
    const [filter, setFilter] = useState<"all" | OwnerType>("all");
    const [query, setQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<PastBooking | null>(null);

    // derived list
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return mockPastBookings.filter((b) => {
            if (filter !== "all" && b.ownerType !== filter) return false;
            if (!q) return true;
            return (
                b.ownerName.toLowerCase().includes(q) ||
                (b.phone && b.phone.toLowerCase().includes(q)) ||
                b.address.toLowerCase().includes(q) ||
                b.serviceSummary.toLowerCase().includes(q) ||
                (b.feedback && b.feedback.toLowerCase().includes(q))
            );
        });
    }, [filter, query, mockPastBookings]);

    function openDetails(b: PastBooking) {
        setSelectedBooking(b);
        document.body.style.overflow = "hidden";
    }
    function closeDetails() {
        setSelectedBooking(null);
        document.body.style.overflow = "auto";
    }

    // export small CSV helper
    function exportCSV() {
        const rows = [
            ["Booking ID", "Owner Type", "Owner Name", "Phone", "Address", "Date", "Time", "Assigned To", "Rating", "Feedback"],
            ...mockPastBookings.map((b) => [b.id, b.ownerType, b.ownerName, b.phone || "", b.address, b.date, b.time, b.assignedTo || "", b.rating || "", b.feedback || ""]),
        ];

        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "past_bookings.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-[--tertiary] to-[--secondary]">
            <style>{palette}</style>

            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-[--dark]">Past Bookings</h1>
                        <p className="text-sm text-[--accent] mt-1">View and manage completed customer bookings.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                        <div className="flex w-full sm:w-auto gap-1 bg-white rounded-full p-1 shadow-sm">
                            <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-[--primary] text-white" : "text-[--dark] hover:bg-gray-100"}`} onClick={() => setFilter("all")}>All</button>
                            <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "user" ? "bg-[--primary] text-white" : "text-[--dark] hover:bg-gray-100"}`} onClick={() => setFilter("user")}>Users</button>
                            <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "org" ? "bg-[--primary] text-white" : "text-[--dark] hover:bg-gray-100"}`} onClick={() => setFilter("org")}>Orgs</button>
                        </div>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full sm:w-48 text-sm outline-none bg-white rounded-lg shadow-sm px-4 py-2.5 focus:ring-2 focus:ring-[--primary]" />
                        <button onClick={exportCSV} className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[--primary] text-white text-sm font-semibold shadow hover:bg-opacity-90 transition">Export CSV</button>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((b) => (
                        <article key={b.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{b.ownerType === "org" ? "Organization" : "User"}</div>
                                    <h3 className="text-lg font-bold text-[--dark] mt-1">{b.ownerName}</h3>
                                    <div className="text-sm text-gray-600">{b.serviceSummary}</div>
                                </div>
                                <div className="text-left sm:text-right text-sm flex-shrink-0 mt-2 sm:mt-0">
                                    <div className="font-semibold text-gray-800">{new Date(b.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    <div className="text-gray-500">{b.time}</div>
                                </div>
                            </div>

                            {b.feedback && (
                                <blockquote className="mt-4 bg-[--tertiary] p-3 rounded-lg text-sm text-[--accent] border-l-4 border-[--primary] italic leading-relaxed">
                                    "{b.feedback}"
                                </blockquote>
                            )}

                            <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-1">
                                    {b.rating ? Array.from({ length: b.rating }).map((_, i) => <StarIcon key={i} />) : <span className="text-sm text-gray-500">No rating</span>}
                                </div>
                                <button onClick={() => openDetails(b)} className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[--primary] text-white text-sm font-semibold shadow hover:bg-opacity-90 transition">View Details</button>
                            </div>
                        </article>
                    ))}
                    {filtered.length === 0 && <div className="col-span-full text-center py-10 text-gray-600 bg-white rounded-2xl shadow-md">No past bookings found for your query.</div>}
                </section>

                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeDetails}>
                        <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg z-10" onClick={(e) => e.stopPropagation()}>
                            <button onClick={closeDetails} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div>
                                <h2 className="text-xl font-bold text-[--dark]">{selectedBooking.ownerName}</h2>
                                <p className="text-sm text-[--accent]">Booking ID: {selectedBooking.id}</p>
                            </div>

                            <div className="mt-4 border-t pt-4 space-y-3 text-sm">
                                <p><strong>Service:</strong> {selectedBooking.serviceSummary}</p>
                                <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedBooking.time}</p>
                                <p><strong>Address:</strong> {selectedBooking.address}</p>
                                <p><strong>Phone:</strong> {selectedBooking.phone || "N/A"}</p>
                                <p><strong>Assigned To:</strong> {selectedBooking.assignedTo || "N/A"}</p>
                                <div className="flex items-center gap-2">
                                    <strong>Rating:</strong>
                                    <div className="flex">{selectedBooking.rating ? Array.from({ length: selectedBooking.rating }).map((_, i) => <StarIcon key={i} />) : <span className="text-gray-500">No rating</span>}</div>
                                </div>
                            </div>

                            {selectedBooking.feedback && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="font-semibold text-[--dark]">Customer Feedback</h3>
                                    <blockquote className="mt-2 p-3 bg-[--tertiary] rounded-lg text-sm text-[--accent] italic">
                                        "{selectedBooking.feedback}"
                                    </blockquote>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}