import { Flex } from "@mantine/core";
import { Calendar } from "@mantine/dates";

export const ShiftsPage = () => {
  return (
    <>
      <Flex w={"100%"} h={"100%"}>
        <Calendar
          style={{ flex: 1 }}
          styles={{
            calendarHeader: {width: '100%'},
            levelsGroup: {width: '100%'}
          }}
        />
      </Flex>
    </>
  );
};
