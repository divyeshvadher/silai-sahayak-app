
import { Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingFeatures = () => {
  return (
    <Card className="mb-6 border-none shadow-md bg-gradient-to-r from-silai-50 to-silai-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-silai-800 flex items-center">
              <Brain size={18} className="mr-2 text-silai-600" />
              Coming Soon: AI Features
            </CardTitle>
            <CardDescription>
              Smart tools to enhance your tailoring experience
            </CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-silai-600 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border border-silai-200">
            <h4 className="font-medium text-silai-700 mb-1">Auto Measurement Detection</h4>
            <p className="text-sm text-gray-600">Scan your client's measurements from photos using AI</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-silai-200">
            <h4 className="font-medium text-silai-700 mb-1">Design Suggestions</h4>
            <p className="text-sm text-gray-600">Get AI-generated design ideas based on customer preferences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFeatures;
