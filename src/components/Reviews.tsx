import React from "react";

// ReviewsComponent.tsx
// React + TypeScript single-file component (Tailwind-ready)
// - Mobile-first responsive review cards (horizontal scroll on small screens, grid on md+)
// - Supports viewMode: 'user' | 'org' (filters reviews by who should see them)
// - Uses your color palette (CSS variables are normalized at runtime if possible)

/*
Color palette provided by user:
primary color - #38B00   (note: 5-digit hex in input; component attempts to normalize)
secondary color - #F0EAD2
3rd color - #EBF2FA
4th color - #141414
5th color - #6C584C
*/

type Visibility = "user" | "org" | "both";

export interface Review {
    id: string;
    authorName: string;
    authorType: "user" | "org";
    avatarUrl?: string;
    rating: number; // 1-5
    title?: string;
    message: string;
    date: string; // ISO date
    visibleTo?: Visibility; // who can see this review
}

export interface ReviewsComponentProps {
    reviews?: Review[];
    viewMode?: "user" | "org"; // which audience is currently viewing
    showAvatars?: boolean;
    className?: string;
    maxVisible?: number; // how many to show before "Show more"
}

// small helper: normalize short/invalid hex inputs gracefully
function normalizeHex(input?: string, fallback = "#38B000") {
    if (!input) return fallback;
    let hex = input.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    // remove non-hex chars
    hex = hex.replace(/[^#a-fA-F0-9]/g, "");
    // if 4-digit (#rgb) expand -> #rrggbb
    if (/^#[a-fA-F0-9]{3}$/.test(hex)) {
        return (
            "#" +
            hex[1] + hex[1] +
            hex[2] + hex[2] +
            hex[3] + hex[3]
        );
    }
    // if 5-digit like #38B00 (user input), try to pad or repeat last char
    if (/^#[a-fA-F0-9]{5}$/.test(hex)) {
        const body = hex.slice(1);
        // pad to 6 by repeating last char
        return "#" + body + body.slice(-1);
    }
    // if 6-digit ok
    if (/^#[a-fA-F0-9]{6}$/.test(hex)) return hex;
    // fallback
    return fallback;
}

// star renderer
function Stars({ value }: { value: number }) {
    const clamped = Math.max(0, Math.min(5, Math.round(value)));
    const stars = Array.from({ length: 5 }).map((_, i) => (
        <svg
            key={i}
            className={`w-4 h-4 inline-block ${i < clamped ? "fill-current" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M10 15l-5.878 3.09L5.4 11.18 0.8 7.09l6.06-.88L10 1.5l3.14 4.72 6.06.88-4.6 4.09 1.278 6.91z" />
        </svg>
    ));
    return <span aria-label={`${clamped} out of 5 stars`}>{stars}</span>;
}

function formatDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return iso;
    }
}

export default function Reviews({
    reviews = [],
    viewMode = "user",
    showAvatars = true,
    className = "",
    maxVisible = 6,
}: ReviewsComponentProps) {
    // normalize palette
    const palette = {
        primary: normalizeHex("#38B00", "#38B000"), // attempt to fix user input
        secondary: normalizeHex("#F0EAD2", "#F0EAD2"),
        third: normalizeHex("#EBF2FA", "#EBF2FA"),
        dark: normalizeHex("#141414", "#141414"),
        accent: normalizeHex("#6C584C", "#6C584C"),
    };

    // filter reviews by visibility
    const visibleReviews = reviews.filter((r) => {
        const visible = r.visibleTo ?? "both";
        if (visible === "both") return true;
        if (visible === "user" && viewMode === "user") return true;
        if (visible === "org" && viewMode === "org") return true;
        return false;
    });

    const [showAll, setShowAll] = React.useState(false);

    const toShow = showAll ? visibleReviews : visibleReviews.slice(0, maxVisible);

    return (
        <section
            className={`reviews-component ${className} py-4`
            }
            style={{
                // CSS variables for easy overriding
                // These inline styles are used along with Tailwind utility classes
                // so you can keep Tailwind while still following user's brand palette.
                // Use --rgp-* variables in custom styles if you extend.
                // NOTE: normalization attempted above before applying.
                ["--rgp-primary" as any]: palette.primary,
                ["--rgp-secondary" as any]: palette.secondary,
                ["--rgp-third" as any]: palette.third,
                ["--rgp-dark" as any]: palette.dark,
                ["--rgp-accent" as any]: palette.accent,
            }}
        >
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: "var(--rgp-dark)" }}>
                        Reviews
                    </h3>
                    <div className="text-sm text-gray-500">
                        Showing <strong className="text-sm" style={{ color: "var(--rgp-accent)" }}>{visibleReviews.length}</strong> review(s)
                    </div>
                </div>

                {/* Mobile: horizontal scrollable cards. Desktop: grid */}
                <div className="-mx-2 sm:mx-0">
                    <div
                        className="flex space-x-3 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 py-2 px-2"
                        role="list"
                    >
                        {toShow.map((r) => (
                            <article
                                key={r.id}
                                role="listitem"
                                className="min-w-[82%] sm:min-w-[60%] md:min-w-0 flex-shrink-0 md:flex-shrink md:block bg-white shadow-sm rounded-2xl p-4"
                                style={{
                                    border: `1px solid ${palette.third}`,
                                    background: "linear-gradient(180deg, var(--rgp-third) 0%, #ffffff 100%)",
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    {showAvatars ? (
                                        <img
                                            src={r.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(r.authorName)}&background=6C584C&color=fff`}
                                            alt={`${r.authorName} avatar`}
                                            className="w-12 h-12 rounded-full object-cover border"
                                            style={{ borderColor: "rgba(0,0,0,0.06)" }}
                                        />
                                    ) : null}

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium" style={{ color: "var(--rgp-dark)" }}>{r.authorName}</div>
                                            <div className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.04)", color: "var(--rgp-accent)" }}>
                                                {r.authorType === "user" ? "User" : "Organization"}
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-700">
                                            {r.title ? <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--rgp-dark)" }}>{r.title}</h4> : null}
                                            <p className="text-sm leading-relaxed">{r.message}</p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Stars value={r.rating} />
                                                <span className="text-xs text-gray-500">{r.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="text-xs text-gray-400">{formatDate(r.date)}</div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {toShow.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No reviews to show.</div>
                        ) : null}
                    </div>
                </div>

                {/* actions */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Filter: <strong style={{ color: "var(--rgp-accent)" }}>{viewMode}</strong></div>

                    <div className="flex items-center gap-3">
                        {visibleReviews.length > maxVisible ? (
                            <button
                                onClick={() => setShowAll((s) => !s)}
                                className="px-3 py-1 text-sm rounded-lg shadow-sm"
                                style={{ background: "var(--rgp-primary)", color: "white" }}
                            >
                                {showAll ? "Show less" : `Show all (${visibleReviews.length})`}
                            </button>
                        ) : null}

                        <button
                            className="px-3 py-1 text-sm rounded-lg border"
                            style={{ borderColor: "var(--rgp-accent)", color: "var(--rgp-dark)", background: "transparent" }}
                            onClick={() => {
                                // accessibility-friendly anchor for adding new review - consumers can replace this with a modal open
                                const ev = new CustomEvent("rgp:addReviewRequest", { detail: {} });
                                window.dispatchEvent(ev);
                            }}
                        >
                            Add review
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ----------------------------
// USAGE NOTES (in-code, not repeated elsewhere)
// - Import and use: `import ReviewsComponent, { Review } from './ReviewsComponent';`
// - Pass `viewMode` prop to indicate who is viewing ("user" | "org"). Reviews with `visibleTo` set to "both" are shown to both.
// - The component dispatches a `rgp:addReviewRequest` window event when "Add review" is clicked. Replace with your modal/route.
// - It uses Tailwind utility classes — ensure Tailwind is configured. Colors are applied via inline CSS variables so you can override them.
// - The primary color input from user (#38B00) was normalized conservatively; you can override with CSS or pass corrected values.
// ----------------------------
