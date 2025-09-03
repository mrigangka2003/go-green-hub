import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Play, Star } from "lucide-react";

interface Booking {
  id: string;
  serviceType: string;
  address: string;
  date: string;
  time: string;
  status: "requested" | "assigned" | "in-progress" | "completed";
  employee?: {
    name: string;
    phone: string;
  };
}

interface BookingStatusProps {
  bookings: Booking[];
  type: "ongoing" | "past";
}

export default function BookingStatus({ bookings, type }: BookingStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested": return "bg-yellow-500";
      case "assigned": return "bg-blue-500";
      case "in-progress": return "bg-primary";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "requested": return "Requested";
      case "assigned": return "Assigned";
      case "in-progress": return "In Progress";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "requested": return 25;
      case "assigned": return 50;
      case "in-progress": return 75;
      case "completed": return 100;
      default: return 0;
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            {type === "ongoing" ? "No ongoing bookings" : "No past bookings"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="shadow-card hover:shadow-soft transition-smooth">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{booking.serviceType}</CardTitle>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Address:</span>
                <p className="font-medium">{booking.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date & Time:</span>
                <p className="font-medium">
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </p>
              </div>
            </div>

            {booking.employee && (
              <div className="text-sm">
                <span className="text-muted-foreground">Assigned to:</span>
                <p className="font-medium">{booking.employee.name}</p>
                <p className="text-muted-foreground">{booking.employee.phone}</p>
              </div>
            )}

            {type === "ongoing" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{getProgressValue(booking.status)}%</span>
                </div>
                <Progress value={getProgressValue(booking.status)} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Booking ID: {booking.id}</span>
              </div>
              
              {type === "past" && booking.status === "completed" && (
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Service
                </Button>
              )}
              
              {type === "ongoing" && booking.status === "in-progress" && (
                <Button variant="eco" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Track Live
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}