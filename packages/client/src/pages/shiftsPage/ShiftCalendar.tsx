import { Flex } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import React from "react";

interface ShiftCalendarProps {
  handleDateChange: (date: string) => void;
  selected: Date | null;
  setSelected: (value: Date | null) => void;
}

const ShiftCalendar = React.memo(
  ({ handleDateChange, selected, setSelected }: ShiftCalendarProps) => {
    return (
      <Flex w={{ base: "90%", xs: "60%", sm: "60%" }} maw={650}>
        <Calendar
          fullWidth
          onDateChange={handleDateChange} 
          onMonthSelect={handleDateChange}
          getDayProps={(date) => ({
            selected: selected ? dayjs(date).isSame(selected, "day") : false,
            onClick: () => setSelected(dayjs(date).toDate()),
          })}
        />
      </Flex>
    );
  },
);

export default ShiftCalendar;
