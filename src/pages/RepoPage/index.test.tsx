import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as githubService from "../../service/github";
import { createGitHubApiError } from "../../service/github";
import { mockRepo } from "../../test/mocks/github";
import { setupPageRender } from "../../test/test-utils";
import RepoPage from "./index";

vi.mock("../../service/github", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../service/github")>();
  return {
    ...actual,
    getRepo: vi.fn(),
  };
});

const repoPageRoutes = (
  <Routes>
    <Route path="/user/:username/repo/:repoName" element={<RepoPage />} />
  </Routes>
);

describe("RepoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parâmetros inválidos", () => {
    setupPageRender(repoPageRoutes, {
      routerProps: {
        initialEntries: ["/user/invalid user/repo/Hello-World"],
      },
    });

    it("exibe erro de validação", async () => {
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Dados inválidos")).toBeInTheDocument();
      expect(vi.mocked(githubService.getRepo)).not.toHaveBeenCalled();
    });
  });

  describe("carregando repositório", () => {
    beforeEach(() => {
      vi.mocked(githubService.getRepo).mockReturnValue(new Promise(() => {}));
    });

    setupPageRender(repoPageRoutes, {
      routerProps: {
        initialEntries: ["/user/octocat/repo/Hello-World"],
      },
    });

    it("exibe loading", () => {
      expect(
        screen.getByText(/carregando repositório octocat\/hello-world/i),
      ).toBeInTheDocument();
      expect(vi.mocked(githubService.getRepo)).toHaveBeenCalledWith(
        "octocat",
        "Hello-World",
      );
    });
  });

  describe("repositório carregado com sucesso", () => {
    beforeEach(() => {
      vi.mocked(githubService.getRepo).mockResolvedValue(mockRepo);
    });

    setupPageRender(repoPageRoutes, {
      routerProps: {
        initialEntries: ["/user/octocat/repo/Hello-World"],
      },
    });

    it("renderiza detalhes do repositório", async () => {
      expect(
        await screen.findByRole("heading", { name: "Hello-World" }),
      ).toBeInTheDocument();
      expect(screen.getByText("My first repo")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /ver no github/i }),
      ).toHaveAttribute("href", "https://github.com/octocat/Hello-World");
      expect(
        screen.getByRole("link", { name: /voltar para @octocat/i }),
      ).toHaveAttribute("href", "/user/octocat");
    });
  });

  describe("repositório não encontrado", () => {
    beforeEach(() => {
      vi.mocked(githubService.getRepo).mockRejectedValue(
        createGitHubApiError(
          "Repositório não encontrado no GitHub.",
          404,
          null,
          "not-found",
        ),
      );
    });

    setupPageRender(repoPageRoutes, {
      routerProps: {
        initialEntries: ["/user/octocat/repo/Hello-World"],
      },
    });

    it("exibe erro", async () => {
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText("Repositório não encontrado"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/o repositório "Hello-World" não existe/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /voltar para @octocat/i }),
      ).toHaveAttribute("href", "/user/octocat");
    });
  });

  describe("erro na requisição", () => {
    beforeEach(() => {
      vi.mocked(githubService.getRepo)
        .mockRejectedValueOnce(
          createGitHubApiError(
            "Erro ao consultar a API do GitHub.",
            500,
            null,
            "unknown",
          ),
        )
        .mockResolvedValueOnce(mockRepo);
    });

    setupPageRender(repoPageRoutes, {
      routerProps: {
        initialEntries: ["/user/octocat/repo/Hello-World"],
      },
    });

    it("permite tentar novamente", async () => {
      expect(await screen.findByText("Algo deu errado")).toBeInTheDocument();

      screen.getByRole("button", { name: /tentar novamente/i }).click();

      await waitFor(() => {
        expect(vi.mocked(githubService.getRepo)).toHaveBeenCalledTimes(2);
      });

      expect(
        await screen.findByRole("heading", { name: "Hello-World" }),
      ).toBeInTheDocument();
    });
  });
});
