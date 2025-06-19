import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

interface IPrevButtonProps {
  onClick: () => void;
  className?: string;
}

const PrevButton: React.FC<IPrevButtonProps> = ({ onClick, className }) => {
  return (
    <div>
      <Button
        onClick={onClick}
        variant="outline"
        size="icon"
        className={`rounded-full p-2 ${className}`}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default PrevButton;
