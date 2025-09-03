import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Leaf, Menu, X, User, LogOut } from "lucide-react";

interface NavigationProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card shadow-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">GoGreen</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive("/dashboard")
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive("/bookings")
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  My Bookings
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.name}
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/dashboard")
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/bookings")
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="hero" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}