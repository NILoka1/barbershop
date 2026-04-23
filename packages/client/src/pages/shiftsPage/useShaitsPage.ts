import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { ShiftFromDB } from "shared";
import { trpc } from "src/main";

export const useShiftsPage = () => {
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // 👈 НОВОЕ

  const handleDateChange = (date: string) => {
    setCurrentMonth(dayjs(date).toDate()); // 👈 меняем месяц для запроса
  };

  const { data: shifts } = trpc.shifts.getInDateRange.useQuery({
    startDate: dayjs(currentMonth).startOf("month").toISOString(), // 👈 currentMonth
    endDate: dayjs(currentMonth).endOf("month").toISOString(),
  });

  const dayDetail: ShiftFromDB[] = useMemo(() => {
    if (!shifts || !selected) return [];

    return shifts.filter((shift) =>
      dayjs(shift.startTime).isSame(selected, "day"),
    );
  }, [shifts, selected]);

  return { selected, currentMonth, handleDateChange, dayDetail, setSelected };
};
