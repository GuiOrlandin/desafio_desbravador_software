import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as githubService from "../../service/github";
import { createGitHubApiError } from "../../service/github";
import { mockUser, mockUserReposPage } from "../../test/mocks/github";
import { setupPageRender } from "../../test/test-utils";
import UserPage from "./index";

vi.mock("../../service/github", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../service/github")>();
  return {
    ...actual,
    getUser: vi.fn(),
    getUserRepos: vi.fn(),
  };
});

const userPageRoutes = (
  <Routes>
    <Route path="/user/:username" element={<UserPage />} />
  </Routes>
);

describe("UserPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("username inválido", () => {
    setupPageRender(userPageRoutes, {
      routerProps: { initialEntries: ["/user/invalid user"] },
    });

    it("exibe erro de validação", async () => {
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Dados inválidos")).toBeInTheDocument();
      expect(vi.mocked(githubService.getUser)).not.toHaveBeenCalled();
      expect(vi.mocked(githubService.getUserRepos)).not.toHaveBeenCalled();
    });
  });

  describe("carregando perfil", () => {
    beforeEach(() => {
      vi.mocked(githubService.getUser).mockReturnValue(new Promise(() => {}));
    });

    setupPageRender(userPageRoutes, {
      routerProps: { initialEntries: ["/user/octocat"] },
    });

    it("exibe loading enquanto carrega o perfil", () => {
      expect(
        screen.getByText(/carregando perfil de octocat/i),
      ).toBeInTheDocument();
      expect(vi.mocked(githubService.getUser)).toHaveBeenCalledWith("octocat");
    });
  });

  describe("perfil carregado com sucesso", () => {
    beforeEach(() => {
      vi.mocked(githubService.getUser).mockResolvedValue(mockUser);
      vi.mocked(githubService.getUserRepos).mockResolvedValue(
        mockUserReposPage,
      );
    });

    setupPageRender(userPageRoutes, {
      routerProps: { initialEntries: ["/user/octocat"] },
    });

    it("renderiza perfil e repositórios", async () => {
      expect(await screen.findByText("@octocat")).toBeInTheDocument();
      expect(screen.getByText("GitHub mascot")).toBeInTheDocument();
      expect(screen.getAllByText("Hello-World").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Spoon-Knife").length).toBeGreaterThan(0);

      expect(vi.mocked(githubService.getUser)).toHaveBeenCalledWith("octocat");
      expect(vi.mocked(githubService.getUserRepos)).toHaveBeenCalledWith(
        "octocat",
        1,
        20,
      );
    });
  });

  describe("usuário não encontrado", () => {
    beforeEach(() => {
      vi.mocked(githubService.getUser).mockRejectedValue(
        createGitHubApiError(
          "Usuário não encontrado no GitHub.",
          404,
          null,
          "not-found",
        ),
      );
    });

    setupPageRender(userPageRoutes, {
      routerProps: { initialEntries: ["/user/octocat"] },
    });

    it("exibe erro", async () => {
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Usuário não encontrado")).toBeInTheDocument();
      expect(
        screen.getByText(/não encontramos o usuário "@octocat"/i),
      ).toBeInTheDocument();
    });
  });

  describe("erro ao buscar repositórios", () => {
    beforeEach(() => {
      vi.mocked(githubService.getUser).mockResolvedValue(mockUser);
      vi.mocked(githubService.getUserRepos)
        .mockRejectedValueOnce(
          createGitHubApiError(
            "Erro ao consultar a API do GitHub.",
            500,
            null,
            "unknown",
          ),
        )
        .mockResolvedValueOnce(mockUserReposPage);
    });

    setupPageRender(userPageRoutes, {
      routerProps: { initialEntries: ["/user/octocat"] },
    });

    it("permite tentar novamente", async () => {
      expect(await screen.findByText("@octocat")).toBeInTheDocument();
      expect(await screen.findByText("Algo deu errado")).toBeInTheDocument();

      screen.getByRole("button", { name: /tentar novamente/i }).click();

      await waitFor(() => {
        expect(vi.mocked(githubService.getUserRepos)).toHaveBeenCalledTimes(2);
      });

      expect(
        await screen.findByRole("heading", { name: "Hello-World" }),
      ).toBeInTheDocument();
    });
  });
});
