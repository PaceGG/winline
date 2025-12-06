type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Хранилище тостов и колбэков
let toasts: Toast[] = [];
let updateCallback: ((toasts: Toast[]) => void) | null = null;

export const toast = {
  // Основной метод
  show: (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };

    toasts = [...toasts, newToast];
    updateCallback?.(toasts);

    // Автоудаление через 5 секунд
    setTimeout(() => {
      toast.dismiss(id);
    }, 5000);

    return id;
  },

  // Сахарные методы
  success: (message: string) => toast.show(message, "success"),
  error: (message: string) => toast.show(message, "error"),
  info: (message: string) => toast.show(message, "info"),
  warning: (message: string) => toast.show(message, "warning"),

  // Удаление
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    updateCallback?.(toasts);
  },

  clear: () => {
    toasts = [];
    updateCallback?.(toasts);
  },

  // Для компонента-контейнера
  subscribe: (callback: (toasts: Toast[]) => void) => {
    updateCallback = callback;
    return () => {
      updateCallback = null;
    };
  },

  getToasts: () => toasts,
};
