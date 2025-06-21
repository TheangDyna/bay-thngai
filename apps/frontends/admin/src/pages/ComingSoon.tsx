import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-secondary/10 backdrop-blur-lg border-prbg-secondary/20 relative z-10">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 border rounded-full">
              <Rocket className="w-8 h-8" />
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Feature in Development
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Admin Feature
            <br />
            Coming Soon
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            This admin feature is currently under development. We're working
            hard to bring you powerful new tools to manage your application.
          </p>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 mt-8">
            Check back soon for updates on this feature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
