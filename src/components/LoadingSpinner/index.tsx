import type { LoadingSpinnerProps } from "./types";

function LoadingSpinner({ label = "Carregando..." }: LoadingSpinnerProps) {
  return (
    <div className="app-loading text-center" role="status" aria-live="polite">
      <div className="spinner-border mb-3" aria-hidden="true" />
      <p className="text-muted mb-0 fw-medium">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
