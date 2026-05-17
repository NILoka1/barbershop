import {
  Badge,
  Button,
  Flex,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { trpc } from "src/api/client";

const ForClientsPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      workerId: null,
      serviceId: null,
      date: dayjs().format("YYYY-MM-DD"),
    },
  });

  const spareWindows = trpc.forClients.getSpareWindows.useQuery(
    {
      workerId: form.values.workerId!,
      serviceId: form.values.serviceId!,
      date: form.values.date,
    },
    {
      enabled: !!form.values.workerId && !!form.values.serviceId,
    },
  );

  const { data } = trpc.forClients.getData.useQuery({
    date: new Date(form.values.date).toISOString(),
  });

  const [selectedSlot, setSelectedSlot] = useState<{ startTime: Date } | null>(
    null,
  );

  if (!data) return <></>;

  const handleSubmit = (values: typeof form.values) => {
    console.log(values, spareWindows);
  };

  const groupedSlots = spareWindows.data?.reduce<
    Record<string, typeof spareWindows.data>
  >((acc, slot) => {
    const hour = new Date(slot.startTime)
      .getHours()
      .toString()
      .padStart(2, "0");
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(slot);
    return acc;
  }, {});

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      align={"center"}
      justify={"space-around"}
      p={"md"}
      gap={"md"}
    >
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
          <DatePicker {...form.getInputProps("date")} />
          <Select
            disabled={!data.workers.length}
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
            disabled={!data.workers.length}
            searchable
            label="Услуга"
            placeholder="Выберите услугу"
            data={data.services.map((service) => ({
              value: service.id,
              label: service.name,
            }))}
            {...form.getInputProps("serviceId")}
          />
          <Button
            disabled={
              !form.values.workerId || !form.values.serviceId || !selectedSlot
            }
            type="submit"
          >
            Записаться
          </Button>
        </Flex>
      </form>
      <Paper
        h="90vh"
        withBorder
        shadow="md"
        w="50%"
        p="md"
        style={{ overflow: "auto" }}
      >
        <Stack gap="md">
          <Text fw={600} size="lg">
            Выберите время
          </Text>

          {!form.values.workerId || !form.values.serviceId ? (
            <Text c="dimmed" ta="center" mt="xl">
              Выберите мастера и услугу для отображения свободных окон
            </Text>
          ) : spareWindows.isLoading ? (
            <Text c="dimmed" ta="center" mt="xl">
              Загрузка свободных окон...
            </Text>
          ) : !spareWindows.data?.length ? (
            <Text c="dimmed" ta="center" mt="xl">
              Нет свободных окон на выбранный день
            </Text>
          ) : (
            <>
              <Group gap="xs">
                <Badge variant="light" color="green" size="lg">
                  {spareWindows.data.length} свободных окон
                </Badge>
                <Badge variant="light" color="blue" size="lg">
                  {new Date(spareWindows.data[0].startTime).toLocaleDateString(
                    "ru-RU",
                    { day: "numeric", month: "long", weekday: "short" },
                  )}
                </Badge>
              </Group>

              {/* Группировка по часам */}
              {groupedSlots &&
                Object.entries(groupedSlots).map(([hour, slots]) => (
                  <div key={hour}>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon variant="light" color="gray" size="sm">
                        <IconClock size={14} />
                      </ThemeIcon>
                      <Text fw={500} size="sm">
                        {hour}:00
                      </Text>
                    </Group>

                    <SimpleGrid cols={3} spacing="xs" mb="md">
                      {slots.map((slot) => {
                        const startTime = new Date(slot.startTime);
                        const endTime = new Date(slot.endTime);
                        const isSelected =
                          selectedSlot?.startTime.getTime() ===
                          startTime.getTime();

                        return (
                          <UnstyledButton
                            key={startTime.toISOString()}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <Paper
                              withBorder
                              p="xs"
                              ta="center"
                              style={{
                                borderColor: isSelected
                                  ? "var(--mantine-color-green-6)"
                                  : undefined,

                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            >
                              <Text size="sm" fw={isSelected ? 600 : 400}>
                                {startTime.toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                              <Text size="xs" c="dimmed">
                                до{" "}
                                {endTime.toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                            </Paper>
                          </UnstyledButton>
                        );
                      })}
                    </SimpleGrid>
                  </div>
                ))}
            </>
          )}
        </Stack>
      </Paper>
    </Flex>
  );
};

export default ForClientsPage;
