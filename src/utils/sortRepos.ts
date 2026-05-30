import type { GitHubRepo } from "../api/types";

export type RepoSortKey =
  | "stars-desc"
  | "stars-asc"
  | "name-asc"
  | "name-desc"
  | "updated-desc"
  | "forks-desc";

export const REPO_SORT_OPTIONS: { value: RepoSortKey; label: string }[] = [
  { value: "stars-desc", label: "Estrelas (maior → menor)" },
  { value: "stars-asc", label: "Estrelas (menor → maior)" },
  { value: "name-asc", label: "Nome (A → Z)" },
  { value: "name-desc", label: "Nome (Z → A)" },
  { value: "updated-desc", label: "Atualização (mais recente)" },
  { value: "forks-desc", label: "Forks (maior → menor)" },
];

type RepoComparator = (a: GitHubRepo, b: GitHubRepo) => number;

const REPO_SORT_COMPARATORS: Record<RepoSortKey, RepoComparator> = {
  "stars-desc": (a, b) => b.stargazers_count - a.stargazers_count,
  "stars-asc": (a, b) => a.stargazers_count - b.stargazers_count,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "updated-desc": (a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  "forks-desc": (a, b) => b.forks_count - a.forks_count,
};

export function sortRepos(
  repos: GitHubRepo[],
  sortKey: RepoSortKey,
): GitHubRepo[] {
  return [...repos].sort(REPO_SORT_COMPARATORS[sortKey]);
}
