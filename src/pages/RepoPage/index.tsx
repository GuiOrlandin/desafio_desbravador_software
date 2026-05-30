import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { githubUsernameSchema } from "../../schemas/githubUsername";
import { getRepo } from "../../service/github";
import {
  toRepoPageError,
  toValidationError,
  type ErrorDisplay,
} from "../../utils/errorDisplay";
import type { RepoPageParams } from "./types";

function RepoPage() {
  const { username, repoName } = useParams<RepoPageParams>();

  const validationError = useMemo((): ErrorDisplay | null => {
    if (!username || !repoName) {
      return toValidationError("Repositório inválido.");
    }

    const usernameValidation = githubUsernameSchema.safeParse(username);
    if (!usernameValidation.success) {
      return toValidationError(
        usernameValidation.error.issues[0]?.message ??
          "Nome de usuário inválido.",
      );
    }

    if (!repoName.trim()) {
      return toValidationError("Nome do repositório inválido.");
    }

    return null;
  }, [username, repoName]);

  const isValidParams = validationError === null && !!username && !!repoName;

  const repoQuery = useQuery({
    queryKey: ["github-repo", username, repoName],
    queryFn: () => getRepo(username!, repoName!),
    enabled: isValidParams,
  });

  const repoError = repoQuery.error
    ? toRepoPageError(repoQuery.error, username, repoName)
    : null;

  const repo = repoQuery.data;

  if (validationError) {
    return (
      <ErrorMessage
        title={validationError.title}
        message={validationError.message}
        variant={validationError.variant}
        showHomeLink={validationError.showHomeLink}
      >
        {username && (
          <Link
            to={`/user/${encodeURIComponent(username)}`}
            className="btn btn-sm btn-outline-secondary"
          >
            Voltar para @{username}
          </Link>
        )}
      </ErrorMessage>
    );
  }

  if (repoQuery.isPending) {
    return (
      <LoadingSpinner
        label={`Carregando repositório ${username}/${repoName}...`}
      />
    );
  }

  if (repoQuery.isError) {
    const display =
      repoError ??
      toRepoPageError(
        new Error("Erro ao carregar dados do repositório."),
        username,
        repoName,
      );
    return (
      <ErrorMessage
        title={display.title}
        message={display.message}
        variant={display.variant}
        showHomeLink={display.showHomeLink}
        onRetry={() => void repoQuery.refetch()}
      >
        {username && (
          <Link
            to={`/user/${encodeURIComponent(username)}`}
            className="btn btn-sm btn-outline-secondary"
          >
            Voltar para @{username}
          </Link>
        )}
      </ErrorMessage>
    );
  }

  if (!repo || !username) {
    return (
      <ErrorMessage
        title="Repositório não encontrado"
        message="Não foi possível carregar os detalhes deste repositório."
        showHomeLink
      >
        {username && (
          <Link
            to={`/user/${encodeURIComponent(username)}`}
            className="btn btn-sm btn-outline-secondary"
          >
            Voltar para @{username}
          </Link>
        )}
      </ErrorMessage>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <Link
          to={`/user/${encodeURIComponent(username)}`}
          className="app-back-link"
        >
          ← Voltar para @{username}
        </Link>

        <nav aria-label="breadcrumb" className="app-breadcrumb mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={`/user/${encodeURIComponent(username)}`}>
                {username}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {repo.name}
            </li>
          </ol>
        </nav>

        <article className="app-card">
          <div className="app-card-body">
            <p className="text-muted small mb-1 fw-semibold text-uppercase">
              Repositório
            </p>
            <h1
              className="h2 fw-bold mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              {repo.name}
            </h1>
            <p className="text-muted mb-4 fs-6">
              {repo.description ?? "Sem descrição."}
            </p>

            <dl className="app-detail-grid">
              <div className="app-detail-item">
                <dt>Estrelas</dt>
                <dd>★ {repo.stargazers_count.toLocaleString("pt-BR")}</dd>
              </div>
              <div className="app-detail-item">
                <dt>Linguagem</dt>
                <dd>{repo.language ?? "Não informada"}</dd>
              </div>
            </dl>

            <a
              href={repo.html_url}
              className="btn btn-primary btn-lg w-100 app-btn-responsive"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no GitHub
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

export default RepoPage;
