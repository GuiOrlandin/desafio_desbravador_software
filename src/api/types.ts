export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  email: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  forks_count: number;
  updated_at: string;
}

export interface GitHubErrorBody {
  message?: string;
}
