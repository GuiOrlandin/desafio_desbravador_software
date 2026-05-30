import { Link } from "react-router-dom";
import type { ErrorMessageProps } from "./types";

const VARIANT_ICONS: Record<
  NonNullable<ErrorMessageProps["variant"]>,
  string
> = {
  error: "!",
  "rate-limit": "⏱",
  network: "↯",
};

function ErrorMessage({
  title,
  message,
  variant = "error",
  showHomeLink = false,
  onRetry,
  children,
}: ErrorMessageProps) {
  console.log(variant);
  const icon = VARIANT_ICONS[variant];

  return (
    <div
      className={`app-alert app-alert--${variant}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="app-alert-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="app-alert-content">
        {title && <p className="app-alert-title mb-1">{title}</p>}
        <p className="app-alert-message mb-0">{message}</p>
        {(showHomeLink || onRetry || children) && (
          <div className="app-alert-actions mt-3">
            {onRetry && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={onRetry}
              >
                Tentar novamente
              </button>
            )}
            {showHomeLink && (
              <Link to="/" className="btn btn-sm btn-outline-primary">
                Nova busca
              </Link>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
