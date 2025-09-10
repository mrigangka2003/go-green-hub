import { AdminDashboard, UserDashboard, OrgDashboard, EmployeeDashboard } from "@/components";

const Dashboard = () => {
  const user: string = "admin"; 

  let content;

  switch (user) {
    case "admin":
      content = <AdminDashboard />;
      break;
    case "user":
      content = <UserDashboard />;
      break;
    case "org":
      content = <OrgDashboard />;
      break;
    case "emp":
      content = <EmployeeDashboard/>;
      break;
    default:
      content = <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">Access Denied</h2>
        <p className="text-gray-500 mt-2">Invalid user role: {user}</p>
      </div>;
  }

  return content;
};

export default Dashboard;
