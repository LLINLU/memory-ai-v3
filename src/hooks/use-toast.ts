
import { useToast as useToastShadcn, toast as toastShadcn } from "@/components/ui/toast";
import { toast as useSonner } from "sonner";

export const useToast = useToastShadcn;
export const toast = toastShadcn;

// Export sonner toast for convenience
export const sonnerToast = useSonner;
