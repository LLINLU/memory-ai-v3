
// Import from Sonner directly
import { toast as sonnerToast, useToast as useSonnerToast } from "sonner";

// Create our own slightly modified toast utility
export const toast = sonnerToast;
export const useToast = useSonnerToast;
