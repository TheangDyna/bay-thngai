import { Button } from "@/components/ui/button";

interface ErrorProps {
  title?: string;
}

const Error: React.FC<ErrorProps> = ({
  title = "Error loading this page!"
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-semibold text-destructive">{title}</p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  );
};

export default Error;
