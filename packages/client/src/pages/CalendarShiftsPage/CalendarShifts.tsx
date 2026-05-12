import { Flex, Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import React from "react";
import type { Shift } from "shared";

interface CalendarShiftsProps {
  selected: Date;
  setSelected: (date: Date) => void;
  setSelectedDate: (date: string) => void;
  shifts: Shift[] | undefined;
}

const CalendarShifts = React.memo(
  ({ selected, setSelected, setSelectedDate, shifts }: CalendarShiftsProps) => {
    return (
      <Flex w={{ base: "90%", xs: "60%", sm: "60%" }} maw={650}>
        <Calendar
          fullWidth
          onDateChange={(date) => setSelectedDate(dayjs(date).toISOString())}
          getDayProps={(date) => ({
            selected: selected ? dayjs(date).isSame(selected, "day") : false,
            onClick: () => setSelected(dayjs(date).toDate()),
          })}
          renderDay={(date) => {
            const day = dayjs(date).date();
            return (
              <Indicator
                size={6}
                color="red"
                offset={-2}
                disabled={
                  !shifts ||
                  !shifts.some((shift) =>
                    dayjs(shift.startTime).isSame(date, "day"),
                  )
                }
              >
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
      </Flex>
    );
  },
);

export default CalendarShifts;
