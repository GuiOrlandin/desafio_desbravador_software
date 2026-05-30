import { type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { REPOS_PER_PAGE } from "../../constants/repos";
import { REPO_SORT_OPTIONS, type RepoSortKey } from "../../utils/sortRepos";
import ErrorMessage from "../ErrorMessage";
import RepoCard from "../RepoCard";
import RepoPagination from "../RepoPagination";
import type { RepoListProps } from "./types";

function RepoList({
  repos,
  username,
  sortKey,
  onSortChange,
  page,
  totalPages,
  totalRepos,
  hasNext,
  hasPrev,
  onPageChange,
  loading = false,
  error = null,
  onRetryRepos,
}: RepoListProps) {
  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value as RepoSortKey);
  }

  const isEmpty = !loading && !error && repos.length === 0 && totalRepos === 0;

  return (
    <section className="app-card" aria-busy={loading}>
      <div className="app-card-body">
        <div className="app-section-header">
          <h2 className="app-section-title">
            Repositórios
            <span className="app-section-count ms-2">({totalRepos})</span>
          </h2>
          <div className="app-sort-control">
            <label
              htmlFor="repo-sort"
              className="form-label mb-0 small fw-semibold"
            >
              Ordenar por
            </label>
            <select
              id="repo-sort"
              className="form-select form-select-sm"
              value={sortKey}
              onChange={handleSortChange}
              disabled={loading || isEmpty || Boolean(error)}
            >
              {REPO_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="app-sort-hint small text-muted mb-3">
          A ordenação vale apenas para os repositórios desta página (até{" "}
          {REPOS_PER_PAGE} por página).
        </p>

        {error && (
          <ErrorMessage
            title={error.title}
            message={error.message}
            variant={error.variant}
            onRetry={onRetryRepos}
          />
        )}

        {loading && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <div className="spinner-border spinner-border-sm text-primary" />
            <span className="visually-hidden">Carregando repositórios…</span>
          </div>
        )}

        {isEmpty && (
          <p className="app-alert-empty mb-0" role="status">
            Este usuário não possui repositórios públicos.
          </p>
        )}

        {!loading && !error && repos.length > 0 && (
          <>
            <div className="d-md-none row row-cols-1 g-3">
              {repos.map((repo) => (
                <div key={repo.full_name} className="col">
                  <RepoCard repo={repo} username={username} />
                </div>
              ))}
            </div>

            <div className="d-none d-md-block app-table-wrap" tabIndex={0}>
              <table className="table app-table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col" className="text-end app-col-stars">
                      Estrelas
                    </th>
                    <th scope="col">Linguagem</th>
                    <th scope="col" className="text-end app-col-actions">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => {
                    const repoPath = `/user/${encodeURIComponent(username)}/repo/${encodeURIComponent(repo.name)}`;

                    return (
                      <tr key={repo.full_name}>
                        <td className="fw-semibold">{repo.name}</td>
                        <td className="text-muted small">
                          {repo.description ?? "Sem descrição."}
                        </td>
                        <td className="text-end app-col-stars">
                          <span className="app-badge app-badge-stars">
                            ★ {repo.stargazers_count.toLocaleString("pt-BR")}
                          </span>
                        </td>
                        <td>
                          {repo.language ? (
                            <span className="app-badge app-badge-lang">
                              {repo.language}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="text-end app-col-actions">
                          <div className="d-flex flex-wrap justify-content-end gap-2">
                            <Link
                              to={repoPath}
                              className="btn btn-outline-primary btn-sm"
                            >
                              Ver detalhes
                            </Link>
                            <a
                              href={repo.html_url}
                              className="btn btn-primary btn-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Ver no GitHub
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <RepoPagination
              page={page}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPageChange={onPageChange}
              loading={loading}
            />
          </>
        )}

        {!loading && !error && repos.length === 0 && totalRepos > 0 && (
          <p className="app-alert-empty mb-0" role="status">
            Nenhum repositório nesta página.
          </p>
        )}
      </div>
    </section>
  );
}

export default RepoList;
