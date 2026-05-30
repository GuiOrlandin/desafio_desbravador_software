import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import RepoList from "../../components/RepoList";
import UserProfile from "../../components/UserProfile";
import { REPOS_PER_PAGE } from "../../constants/repos";
import { githubUsernameSchema } from "../../schemas/githubUsername";
import { getUser, getUserRepos } from "../../service/github";
import {
  toUserPageError,
  toValidationError,
  type ErrorDisplay,
} from "../../utils/errorDisplay";
import { sortRepos, type RepoSortKey } from "../../utils/sortRepos";
import type { UserPageParams } from "./types";

function UserPage() {
  const { username } = useParams<UserPageParams>();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<RepoSortKey>("stars-desc");

  useEffect(() => {
    setPage(1);
  }, [username]);

  const validationError = useMemo((): ErrorDisplay | null => {
    if (!username) {
      return toValidationError("Nome de usuário inválido.");
    }

    const result = githubUsernameSchema.safeParse(username);
    if (!result.success) {
      return toValidationError(
        result.error.issues[0]?.message ?? "Nome de usuário inválido.",
      );
    }

    return null;
  }, [username]);

  const isValidUsername = validationError === null && !!username;

  const userQuery = useQuery({
    queryKey: ["github-user", username],
    queryFn: () => getUser(username!),
    enabled: isValidUsername,
  });

  const reposQuery = useQuery({
    queryKey: ["github-repos", username, page],
    queryFn: () => getUserRepos(username!, page, REPOS_PER_PAGE),
    enabled: isValidUsername && userQuery.isSuccess,
  });

  const sortedRepos = useMemo(
    () => sortRepos(reposQuery.data?.repos ?? [], sortKey),
    [reposQuery.data?.repos, sortKey],
  );

  const userError = userQuery.error
    ? toUserPageError(userQuery.error, username)
    : null;
  const reposError = reposQuery.error
    ? toUserPageError(reposQuery.error, username)
    : null;

  const user = userQuery.data;
  const hasNext = reposQuery.data?.hasNext ?? false;
  const hasPrev = reposQuery.data?.hasPrev ?? false;

  const totalPages = Math.max(
    1,
    Math.ceil((user?.public_repos ?? 0) / REPOS_PER_PAGE),
  );

  if (validationError) {
    return (
      <ErrorMessage
        title={validationError.title}
        message={validationError.message}
        variant={validationError.variant}
        showHomeLink={validationError.showHomeLink}
      />
    );
  }

  if (userQuery.isLoading) {
    return <LoadingSpinner label={`Carregando perfil de ${username}...`} />;
  }

  if (userError) {
    return (
      <ErrorMessage
        title={userError.title}
        message={userError.message}
        variant={userError.variant}
        showHomeLink={userError.showHomeLink}
        onRetry={() => void userQuery.refetch()}
      />
    );
  }

  if (!user || !username) {
    return (
      <ErrorMessage
        title="Usuário não encontrado"
        message={`Não foi possível carregar o perfil de "@${username ?? ""}".`}
        showHomeLink
      />
    );
  }

  return (
    <div>
      <UserProfile user={user} />
      <RepoList
        repos={sortedRepos}
        username={username}
        sortKey={sortKey}
        onSortChange={setSortKey}
        page={page}
        totalPages={totalPages}
        totalRepos={user.public_repos}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageChange={setPage}
        loading={reposQuery.isFetching}
        error={reposError}
        onRetryRepos={() => void reposQuery.refetch()}
      />
    </div>
  );
}

export default UserPage;
