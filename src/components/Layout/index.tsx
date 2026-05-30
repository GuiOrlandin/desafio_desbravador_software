import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            GitHub Explorer
          </Link>
        </div>
      </nav>

      <main className="container flex-grow-1 app-main">
        <Outlet />
      </main>

      <footer className="app-footer py-4 mt-auto">
        <div className="container text-center small">
          Desafio Front-End Desbravador Software — dados via{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub REST API
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
