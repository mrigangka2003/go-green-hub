import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, CalendarCheck2, ClipboardList, Star } from "lucide-react";

export default function OrgDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menuItems = [
        { key: "book", label: "Book Now", icon: <CalendarCheck2 /> },
        { key: "dashboard", label: "Dashboard", icon: <Home /> },
        { key: "previous", label: "Previous Bookings", icon: <ClipboardList /> },
        { key: "review", label: "Reviews", icon: <Star /> },
    ];

    const bookingSteps = ["Requested", "Assigned", "In Progress", "Completed"];
    const currentBooking = {
        id: 1,
        service: "Office AC Maintenance",
        status: "In Progress",
        assignedTeam: "Team Alpha",
    };

    const pastBookings = [
        {
            id: 101,
            service: "Carpet Cleaning",
            date: "12th Aug 2025",
            team: "Team Beta",
            status: "Completed",
        },
        {
            id: 102,
            service: "Workstation Setup",
            date: "5th Aug 2025",
            team: "Team Gamma",
            status: "Completed",
        },
    ];

    const reviews = [
        {
            id: 1,
            service: "Carpet Cleaning",
            feedback: "The team did an excellent job, very professional.",
            rating: 5,
        },
        {
            id: 2,
            service: "Workstation Setup",
            feedback: "Smooth installation process, satisfied with the service.",
            rating: 4,
        },
    ];

    const getProgressValue = () => {
        const index = bookingSteps.indexOf(currentBooking.status);
        return ((index + 1) / bookingSteps.length) * 100;
    };

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
                {activeTab === "book" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Book a Service</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                            <p className="text-[#6C584C] mb-4">Fill out the form to request a new service for your organization.</p>
                            <Button className="bg-[#38B000] text-white hover:opacity-90 rounded-lg">Open Booking Form</Button>
                        </Card>
                    </div>
                )}

                {activeTab === "dashboard" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Ongoing Service</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 space-y-4">
                            <p className="text-[#141414] font-semibold">{currentBooking.service}</p>
                            <p className="text-sm text-[#6C584C]">Assigned Team: {currentBooking.assignedTeam}</p>
                            <h2 className="font-semibold mt-4">Service Status</h2>
                            <Progress value={getProgressValue()} className="h-3 bg-[#F0EAD2]" />
                            <div className="flex justify-between mt-2 text-sm text-[#6C584C]">
                                {bookingSteps.map((step) => (
                                    <span key={step} className={currentBooking.status === step ? "font-bold text-[#38B000]" : ""}>{step}</span>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === "previous" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Previous Bookings</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {pastBookings.map((booking) => (
                                <Card key={booking.id} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                                    <h3 className="font-semibold text-[#141414]">{booking.service}</h3>
                                    <p className="text-sm text-[#6C584C]">Team: {booking.team}</p>
                                    <p className="text-sm text-[#6C584C] mb-2">Completed on {booking.date}</p>
                                    <p className="text-sm text-[#38B000] font-semibold">Status: {booking.status}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "review" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <Card key={review.id} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 space-y-3">
                                    <h3 className="font-semibold text-[#141414]">{review.service}</h3>
                                    <p className="text-sm text-[#141414]">“{review.feedback}”</p>
                                    <p className="text-sm text-[#38B000] font-semibold">Rating: {review.rating}/5</p>
                                    <Button variant="outline" className="border-[#38B000] text-[#38B000] hover:bg-[#38B000] hover:text-white rounded-lg">
                                        Give Feedback
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
