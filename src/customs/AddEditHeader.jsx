import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddEditHeader = ({ title, description, backPath, backText }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <Button
        onClick={() => navigate(backPath)}
        variant="outline"
        className="sm:self-center gap-2 self-start"
      >
        <ArrowRight className="h-4 w-4" />
        {backText}
      </Button>
    </div>
  );
};

export default AddEditHeader;
