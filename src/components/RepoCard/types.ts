import type { GitHubRepo } from "../../api/types";

export type RepoCardProps = {
  repo: GitHubRepo;
  username: string;
};
