import { Flex, SegmentedControl } from "@mantine/core";
import { DatePicker, MonthPicker, YearPicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

type DateMode = "day" | "month" | "year";

export const useDateModal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<DateMode>("day");
  const openDateModal = () => {
    let tempDate: Date = selectedDate;
    let tempMode: DateMode = mode;

    const ModalContent = () => {
      const [innerDate, setInnerDate] = useState<Date>(tempDate);
      const [innerMode, setInnerMode] = useState<DateMode>(tempMode);

      React.useEffect(() => {
        tempDate = innerDate;
        tempMode = innerMode;
      }, [innerDate, innerMode]);

      return (
        <>
          <SegmentedControl
            value={innerMode}
            onChange={(value) => setInnerMode(value as DateMode)}
            data={[
              { label: "День", value: "day" },
              { label: "Месяц", value: "month" },
              { label: "Год", value: "year" },
            ]}
            mb="md"
            fullWidth
          />
          <Flex justify={"center"}>
            {innerMode === "day" && (
              <DatePicker
                value={innerDate}
                onChange={(date) => date && setInnerDate(new Date(date))}
              />
            )}

            {innerMode === "month" && (
              <MonthPicker
                value={innerDate}
                onChange={(date) => date && setInnerDate(new Date(date))}
              />
            )}

            {innerMode === "year" && (
              <YearPicker
                value={innerDate}
                onChange={(date) => date && setInnerDate(new Date(date))}
              />
            )}
          </Flex>
        </>
      );
    };

    modals.openConfirmModal({
      title: "Выберите дату",
      size: "sm",
      children: <ModalContent />,
      labels: { confirm: "Выбрать", cancel: "Отмена" },
      onConfirm: () => {
        setSelectedDate(tempDate);
        setMode(tempMode);
      },
    });
  };

  const formatDate = () => {
    const d = dayjs(selectedDate);
    if (mode === "day") return d.format("DD.MM.YYYY");
    if (mode === "month") return d.format("MMMM YYYY");
    return d.format("YYYY");
  };

  const getDateRange = useCallback(() => {
    return {
      startDate: dayjs(selectedDate).startOf(mode).toISOString(),
      endDate: dayjs(selectedDate).endOf(mode).toISOString(),
    };
  }, [selectedDate, mode]);

  return { openDateModal, formatDate, getDateRange };
};
