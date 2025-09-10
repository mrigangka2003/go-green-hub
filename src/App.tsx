import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Auth,
  Index,
  Dashboard,
  NotFound
} from "./pages"
import DashboardLayout from "./components/layouts/DashboardLayout";
import { AddManagement, AdminDashboard, BookingManager, CommonDashboard, EmployeeDashboard, OrgDashboard, Sidebar, UserDashboard } from "./components";
import { Profile } from "./pages";
import BookNow from "./pages/BookNow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/admin-dashboard" element={<DashboardLayout />}>
            <Route index element={<CommonDashboard/>}/>
            <Route path="all-bookings" element={<BookingManager />} />
            <Route path="all-users" element={<BookNow />} />
            <Route path="assign-task" element={<BookNow />} />
            <Route path="add-management" element={<AddManagement />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>
          
          <Route path="user-dashboard" element={<DashboardLayout/>}>
            <Route index element={<CommonDashboard/>}/>
            <Route path="book-now" element={<BookNow/>}/>
            <Route path="my-bookings" element={<BookNow/>}/>
            <Route path="reviews"  element={<BookNow/>}/>
            <Route path="profile/:id" element={<Profile/>}/>
          </Route>


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;