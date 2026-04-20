import { Button, Flex, Text } from "@mantine/core";
import {  useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate();
  return (
    <Flex h={"100vh"}>
      <Text>Добро пожаловать</Text>
      <Button onClick={() => navigate("/login")}>Войти</Button>
    </Flex>
  );
};
