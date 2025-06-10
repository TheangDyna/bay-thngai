import { NavigationBar } from "@/components/layouts/NavigationBar";
import { Toaster } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationBar />

      <div className="flex-1">{children}</div>

      <Toaster position="top-right" />
    </div>
  );
};

export default BaseLayout;
