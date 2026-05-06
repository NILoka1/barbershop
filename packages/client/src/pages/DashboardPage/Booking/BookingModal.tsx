import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { schemaResolver, useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  BookingStatus,
  BookingStatusLabels,
  createBookingForm,
  type BookingFromDB,
  type createBookingFormOutput,
  type ShiftFromDB,
} from "shared";
import { useCreateBooking } from "src/api/booking/create";
import { useUpdateBooking } from "src/api/booking/update";
import { trpc } from "src/api/client";

interface BookingModalProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  dayDatail: ShiftFromDB[];
  date?: string;
  modal: {
    type: "edit" | "create";
    item: BookingFromDB | null;
  };
  close: () => void;
}

export const BookingModal = ({
  dateRange,
  modal,
  close,
  date,
  dayDatail,
}: BookingModalProps) => {
  const form = useForm({
    initialValues: {
      id: modal.item?.id || "",
      serviceId: modal.item?.service.id || "",
      shiftId: modal.item?.shift.id || "",
      clientId: modal.item?.client.id || "",
      startDate: date
        ? date.split("T")[0]
        : modal.item
          ? dayjs(modal.item.startTime).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      startTime: modal.item
        ? dayjs(modal.item.startTime).format("HH:mm")
        : "12:00",
      endTime: modal.item ? dayjs(modal.item.endTime).format("HH:mm") : "13:00",
      status: modal.item?.status || "PENDING",
    },
    validate: schemaResolver(createBookingForm),
    validateInputOnBlur: true,
  });

  const CreateBooking = useCreateBooking(dateRange);
  const UpdateBooking = useUpdateBooking(dateRange);

  const { data: services } = trpc.booking.getServices.useQuery();
  const { data: clients } = trpc.booking.getClients.useQuery();

  const handleSubmit = (value: createBookingFormOutput) => {
    const startTime = dayjs
      .tz(`${value.startDate}T${value.startTime}:00`, "Europe/Moscow")
      .toISOString();
    const endTime = dayjs
      .tz(`${value.startDate}T${value.endTime}:00`, "Europe/Moscow")
      .toISOString();

    const onSuccess = {
      onSuccess: () => {
        close();
        form.reset();
      },
    };
    if (!!modal && modal?.type === "edit") {
      return UpdateBooking.mutate(
        {
          id: value.id,
          startTime,
          endTime,
          status: value.status as BookingStatus,
          client: {
            id: value.clientId,
            name: modal.item?.client.name || "",
          },
          service: {
            id: value.serviceId,
            name: modal.item?.service.name || "",
          },
          shift: {
            id: value.shiftId,
            worker: {
              name: modal.item?.shift.worker.name || "",
            },
          },
        },
        onSuccess,
      );
    }
    CreateBooking.mutate(
      {
        ...value,
        startTime: startTime,
        endTime: endTime,
        status: value.status as BookingStatus,
      },
      onSuccess,
    );
  };

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {!date && (
              <DatePickerInput
                label="Дата"
                value={
                  form.values.startDate ? new Date(form.values.startDate) : null
                }
                onChange={(d) =>
                  form.setFieldValue(
                    "startDate",
                    d ? dayjs(d).format("YYYY-MM-DD") : "",
                  )
                }
                valueFormat="DD.MM.YYYY"
              />
            )}

            <Select
              label="Исполнитель"
              placeholder="Выберите исполнителя"
              data={dayDatail.map((shift) => ({
                value: shift.id,
                label:
                  shift.worker.name +
                  " " +
                  dayjs(shift.startTime).format("HH:mm") +
                  "-" +
                  dayjs(shift.endTime).format("HH:mm"),
              }))}
              searchable
              {...form.getInputProps("shiftId")}
            />
            <Select
              label="Клиент"
              placeholder="Выберите клиента"
              data={
                clients?.map((client) => ({
                  value: client.id,
                  label: client.name,
                })) || []
              }
              searchable
              {...form.getInputProps("clientId")}
            />

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

            <Select
              label="Услуга"
              placeholder="Выберите услугу"
              data={
                services?.map((service) => ({
                  value: service.id,
                  label: service.name,
                })) || []
              }
              searchable
              {...form.getInputProps("serviceId")}
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
            <Button type="submit">
              {modal?.type === "edit"
                ? "Сохранить изменения"
                : "Добавить запись"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
