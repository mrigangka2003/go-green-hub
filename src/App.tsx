import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Auth,
  Index,
  Dashboard,
  NotFound,
  CurrentBookingsPage,
  AllUsers,
  AddManagement,
  Profile,
  BookNow
} from "./pages"
import DashboardLayout from "./components/layouts/DashboardLayout";
import { AdminDashboard, AssignTask, CommonDashboard, EmployeeDashboard, OrgDashboard, Reviews, Sidebar, UserDashboard } from "./components";


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
            <Route index element={<AdminDashboard />} />
            <Route path="current-bookings" element={<CurrentBookingsPage/>} />
            <Route path="all-users" element={<AllUsers/>} />
            <Route path="assign-task" element={<BookNow />} />
            <Route path="add-management" element={<AddManagement />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>

          <Route path="user-dashboard" element={<DashboardLayout />}>
            <Route index element={<CommonDashboard />} />
            <Route path="book-now" element={<BookNow />} />
            <Route path="my-bookings" element={<BookNow />} />
            <Route path="my-reviews" element={<Reviews />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>


          <Route path="/org-dashboard" element={<DashboardLayout />}>
            <Route index element={<CommonDashboard />} />
            <Route path="book-now" element={<BookNow />} />
            <Route path="my-bookings" element={<BookNow />} />
            <Route path="my-reviews" element={<Reviews />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>


          <Route path="/emp-dashboard" element={<DashboardLayout />}>
            <Route index element={<CommonDashboard />} />
            <Route path="tasks/assigned" element={<AssignTask />} />
            <Route path="my-bookings" element={<BookNow />} />
            <Route path="my-reviews" element={<Reviews />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;