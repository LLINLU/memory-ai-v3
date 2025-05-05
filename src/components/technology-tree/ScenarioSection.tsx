
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
}

export const ScenarioSection = ({ 
  scenario = "Medical professionals and patients with retinal disorders in clinical settings seeking non-invasive diagnostic methods for early detection of conditions",
  onEditScenario 
}: ScenarioSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedScenario, setEditedScenario] = useState(scenario);

  const handleSaveScenario = () => {
    if (onEditScenario && editedScenario) {
      onEditScenario(editedScenario);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">Current Scenario:</h2>
          <p className="text-gray-800 text-base">{scenario}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 border-blue-200 hover:bg-blue-100"
          onClick={() => {
            setEditedScenario(scenario);
            setIsDialogOpen(true);
          }}
        >
          Edit Scenario
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit scenario</AlertDialogTitle>
            <AlertDialogDescription>
              <textarea 
                value={editedScenario}
                onChange={(e) => setEditedScenario(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                rows={4}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveScenario}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
