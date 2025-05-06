
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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

// Mock inventory data - In a real app this would come from your database
const mockInventory: InventoryItem[] = [
  { id: 1, name: "Cotton Fabric - Blue", type: "Fabric", quantity: 12, unit: "meters", status: "In Stock" },
  { id: 2, name: "Silk Fabric - Red", type: "Fabric", quantity: 5, unit: "meters", status: "Low Stock" },
  { id: 3, name: "Plastic Buttons - Small", type: "Accessory", quantity: 200, unit: "pcs", status: "In Stock" },
  { id: 4, name: "Metal Buttons - Gold", type: "Accessory", quantity: 50, unit: "pcs", status: "Low Stock" },
  { id: 5, name: "Nylon Thread - Black", type: "Thread", quantity: 30, unit: "spools", status: "In Stock" },
  { id: 6, name: "Zippers - 6 inch", type: "Accessory", quantity: 8, unit: "pcs", status: "Low Stock" },
  { id: 7, name: "Cotton Fabric - White", type: "Fabric", quantity: 20, unit: "meters", status: "In Stock" },
  { id: 8, name: "Polyester Thread - White", type: "Thread", quantity: 25, unit: "spools", status: "In Stock" },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    // Calculate low stock items
    const lowStock = inventory.filter(item => item.status === "Low Stock").length;
    setLowStockCount(lowStock);
    
    // In a real app, you would set up a real-time listener here
    // For example, with Supabase:
    // const subscription = supabase
    //   .channel('inventory-changes')
    //   .on('postgres_changes', { 
    //     event: '*', 
    //     schema: 'public', 
    //     table: 'inventory' 
    //   }, payload => {
    //     // Update inventory based on changes
    //     fetchInventory();
    //   })
    //   .subscribe();
    
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [inventory]);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Demo function to update inventory (would connect to backend in real app)
  const updateItemQuantity = (id: number, newQuantity: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const status = newQuantity <= 10 ? "Low Stock" : "In Stock";
        return { ...item, quantity: newQuantity, status };
      }
      return item;
    }));
  };

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
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{inventory.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white/90">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{lowStockCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800/70 border border-gray-800 card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white/90">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300/70 bg-clip-text text-transparent">3</div>
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
          <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 shadow-md hover:shadow-lg btn-glow">
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
                {filteredInventory.map((item) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
