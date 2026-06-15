import Header from "@/_components/dashboard/Header";
import QuickActions from "@/_components/dashboard/QuickActions";
import StatsCards from "@/_components/dashboard/StatsCards";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background p-4 md:p-6">
      <Header />
      <div className="mt-6">
        <QuickActions/>
      </div>
      <div className="mt-6">
        <StatsCards />
      </div>
    
    </div>
  );
};

export default Dashboard;
