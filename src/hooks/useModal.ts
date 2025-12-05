// hooks/useModal.ts
import { useState, useCallback } from "react";

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// Хук для модалки с дополнительным состоянием ошибки
interface UseModalWithErrorReturn extends UseModalReturn {
  error: string | undefined;
  setError: (error: string | undefined) => void;
  clearError: () => void;
  closeModalWithReset: () => void;
}

export const useModalWithError = (
  initialState = false
): UseModalWithErrorReturn => {
  const modal = useModal(initialState);
  const [error, setErrorState] = useState<string | undefined>(undefined);

  const setError = useCallback((error: string | undefined) => {
    setErrorState(error);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(undefined);
  }, []);

  const closeModalWithReset = useCallback(() => {
    modal.closeModal();
    clearError();
  }, [modal, clearError]);

  return {
    ...modal,
    error,
    setError,
    clearError,
    closeModalWithReset,
  };
};

// Хук для модалки с формой (расширенный вариант)
interface UseFormModalReturn<T = Record<string, any>>
  extends UseModalWithErrorReturn {
  initialData: T | undefined;
  setInitialData: (data: T | undefined) => void;
  resetForm: () => void;
}

export const useFormModal = <T = Record<string, any>>(
  initialState = false
): UseFormModalReturn<T> => {
  const modalWithError = useModalWithError(initialState);
  const [initialData, setInitialDataState] = useState<T | undefined>(undefined);

  const setInitialData = useCallback((data: T | undefined) => {
    setInitialDataState(data);
  }, []);

  const resetForm = useCallback(() => {
    modalWithError.closeModalWithReset();
    setInitialData(undefined);
  }, [modalWithError]);

  return {
    ...modalWithError,
    initialData,
    setInitialData,
    resetForm,
  };
};
