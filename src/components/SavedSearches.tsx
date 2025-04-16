
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SavedSearchButtonProps {
  label: string;
  isAdd?: boolean;
}

const SavedSearchButton = ({ label, isAdd = false }: SavedSearchButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`border-2 ${
        isAdd ? "border-dashed border-blue-300" : "border-blue-300"
      } hover:border-blue-500 bg-white text-blue-500 hover:bg-blue-50 py-2 px-6 text-base rounded-full`}
    >
      {isAdd ? (
        <div className="flex items-center gap-1">
          <Plus size={18} />
          <span>{label}</span>
        </div>
      ) : (
        label
      )}
    </Button>
  );
};

export const SavedSearches = () => {
  const savedSearches = [
    "Quantum Sensing Technologies",
    "Next-Gen Solar Materials",
    "Brain-AI Interfaces",
  ];

  return (
    <section className="mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6">Saved Searches</h2>
      <div className="flex flex-wrap gap-4">
        {savedSearches.map((search, index) => (
          <SavedSearchButton key={index} label={search} />
        ))}
        <SavedSearchButton label="Add New" isAdd />
      </div>
    </section>
  );
};
