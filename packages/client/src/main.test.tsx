// packages/client/src/main.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test/test-utils";
import App from "./App";

describe("App", () => {
  it("рендерит", () => {
    renderWithProviders(<App />);

    // Теперь правильный текст
    expect(screen.getByText("Добро пожаловать")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });
});