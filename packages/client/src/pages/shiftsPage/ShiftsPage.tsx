import { Flex } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useShiftsPage } from "./useShaitsPage";
import { ShiftMenu } from "./ShiftMenu";

export const ShiftsPage = () => {
  const { selected, currentMonth, handleDateChange, dayDetail, setSelected } =
    useShiftsPage();

  return (
    <>
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "center", sm: "flex-start" }}
        h="100%"
      >
        <Flex w={{ base: "90%", xs: "60%", sm: "60%" }} maw={650}>
          <Calendar
            fullWidth
            defaultDate={currentMonth}
            onDateChange={handleDateChange}
            getDayProps={(date) => ({
              selected: selected ? dayjs(date).isSame(selected, "day") : false,
              onClick: () => setSelected(dayjs(date).toDate()), // 👈 меняет выбранный день
            })}
          />
        </Flex>
        <Flex w={{ base: "90%", sm: "40%" }} h={"100%"}>
          <ShiftMenu dayDatail={dayDetail} selected={selected} />
        </Flex>
      </Flex>
    </>
  );
};
