import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
      <p className="text-center text-gray-600 mb-6">{message}</p>
      <Button variant="default" onClick={onRetry}>
        Go Back to Upload
      </Button>
    </div>
  );
};
