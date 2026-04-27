import { Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { BookingStatus, BookingStatusLabels, type BookingFromDB } from "shared";

interface BookingModalProps {
  date: string;
  modal: {
    type: "edit" | "create";
    item: BookingFromDB | null;
  } | null;
  close: () => void;
}

export const BookingModal = ({ modal, close, date }: BookingModalProps) => {
  const form = useForm({
    initialValues: {
      id: "",
      startDate: date,
      startTime: "09:00",
      endTime: "18:00",
      status: "PENDING",
    },
  });

  return (
    <>
      <Modal
        onClose={close}
        opened={!!modal}
        title={
          modal?.type === "edit" ? "Редактировать запись" : "Добавить запись"
        }
        centered
      >
        <form>
          <Stack>
            <Select
              label="Статус"
              placeholder="Выберите статус"
              data={Object.values(BookingStatus).map((status) => ({
                value: status,
                label: BookingStatusLabels[status],
              }))}
              searchable
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Время начала"
              type="time"
              {...form.getInputProps("startTime")}
            />

            <TextInput
              label="Время окончания"
              type="time"
              {...form.getInputProps("endTime")}
            />
          </Stack>
        </form>
      </Modal>
    </>
  );
};
