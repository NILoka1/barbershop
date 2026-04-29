import { Modal, Select, Button, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { trpc } from "src/main";
import { useCreateShift } from "src/api/shifts/create";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect } from "react";
import type { ShiftFromDB } from "shared";
import { useUpdateShift } from "src/api/shifts/update";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ShiftCreateModalProps {
  date?: string;
  modal: {
    type: "edit" | "create";
    item: ShiftFromDB | null;
  } | null;
  close: () => void;
  currentMonth: {
    startDate: string;
    endDate: string;
  };
}

export const ShiftCreateModal = ({
  date,
  modal,
  close,
  currentMonth,
}: ShiftCreateModalProps) => {
  const createShift = useCreateShift();
  const editingShift = useUpdateShift(currentMonth);

  const { data: workers } = trpc.workers.getAll.useQuery();

  const form = useForm({
    initialValues: {
      worker: "",
      startDate: date ? date.split("T")[0] : dayjs().format("YYYY-MM-DD"),
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  useEffect(() => {
    if (date) {
      form.setFieldValue("startDate", date.split("T")[0]);
    }
  }, [date]);

  useEffect(() => {
    if (modal?.type === "edit" && modal.item) {
      form.setValues({
        worker: modal.item.worker.id,
        startDate: dayjs(modal.item.startTime).format("YYYY-MM-DD"),
        startTime: dayjs(modal.item.startTime).format("HH:mm"),
        endTime: dayjs(modal.item.endTime).format("HH:mm"),
      });
    }
  }, [modal]);

  const handleSubmit = (values: typeof form.values) => {
    const dateOnly = values.startDate;

    const startDate = dayjs
      .tz(`${dateOnly}T${values.startTime}:00`, "Europe/Moscow")
      .toISOString();

    const endDate = dayjs
      .tz(`${dateOnly}T${values.endTime}:00`, "Europe/Moscow")
      .toISOString();

    if (modal?.type === "edit" && modal.item) {
      return editingShift.mutate(
        { id: modal.item.id, startDate, endDate },
        {
          onSuccess: () => {
            close();
            form.reset();
          },
        },
      );
    }
    createShift.mutate(
      { startDate, endDate, worker: values.worker },
      {
        onSuccess: () => {
          close();
          form.reset();
        },
      },
    );
  };

  const workersData =
    workers?.map((w) => ({
      value: w.id,
      label: w.name,
    })) ?? [];

  return (
    <Modal
      onClose={close}
      opened={!!modal}
      title={modal?.type === "edit" ? "Редактировать смену" : "Добавить смену"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {!date && (
            <DatePickerInput
              label="Дата"
              value={
                form.values.startDate ? new Date(form.values.startDate) : null
              }
              onChange={(date) =>
                form.setFieldValue(
                  "startDate",
                  date ? dayjs(date).format("YYYY-MM-DD") : "",
                )
              }
              valueFormat="DD.MM.YYYY"
            />
          )}

          <Select
            label="Мастер"
            placeholder="Выберите мастера"
            data={workersData}
            searchable
            {...form.getInputProps("worker")}
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

          <Button type="submit" loading={createShift.isPending}>
            {modal?.type === "edit" ? "Сохранить изменения" : "Добавить смену"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
