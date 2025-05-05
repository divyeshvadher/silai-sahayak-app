
import { TrendingUp, Clock, Scissors, Check, ShoppingBag } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  // Mock data for the detailed status breakdown
  const detailedStatus = {
    measuring: 3,
    cutting: 5,
    stitching: 7,
    finishing: 4,
    ironing: 2,
    ready: 9
  };
  
  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusSummary 
          title="Total Orders" 
          count={orderStats.total} 
          icon={<TrendingUp size={20} className="text-primary" />} 
          color="border-primary"
          trend={{ percentage: 12, isPositive: true }}
        />
        <StatusSummary 
          title="Pending" 
          count={orderStats.pending} 
          icon={<Clock size={20} className="text-amber-500" />} 
          color="border-amber-500"
        />
        <StatusSummary 
          title="In Progress" 
          count={orderStats.inProgress} 
          icon={<Scissors size={20} className="text-accent" />} 
          color="border-accent"
        />
        <StatusSummary 
          title="Completed" 
          count={orderStats.completed} 
          icon={<Check size={20} className="text-[hsl(var(--silai-highlight))]" />} 
          color="border-[hsl(var(--silai-highlight))]"
          trend={{ percentage: 8, isPositive: true }}
        />
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-accent" />
            <h3 className="text-lg font-medium">Detailed Order Status</h3>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">View Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Order Status Breakdown</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {Object.entries(detailedStatus).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="capitalize">{stage}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 bg-gray-700 rounded-full w-48">
                        <div 
                          className="h-2.5 bg-gradient-to-r from-primary to-accent rounded-full" 
                          style={{ width: `${(count / orderStats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">Export Report</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(detailedStatus).map(([stage, count]) => (
            <div key={stage} className="bg-gray-800 rounded-md p-3 text-center">
              <div className="text-xs text-gray-400 capitalize">{stage}</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
