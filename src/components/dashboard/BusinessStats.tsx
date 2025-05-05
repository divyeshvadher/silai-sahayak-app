
import { Users, CreditCard, Scissors } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  const [isStaffOpen, setIsStaffOpen] = useState(false);

  // Mock staff data - in a real app this would come from your database
  const staffMembers = [
    { name: "Rajesh Kumar", role: "Master Tailor", activeOrders: 5 },
    { name: "Priya Sharma", role: "Stitching Expert", activeOrders: 3 },
    { name: "Arun Singh", role: "Cutter", activeOrders: 7 }
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatusSummary 
          title="Total Customers" 
          count={customerCount} 
          icon={<Users size={20} className="text-accent" />} 
          color="border-accent"
          trend={{ percentage: 5, isPositive: true }}
        />
        <StatusSummary 
          title="Monthly Revenue" 
          count={`₹${monthlyRevenue.toLocaleString()}`} 
          icon={<CreditCard size={20} className="text-[hsl(var(--silai-highlight))]" />} 
          color="border-[hsl(var(--silai-highlight))]"
          trend={{ percentage: 15, isPositive: true }}
        />
        <StatusSummary 
          title="Inventory Status" 
          count="28 Items Low" 
          icon={<Scissors size={20} className="text-amber-500" />} 
          color="border-amber-500"
          trend={{ percentage: 12, isPositive: false }}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <Collapsible open={isStaffOpen} onOpenChange={setIsStaffOpen}>
          <div className="p-4 flex items-center justify-between bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-accent" />
              <h3 className="text-lg font-medium">Staff Management</h3>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isStaffOpen ? "Hide Details" : "Show Details"}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {staffMembers.map((staff, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-md border border-gray-700 flex flex-col">
                    <div className="text-lg font-medium">{staff.name}</div>
                    <div className="text-sm text-gray-400">{staff.role}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm">Active Orders:</span>
                      <span className="bg-primary/20 text-primary-foreground px-2 py-1 rounded text-sm">
                        {staff.activeOrders}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Assign Order
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Manage Staff</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BusinessStats;
