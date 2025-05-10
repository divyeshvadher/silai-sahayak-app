import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddInventoryDialog } from "@/components/inventory/AddInventoryDialog";

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    categories: new Set<string>()
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data) {
        const items = data.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          status: item.quantity <= item.min_quantity ? "Low Stock" : "In Stock"
        }));

        setInventory(items);
        
        // Update stats
        setStats({
          totalItems: items.length,
          lowStockItems: items.filter(item => item.status === "Low Stock").length,
          categories: new Set(items.map(item => item.type))
        });
      }
    } catch (error: any) {
      toast.error(`Error loading inventory: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    
    // Set up real-time subscription
    const channel = supabase
      .channel("public:inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    try {
      const item = inventory.find(i => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from("inventory")
        .update({ 
          quantity: newQuantity,
          status: newQuantity <= 10 ? "Low Stock" : "In Stock"
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Quantity updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update quantity: ${error.message}`);
    }
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Inventory Management">
      <div className="animate-fade-in space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white/90">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {stats.totalItems}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white/90">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{stats.lowStockItems}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white/90">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300/70 bg-clip-text text-transparent">
                {stats.categories.size}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Add buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search inventory..."
              className="pl-8 bg-gray-800/50 border-gray-700 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 shadow-md hover:shadow-lg btn-glow"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add New Item
          </Button>
        </div>
        
        {/* Inventory table */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 overflow-hidden card-glass">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Item Name</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">Loading inventory...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id} className="border-gray-800 hover:bg-gray-800/30">
                      <TableCell className="font-medium text-white/90">{item.name}</TableCell>
                      <TableCell className="text-gray-300">{item.type}</TableCell>
                      <TableCell className="text-gray-300">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={item.status === "Low Stock" 
                            ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/50" 
                            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-gray-700 text-gray-300"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 0}
                          >
                            -
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-gray-700 text-gray-300"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No items found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <AddInventoryDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onItemAdded={fetchInventory}
      />
    </Layout>
  );
};

export default Inventory;