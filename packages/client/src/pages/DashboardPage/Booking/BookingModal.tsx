import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import dayjs from "dayjs";
import React, { useEffect } from "react";
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

  const dateProps = {
    startDate: dayjs(dayDatail[0]?.startTime)
      .tz("Europe/Moscow")
      .startOf("day")
      .toISOString(),
    endDate: dayjs(dayDatail[0]?.endTime)
      .tz("Europe/Moscow")
      .endOf("day")
      .toISOString(),
  };

  const CreateBooking = useCreateBooking(dateProps);
  const UpdateBooking = useUpdateBooking(dateProps);

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

    const startTime = dayjs
      .tz(`${dateOnly}T${value.startTime}:00`, "Europe/Moscow")
      .toISOString();
    const endTime = dayjs
      .tz(`${dateOnly}T${value.endTime}:00`, "Europe/Moscow")
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
        id: value.id,
        serviceId: value.serviceId,
        shiftId: value.shiftId,
        clientId: value.clientId,
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
