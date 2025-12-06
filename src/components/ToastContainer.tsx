// components/ToastContainer.tsx
import { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  type AlertColor,
  IconButton,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "../utils/toast";

// Тип для тоста с дополнительными свойствами
interface Toast {
  id: string;
  message: string;
  type: string;
  duration?: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>(toast.getToasts());

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  // Функция для автоскрытия
  useEffect(() => {
    const autoDismissToasts = toasts.filter(
      (t) => t.duration && t.duration > 0
    );

    const timers = autoDismissToasts.map((t) => {
      return setTimeout(() => {
        toast.dismiss(t.id);
      }, t.duration);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  const getSeverity = (type: string): AlertColor => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const handleClose = (id: string) => {
    toast.dismiss(id);
  };

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((t, index) => (
        <Snackbar
          key={t.id}
          open={true}
          sx={{
            position: "fixed",
            alignItems: "flex-start",
            top: 70 + index * 70,
            right: 20,
            zIndex: 9999 - index,
          }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: "right" } as any}
        >
          <Alert
            severity={getSeverity(t.type)}
            variant="filled"
            sx={{
              minWidth: 300,
              maxWidth: 450,
              boxShadow: 3,
              borderRadius: 1,
              color: "white",
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose(t.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default ToastContainer;
