import { Modal, Select, Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { trpc } from "src/main";
import { useModalStore } from "src/stores/workerModalStore";
import { useCreateShift } from "src/api/shifts/create";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const CreateShiftModal = ({ date }: { date: string }) => {
  const { isCreateShiftOpened, closeCreateShiftModal } = useModalStore();
  const createShift = useCreateShift();

  const { data: workers } = trpc.workers.getAll.useQuery({});

  const form = useForm({
    initialValues: {
      worker: "",
      startDate: date,
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const dateOnly = values.startDate.split("T")[0];

    const startDate = dayjs
      .tz(`${dateOnly}T${values.startTime}:00`, "Europe/Moscow")
      .toISOString();

    const endDate = dayjs
      .tz(`${dateOnly}T${values.endTime}:00`, "Europe/Moscow")
      .toISOString();

    createShift.mutate(
      { startDate, endDate, worker: values.worker },
      {
        onSuccess: () => {
          closeCreateShiftModal();
          form.reset();
        },
      },
    );
  };

  const Loging = () => {
    console.log(form.values);
  };

  const workersData =
    workers?.map((w) => ({
      value: w.id,
      label: w.name,
    })) ?? [];

  return (
    <Modal
      onClose={closeCreateShiftModal}
      opened={isCreateShiftOpened}
      title="Добавить смену"
      centered
    >
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

          <Button
            onClick={Loging}
            type="submit"
            loading={createShift.isLoading}
          >
            Добавить смену
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
