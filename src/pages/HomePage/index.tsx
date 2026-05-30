import SearchBar from "../../components/SearchBar";

function HomePage() {
  return (
    <div className="page-hero">
      <span className="page-hero-badge">Desafio Desbravador</span>
      <h1 className="page-hero-title">Explore perfis no GitHub</h1>
      <p className="page-hero-lead mb-4">
        Busque um usuário para ver avatar, bio, seguidores e repositórios
        ordenados por estrelas.
      </p>
      <div className="row justify-content-center px-2 px-sm-0">
        <div className="col-12 col-md-9 col-lg-6 text-start">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
