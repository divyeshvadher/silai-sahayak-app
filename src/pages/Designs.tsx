
import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Search, Upload, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Placeholder data
const mockDesigns = [
  { id: "1", name: "Traditional Blouse", category: "blouse", imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
  { id: "2", name: "Wedding Lehenga", category: "lehenga", imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" },
  { id: "3", name: "Party Wear Saree", category: "saree", imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
  { id: "4", name: "Modern Kurta", category: "kurta", imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
  { id: "5", name: "Designer Salwar", category: "salwar", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
  { id: "6", name: "Formal Shirt", category: "shirt", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" }
];

const Designs = () => {
  const [designs] = useState(mockDesigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || design.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout title="Design Gallery">
      <div className="silai-container">
        {/* Search and Upload buttons */}
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search designs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-silai-600 hover:bg-silai-700">
            <Upload size={18} className="mr-1" />
            Upload
          </Button>
        </div>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveCategory("all")}
              className="data-[state=active]:bg-silai-100 data-[state=active]:text-silai-800"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="blouse" 
              onClick={() => setActiveCategory("blouse")}
              className="data-[state=active]:bg-silai-100 data-[state=active]:text-silai-800"
            >
              Blouse
            </TabsTrigger>
            <TabsTrigger 
              value="saree" 
              onClick={() => setActiveCategory("saree")}
              className="data-[state=active]:bg-silai-100 data-[state=active]:text-silai-800"
            >
              Saree
            </TabsTrigger>
            <TabsTrigger 
              value="more" 
              className="data-[state=active]:bg-silai-100 data-[state=active]:text-silai-800"
            >
              More
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Design grid */}
        {filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredDesigns.map(design => (
              <div key={design.id} className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={design.imageUrl}
                    alt={design.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">{design.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{design.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="silai-card text-center py-12 flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-4 mb-3">
              <Image size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No designs found</p>
            <Button className="mt-3 bg-silai-600 hover:bg-silai-700">
              <Upload size={16} className="mr-1" />
              Upload designs
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Designs;
