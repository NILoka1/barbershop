import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import type { ShiftFromDB } from "shared";
import { trpc } from "src/main";

export const useShiftsPage = () => {
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: dayjs().startOf("month").toISOString(),
    endDate: dayjs().endOf("month").toISOString(),
  });

  const handleDateChange = useCallback((date: string) => {
    setCurrentMonth({
      startDate: dayjs(date).startOf("month").toISOString(),
      endDate: dayjs(date).endOf("month").toISOString(),
    });
  }, []);

  const handleSetSelected = useCallback((date: Date | null) => {
    setSelected(date);
  }, []);

  const { data: shifts } = trpc.shifts.getInDateRange.useQuery(currentMonth);

  const dayDetail: ShiftFromDB[] = useMemo(() => {
    if (!shifts || !selected) return [];

    return shifts.filter((shift) =>
      dayjs(shift.startTime).isSame(selected, "day"),
    );
  }, [shifts, selected]);

  return {
    selected,
    currentMonth,
    handleDateChange,
    dayDetail,
    handleSetSelected,
  };
};
