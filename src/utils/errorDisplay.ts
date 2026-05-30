import {
  isGitHubApiError,
  type GitHubApiError,
  type GitHubErrorKind,
} from "../service/github";

export type ErrorVariant = "error" | "rate-limit" | "network";

export type ErrorDisplay = {
  title: string;
  message: string;
  variant: ErrorVariant;
  showHomeLink: boolean;
};

type Page = "user" | "repo";

const ERROR_VARIANTS: Record<GitHubErrorKind, ErrorVariant> = {
  "not-found": "error",
  "rate-limit": "rate-limit",
  network: "network",
  forbidden: "error",
  validation: "error",
  unknown: "error",
};

const ERROR_TITLES: Record<GitHubErrorKind, string | Record<Page, string>> = {
  "not-found": {
    user: "Usuário não encontrado",
    repo: "Repositório não encontrado",
  },
  "rate-limit": "Limite de requisições excedido",
  network: "Sem conexão",
  forbidden: "Acesso negado",
  validation: "Algo deu errado",
  unknown: "Algo deu errado",
};

function errorTitle(kind: GitHubErrorKind, page: Page): string {
  const title = ERROR_TITLES[kind];
  return typeof title === "string" ? title : title[page];
}

function fromApiError(
  error: GitHubApiError,
  page: "user" | "repo",
  message?: string,
): ErrorDisplay {
  return {
    title: errorTitle(error.kind, page),
    message: message ?? error.message,
    variant: ERROR_VARIANTS[error.kind],
    showHomeLink: true,
  };
}

function unexpectedError(message: string): ErrorDisplay {
  return {
    title: "Erro inesperado",
    message,
    variant: "error",
    showHomeLink: true,
  };
}

export function toUserPageError(err: unknown, username?: string): ErrorDisplay {
  if (!isGitHubApiError(err)) {
    return unexpectedError("Erro ao carregar dados do usuário.");
  }

  if (err.kind === "not-found" && username) {
    return fromApiError(
      err,
      "user",
      `Não encontramos o usuário "@${username}" no GitHub. Verifique o nome e tente novamente.`,
    );
  }

  return fromApiError(err, "user");
}

export function toRepoPageError(
  err: unknown,
  username?: string,
  repoName?: string,
): ErrorDisplay {
  if (!isGitHubApiError(err)) {
    return unexpectedError("Erro ao carregar dados do repositório.");
  }

  if (err.kind === "not-found" && username && repoName) {
    return fromApiError(
      err,
      "repo",
      `O repositório "${repoName}" não existe no perfil de @${username} ou não é público.`,
    );
  }

  return fromApiError(err, "repo");
}

export function toValidationError(message: string): ErrorDisplay {
  return {
    title: "Dados inválidos",
    message,
    variant: "error",
    showHomeLink: true,
  };
}
