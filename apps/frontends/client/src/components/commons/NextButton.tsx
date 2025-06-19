import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface INextButtonProps {
  onClick: () => void;
  className?: string;
}

const NextButton: React.FC<INextButtonProps> = ({ onClick, className }) => {
  return (
    <div>
      <Button
        onClick={onClick}
        variant="outline"
        size="icon"
        className={`rounded-full p-2 ${className}`}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default NextButton;
