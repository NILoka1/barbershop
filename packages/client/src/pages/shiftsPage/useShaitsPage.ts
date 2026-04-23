import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { ShiftFromDB } from "shared";
import { trpc } from "src/main";


export const useShiftsPage = () => {
  const [selected, setSelected] = useState<Date | null>(new Date());


  const { data: shifts } = trpc.shifts.getInDateRange.useQuery({
    startDate: dayjs(selected).startOf("month").toISOString(),
    endDate: dayjs(selected).endOf("month").toISOString(),
  });

  const handleDateChange = (date: string) => {
    setSelected(dayjs(date).toDate());
  };

  const dayDetail: ShiftFromDB[] = useMemo(() => {
    if (!shifts || !selected) return [];
    
    return shifts.filter((shift) =>
      dayjs(shift.startTime).isSame(selected, 'day')
    );
  }, [shifts, selected]);


  return { selected, dayDetail, handleDateChange };
};
