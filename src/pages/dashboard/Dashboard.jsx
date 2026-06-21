import Header from "@/_components/dashboard/Header";
import QuickActions from "@/_components/dashboard/QuickActions";
import StatsCards from "@/_components/dashboard/StatsCards";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="mt-6">
        <QuickActions/>
      </div>
      <div className="mt-6">
        <StatsCards />
      </div>
    </>
  );
};

export default Dashboard;
