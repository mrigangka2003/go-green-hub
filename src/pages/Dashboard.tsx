import { useState } from "react";
import Navigation from "@/components/Navigation";
import BookingForm from "@/components/BookingForm";
import BookingStatus from "@/components/BookingStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle, Recycle } from "lucide-react";

// Mock data
const user = {
  name: "John Doe",
  role: "User",
  avatar: "",
};

const ongoingBookings = [
  {
    id: "BK001",
    serviceType: "Residential Cleaning",
    address: "123 Green Street, Eco City, EC 12345",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    status: "in-progress" as const,
    employee: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567"
    }
  },
  {
    id: "BK002",
    serviceType: "Waste Management",
    address: "456 Clean Avenue, Green Town, GT 67890",
    date: "2024-01-16",
    time: "2:00 PM - 4:00 PM",
    status: "assigned" as const,
    employee: {
      name: "Mike Wilson",
      phone: "+1 (555) 987-6543"
    }
  }
];

const pastBookings = [
  {
    id: "BK003",
    serviceType: "Deep Cleaning",
    address: "789 Eco Boulevard, Clean City, CC 11111",
    date: "2024-01-10",
    time: "9:00 AM - 11:00 AM",
    status: "completed" as const,
    employee: {
      name: "Emma Davis",
      phone: "+1 (555) 111-2222"
    }
  },
  {
    id: "BK004",
    serviceType: "Garden Cleanup",
    address: "321 Nature Lane, Green Valley, GV 22222",
    date: "2024-01-05",
    time: "1:00 PM - 3:00 PM",
    status: "completed" as const,
    employee: {
      name: "Tom Brown",
      phone: "+1 (555) 333-4444"
    }
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your eco-friendly cleaning services and bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                  <p className="text-2xl font-bold">{ongoingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{pastBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eco Impact</p>
                  <p className="text-2xl font-bold">95%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="book">Book Service</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Your latest booking updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium">Residential Cleaning</p>
                      <p className="text-sm text-muted-foreground">Started 30 minutes ago</p>
                    </div>
                    <Badge className="bg-primary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium">Waste Management</p>
                      <p className="text-sm text-muted-foreground">Assigned to Mike Wilson</p>
                    </div>
                    <Badge className="bg-blue-500">Assigned</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Recycle className="h-5 w-5 text-primary" />
                    <span>Eco Impact</span>
                  </CardTitle>
                  <CardDescription>Your environmental contribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">15.3 kg</div>
                    <p className="text-sm text-muted-foreground">Waste recycled this month</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">8</div>
                      <p className="text-xs text-muted-foreground">Services completed</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">4.2</div>
                      <p className="text-xs text-muted-foreground">CO₂ saved (kg)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="book">
            <BookingForm />
          </TabsContent>

          <TabsContent value="ongoing">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ongoing Bookings</h2>
              <BookingStatus bookings={ongoingBookings} type="ongoing" />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking History</h2>
              <BookingStatus bookings={pastBookings} type="past" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}