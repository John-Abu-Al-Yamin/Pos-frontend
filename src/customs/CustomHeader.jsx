import { Button } from "@/components/ui/button";
import React from "react";
import AppModalAdd from "./AppModalAdd";

const CustomHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
  addModal,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const prevLoading = React.useRef(addModal?.isLoading);

  React.useEffect(() => {
    if (prevLoading.current && !addModal?.isLoading && !addModal?.error) {
      setIsModalOpen(false);
    }
    prevLoading.current = addModal?.isLoading;
  }, [addModal?.isLoading, addModal?.error]);

  const handleClick = () => {
    if (addModal) {
      setIsModalOpen(true);
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <>
      <header className="flex items-center justify-between text-neutral-950 mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {buttonText && (
          <Button
            onClick={handleClick}
            className="shrink-0 ml-4"
            aria-label="Go back"
          >
            إضافة {buttonText}
          </Button>
        )}
      </header>

      {addModal && (
        <AppModalAdd
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={addModal.title}
          description={addModal.description}
          onSubmit={addModal.onSubmit}
          isLoading={addModal.isLoading}
          error={addModal.error}
          submitText={addModal.submitText}
        >
          {addModal.children}
        </AppModalAdd>
      )}
    </>
  );
};

export default CustomHeader;
