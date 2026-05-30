import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

function NotFoundPage() {
  return (
    <div className="page-hero">
      <span className="page-hero-badge">404</span>
      <h1 className="page-hero-title">Página não encontrada</h1>
      <p className="page-hero-lead mb-4">
        O endereço acessado não existe. Busque um usuário do GitHub abaixo ou
        volte para a página inicial.
      </p>
      <div className="row justify-content-center g-3">
        <div className="col-12 col-md-9 col-lg-6 text-start">
          <SearchBar />
        </div>
        <div className="col-12 text-center">
          <Link to="/" className="btn btn-outline-primary">
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
