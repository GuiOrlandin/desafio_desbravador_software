import { Link } from "react-router-dom";
import type { RepoCardProps } from "./types";

function RepoCard({ repo, username }: RepoCardProps) {
  const repoPath = `/user/${encodeURIComponent(username)}/repo/${encodeURIComponent(repo.name)}`;

  return (
    <article className="app-card app-repo-card h-100">
      <div className="app-card-body d-flex flex-column h-100">
        <h3 className="h6 card-title text-primary mb-2">{repo.name}</h3>
        <p className="card-text text-muted small mb-3 flex-grow-1">
          {repo.description ?? "Sem descrição."}
        </p>
        <div className="app-repo-meta mb-3">
          <span className="app-badge app-badge-stars">
            ★ {repo.stargazers_count.toLocaleString("pt-BR")}
          </span>
          {repo.language && (
            <span className="app-badge app-badge-lang">{repo.language}</span>
          )}
        </div>
        <div className="d-grid gap-2 mt-auto">
          <Link to={repoPath} className="btn btn-outline-primary btn-sm">
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
      </div>
    </article>
  );
}

export default RepoCard;
