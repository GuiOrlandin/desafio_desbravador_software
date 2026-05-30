import type { UserProfileProps } from "./types";

function UserProfile({ user }: UserProfileProps) {
  return (
    <section className="app-card app-profile-card mb-4 mb-md-5">
      <div className="app-card-body">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-auto text-center">
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.login}`}
              className="profile-avatar rounded-circle img-fluid"
              width={140}
              height={140}
            />
          </div>
          <div className="col">
            <p className="text-muted small mb-1 fw-semibold text-uppercase">
              Perfil
            </p>
            <h1 className="h2 mb-2 fw-bold">@{user.login}</h1>
            <p className="text-muted mb-0">
              {user.bio ?? "Sem biografia informada."}
            </p>
            <p className="text-muted small mt-2 mb-0">
              <span className="fw-semibold">E-mail:</span>{" "}
              {user.email ?? "Não informado"}
            </p>
            <div className="app-stat-grid">
              <div className="app-stat">
                <span className="app-stat-value">
                  {user.followers.toLocaleString("pt-BR")}
                </span>
                <span className="app-stat-label">Seguidores</span>
              </div>
              <div className="app-stat">
                <span className="app-stat-value">
                  {user.following.toLocaleString("pt-BR")}
                </span>
                <span className="app-stat-label">Seguindo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
