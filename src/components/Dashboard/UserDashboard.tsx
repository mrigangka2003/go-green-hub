import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, CalendarCheck2, ClipboardList, Star } from "lucide-react";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [status, setStatus] = useState("In Progress");

    const bookingSteps = ["Requested", "Assigned", "In Progress", "Completed"];

    const getProgressValue = () => {
        const index = bookingSteps.indexOf(status);
        return ((index + 1) / bookingSteps.length) * 100;
    };

    const menuItems = [
        { key: "book", label: "Book Now", icon: <CalendarCheck2 /> },
        { key: "dashboard", label: "Dashboard", icon: <Home /> },
        { key: "previous", label: "Previous Bookings", icon: <ClipboardList /> },
        { key: "review", label: "Review", icon: <Star /> },
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
                {activeTab === "book" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Book a Service</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                            <p className="text-[#6C584C] mb-4">Fill out the booking form to request a service.</p>
                            <Button className="bg-[#38B000] text-white hover:opacity-90 rounded-lg">Open Booking Form</Button>
                        </Card>
                    </div>
                )}

                {activeTab === "dashboard" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Current Booking</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 space-y-4">
                            <p className="text-[#6C584C]">Assigned Employee: <span className="font-semibold text-[#141414]">John Doe</span></p>
                            <h2 className="font-semibold">Booking Status</h2>
                            <Progress value={getProgressValue()} className="h-3 bg-[#F0EAD2]" />
                            <div className="flex justify-between mt-2 text-sm text-[#6C584C]">
                                {bookingSteps.map((step) => (
                                    <span key={step} className={status === step ? "font-bold text-[#38B000]" : ""}>{step}</span>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === "previous" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Previous Bookings</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <Card key={i} className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6">
                                    <h3 className="font-semibold text-[#141414]">Service #{i} - Completed</h3>
                                    <p className="text-sm text-[#6C584C]">AC Repair completed on 25th Aug 2025.</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "review" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
                        <Card className="rounded-2xl border border-[#6C584C]/20 shadow-md p-6 space-y-4">
                            <textarea
                                className="w-full border border-[#6C584C]/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#38B000]"
                                rows={4}
                                placeholder="Write your feedback..."
                            ></textarea>
                            <Button className="bg-[#38B000] text-white hover:opacity-90 rounded-lg">Submit Review</Button>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}