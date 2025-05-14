
import { toast as sonnerToast, type Toast } from "sonner";

type ToastProps = Omit<Toast, "description"> & {
  description?: React.ReactNode;
};

export const toast = ({ description, ...props }: ToastProps) => {
  return sonnerToast(props.title, {
    ...props,
    description,
  });
};

export const useToast = () => {
  return {
    toast,
  };
};
