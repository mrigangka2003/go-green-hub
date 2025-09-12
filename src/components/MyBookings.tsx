import React, { useMemo, useState } from "react";

// Define prop types for clarity and reusability
type OwnerType = "user" | "org";
type MyBookingsProps = {
    ownerType: OwnerType;
    ownerId: string;
    bookings?: PastBooking[]; // Optional override for API data
};

type PastBooking = {
    id: string;
    ownerType: OwnerType;
    ownerId: string;
    ownerName: string;
    phone?: string;
    address?: string;
    date: string; // yyyy-mm-dd
    time?: string;
    serviceSummary?: string;
    assignedTo?: string;
    rating?: number;
    feedback?: string;
};

// SVG icon component for crisp, scalable stars
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg
        className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);

// Mock data remains for standalone demonstration
const DEFAULT_MOCK: PastBooking[] = [
    { id: "PB1001", ownerType: "user", ownerId: "U101", ownerName: "Rahul Singh", phone: "+91 98765 43210", address: "12, MG Road, Sector 5, Navi Mumbai", date: "2025-08-25", time: "10:30 AM", serviceSummary: "Office area cleaning - 3 rooms", assignedTo: "Ravi Kumar", rating: 5, feedback: "Great service — very professional and quick." },
    { id: "PB1002", ownerType: "org", ownerId: "O201", ownerName: "Green School", phone: "+91 91234 56789", address: "Plot 45, Industrial Area, Thane", date: "2025-08-20", time: "02:00 PM", serviceSummary: "Monthly deep cleaning", assignedTo: "Sana Verma", rating: 4, feedback: "Good job, but missed one classroom corner." },
    { id: "PB1003", ownerType: "user", ownerId: "U101", ownerName: "Rahul Singh", date: "2025-07-30", time: "09:00 AM", serviceSummary: "Sofa shampoo + carpet", assignedTo: "Gopal Rao", rating: 3, feedback: "Sofa looks better but carpet still damp after 24 hrs.", },
    { id: "PB1004", ownerType: "user", ownerId: "U101", ownerName: "Rahul Singh", address: "12, MG Road, Sector 5, Navi Mumbai", date: "2025-06-15", time: "03:00 PM", serviceSummary: "Full apartment deep clean", assignedTo: "Ravi Kumar", rating: 5, feedback: "Absolutely spotless, will book again!", },
];

export default function MyBookings({ ownerType, ownerId, bookings }: MyBookingsProps) {
    const palette = `:root{--primary:#38B000;--secondary:#F0EAD2;--tertiary:#EBF2FA;--dark:#141414;--accent:#6C584C}`;
    const animation = `@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fadeIn { animation: fadeIn 0.2s ease-out; }`;

    const [query, setQuery] = useState("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [selected, setSelected] = useState<PastBooking | null>(null);

    const dataSource = bookings ?? DEFAULT_MOCK;

    const ownerBookings = useMemo(() => {
        const q = query.trim().toLowerCase();
        return dataSource.filter((b) => {
            if (b.ownerType !== ownerType || b.ownerId !== ownerId) return false;
            if (fromDate && b.date < fromDate) return false;
            if (toDate && b.date > toDate) return false;
            if (!q) return true;
            return (
                b.id.toLowerCase().includes(q) ||
                (b.serviceSummary && b.serviceSummary.toLowerCase().includes(q)) ||
                (b.feedback && b.feedback.toLowerCase().includes(q)) ||
                (b.address && b.address.toLowerCase().includes(q)) ||
                (b.assignedTo && b.assignedTo.toLowerCase().includes(q))
            );
        }).sort((a, z) => (a.date < z.date ? 1 : -1));
    }, [dataSource, ownerType, ownerId, query, fromDate, toDate]);

    function openDetails(b: PastBooking) {
        setSelected(b);
        document.body.style.overflow = "hidden";
    }
    function closeDetails() {
        setSelected(null);
        document.body.style.overflow = "auto";
    }

    function exportCSV() { /* ... export logic remains the same ... */ }

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
            <style>{palette}{animation}</style>
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[--dark]">My Bookings</h1>
                    <p className="text-md text-[--accent] mt-1">
                        Review your complete service history with us.
                    </p>
                </header>

                {/* --- Control Panel --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-1/3">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search service, feedback..." className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[--primary] outline-none" />
                        <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label className="text-sm text-gray-500">From:</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="text-sm border rounded-lg px-2 py-1.5 w-full" />
                        <label className="text-sm text-gray-500">To:</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="text-sm border rounded-lg px-2 py-1.5 w-full" />
                    </div>
                    <button onClick={() => { setFromDate(""); setToDate(""); setQuery(""); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg w-full md:w-auto">Clear Filters</button>
                    <button onClick={exportCSV} className="px-4 py-2 text-sm bg-[--primary] text-white rounded-lg font-semibold w-full md:w-auto ml-0 md:ml-auto">Export</button>
                </div>

                {/* --- Bookings List --- */}
                <section className="space-y-4">
                    {ownerBookings.map((b) => (
                        <article key={b.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 border-transparent hover:border-[--primary] p-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">{new Date(b.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <h3 className="text-xl font-bold text-[--dark] mt-1">{b.serviceSummary}</h3>
                                    <p className="text-sm text-gray-600 mt-1">Assigned to: <span className="font-semibold">{b.assignedTo ?? "N/A"}</span></p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={b.rating ? i < b.rating : false} />)}
                                </div>
                                <div className="flex justify-start md:justify-end">
                                    <button onClick={() => openDetails(b)} className="px-5 py-2 text-sm bg-[--primary] text-white rounded-lg font-semibold">View Details</button>
                                </div>
                            </div>
                            {b.feedback && <blockquote className="mt-4 p-3 bg-[--tertiary] rounded-lg text-sm text-[--accent] italic">"{b.feedback}"</blockquote>}
                        </article>
                    ))}

                    {ownerBookings.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">No Bookings Found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search or date filters.</p>
                        </div>
                    )}
                </section>

                {/* --- Details Modal --- */}
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeDetails}>
                        <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg z-10 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                            <button onClick={closeDetails} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-[--dark]">{selected.serviceSummary}</h2>
                                <p className="text-sm text-[--accent]">Booking ID: {selected.id}</p>
                            </div>
                            <div className="mt-4 border-t pt-4 space-y-3 text-sm">
                                <p><strong>Date:</strong> {new Date(selected.date).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selected.time}</p>
                                {selected.address && <p><strong>Address:</strong> {selected.address}</p>}
                                <p><strong>Assigned To:</strong> {selected.assignedTo ?? "N/A"}</p>
                                <div className="flex items-center gap-2"><strong>Rating:</strong><div className="flex">{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={selected.rating ? i < selected.rating : false} />)}</div></div>
                            </div>
                            {selected.feedback && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="font-semibold text-[--dark]">Your Feedback</h3>
                                    <blockquote className="mt-2 p-3 bg-[--tertiary] rounded-lg text-sm text-[--accent] italic">"{selected.feedback}"</blockquote>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}