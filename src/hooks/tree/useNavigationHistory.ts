
import { useState } from 'react';

interface NavigationState {
  level1: string;
  level2: string;
  level3: string;
}

export const useNavigationHistory = (initialPath = {
  level1: "adaptive-optics",
  level2: "medical-applications",
  level3: "retinal-imaging"
}) => {
  const [history, setHistory] = useState<NavigationState[]>([initialPath]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = (newPath: NavigationState) => {
    // Remove any forward history if we're in the middle of undo/redo
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add new path and update current index
    const updatedHistory = [...newHistory, newPath];
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const undo = () => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  };

  const redo = () => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  };

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    currentPath: history[currentIndex]
  };
};
