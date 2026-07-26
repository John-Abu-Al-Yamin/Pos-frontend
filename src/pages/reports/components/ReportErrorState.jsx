import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { removeAuthToken } from "@/services/cookies";
import { AlertTriangle, Lock } from "lucide-react";
import { Navigate } from "react-router-dom";

const getStatus = (error) => error?.response?.status;

const getValidationMessages = (errors) => {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors;

  return Object.values(errors).flat().filter(Boolean);
};

const ReportErrorState = ({ error, onRetry }) => {
  const status = getStatus(error);

  if (status === 401) {
    removeAuthToken();
    localStorage.removeItem("user");
    return <Navigate to="/auth/login" replace />;
  }

  const isForbidden = status === 403;
  const validationMessages = status === 422
    ? getValidationMessages(error?.response?.data?.errors)
    : [];

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className={`rounded-full p-3 mb-4 ${isForbidden ? "bg-amber-100" : "bg-destructive/10"}`}>
          {isForbidden ? (
            <Lock className="h-6 w-6 text-amber-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-destructive" />
          )}
        </div>
        <p className={`text-sm font-medium mb-2 ${isForbidden ? "text-amber-700" : "text-destructive"}`}>
          {isForbidden ? "Permission denied" : "Unable to load report"}
        </p>
        <p className="text-xs text-muted-foreground mb-4 text-center">
          {error?.response?.data?.message || error?.message || "Please try again."}
        </p>
        {validationMessages.length > 0 && (
          <div className="mb-4 max-w-md rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            {validationMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}
        {!isForbidden && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportErrorState;
