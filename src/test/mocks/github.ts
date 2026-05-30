import type { GitHubRepo, GitHubUser } from "../../api/types";
import type { UserReposPage } from "../../service/github";

export const mockUser: GitHubUser = {
  login: "octocat",
  avatar_url: "https://github.com/octocat.png",
  bio: "GitHub mascot",
  email: "octocat@github.com",
  followers: 1000,
  following: 9,
  public_repos: 2,
};

export const mockRepos: GitHubRepo[] = [
  {
    name: "Hello-World",
    full_name: "octocat/Hello-World",
    description: "My first repo",
    stargazers_count: 1500,
    language: "TypeScript",
    html_url: "https://github.com/octocat/Hello-World",
    forks_count: 100,
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    name: "Spoon-Knife",
    full_name: "octocat/Spoon-Knife",
    description: null,
    stargazers_count: 500,
    language: null,
    html_url: "https://github.com/octocat/Spoon-Knife",
    forks_count: 50,
    updated_at: "2024-02-01T00:00:00Z",
  },
];

export const mockRepo: GitHubRepo = mockRepos[0];

export const mockUserReposPage: UserReposPage = {
  repos: mockRepos,
  page: 1,
  perPage: 20,
  hasNext: false,
  hasPrev: false,
};
