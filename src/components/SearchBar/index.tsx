import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  searchFormSchema,
  type SearchFormValues,
} from "../../schemas/githubUsername";

function SearchBar() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { username: "" },
  });

  function onSubmit({ username }: SearchFormValues) {
    navigate(`/user/${encodeURIComponent(username)}`);
  }

  const error = errors.username?.message;

  return (
    <div className="app-search-card">
      <form onSubmit={handleSubmit(onSubmit)} className="w-100" noValidate>
        <label htmlFor="github-username" className="form-label fw-semibold">
          Usuário do GitHub
        </label>
        <div className="input-group input-group-lg app-search-input-group">
          <span className="input-group-text bg-white text-muted">@</span>
          <input
            id="github-username"
            type="search"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="octocat"
            autoComplete="off"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "username-error" : undefined}
            {...register("username")}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </div>
        {error && (
          <div id="username-error" className="invalid-feedback d-block mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
