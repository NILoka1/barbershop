import { Button, Flex, Paper, Select, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React from "react";
import { trpc } from "src/api/client";

const ForClientsPage = () => {
  const { data } = trpc.forClients.getData.useQuery();

  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      workerId: "",
      serviceId: "",
      date: "",
    },
  });
  if (!data) return <></>;

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  }

  return (
    <Flex w={"100vw"} h={"100vh"} align={"center"} justify={"space-around"} p={"md"} gap={'md'}>
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: "50%" }}>
        <Flex gap={"md"} direction={"column"}>
          <TextInput
            label="ФИО"
            placeholder="Иванов Иван Иванович"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Номер телефона"
            placeholder="+7 123-456-7890"
            {...form.getInputProps("phone")}
          />
          <Select
            searchable
            label="Работник"
            placeholder="Выберите работника"
            data={data.workers.map((worker) => ({
              value: worker.id,
              label: worker.name,
            }))}
            {...form.getInputProps("workerId")}
          />
          <Select
            searchable
            label="Услуга"
            placeholder="Выберите услугу"
            data={data.services.map((service) => ({
              value: service.id,
              label: service.name,
            }))}
            {...form.getInputProps("serviceId")}
          />
          <DatePicker {...form.getInputProps("date")} />
          <Button type="submit">Записаться</Button>
        </Flex>
      </form>
      <Paper h={"100%"} withBorder shadow="md" w="50% " p="md">
        <Text>Свободные слоты</Text>
      </Paper>
    </Flex>
  );
};

export default ForClientsPage;
