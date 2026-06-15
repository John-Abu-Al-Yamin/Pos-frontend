import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomHeader = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between text-neutral-950 mb-10">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}

      </div>
      

      

      <button
        onClick={() => navigate(-1)}
        className="shrink-0 ml-4"
        aria-label="Go back"
      >
        <div className="h-8 w-8 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
        </div>
      </button>
    </header>
  );
};

export default CustomHeader;
