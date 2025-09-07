import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUp, SignIn } from "@/components";
import { Leaf } from "lucide-react"; // logo icon

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Leaf className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">GoGreen Plus</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Eco-friendly cleaning & lifestyle services
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant={mode === "signin" ? "default" : "outline"}
            onClick={() => setMode("signin")}
            className="w-1/2"
          >
            Login
          </Button>
          <Button
            variant={mode === "signup" ? "default" : "outline"}
            onClick={() => setMode("signup")}
            className="w-1/2"
          >
            Register
          </Button>
        </div>

        {/* Render based on mode */}
        {mode === "signin" ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
}
