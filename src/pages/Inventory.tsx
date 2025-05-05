
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

// Mock inventory data - In a real app this would come from your database
const mockInventory = [
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
          <Card className="bg-gray-900 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{lowStockCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Add buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search inventory..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            <Plus size={18} className="mr-2" />
            Add New Item
          </Button>
        </div>
        
        {/* Inventory table */}
        <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={item.status === "Low Stock" 
                          ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" 
                          : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
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
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                        >
                          -
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
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
