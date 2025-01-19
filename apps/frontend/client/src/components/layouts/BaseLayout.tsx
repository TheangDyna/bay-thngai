import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50">
        <NavigationBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow relative">{children}</main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BaseLayout;
