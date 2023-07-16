"use client";

import { useToast } from "./../../hooks/use-toast";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "#/components/loan-visualizer/toast";

function Toaster() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...other }) {
        return (
          <Toast key={id} {...other}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toaster };
