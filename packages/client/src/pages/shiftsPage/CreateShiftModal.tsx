import { Modal, Select, Button, Stack, TextInput } from "@mantine/core";
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

interface CreateShiftModalProps {
  date: string;
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

export const CreateShiftModal = ({
  date,
  modal,
  close,
  currentMonth,
}: CreateShiftModalProps) => {
  const createShift = useCreateShift();
  const editingShift = useUpdateShift(currentMonth);

  const { data: workers } = trpc.workers.getAll.useQuery();

  const form = useForm({
    initialValues: {
      worker: "",
      startDate: date,
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  useEffect(() => {
    form.setFieldValue("startDate", date);
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
    const dateOnly = values.startDate.split("T")[0];

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
    <Modal onClose={close} opened={!!modal} title="Добавить смену" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
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
            Добавить смену
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
