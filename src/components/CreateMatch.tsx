import { Add } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import { useModal } from "../hooks/useModal";
import type { FormField } from "./FormComponent";
import FormComponent from "./FormComponent";
import { useMemo } from "react";
import { matchesAPI } from "../api/endpoints/matches";
import type { Match, Odds } from "../api/types/match";

interface CreateMatchProps {
  sportTypes: string[];
}

export default function CreateMatch({ sportTypes }: CreateMatchProps) {
  const modal = useModal();

  const fields: FormField[] = [
    {
      name: "league",
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
    {
      name: "odds",
      label: "Коэффициенты",
      type: "object",
      required: true,
      fields: [
        {
          name: "winA",
          label: "Победа команды A",
          type: "number",
          required: true,
          validation: { min: 1.0 },
        },
        {
          name: "draw",
          label: "Ничья",
          type: "number",
          required: true,
          validation: { min: 1.0 },
        },
        {
          name: "winB",
          label: "Победа команды B",
          type: "number",
          required: true,
          validation: { min: 1.0 },
        },
        {
          name: "handicap",
          label: "Форы",
          type: "array",
          arrayItemLabel: "Фора",
          fields: [
            {
              name: "value",
              label: "Значение",
              type: "number",
              required: true,
            },
            {
              name: "oddsA",
              label: "Коэф. команды A",
              type: "number",
              required: true,
              validation: { min: 1.0 },
            },
            {
              name: "oddsB",
              label: "Коэф. команды B",
              type: "number",
              required: true,
              validation: { min: 1.0 },
            },
          ],
        },
        {
          name: "total",
          label: "Тоталы",
          type: "array",
          arrayItemLabel: "Тотал",
          fields: [
            {
              name: "value",
              label: "Значение",
              type: "number",
              required: true,
            },
            {
              name: "over",
              label: "Коэф. больше",
              type: "number",
              required: true,
              validation: { min: 1.0 },
            },
            {
              name: "under",
              label: "Коэф. меньше",
              type: "number",
              required: true,
              validation: { min: 1.0 },
            },
          ],
        },
      ],
    },
  ];

  const processOdds = (odds: Odds) => ({
    winA: +odds.winA,
    draw: +odds.draw,
    winB: +odds.winB,
    handicap: odds.handicap?.map((h) => ({
      value: +h.value,
      oddsA: +h.oddsA,
      oddsB: +h.oddsB,
    })),
    total: odds.total?.map((t) => ({
      value: +t.value,
      over: +t.over,
      under: +t.under,
    })),
  });

  const handleSubmit = async (data: Record<string, any>) => {
    const createMatchRequest: Partial<Match> = {
      league: data.league,
      teamA: data.teamA,
      teamB: data.teamB,
      sportType: data.sportType,
      odds: processOdds(data.odds),
    };

    const response = await matchesAPI.createMatch(createMatchRequest);

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
