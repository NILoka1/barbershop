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
import { useForm, schemaResolver } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { formCreateBookingSchema } from "shared";
import { trpc } from "src/api/client";
import { useCreateBookingForClients } from "src/api/forClient/create";

const ForClientsPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      workerId: null as string | null,
      serviceId: null as string | null,
      date: dayjs().format("YYYY-MM-DD"),
    },
    validate: schemaResolver(formCreateBookingSchema),
  });

  const { data } = trpc.forClients.getData.useQuery(
    { date: new Date(form.values.date).toISOString() },
    { enabled: !!form.values.date },
  );

  const spareWindows = trpc.forClients.getSpareWindows.useQuery(
    {
      workerId: form.values.workerId!,
      serviceId: form.values.serviceId!,
      date: form.values.date,
    },
    {
      enabled:
        !!form.values.workerId && !!form.values.serviceId && !!form.values.date,
      staleTime: 30_000,
    },
  );

  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: Date;
    endTime: Date;
  } | null>(null);

  const create = useCreateBookingForClients({ date: form.values.date });

  const groupedSlots = useMemo(() => {
    if (!spareWindows.data) return null;

    return spareWindows.data.reduce<Record<string, typeof spareWindows.data>>(
      (acc, slot) => {
        const hour = new Date(slot.startTime)
          .getHours()
          .toString()
          .padStart(2, "0");
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(slot);
        return acc;
      },
      {},
    );
  }, [spareWindows.data]);

  const handleSubmit = (values: typeof form.values) => {
    if (!selectedSlot || !values.workerId || !values.serviceId) return;

    create.mutate({
      name: values.name,
      phone: values.phone,
      workerId: values.workerId,
      serviceId: values.serviceId,
      startTime: selectedSlot.startTime.toISOString(),
      endTime: selectedSlot.endTime.toISOString(),
    });
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="space-around"
      p="md"
      gap="md"
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ width: "45%", maxWidth: 400 }}
      >
        <Flex gap="md" direction="column">
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
          <DatePicker minDate={new Date()} {...form.getInputProps("date")} />
          <Select
            searchable
            label="Работник"
            placeholder="Выберите работника"
            data={
              data?.workers.map((w) => ({ value: w.id, label: w.name })) ?? []
            }
            {...form.getInputProps("workerId")}
          />
          <Select
            searchable
            label="Услуга"
            placeholder="Выберите услугу"
            data={
              data?.services.map((s) => ({ value: s.id, label: s.name })) ?? []
            }
            {...form.getInputProps("serviceId")}
          />
          <Button
            disabled={
              !form.values.workerId || !form.values.serviceId || !selectedSlot
            }
            type="submit"
            loading={create.isPending}
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
              Выберите мастера и услугу
            </Text>
          ) : spareWindows.isLoading ? (
            <Text c="dimmed" ta="center" mt="xl">
              Загрузка...
            </Text>
          ) : !spareWindows.data?.length ? (
            <Text c="dimmed" ta="center" mt="xl">
              Нет свободных окон
            </Text>
          ) : (
            <>
              <Group gap="xs">
                <Badge variant="light" color="green" size="lg">
                  {spareWindows.data.length} окон
                </Badge>
              </Group>

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
                      {slots.map((slot) => (
                        <UnstyledButton
                          key={slot.startTime.toISOString()}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <Paper
                            withBorder
                            p="xs"
                            ta="center"
                            style={{
                              borderColor:
                                selectedSlot?.startTime.getTime() ===
                                new Date(slot.startTime).getTime()
                                  ? "var(--mantine-color-green-6)"
                                  : undefined,
                              cursor: "pointer",
                            }}
                          >
                            <Flex justify={"space-between"} align={"center"}>
                              <Text size="sm">
                                {slot.startTime.toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                              <Text size="xs" c="dimmed">
                                до{" "}
                                {slot.endTime.toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                            </Flex>
                          </Paper>
                        </UnstyledButton>
                      ))}
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
