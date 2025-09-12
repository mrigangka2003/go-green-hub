import React, { useMemo, useState } from "react";

// Define prop types
type MyReviewsProps = {
    userId: string;
    reviews?: Review[]; // Optional override for API data
};

type Review = {
    id: string;
    userId: string;
    bookingId: string;
    date: string; // yyyy-mm-dd
    serviceSummary: string;
    assignedTo?: string;
    rating: number; // 1-5
    feedback: string;
};

// Sort options
type SortOption = "newest" | "oldest" | "highest_rated" | "lowest_rated";

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

// Mock data for demonstration
const DEFAULT_MOCK_REVIEWS: Review[] = [
    { id: "R001", userId: "U101", bookingId: "PB1001", date: "2025-08-26", serviceSummary: "Office area cleaning - 3 rooms", assignedTo: "Ravi Kumar", rating: 5, feedback: "Great service — very professional and quick. Ravi was fantastic and left the place spotless.", },
    { id: "R002", userId: "U102", bookingId: "PB1003", date: "2025-07-31", serviceSummary: "Sofa shampoo + carpet", assignedTo: "Gopal Rao", rating: 3, feedback: "Sofa looks better but the carpet was still damp after 24 hours which was inconvenient.", },
    { id: "R003", userId: "U101", bookingId: "PB1004", date: "2025-06-16", serviceSummary: "Full apartment deep clean", assignedTo: "Ravi Kumar", rating: 5, feedback: "Absolutely spotless, will book again!", },
    { id: "R004", userId: "U101", bookingId: "PB1003", date: "2025-07-30", serviceSummary: "Sofa shampoo + carpet", assignedTo: "Gopal Rao", rating: 3, feedback: "It was an okay job. Not bad, but not amazing either. The results could have been better.", },
];

export default function MyReviews({ userId, reviews }: MyReviewsProps) {
    const palette = `:root{--primary:#38B000;--secondary:#F0EAD2;--tertiary:#EBF2FA;--dark:#141414;--accent:#6C584C}`;

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const dataSource = reviews ?? DEFAULT_MOCK_REVIEWS;

    const filteredReviews = useMemo(() => {
        const q = query.trim().toLowerCase();

        // 1. Filter by user and search query
        const filtered = dataSource.filter((r) => {
            if (r.userId !== userId) return false;
            if (!q) return true;
            return r.serviceSummary.toLowerCase().includes(q) || r.feedback.toLowerCase().includes(q);
        });

        // 2. Sort the results
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "oldest": return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "highest_rated": return b.rating - a.rating;
                case "lowest_rated": return a.rating - b.rating;
                case "newest":
                default:
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });
    }, [dataSource, userId, query, sortBy]);

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
            <style>{palette}</style>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[--dark]">My Reviews</h1>
                    <p className="text-md text-[--accent] mt-1">Manage and view the feedback you've shared.</p>
                </header>

                {/* --- Control Panel --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:flex-1">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in your reviews..." className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[--primary] outline-none" />
                        <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label htmlFor="sort-reviews" className="text-sm text-gray-500">Sort by:</label>
                        <select id="sort-reviews" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="text-sm border rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-[--primary] outline-none w-full">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest_rated">Highest Rated</option>
                            <option value="lowest_rated">Lowest Rated</option>
                        </select>
                    </div>
                </div>

                {/* --- Reviews List --- */}
                <section className="space-y-4">
                    {filteredReviews.map((r) => (
                        <article key={r.id} className="bg-white rounded-xl shadow-sm p-5 transition-shadow duration-300">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-[--dark]">{r.serviceSummary}</h3>
                                    <p className="text-sm text-gray-500">
                                        Reviewed on {new Date(r.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < r.rating} />)}
                                </div>
                            </div>

                            <blockquote className="text-gray-700 leading-relaxed">"{r.feedback}"</blockquote>

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => alert(`Editing review for booking: ${r.bookingId}`)}
                                    className="px-4 py-2 text-sm font-semibold text-[--accent] bg-[--secondary] rounded-lg hover:opacity-90 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => alert(`Deleting review for booking: ${r.bookingId}`)}
                                    className="px-4 py-2 text-sm font-semibold text-red-800 bg-red-100 rounded-lg hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}

                    {filteredReviews.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">You haven't left any reviews yet.</h3>
                            <p className="text-gray-500 mt-1">After a service is completed, you'll be able to share your feedback here.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}