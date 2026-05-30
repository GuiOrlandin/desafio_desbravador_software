import type { RepoPaginationProps } from "./types";

function RepoPagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
  loading,
}: RepoPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function goToPage(nextPage: number) {
    if (loading || nextPage < 1 || nextPage > totalPages) return;
    onPageChange(nextPage);
  }

  return (
    <nav className="app-repo-pagination" aria-label="Paginação de repositórios">
      <p className="app-repo-pagination-summary small text-muted mb-2 mb-md-0">
        Página {page} de {totalPages}
      </p>
      <ul className="pagination pagination-sm mb-0 justify-content-center">
        <li className={`page-item ${!hasPrev || loading ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => goToPage(page - 1)}
            disabled={!hasPrev || loading}
            aria-label="Página anterior"
          >
            Anterior
          </button>
        </li>
        <li className={`page-item ${!hasNext || loading ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => goToPage(page + 1)}
            disabled={!hasNext || loading}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default RepoPagination;
