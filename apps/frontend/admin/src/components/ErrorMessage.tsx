import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export function ErrorMessage({
  message = "An error occurred while fetching data",
  retry
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="max-w-md w-full">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {retry && (
          <div className="mt-4">
            <Button variant="secondary" onClick={retry} className="w-full">
              Try again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
