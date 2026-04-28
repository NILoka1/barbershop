import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import {
  BookingStatus,
  BookingStatusLabels,
  createBookingForm,
  createBookingProps,
  type BookingFromDB,
  type createBookingFormOutput,
  type ShiftFromDB,
} from "shared";
import { useCreateBooking } from "src/api/booking/create";
import { trpc } from "src/main";

interface BookingModalProps {
  dayDatail: ShiftFromDB[];
  date: string;
  modal: {
    type: "edit" | "create";
    item: BookingFromDB | null;
  } | null;
  close: () => void;
}

export const BookingModal = ({
  modal,
  close,
  date,
  dayDatail,
}: BookingModalProps) => {
  const form = useForm({
    initialValues: {
      id: "",
      serviceId: "",
      shiftId: "",
      clientId: "",
      startDate: date,
      startTime: "12:00",
      endTime: "13:00",
      status: "PENDING",
    },
    validate: schemaResolver(createBookingForm),
    validateInputOnBlur: true,
  });

  const CreateBooking = useCreateBooking({
    startDate: dayjs(dayDatail[0]?.startTime)
      .tz("Europe/Moscow")
      .startOf("day")
      .toISOString(),
    endDate: dayjs(dayDatail[0]?.endTime)
      .tz("Europe/Moscow")
      .endOf("day")
      .toISOString(),
  });

  const { data: services } = trpc.booking.getServices.useQuery();
  const { data: clients } = trpc.booking.getClients.useQuery();

  useEffect(() => {
    if (modal?.type === "edit" && modal.item) {
      form.setValues({
        id: modal.item.id,
        serviceId: modal.item.service.id,
        shiftId: modal.item.shift.id,
        clientId: modal.item.client.id,
        startDate: date,
        startTime: dayjs(modal.item.startTime).format("HH:mm"),
        endTime: dayjs(modal.item.endTime).format("HH:mm"),
        status: modal.item.status,
      });
    }
  }, [modal]);

  const handleSubmit = (value: createBookingFormOutput) => {
    const dateOnly = value.startDate.split("T")[0];
    const data: createBookingProps = {
      id: value.id,
      serviceId: value.serviceId,
      shiftId: value.shiftId,
      clientId: value.clientId,
      startTime: dayjs
        .tz(`${dateOnly}T${value.startTime}:00`, "Europe/Moscow")
        .toISOString(),
      endTime: dayjs
        .tz(`${dateOnly}T${value.endTime}:00`, "Europe/Moscow")
        .toISOString(),
      status: value.status as BookingStatus,
    };
    CreateBooking.mutate(data, {
      onSuccess: () => {
        close();
        form.reset();
      },
    });
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
            <Select
              label="Исполнитель"
              placeholder="Выберите исполнителя"
              data={dayDatail.map((shift) => ({
                value: shift.id,
                label: shift.worker.name,
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
