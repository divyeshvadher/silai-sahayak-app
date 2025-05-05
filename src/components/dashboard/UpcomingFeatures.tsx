
import { Brain, Sparkles, Scissors, PenTool } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingFeatures = () => {
  return (
    <Card className="mb-6 border border-gray-800 bg-[hsl(var(--silai-card))] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 pointer-events-none"></div>
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Brain size={18} className="mr-2 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-[hsl(var(--silai-highlight))]">
                Coming Soon: AI Features
              </span>
            </CardTitle>
            <CardDescription>
              Smart tools to enhance your tailoring business
            </CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-[hsl(var(--silai-highlight))] animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover-lift">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-2">
                <Scissors size={16} className="text-primary" />
              </div>
              <h4 className="font-medium">Auto Measurement Detection</h4>
            </div>
            <p className="text-sm text-gray-400">Scan your client's measurements from photos using our advanced AI technology</p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover-lift">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                <PenTool size={16} className="text-accent" />
              </div>
              <h4 className="font-medium">AI Design Suggestions</h4>
            </div>
            <p className="text-sm text-gray-400">Get AI-generated design ideas based on customer preferences and latest trends</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFeatures;
