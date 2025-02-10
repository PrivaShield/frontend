import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function RiskBanner({ message, severity }) {
  const severityColors = {
    low: "bg-yellow-100 border-yellow-400 text-yellow-800",
    medium: "bg-orange-100 border-orange-400 text-orange-800",
    high: "bg-red-100 border-red-400 text-red-800",
  };

  return (
    <Alert className={`${severityColors[severity]} mb-4`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
