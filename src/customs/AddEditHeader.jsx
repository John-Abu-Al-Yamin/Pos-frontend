import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddEditHeader = ({
  title,
  description,
  backPath,
  backText,
  showBack = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {showBack && (
        <Button
          onClick={() => navigate(backPath)}
          variant="outline"
          size="sm"
          className="gap-2 self-start sm:self-center"
        >
          <ArrowRight className="h-4 w-4" />
          {backText}
        </Button>
      )}
    </header>
  );
};

export default AddEditHeader;
