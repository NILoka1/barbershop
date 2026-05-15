import { Flex, Paper, Stack, Text } from "@mantine/core";
import { YearPicker } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useState } from "react";
import { trpc } from "src/api/client";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsPage = () => {
  const [value, setValue] = useState<string | null>(new Date().toISOString());
  const { data } = trpc.analytics.getAnalytics.useQuery({
    startDate: dayjs(value).startOf("year").toISOString(),
    endDate: dayjs(value).endOf("year").toISOString(),
  });

  if (!data) {
    return <Text>Загрузка...</Text>;
  }
  if (data.months.length === 0) {
    return <Text>Нет данных для отображения.</Text>;
  }
  return (
    <Flex w={"100%"} h={"100%"} gap={"md"}>
      <Stack>
        <Text>Аналитика</Text>
        <YearPicker value={value} onChange={setValue} />
      </Stack>
      <Paper withBorder shadow="md" w="100%" h="100%" p="md">
        <AnalyticsCard {...data.summary} bookings={data.months} />
      </Paper>
    </Flex>
  );
};

export default AnalyticsPage;
