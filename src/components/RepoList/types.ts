import type { GitHubRepo } from "../../api/types";
import type { ErrorDisplay } from "../../utils/errorDisplay";
import type { RepoSortKey } from "../../utils/sortRepos";

export type RepoListProps = {
  repos: GitHubRepo[];
  username: string;
  sortKey: RepoSortKey;
  onSortChange: (sortKey: RepoSortKey) => void;
  page: number;
  totalPages: number;
  totalRepos: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
  error?: ErrorDisplay | null;
  onRetryRepos?: () => void;
};
