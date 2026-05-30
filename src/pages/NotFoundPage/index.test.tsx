import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setupPageRender } from "../../test/test-utils";
import NotFoundPage from "./index";

describe("NotFoundPage", () => {
  setupPageRender(<NotFoundPage />);

  it("renderiza mensagem de página não encontrada", () => {
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /página não encontrada/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/o endereço acessado não existe/i),
    ).toBeInTheDocument();
  });

  it("renderiza busca e link para a página inicial", () => {
    expect(screen.getByLabelText(/usuário do github/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ir para o início/i }),
    ).toHaveAttribute("href", "/");
  });
});
