import { Flex, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";

export const ShiftsPage = () => {
  return (
    <>
      <Flex direction={{base:'column', sm:"row"}} justify={{ base: "flex-start", sm: "flex-start" }} align={{base: 'center', sm:"flex-start"}} h={"100%"}>
        <Flex w={{ base: "90%", xs: "60%", sm: "60%" }} maw={650}>
          <Calendar fullWidth />
        </Flex>
        <Flex w={{ base: "90%", sm: "40%" }}>
          <Text fw={"90"}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat at dolorum aut consectetur perspiciatis quidem magnam voluptatibus architecto corrupti sunt, esse dolorem doloribus eum earum velit voluptates vero nostrum placeat.
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
