import { Add } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import { useModal } from "../hooks/useModal";
import type { FormField } from "./FormComponent";
import FormComponent from "./FormComponent";
import { useMemo } from "react";

interface CreateMatchProps {
  sportTypes: string[];
}

export default function CreateMatch({ sportTypes }: CreateMatchProps) {
  const modal = useModal();

  const fields: FormField[] = [
    {
      name: "liga",
      label: "Лига",
      type: "text",
      required: true,
    },
    {
      name: "teamA",
      label: "Команда А",
      type: "text",
      required: true,
    },
    {
      name: "teamB",
      label: "Команда B",
      type: "text",
      required: true,
    },
    {
      name: "sportType",
      label: "Вид спорта",
      type: "autocomplete",
      options: sportTypes.map((sport) => ({
        value: sport,
        label: sport,
      })),
      required: true,
      strictMatch: true,
    },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Матч создан: ", data);
    modal.closeModal();
  };

  return (
    <>
      <Button fullWidth startIcon={<Add />} onClick={modal.openModal}>
        Создать ставку
      </Button>

      <Modal open={modal.isOpen} onClose={modal.closeModal}>
        <FormComponent
          title="Создание матча"
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={modal.closeModal}
          submitText="Создать"
          absolute
        />
      </Modal>
    </>
  );
}
