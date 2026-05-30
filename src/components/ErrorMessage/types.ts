import type { ReactNode } from "react";
import type { ErrorVariant } from "../../utils/errorDisplay";

export type ErrorMessageProps = {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  showHomeLink?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
};
