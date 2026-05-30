import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setupPageRender } from "../../test/test-utils";
import HomePage from "./index";

describe("HomePage", () => {
  setupPageRender(<HomePage />);

  it("renderiza título e descrição da página inicial", () => {
    expect(screen.getByText("Desafio Desbravador")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /explore perfis no github/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/busque um usuário para ver avatar, bio, seguidores/i),
    ).toBeInTheDocument();
  });

  it("renderiza o formulário de busca", () => {
    expect(screen.getByLabelText(/usuário do github/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });
});
