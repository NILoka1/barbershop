// packages/client/src/main.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "src/test/test-utils";
import App from "src/App";

describe("App", () => {
  it("рендерит", () => {
    renderWithProviders(<App />);

    expect(screen.getByText("Добро пожаловать")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });
});