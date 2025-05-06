
import Layout from "../components/Layout";
import BusinessStats from "@/components/dashboard/BusinessStats";
import OrderStats from "@/components/dashboard/OrderStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { todaysOrders, orderStats, customerCount, monthlyRevenue, loading } = useDashboardData();

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Select Date
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800">
              New Order
            </Button>
          </div>
        </div>
        
        {/* Business statistics */}
        <BusinessStats customerCount={customerCount} monthlyRevenue={monthlyRevenue} />
        
        {/* Order statistics */}
        <OrderStats orderStats={orderStats} />
      </div>
    </Layout>
  );
};

export default Index;
