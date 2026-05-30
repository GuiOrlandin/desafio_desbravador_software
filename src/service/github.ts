import { isAxiosError } from "axios";
import api from "../api/axios";
import type { GitHubErrorBody, GitHubRepo, GitHubUser } from "../api/types";

export type GitHubErrorKind =
  | "not-found"
  | "rate-limit"
  | "network"
  | "forbidden"
  | "validation"
  | "unknown";

export type GitHubApiError = Error & {
  status: number;
  data: GitHubErrorBody | null;
  kind: GitHubErrorKind;
};

type ErrorContext = "user" | "repo";

type ErrorKindResolver =
  | GitHubErrorKind
  | ((apiMessage: string) => GitHubErrorKind);

const ERROR_KIND_BY_STATUS: Partial<Record<number, ErrorKindResolver>> = {
  0: "network",
  404: "not-found",
  422: "validation",
  403: (apiMessage) =>
    apiMessage.includes("rate limit") ? "rate-limit" : "forbidden",
};

function resolveErrorKind(
  status: number,
  data: GitHubErrorBody | null,
): GitHubErrorKind {
  const apiMessage = data?.message?.toLowerCase() ?? "";
  const resolver = ERROR_KIND_BY_STATUS[status] ?? "unknown";
  return typeof resolver === "string" ? resolver : resolver(apiMessage);
}

function createGitHubApiError(
  message: string,
  status: number,
  data: GitHubErrorBody | null = null,
  kind?: GitHubErrorKind,
): GitHubApiError {
  const error = new Error(message) as GitHubApiError;
  error.name = "GitHubApiError";
  error.status = status;
  error.data = data;
  error.kind = kind ?? resolveErrorKind(status, data);
  return error;
}

export function isGitHubApiError(error: unknown): error is GitHubApiError {
  return error instanceof Error && error.name === "GitHubApiError";
}

type ErrorMessageResolver = (
  context: ErrorContext,
  apiMessage: string,
) => string;

const ERROR_MESSAGES: Record<GitHubErrorKind, ErrorMessageResolver> = {
  "not-found": (context) =>
    context === "user"
      ? "Usuário não encontrado no GitHub."
      : "Repositório não encontrado no GitHub.",
  "rate-limit": () =>
    "Limite de requisições da API excedido (60/hora sem token). Aguarde alguns minutos ou configure VITE_GITHUB_TOKEN no arquivo .env.",
  network: () =>
    "Não foi possível conectar à API do GitHub. Verifique sua conexão com a internet.",
  forbidden: () => "Acesso negado pela API do GitHub.",
  validation: () => "Nome de usuário inválido.",
  unknown: (_, apiMessage) =>
    apiMessage || "Erro ao consultar a API do GitHub.",
};

function getErrorMessage(
  status: number,
  data: GitHubErrorBody | null,
  context: ErrorContext,
): string {
  const apiMessage = data?.message ?? "";
  const kind = resolveErrorKind(status, data);
  return ERROR_MESSAGES[kind](context, apiMessage);
}

function handleAxiosError(error: unknown, context: ErrorContext): never {
  if (isAxiosError<GitHubErrorBody>(error) && error.response) {
    const { status, data } = error.response;
    const body = data ?? null;
    throw createGitHubApiError(
      getErrorMessage(status, body, context),
      status,
      body,
    );
  }

  throw createGitHubApiError(
    getErrorMessage(0, null, context),
    0,
    null,
    "network",
  );
}

function parseLinkHeader(linkHeader?: string): Record<string, string> {
  if (!linkHeader) {
    return {};
  }

  return linkHeader.split(",").reduce<Record<string, string>>((links, part) => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      links[match[2]] = match[1];
    }
    return links;
  }, {});
}

export async function getUser(username: string): Promise<GitHubUser> {
  try {
    const { data } = await api.get<GitHubUser>(
      `/users/${encodeURIComponent(username)}`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error, "user");
  }
}

export type UserReposPage = {
  repos: GitHubRepo[];
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export async function getUserRepos(
  username: string,
  page = 1,
  perPage = 20,
): Promise<UserReposPage> {
  try {
    const { data, headers } = await api.get<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos`,
      { params: { per_page: perPage, page } },
    );

    const links = parseLinkHeader(headers.link);

    return {
      repos: data,
      page,
      perPage,
      hasNext: Boolean(links.next),
      hasPrev: Boolean(links.prev),
    };
  } catch (error) {
    handleAxiosError(error, "user");
  }
}

export async function getRepo(
  owner: string,
  repoName: string,
): Promise<GitHubRepo> {
  try {
    const { data } = await api.get<GitHubRepo>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error, "repo");
  }
}

export type { GitHubErrorBody, GitHubRepo, GitHubUser } from "../api/types";
