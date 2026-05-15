import { Flex, Paper, Select, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import { trpc } from "src/api/client";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsPage = () => {
  const isAdmin =
    trpc.auth.me.useQuery().data?.isAdmin ||
    localStorage.getItem("isAdmin") === "true";

  const workers = trpc.workers.getAll.useQuery().data;
  const [selectedWorker, setSelectedWorker] = React.useState<string | null>(
    isAdmin ? null : localStorage.getItem("workerId"),
  );

  const [value, setValue] = useState<string | null>(dayjs().year().toString());
  const { data } = trpc.analytics.getAnalytics.useQuery({
    startDate: dayjs(value).startOf("year").toISOString(),
    endDate: dayjs(value).endOf("year").toISOString(),
    workerId: selectedWorker || undefined,
  });

  if (!data || !workers) {
    return <Text>Загрузка...</Text>;
  }
  if (data.months.length === 0) {
    return <Text>Нет данных для отображения.</Text>;
  }
  return (
    <Flex w={"100%"} h={"100%"} gap={"md"}>
      <Stack>
        <Text>Аналитика</Text>
        <Select
          label="Выберите год"
          placeholder="Год"
          data={Array.from({ length: 10 }, (_, i) => ({
            value: (new Date().getFullYear() - i).toString(),
            label: (new Date().getFullYear() - i).toString(),
          }))}
          value={value}
          onChange={setValue}
        />
        {isAdmin && (
          <Select
            label="Работник"
            placeholder="Выберите работника"
            data={workers.map((worker) => ({
              value: worker.id,
              label: worker.name,
            }))}
            value={selectedWorker}
            onChange={setSelectedWorker}
          />
        )}
      </Stack>
      <Paper withBorder shadow="md" w="100%" h="100%" p="md">
        <AnalyticsCard {...data.summary} bookings={data.months} />
      </Paper>
    </Flex>
  );
};

export default AnalyticsPage;
