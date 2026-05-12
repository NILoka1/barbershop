import { Flex, Paper, Text } from "@mantine/core";
import React from "react";
import { trpc } from "src/api/client";
import CalendarShiftsHeader from "./CalendarShiftsHeader";
import CalendarShifts from "./CalendarShifts";
import dayjs from "dayjs";
import CalendarShiftsMenu from "./CalendarShiftsMenu";

const CalendarShiftsPage = () => {
  const workers = trpc.workers.getAll.useQuery().data;
  const [selectedWorker, setSelectedWorker] = React.useState<string | null>(
    workers?.[0]?.id ?? null,
  );

  const [selected, setSelected] = React.useState<Date>(new Date());

  const [selectedDate, setSelectedDate] = React.useState<string>(
    dayjs().toISOString(),
  );

  const shifts = trpc.shifts.getInDateRangeToCalendar.useQuery({
    startDate: dayjs(selectedDate).startOf("month").toISOString(),
    endDate: dayjs(selectedDate).endOf("month").toISOString(),
    id: selectedWorker || "",
  }).data;

  if (!workers) {
    return <Text>Нет работников</Text>;
  }
  return (
    <>
      <Flex direction="column" h="100%" w="100%" p="md" gap={10}>
        <CalendarShiftsHeader
          workers={workers}
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
        />
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ base: "center", sm: "flex-start" }}
          h="100%"
        >
          <CalendarShifts
            setSelectedDate={setSelectedDate}
            selected={selected}
            setSelected={setSelected}
            shifts={shifts}
          />
          <Flex w={{ base: "90%", sm: "40%" }} h={"100%"}>
            <Paper withBorder shadow="md" w="100%" h="100%" p="md">
              <CalendarShiftsMenu
                workerId={selectedWorker || ""}
                date={selected}
              />
            </Paper>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default CalendarShiftsPage;
