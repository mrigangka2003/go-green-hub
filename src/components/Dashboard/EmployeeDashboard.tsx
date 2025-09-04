import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, ClipboardList, Star, Image } from "lucide-react";

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menuItems = [
        { key: "dashboard", label: "Dashboard", icon: <Home /> },
        { key: "current", label: "Current Bookings", icon: <ClipboardList /> },
        { key: "past", label: "Past Bookings", icon: <ClipboardList /> },
        { key: "reviews", label: "Reviews", icon: <Star /> },
    ];

    const currentBookings = [
        {
            id: 1,
            service: "AC Repair",
            status: "In Progress",
            customer: "Rahul Sharma",
            beforePhoto: null,
            afterPhoto: null,
        },
    ];

    const pastBookings = [
        {
            id: 101,
            service: "Plumbing Fix",
            date: "20th Aug 2025",
            customer: "Amit Verma",
            beforePhoto: "/images/before1.jpg",
            afterPhoto: "/images/after1.jpg",
        },
        {
            id: 102,
            service: "Washing Machine Repair",
            date: "10th Aug 2025",
            customer: "Sneha Patel",
            beforePhoto: "/images/before2.jpg",
            afterPhoto: "/images/after2.jpg",
        },
    ];

    const reviews = [
        {
            id: 1,
            service: "Plumbing Fix",
            customer: "Amit Verma",
            feedback: "Great work! The issue was fixed quickly.",
            rating: 5,
        },
        {
            id: 2,
            service: "Washing Machine Repair",
            customer: "Sneha Patel",
            feedback: "Good job, machine works perfectly now.",
            rating: 4,
        },
    ];

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

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
                {activeTab === "dashboard" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                            <p className="text-[#6C584C] mb-2">Welcome back, <span className="font-semibold text-[#141414]">John (Employee)</span></p>
                            <p className="text-sm text-[#6C584C]">You have {currentBookings.length} active booking(s) to complete.</p>
                        </Card>
                    </div>
                )}

                {activeTab === "current" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Current Bookings</h1>
                        {currentBookings.map((booking) => (
                            <Card key={booking.id} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 mb-4">
                                <h3 className="font-semibold text-[#141414]">{booking.service}</h3>
                                <p className="text-sm text-[#6C584C]">Customer: {booking.customer}</p>
                                <p className="text-sm text-[#6C584C] mb-3">Status: <span className="font-semibold text-[#38B000]">{booking.status}</span></p>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex items-center gap-2 border-[#6C584C] text-[#6C584C] hover:bg-[#38B000] hover:text-white">
                                        <Image size={18} /> Upload Before Photo
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 border-[#6C584C] text-[#6C584C] hover:bg-[#38B000] hover:text-white">
                                        <Image size={18} /> Upload After Photo
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "past" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Past Bookings</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {pastBookings.map((booking) => (
                                <Card key={booking.id} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                                    <h3 className="font-semibold text-[#141414]">{booking.service}</h3>
                                    <p className="text-sm text-[#6C584C]">Customer: {booking.customer}</p>
                                    <p className="text-sm text-[#6C584C] mb-3">Completed on {booking.date}</p>
                                    <div className="flex gap-4">
                                        <img src={booking.beforePhoto} alt="Before" className="w-24 h-24 object-cover rounded-lg border" />
                                        <img src={booking.afterPhoto} alt="After" className="w-24 h-24 object-cover rounded-lg border" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <Card key={review.id} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                                    <h3 className="font-semibold text-[#141414]">{review.service}</h3>
                                    <p className="text-sm text-[#6C584C]">Customer: {review.customer}</p>
                                    <p className="text-sm text-[#141414] mt-2">“{review.feedback}”</p>
                                    <p className="text-sm text-[#38B000] font-semibold mt-2">Rating: {review.rating}/5</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
