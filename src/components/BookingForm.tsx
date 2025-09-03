import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Recycle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    serviceType: "",
    address: "",
    date: "",
    time: "",
    description: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate booking submission
    toast({
      title: "Booking Requested Successfully!",
      description: "We'll contact you shortly to confirm your cleaning service.",
    });

    // Reset form
    setFormData({
      serviceType: "",
      address: "",
      date: "",
      time: "",
      description: "",
      phone: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Recycle className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl">Book Cleaning Service</CardTitle>
            <CardDescription>
              Schedule your eco-friendly cleaning service today
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential Cleaning</SelectItem>
                  <SelectItem value="commercial">Commercial Cleaning</SelectItem>
                  <SelectItem value="waste-management">Waste Management</SelectItem>
                  <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="garden-cleanup">Garden Cleanup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Service Address</span>
            </Label>
            <Input
              id="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Preferred Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Preferred Time</span>
              </Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM - 11:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM - 1:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM - 3:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM - 5:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM - 7:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Special Instructions</Label>
            <Textarea
              id="description"
              placeholder="Any specific requirements or areas that need special attention..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            className="w-full"
            disabled={!formData.serviceType || !formData.address || !formData.date || !formData.phone}
          >
            Request Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}