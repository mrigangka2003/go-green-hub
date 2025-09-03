import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, User, Building, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mode = searchParams.get("mode") || "signin";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Simulate authentication
    toast({
      title: mode === "signin" ? "Welcome back!" : "Account created successfully!",
      description: mode === "signin" ? "You have been signed in." : "Welcome to GoGreen!",
    });

    // Redirect to dashboard
    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "user": return <User className="h-5 w-5" />;
      case "organization": return <Building className="h-5 w-5" />;
      case "admin": return <Shield className="h-5 w-5" />;
      case "employee": return <Users className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">GoGreen</span>
          </div>
          <p className="text-muted-foreground">Eco-friendly cleaning services</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "signin" 
                ? "Sign in to your GoGreen account" 
                : "Join our eco-friendly community"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Individual User</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="organization">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>Organization</span>
                          </div>
                        </SelectItem>
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
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="ml-1 p-0 h-auto font-normal"
                  onClick={() => {
                    const newMode = mode === "signin" ? "signup" : "signin";
                    navigate(`/auth?mode=${newMode}`);
                  }}
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}