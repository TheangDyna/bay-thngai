import MorphingText from "@/components/ui/morphing-text";
import { cn } from "@/utils/cn";

const texts = ["Bay Thngai", "is", "the", "best", "food store", "ever."];

const Loading: React.FC = () => {
  return (
    <div className="h-screen max-w-screen relative flex flex-col items-center justify-center rounded-xl bg-background p-0 md:p-96">
      <div
        className={cn(
          `absolute inset-0 size-full`,
          `bg-[radial-gradient(#00000022_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff22_1px,transparent_1px)]`,
          "lab-bg pointer-events-none [background-size:16px_16px]"
        )}
      />
      <MorphingText texts={texts} className="text-nowrap" />
    </div>
  );
};

export default Loading;
