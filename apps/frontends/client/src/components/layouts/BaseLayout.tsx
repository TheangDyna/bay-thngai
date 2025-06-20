import { NavigationBar } from "@/components/layouts/NavigationBar";

interface LayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationBar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default BaseLayout;
