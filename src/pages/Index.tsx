
import Layout from "../components/Layout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import OrderStats from "@/components/dashboard/OrderStats";
import BusinessStats from "@/components/dashboard/BusinessStats";
import UpcomingFeatures from "@/components/dashboard/UpcomingFeatures";
import TodaysOrders from "@/components/dashboard/TodaysOrders";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const Index = () => {
  const { todaysOrders, orderStats, customerCount, monthlyRevenue, loading } = useDashboardData();

  return (
    <Layout>
      <div className="silai-container animate-fade-in">
        <DashboardHeader />
        
        {/* Order statistics */}
        <OrderStats orderStats={orderStats} />
        
        {/* Business statistics */}
        <BusinessStats customerCount={customerCount} monthlyRevenue={monthlyRevenue} />

        {/* Upcoming AI Features */}
        <UpcomingFeatures />
        
        {/* Today's Orders */}
        <TodaysOrders todaysOrders={todaysOrders} loading={loading} />
      </div>
    </Layout>
  );
};

export default Index;
